import { NextResponse } from 'next/server';
import { 
  isSupabaseConfigured, 
  getSupabaseAdminClient, 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  getSupabaseServiceRoleKey 
} from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return NextResponse.json({
      status: 'warning',
      database: 'local_sqlite_fallback',
      supabase: {
        configured: false,
        connected: false,
        message: 'Variabel lingkungan Supabase (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) belum disetel. Sistem menggunakan SQLite / initial data.',
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({
        status: 'error',
        supabase: {
          configured: true,
          connected: false,
          message: 'Client Supabase gagal diinisialisasi.',
        },
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('id')
      .limit(1);

    const url = getSupabaseUrl();
    const serviceKey = getSupabaseServiceRoleKey();
    const anonKey = getSupabaseAnonKey();
    const activeKey = serviceKey || anonKey;

    if (error) {
      return NextResponse.json({
        status: 'error',
        supabase: {
          configured: true,
          connected: false,
          error: error.message,
          targetUrl: url,
          activeKeyMasked: activeKey.slice(0, 16) + '...' + activeKey.slice(-6),
          activeKeyLength: activeKey.length,
          isMatchDefault: activeKey === 'sb_publishable_Ax92lEPNOwmEvrfn9-rSrw_7uA7CK7t',
          hasServiceKey: Boolean(serviceKey),
          hint: 'Pastikan script schema.sql sudah dijalankan di menu SQL Editor Supabase.',
        },
        timestamp: new Date().toISOString(),
      }, { status: 502 });
    }

    return NextResponse.json({
      status: 'ok',
      database: 'supabase',
      supabase: {
        configured: true,
        connected: true,
        message: 'Berhasil terhubung ke database Supabase!',
        recordsFound: data?.length ?? 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      supabase: {
        configured: true,
        connected: false,
        error: err?.message || 'Gagal menghubungi server Supabase',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
