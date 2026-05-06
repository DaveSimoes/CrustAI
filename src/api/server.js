/**
 * CrustAI — REST API Server + Web UI
 *
 * Routes:
 *   GET  /              → web chat interface (src/web/index.html)
 *   GET  /health        → liveness probe
 *   POST /chat          → send message, get reply
 *   GET  /memory/:userId
 *   DELETE /memory/:userId
 *   GET  /ws            → WebSocket text fallback
 */

import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import staticPlugin from '@fastify/static';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function startApiServer({ config, handleMessage, memory }) {
  const app = Fastify({ logger: false });

  await app.register(websocket);

  // Serve static web UI
  await app.register(staticPlugin, {
    root: join(__dirname, '../web'),
    prefix: '/',
  });

  // ── Health ──────────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    model:  config.model,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  }));

  // ── Chat ────────────────────────────────────────────────────
  app.post('/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text:    { type: 'string', minLength: 1, maxLength: 4096 },
          userId:  { type: 'string', default: 'web-user' },
          channel: { type: 'string', default: 'web' },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const { text, userId = 'web-user', channel = 'web' } = req.body;
      const response = await handleMessage({ userId, text, channel });
      return { ok: true, response };
    } catch (err) {
      logger.error('[API] /chat error:', err.message);
      reply.status(500);
      return { ok: false, error: err.message };
    }
  });

  // ── Memory ──────────────────────────────────────────────────
  app.get('/memory/:userId', async (req) => {
    const stats = memory.getStats(req.params.userId);
    return { ok: true, ...stats };
  });

  app.delete('/memory/:userId', async (req) => {
    await memory.clearHistory(req.params.userId);
    await memory.clearFacts(req.params.userId);
    return { ok: true, message: 'Memory cleared' };
  });

  // ── WebSocket text fallback ─────────────────────────────────
  app.get('/ws', { websocket: true }, (socket) => {
    socket.on('message', async (raw) => {
      try {
        const { text, userId = 'ws-user' } = JSON.parse(raw.toString());
        const response = await handleMessage({ userId, text, channel: 'websocket' });
        socket.send(JSON.stringify({ ok: true, response }));
      } catch (err) {
        socket.send(JSON.stringify({ ok: false, error: err.message }));
      }
    });
  });

  await app.listen({ port: config.server?.port ?? 3000, host: '0.0.0.0' });
}
