import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { initialSiteContent, SiteContent } from './initialData';

let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'content.db');
  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');

  // Initialize tables
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );
  `);

  // Check if default admin exists, if not seed default admin (username: admin, pass: admin123)
  const existingAdmin = dbInstance.prepare("SELECT id FROM admin_users WHERE username = 'admin'").get();
  if (!existingAdmin) {
    const crypto = require('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('admin123', salt, 10000, 64, 'sha512').toString('hex');
    dbInstance.prepare(`
      INSERT INTO admin_users (username, email, password_hash, salt, name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('admin', 'admin@terbangbersamakawan.co.id', hash, salt, 'Administrator PT. TBK', 'superadmin');
  }

  // Check if main content exists, if not seed with official initial data
  const existing = dbInstance.prepare("SELECT data FROM site_content WHERE id = 'main'").get() as { data: string } | undefined;
  if (!existing) {
    dbInstance.prepare("INSERT INTO site_content (id, data) VALUES ('main', ?)").run(JSON.stringify(initialSiteContent));
  }

  return dbInstance;
}

export { getDb };

export function getSiteContent(): SiteContent {
  try {
    const db = getDb();
    const row = db.prepare("SELECT data FROM site_content WHERE id = 'main'").get() as { data: string } | undefined;
    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      // Merge with initial data to ensure all keys exist
      return {
        ...initialSiteContent,
        ...parsed,
        hero: {
          ...initialSiteContent.hero,
          ...parsed.hero,
          slides: Array.isArray(parsed.hero?.slides)
            ? parsed.hero.slides
            : initialSiteContent.hero.slides,
        },
        project: {
          ...initialSiteContent.project,
          ...parsed.project,
          mediaType: parsed.project?.mediaType || initialSiteContent.project.mediaType || 'photo',
          videoUrl: parsed.project?.videoUrl ?? initialSiteContent.project.videoUrl ?? '',
          slides: Array.isArray(parsed.project?.slides)
            ? parsed.project.slides
            : initialSiteContent.project.slides,
        },
        activities: {
          ...initialSiteContent.activities,
          ...(parsed.activities || {}),
          items: Array.isArray(parsed.activities?.items)
            ? parsed.activities.items
            : initialSiteContent.activities.items,
        },
        leadership: {
          ...initialSiteContent.leadership,
          ...(parsed.leadership || {}),
          members: Array.isArray(parsed.leadership?.members)
            ? parsed.leadership.members
            : initialSiteContent.leadership.members,
        },
        contact: {
          ...initialSiteContent.contact,
          ...(parsed.contact || {}),
          mapsEmbedUrl: parsed.contact?.mapsEmbedUrl || initialSiteContent.contact.mapsEmbedUrl,
          mapsUrl: parsed.contact?.mapsUrl || initialSiteContent.contact.mapsUrl,
        },
      };
    }
  } catch (error) {
    console.error('Database getSiteContent error:', error);
  }
  return initialSiteContent;
}

export function updateSiteContent(newContent: SiteContent): SiteContent {
  const db = getDb();
  db.prepare(`
    INSERT INTO site_content (id, data, updated_at) 
    VALUES ('main', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
  `).run(JSON.stringify(newContent));
  return newContent;
}

export function resetSiteContent(): SiteContent {
  const db = getDb();
  db.prepare(`
    INSERT INTO site_content (id, data, updated_at) 
    VALUES ('main', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
  `).run(JSON.stringify(initialSiteContent));
  return initialSiteContent;
}

export function saveInquiry(inquiry: { name: string; phone: string; email?: string; message?: string }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO inquiries (name, phone, email, message)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(inquiry.name, inquiry.phone, inquiry.email || '', inquiry.message || '');
}

export function getInquiries() {
  const db = getDb();
  return db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all();
}
