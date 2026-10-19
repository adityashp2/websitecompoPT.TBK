'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Maximize2, Image as ImageIcon } from 'lucide-react';
import type { LookbookItem } from '../components/LookbookModal';

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
      image: s.image,
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
      <div className="p-12 text-center space-y-3 border border-dashed border-[#DCE7F5] rounded-2xl">
        <ImageIcon className="w-10 h-10 text-[#526783]/50 mx-auto" />
        <h3 className="font-bold text-lg text-[#102D52]">Belum Ada Foto Galeri</h3>
        <p className="text-xs sm:text-sm text-[#526783] max-w-md mx-auto">
          Dokumentasi foto kawasan belum ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
              className="group text-left space-y-3.5 bg-[#F4F7FC] hover:bg-white p-4 sm:p-5 rounded-2xl border border-[#DCE7F5] hover:border-[#FF9D2E]/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF9D2E]"
            >
              {/* Photo Display Stage (Clean Object-Contain, No Cropped / Cutoff Center) */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-xl border border-[#DCE7F5] bg-[#F4F7FC] flex items-center justify-center p-2">
                <img
                  src={s.image}
                  alt={s.caption || `Foto Proyek ${idx + 1}`}
                  style={{
                    objectFit: (s as any).imageFit || 'contain',
                    objectPosition: `${(s as any).imageOffsetX !== undefined ? (s as any).imageOffsetX : 50}% ${(s as any).imageOffsetY !== undefined ? (s as any).imageOffsetY : 50}%`,
                    transform: `scale(${(((s as any).imageZoom !== undefined ? (s as any).imageZoom : 100) / 100)})`,
                  }}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Number Badge Top Left */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#073B78]/90 backdrop-blur-md text-[11px] font-mono font-bold text-white shadow-md border border-white/10">
                  {numberTag}
                </div>

                {/* Quick Enlarge Indicator Top Right */}
                <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-[#073B78] text-white shadow-md backdrop-blur-sm transition-all group-hover:scale-110 border border-white/20">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Overlay Pill on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full bg-[#FF9D2E] text-[#071C38] text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <Maximize2 className="w-3 h-3" />
                    <span>Klik Perbesar</span>
                  </span>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="space-y-1.5 pt-0.5">
                <p className="text-sm sm:text-[14.5px] text-[#102D52] group-hover:text-[#073B78] font-bold leading-snug line-clamp-2 transition-colors">
                  {s.caption || `Dokumentasi Proyek ${projectName}`}
                </p>
                <div className="flex items-center justify-between text-[11.5px] text-[#526783] pt-1 border-t border-[#DCE7F5]/70">
                  <span className="truncate max-w-[150px]">PT. Terbang Bersama Kawan</span>
                  {isIlustrasi ? (
                    <span className="text-[#FF9D2E] font-bold px-2 py-0.5 rounded-md bg-[#FFF7EB] border border-[#FF9D2E]/30 shrink-0">
                      Ilustrasi Konsep
                    </span>
                  ) : (
                    <span className="text-[#15966A] font-bold px-2 py-0.5 rounded-md bg-[#EBF7F2] border border-[#15966A]/30 shrink-0">
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
