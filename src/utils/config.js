/**
 * CrustAI — Config Loader
 * Reads config/config.yml and validates required fields.
 * Gives clear, actionable error messages instead of cryptic crashes.
 */

import { readFileSync, existsSync } from 'fs';
import { parse } from 'yaml';
import chalk from 'chalk';

const CONFIG_PATH = './config/config.yml';
const EXAMPLE_PATH = './config/config.example.yml';

export function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(chalk.red('\n✗ config/config.yml not found.'));
    console.error(chalk.dim('  Run: npm run setup\n'));
    process.exit(1);
  }

  let config;
  try {
    config = parse(readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    console.error(chalk.red(`\n✗ Failed to parse config.yml: ${err.message}`));
    console.error(chalk.dim('  Check for YAML syntax errors.\n'));
    process.exit(1);
  }

  const errors = [];

  // Validate platform tokens when enabled
  if (config.telegram?.enabled && !config.telegram.token) {
    errors.push('telegram.token is required when telegram is enabled');
  }
  if (config.discord?.enabled && !config.discord.token) {
    errors.push('discord.token is required when discord is enabled');
  }
  if (config.slack?.enabled && !config.slack.bot_token) {
    errors.push('slack.bot_token is required when slack is enabled');
  }
  if (config.slack?.enabled && !config.slack.app_token) {
    errors.push('slack.app_token is required when slack is enabled');
  }

  if (errors.length > 0) {
    console.error(chalk.red('\n✗ Configuration errors:'));
    errors.forEach((e) => console.error(chalk.red(`  • ${e}`)));
    console.error(chalk.dim('\n  Edit config/config.yml to fix these.\n'));
    process.exit(1);
  }

  // Apply sensible defaults
  config.model = config.model || 'llama3.2';
  config.language = config.language || 'pt-BR';
  config.memory = config.memory || {};
  config.memory.db_path = config.memory.db_path || './data/memory.db';
  config.memory.max_turns = config.memory.max_turns ?? 20;
  config.voice = config.voice || {};
  config.voice.port = config.voice.port ?? 8765;
  config.server = config.server || {};
  config.server.port = config.server.port ?? 3000;

  return config;
}

export function loadPersonality(config) {
  const path = config.personality_file || './config/personality.yml';
  if (!existsSync(path)) {
    console.error(chalk.red(`\n✗ Personality file not found: ${path}\n`));
    process.exit(1);
  }
  return parse(readFileSync(path, 'utf8'));
}
