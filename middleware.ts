import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize lowercase /a9min to /A9MIN
  if (pathname === '/a9min' || pathname.startsWith('/a9min/')) {
    const normalizedPath = pathname.replace(/^\/a9min/, '/A9MIN');
    const url = request.nextUrl.clone();
    url.pathname = normalizedPath;
    return NextResponse.redirect(url);
  }

  // Protect /A9MIN & /admin-studio routes, but bypass /A9MIN/login and its sub-resources
  const isProtectedAdmin = (pathname.startsWith('/A9MIN') || pathname.startsWith('/admin-studio')) && !pathname.startsWith('/A9MIN/login');
  if (isProtectedAdmin) {
    const sessionCookie = request.cookies.get('tbk_admin_session')?.value;

    if (!sessionCookie) {
      const loginUrl = new URL('/A9MIN/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/A9MIN/:path*', '/a9min/:path*', '/A9MIN', '/a9min', '/admin-studio/:path*', '/admin-studio'],
};
