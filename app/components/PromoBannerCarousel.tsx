'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerSlide, defaultBannerSlides, getYouTubeEmbedUrl } from '@/lib/initialData';
export type { BannerSlide };

export function getOverlayStyle(slide?: any): React.CSSProperties {
  return {};
}
export function getFontFamilyStyle(font?: string): string {
  return 'font-display';
}
export function getFontWeightStyle(weight?: string): string {
  return 'font-normal';
}

interface PromoBannerCarouselProps {
  slides?: BannerSlide[];
  whatsappUrl?: string;
}

export default function PromoBannerCarousel({ slides: propSlides }: PromoBannerCarouselProps) {
  const slides: BannerSlide[] = Array.isArray(propSlides) && propSlides.length > 0
    ? propSlides
    : defaultBannerSlides;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch Swipe tracking for Mobile Carousel
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Continuous auto slideshow (5.5 seconds per slide)
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStartX(null);
  };

  return (
    <section
      id="beranda"
      className="relative w-full overflow-hidden select-none bg-[#000000]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Koleksi Unggulan PT. Terbang Bersama Kawan"
      suppressHydrationWarning
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-Bleed Photographic Band */}
      <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={`slide-${slide.id}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} dari ${slides.length}: ${slide.eyebrow}`}
            >
              {/* Automotive / Real Estate Full-Bleed Media */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-[#000000]">
                {slide.mediaType === 'video' && slide.videoUrl ? (
                  getYouTubeEmbedUrl(slide.videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(slide.videoUrl, { autoplay: true, mute: true, loop: true, controls: false })!}
                      className="w-full h-full object-cover pointer-events-none scale-110 border-0 filter brightness-75"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={slide.eyebrow}
                    />
                  ) : (
                    <video
                      src={slide.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={slide.image || undefined}
                      className="w-full h-full object-cover filter brightness-75"
                    />
                  )
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.imageAlt || slide.eyebrow}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: slide.imageFit || 'cover',
                      objectPosition: `${(slide as any).imageOffsetX !== undefined ? (slide as any).imageOffsetX : 50}% ${slide.imageOffsetY !== undefined ? slide.imageOffsetY : 50}%`,
                    }}
                    className={`w-full h-full transition-transform duration-1000 filter brightness-75 ${
                      isActive ? 'scale-100' : 'scale-105'
                    }`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                )}
              </div>

              {/* Pure Black Editorial Gradient Overlay (Bugatti Style) */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-black via-black/75 to-transparent sm:from-black sm:via-black/70 sm:to-black/20"
                aria-hidden="true"
              />

              {/* Content Container */}
              <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 h-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
                <div className="max-w-3xl space-y-6 pt-16 sm:pt-0">
                  
                  {/* Eyebrow Label (Bugatti Monospace 11px uppercase) */}
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-white/40" />
                    <span className="font-mono text-[11px] sm:text-xs tracking-[2.5px] uppercase text-[#cccccc]">
                      {slide.eyebrow}
                    </span>
                  </div>

                  {/* Display Headline (Bugatti Display uppercase with wide letterspacing) */}
                  <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[72px] tracking-[3px] sm:tracking-[4px] uppercase text-white leading-[1.08]">
                    <span>{slide.headlineFirstLine}</span>
                    {slide.headlineHighlight && (
                      <>
                        <br />
                        <span className="text-white/80">{slide.headlineHighlight}</span>
                      </>
                    )}
                  </h1>

                  {/* Supporting Description (Bugatti Text Regular serif) */}
                  {slide.supportingText && (
                    <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-xl">
                      {slide.supportingText}
                    </p>
                  )}

                  {/* Action CTA Buttons (Transparent Pill + 1px White Outline) */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {slide.primaryCtaText && slide.primaryCtaHref && (
                      <Link
                        href={slide.primaryCtaHref}
                        className="btn-bugatti-primary"
                      >
                        <span>{slide.primaryCtaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {slide.secondaryCtaText && slide.secondaryCtaHref && (
                      slide.isSecondaryExternal ? (
                        <a
                          href={slide.secondaryCtaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-bugatti-primary border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{slide.secondaryCtaText}</span>
                        </a>
                      ) : (
                        <Link
                          href={slide.secondaryCtaHref}
                          className="btn-bugatti-primary border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                        >
                          <span>{slide.secondaryCtaText}</span>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Floating Controls (Bugatti Monospace Counter & Icon Buttons) */}
        <div className="absolute bottom-8 right-6 sm:right-12 z-20 flex items-center gap-5 bg-[#000000]/70 backdrop-blur-md px-5 py-2.5 border border-[#262626]">
          {/* Monospace Slide Counter */}
          <div className="font-mono text-xs tracking-[2px] uppercase text-white select-none">
            <span>0{currentIndex + 1}</span>
            <span className="text-[#666666] mx-2">/</span>
            <span className="text-[#999999]">0{slides.length}</span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 border-l border-[#262626] pl-4">
            <button
              type="button"
              onClick={goToPrev}
              className="w-8 h-8 rounded-full border border-[#262626] hover:border-white text-white flex items-center justify-center transition-colors"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="w-8 h-8 rounded-full border border-[#262626] hover:border-white text-white flex items-center justify-center transition-colors"
              aria-label="Slide selanjutnya"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
