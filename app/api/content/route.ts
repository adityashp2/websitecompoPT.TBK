import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteContent, updateSiteContent, resetSiteContent } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to get content:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Data tidak valid' }, { status: 400 });
    }
    const updated = updateSiteContent(body);
    try {
      revalidatePath('/', 'layout');
    } catch {}
    return NextResponse.json({ success: true, data: updated, message: 'Data berhasil diperbarui di database SQL' });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json().catch(() => ({}));
    if (action === 'reset') {
      const reset = resetSiteContent();
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
