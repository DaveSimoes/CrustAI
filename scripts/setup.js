#!/usr/bin/env node
/**
 * CrustAI — Interactive Setup Wizard
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { parse, stringify } from 'yaml';

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
  console.log(chalk.bold('  🦀 Welcome to CrustAI! Let\'s get your claws ready.\n'));

  // Check Ollama
  const spinner = ora('Checking Ollama...').start();
  try {
    execSync('ollama list', { stdio: 'ignore' });
    spinner.succeed('Ollama is running');
  } catch {
    spinner.fail('Ollama not found. Install it from https://ollama.com and run again.');
    process.exit(1);
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Which AI model would you like to use?',
      choices: [
        { name: 'llama3.2   — recommended, fast, 4 GB', value: 'llama3.2' },
        { name: 'mistral    — sharp reasoning, 4 GB', value: 'mistral' },
        { name: 'phi3       — lightweight, 2 GB', value: 'phi3' },
        { name: 'gemma2     — great at conversation, 5 GB', value: 'gemma2' },
      ],
    },
    {
      type: 'list',
      name: 'language',
      message: 'Preferred language for the assistant?',
      choices: [
        { name: 'Português (Brasil)', value: 'pt-BR' },
        { name: 'Português (Portugal)', value: 'pt-PT' },
        { name: 'English', value: 'en' },
        { name: 'Español', value: 'es' },
      ],
    },
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Which chat platforms do you want to connect?',
      choices: ['WhatsApp', 'Telegram', 'Discord', 'Slack'],
    },
    {
      type: 'confirm',
      name: 'voice',
      message: 'Enable voice (speech-to-text + text-to-speech)?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'remote',
      message: 'Enable remote access via Tailscale (access from phone outside home)?',
      default: false,
    },
  ]);

  // Build config from template
  const config = parse(readFileSync('./config/config.example.yml', 'utf8'));
  config.model = answers.model;
  config.language = answers.language;
  config.whatsapp.enabled = answers.platforms.includes('WhatsApp');
  config.telegram.enabled = answers.platforms.includes('Telegram');
  config.discord.enabled = answers.platforms.includes('Discord');
  config.slack.enabled = answers.platforms.includes('Slack');
  config.voice.enabled = answers.voice;
  config.remote.enabled = answers.remote;

  writeFileSync('./config/config.yml', stringify(config));

  // Pull model
  const pullSpinner = ora(`Pulling ${answers.model}...`).start();
  try {
    execSync(`ollama pull ${answers.model}`, { stdio: 'ignore' });
    pullSpinner.succeed(`Model ${answers.model} ready`);
  } catch {
    pullSpinner.warn(`Could not pull model automatically. Run: ollama pull ${answers.model}`);
  }

  console.log('\n' + chalk.green('✓ Config written to config/config.yml'));

  if (answers.platforms.includes('Telegram')) {
    console.log(chalk.yellow('\n  Telegram: Add your bot token to config/config.yml'));
    console.log(chalk.dim('  Get one at: https://t.me/BotFather → /newbot'));
  }
  if (answers.platforms.includes('Discord')) {
    console.log(chalk.yellow('\n  Discord: Add your bot token to config/config.yml'));
    console.log(chalk.dim('  Create one at: https://discord.com/developers/applications'));
  }
  if (answers.platforms.includes('Slack')) {
    console.log(chalk.yellow('\n  Slack: Add bot + app tokens to config/config.yml'));
    console.log(chalk.dim('  Create one at: https://api.slack.com/apps'));
  }

  console.log('\n' + chalk.bold.red('🦀 Ready! Run: npm start\n'));
}

main().catch(console.error);
