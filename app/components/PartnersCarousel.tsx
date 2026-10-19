'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { PartnerItem, PartnersConfig } from '@/lib/initialData';

interface PartnersCarouselProps {
  partners?: PartnersConfig;
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  if (partners?.enabled === false) return null;

  const rawItems = Array.isArray(partners?.items) ? partners.items : [];
  const items: PartnerItem[] = rawItems.filter(
    (item) => item && item.logo && item.logo.trim() !== ''
  );

  if (items.length === 0) return null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const marqueeItems = [...items, ...items, ...items, ...items];

  const badgeText = partners?.badge?.trim() || 'MITRA STRATEGIS';
  const titleText = partners?.title?.trim() || 'PERBANKAN & REKANAN';
  const subtitleText = partners?.subtitle?.trim();

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollHeight
        ) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1.5;
        }
      }
    }, 28);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="partners"
      aria-label="Mitra & Kerjasama Resmi"
      className="relative w-full py-16 sm:py-20 bg-[#0d0d0d] border-y border-[#262626] overflow-hidden"
    >
      <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          {badgeText && (
            <p className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] mb-2 inline-block">
              {badgeText}
            </p>
          )}
          <h2 className="font-display font-normal text-2xl sm:text-3xl lg:text-4xl uppercase tracking-[3px] text-white">
            {titleText}
          </h2>
          {subtitleText && (
            <p className="mt-2 text-sm font-serif text-[#cccccc] leading-relaxed">
              {subtitleText}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Gradient Masks */}
          <div className="pointer-events-none absolute left-0 inset-y-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
          <div className="pointer-events-none absolute right-0 inset-y-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-[#0d0d0d] to-transparent" />

          {/* Navigation Controls */}
          <button
            type="button"
            onClick={handleScrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[#262626] hover:border-white bg-[#000000]/80 rounded-full text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Gulir ke kiri"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={handleScrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[#262626] hover:border-white bg-[#000000]/80 rounded-full text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Gulir ke kanan"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Track */}
          <div
            ref={scrollRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-hidden scroll-smooth py-2"
          >
            {marqueeItems.map((partner, pIdx) => (
              <div
                key={`${partner.id}-${pIdx}`}
                className="flex-shrink-0 w-44 sm:w-52 h-20 sm:h-24 px-5 py-3 bg-[#141414] border border-[#262626] hover:border-white/50 rounded-none flex items-center justify-center transition-all group/item"
              >
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center"
                    title={partner.name}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-12 max-w-[130px] object-contain filter grayscale invert opacity-75 group-hover/item:opacity-100 transition-opacity"
                    />
                  </a>
                ) : (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 max-w-[130px] object-contain filter grayscale invert opacity-75 group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
