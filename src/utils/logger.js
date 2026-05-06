/**
 * CrustAI — Logger
 * Simple structured logger with levels and timestamps.
 */

import chalk from 'chalk';

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

let currentLevel = LEVELS.info;

export function setLogLevel(level) {
  currentLevel = LEVELS[level] ?? LEVELS.info;
}

function ts() {
  return chalk.dim(new Date().toTimeString().slice(0, 8));
}

export const logger = {
  debug: (msg, ...args) => {
    if (currentLevel <= LEVELS.debug) console.log(`${ts()} ${chalk.gray('[debug]')} ${msg}`, ...args);
  },
  info: (msg, ...args) => {
    if (currentLevel <= LEVELS.info) console.log(`${ts()} ${chalk.cyan('[info] ')} ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    if (currentLevel <= LEVELS.warn) console.warn(`${ts()} ${chalk.yellow('[warn] ')} ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    if (currentLevel <= LEVELS.error) console.error(`${ts()} ${chalk.red('[error]')} ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    console.log(`${chalk.green('✓')} ${msg}`, ...args);
  },
  fail: (msg, ...args) => {
    console.log(`${chalk.red('✗')} ${msg}`, ...args);
  },
};
