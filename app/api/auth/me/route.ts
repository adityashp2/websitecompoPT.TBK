import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminFromSession, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader && authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.substring(7).trim()
      : null;

    const cookieStore = cookies();
    const token = bearerToken || cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await getAdminFromSession(token);
    if (!user) {
      // Invalid or expired token: clear cookie properly on the response
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.delete(ADMIN_COOKIE_NAME);
      response.cookies.set(ADMIN_COOKIE_NAME, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
      return response;
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
