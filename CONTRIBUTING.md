# Contributing to CrustAI 🦀

Thank you for your interest! CrustAI is intentionally modular — adding a new chat platform or voice engine is just one file.

## Getting started

```bash
git clone https://github.com/your-username/crustai.git
cd crustai
npm install
cp config/config.example.yml config/config.yml
npm run dev   # hot-reload development mode
```

## Adding a new chat adapter

Each adapter lives in `src/adapters/<platform>/index.js` and exports a class with a `start()` method. It receives a `handleMessage` function as its second constructor argument.

```js
export class MyPlatformAdapter {
  constructor(config, handleMessage) {
    this.config = config;
    this.handleMessage = handleMessage;
  }

  async start() {
    // Connect to platform SDK
    // On each incoming message:
    const reply = await this.handleMessage({
      userId: 'unique-user-id',
      text: 'the message text',
      channel: 'myplatform',
    });
    // Send reply back via platform SDK
  }
}
```

Then register it in `src/core/index.js`.

## Project structure

```
src/
├── core/           # LLM client + main orchestrator
├── adapters/       # One folder per platform
├── voice/          # STT, TTS, WebSocket server
├── memory/         # SQLite + ChromaDB
└── personality/    # System prompt builder
```

## Guidelines

- Keep adapters self-contained
- No adapter should import from another adapter
- All user data stays local — never add cloud calls without an opt-in flag
- Write in ES modules (`import`/`export`)
- Add a brief JSDoc comment at the top of each file

## Opening a PR

1. Fork the repo and create a feature branch
2. Keep changes focused — one feature per PR
3. Update `docs/` if your change affects configuration or setup
4. Open the PR with a clear description

All contributions are welcome, from tiny bug fixes to new platform adapters! 🦀
