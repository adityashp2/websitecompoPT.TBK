import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (supports both server-only and NEXT_PUBLIC_ prefixes)
const rawSupabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

// Automatically sanitize URL if user appended /rest/v1 or trailing slash
const supabaseUrl = rawSupabaseUrl
  .trim()
  .replace(/\/rest\/v1\/?$/i, '')
  .replace(/\/+$/, '');

const supabaseAnonKey = (
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

const supabaseServiceRoleKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  ''
).trim();

/**
 * Check if valid Supabase credentials have been configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    (supabaseAnonKey || supabaseServiceRoleKey) &&
    !supabaseAnonKey.includes('your-anon-key')
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
    const key = supabaseServiceRoleKey || supabaseAnonKey;
    _adminClient = createClient(supabaseUrl, key, {
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
    _publicClient = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return _publicClient;
}
