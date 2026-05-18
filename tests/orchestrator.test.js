/**
 * CrustAI - Orchestrator Unit Tests
 * Covers the central message handler used by chat adapters and the REST API.
 */

import { describe, expect, it, vi } from 'vitest';
import { createMessageHandler } from '../src/core/index.js';

function createHarness() {
  const memory = {
    getHistory: vi.fn().mockResolvedValue([
      { role: 'user', content: 'previous question' },
      { role: 'assistant', content: 'previous reply' },
    ]),
    getContext: vi.fn().mockResolvedValue('Prefers concise answers.'),
    addTurn: vi.fn().mockResolvedValue(undefined),
    rememberFact: vi.fn().mockResolvedValue(undefined),
    clearFacts: vi.fn().mockResolvedValue(undefined),
    clearHistory: vi.fn().mockResolvedValue(undefined),
  };

  const llm = {
    chat: vi.fn().mockResolvedValue('adapter reply'),
  };

  const handler = createMessageHandler({
    memory,
    llm,
    config: { language: 'en-US', model: 'llama3.2' },
    personality: {
      name: 'CrustAI',
      system_prompt: [
        'Assistant: {name}',
        'Channel: {channel}',
        'Memory: {memory_context}',
        'Date: {date}',
        'Language: {language}',
      ].join('\n'),
    },
    now: () => new Date('2026-05-18T12:00:00Z'),
  });

  return { handler, memory, llm };
}

describe('createMessageHandler', () => {
  it('routes adapter messages through the LLM with channel context', async () => {
    const { handler, memory, llm } = createHarness();

    const reply = await handler({
      userId: 'user-1',
      text: 'hello from adapter',
      channel: 'telegram',
    });

    expect(reply).toBe('adapter reply');
    expect(memory.getHistory).toHaveBeenCalledWith('user-1');
    expect(memory.getContext).toHaveBeenCalledWith('user-1');
    expect(llm.chat).toHaveBeenCalledWith(
      [
        { role: 'user', content: 'previous question' },
        { role: 'assistant', content: 'previous reply' },
        { role: 'user', content: 'hello from adapter' },
      ],
      expect.stringContaining('Channel: telegram'),
    );
    expect(llm.chat.mock.calls[0][1]).toContain('Memory: Prefers concise answers.');
    expect(memory.addTurn).toHaveBeenCalledWith('user-1', 'hello from adapter', 'adapter reply');
  });

  it('returns a helpful error for unknown slash commands', async () => {
    const { handler, memory, llm } = createHarness();

    const reply = await handler({
      userId: 'user-1',
      text: '/unknown',
      channel: 'rest',
    });

    expect(reply).toContain('Unknown command');
    expect(reply).toContain('/help');
    expect(llm.chat).not.toHaveBeenCalled();
    expect(memory.getHistory).not.toHaveBeenCalled();
    expect(memory.addTurn).not.toHaveBeenCalled();
  });

  it('calls the memory store when /remember is used', async () => {
    const { handler, memory, llm } = createHarness();

    const reply = await handler({
      userId: 'user-2',
      text: '/remember prefers short replies',
      channel: 'discord',
    });

    expect(memory.rememberFact).toHaveBeenCalledWith('user-2', 'prefers short replies');
    expect(reply).toContain('prefers short replies');
    expect(llm.chat).not.toHaveBeenCalled();
    expect(memory.addTurn).not.toHaveBeenCalled();
  });
});
