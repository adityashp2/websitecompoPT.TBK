'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Maximize2, Image as ImageIcon } from 'lucide-react';
import type { LookbookItem } from '../components/LookbookModal';
import { upgradeGoogleImageUrl } from '@/lib/initialData';

const LookbookModal = dynamic(() => import('../components/LookbookModal'), { ssr: false });

interface SlideItem {
  image: string;
  caption?: string;
}

interface ClientProyekGalleryProps {
  slides: SlideItem[];
  projectName?: string;
  whatsappNumber?: string;
}

export default function ClientProyekGallery({
  slides,
  projectName = 'Puri Gunung Langgar',
  whatsappNumber = '0812-7890-1234',
}: ClientProyekGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const lookbookItems: LookbookItem[] = slides.map((s, idx) => {
    const isIlustrasi = (s.caption || '').toLowerCase().includes('ilustrasi') || (s.caption || '').toLowerCase().includes('visualisasi');
    return {
      image: upgradeGoogleImageUrl(s.image),
      title: s.caption || `Dokumentasi Proyek ${projectName}`,
      tag: String(idx + 1).padStart(2, '0'),
      category: isIlustrasi ? 'Ilustrasi Konsep' : 'Dokumen Lapangan',
      description: `Dokumentasi resmi kawasan ${projectName}, Tanjung Bintang, Lampung Selatan. PT. Terbang Bersama Kawan.`,
    };
  });

  const handleOpenLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="p-16 text-center space-y-4 border border-dashed border-[#262626] bg-[#0d0d0d]">
        <ImageIcon className="w-10 h-10 text-[#999999]/50 mx-auto" />
        <h3 className="font-display uppercase text-lg text-white tracking-[0.06em]">Belum Ada Foto Galeri</h3>
        <p className="font-serif text-sm text-[#999999] max-w-md mx-auto">
          Dokumentasi foto kawasan belum ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {slides.map((s, idx) => {
          const isIlustrasi = (s.caption || '').toLowerCase().includes('ilustrasi') || (s.caption || '').toLowerCase().includes('visualisasi');
          const numberTag = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={idx}
              onClick={() => handleOpenLightbox(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenLightbox(idx);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Lihat foto ${idx + 1}: ${s.caption || 'Dokumentasi Proyek'}`}
              className="group text-left space-y-4 bg-[#141414] hover:bg-[#1f1f1f] p-5 border border-[#262626] hover:border-[#3a3a3a] transition-all duration-300 cursor-pointer focus:outline-none"
            >
              {/* Photo Display Stage */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden border border-[#262626] bg-[#000000] flex items-center justify-center p-2">
                <img
                  src={upgradeGoogleImageUrl(s.image)}
                  alt={s.caption || `Foto Proyek ${idx + 1}`}
                  style={{
                    objectFit: (s as any).imageFit || 'contain',
                    objectPosition: `${(s as any).imageOffsetX !== undefined ? (s as any).imageOffsetX : 50}% ${(s as any).imageOffsetY !== undefined ? (s as any).imageOffsetY : 50}%`,
                    transform: `scale(${(((s as any).imageZoom !== undefined ? (s as any).imageZoom : 100) / 100)})`,
                  }}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Number Badge Top Left */}
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[10px] font-mono tracking-[0.2em] text-white border border-[#3a3a3a]">
                  {numberTag}
                </div>

                {/* Quick Enlarge Indicator Top Right */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all group-hover:scale-105 border border-white/20">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Overlay on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-4 py-1.5 rounded-full border border-white/40 bg-black/70 text-white font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" />
                    <span>Perbesar</span>
                  </span>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="space-y-2 pt-1">
                <p className="font-display uppercase text-sm sm:text-base text-white tracking-[0.04em] leading-snug line-clamp-2">
                  {s.caption || `Dokumentasi Proyek ${projectName}`}
                </p>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[#999999] pt-2 border-t border-[#262626]">
                  <span className="truncate max-w-[150px]">PT. TBK Lampung</span>
                  {isIlustrasi ? (
                    <span className="text-[#999999] border border-[#262626] px-2 py-0.5 shrink-0">
                      Ilustrasi Konsep
                    </span>
                  ) : (
                    <span className="text-[#c3d9f3] border border-[#262626] px-2 py-0.5 shrink-0">
                      Dokumen Lapangan
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Fullscreen Modal */}
      <LookbookModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lookbookItems}
        currentIndex={currentIndex}
        onIndexChange={(idx) => setCurrentIndex(idx)}
        projectName={projectName}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
