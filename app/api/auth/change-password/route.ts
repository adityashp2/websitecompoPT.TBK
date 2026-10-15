import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminFromSession, changeAdminPassword, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Sesi login tidak sah atau sudah kedaluwarsa.' }, { status: 401 });
    }

    const user = getAdminFromSession(token);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Sesi login tidak sah.' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Silakan isi password saat ini dan password baru.' }, { status: 400 });
    }

    const result = changeAdminPassword(user.id, currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error('API /api/auth/change-password error:', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}
