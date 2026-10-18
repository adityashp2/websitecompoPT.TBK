import { NextResponse } from 'next/server';
import { saveInquiry, getInquiries, deleteInquiry, clearAllInquiries } from '@/lib/db';
import { getCurrentAdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan untuk melihat pesan calon konsumen.' },
        { status: 401 }
      );
    }

    const list = await getInquiries();
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Failed to get inquiries:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil pesan masuk' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;
    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Nama dan nomor telepon wajib diisi' }, { status: 400 });
    }
    await saveInquiry({ name, phone, email, message });
    return NextResponse.json({ success: true, message: 'Pesan Anda telah berhasil kami terima.' });
  } catch (error) {
    console.error('Failed to save inquiry:', error);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan pesan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getCurrentAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan untuk menghapus pesan.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const allParam = searchParams.get('all');

    if (allParam === 'true') {
      await clearAllInquiries();
      return NextResponse.json({ success: true, message: 'Semua pesan masuk berhasil dihapus.' });
    }

    if (!idParam) {
      return NextResponse.json({ success: false, error: 'ID pesan yang ingin dihapus wajib disertakan.' }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    const deleted = await deleteInquiry(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Pesan tidak ditemukan atau sudah dihapus.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Pesan berhasil dihapus dari database.' });
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus pesan' }, { status: 500 });
  }
}

