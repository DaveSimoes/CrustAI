/**
 * CrustAI — WhatsApp Adapter
 * Uses @whiskeysockets/baileys for a fully local, session-based WA Web connection.
 * Scan QR once — session is saved to disk and reused automatically.
 */

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidNormalizedUser,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { mkdirSync } from 'fs';
import { logger } from '../../utils/logger.js';

export class WhatsAppAdapter {
  constructor(config, handleMessage) {
    this.config = config;
    this.handleMessage = handleMessage;
    this.sessionPath = config.session_path || './data/whatsapp-session';
    this.sock = null;
  }

  async start() {
    mkdirSync(this.sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const store = makeInMemoryStore({});

    this.sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      // Suppress Baileys internal logs
      logger: { level: 'silent', child: () => ({ level: 'silent', child: () => ({}) }) },
      generateHighQualityLinkPreview: false,
      markOnlineOnConnect: false,
    });

    store.bind(this.sock.ev);

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        logger.info('[WhatsApp] Scan the QR code above with your phone.');
        logger.info('[WhatsApp] WhatsApp → Settings → Linked Devices → Link a Device');
      }

      if (connection === 'open') {
        logger.success('WhatsApp ready');
      }

      if (connection === 'close') {
        const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
        const shouldReconnect = code !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          logger.warn(`[WhatsApp] Disconnected (code ${code}). Reconnecting...`);
          this.start();
        } else {
          logger.error('[WhatsApp] Logged out. Delete the session folder and restart.');
        }
      }
    });

    this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;

      for (const msg of messages) {
        // Skip own messages, status updates, and non-text messages
        if (msg.key.fromMe) continue;
        if (msg.key.remoteJid === 'status@broadcast') continue;

        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.imageMessage?.caption ||
          null;

        if (!text) continue;

        const userId = jidNormalizedUser(msg.key.remoteJid);

        try {
          // Show "typing..." indicator
          await this.sock.sendPresenceUpdate('composing', msg.key.remoteJid);

          const reply = await this.handleMessage({ userId, text, channel: 'whatsapp' });

          await this.sock.sendMessage(msg.key.remoteJid, { text: reply });
          await this.sock.sendPresenceUpdate('paused', msg.key.remoteJid);

        } catch (err) {
          logger.error('[WhatsApp] Handler error:', err.message);
        }
      }
    });
  }
}
