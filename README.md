<div align="center">

```
   ██████╗██████╗ ██╗   ██╗███████╗████████╗ █████╗ ██╗
  ██╔════╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔══██╗██║
  ██║     ██████╔╝██║   ██║███████╗   ██║   ███████║██║
  ██║     ██╔══██╗██║   ██║╚════██║   ██║   ██╔══██║██║
  ╚██████╗██║  ██║╚██████╔╝███████║   ██║   ██║  ██║██║
   ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝
```

**Your private, local-first AI assistant. Always on. Always yours.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Ollama](https://img.shields.io/badge/Powered%20by-Ollama-black.svg)](https://ollama.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/your-username/crustai?style=social)](https://github.com/your-username/crustai)

[**Quick Start**](#-quick-start) · [**Features**](#-features) · [**Integrations**](#-integrations) · [**Voice**](#-voice) · [**Docs**](docs/) · [**Contributing**](#-contributing)

</div>

---

> 🦀 **CrustAI** is a self-hosted, privacy-first AI assistant that lives entirely on your own hardware. No cloud. No subscriptions. No one reading your messages. It connects to WhatsApp, Discord, Telegram and Slack so you can chat with it just like you would a friend — and it talks back, literally, with built-in voice support.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔒 **100% Local** | All processing happens on your machine. Your data never leaves. |
| 💬 **Multi-platform chat** | WhatsApp, Discord, Telegram, Slack — pick one or all four. |
| 🎙️ **Voice in & out** | Speak to CrustAI on your phone. It speaks back. Offline. |
| 🧠 **Persistent memory** | Remembers your preferences, projects and context across sessions. |
| 🤖 **Any LLM you want** | Llama 3, Mistral, Phi-3, Gemma — swap models in one command. |
| ⚡ **Always-on daemon** | Runs silently in the background, ready in milliseconds. |
| 🎭 **Personality system** | Quirky, helpful, and surprisingly witty. Fully customisable. |
| 📡 **Remote access** | Reach it from your phone via Tailscale — no open ports needed. |
| 🐳 **Docker-ready** | One `docker-compose up` and you're done. |

---

## 🖼️ Screenshots

<div align="center">

| Chat on WhatsApp | Voice on mobile | Memory & context |
|---|---|---|
| *(coming soon)* | *(coming soon)* | *(coming soon)* |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and **npm** 9+
- **[Ollama](https://ollama.com)** installed and running
- At least **8 GB RAM** (16 GB recommended for larger models)
- macOS, Linux, or Windows (WSL2)

### 1 — Install Ollama and pull a model

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Pull the recommended model (~4 GB)
ollama pull llama3.2
```

### 2 — Clone CrustAI

```bash
git clone https://github.com/your-username/crustai.git
cd crustai
cp config/config.example.yml config/config.yml
npm install
```

### 3 — Run the guided setup wizard

```bash
npm run setup
```

The wizard walks you through everything interactively:

```
 ██████╗██████╗ ██╗   ██╗███████╗████████╗ █████╗ ██╗
...

🦀 Welcome to CrustAI! Let's get your claws ready.

? Which AI model would you like to use?
  ❯ llama3.2  (recommended, 4 GB)
    mistral   (fast and sharp, 4 GB)
    phi3      (lightweight, 2 GB)
    gemma2    (great reasoning, 5 GB)

? Which chat platforms do you want to connect?
  ◉ WhatsApp
  ◉ Telegram
  ◯ Discord
  ◯ Slack

? Enable voice (speech-to-text + text-to-speech)? Yes

? Remote access via Tailscale? Yes

✓ Config written to config/config.yml
✓ Dependencies checked
→ Run `npm start` to launch CrustAI!
```

### 4 — Start CrustAI

```bash
npm start
```

```
🦀 CrustAI is crawling to life...

✓ Ollama connected     (llama3.2 — 4.1 GB)
✓ WhatsApp ready       → Scan QR below
✓ Telegram ready       → @your_bot_name
✓ Voice engine ready   → port 8765
✓ Memory store ready   → ./data/memory.db

┌─────────────────────────────┐
│  Scan with WhatsApp to link  │
│  Settings > Linked Devices   │
│                              │
│  ▄▄▄▄▄ ▄  ▄▄ ▄▄▄▄▄          │
│  █   █ ██ ██ █   █           │
│  █▄▄▄█ ▄▄▄▄▄ █▄▄▄█           │
└─────────────────────────────┘

🦀 CrustAI is ready. Your shell awaits.
```

---

## 💬 Integrations

### WhatsApp

Uses **[Baileys](https://github.com/WhiskeySockets/Baileys)** — a clean, unofficial WhatsApp Web API. No third-party servers. The QR session is stored locally.

```bash
npm run connect whatsapp
# Scan the QR code — done.
```

### Telegram

The easiest integration. Uses the official **Bot API**.

1. Open Telegram → talk to **@BotFather** → `/newbot`
2. Copy the token into `config/config.yml`
3. `npm run connect telegram`

```yaml
# config/config.yml
telegram:
  token: "1234567890:ABCdef..."
  allowed_user_ids: [123456789]   # restrict to yourself
```

### Discord

Creates a private bot in your own server using **Discord.js**.

1. Go to [discord.com/developers](https://discord.com/developers/applications) → New Application → Bot
2. Copy the token and your Guild ID
3. `npm run connect discord`

### Slack

Uses **Bolt for JavaScript** with Socket Mode — no public URL required.

1. Create a Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable Socket Mode + Event Subscriptions
3. Copy both tokens into `config/config.yml`

---

## 🎙️ Voice

CrustAI's entire voice pipeline runs offline — no audio ever leaves your device.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Your voice  │────▶│ Whisper.cpp  │────▶│  Llama 3.2   │────▶│  Piper TTS   │
│  (mic/phone) │     │   (STT)      │     │  (thinking)  │     │  (response)  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                            ↑                                          ↓
                     openWakeWord                              speaks back to you
                    "Hey CrustAI"
```

| Component | Library | Notes |
|---|---|---|
| Wake word | [openWakeWord](https://github.com/dscripka/openWakeWord) | Customise to any phrase |
| Speech-to-text | [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) | `small` model, Portuguese-ready |
| Text-to-speech | [Piper TTS](https://github.com/rhasspy/piper) | Natural voices, fully offline |

**Mobile access:** Connect your phone via WebSocket using [Tailscale](https://tailscale.com) (free). No port forwarding needed.

For iOS: use a Shortcut that records audio and posts to `https://crustai.your-tailnet.ts.net/voice`.  
For Android: use Tasker or the companion app (coming soon).

---

## 🧠 Memory

CrustAI remembers things across conversations using a two-layer memory system:

- **Short-term:** recent conversation window (configurable, default 20 turns)
- **Long-term:** SQLite + ChromaDB for semantic search over past conversations, notes, and preferences

```bash
# Tell CrustAI something to remember
"Remember that I prefer concise answers unless I ask for detail."
"My wife's birthday is March 12th."

# It will surface this context automatically when relevant.
```

---

## 🎭 Personality

CrustAI ships with a default personality that is helpful, slightly quirky, and occasionally makes crustacean references. You can fully customise it.

Edit `config/personality.yml`:

```yaml
name: CrustAI
language: "pt-BR"   # or pt-PT, en, es, fr, etc.
tone: "friendly"    # formal | friendly | playful
quirks:
  - "Occasionally makes subtle ocean or crustacean references"
  - "Proud of running locally without sharing your data"
  - "Direct by default, detailed when asked"
system_prompt: |
  You are CrustAI, a private, local AI assistant.
  You adapt your tone to the conversation — professional
  when needed, relaxed otherwise.
  You have memory of past conversations: {memory_context}
  Current platform: {channel}
  Today's date: {date}
```

---

## 🏗️ Architecture

```
crustai/
├── src/
│   ├── core/           # LLM client, prompt engine, orchestrator
│   ├── adapters/       # One file per chat platform
│   │   ├── whatsapp/
│   │   ├── discord/
│   │   ├── telegram/
│   │   └── slack/
│   ├── voice/          # STT, TTS, wake word, WebSocket server
│   ├── memory/         # SQLite + ChromaDB memory layer
│   └── personality/    # System prompt builder, trait loader
├── config/
│   ├── config.yml          # Your config (git-ignored)
│   └── config.example.yml  # Template
├── scripts/
│   ├── setup.js        # Interactive setup wizard
│   └── connect.js      # Per-platform connection helper
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
└── docs/
    ├── VOICE.md
    ├── INTEGRATIONS.md
    ├── MEMORY.md
    └── REMOTE_ACCESS.md
```

---

## 🐳 Docker

Run everything in containers — including Ollama, ChromaDB, and CrustAI itself.

```bash
docker compose up -d
```

```yaml
# docker/docker-compose.yml — full stack in one command
services:
  ollama:    # LLM engine
  chromadb:  # Vector memory
  crustai:   # The assistant
```

See [docker/docker-compose.yml](docker/docker-compose.yml) for the full file.

---

## ⚙️ Configuration reference

| Key | Default | Description |
|---|---|---|
| `model` | `llama3.2` | Ollama model to use |
| `language` | `pt-BR` | Assistant language |
| `memory.max_turns` | `20` | Short-term context window |
| `voice.wake_word` | `hey crustai` | Custom wake phrase |
| `voice.stt_model` | `small` | Whisper model size |
| `remote.provider` | `tailscale` | Remote access method |

Full reference: [docs/CONFIG.md](docs/CONFIG.md)

---

## 🗺️ Roadmap

- [x] Ollama integration
- [x] WhatsApp, Telegram, Discord, Slack adapters
- [x] Voice pipeline (Whisper + Piper)
- [x] Persistent memory (SQLite + ChromaDB)
- [x] Docker Compose setup
- [ ] Web UI dashboard
- [ ] Android companion app
- [ ] Plugin / tool system (web search, calendar, home automation)
- [ ] Multi-user support
- [ ] Image understanding (LLaVA integration)
- [ ] RAG over your own documents

---

## 🤝 Contributing

Contributions are very welcome! CrustAI is intentionally modular — adding a new chat platform or voice engine is just one file.

```bash
git clone https://github.com/your-username/crustai.git
cd crustai
npm install
npm run dev   # hot-reload development mode
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and the adapter interface spec.

---

## 📄 License

MIT — use it, fork it, ship it. Just keep it private and local. 🦀

---

<div align="center">

**Built with ❤️ for people who believe their data is their own.**

*If CrustAI saved you from yet another cloud subscription, consider giving it a ⭐*

</div>
