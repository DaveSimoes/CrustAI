<div align="center">

```
 ██████╗██████╗ ██╗   ██╗███████╗████████╗ █████╗ ██╗
██╔════╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔══██╗██║
██║     ██████╔╝██║   ██║███████╗   ██║   ███████║██║
██║     ██╔══██╗██║   ██║╚════██║   ██║   ██╔══██║██║
╚██████╗██║  ██║╚██████╔╝███████║   ██║   ██║  ██║██║
 ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝
```

# 🦀 CrustAI — Your Private, Local AI Assistant

**Always on. Always yours. Never in the cloud.**

[![Node.js](https://img.shields.io/badge/Node.js-≥20.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-blue?style=for-the-badge)](https://ollama.ai)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram)](https://telegram.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Portfolio](https://img.shields.io/badge/Portfolio-Dave%20Simoes-red?style=for-the-badge)](https://github.com/DaveSimoes)

---

> 🔒 **100% Private** · 🖥️ **Runs Locally** · 🧠 **Powered by Open-Source LLMs** · 🌐 **Multi-Platform**

</div>

---

## 🌍 Language / Idioma

- 🇺🇸 [English](#-what-is-crustai) — below
- 🇧🇷 [Português](#-o-que-é-o-crustai) — mais abaixo

---

## 🇺🇸 What is CrustAI?

**CrustAI** is a fully private, self-hosted AI assistant that runs entirely on your own machine — no data ever leaves your computer. It connects to popular messaging platforms like **Telegram, WhatsApp, Discord, and Slack**, giving you the power of a conversational AI without sacrificing your privacy.

Built with **Node.js** and powered by **Ollama** (local LLM runtime), CrustAI is designed for developers, privacy enthusiasts, and anyone who wants an AI assistant that truly belongs to them.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔒 **100% Private** | All data stays on your machine. No cloud, no telemetry |
| 🧠 **Local LLM** | Powered by Ollama — supports llama3.2, tinyllama, phi3 and more |
| 📱 **Multi-Platform** | Telegram, WhatsApp, Discord, Slack — all in one bot |
| 🧬 **Long-term Memory** | Remembers facts about you across conversations |
| 🗣️ **Voice Support** | Offline speech-to-text and text-to-speech (pt-BR) |
| ⚡ **REST API** | Built-in API for custom integrations |
| 🎭 **Custom Personality** | Configure your assistant's name, tone and behavior |
| 🌐 **Multilingual** | Native support for Portuguese and English |

---

## 🎬 Demo

### 🖥️ Step 1 — Starting CrustAI
*Watch the system boot up and connect to the local AI model*

![Terminal Demo](demo/terminal.gif)
<img width="600" height="314" alt="terminal gif" src="https://github.com/user-attachments/assets/2b27a3b1-005b-4eff-84fd-57160b657846" />


---

### 📱 Step 2 — Bot Connected on Telegram
*The bot responds instantly — running 100% offline*

![Ping Demo](demo/ping.gif)
<img width="600" height="304" alt="ping gif" src="https://github.com/user-attachments/assets/9164d292-7e99-498b-8f42-5a57501e61a7" />

---

### 🧠 Step 3 — AI Responding in Real Time
*Ask anything — the answer comes from your own machine*

![Chat Demo](demo/chat.gif)
<img width="600" height="307" alt="chat gif" src="https://github.com/user-attachments/assets/acdd3cfb-5b0a-4f03-83bf-09206b452bc4" />

---

### Commands available:
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
┌─────────────────────────────────────────────────────┐
│                     CrustAI Core                     │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Telegram │  │ Discord  │  │     WhatsApp     │  │
│  │  Adapter │  │  Adapter │  │      Adapter     │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                  │            │
│       └──────────────┼──────────────────┘            │
│                      ▼                               │
│            ┌─────────────────┐                      │
│            │  Message Handler │                      │
│            └────────┬────────┘                      │
│                     │                               │
│         ┌───────────┼───────────┐                   │
│         ▼           ▼           ▼                   │
│    ┌─────────┐ ┌────────┐ ┌──────────┐             │
│    │  Ollama │ │ Memory │ │ REST API │             │
│    │  (LLM)  │ │  Store │ │  Server  │             │
│    └─────────┘ └────────┘ └──────────┘             │
└─────────────────────────────────────────────────────┘
```

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

- [ ] Web UI dashboard
- [ ] Image understanding (multimodal LLMs)
- [ ] Plugin system for custom tools
- [ ] Docker one-click deployment
- [ ] Mobile app companion

---

## 👨‍💻 Author

**Dave Simoes**
- 🐙 GitHub: [@DaveSimoes](https://github.com/DaveSimoes)
- 💼 LinkedIn: [Dave Simoes](https://linkedin.com/in/davesimoes)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

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

## 🎬 Demonstração

### 🖥️ Passo 1 — Iniciando o CrustAI
*O sistema inicializando e conectando ao modelo de IA local*

![Terminal Demo](demo/terminal.gif)
<img width="600" height="314" alt="terminal gif" src="https://github.com/user-attachments/assets/781e1d43-6b45-487e-be8e-c90384cade44" />

---

### 📱 Passo 2 — Bot Conectado no Telegram
*O bot respondendo instantaneamente — 100% offline*

![Ping Demo](demo/ping.gif)
<img width="600" height="304" alt="ping gif" src="https://github.com/user-attachments/assets/e9853d5b-5170-426a-bff0-5d05ec83a7bf" />

---

### 🧠 Passo 3 — IA Respondendo em Tempo Real
*Pergunte qualquer coisa — a resposta vem da sua própria máquina*

![Chat Demo](demo/chat.gif)
<img width="600" height="307" alt="chat gif" src="https://github.com/user-attachments/assets/037adb09-5999-4a1b-bd21-12e4c365d83a" />

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

## 👨‍💻 Autor

**Dave Simoes** — Desenvolvedor apaixonado por IA, privacidade e código aberto.

- 🐙 GitHub: [@DaveSimoes](https://github.com/DaveSimoes)
- 💼 LinkedIn: [Dave Simoes](https://linkedin.com/in/davesimoes)

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! / If this project helped you, leave a star! ⭐**

*Made with 🦀 and ❤️ by Dave Simoes*

</div>
