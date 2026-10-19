import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Calculator, MessageSquare, Compass } from 'lucide-react';

export const metadata = {
  title: '404 - Halaman Tidak Ditemukan | PT. Terbang Bersama Kawan',
  description: 'Halaman yang Anda tuju belum tersedia atau telah dipindahkan. Kembali ke beranda PT. Terbang Bersama Kawan.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col items-center justify-center p-6 text-center font-serif relative selection:bg-white selection:text-black">
      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Monospace 404 Overline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#262626] font-mono text-[10px] tracking-[0.25em] text-[#999999] uppercase mb-6">
          <Compass className="w-3.5 h-3.5 text-white" />
          <span>Error 404 &bull; Halaman Tidak Ditemukan</span>
        </div>

        <h1 className="font-display uppercase text-4xl sm:text-6xl text-white font-normal mb-4 tracking-[0.06em]">
          Laman Tidak Ditemukan
        </h1>
        <p className="font-serif text-[#999999] text-base sm:text-lg mb-10 leading-relaxed max-w-md">
          Halaman yang Anda tuju tidak ditemukan, telah dipindahkan, atau alamat URL yang Anda masukkan kurang tepat.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-12">
          <Link
            href="/"
            className="btn-bugatti-primary justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/proyek"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-[#262626] hover:border-[#3a3a3a] text-white font-mono text-xs uppercase tracking-[0.2em] transition-all"
          >
            <Building2 className="w-4 h-4 text-[#999999]" />
            <span>Puri Gunung Langgar</span>
          </Link>
        </div>

        {/* Quick Help Links */}
        <div className="w-full pt-8 border-t border-[#262626] flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-[#999999]">
          <Link href="/simulasi-kpr" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulasi KPR</span>
          </Link>
          <span className="text-[#3a3a3a]">&bull;</span>
          <Link href="/kontak" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kontak Kami</span>
          </Link>
        </div>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999]">
          &copy; {new Date().getFullYear()} PT. Terbang Bersama Kawan
        </p>
      </div>
    </div>
  );
}
