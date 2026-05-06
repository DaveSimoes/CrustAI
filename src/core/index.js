/**
 * CrustAI — Main Orchestrator
 * Boots all enabled adapters, the voice server, and the REST API.
 */

import chalk from 'chalk';
import { loadConfig, loadPersonality } from '../utils/config.js';
import { logger, setLogLevel } from '../utils/logger.js';
import { LLMClient } from './llm.js';
import { MemoryStore } from '../memory/store.js';
import { buildSystemPrompt } from '../personality/prompt.js';
import { parseCommand, handleCommand } from './commands.js';

const ASCII = chalk.red(`
  ██████╗██████╗ ██╗   ██╗███████╗████████╗ █████╗ ██╗
 ██╔════╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔══██╗██║
 ██║     ██████╔╝██║   ██║███████╗   ██║   ███████║██║
 ██║     ██╔══██╗██║   ██║╚════██║   ██║   ██╔══██║██║
 ╚██████╗██║  ██║╚██████╔╝███████║   ██║   ██║  ██║██║
  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝
`);

async function main() {
  console.log(ASCII);
  console.log(chalk.dim('  Your private, local AI assistant. Always on. Always yours.\n'));

  const config = loadConfig();
  const personality = loadPersonality(config);
  setLogLevel(config.server?.log_level || 'info');

  // ── Core services ──────────────────────────────────────────────────────────
  const llm = new LLMClient(config);
  const memory = new MemoryStore(config.memory);

  const ollamaOk = await llm.isAvailable();
  if (!ollamaOk) {
    logger.fail('Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }
  logger.success(`Ollama connected     (${config.model})`);

  await memory.init();

  // ── Central message handler (used by ALL adapters) ─────────────────────────
  async function handleMessage({ userId, text, channel }) {
    // 1. Check for slash commands first
    const parsed = parseCommand(text);
    if (parsed) {
      return handleCommand(parsed, { memory, config, userId });
    }

    // 2. Build context and call LLM
    const [history, memCtx] = await Promise.all([
      memory.getHistory(userId),
      memory.getContext(userId),
    ]);

    const systemPrompt = buildSystemPrompt(personality, {
      memory_context: memCtx,
      channel,
      date: new Date().toLocaleDateString(config.language || 'pt-BR'),
      language: config.language,
    });

    const messages = [...history, { role: 'user', content: text }];
    const reply = await llm.chat(messages, systemPrompt);

    // 3. Persist the turn
    await memory.addTurn(userId, text, reply);

    return reply;
  }

  // ── Boot enabled adapters ──────────────────────────────────────────────────
  const adapters = [];

  if (config.whatsapp?.enabled) {
    const { WhatsAppAdapter } = await import('../adapters/whatsapp/index.js');
    const wa = new WhatsAppAdapter(config.whatsapp, handleMessage);
    await wa.start();
    adapters.push('WhatsApp');
  }

  if (config.telegram?.enabled) {
    const { TelegramAdapter } = await import('../adapters/telegram/index.js');
    const tg = new TelegramAdapter(config.telegram, handleMessage);
    await tg.start();
    logger.success('Telegram ready');
    adapters.push('Telegram');
  }

  if (config.discord?.enabled) {
    const { DiscordAdapter } = await import('../adapters/discord/index.js');
    const dc = new DiscordAdapter(config.discord, handleMessage);
    await dc.start();
    logger.success('Discord ready');
    adapters.push('Discord');
  }

  if (config.slack?.enabled) {
    const { SlackAdapter } = await import('../adapters/slack/index.js');
    const sl = new SlackAdapter(config.slack, handleMessage);
    await sl.start();
    logger.success('Slack ready');
    adapters.push('Slack');
  }

  if (config.voice?.enabled) {
    const { VoiceServer } = await import('../voice/server.js');
    const vs = new VoiceServer(config.voice, handleMessage);
    await vs.start();
    logger.success(`Voice engine ready   (ws://localhost:${config.voice.port}/voice)`);
    adapters.push('Voice');
  }

  // ── REST API (always on) ───────────────────────────────────────────────────
  const { startApiServer } = await import('../api/server.js');
  await startApiServer({ config, handleMessage, memory });
  logger.success(`REST API ready       (http://localhost:${config.server.port})`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('');
  console.log(chalk.bold.red('🦀 CrustAI is ready. Your shell awaits.'));
  console.log(chalk.dim(`   Active: ${adapters.join(', ') || 'REST API only'}\n`));

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  process.on('SIGINT', () => {
    console.log(chalk.dim('\n🦀 CrustAI shutting down gracefully...'));
    memory.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(chalk.red('\nFatal error:'), err.message);
  console.error(chalk.dim(err.stack));
  process.exit(1);
});
