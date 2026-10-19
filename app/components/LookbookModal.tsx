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
  imageOffsetX?: number;
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

  // Lock scroll when open
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
      className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none touch-none overscroll-none overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Floating Controls */}
      <header
        className="w-full flex items-center justify-between z-30 pb-4 border-b border-[#262626] shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#141414] border border-[#262626] text-white font-mono text-[10px] tracking-[0.2em] uppercase">
            {projectName}
          </span>
          <span className="hidden sm:inline font-display uppercase tracking-[0.04em] text-sm text-white truncate max-w-sm">
            {currentItem.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {items.length > 1 && (
            <div className="px-3 py-1 bg-[#141414] border border-[#262626] text-white font-mono text-xs tracking-[0.2em]">
              <span className="text-white">{currentIndex + 1}</span>
              <span className="text-white/40 mx-1.5">/</span>
              <span className="text-[#999999]">{items.length}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/20 hover:border-white text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Tutup tampilan penuh"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <main
        className="relative flex-1 flex items-center justify-center w-full min-h-0 my-auto py-4"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 w-12 h-12 rounded-full border border-white/20 hover:border-white bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
          </button>
        )}

        <img
          key={currentItem.image}
          src={currentItem.image}
          alt={currentItem.title}
          style={{
            objectFit: currentItem.imageFit || 'contain',
            objectPosition: `${currentItem.imageOffsetX !== undefined ? currentItem.imageOffsetX : 50}% ${currentItem.imageOffsetY !== undefined ? currentItem.imageOffsetY : 50}%`,
            transform: currentItem.imageZoom !== undefined ? `scale(${currentItem.imageZoom / 100})` : undefined,
          }}
          className="max-h-[76vh] sm:max-h-[78vh] max-w-[94vw] w-auto h-auto border border-[#262626] block mx-auto animate-in fade-in zoom-in-95 duration-200"
        />

        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 w-12 h-12 rounded-full border border-white/20 hover:border-white bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-6 h-6 stroke-[1.5]" />
          </button>
        )}
      </main>

      {/* Bottom Floating Bar */}
      <footer
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262626] z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-serif text-sm text-[#999999] text-center sm:text-left line-clamp-1 max-w-lg">
          {currentItem.description || currentItem.title}
        </p>

        <div className="flex items-center gap-3">
          {hasWa && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/30 hover:border-white text-white font-mono text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tanya Unit via WhatsApp</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[#262626] hover:border-[#3a3a3a] text-[#999999] hover:text-white font-mono text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </footer>
    </div>
  );

  return createPortal(modalContent, document.body);
}
