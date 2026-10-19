import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteContent, updateSiteContent, resetSiteContent } from '@/lib/db';
import { getCurrentAdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(
      { success: true, data: content },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Failed to get content:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan untuk menyimpan perubahan.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Data tidak valid' }, { status: 400 });
    }
    const updated = await updateSiteContent(body);
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/proyek');
      revalidatePath('/tentang');
      revalidatePath('/kegiatan');
      revalidatePath('/pimpinan');
      revalidatePath('/legalitas');
      revalidatePath('/kontak');
      revalidatePath('/simulasi-kpr');
    } catch {}
    return NextResponse.json(
      { success: true, data: updated, message: 'Data berhasil diperbarui di database' },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan untuk aksi ini.' },
        { status: 401 }
      );
    }

    const { action } = await request.json().catch(() => ({}));
    if (action === 'reset') {
      const reset = await resetSiteContent();
      try {
        revalidatePath('/', 'layout');
      } catch {}
      return NextResponse.json({ success: true, data: reset, message: 'Data berhasil direset ke DATA RESMI' });
    }
    return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (error) {
    console.error('Failed to reset content:', error);
    return NextResponse.json({ success: false, error: 'Gagal mereset data' }, { status: 500 });
  }
}
