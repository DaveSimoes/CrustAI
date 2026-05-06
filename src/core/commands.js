/**
 * CrustAI — Command Parser
 * Intercepts special commands before they reach the LLM.
 *
 * Supported commands:
 *   /help              — show available commands
 *   /remember <fact>   — store a fact in long-term memory
 *   /forget            — clear all stored facts
 *   /clear             — clear conversation history
 *   /model             — show current model
 *   /ping              — health check
 */

export const COMMANDS = {
  HELP: '/help',
  REMEMBER: '/remember',
  FORGET: '/forget',
  CLEAR: '/clear',
  MODEL: '/model',
  PING: '/ping',
};

/**
 * Returns { command, args } if the message is a command, or null otherwise.
 */
export function parseCommand(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith('/')) return null;

  const [cmd, ...rest] = trimmed.split(/\s+/);
  return { command: cmd.toLowerCase(), args: rest.join(' ') };
}

/**
 * Handles a command and returns a reply string, or null if not a command.
 */
export async function handleCommand({ command, args }, { memory, config, userId }) {
  switch (command) {
    case COMMANDS.HELP:
      return [
        '🦀 *CrustAI Commands*',
        '',
        '`/help` — show this message',
        '`/remember <fact>` — store something in my long-term memory',
        '`/forget` — erase all stored facts about you',
        '`/clear` — clear our conversation history',
        '`/model` — show which AI model I am using',
        '`/ping` — check if I am alive',
      ].join('\n');

    case COMMANDS.REMEMBER:
      if (!args) return '🦀 Tell me what to remember. Example: `/remember I prefer concise answers`';
      await memory.rememberFact(userId, args);
      return `🦀 Stored in the deep: *${args}*`;

    case COMMANDS.FORGET:
      await memory.clearFacts(userId);
      return '🦀 All stored facts about you have been released to the ocean.';

    case COMMANDS.CLEAR:
      await memory.clearHistory(userId);
      return '🦀 Conversation history cleared. Fresh water, fresh start.';

    case COMMANDS.MODEL:
      return `🦀 Currently running: \`${config.model}\``;

    case COMMANDS.PING:
      return '🦀 Pong. Claws operational.';

    default:
      return `🦀 Unknown command: \`${command}\`. Try \`/help\`.`;
  }
}
