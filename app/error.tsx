'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, MessageSquare } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Next.js Runtime Error Captured:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col items-center justify-center p-6 text-center font-serif relative selection:bg-white selection:text-black">
      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#262626] font-mono text-[10px] tracking-[0.25em] text-[#999999] uppercase mb-6">
          <AlertTriangle className="w-3.5 h-3.5 text-white" />
          <span>Kendala Sistem Terdeteksi</span>
        </div>

        <h1 className="font-display uppercase text-4xl sm:text-6xl text-white font-normal mb-4 tracking-[0.06em]">
          Kendala Memuat Halaman
        </h1>
        <p className="font-serif text-[#999999] text-base sm:text-lg mb-6 leading-relaxed max-w-md">
          Sistem mendeteksi adanya kendala sementara saat merender konten. Silakan coba muat ulang halaman ini atau kembali ke beranda.
        </p>

        {/* Error Digest */}
        {error.digest && (
          <div className="mb-8 px-4 py-2 bg-[#141414] border border-[#262626] font-mono text-[10px] tracking-[0.2em] text-[#999999] uppercase">
            ID Referensi: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-12">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-bugatti-primary justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span>Coba Muat Ulang</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-[#262626] hover:border-[#3a3a3a] text-white font-mono text-xs uppercase tracking-[0.2em] transition-all"
          >
            <Home className="w-4 h-4 text-[#999999]" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Support Link */}
        <div className="w-full pt-8 border-t border-[#262626] flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.15em] text-[#999999]">
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Hubungi Tim PT. TBK</span>
          </Link>
        </div>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999]">
          &copy; {new Date().getFullYear()} PT. Terbang Bersama Kawan
        </p>
      </div>
    </div>
  );
}
