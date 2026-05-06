/**
 * CrustAI — Slack Adapter
 * Uses Bolt for JavaScript with Socket Mode.
 * No public URL or webhook needed — works behind NAT/VPN.
 */

import { App } from '@slack/bolt';
import { logger } from '../../utils/logger.js';

export class SlackAdapter {
  constructor(config, handleMessage) {
    this.config = config;
    this.handleMessage = handleMessage;
  }

  async start() {
    this.app = new App({
      token:     this.config.bot_token,
      appToken:  this.config.app_token,
      socketMode: true,
      // Silence Bolt's own logger — we use ours
      logger: {
        debug: () => {}, info: () => {}, warn: logger.warn, error: logger.error,
        setLevel: () => {}, getLevel: () => 'warn',
      },
    });

    // Direct messages
    this.app.message(async ({ message, say }) => {
      // Ignore bot messages, edits, and deletions
      if (message.subtype || message.bot_id) return;

      try {
        const reply = await this.handleMessage({
          userId:  message.user,
          text:    message.text,
          channel: 'slack',
        });
        await say(reply);
      } catch (err) {
        logger.error('[Slack] DM error:', err.message);
        await say('🦀 Something went sideways in the current. Try again?');
      }
    });

    // @mentions in channels
    this.app.event('app_mention', async ({ event, say }) => {
      const text = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();
      if (!text) return;

      try {
        const reply = await this.handleMessage({
          userId:  event.user,
          text,
          channel: 'slack',
        });
        // Reply in thread to keep channels clean
        await say({ text: reply, thread_ts: event.ts });
      } catch (err) {
        logger.error('[Slack] Mention error:', err.message);
        await say({ text: '🦀 Something went sideways. Try again?', thread_ts: event.ts });
      }
    });

    await this.app.start();
    logger.success('Slack ready');
  }

  async stop() {
    await this.app?.stop();
  }
}
