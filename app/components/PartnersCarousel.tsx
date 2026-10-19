'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { PartnerItem, PartnersConfig } from '@/lib/initialData';

interface PartnersCarouselProps {
  partners?: PartnersConfig;
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  // If explicitly disabled or no items, return null
  if (partners?.enabled === false) return null;

  const rawItems = Array.isArray(partners?.items) ? partners.items : [];
  const items: PartnerItem[] = rawItems.filter(
    (item) => item && item.logo && item.logo.trim() !== ''
  );

  if (items.length === 0) return null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for infinite marquee illusion
  // We duplicate enough times so wide screens don't run out of items
  const marqueeItems = [...items, ...items, ...items, ...items];

  const badgeText = partners?.badge?.trim() || 'PARTNERS';
  const titleText = partners?.title?.trim() || 'Our Partners.';
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

  return (
    <section
      id="partners"
      aria-label="Mitra & Kerjasama Resmi"
      className="relative w-full py-12 sm:py-16 bg-[#F8FAFC] border-y border-slate-200/80 overflow-hidden"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (Inspired by ICC "PARTNERS / Our Partners.") */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          {badgeText && (
            <p className="text-[#FF5A36] text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2 inline-block">
              {badgeText}
            </p>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#102D52] tracking-tight">
            {titleText}
          </h2>
          {subtitleText && (
            <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {subtitleText}
            </p>
          )}
        </div>

        {/* Carousel Container with Side Controls & Smooth Infinite Auto-Slide */}
        <div
          className="relative w-full group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Left Gradient Fade Mask */}
          <div className="pointer-events-none absolute left-0 inset-y-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#F8FAFC] to-transparent" />

          {/* Right Gradient Fade Mask */}
          <div className="pointer-events-none absolute right-0 inset-y-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-[#F8FAFC] to-transparent" />

          {/* Prev Arrow Button (Subtle, matches user reference) */}
          <button
            type="button"
            onClick={handleScrollLeft}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 text-[#102D52] shadow-md border border-slate-200/90 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-[#FF9D2E] hover:text-[#102D52] transition-all duration-200 active:scale-95 focus-visible:outline-none"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Next Arrow Button (Subtle, matches user reference) */}
          <button
            type="button"
            onClick={handleScrollRight}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 text-[#102D52] shadow-md border border-slate-200/90 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-[#FF9D2E] hover:text-[#102D52] transition-all duration-200 active:scale-95 focus-visible:outline-none"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Sliding Marquee Track */}
          <div
            ref={scrollRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2"
            style={{
              scrollBehavior: 'smooth',
            }}
          >
            <div
              className={`flex items-center gap-4 sm:gap-6 shrink-0 ${
                isPaused ? '' : 'animate-marquee-smooth'
              }`}
            >
              {marqueeItems.map((item, idx) => {
                const cardContent = (
                  <div className="h-20 sm:h-24 w-44 sm:w-52 px-4 py-3 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#FF9D2E]/60 transition-all duration-300 flex items-center justify-center group/card cursor-pointer">
                    <img
                      src={item.logo}
                      alt={item.name || `Partner ${idx + 1}`}
                      style={{
                        objectFit: item.imageFit || 'contain',
                        objectPosition: `${item.imageOffsetX !== undefined ? item.imageOffsetX : 50}% ${item.imageOffsetY !== undefined ? item.imageOffsetY : 50}%`,
                        transform: `scale(${((item.imageZoom !== undefined ? item.imageZoom : 100) / 100)})`,
                      }}
                      className="max-h-12 sm:max-h-14 w-auto max-w-full transition-transform duration-300 group-hover/card:scale-105"
                      loading="lazy"
                    />
                  </div>
                );

                if (item.url && item.url.trim() !== '') {
                  const isExternal = item.url.startsWith('http://') || item.url.startsWith('https://');
                  return (
                    <a
                      key={`${item.id || idx}-${idx}`}
                      href={item.url}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="shrink-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E] rounded-xl"
                      title={item.name}
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <div
                    key={`${item.id || idx}-${idx}`}
                    className="shrink-0"
                    title={item.name}
                  >
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scoped CSS for Butter-Smooth Continuous Infinite Auto-Sliding Marquee */}
      <style jsx>{`
        @keyframes marqueeSmooth {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-smooth {
          animation: marqueeSmooth 35s linear infinite;
        }
        .animate-marquee-smooth:hover {
          animation-play-state: paused;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
