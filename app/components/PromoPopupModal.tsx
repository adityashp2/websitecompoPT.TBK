'use client';

import React, { useState, useEffect } from 'react';
import { PromoPopup } from '@/lib/initialData';
import { X, Sparkles, Clock, CheckCircle2, MessageCircle, ShieldCheck, Zap, FileText, Home } from 'lucide-react';

interface PromoPopupModalProps {
  promo?: PromoPopup;
}

export default function PromoPopupModal({ promo }: PromoPopupModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (promo?.enabled && promo?.image) {
      setMounted(true);
      const timer = setTimeout(() => {
        setAnimating(true);
      }, 60);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
      setMounted(false);
    }
  }, [promo?.enabled, promo?.image]);

  const handleClose = () => {
    setAnimating(false);
    setTimeout(() => {
      setMounted(false);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mounted) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted]);

  if (!promo || !promo.enabled || !promo.image || !mounted) {
    return null;
  }

  const ctaUrl = promo.ctaUrl || 'https://wa.me/6281278901234';
  const ctaText = promo.ctaText || 'Daftar sekarang!!!';
  const greeting = promo.greeting || '👋 Hai, calon pemilik rumah impian!';
  const highlightText = promo.highlightText || 'JANGAN LEWATKAN KESEMPATAN UNTUK MEMILIKI HUNIAN RESMI BERSUBSIDI';
  const title = promo.title || 'PURI GUNUNG LANGGAR';
  const badge = promo.badge || 'BATCH SUBSIDI TAHUN 2026';
  const urgencyText = promo.urgencyText || '⏰ Amankan tempatmu sekarang sebelum terlambat!';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Iklan Promo Spesial"
      className={`fixed inset-0 z-[9999] flex items-start justify-center pt-2 sm:pt-4 md:pt-6 p-2 sm:p-4 bg-black/60 backdrop-blur-sm select-none overflow-y-auto transition-opacity duration-200 ${
        animating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Container: Warm Ivory / Cream Palette like Screenshot */}
      <div
        className={`relative w-full max-w-4xl bg-[#FAF6EE] rounded-[24px] sm:rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-[#E9DCBF] p-4 sm:p-6 md:p-7 max-h-[calc(100vh-20px)] sm:max-h-[calc(100vh-32px)] overflow-y-auto transition-all duration-300 transform ${
          animating ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-98'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dark Navy Circular Close Button in Top-Right */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#102D52] hover:bg-rose-600 text-white flex items-center justify-center transition-all duration-200 hover:rotate-90 active:scale-95 border border-[#102D52] shadow-md"
          aria-label="Tutup iklan promo"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-7 items-center pt-1">
          {/* Kolom Kiri: Poster Flyer dengan Frame Krem Hangat */}
          <div className="md:col-span-6 flex items-center justify-center">
            <a
              href={ctaUrl}
              target={ctaUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={handleClose}
              className="block w-full cursor-pointer focus:outline-none group"
              title="Klik poster untuk hubungi marketing / daftar promo"
            >
              <div className="relative w-full bg-[#F3EBDA]/90 rounded-2xl p-2 sm:p-2.5 border border-[#E2D4BC] shadow-sm group-hover:border-[#FF9D2E]/70 transition-all duration-300 group-hover:shadow-md">
                {/* Badge Navy di Pojok Kiri Atas Poster */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102D52] text-[#FF9D2E] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md border border-[#102D52]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9D2E]" />
                    <span>POSTER PROMO RESMI</span>
                  </span>
                </div>

                {/* Gambar Poster Flyer */}
                <div className="relative rounded-xl overflow-hidden bg-white/40 flex items-center justify-center">
                  <img
                    src={promo.image}
                    alt={title}
                    className="w-full h-auto max-h-[38vh] sm:max-h-[44vh] md:max-h-[420px] lg:max-h-[450px] object-contain block mx-auto rounded-xl shadow-xs transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                  />
                </div>

                {/* Caption di Bawah Poster */}
                <div className="pt-2 pb-0.5 text-center">
                  <span className="text-[11px] text-[#5A6E85] font-medium tracking-wide group-hover:text-[#102D52] transition-colors flex items-center justify-center gap-1.5">
                    <span>🔍</span> Klik gambar poster untuk perbesar & klaim penawaran
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Kolom Kanan: Detail Penawaran, Badge Navy, & CTA Button Navy */}
          <div className="md:col-span-6 space-y-3.5 sm:space-y-4 text-left">
            {/* Top Badges: Dark Navy Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#102D52] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF9D2E] animate-pulse" />
                <span>{badge}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#102D52] text-white text-[10px] sm:text-[11px] font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Legalitas SHM Sah</span>
              </span>
            </div>

            {/* Sapaan Ramah */}
            <h3 className="font-bold text-lg sm:text-xl md:text-[23px] text-[#102D52] leading-tight">
              {greeting}
            </h3>

            {/* Card Highlight Pasir Hangat */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F4ECE0]/90 border border-[#E3D4BE] shadow-xs space-y-2.5">
              <div className="text-[10.5px] sm:text-[11px] font-extrabold text-[#A85822] uppercase tracking-wider">
                {highlightText}
              </div>

              <div className="flex items-baseline justify-between border-b border-[#D8C7B5]/60 pb-2">
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#102D52] tracking-tight">
                  {title}
                </h4>
                <span className="text-[11px] font-bold text-[#102D52] bg-white/90 px-3 py-0.5 rounded-full border border-[#D5C7B8] shadow-xs">
                  Tipe 36 / 72 m²
                </span>
              </div>

              {/* 4 Poin Keunggulan Utama */}
              <div className="grid grid-cols-2 gap-2 pt-0.5 text-[11px] sm:text-[11.5px] font-semibold text-[#1E293B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15966A] shrink-0" />
                  <span>Angsuran Mulai 1 Juta-an</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15966A] shrink-0" />
                  <span>Cicilan FLPP Flat 5%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15966A] shrink-0" />
                  <span>Jalan Paving & Listrik PLN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15966A] shrink-0" />
                  <span>Dekat Kota Bandar Lampung</span>
                </div>
              </div>
            </div>

            {/* Urgency Callout dengan Glowing Clock Merah-Pink */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FEECEB] border border-[#FCD2CE] text-[#B91C1C] shadow-xs">
              <div className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-[13px] font-extrabold leading-tight">
                {urgencyText}
              </div>
            </div>

            {/* Tombol CTA Navy Pekat: Daftar Sekarang!!! */}
            <div className="pt-0.5 space-y-2">
              <a
                href={ctaUrl}
                target={ctaUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={handleClose}
                className="group w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#102D52] hover:bg-[#073B78] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#102D52]/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#102D52]" />
                <span>{ctaText}</span>
              </a>

              {/* Micro Trust Badges Row */}
              <div className="flex items-center justify-between text-[11px] text-[#5A6E85] font-medium pt-1 px-1">
                <span className="flex items-center gap-1 text-[#C2410C]">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Respon Cepat</span>
                </span>
                <span className="flex items-center gap-1 text-[#526783]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Bebas Biaya Survei</span>
                </span>
                <span className="flex items-center gap-1 text-[#15803D]">
                  <Home className="w-3.5 h-3.5" />
                  <span>Dibantu Sampai Serah Terima</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
