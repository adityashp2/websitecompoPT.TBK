'use client';

import React, { useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export interface LookbookItem {
  image: string;
  title: string;
  description?: string;
  tag?: string;
  category?: string;
  specs?: string[];
}

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LookbookItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  projectName?: string;
  whatsappNumber?: string;
}

export default function LookbookModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onIndexChange,
  projectName = 'Puri Gunung Langgar',
  whatsappNumber = '',
}: LookbookModalProps) {
  const currentItem = items[currentIndex] || items[0];

  // Navigate next / prev with wrap-around
  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    onIndexChange((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onIndexChange]);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    onIndexChange((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onIndexChange]);

  // Keyboard navigation: Escape to close, Left/Right arrows to cycle
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  const cleanPhone = (whatsappNumber || '').replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : cleanPhone
    ? `62${cleanPhone}`
    : '';

  const waMessage = `Halo PT. TBK, saya melihat dokumentasi "${currentItem.title}" (${projectName}). Saya ingin berkonsultasi mengenai ketersediaan unit dan jadwal survei lokasi.`;
  const waUrl = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(waMessage)}`
    : '#kontak';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#071C38]/95 backdrop-blur-xl p-3 sm:p-5 md:p-6 transition-all duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Dokumentasi Visual Proyek"
    >
      {/* Ambient navy/orange radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,59,120,0.4)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* TOP BAR: Brand Identity, Counter & Controls */}
      <header
        className="relative z-10 flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Project identity & brand badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#FF9D2E]/20 text-[#FF9D2E] border border-[#FF9D2E]/40">
            <Layers className="w-3 h-3" />
            <span>Dokumentasi Resmi</span>
          </span>
          <div className="hidden sm:block">
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide block">
              {projectName}
            </span>
            <span className="text-[10px] text-[#DCE7F5]/70 tracking-wider uppercase block">
              PT. Terbang Bersama Kawan
            </span>
          </div>
        </div>

        {/* Center: Slide Counter */}
        <div className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-white font-mono text-xs tracking-wider flex items-center gap-1.5">
          <span className="text-[#FF9D2E] font-bold">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/70">
            {String(items.length).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Keyboard tip & Close button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-white/50">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px]">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] mr-1">→</kbd>
            <span>Navigasi</span>
            <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px]">ESC</kbd>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white transition-all duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E]"
            aria-label="Tutup lookbook"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* CENTER STAGE: Image Display with Floating Navigation Chevrons */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center my-2 sm:my-3 min-h-0 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 sm:left-3 md:left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#102D52]/85 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white border border-white/20 backdrop-blur-md shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E]"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <div className="relative max-h-[46vh] sm:max-h-[50vh] md:max-h-[54vh] max-w-full flex items-center justify-center rounded-2xl overflow-hidden border border-white/15 bg-[#071C38] shadow-2xl group">
          <img
            key={currentItem.image}
            src={currentItem.image}
            alt={currentItem.title}
            className="max-h-[46vh] sm:max-h-[50vh] md:max-h-[54vh] w-auto max-w-full object-contain animate-in fade-in zoom-in-95 duration-200"
          />
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 sm:right-3 md:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#102D52]/85 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white border border-white/20 backdrop-blur-md shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E]"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* BOTTOM SECTION: Metadata Card & Lookbook Strip */}
      <footer
        className="relative z-10 shrink-0 space-y-3 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#102D52]/90 border border-white/15 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {currentItem.tag && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#FF9D2E]/25 text-[#FF9D2E] border border-[#FF9D2E]/30">
                    {currentItem.tag}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#15966A] font-semibold bg-[#15966A]/20 border border-[#15966A]/30 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dokumentasi Lapangan Terverifikasi</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#DCE7F5]/80 bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF9D2E]" />
                  <span>Standar Teknis PUPR</span>
                </span>
              </div>

              <h2 className="font-sans text-base sm:text-lg md:text-xl text-white font-bold tracking-tight truncate">
                {currentItem.title}
              </h2>

              {currentItem.description && (
                <p className="text-xs sm:text-[13px] text-[#DCE7F5]/85 leading-relaxed line-clamp-2">
                  {currentItem.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-1 md:pt-0">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Tanya Progres Ini</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm border border-white/15 transition-colors font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Lookbook Strip */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1 scrollbar-none px-1">
            {items.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onIndexChange(idx)}
                  className={`relative group/thumb shrink-0 w-14 sm:w-20 md:w-24 aspect-[4/3] rounded-lg overflow-hidden transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E] ${
                    isActive
                      ? 'ring-2 ring-[#FF9D2E] border-transparent scale-105 opacity-100 shadow-lg'
                      : 'opacity-40 hover:opacity-90 hover:scale-100 border border-white/20'
                  }`}
                  aria-label={`Lihat foto ${idx + 1}: ${item.title}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-white bg-black/70 px-1 rounded">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </footer>
    </div>
  );
}
