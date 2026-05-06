# 💬 Integrations — CrustAI

## WhatsApp

Uses **[Baileys](https://github.com/WhiskeySockets/Baileys)** — a local, session-based connection. No third-party servers. Session is stored on disk — scan QR once.

```bash
npm run connect whatsapp
# Scan the QR code with WhatsApp → Linked Devices → Link a Device
```

Config:
```yaml
whatsapp:
  enabled: true
  session_path: ./data/whatsapp-session
```

> ⚠️ WhatsApp does not officially support bots. Use a secondary number for safety.

---

## Telegram

The easiest integration. Uses the official Bot API.

1. Open Telegram → talk to **@BotFather** → `/newbot`
2. Copy the token

```yaml
telegram:
  enabled: true
  token: "1234567890:ABCdef..."
  allowed_user_ids: [123456789]   # Your Telegram user ID
```

Find your user ID: talk to @userinfobot on Telegram.

---

## Discord

Creates a bot in your own private server.

1. Go to [discord.com/developers](https://discord.com/developers/applications)
2. New Application → Bot → copy token
3. Enable: `Message Content Intent`, `Server Members Intent`
4. Invite bot to your server with `bot` + `applications.commands` scopes

```yaml
discord:
  enabled: true
  token: "MTk4NjIy..."
  guild_id: "123456789012345678"
  channel_id: "987654321098765432"   # optional, restricts to one channel
```

---

## Slack

Uses Socket Mode — **no public URL or webhook needed**.

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → Create App → From Scratch
2. **Socket Mode** → Enable → generate App Token (starts with `xapp-`)
3. **OAuth & Permissions** → add scopes: `chat:write`, `im:history`, `app_mentions:read`
4. **Event Subscriptions** → enable → subscribe to: `message.im`, `app_mention`
5. Install app to workspace → copy Bot Token (starts with `xoxb-`)

```yaml
slack:
  enabled: true
  bot_token: "xoxb-..."
  app_token: "xapp-1-..."
```
