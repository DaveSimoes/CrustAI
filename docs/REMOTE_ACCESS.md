# 📡 Remote Access — CrustAI

Access your local CrustAI from your phone, even when you're away from home — without exposing any ports to the internet.

## Option 1: Tailscale (Recommended)

[Tailscale](https://tailscale.com) creates a private encrypted network between your devices. Free for personal use.

```bash
# On your server (Mac/Linux)
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# On your phone
# Install Tailscale from the App Store / Play Store
# Sign in with the same account
```

Your CrustAI will be available at:
```
http://crustai.your-tailnet.ts.net:3000   # REST API
ws://crustai.your-tailnet.ts.net:8765     # Voice WebSocket
```

Enable in config:
```yaml
remote:
  enabled: true
  provider: tailscale
  hostname: crustai
```

## Option 2: Cloudflare Tunnel

If you prefer a named public URL (e.g. `crustai.yourdomain.com`):

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared   # macOS
# or download from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/

# Authenticate
cloudflared tunnel login

# Create and run the tunnel
cloudflared tunnel create crustai
cloudflared tunnel route dns crustai crustai.yourdomain.com
cloudflared tunnel run --url http://localhost:3000 crustai
```

> ⚠️ With a public URL, make sure to enable authentication in config to prevent unauthorised access.

## Keeping CrustAI running

Use PM2 to keep CrustAI running in the background and restart on crash:

```bash
npm install -g pm2
pm2 start src/core/index.js --name crustai
pm2 save
pm2 startup   # auto-start on reboot
```
