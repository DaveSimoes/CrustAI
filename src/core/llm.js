/**
 * CrustAI — Core LLM Client
 * Wraps the Ollama API. Swap models without touching anything else.
 */

export class LLMClient {
  constructor(config) {
    this.url = config.ollama_url || 'http://localhost:11434';
    this.model = config.model || 'llama3.2';
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.max_tokens ?? 1024;
  }

  async chat(messages, systemPrompt) {
    const payload = {
      model: this.model,
      stream: false,
      options: {
        temperature: this.temperature,
        num_predict: this.maxTokens,
      },
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    };

    const res = await fetch(`${this.url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.message?.content ?? '';
  }

  async isAvailable() {
    try {
      const res = await fetch(`${this.url}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async listModels() {
    const res = await fetch(`${this.url}/api/tags`);
    const data = await res.json();
    return data.models?.map((m) => m.name) ?? [];
  }
}
