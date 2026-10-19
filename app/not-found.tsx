import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Building2, Calculator, MessageSquare, Compass } from 'lucide-react';

export const metadata = {
  title: '404 - Halaman Tidak Ditemukan | PT. Terbang Bersama Kawan',
  description: 'Halaman yang Anda tuju belum tersedia atau telah dipindahkan. Kembali ke beranda PT. Terbang Bersama Kawan.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071C38] via-[#073B78] to-[#102D52] text-white flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden selection:bg-[#FF9D2E] selection:text-[#071C38]">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-[#FF9D2E]/15 via-[#0A4B91]/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Brand Logo & Icon */}
        <div className="inline-flex items-center justify-center p-3.5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-[#040C18]/60 mb-6">
          <img
            src="/assets/logo-tbk.png"
            alt="Logo PT. TBK"
            className="h-12 w-auto object-contain brightness-105"
          />
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase font-mono mb-4">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Error 404 &bull; Halaman Tidak Ditemukan</span>
        </div>

        <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Oops! Tersesat di Perjalanan?
        </h1>
        <p className="text-blue-100/80 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
          Halaman yang Anda tuju tidak ditemukan, telah dipindahkan, atau alamat URL yang Anda masukkan kurang tepat.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap gap-3.5 justify-center w-full max-w-md mb-8">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF9D2E] to-[#F28A17] hover:brightness-110 active:scale-[0.98] text-[#071C38] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#FF9D2E]/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/proyek"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/25 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 backdrop-blur-md"
          >
            <Building2 className="w-4 h-4 text-[#FF9D2E]" />
            <span>Puri Gunung Langgar</span>
          </Link>
        </div>

        {/* Quick Help Links */}
        <div className="w-full pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-4 text-xs text-blue-200/75">
          <Link href="/simulasi-kpr" className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulasi KPR</span>
          </Link>
          <span className="text-white/30">&bull;</span>
          <Link href="/kontak" className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Kontak Kami</span>
          </Link>
          <span className="text-white/30">&bull;</span>
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Halaman Utama</span>
          </Link>
        </div>

        <p className="mt-8 text-[11.5px] text-white/50">
          &copy; {new Date().getFullYear()} PT. Terbang Bersama Kawan. Pengembang Perumahan Berpengalaman.
        </p>
      </div>
    </div>
  );
}
