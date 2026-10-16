import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authenticateAdmin, createAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, rememberMe } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Silakan isi username/email dan password.' },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(identifier, password);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Username/email atau password yang Anda masukkan salah.' },
        { status: 401 }
      );
    }

    // Create session (Supabase / SQLite)
    const { token, expiresAt } = await createAdminSession(admin.id, !!rememberMe);

    // Only enable secure flag if connection is HTTPS
    const isHttps =
      request.headers.get('x-forwarded-proto') === 'https' ||
      request.url.startsWith('https://');

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: admin,
      token,
    });
  } catch (error) {
    console.error('API /api/auth/login error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server saat memproses login.' },
      { status: 500 }
    );
  }
}
