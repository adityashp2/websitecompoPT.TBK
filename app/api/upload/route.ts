import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCurrentAdminUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan untuk mengunggah berkas.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file yang dipilih.' }, { status: 400 });
    }

    // Validate mime type (support images and videos)
    const validImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    const validVideoMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const isVideo = validVideoMimes.includes(file.type);
    const isImage = validImageMimes.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Harap upload gambar (JPG, PNG, WebP) atau video (MP4, WebM).' },
        { status: 400 }
      );
    }

    // Validate size (max 50MB for video, 15MB for image)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `Ukuran file terlalu besar. Maksimal ${isVideo ? '50MB untuk video' : '15MB untuk gambar'}.` },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
    const uniqueFileName = `${cleanBase}-${Date.now()}${ext.toLowerCase()}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ success: true, url: publicUrl, name: uniqueFileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengupload file gambar ke server.' },
      { status: 500 }
    );
  }
}
