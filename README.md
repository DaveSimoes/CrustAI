<div align="center">

<!-- HERO BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=🦀%20CrustAI&fontSize=80&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Private%20%7C%20Local-First%20%7C%20Multi-Platform%20AI%20Assistant&descAlignY=60&descSize=18" width="100%" />

<!-- BADGES ROW 1 — Social proof (STAR CTA primeiro!) -->
[![GitHub stars](https://img.shields.io/github/stars/DaveSimoes/CrustAI?style=social)](https://github.com/DaveSimoes/CrustAI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DaveSimoes/CrustAI?style=social)](https://github.com/DaveSimoes/CrustAI/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/DaveSimoes/CrustAI?style=social)](https://github.com/DaveSimoes/CrustAI/watchers)

<!-- BADGES ROW 2 — Tech -->
[![Node.js](https://img.shields.io/badge/Node.js-≥20.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-blue?style=for-the-badge)](https://ollama.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://github.com/DaveSimoes/CrustAI/blob/main/LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-ff69b4?style=for-the-badge)](#-contributing)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](https://github.com/DaveSimoes/CrustAI/pulls)

<!-- TAGLINE -->
<h3>Run a multi-platform AI assistant on your own machine — with full privacy.</h3>
<p><b>Telegram · Discord · WhatsApp · Slack</b> — powered by open-source LLMs, 100% offline.</p>

</div>

---

## ⭐ Por que dar uma estrela? / Why star this project?

> **Se você acha privacidade importante, este projeto é para você.**
> **If you care about privacy, this project is for you.**

- 🔒 **Zero cloud dependency** — your conversations never leave your machine
- 🧠 **Real local AI** — not a wrapper, a full local LLM runtime via Ollama
- 📱 **Works where you already are** — Telegram, WhatsApp, Discord, Slack
- 🌐 **Bilingual** — English + Portuguese, more languages welcome
- 🛠️ **Open & extensible** — MIT license, clean architecture, easy to hack
- 🚀 **Active roadmap** — Web UI, Docker one-click, Plugin system coming

**⭐ Star the repo to support open-source, private AI — it takes 2 seconds and means the world to the maintainer.**

---

## 🌍 Language / Idioma

- 🇺🇸 [English](#-what-is-crustai)
- 🇧🇷 [Português](#-o-que-é-o-crustai)

---

## ⚡ Live Preview

<div align="center">

| Boot | Telegram | AI Chat |
|:---:|:---:|:---:|
| ![Terminal Demo](https://github.com/DaveSimoes/CrustAI/raw/main/demo/terminal.gif) | ![Ping Demo](https://github.com/DaveSimoes/CrustAI/raw/main/demo/ping.gif) | ![Chat Demo](https://github.com/DaveSimoes/CrustAI/raw/main/demo/chat.gif) |
| *CrustAI booting up* | *Bot live on Telegram* | *AI responding locally* |

</div>

---

## 🇺🇸 What is CrustAI?

CrustAI is a **self-hosted AI assistant** that runs 100% locally using Ollama. It integrates with **Telegram, Discord, WhatsApp and Slack** so you can chat with your AI in tools you already use — without sending your data to any cloud LLM provider.

Built with **Node.js** and powered by **Ollama** (local LLM runtime), CrustAI is designed for developers, privacy enthusiasts, and anyone who wants an AI assistant that truly belongs to them.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔒 **100% Local & Private** | Conversations stay on your machine — always |
| 🧠 **LLM via Ollama** | Use tinyllama, llama3.2, phi3, mistral and more |
| 📱 **Multi-platform Adapters** | Telegram, WhatsApp, Discord, Slack |
| 🧬 **Long-term Memory** | Store and retrieve user facts across sessions |
| ⚡ **REST API** | Integrate CrustAI into external workflows |
| 🎭 **Personality Config** | Customize tone, style and identity |
| 🌐 **Bilingual UX** | English + Portuguese support |
| 🗣️ **Voice Offline** | Speak and listen without internet (pt-BR) |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20.0
- [Ollama](https://ollama.ai) installed and running
- A Telegram Bot Token from [@BotFather](https://t.me/botfather)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/DaveSimoes/CrustAI.git
cd CrustAI

# 2. Install dependencies
npm install

# 3. Start Ollama and pull a model
ollama serve
ollama pull tinyllama   # lightweight (600MB)
# or
ollama pull llama3.2    # more powerful (2GB, needs 8GB RAM)

# 4. Configure the project
cp config/config.example.yml config/config.yml
# Edit config/config.yml with your Telegram token and model

# 5. Run CrustAI
npm start
```

---

## ⚙️ Configuration

Edit `config/config.yml`:

```yaml
model: tinyllama          # or llama3.2, phi3, mistral...
ollama_url: http://localhost:11434
language: pt-BR

telegram:
  enabled: true
  token: YOUR_BOT_TOKEN_HERE
  allowed_user_ids: []    # leave empty to allow all users

discord:
  enabled: false
  token: ""

whatsapp:
  enabled: false

voice:
  enabled: false
  port: 8765
```

---

## 💬 Available Commands

```
/ping      → Check if the bot is alive
/help      → Show all commands
/model     → Show which AI model is running
/remember  → Store a fact in long-term memory
/forget    → Erase all stored facts
/clear     → Clear conversation history
```

---

## 🏗️ Architecture

```
Adapters (Telegram / Discord / WhatsApp / Slack)
                │
                ▼
         Message Orchestrator
        ┌────────┴────────┐
        ▼                 ▼
   Ollama Client      Memory Store
        │                 │
        └────────┬────────┘
                 ▼
             REST API
```

> **Design note:** adapter boundaries make it easy to add new channels without changing core conversation logic.

---

## 🛠️ Tech Stack

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

## 📁 Project Structure

```
crustai/
├── src/
│   ├── core/
│   │   ├── index.js        # Main orchestrator
│   │   ├── llm.js          # Ollama LLM client
│   │   └── commands.js     # Command handler
│   ├── adapters/
│   │   ├── telegram/       # Telegram bot
│   │   ├── discord/        # Discord bot
│   │   ├── whatsapp/       # WhatsApp bot
│   │   └── slack/          # Slack bot
│   ├── memory/
│   │   └── store.js        # Long-term memory
│   ├── personality/
│   │   └── prompt.js       # System prompt builder
│   ├── voice/
│   │   └── server.js       # Voice WebSocket server
│   └── api/
│       └── server.js       # REST API
├── config/
│   ├── config.yml          # Your configuration (git-ignored)
│   ├── config.example.yml  # Template
│   └── personality.yml     # Assistant personality
├── demo/
│   ├── terminal.gif        # Boot demo
│   ├── ping.gif            # Telegram connection demo
│   └── chat.gif            # AI conversation demo
└── data/                   # Local database (git-ignored)
```

---

## 🔐 Privacy First

CrustAI was built with privacy as its core principle:

- ✅ All conversations stay on **your machine**
- ✅ No API keys sent to external AI services
- ✅ No telemetry or usage tracking
- ✅ Open source — inspect every line of code
- ✅ Your data, your rules

---

## 🗺️ Roadmap

- [ ] 🖥️ Web UI dashboard
- [ ] 🖼️ Image understanding (multimodal LLMs)
- [ ] 🧩 Plugin system for custom tools
- [ ] 🐳 Docker one-click deployment
- [ ] 📱 Mobile app companion

> 💡 Want to help build any of these? Check the [open issues](https://github.com/DaveSimoes/CrustAI/issues) — contributions are very welcome!

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for detailed guidelines.

---

## 👨‍💻 Author

**Dave Simoes** — Developer passionate about AI, privacy and open source.

- 🐙 GitHub: [@DaveSimoes](https://github.com/DaveSimoes)
- 💼 LinkedIn: [Dave Simoes](https://linkedin.com/in/davesimoes)

---

<div align="center">

## ⭐ Support the Project

**If CrustAI helped you, please give it a star — it helps a lot!**
**Se o CrustAI te ajudou, deixe uma estrela — faz toda a diferença!**

[![GitHub stars](https://img.shields.io/github/stars/DaveSimoes/CrustAI?style=for-the-badge&logo=github&color=yellow)](https://github.com/DaveSimoes/CrustAI/stargazers)

*Made with 🦀 and ❤️ by Dave Simoes*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%" />

</div>

---

---

## 🇧🇷 O que é o CrustAI?

**CrustAI** é um assistente de IA totalmente privado e auto-hospedado que roda inteiramente na sua própria máquina — nenhum dado sai do seu computador. Ele se conecta a plataformas de mensagens populares como **Telegram, WhatsApp, Discord e Slack**, oferecendo o poder de uma IA conversacional sem abrir mão da sua privacidade.

Construído com **Node.js** e alimentado pelo **Ollama** (motor de LLM local), o CrustAI foi projetado para desenvolvedores, entusiastas de privacidade e qualquer pessoa que queira um assistente de IA que realmente lhe pertença.

---

## ✨ Funcionalidades Principais

| Funcionalidade | Descrição |
|---|---|
| 🔒 **100% Privado** | Todos os dados ficam na sua máquina. Sem nuvem |
| 🧠 **LLM Local** | Powered by Ollama — suporta llama3.2, tinyllama e mais |
| 📱 **Multi-Plataforma** | Telegram, WhatsApp, Discord, Slack — um só bot |
| 🧬 **Memória Longa** | Lembra fatos sobre você entre conversas |
| 🗣️ **Voz Offline** | Fala e escuta sem internet (pt-BR) |
| ⚡ **REST API** | API integrada para integrações customizadas |
| 🎭 **Personalidade** | Configure o nome, tom e comportamento do assistente |

---

## 🚀 Início Rápido

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

## 📄 License / Licença

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

Este projeto está licenciado sob a **Licença MIT** — veja o arquivo [LICENSE](./LICENSE) para detalhes.
