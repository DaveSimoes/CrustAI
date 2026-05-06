# 🎙️ Voice Setup — CrustAI

CrustAI's voice pipeline runs **entirely offline**. No audio ever leaves your device.

## Architecture

```
Mic / Phone → Whisper.cpp (STT) → LLM → Piper TTS → Speaker / Phone
                    ↑
             openWakeWord
            "Hey CrustAI"
```

## 1 — Install Whisper.cpp

```bash
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
make

# Download the small model (~240 MB, good for Portuguese)
bash models/download-ggml-model.sh small
```

Available model sizes (speed vs accuracy tradeoff):

| Model  | Size   | Speed  | Accuracy |
|--------|--------|--------|----------|
| tiny   | 75 MB  | ⚡⚡⚡⚡ | ★★☆☆    |
| base   | 140 MB | ⚡⚡⚡  | ★★★☆    |
| small  | 240 MB | ⚡⚡    | ★★★★    |
| medium | 1.4 GB | ⚡     | ★★★★★   |

## 2 — Install Piper TTS

```bash
pip install piper-tts

# Download a Portuguese voice
piper --model pt_BR-faber-medium --download-dir ./voices --update-voices
```

Available Portuguese voices:
- `pt_BR-faber-medium` — Brazilian Portuguese, natural male voice
- `pt_PT-tugão-medium` — European Portuguese

Browse all voices at: https://huggingface.co/rhasspy/piper-voices

## 3 — Enable in config

```yaml
# config/config.yml
voice:
  enabled: true
  port: 8765
  wake_word: "hey crustai"
  stt_model: small
  stt_language: pt
  tts_voice: pt_BR-faber-medium
```

## 4 — Mobile access (iOS & Android)

CrustAI exposes a WebSocket on port `8765`. Connect your phone using:

**With Tailscale (recommended):**
```
wss://crustai.your-tailnet.ts.net:8765/voice
```

**iOS Shortcut:**
1. Install Tailscale on both devices
2. Create a Shortcut: Record Audio → POST to CrustAI WebSocket → Play response

**Android (Tasker):**
1. Install Tasker + HTTP Request plugin
2. Create a task: Record → WebSocket send → Play audio response

## Wake Word

CrustAI uses [openWakeWord](https://github.com/dscripka/openWakeWord) to listen for "Hey CrustAI" without consuming resources.

```bash
pip install openwakeword
```

You can train a custom wake phrase — see the openWakeWord docs.
