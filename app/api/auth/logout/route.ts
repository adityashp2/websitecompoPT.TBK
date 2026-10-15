import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (token) {
      deleteAdminSession(token);
    }

    // Clear the cookie
    cookieStore.set(ADMIN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    return NextResponse.json({
      success: true,
      message: 'Berhasil keluar (logout).',
    });
  } catch (error) {
    console.error('API /api/auth/logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat logout.' },
      { status: 500 }
    );
  }
}
