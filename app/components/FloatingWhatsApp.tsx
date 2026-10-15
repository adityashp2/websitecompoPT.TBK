'use client';

import React, { useState, useEffect } from 'react';
import { SiteContent } from '@/lib/initialData';
import { X, Send, MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  content: SiteContent;
}

export default function FloatingWhatsApp({ content }: FloatingWhatsAppProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const rawWa = content.contact?.whatsapp || '';

  // Auto-show popup after 4.5 seconds ONLY on first visit; if closed once, never show again
  useEffect(() => {
    try {
      const alreadyDismissed = localStorage.getItem('tbk_wa_popup_dismissed') === 'true';
      if (!alreadyDismissed) {
        setDismissed(false);
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 4500);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked/disabled
    }
  }, []);

  const handleDismiss = () => {
    setShowPopup(false);
    setDismissed(true);
    try {
      localStorage.setItem('tbk_wa_popup_dismissed', 'true');
    } catch {}
  };

  // Tombol WhatsApp melayang hanya tampil jika nomor sudah diisi
  if (!rawWa || rawWa.includes('[ISI:') || rawWa.trim() === '') {
    return null;
  }

  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : cleanPhone
    ? `62${cleanPhone}`
    : '';

  if (!formattedWa) {
    return null;
  }

  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin bertanya informasi unit dan promo perumahan Puri Gunung Langgar.')}`;

  return (
    <div className="fixed bottom-[64px] right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Automated WhatsApp Consultation Notification Bubble */}
      {showPopup && !dismissed && (
        <div className="mb-3 w-[calc(100vw-24px)] max-w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 text-slate-800 animate-fade-in relative z-50 font-sans select-none pointer-events-auto">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs"
            aria-label="Tutup pesan"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Layanan WhatsApp Resmi</div>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online & Siap Melayani
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Butuh informasi ketersediaan unit, tahapan berkas KPR subsidi, atau survei lokasi di <strong>Puri Gunung Langgar</strong>?
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDismiss}
            className="w-full h-8 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Tanya Pemasaran Sekarang</span>
            <Send className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Main WhatsApp Floating Button with Ripple Ping Animation (Desktop / Tablet) */}
      <div className="hidden sm:block relative group pointer-events-auto">
        {/* Animated Ripple Ping Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi kami melalui WhatsApp"
          className="relative w-[48px] h-[48px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#1EBE5D] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        >
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20.52 3.48A11.93 11.93 0 0012.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 6L0 24l6.21-1.63a11.9 11.9 0 005.85 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zM12.06 21.88h-.01c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-3.79.99 1.01-3.69-.24-.38a9.92 9.92 0 01-1.52-5.21c0-5.5 4.47-9.97 9.98-9.97 2.66 0 5.17 1.04 7.05 2.92a9.92 9.92 0 012.92 7.05c0 5.5-4.48 9.97-9.98 9.97zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.25-.6-.5-.51-.68-.52l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.07 1.04-1.07 2.54s1.1 2.95 1.25 3.15c.15.2 2.16 3.3 5.23 4.63.73.32 1.3.5 1.74.65.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

