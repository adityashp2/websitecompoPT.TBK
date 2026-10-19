import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://emluamqrtbakrikurmsz.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_Ax92lEPNOwmEvrfn9-rSrw_7uA7CK7t';

export function getSupabaseUrl(): string {
  const raw =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_ANON_KEY
  ).trim();
}

export function getSupabaseServiceRoleKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  ).trim();
}

/**
 * Check if valid Supabase credentials have been configured
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  const service = getSupabaseServiceRoleKey();
  return Boolean(
    url &&
    url.startsWith('https://') &&
    !url.includes('your-project-id') &&
    (anon || service) &&
    !anon.includes('your-anon-key')
  );
}

// Global cached client instances for Next.js runtime
let _adminClient: SupabaseClient | null = null;
let _publicClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client with Service Role privileges (bypasses RLS)
 * Used in Route Handlers and Server Components for administrative operations.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!_adminClient) {
    const url = getSupabaseUrl();
    const key = getSupabaseServiceRoleKey() || getSupabaseAnonKey();
    _adminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _adminClient;
}

/**
 * Public Supabase client using Anon Key (respects RLS)
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!_publicClient) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey() || getSupabaseServiceRoleKey();
    _publicClient = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
  }
  return _publicClient;
}
