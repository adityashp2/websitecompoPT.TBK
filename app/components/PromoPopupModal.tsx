'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PromoPopup } from '@/lib/initialData';
import { X } from 'lucide-react';

interface PromoPopupModalProps {
  promo?: PromoPopup;
}

// In-memory flag: Memastikan saat pengunjung bernavigasi antar halaman di navbar (seperti klik "Beranda", "Proyek", dll),
// iklan tidak akan muncul berulang kali (tidak spam).
// Namun saat halaman di-refresh (F5 / buka baru), iklan tetap bisa muncul secara normal.
let hasClosedPromoInSession = false;
let lastPromoImage = '';

export default function PromoPopupModal({ promo }: PromoPopupModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Bersihkan semua flag pemblokir lama di localStorage dan sessionStorage agar browser yang sebelumnya terkunci langsung terbuka
    try {
      localStorage.removeItem('tbk_promo_popup_seen');
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('tbk_promo_') || key === 'tbk_promo_popup_seen')) {
          sessionStorage.removeItem(key);
        }
      }
    } catch {}

    if (promo?.enabled && promo?.image) {
      // Jika gambar promo diganti oleh admin, reset status tutup agar promo baru langsung tampil
      if (lastPromoImage && lastPromoImage !== promo.image) {
        hasClosedPromoInSession = false;
      }
      lastPromoImage = promo.image;

      // Jika user sudah pernah menutup iklan dalam alur navigasi halaman ini, jangan munculkan lagi saat klik Beranda
      if (hasClosedPromoInSession) {
        return;
      }

      setMounted(true);
      const timer = setTimeout(() => {
        setAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
      setMounted(false);
    }
  }, [promo?.enabled, promo?.image]);

  const handleClose = () => {
    hasClosedPromoInSession = true;
    try {
      localStorage.removeItem('tbk_promo_popup_seen');
    } catch {}
    setAnimating(false);
    setTimeout(() => {
      setMounted(false);
    }, 200);
  };

  // Kunci scroll halaman total saat iklan muncul (User tidak bisa scroll sama sekali sampai iklan ditutup)
  useEffect(() => {
    if (mounted) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Blokir event scroll: wheel, touchmove, dan tombol keyboard navigasi
      const preventScroll = (e: Event) => {
        e.preventDefault();
      };

      const handleScrollKeys = (e: KeyboardEvent) => {
        if (['Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
          e.preventDefault();
        }
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', handleScrollKeys);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.paddingRight = originalPaddingRight;

        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', handleScrollKeys);
      };
    }
  }, [mounted]);

  // Tombol Escape keyboard untuk menutup
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

  const ctaUrl = (promo.ctaUrl || '').trim();

  const imgStyle: React.CSSProperties = {
    objectFit: promo.imageFit || 'contain',
    objectPosition: `${promo.imageOffsetX !== undefined ? promo.imageOffsetX : 50}% ${promo.imageOffsetY !== undefined ? promo.imageOffsetY : 50}%`,
    transform: promo.imageZoom !== undefined ? `scale(${promo.imageZoom / 100})` : undefined,
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Iklan Promo Banner"
      className={`fixed inset-0 z-[200000] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md select-none touch-none overscroll-none overflow-hidden transition-opacity duration-200 ${
        animating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
    >
      {/* Banner Container: Dibuat Kotak Presisi (rounded-none) dengan Shadow Elegan */}
      <div
        className={`relative inline-block max-w-[92vw] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[86vh] rounded-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 transform ${
          animating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol X Kotak di Pojok Kanan Banner */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-none bg-black/75 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 border border-white/50 shadow-xl cursor-pointer focus-visible:outline-none"
          aria-label="Tutup iklan banner"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Foto Banner Murni - Kotak (rounded-none) */}
        {ctaUrl ? (
          <a
            href={ctaUrl}
            target={ctaUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            onClick={handleClose}
            className="block cursor-pointer focus:outline-none group rounded-none overflow-hidden"
            aria-label="Kunjungi penawaran promo unit perumahan"
          >
            <img
              src={promo.image}
              alt={promo.title || 'Iklan Banner Promo PT. TBK'}
              style={imgStyle}
              className="w-auto h-auto max-w-full max-h-[82vh] block mx-auto rounded-none transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </a>
        ) : (
          <div className="overflow-hidden">
            <img
              src={promo.image}
              alt={promo.title || 'Iklan Banner Promo PT. TBK'}
              style={imgStyle}
              className="w-auto h-auto max-w-full max-h-[82vh] block mx-auto rounded-none"
            />
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
