'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

export interface LookbookItem {
  image: string;
  title: string;
  description?: string;
  tag?: string;
  category?: string;
  specs?: string[];
  imageFit?: 'cover' | 'contain';
  imageOffsetY?: number;
  imageZoom?: number;
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentItem = items[currentIndex] || items[0];

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    onIndexChange((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onIndexChange]);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    onIndexChange((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onIndexChange]);

  // Kunci scroll halaman total saat perbesar foto (User tidak bisa scroll sama sekali sampai modal ditutup)
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();

      if (['Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;

      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem || !mounted) return null;

  const cleanPhone = (whatsappNumber || '').replace(/\D/g, '');
  const hasWa = cleanPhone.length >= 7;
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;

  const waMessage = `Halo PT. TBK, saya melihat dokumentasi "${currentItem.title}" di proyek ${projectName}. Mohon info ketersediaan unit dan jadwal survei lokasi.`;
  const waUrl = hasWa ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(waMessage)}` : '';

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tampilan Penuh Foto Proyek"
      className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 select-none touch-none overscroll-none overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Floating Controls */}
      <header
        className="w-full flex items-center justify-between z-30 pb-2 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FF9D2E] text-[#071C38] shadow-sm">
            {projectName}
          </span>
          <span className="hidden sm:inline text-xs text-white/80 font-medium truncate max-w-sm">
            {currentItem.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {items.length > 1 && (
            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs">
              <span className="text-[#FF9D2E] font-bold">{currentIndex + 1}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{items.length}</span>
            </div>
          )}

          {/* Tombol X di Pojok Kanan Atas */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-rose-600 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/25 shadow-xl cursor-pointer"
            aria-label="Tutup tampilan penuh"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Image Stage - Langsung Berada Tepat di Tengah Layar Pengguna Tanpa Perlu Scroll */}
      <main
        className="relative flex-1 flex items-center justify-center w-full min-h-0 my-auto py-2"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#FF9D2E] text-white hover:text-[#071C38] border border-white/25 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        <img
          key={currentItem.image}
          src={currentItem.image}
          alt={currentItem.title}
          style={{
            objectFit: currentItem.imageFit || 'contain',
            objectPosition: `center ${currentItem.imageOffsetY !== undefined ? currentItem.imageOffsetY : 50}%`,
            transform: currentItem.imageZoom !== undefined ? `scale(${currentItem.imageZoom / 100})` : undefined,
          }}
          className="max-h-[76vh] sm:max-h-[78vh] max-w-[94vw] w-auto h-auto rounded-xl shadow-2xl block mx-auto border border-white/15 animate-in fade-in zoom-in-95 duration-200"
        />

        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#FF9D2E] text-white hover:text-[#071C38] border border-white/25 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}
      </main>

      {/* Bottom Floating Bar */}
      <footer
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10 z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-white/70 text-center sm:text-left line-clamp-1 max-w-lg">
          {currentItem.description || currentItem.title}
        </p>

        <div className="flex items-center gap-3">
          {hasWa && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Tanya Unit Ini via WhatsApp</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </footer>
    </div>
  );

  return createPortal(modalContent, document.body);
}
