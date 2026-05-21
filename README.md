<div align="center">

# 🦀 CrustAI

### Your AI Assistant. Your Machine. Your Rules.

**100% Private · Runs Locally · Multi-Platform · Zero Cloud**

[![npm version](https://img.shields.io/npm/v/crustai.svg)](https://www.npmjs.com/package/crustai)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-brightgreen?logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-ff69b4)](https://github.com/DaveSimoes/CrustAI/blob/main/CONTRIBUTING.md)
[![Self-Hosted](https://img.shields.io/badge/Self--Hosted-100%25-blue)](https://github.com/DaveSimoes/CrustAI)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-orange)](https://ollama.ai)

[![Windows](https://img.shields.io/badge/Windows-supported-blue)](#)
[![macOS](https://img.shields.io/badge/macOS-supported-blue)](#)
[![Linux](https://img.shields.io/badge/Linux-supported-blue)](#)

---

> **Chat with your own AI on Telegram, Discord, WhatsApp, and Slack — no data ever leaves your machine.**

</div>

---

## Get Started

```bash
git clone https://github.com/DaveSimoes/CrustAI.git
cd CrustAI && npm install && npm start
```
<div align="center">
  
**AI assistant running 100% locally — chat on Telegram, fully offline.** 
![CrustAI Live Demo](demo/chat.gif)

<img width="600" height="307" alt="new_video_real_chatonline-video-cutter com-ezgif com-optimize" src="https://github.com/user-attachments/assets/699988d8-187a-4b91-82d8-70b73bef9085" />

</div>

---

## Why CrustAI?

Every AI assistant you use today sends your conversations to a cloud server. Your questions, your context, your data — all stored externally.

**CrustAI is different.** It runs entirely on your own machine using [Ollama](https://ollama.ai), meaning:

| Without CrustAI | With CrustAI |
|---|---|
| Conversations logged on cloud servers | Conversations stay on **your machine** |
| Data used to train external models | Zero data collection, ever |
| Requires paid API keys | 100% free, uses local models |
| One platform (e.g., only ChatGPT web) | Works on Telegram, Discord, WhatsApp, Slack |
| Internet required | Works fully **offline** |

---

## Key Features

|  |  |
|---|---|
| 🔒 **100% Private** | Every message stays on your device. No telemetry, no external APIs, no logs |
| 🧠 **Powered by Ollama** | Use llama3.2, mistral, phi3, tinyllama and any model you choose |
| 📱 **4 Platforms, 1 Bot** | Connect to Telegram, Discord, WhatsApp, and Slack simultaneously |
| 🧬 **Long-Term Memory** | Your assistant remembers facts about you across sessions |
| 🗣️ **Voice Support** | Speak and listen — fully offline voice mode (pt-BR) |
| ⚡ **REST API** | Integrate CrustAI into your own tools and workflows |
| 🎭 **Personality Config** | Give your assistant a custom name, tone, and identity |
| 🐳 **Docker Ready** | One-command deployment for servers and home labs |
| 🌐 **Bilingual** | Full English + Portuguese support out of the box |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20.0
- [Ollama](https://ollama.ai) installed and running
- A platform token (e.g., Telegram Bot Token from [@BotFather](https://t.me/botfather))

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/DaveSimoes/CrustAI.git
cd CrustAI

# 2. Install dependencies
npm install

# 3. Start Ollama and pull a model
ollama serve
ollama pull tinyllama     # lightweight — 600MB, works on any machine
# or
ollama pull llama3.2      # more powerful — 2GB, recommended 8GB RAM

# 4. Configure
cp config/config.example.yml config/config.yml
# Edit config/config.yml with your platform tokens

# 5. Launch CrustAI
npm start
```

---

## Configuration

Edit `config/config.yml`:

```yaml
model: tinyllama           # or llama3.2, phi3, mistral...
ollama_url: http://localhost:11434
language: en               # or pt-BR

telegram:
  enabled: true
  token: YOUR_BOT_TOKEN_HERE
  allowed_user_ids: []     # leave empty to allow all users

discord:
  enabled: false
  token: ""

whatsapp:
  enabled: false

slack:
  enabled: false

voice:
  enabled: false
  port: 8765
```

---

## Available Commands

| Command | Description |
|---|---|
| `/ping` | Check if the bot is alive |
| `/help` | Show all available commands |
| `/model` | Display which AI model is currently running |
| `/remember <fact>` | Store a fact in long-term memory |
| `/forget` | Erase all stored facts |
| `/clear` | Clear conversation history |

---

## Architecture

```
Messaging Platforms (Telegram / Discord / WhatsApp / Slack)
                        │
                        ▼
             ┌─────────────────────┐
             │  Message Orchestrator│
             └────────┬────────────┘
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
    ┌─────────────┐      ┌──────────────┐
    │ Ollama LLM  │      │ Memory Store │
    │  (local)    │      │  (sql.js)    │
    └─────────────┘      └──────────────┘
           │                     │
           └──────────┬──────────┘
                      ▼
               ┌─────────────┐
               │  REST API   │
               │  (Fastify)  │
               └─────────────┘
```

**Design principle:** Adapter boundaries make it trivial to add new messaging platforms without touching the core conversation logic.

---

## How It Works

1. **Adapters** — Each platform (Telegram, Discord, WhatsApp, Slack) has its own isolated adapter. Messages are normalized into a unified format before reaching the orchestrator.
2. **Orchestrator** — Receives messages, applies personality config, queries the LLM, and manages conversation context.
3. **Ollama LLM** — Runs any compatible model locally. No network calls. No rate limits. No billing.
4. **Memory Store** — Persists user-defined facts in a local SQLite database, available across sessions.
5. **REST API** — Exposes endpoints for integrating CrustAI into custom tools, automations, and dashboards.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Ollama** | Local LLM inference engine |
| **node-telegram-bot-api** | Telegram integration |
| **@whiskeysockets/baileys** | WhatsApp integration |
| **discord.js** | Discord integration |
| **@slack/bolt** | Slack integration |
| **Fastify** | REST API server |
| **sql.js** | Embedded database for memory |
| **yaml** | Configuration management |

---

## Project Structure

```
crustai/
├── src/
│   ├── core/
│   │   ├── index.js          # Main orchestrator
│   │   ├── llm.js            # Ollama LLM client
│   │   └── commands.js       # Command handler
│   ├── adapters/
│   │   ├── telegram/         # Telegram bot
│   │   ├── discord/          # Discord bot
│   │   ├── whatsapp/         # WhatsApp bot
│   │   └── slack/            # Slack bot
│   ├── memory/
│   │   └── store.js          # Long-term memory (SQLite)
│   ├── personality/
│   │   └── prompt.js         # System prompt builder
│   ├── voice/
│   │   └── server.js         # Offline voice WebSocket server
│   └── api/
│       └── server.js         # REST API
├── config/
│   ├── config.yml            # Your config (git-ignored)
│   ├── config.example.yml    # Template
│   └── personality.yml       # Assistant personality
├── demo/
│   ├── terminal.gif
│   ├── ping.gif
│   └── chat.gif
└── data/                     # Local database (git-ignored)
```

---

## Privacy First

CrustAI was built with privacy as its core principle — not as a feature, but as a hard technical constraint:

- ✅ All conversations stay on **your machine**
- ✅ No API keys sent to external AI providers
- ✅ No telemetry, usage tracking, or analytics
- ✅ No accounts, no sign-up, no terms-of-service surprise
- ✅ Fully open source — inspect every single line
- ✅ Your data. Your models. Your rules.

---

## Supported Models (via Ollama)

| Model | Size | Best For |
|---|---|---|
| `tinyllama` | ~600MB | Low-end machines, quick replies |
| `phi3` | ~2GB | Balanced performance |
| `llama3.2` | ~2GB | General purpose, highly capable |
| `mistral` | ~4GB | Strong reasoning and coding |
| `llama3` | ~4GB | High quality conversations |

Any model available on [ollama.ai](https://ollama.ai/library) can be used.

---

## Roadmap

- [x] Telegram integration
- [x] Discord integration
- [x] WhatsApp integration
- [x] Slack integration
- [x] Long-term memory
- [x] REST API
- [x] Bilingual support (EN / PT-BR)
- [ ] Web UI dashboard
- [ ] Docker one-click deployment
- [ ] Image understanding (multimodal LLMs)
- [ ] Plugin system for custom tools
- [ ] Mobile app companion

---

## Contributing

Contributions are very welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

```bash
# Fork the repository, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## Troubleshooting

**"Connection refused" on Ollama** — Make sure Ollama is running: `ollama serve`

**Bot not responding on Telegram** — Double-check your token in `config/config.yml` and that the bot was started with `/start`.

**High memory usage** — Switch to a lighter model like `tinyllama`. Edit `model:` in `config/config.yml`.

**WhatsApp keeps disconnecting** — WhatsApp Web sessions expire. Restart CrustAI to regenerate the QR code.

---

## Language / Idioma

- 🇺🇸 [English](#-crustai) — you're reading it
- 🇧🇷 [Português](#-o-que-é-o-crustai) — role para baixo

---

## 🇧🇷 O que é o CrustAI?

**CrustAI** é um assistente de IA totalmente privado e auto-hospedado que roda inteiramente na sua própria máquina — nenhum dado sai do seu computador. Conecta-se ao **Telegram, WhatsApp, Discord e Slack** com o poder de modelos de linguagem locais, sem depender de nenhum provedor externo.

### ✨ Funcionalidades Principais

| Funcionalidade | Descrição |
|---|---|
| 🔒 **100% Privado** | Todos os dados ficam na sua máquina. Sem nuvem, jamais |
| 🧠 **LLM Local** | Powered by Ollama — llama3.2, tinyllama, mistral e muito mais |
| 📱 **Multi-Plataforma** | Telegram, WhatsApp, Discord, Slack — um só assistente |
| 🧬 **Memória Longa** | Lembra fatos sobre você entre conversas |
| 🗣️ **Voz Offline** | Fala e escuta sem internet (pt-BR) |
| ⚡ **REST API** | Integre o CrustAI em qualquer fluxo de trabalho |
| 🎭 **Personalidade** | Configure nome, tom e comportamento do assistente |

### 🚀 Início Rápido

```bash
# 1. Clone o repositório
git clone https://github.com/DaveSimoes/CrustAI.git
cd CrustAI

# 2. Instale as dependências
npm install

# 3. Inicie o Ollama e baixe um modelo
ollama serve
ollama pull tinyllama

# 4. Configure o projeto
cp config/config.example.yml config/config.yml
# Edite config/config.yml com seu token do Telegram

# 5. Inicie o CrustAI
npm start
```

---

## Author

**Dave Simoes** — Developer passionate about AI, privacy, and open source.

- 🐙 GitHub: [@DaveSimoes](https://github.com/DaveSimoes)
- 💼 LinkedIn: [Dave Simoes](https://linkedin.com/in/davesimoes)

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with 🦀 and ❤️ by Dave Simoes**

[⭐ Star this repo if CrustAI helped you!](https://github.com/DaveSimoes/CrustAI)

[Report Bug](https://github.com/DaveSimoes/CrustAI/issues) · [Request Feature](https://github.com/DaveSimoes/CrustAI/issues) · [Read the Docs](https://documentcrustai.netlify.app/)

</div>
