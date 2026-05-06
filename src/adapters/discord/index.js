/**
 * CrustAI — Discord Adapter
 * Responds to DMs and @mentions in your private server using Discord.js v14.
 */

import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js';
import { logger } from '../../utils/logger.js';

// Discord's hard message limit
const DISCORD_CHAR_LIMIT = 2000;

export class DiscordAdapter {
  constructor(config, handleMessage) {
    this.config = config;
    this.handleMessage = handleMessage;
  }

  async start() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });

    this.client.once(Events.ClientReady, (c) => {
      logger.success(`Discord ready        (@${c.user.tag})`);
      c.user.setActivity('the deep ocean 🦀', { type: ActivityType.Watching });
    });

    this.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;

      const isDM = !message.guild;
      const isMention = message.mentions.has(this.client.user);
      const isAllowedChannel =
        !this.config.channel_id || message.channel.id === this.config.channel_id;

      if (!isDM && !isMention && !isAllowedChannel) return;

      // Strip the @mention prefix if present
      const text = message.content.replace(/<@!?\d+>/g, '').trim();
      if (!text) return;

      try {
        await message.channel.sendTyping();

        const reply = await this.handleMessage({
          userId: message.author.id,
          text,
          channel: 'discord',
        });

        // Split replies that exceed Discord's 2000 char limit
        if (reply.length <= DISCORD_CHAR_LIMIT) {
          await message.reply({ content: reply, allowedMentions: { repliedUser: false } });
        } else {
          const chunks = reply.match(/[\s\S]{1,1900}/g) ?? [];
          for (const chunk of chunks) {
            await message.channel.send(chunk);
          }
        }

      } catch (err) {
        logger.error('[Discord] Handler error:', err.message);
        await message.reply('🦀 Something stirred in the deep. Try again?');
      }
    });

    await this.client.login(this.config.token);
  }

  async stop() {
    await this.client?.destroy();
  }
}
