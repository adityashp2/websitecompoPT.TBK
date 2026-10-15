import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminFromSession, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = getAdminFromSession(token);
    if (!user) {
      // Invalid or expired token: clear cookie
      cookieStore.set(ADMIN_COOKIE_NAME, '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0),
      });
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('API /api/auth/me error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
