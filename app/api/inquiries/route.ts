import { NextResponse } from 'next/server';
import { saveInquiry, getInquiries } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = getInquiries();
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
    saveInquiry({ name, phone, email, message });
    return NextResponse.json({ success: true, message: 'Pesan Anda telah berhasil kami terima.' });
  } catch (error) {
    console.error('Failed to save inquiry:', error);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan pesan' }, { status: 500 });
  }
}
