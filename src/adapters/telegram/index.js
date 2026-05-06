/**
 * CrustAI — Telegram Adapter
 * Uses node-telegram-bot-api with polling (no public URL / webhook needed).
 * Works from behind NAT, VPN, or Tailscale — perfect for local-first setups.
 */

import TelegramBot from 'node-telegram-bot-api';
import { logger } from '../../utils/logger.js';

export class TelegramAdapter {
  constructor(config, handleMessage) {
    this.config = config;
    this.handleMessage = handleMessage;
    // allowed_user_ids: [] means open to anyone — restrict in config for privacy
    this.allowedIds = (config.allowed_user_ids ?? []).map(Number);
  }

  async start() {
    this.bot = new TelegramBot(this.config.token, { polling: true });

    this.bot.on('message', async (msg) => {
      const userId = msg.from?.id;
      const text   = msg.text;
      const chatId = msg.chat.id;

      if (!text || !userId) return;

      // Enforce allowlist if configured
      if (this.allowedIds.length > 0 && !this.allowedIds.includes(userId)) {
        logger.warn(`[Telegram] Rejected unauthorised user: ${userId}`);
        return this.bot.sendMessage(chatId, '🦀 You are not authorised to use this assistant.');
      }

      try {
        await this.bot.sendChatAction(chatId, 'typing');

        const reply = await this.handleMessage({
          userId: String(userId),
          text,
          channel: 'telegram',
        });

        // Telegram supports Markdown — send with fallback to plain text
        try {
          await this.bot.sendMessage(chatId, reply, { parse_mode: 'Markdown' });
        } catch {
          await this.bot.sendMessage(chatId, reply);
        }

      } catch (err) {
        logger.error('[Telegram] Handler error:', err.message);
        await this.bot.sendMessage(chatId,
          '🦀 Something went wrong in the deep sea. Try again?'
        );
      }
    });

    this.bot.on('polling_error', (err) => {
      logger.error('[Telegram] Polling error:', err.message);
    });
  }

  async stop() {
    await this.bot?.stopPolling();
  }
}
