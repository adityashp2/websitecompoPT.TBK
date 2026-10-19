'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SiteContent, initialSiteContent } from '@/lib/initialData';

interface FloatingWhatsAppProps {
  content?: SiteContent;
  whatsappNumber?: string;
}

export default function FloatingWhatsApp({ content, whatsappNumber }: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isNavAdmin = currentPath.toLowerCase().includes('admin') || currentPath.toLowerCase().includes('a9min');
  if (!mounted || isNavAdmin || currentPath === '/kontak') {
    return null;
  }
  const rawWa = (whatsappNumber !== undefined ? whatsappNumber : content?.contact?.whatsapp)?.trim() || '';
  const cleanPhone = rawWa.replace(/\D/g, '');
  if (!cleanPhone) {
    return null;
  }

  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;

  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent(
    'Halo PT. TBK, saya ingin bertanya seputar informasi unit dan promo perumahan Puri Gunung Langgar.'
  )}`;

  return (
    <div
      className="fixed bottom-20 md:bottom-7 right-4 sm:right-6 z-[99999] select-none pointer-events-auto"
      style={{
        position: 'fixed',
        zIndex: 99999,
      }}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 sm:pl-2 sm:pr-5 sm:py-2 rounded-full bg-white hover:bg-[#F8FAFC] shadow-[0_4px_20px_rgba(0,0,0,0.16)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.22)] border border-[#DCE7F5] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        aria-label="Ada Pertanyaan? Hubungi layanan WhatsApp resmi PT. TBK"
      >
        {/* Green Circular WhatsApp Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20.52 3.48A11.93 11.93 0 0012.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 6L0 24l6.21-1.63a11.9 11.9 0 005.85 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zM12.06 21.88h-.01c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-3.79.99 1.01-3.69-.24-.38a9.92 9.92 0 01-1.52-5.21c0-5.5 4.47-9.97 9.98-9.97 2.66 0 5.17 1.04 7.05 2.92a9.92 9.92 0 012.92 7.05c0 5.5-4.48 9.97-9.98 9.97zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.25-.6-.5-.51-.68-.52l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.07 1.04-1.07 2.54s1.1 2.95 1.25 3.15c.15.2 2.16 3.3 5.23 4.63.73.32 1.3.5 1.74.65.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35z" />
          </svg>
        </div>

        {/* Text Pill */}
        <span className="text-[13px] sm:text-[14px] font-medium text-[#475569] group-hover:text-[#0F172A] tracking-normal transition-colors whitespace-nowrap">
          Ada Pertanyaan?
        </span>
      </a>
    </div>
  );
}
