#!/usr/bin/env node
/**
 * CrustAI — Platform Connection Helper
 * Usage: npm run connect <platform>
 * Example: npm run connect telegram
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse, stringify } from 'yaml';

const platform = process.argv[2]?.toLowerCase();

const CONFIG_PATH = './config/config.yml';

if (!existsSync(CONFIG_PATH)) {
  console.error(chalk.red('✗ config/config.yml not found. Run: npm run setup'));
  process.exit(1);
}

const config = parse(readFileSync(CONFIG_PATH, 'utf8'));

function save() {
  writeFileSync(CONFIG_PATH, stringify(config));
  console.log(chalk.green('\n✓ config/config.yml updated.'));
}

async function connectTelegram() {
  console.log(chalk.bold('\n🦀 Connecting Telegram\n'));
  console.log('1. Open Telegram and talk to ' + chalk.cyan('@BotFather'));
  console.log('2. Send /newbot and follow the steps');
  console.log('3. Copy the token (looks like 1234567890:ABCdef...)\n');

  const { token, userId } = await inquirer.prompt([
    { type: 'input', name: 'token',  message: 'Bot token:',    validate: (v) => v.includes(':') || 'Invalid token format' },
    { type: 'input', name: 'userId', message: 'Your Telegram user ID (leave blank to allow anyone):' },
  ]);

  config.telegram = config.telegram || {};
  config.telegram.enabled = true;
  config.telegram.token = token.trim();
  config.telegram.allowed_user_ids = userId ? [parseInt(userId)] : [];
  save();
  console.log(chalk.dim('\nTip: Find your user ID by talking to @userinfobot on Telegram.'));
}

async function connectDiscord() {
  console.log(chalk.bold('\n🦀 Connecting Discord\n'));
  console.log('1. Go to ' + chalk.cyan('https://discord.com/developers/applications'));
  console.log('2. New Application → Bot → Reset Token → copy token');
  console.log('3. Enable: Message Content Intent, Server Members Intent');
  console.log('4. Invite the bot to your private server\n');

  const { token, guildId, channelId } = await inquirer.prompt([
    { type: 'input', name: 'token',     message: 'Bot token:',              validate: (v) => v.length > 10 || 'Required' },
    { type: 'input', name: 'guildId',   message: 'Server (Guild) ID:',      validate: (v) => v.length > 0 || 'Required' },
    { type: 'input', name: 'channelId', message: 'Channel ID (optional, limits CrustAI to one channel):' },
  ]);

  config.discord = config.discord || {};
  config.discord.enabled = true;
  config.discord.token = token.trim();
  config.discord.guild_id = guildId.trim();
  if (channelId) config.discord.channel_id = channelId.trim();
  save();
}

async function connectSlack() {
  console.log(chalk.bold('\n🦀 Connecting Slack\n'));
  console.log('1. Go to ' + chalk.cyan('https://api.slack.com/apps') + ' → Create App → From Scratch');
  console.log('2. Settings → Socket Mode → Enable → generate App Token (xapp-)');
  console.log('3. OAuth & Permissions → Add scopes: chat:write, im:history, app_mentions:read');
  console.log('4. Event Subscriptions → Enable → Subscribe to: message.im, app_mention');
  console.log('5. Install App → copy Bot Token (xoxb-)\n');

  const { botToken, appToken } = await inquirer.prompt([
    { type: 'input', name: 'botToken', message: 'Bot token (xoxb-...):',  validate: (v) => v.startsWith('xoxb-') || 'Must start with xoxb-' },
    { type: 'input', name: 'appToken', message: 'App token (xapp-...):',  validate: (v) => v.startsWith('xapp-') || 'Must start with xapp-' },
  ]);

  config.slack = config.slack || {};
  config.slack.enabled = true;
  config.slack.bot_token = botToken.trim();
  config.slack.app_token = appToken.trim();
  save();
}

async function connectWhatsApp() {
  console.log(chalk.bold('\n🦀 Connecting WhatsApp\n'));
  console.log(chalk.yellow('⚠️  Use a secondary WhatsApp number for safety.'));
  console.log('   WhatsApp does not officially support bots.\n');

  const { confirmed } = await inquirer.prompt([
    { type: 'confirm', name: 'confirmed', message: 'I understand and want to proceed', default: false },
  ]);

  if (!confirmed) { console.log('Cancelled.'); return; }

  config.whatsapp = config.whatsapp || {};
  config.whatsapp.enabled = true;
  config.whatsapp.session_path = './data/whatsapp-session';
  save();

  console.log(chalk.green('\n✓ WhatsApp enabled.'));
  console.log(chalk.dim('  A QR code will appear when you run: npm start'));
  console.log(chalk.dim('  Scan it with WhatsApp → Linked Devices → Link a Device'));
}

const handlers = {
  telegram: connectTelegram,
  discord:  connectDiscord,
  slack:    connectSlack,
  whatsapp: connectWhatsApp,
};

if (!platform || !handlers[platform]) {
  console.log(chalk.bold('\n🦀 CrustAI — Connect a platform\n'));
  console.log('Usage: npm run connect <platform>\n');
  console.log('Available platforms:');
  Object.keys(handlers).forEach((p) => console.log(`  ${chalk.cyan(p)}`));
  console.log('');
  process.exit(0);
}

handlers[platform]().catch((err) => {
  console.error(chalk.red('\nError:'), err.message);
  process.exit(1);
});
