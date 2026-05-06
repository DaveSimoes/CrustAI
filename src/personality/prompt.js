/**
 * CrustAI — Personality & System Prompt Builder
 * Builds the system prompt by injecting runtime context variables
 * into the template defined in config/personality.yml.
 */

export function buildSystemPrompt(personality, context) {
  let prompt = personality.system_prompt ?? defaultSystemPrompt(personality);

  // Always inject the assistant's name from personality config
  const fullContext = {
    name: personality.name ?? 'CrustAI',
    ...context,
  };

  // Replace all {variable} placeholders
  for (const [key, value] of Object.entries(fullContext)) {
    prompt = prompt.replaceAll(`{${key}}`, value ?? '');
  }

  // Safety net: remove any remaining unfilled placeholders
  prompt = prompt.replace(/\{[a-z_]+\}/g, '');

  return prompt.trim();
}

function defaultSystemPrompt(personality) {
  const quirks = (personality.quirks ?? []).map((q) => `- ${q}`).join('\n');

  return `You are {name}, a private, local-first AI assistant running entirely on the user's own hardware.

Personality traits:
${quirks}

Context:
- Stored memory: {memory_context}
- Current platform: {channel}
- Today's date: {date}
- User language: {language}

Always respond in the user's language. Be concise by default.`;
}
