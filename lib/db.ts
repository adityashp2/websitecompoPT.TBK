import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { initialSiteContent, SiteContent } from './initialData';
import { isSupabaseConfigured, getSupabaseAdminClient } from './supabase';

export const isVercelEnvironment = Boolean(
  process.env.VERCEL || 
  process.env.NEXT_PUBLIC_VERCEL_ENV || 
  process.env.AWS_LAMBDA_FUNCTION_NAME
);

declare global {
  // eslint-disable-next-line no-var
  var __sqliteDbInstance: Database.Database | undefined;
}

/**
 * Initialize or get SQLite instance (acts as primary local DB or fallback)
 * Automatically bypassed on Vercel serverless where filesystem is read-only.
 */
export function getDb(): Database.Database | null {
  if (isVercelEnvironment) return null;
  if (global.__sqliteDbInstance) return global.__sqliteDbInstance;

  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'content.db');
    const dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('synchronous = NORMAL');
    dbInstance.pragma('temp_store = MEMORY');
    dbInstance.pragma('mmap_size = 268435456');
    dbInstance.pragma('cache_size = -16000');
    dbInstance.pragma('busy_timeout = 5000');
    global.__sqliteDbInstance = dbInstance;

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

      CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);

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
        user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_exp ON admin_sessions(token, expires_at);
    `);

    // Check if default admin exists, if not seed default admin
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
  } catch (err) {
    console.warn('SQLite initialization skipped:', err);
    return null;
  }
}

/**
 * Merge raw database JSON with initialSiteContent defaults
 */
export function mergeWithDefaults(parsed: any): SiteContent {
  if (!parsed || typeof parsed !== 'object') return initialSiteContent;

  return {
    ...initialSiteContent,
    ...parsed,
    bannerSlides: Array.isArray(parsed.bannerSlides)
      ? parsed.bannerSlides
      : initialSiteContent.bannerSlides,
    hero: {
      ...initialSiteContent.hero,
      ...parsed.hero,
      headlineTop: parsed.hero?.headlineTop ?? initialSiteContent.hero.headlineTop,
      headlineBottom: parsed.hero?.headlineBottom ?? initialSiteContent.hero.headlineBottom,
      bodyText: parsed.hero?.bodyText ?? initialSiteContent.hero.bodyText,
      activeBadgeLabel: parsed.hero?.activeBadgeLabel ?? initialSiteContent.hero.activeBadgeLabel,
      activeBadgeProject: parsed.hero?.activeBadgeProject ?? initialSiteContent.hero.activeBadgeProject,
      slides: Array.isArray(parsed.hero?.slides)
        ? parsed.hero.slides
        : initialSiteContent.hero.slides,
      stats: Array.isArray(parsed.hero?.stats)
        ? parsed.hero.stats
        : (initialSiteContent.hero?.stats || []),
    },
    project: {
      ...initialSiteContent.project,
      ...parsed.project,
      mediaType: parsed.project?.mediaType || initialSiteContent.project.mediaType || 'photo',
      videoUrl: parsed.project?.videoUrl ?? initialSiteContent.project.videoUrl ?? '',
      slides: Array.isArray(parsed.project?.slides)
        ? parsed.project.slides
        : (initialSiteContent.project?.slides || []),
      specs: Array.isArray(parsed.project?.specs)
        ? parsed.project.specs
        : (initialSiteContent.project?.specs || []),
      highlights: Array.isArray(parsed.project?.highlights)
        ? parsed.project.highlights
        : (initialSiteContent.project?.highlights || []),
      floorPlan: Array.isArray(parsed.project?.floorPlan)
        ? parsed.project.floorPlan
        : (initialSiteContent.project?.floorPlan || []),
      locationAdvantages: Array.isArray(parsed.project?.locationAdvantages)
        ? parsed.project.locationAdvantages
        : (initialSiteContent.project?.locationAdvantages || []),
      surveyCta: parsed.project?.surveyCta
        ? { ...initialSiteContent.project?.surveyCta, ...parsed.project.surveyCta }
        : initialSiteContent.project?.surveyCta,
    },
    activities: {
      ...initialSiteContent.activities,
      ...(parsed.activities || {}),
      items: Array.isArray(parsed.activities?.items)
        ? parsed.activities.items
        : (initialSiteContent.activities?.items || []),
    },
    leadership: {
      ...initialSiteContent.leadership,
      ...(parsed.leadership || {}),
      operationalTitle: parsed.leadership?.operationalTitle ?? initialSiteContent.leadership.operationalTitle,
      operationalSubtitle: parsed.leadership?.operationalSubtitle ?? initialSiteContent.leadership.operationalSubtitle,
      members: Array.isArray(parsed.leadership?.members)
        ? parsed.leadership.members
        : (initialSiteContent.leadership?.members || []),
    },
    buyingProcess: {
      ...initialSiteContent.buyingProcess,
      ...(parsed.buyingProcess || {}),
      steps: Array.isArray(parsed.buyingProcess?.steps)
        ? parsed.buyingProcess.steps
        : (initialSiteContent.buyingProcess?.steps || []),
    },
    kprSimulation: {
      ...initialSiteContent.kprSimulation,
      ...(parsed.kprSimulation || {}),
      benefits: Array.isArray(parsed.kprSimulation?.benefits)
        ? parsed.kprSimulation.benefits
        : (initialSiteContent.kprSimulation?.benefits || []),
    },
    contact: {
      ...initialSiteContent.contact,
      ...(parsed.contact || {}),
      mapsEmbedUrl: parsed.contact?.mapsEmbedUrl ?? initialSiteContent.contact.mapsEmbedUrl,
      mapsUrl: parsed.contact?.mapsUrl ?? initialSiteContent.contact.mapsUrl,
    },
    legal: {
      ...initialSiteContent.legal,
      ...(parsed.legal || {}),
      landStatus: parsed.legal?.landStatus ?? initialSiteContent.legal.landStatus,
      landStatusDetail: parsed.legal?.landStatusDetail ?? initialSiteContent.legal.landStatusDetail,
      records: Array.isArray(parsed.legal?.records)
        ? parsed.legal.records
        : (initialSiteContent.legal?.records || []),
    },
    about: {
      ...initialSiteContent.about,
      ...(parsed.about || {}),
      missions: Array.isArray(parsed.about?.missions) ? parsed.about.missions : (initialSiteContent.about?.missions || []),
      commitmentTitle: parsed.about?.commitmentTitle ?? initialSiteContent.about.commitmentTitle,
      commitmentBody: parsed.about?.commitmentBody ?? initialSiteContent.about.commitmentBody,
      commitmentPoints: Array.isArray(parsed.about?.commitmentPoints) ? parsed.about.commitmentPoints : (initialSiteContent.about?.commitmentPoints || []),
      officeImage: parsed.about?.officeImage !== undefined ? parsed.about.officeImage : initialSiteContent.about.officeImage,
      officeCaption: parsed.about?.officeCaption !== undefined ? parsed.about.officeCaption : initialSiteContent.about.officeCaption,
      homeIntroBadge: parsed.about?.homeIntroBadge ?? initialSiteContent.about.homeIntroBadge,
      homeIntroTitle: parsed.about?.homeIntroTitle ?? initialSiteContent.about.homeIntroTitle,
      homeIntroHighlight: parsed.about?.homeIntroHighlight ?? initialSiteContent.about.homeIntroHighlight,
      homeIntroText: parsed.about?.homeIntroText ?? initialSiteContent.about.homeIntroText,
      homeIntroCtaText: parsed.about?.homeIntroCtaText ?? initialSiteContent.about.homeIntroCtaText,
      homeIntroCtaLink: parsed.about?.homeIntroCtaLink ?? initialSiteContent.about.homeIntroCtaLink,
      features: Array.isArray(parsed.about?.features)
        ? parsed.about.features
        : (initialSiteContent.about?.features || []),
      values: Array.isArray(parsed.about?.values)
        ? parsed.about.values
        : (initialSiteContent.about?.values || []),
    },
    socialLinks: {
      ...(initialSiteContent.socialLinks || {}),
      ...(parsed.socialLinks || {}),
    },
    footer: {
      ...initialSiteContent.footer,
      ...(parsed.footer || {}),
      tagline: parsed.footer?.tagline ?? initialSiteContent.footer.tagline,
    },
    promoPopup: {
      ...initialSiteContent.promoPopup,
      ...(parsed.promoPopup || {}),
      enabled: typeof parsed.promoPopup?.enabled === 'boolean'
        ? parsed.promoPopup.enabled
        : (initialSiteContent.promoPopup?.enabled ?? true),
      image: parsed.promoPopup?.image !== undefined ? parsed.promoPopup.image : (initialSiteContent.promoPopup?.image || '/uploads/spek-rmh-1792149341412.jpg'),
      greeting: parsed.promoPopup?.greeting ?? initialSiteContent.promoPopup?.greeting,
      highlightText: parsed.promoPopup?.highlightText ?? initialSiteContent.promoPopup?.highlightText,
      urgencyText: parsed.promoPopup?.urgencyText ?? initialSiteContent.promoPopup?.urgencyText,
    },
    partners: {
      ...initialSiteContent.partners,
      ...(parsed.partners || {}),
      badge: parsed.partners?.badge ?? initialSiteContent.partners?.badge,
      title: parsed.partners?.title ?? initialSiteContent.partners?.title,
      subtitle: parsed.partners?.subtitle ?? initialSiteContent.partners?.subtitle,
      enabled: typeof parsed.partners?.enabled === 'boolean'
        ? parsed.partners.enabled
        : (initialSiteContent.partners?.enabled ?? true),
      items: Array.isArray(parsed.partners?.items) && parsed.partners.items.length > 0
        ? parsed.partners.items
        : (initialSiteContent.partners?.items || []),
    },
  };
}

/**
 * Get site content from SQLite
 */
function getSiteContentSqlite(): SiteContent {
  try {
    const db = getDb();
    const row = db.prepare("SELECT data FROM site_content WHERE id = 'main'").get() as { data: string } | undefined;
    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      return mergeWithDefaults(parsed);
    }
  } catch (error) {
    console.error('SQLite getSiteContent error:', error);
  }
  return initialSiteContent;
}

/**
 * Get site content (Supabase cloud primary when configured, SQLite fallback on local)
 */
export async function getSiteContent(): Promise<SiteContent> {
  // 1. Supabase primary read if configured (essential for Vercel serverless persistence)
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('site_content')
          .select('data')
          .eq('id', 'main')
          .single();

        if (data && data.data && !error) {
          const raw = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          return mergeWithDefaults(raw);
        }
        if (error) {
          console.warn('Supabase getSiteContent error:', JSON.stringify(error));
        }
      }
    } catch (err) {
      console.warn('Supabase query failed:', err);
    }
  }

  // If running on Vercel serverless, never touch SQLite filesystem
  if (isVercelEnvironment) {
    return initialSiteContent;
  }

  // 2. Local SQLite read (development only)
  try {
    const db = getDb();
    if (db) {
      const row = db.prepare("SELECT data FROM site_content WHERE id = 'main'").get() as { data: string } | undefined;
      if (row && row.data) {
        const parsed = JSON.parse(row.data);
        return mergeWithDefaults(parsed);
      }
    }
  } catch (error) {
    console.error('SQLite getSiteContent error:', error);
  }

  return initialSiteContent;
}

/**
 * Update site content in SQLite (local dev only)
 */
function updateSiteContentSqlite(newContent: SiteContent): SiteContent {
  if (isVercelEnvironment) return newContent;
  try {
    const db = getDb();
    if (db) {
      db.prepare(`
        INSERT INTO site_content (id, data, updated_at) 
        VALUES ('main', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
      `).run(JSON.stringify(newContent));
    }
  } catch (err) {
    console.error('SQLite updateSiteContent error:', err);
  }
  return newContent;
}

/**
 * Update site content (both Supabase and local SQLite backup)
 */
export async function updateSiteContent(newContent: SiteContent): Promise<SiteContent> {
  // Update local SQLite as backup only when not on Vercel
  if (!isVercelEnvironment) {
    updateSiteContentSqlite(newContent);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { error } = await supabase
          .from('site_content')
          .upsert({
            id: 'main',
            data: newContent,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Supabase updateSiteContent error:', JSON.stringify(error, null, 2));
        }
      }
    } catch (err) {
      console.error('Supabase sync error:', err);
    }
  }

  return newContent;
}

/**
 * Reset site content to official default data
 */
export async function resetSiteContent(): Promise<SiteContent> {
  if (!isVercelEnvironment) {
    try {
      const db = getDb();
      if (db) {
        db.prepare(`
          INSERT INTO site_content (id, data, updated_at) 
          VALUES ('main', ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
        `).run(JSON.stringify(initialSiteContent));
      }
    } catch (err) {
      console.error('SQLite resetSiteContent error:', err);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        await supabase
          .from('site_content')
          .upsert({
            id: 'main',
            data: initialSiteContent,
            updated_at: new Date().toISOString(),
          });
      }
    } catch (err) {
      console.error('Supabase resetSiteContent error:', err);
    }
  }

  return initialSiteContent;
}

/**
 * Save user inquiry message
 */
export async function saveInquiry(inquiry: { name: string; phone: string; email?: string; message?: string }) {
  // Save to SQLite only if not on Vercel
  if (!isVercelEnvironment) {
    try {
      const db = getDb();
      if (db) {
        const stmt = db.prepare(`
          INSERT INTO inquiries (name, phone, email, message)
          VALUES (?, ?, ?, ?)
        `);
        stmt.run(inquiry.name, inquiry.phone, inquiry.email || '', inquiry.message || '');
      }
    } catch (err) {
      console.error('SQLite saveInquiry error:', err);
    }
  }

  // Save to Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        await supabase.from('inquiries').insert([{
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email || null,
          message: inquiry.message || null,
        }]);
      }
    } catch (err) {
      console.error('Supabase saveInquiry error:', JSON.stringify(err));
    }
  }
}

/**
 * Get all inquiry messages
 */
export async function getInquiries() {
  // 1. Supabase read first when configured (cloud persistent)
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && !error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Supabase getInquiries error:', err);
    }
  }

  // If on Vercel, return empty array without touching SQLite
  if (isVercelEnvironment) {
    return [];
  }

  // 2. Local SQLite fallback (development only)
  try {
    const db = getDb();
    if (db) {
      const rows = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all();
      if (rows && rows.length > 0) {
        return rows;
      }
    }
  } catch (err) {
    console.error('SQLite getInquiries error:', err);
  }

  return [];
}

/**
 * Delete a single inquiry message by id
 */
export async function deleteInquiry(id: number): Promise<boolean> {
  let success = false;

  if (!isVercelEnvironment) {
    try {
      const db = getDb();
      if (db) {
        const res = db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
        success = res.changes > 0;
      }
    } catch (err) {
      console.error('SQLite deleteInquiry error:', err);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { error } = await supabase.from('inquiries').delete().eq('id', id);
        if (!error) success = true;
      }
    } catch (err) {
      console.error('Supabase deleteInquiry error:', err);
    }
  }

  return success;
}

/**
 * Clear all inquiry messages
 */
export async function clearAllInquiries(): Promise<boolean> {
  if (!isVercelEnvironment) {
    try {
      const db = getDb();
      if (db) {
        db.prepare('DELETE FROM inquiries').run();
      }
    } catch (err) {
      console.error('SQLite clearAllInquiries error:', err);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        await supabase.from('inquiries').delete().neq('id', 0);
      }
    } catch (err) {
      console.error('Supabase clearAllInquiries error:', err);
    }
  }

  return true;
}
