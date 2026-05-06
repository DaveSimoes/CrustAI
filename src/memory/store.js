/**
 * CrustAI — Memory Store
 * Uses sql.js (pure JavaScript SQLite — no native compilation needed).
 * On real hardware, swap to better-sqlite3 for ~10x performance.
 */

import initSqlJs from 'sql.js';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { logger } from '../utils/logger.js';

export class MemoryStore {
  constructor(config = {}) {
    this.dbPath = config.db_path || './data/memory.db';
    this.maxTurns = config.max_turns ?? 20;
    this.db = null;
    this._SQL = null;
  }

  async init() {
    const dir = dirname(this.dbPath);
    mkdirSync(dir, { recursive: true });

    this._SQL = await initSqlJs();

    // Load existing DB from disk, or create fresh
    if (this.dbPath !== ':memory:' && existsSync(this.dbPath)) {
      const data = readFileSync(this.dbPath);
      this.db = new this._SQL.Database(data);
    } else {
      this.db = new this._SQL.Database();
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    TEXT    NOT NULL,
        role       TEXT    NOT NULL,
        content    TEXT    NOT NULL,
        created_at TEXT    DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS facts (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    TEXT    NOT NULL,
        content    TEXT    NOT NULL,
        created_at TEXT    DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id);
      CREATE INDEX IF NOT EXISTS idx_facts_user ON facts(user_id);
    `);

    if (this.dbPath !== ':memory:') {
      logger.success(`Memory store ready   (${this.dbPath})`);
    }
  }

  _save() {
    if (this.dbPath === ':memory:') return;
    writeFileSync(this.dbPath, Buffer.from(this.db.export()));
  }

  _all(sql, params = []) {
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }

  _run(sql, params = []) {
    this.db.run(sql, params);
  }

  // ── Conversation history ──────────────────────────────────────────────────

  async addTurn(userId, userText, assistantText) {
    this._run('INSERT INTO conversations (user_id,role,content) VALUES (?,?,?)', [userId,'user',userText]);
    this._run('INSERT INTO conversations (user_id,role,content) VALUES (?,?,?)', [userId,'assistant',assistantText]);
    this._save();
  }

  async getHistory(userId) {
    const rows = this._all(
      `SELECT role, content FROM conversations
       WHERE user_id=? ORDER BY id DESC LIMIT ?`,
      [userId, this.maxTurns * 2]
    );
    return rows.reverse().map(r => ({ role: r.role, content: r.content }));
  }

  async clearHistory(userId) {
    this._run('DELETE FROM conversations WHERE user_id=?', [userId]);
    this._save();
  }

  // ── Long-term facts ───────────────────────────────────────────────────────

  async rememberFact(userId, fact) {
    this._run('INSERT INTO facts (user_id,content) VALUES (?,?)', [userId, fact.trim()]);
    this._save();
  }

  async clearFacts(userId) {
    this._run('DELETE FROM facts WHERE user_id=?', [userId]);
    this._save();
  }

  async getContext(userId) {
    const rows = this._all(
      'SELECT content FROM facts WHERE user_id=? ORDER BY id DESC LIMIT 15',
      [userId]
    );
    if (!rows.length) return 'No stored context yet.';
    return rows.map(r => `• ${r.content}`).join('\n');
  }

  getStats(userId) {
    const turns = this._all('SELECT COUNT(*) as n FROM conversations WHERE user_id=?', [userId]);
    const facts  = this._all('SELECT COUNT(*) as n FROM facts WHERE user_id=?', [userId]);
    return { turns: turns[0]?.n ?? 0, facts: facts[0]?.n ?? 0 };
  }

  close() {
    this._save();
    this.db?.close();
  }
}
