import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E1014] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-[#C9A96A]/40 flex items-center justify-center text-[#C9A96A] mb-6">
        <Home className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#F4EFE6] mb-3">
        404 - Halaman Tidak Ditemukan
      </h1>
      <p className="text-white/70 max-w-md text-sm sm:text-base mb-8 leading-relaxed">
        Halaman yang Anda tuju belum tersedia atau telah dipindahkan. Silakan kembali ke beranda atau telusuri menu lainnya.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A96A] hover:bg-amber-500 text-[#0E1014] font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/proyek"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-white text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <span>Lihat Proyek Puri Gunung Langgar</span>
        </Link>
      </div>
    </div>
  );
}
