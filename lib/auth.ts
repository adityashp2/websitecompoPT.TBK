import crypto from 'crypto';
import { getDb } from './db';
import { isSupabaseConfigured, getSupabaseAdminClient } from './supabase';

export interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  name: string;
  role: string;
  created_at?: string;
  last_login?: string | null;
}

export const ADMIN_COOKIE_NAME = 'tbk_admin_session';

/**
 * Hash password with PBKDF2 using SHA-512 and unique salt
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

/**
 * Verify password against stored hash and salt
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const calculatedHash = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(calculatedHash), Buffer.from(hash));
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Authenticate admin by username or email and password (SQLite primary with Supabase fallback)
 */
export async function authenticateAdmin(identifier: string, password: string): Promise<AdminUser | null> {
  const cleanId = identifier.trim().toLowerCase();

  // 1. Try local SQLite first (instant local SSD check, < 1ms)
  try {
    const db = getDb();
    const user = db.prepare(`
      SELECT id, username, email, password_hash, salt, name, role
      FROM admin_users 
      WHERE LOWER(username) = ? OR LOWER(email) = ?
    `).get(cleanId, cleanId) as {
      id: number;
      username: string;
      email: string | null;
      password_hash: string;
      salt: string;
      name: string;
      role: string;
    } | undefined;

    const cleanPass = password;
    const isValid = user && (
      verifyPassword(cleanPass, user.password_hash, user.salt) ||
      verifyPassword(cleanPass.trim(), user.password_hash, user.salt)
    );

    if (user && isValid) {
      db.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
  } catch (error) {
    console.error('Error authenticating admin in SQLite:', error);
  }

  // 2. Fallback to Supabase if configured and not found in SQLite
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data: users, error } = await supabase
          .from('admin_users')
          .select('id, username, email, password_hash, salt, name, role')
          .or(`username.ilike.${cleanId},email.ilike.${cleanId}`)
          .limit(1);

        if (!error && users && users.length > 0) {
          const user = users[0];
          const isValid = verifyPassword(password, user.password_hash, user.salt);
          if (isValid) {
            await supabase
              .from('admin_users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', user.id);

            return {
              id: Number(user.id),
              username: user.username,
              email: user.email,
              name: user.name,
              role: user.role || 'admin',
            };
          }
          return null;
        }
      }
    } catch (err) {
      console.warn('Supabase authenticateAdmin error:', err);
    }
  }

  return null;
}

/**
 * Create a persistent session (both in Supabase and SQLite)
 */
export async function createAdminSession(userId: number, rememberMe: boolean = false): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomBytes(32).toString('hex');
  const durationDays = rememberMe ? 30 : 1;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  // SQLite session
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO admin_sessions (token, user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(token, userId, expiresAt.toISOString());
  } catch (err) {
    console.error('SQLite createAdminSession error:', err);
  }

  // Supabase session
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        await supabase.from('admin_sessions').insert([{
          token,
          user_id: userId,
          expires_at: expiresAt.toISOString(),
        }]);
      }
    } catch (err) {
      console.error('Supabase createAdminSession error:', err);
    }
  }

  return { token, expiresAt };
}

/**
 * Verify session token and retrieve associated admin user
 */
export async function getAdminFromSession(token: string): Promise<AdminUser | null> {
  if (!token) return null;
  const nowIso = new Date().toISOString();

  // 1. Try local SQLite session first (instant local check, < 1ms)
  try {
    const db = getDb();
    const row = db.prepare(`
      SELECT 
        u.id, u.username, u.email, u.name, u.role, u.created_at, u.last_login,
        s.expires_at
      FROM admin_sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > ?
    `).get(token, nowIso) as (AdminUser & { expires_at: string }) | undefined;

    if (row) {
      return {
        id: row.id,
        username: row.username,
        email: row.email,
        name: row.name,
        role: row.role,
        created_at: row.created_at,
        last_login: row.last_login,
      };
    }
  } catch (err) {
    console.error('SQLite getAdminFromSession error:', err);
  }

  // 2. Fallback to Supabase if configured and not found in SQLite
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('admin_sessions')
          .select('expires_at, admin_users:user_id (id, username, email, name, role, created_at, last_login)')
          .eq('token', token)
          .gt('expires_at', nowIso)
          .single();

        if (data && data.admin_users && !error) {
          const user = Array.isArray(data.admin_users) ? data.admin_users[0] : data.admin_users;
          return {
            id: Number(user.id),
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role || 'admin',
            created_at: user.created_at,
            last_login: user.last_login,
          };
        }
      }
    } catch (err) {
      console.warn('Supabase getAdminFromSession error:', err);
    }
  }

  return null;
}

/**
 * Delete session token on logout
 */
export async function deleteAdminSession(token: string): Promise<void> {
  if (!token) return;

  try {
    const db = getDb();
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  } catch (err) {
    console.error('SQLite deleteAdminSession error:', err);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        await supabase.from('admin_sessions').delete().eq('token', token);
      }
    } catch (err) {
      console.error('Supabase deleteAdminSession error:', err);
    }
  }
}

/**
 * Helper to check current admin authentication from request cookies or Authorization header
 */
export async function getCurrentAdminUser(req?: Request): Promise<AdminUser | null> {
  try {
    let token: string | undefined;

    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      const { cookies } = require('next/headers');
      const cookieStore = cookies();
      token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    }

    if (!token) return null;
    return await getAdminFromSession(token);
  } catch {
    return null;
  }
}

/**
 * Change admin password
 */
export async function changeAdminPassword(
  userId: number,
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; message: string }> {
  try {
    let currentUser: { password_hash: string; salt: string } | null = null;

    // Check in Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdminClient();
        if (supabase) {
          const { data } = await supabase
            .from('admin_users')
            .select('password_hash, salt')
            .eq('id', userId)
            .single();
          if (data) currentUser = data;
        }
      } catch (e) {
        console.warn('Supabase fetch user error:', e);
      }
    }

    // Fallback check in SQLite
    if (!currentUser) {
      const db = getDb();
      currentUser = db.prepare('SELECT password_hash, salt FROM admin_users WHERE id = ?').get(userId) as any;
    }

    if (!currentUser) {
      return { success: false, message: 'Pengguna admin tidak ditemukan.' };
    }

    const isValid = verifyPassword(currentPass, currentUser.password_hash, currentUser.salt);
    if (!isValid) {
      return { success: false, message: 'Kata sandi saat ini tidak sesuai.' };
    }

    if (newPass.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPass, newSalt);

    // Update SQLite
    try {
      const db = getDb();
      db.prepare('UPDATE admin_users SET password_hash = ?, salt = ? WHERE id = ?').run(newHash, newSalt, userId);
    } catch (err) {
      console.error('SQLite password update error:', err);
    }

    // Update Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdminClient();
        if (supabase) {
          await supabase
            .from('admin_users')
            .update({ password_hash: newHash, salt: newSalt })
            .eq('id', userId);
        }
      } catch (err) {
        console.error('Supabase password update error:', err);
      }
    }

    return { success: true, message: 'Kata sandi berhasil diperbarui.' };
  } catch (error) {
    console.error('Error changing admin password:', error);
    return { success: false, message: 'Terjadi kesalahan sistem saat memperbarui kata sandi.' };
  }
}
