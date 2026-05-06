# ⚡ Quick Start — CrustAI

This guide gets CrustAI running with **Telegram in under 10 minutes**.  
Telegram is the easiest platform — no QR codes, no OAuth apps, just a token.

---

## Step 1 — Install Ollama

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Pull the model (downloads ~4 GB — get a coffee)
ollama pull llama3.2
```

Verify it works:
```bash
ollama run llama3.2 "Say hello in Portuguese"
```

---

## Step 2 — Clone and install CrustAI

```bash
git clone https://github.com/your-username/crustai.git
cd crustai
npm install
```

---

## Step 3 — Run the setup wizard

```bash
npm run setup
```

When the wizard asks which platforms to enable, **pick Telegram only** for now.

---

## Step 4 — Get a Telegram bot token

1. Open Telegram → search for **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g. "My CrustAI") and a username (e.g. `mycrustai_bot`)
4. BotFather gives you a token like `1234567890:ABCdef...` — copy it

Then run:
```bash
npm run connect telegram
# Paste your token when prompted
```

---

## Step 5 — Start CrustAI

```bash
npm start
```

You should see:
```
✓ Ollama connected     (llama3.2)
✓ Memory store ready   (./data/memory.db)
✓ Telegram ready
✓ REST API ready       (http://localhost:3000)
🦀 CrustAI is ready. Your shell awaits.
```

---

## Step 6 — Talk to your bot

Open Telegram, find your bot by its username, and send a message.

Try:
```
/help
Hello! What can you do?
/remember I prefer concise answers in Portuguese
```

---

## What's next?

| Goal | Command |
|---|---|
| Add WhatsApp | `npm run connect whatsapp` |
| Add Discord | `npm run connect discord` |
| Add Slack | `npm run connect slack` |
| Enable voice | Edit `config/config.yml` → `voice.enabled: true` (see [VOICE.md](VOICE.md)) |
| Run with Docker | `docker compose up -d` |
| Access from phone | See [REMOTE_ACCESS.md](REMOTE_ACCESS.md) |
| Run tests | `npm test` |

---

## Troubleshooting

**"Ollama is not running"**  
→ Run `ollama serve` in a separate terminal.

**"config/config.yml not found"**  
→ Run `npm run setup` first.

**Telegram bot doesn't respond**  
→ Check the token in `config/config.yml`. Make sure you started the bot with `/start`.

**WhatsApp QR code not appearing**  
→ Delete `./data/whatsapp-session` and restart.
