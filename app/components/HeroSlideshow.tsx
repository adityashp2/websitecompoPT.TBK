'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlideItem {
  image: string;
  caption: string;
}

interface HeroSlideshowProps {
  slides?: HeroSlideItem[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  // Fallback if slides array is empty
  const defaultSlides: HeroSlideItem[] = [
    {
      image: '',
      caption: 'Unit contoh Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan.',
    },
    {
      image: '/assets/project-workspace.jpg',
      caption: 'Akses jalan dan pemetaan area Puri Gunung Langgar.',
    },
    {
      image: '/assets/service-construction.jpg',
      caption: 'Proses cut & fill perataan kontur lahan kawasan perumahan.',
    },
    {
      image: '/assets/service-residential.jpg',
      caption: 'Pekerjaan pondasi dan pematokan kavling unit hunian.',
    },
  ];

  const items = slides && slides.length > 0 ? slides : defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, isPaused, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const currentSlide = items[currentIndex] || items[0];

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Slideshow Unit dan Kawasan Puri Gunung Langgar"
    >
      {/* 4:3 Image Container with rounded 12px */}
      <div className="relative aspect-[4/3] w-full rounded-[12px] overflow-hidden bg-[#E6E2D8] border border-[#D8D3C8] select-none">
        {items.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {slide.image && slide.image.trim() !== '' ? (
                <img
                  src={slide.image}
                  alt={slide.caption || `Slide ${idx + 1}`}
                  className="w-full h-full object-cover rounded-[12px]"
                />
              ) : (
                <div className="w-full h-full bg-[#E6E2D8] flex items-center justify-center text-[#5B6068] text-[14px] font-medium p-4 text-center">
                  [Foto: unit contoh Puri Gunung Langgar]
                </div>
              )}
            </div>
          );
        })}

        {/* Previous / Next navigation arrows (visible on hover) */}
        {items.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              type="button"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#1C1F24] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B08D4A]"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#1C1F24] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B08D4A]"
              aria-label="Slide selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {items.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`transition-all rounded-full ${
                  dotIdx === currentIndex
                    ? 'w-5 h-2 bg-[#B08D4A]'
                    : 'w-2 h-2 bg-white/80 hover:bg-white'
                }`}
                aria-label={`Lihat slide ke-${dotIdx + 1}`}
                aria-current={dotIdx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dynamic 13px Gray Caption */}
      <p className="mt-2 text-[13px] text-[#5B6068] min-h-[20px] transition-colors">
        {currentSlide?.caption || 'Unit contoh Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan.'}
      </p>
    </div>
  );
}
