#!/usr/bin/env node
/**
 * CrustAI — Smoke Test
 * Tests the core logic (memory + personality + commands) WITHOUT needing
 * Ollama, any chat tokens, or voice dependencies.
 *
 * Usage: npm test
 */

import chalk from 'chalk';
import { MemoryStore } from '../src/memory/store.js';
import { buildSystemPrompt } from '../src/personality/prompt.js';
import { parseCommand, handleCommand } from '../src/core/commands.js';

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(chalk.green(`  ✓ ${label}`));
    passed++;
  } else {
    console.log(chalk.red(`  ✗ ${label}`));
    failed++;
  }
}

console.log(chalk.bold.red('\n🦀 CrustAI — Smoke Tests\n'));

// ── Memory Store ─────────────────────────────────────────────────────────────
console.log(chalk.bold('Memory Store'));

const memory = new MemoryStore({ db_path: ':memory:', max_turns: 5 });
await memory.init();

await memory.addTurn('user1', 'Hello', 'Hi there!');
await memory.addTurn('user1', 'How are you?', 'Great, thanks!');

const history = await memory.getHistory('user1');
assert('stores and retrieves conversation turns', history.length === 4);
assert('first message is from user', history[0].role === 'user');
assert('second message is from assistant', history[1].role === 'assistant');

await memory.rememberFact('user1', 'Prefers concise answers');
const ctx = await memory.getContext('user1');
assert('stores and retrieves facts', ctx.includes('Prefers concise answers'));

await memory.clearHistory('user1');
const cleared = await memory.getHistory('user1');
assert('clears conversation history', cleared.length === 0);

const factCtxAfterClear = await memory.getContext('user1');
assert('facts survive history clear', factCtxAfterClear.includes('Prefers concise answers'));

await memory.clearFacts('user1');
const noFacts = await memory.getContext('user1');
assert('clears facts', noFacts === 'No stored context yet.');

const stats = memory.getStats('user1');
assert('getStats returns turns and facts', 'turns' in stats && 'facts' in stats);

memory.close();

// ── Command Parser ────────────────────────────────────────────────────────────
console.log(chalk.bold('\nCommand Parser'));

assert('returns null for normal text', parseCommand('Hello there') === null);
assert('detects /help',   parseCommand('/help')?.command === '/help');
assert('detects /clear',  parseCommand('/clear')?.command === '/clear');
assert('detects /remember with args', parseCommand('/remember I like cats')?.args === 'I like cats');
assert('is case insensitive', parseCommand('/HELP')?.command === '/help');
assert('handles leading spaces', parseCommand('  /ping  ')?.command === '/ping');

// ── Command Handler ───────────────────────────────────────────────────────────
console.log(chalk.bold('\nCommand Handler'));

const mem2 = new MemoryStore({ db_path: ':memory:' });
await mem2.init();
const ctx2 = { memory: mem2, config: { model: 'llama3.2' }, userId: 'tester' };

const helpReply = await handleCommand({ command: '/help', args: '' }, ctx2);
assert('/help returns commands list', helpReply.includes('/remember'));

const rememberReply = await handleCommand({ command: '/remember', args: 'I love the ocean' }, ctx2);
assert('/remember stores a fact', rememberReply.includes('I love the ocean'));

const factCheck = await mem2.getContext('tester');
assert('/remember fact is persisted in memory', factCheck.includes('I love the ocean'));

const modelReply = await handleCommand({ command: '/model', args: '' }, ctx2);
assert('/model shows model name', modelReply.includes('llama3.2'));

const pingReply = await handleCommand({ command: '/ping', args: '' }, ctx2);
assert('/ping returns pong', pingReply.toLowerCase().includes('pong'));

await handleCommand({ command: '/remember', args: 'test fact' }, ctx2);
const forgetReply = await handleCommand({ command: '/forget', args: '' }, ctx2);
assert('/forget clears facts', forgetReply.includes('ocean'));
mem2.close();

// ── Personality / System Prompt ───────────────────────────────────────────────
console.log(chalk.bold('\nPersonality & System Prompt'));

const personality = {
  name: 'CrustAI',
  system_prompt: 'You are {name}. Memory: {memory_context}. Platform: {channel}. Date: {date}.',
};

const prompt = buildSystemPrompt(personality, {
  memory_context: 'User likes concise answers',
  channel: 'telegram',
  date: '27/04/2026',
  language: 'pt-BR',
});

assert('injects name into prompt',           prompt.includes('CrustAI'));
assert('injects memory_context into prompt', prompt.includes('User likes concise answers'));
assert('injects channel into prompt',        prompt.includes('telegram'));
assert('injects date into prompt',           prompt.includes('27/04/2026'));
assert('no unfilled placeholders remain',    !prompt.includes('{'));

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('');
console.log(chalk.bold(`Results: ${chalk.green(passed + ' passed')}  ${failed > 0 ? chalk.red(failed + ' failed') : chalk.dim('0 failed')}`));

if (failed > 0) {
  console.log(chalk.red('\n✗ Some tests failed.\n'));
  process.exit(1);
} else {
  console.log(chalk.green('\n✓ All tests passed. Core logic is working.\n'));
  console.log(chalk.dim('  Next step: npm run setup → npm start\n'));
}
