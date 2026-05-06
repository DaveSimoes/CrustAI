/**
 * CrustAI — Voice Server
 * WebSocket endpoint: receives raw WAV audio, transcribes with Whisper.cpp,
 * calls the LLM, and returns synthesised WAV audio via Piper TTS.
 *
 * Prerequisites (see docs/VOICE.md):
 *   - whisper.cpp compiled → ./vendor/whisper/main
 *   - Piper TTS installed  → piper in PATH
 *   - Model downloaded     → ./vendor/whisper/models/ggml-small.bin
 */

import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { execFile, spawn } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';
import { logger } from '../utils/logger.js';

const execFileAsync = promisify(execFile);

export class VoiceServer {
  constructor(config, handleMessage) {
    this.config = config;
    this.handleMessage = handleMessage;
    this.port = config.port ?? 8765;
    this.whisperBin = './vendor/whisper/main';
    this.whisperModel = `./vendor/whisper/models/ggml-${config.stt_model ?? 'small'}.bin`;
  }

  _checkDeps() {
    if (!existsSync(this.whisperBin)) {
      logger.warn(`Whisper binary not found at ${this.whisperBin}. See docs/VOICE.md.`);
      return false;
    }
    if (!existsSync(this.whisperModel)) {
      logger.warn(`Whisper model not found at ${this.whisperModel}. See docs/VOICE.md.`);
      return false;
    }
    return true;
  }

  async _transcribe(audioPath) {
    const { stdout } = await execFileAsync(this.whisperBin, [
      '-m', this.whisperModel,
      '-f', audioPath,
      '-l', this.config.stt_language ?? 'pt',
      '--output-txt',
      '--no-timestamps',
      '--print-special', 'false',
    ]);
    // Whisper outputs [BLANK_AUDIO] when nothing is detected
    const text = stdout.replace(/\[.*?\]/g, '').trim();
    return text;
  }

  async _synthesise(text, outputPath) {
    return new Promise((resolve, reject) => {
      const piper = spawn('piper', [
        '--model', this.config.tts_voice ?? 'pt_BR-faber-medium',
        '--output_file', outputPath,
      ]);

      piper.stdin.write(text);
      piper.stdin.end();

      piper.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Piper exited with code ${code}`));
      });

      piper.on('error', reject);
    });
  }

  async start() {
    const depsOk = this._checkDeps();

    const app = Fastify({ logger: false });
    await app.register(websocket);

    // ── Text fallback (no STT/TTS needed — great for testing) ─────────────
    app.get('/voice/text', { websocket: true }, (socket) => {
      logger.info('[Voice] Text client connected');
      socket.on('message', async (raw) => {
        try {
          const { text, userId = 'voice-text-user' } = JSON.parse(raw.toString());
          const reply = await this.handleMessage({ userId, text, channel: 'voice' });
          socket.send(JSON.stringify({ ok: true, reply }));
        } catch (err) {
          socket.send(JSON.stringify({ ok: false, error: err.message }));
        }
      });
    });

    // ── Full audio pipeline ────────────────────────────────────────────────
    app.get('/voice/audio', { websocket: true }, (socket) => {
      if (!depsOk) {
        socket.send(JSON.stringify({ ok: false, error: 'Voice dependencies not installed. See docs/VOICE.md.' }));
        socket.close();
        return;
      }

      logger.info('[Voice] Audio client connected');

      socket.on('message', async (audioBuffer) => {
        const tmpIn  = join(tmpdir(), `crustai-in-${Date.now()}.wav`);
        const tmpOut = join(tmpdir(), `crustai-out-${Date.now()}.wav`);

        try {
          // 1. Save incoming audio
          writeFileSync(tmpIn, audioBuffer);

          // 2. Transcribe
          const userText = await this._transcribe(tmpIn);
          unlinkSync(tmpIn);

          if (!userText) {
            socket.send(JSON.stringify({ ok: true, reply: null, reason: 'blank_audio' }));
            return;
          }

          logger.debug(`[Voice] Heard: "${userText}"`);

          // 3. Get LLM reply
          const reply = await this.handleMessage({
            userId: 'voice-audio-user',
            text: userText,
            channel: 'voice',
          });

          // 4. Synthesise speech
          await this._synthesise(reply, tmpOut);
          const audioOut = readFileSync(tmpOut);
          unlinkSync(tmpOut);

          // 5. Send WAV back
          socket.send(audioOut);

        } catch (err) {
          logger.error('[Voice] Pipeline error:', err.message);
          // Clean up temp files on error
          if (existsSync(tmpIn))  unlinkSync(tmpIn);
          if (existsSync(tmpOut)) unlinkSync(tmpOut);
          socket.send(JSON.stringify({ ok: false, error: err.message }));
        }
      });
    });

    await app.listen({ port: this.port, host: '0.0.0.0' });
    logger.info(`[Voice] Text WS: ws://localhost:${this.port}/voice/text`);
    if (depsOk) logger.info(`[Voice] Audio WS: ws://localhost:${this.port}/voice/audio`);
  }
}
