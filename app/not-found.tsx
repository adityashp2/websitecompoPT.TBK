import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FF9D2E] mb-6 shadow-xl">
        <Home className="w-8 h-8" />
      </div>
      <h1 className="font-sans text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
        404 - Halaman Tidak Ditemukan
      </h1>
      <p className="text-white/85 max-w-md text-sm sm:text-base mb-8 leading-relaxed">
        Halaman yang Anda tuju belum tersedia atau telah dipindahkan. Silakan kembali ke beranda atau telusuri informasi proyek lainnya.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1px] shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/proyek"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/40 hover:border-white hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200"
        >
          <span>Lihat Proyek Puri Gunung Langgar</span>
        </Link>
      </div>
    </div>
  );
}
