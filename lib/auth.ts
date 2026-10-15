import crypto from 'crypto';
import { getDb } from './db';

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
  const calculatedHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(calculatedHash), Buffer.from(hash));
}

/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Authenticate admin by username or email and password
 */
export function authenticateAdmin(identifier: string, password: string): AdminUser | null {
  try {
    const db = getDb();
    const cleanId = identifier.trim().toLowerCase();

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

    if (!user) {
      return null;
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return null;
    }

    // Update last_login
    db.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error('Error authenticating admin:', error);
    return null;
  }
}

/**
 * Create a persistent session in SQLite
 */
export function createAdminSession(userId: number, rememberMe: boolean = false): { token: string; expiresAt: Date } {
  const db = getDb();
  const token = crypto.randomBytes(32).toString('hex');
  
  // 30 days if rememberMe, otherwise 1 day
  const durationDays = rememberMe ? 30 : 1;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  db.prepare(`
    INSERT INTO admin_sessions (token, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(token, userId, expiresAt.toISOString());

  return { token, expiresAt };
}

/**
 * Verify session token and retrieve associated admin user
 */
export function getAdminFromSession(token: string): AdminUser | null {
  if (!token) return null;

  try {
    const db = getDb();
    const nowIso = new Date().toISOString();

    // Query active session and join with admin_users
    const row = db.prepare(`
      SELECT 
        u.id, u.username, u.email, u.name, u.role, u.created_at, u.last_login,
        s.expires_at
      FROM admin_sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > ?
    `).get(token, nowIso) as (AdminUser & { expires_at: string }) | undefined;

    if (!row) {
      // Clean up expired session if token existed
      db.prepare('DELETE FROM admin_sessions WHERE token = ? OR expires_at <= ?').run(token, nowIso);
      return null;
    }

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      name: row.name,
      role: row.role,
      created_at: row.created_at,
      last_login: row.last_login,
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

/**
 * Delete a session (logout)
 */
export function deleteAdminSession(token: string): boolean {
  if (!token) return false;
  try {
    const db = getDb();
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

/**
 * Change admin password
 */
export function changeAdminPassword(userId: number, currentPass: string, newPass: string): { success: boolean; message: string } {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, password_hash, salt FROM admin_users WHERE id = ?').get(userId) as {
      id: number;
      password_hash: string;
      salt: string;
    } | undefined;

    if (!user) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }

    if (!verifyPassword(currentPass, user.password_hash, user.salt)) {
      return { success: false, message: 'Password saat ini tidak sesuai.' };
    }

    if (newPass.length < 6) {
      return { success: false, message: 'Password baru minimal 6 karakter.' };
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPass, newSalt);

    db.prepare('UPDATE admin_users SET password_hash = ?, salt = ? WHERE id = ?').run(newHash, newSalt, userId);

    return { success: true, message: 'Password berhasil diubah secara permanen.' };
  } catch (error) {
    console.error('Error changing admin password:', error);
    return { success: false, message: 'Terjadi kesalahan sistem saat mengubah password.' };
  }
}
