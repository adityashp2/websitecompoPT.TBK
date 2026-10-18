'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';

import { BannerSlide, defaultBannerSlides, getYouTubeEmbedUrl } from '@/lib/initialData';
export type { BannerSlide };

interface PromoBannerCarouselProps {
  slides?: BannerSlide[];
  whatsappUrl?: string;
}

export default function PromoBannerCarousel({ slides: propSlides }: PromoBannerCarouselProps) {
  const slides: BannerSlide[] = Array.isArray(propSlides) && propSlides.length > 0 ? propSlides : defaultBannerSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch Swipe tracking for Mobile Carousel
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Continuous auto slideshow (4.5 seconds per slide)
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch Swipe Handlers for Mobile Carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) {
      goToNext();
    } else if (distance < -40) {
      goToPrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <section
      id="beranda"
      className="relative w-full overflow-hidden select-none bg-[#073B78]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promosi Unggulan PT. Terbang Bersama Kawan"
      suppressHydrationWarning
    >
      {/* ======================================================================= */}
      {/* 1. DESKTOP HERO: FULL-WIDTH BACKGROUND HERO (>= 1024px)                 */}
      {/* - One full-width residential background image covering the entire hero  */}
      {/* - Dark left-to-right gradient overlay                                   */}
      {/* - Project badge, headline, description, and CTA buttons on the left     */}
      {/* - White text with muted gold/orange highlights                          */}
      {/* - Carousel counter & navigation arrows in the bottom-right corner       */}
      {/* - NO separate rounded image card on the right                           */}
      {/* ======================================================================= */}
      <div className="hidden lg:block relative w-full min-h-[580px] xl:min-h-[640px] overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={`desktop-${slide.id}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} dari ${slides.length}: ${slide.eyebrow}`}
            >
              {/* Full-Width Residential Background Media (Video or Image) */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {slide.mediaType === 'video' && slide.videoUrl ? (
                  getYouTubeEmbedUrl(slide.videoUrl) ? (
                    <iframe
                      src={`${getYouTubeEmbedUrl(slide.videoUrl)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeEmbedUrl(slide.videoUrl)?.split('/').pop()}&controls=0&showinfo=0&rel=0`}
                      className="w-full h-full object-cover pointer-events-none scale-125"
                      allow="autoplay; encrypted-media"
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
                      className="w-full h-full object-cover object-center"
                    />
                  )
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className={`w-full h-full object-cover object-center transition-transform duration-1000 ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                )}
              </div>

              {/* Dark Left-to-Right Corporate Navy Gradient Overlay */}
              <div
                className="absolute inset-0 z-[1] bg-gradient-to-r from-[#073B78] via-[#073B78]/90 to-[#073B78]/40 xl:to-transparent"
                aria-hidden="true"
              />

              {/* Geometric Diagonal Ribbons Connecting Left to Right Visually */}
              <div
                className="absolute inset-0 z-[2] pointer-events-none overflow-hidden opacity-30"
                aria-hidden="true"
              >
                <div className="absolute -bottom-10 left-1/2 w-64 h-8 bg-[#FF9D2E] rounded-full transform -rotate-45 shadow-xl" />
                <div className="absolute -top-8 right-1/4 w-48 h-6 bg-[#1C5795] rounded-full transform -rotate-45" />
              </div>

              {/* Left-Aligned Overlay Content Block */}
              <div className="relative z-10 w-full max-w-[1360px] mx-auto px-8 lg:px-12 h-full min-h-[580px] xl:min-h-[640px] flex items-center">
                <div className="max-w-2xl space-y-5 lg:space-y-6">
                  {/* Project Status Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102D52]/90 border border-white/20 text-white text-[12px] font-medium tracking-wide shadow-sm backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-[#FF9D2E] animate-pulse" />
                    <span>{slide.eyebrow}</span>
                  </div>

                  {/* Headline with DM Serif Display & Muted Gold Highlight */}
                  <h1 className="font-serif font-normal text-[clamp(3rem,4.5vw,4.25rem)] leading-[1.12] tracking-tight text-white">
                    <span>{slide.headlineFirstLine}</span><br />
                    <span className="text-[#FF9D2E] font-serif">{slide.headlineHighlight}</span>
                  </h1>

                  {/* Supporting Description in DM Sans */}
                  <p className="font-sans text-[16px] lg:text-[17.5px] text-white/90 leading-relaxed max-w-xl">
                    {slide.supportingText}
                  </p>

                  {/* Action CTA Buttons */}
                  <div className="flex items-center gap-4 pt-2">
                    <Link
                      href={slide.primaryCtaHref}
                      prefetch={false}
                      className="group h-[48px] px-7 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-[13.5px] font-semibold tracking-normal transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-[#FF9D2E]/25 flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span>{slide.primaryCtaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>

                    {slide.isSecondaryExternal ? (
                      <a
                        href={slide.secondaryCtaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-[48px] px-7 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 text-white text-[13.5px] font-medium tracking-normal transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <MessageCircle className="w-4 h-4 text-[#FF9D2E]" />
                        <span>{slide.secondaryCtaText}</span>
                      </a>
                    ) : (
                      <Link
                        href={slide.secondaryCtaHref}
                        prefetch={false}
                        className="h-[48px] px-7 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 text-white text-[13.5px] font-medium tracking-normal transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {slide.secondaryCtaText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Counter & Navigation Arrows in Bottom-Right Corner */}
        <div className="absolute bottom-8 right-8 xl:right-12 z-20 flex items-center gap-4 bg-[#102D52]/85 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-2xl">
          {/* Slide Counter */}
          <div className="text-xs font-mono font-bold text-white tracking-widest">
            <span className="text-[#FF9D2E]">0{currentIndex + 1}</span>
            <span className="text-white/40 mx-1.5">/</span>
            <span>0{slides.length}</span>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5 border-l border-white/20 pl-3.5">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => goToSlide(dotIdx)}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === currentIndex
                    ? 'w-6 h-2 bg-[#FF9D2E]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${dotIdx + 1}`}
                aria-current={dotIdx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-3.5">
            <button
              type="button"
              onClick={goToPrev}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white flex items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white flex items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              aria-label="Slide selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. MOBILE HERO: ICC-INSPIRED PROMOTIONAL BANNER (< 1024px)              */}
      {/* - Full-width promotional banner immediately below navbar                */}
      {/* - Width: 100%, NO horizontal margins                                    */}
      {/* - Banner artwork with residential photography & orange accents          */}
      {/* - Previous / Next arrows overlaid on the banner                         */}
      {/* - Pagination dots beneath or within the banner                          */}
      {/* - Clean content section begins directly below banner                    */}
      {/* ======================================================================= */}
      <div
        className="block lg:hidden relative w-full overflow-hidden bg-[#073B78]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full-width banner container with calibrated promotional aspect ratio */}
        <div className="relative w-full min-h-[330px] sm:h-[360px] md:h-[390px] overflow-hidden">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={`mobile-${slide.id}`}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
                aria-hidden={!isActive}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} dari ${slides.length}: ${slide.eyebrow}`}
              >
                {/* Full-Bleed Residential Photography or Video */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {slide.mediaType === 'video' && slide.videoUrl ? (
                    getYouTubeEmbedUrl(slide.videoUrl) ? (
                      <iframe
                        src={`${getYouTubeEmbedUrl(slide.videoUrl)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeEmbedUrl(slide.videoUrl)?.split('/').pop()}&controls=0&showinfo=0&rel=0`}
                        className="w-full h-full object-cover pointer-events-none scale-125"
                        allow="autoplay; encrypted-media"
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
                        className="w-full h-full object-cover object-center"
                      />
                    )
                  ) : (
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      className="w-full h-full object-cover object-center"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  )}
                </div>

                {/* ICC-Inspired Multi-Stop Navy Gradient Overlay */}
                <div
                  className="absolute inset-0 z-[1] bg-gradient-to-r from-[#073B78]/95 via-[#073B78]/85 to-[#073B78]/55"
                  aria-hidden="true"
                />

                {/* Diagonal Geometric Orange Ribbon Accent */}
                <div
                  className="absolute -bottom-6 -left-6 z-[2] w-28 h-5 bg-[#FF9D2E] rounded-full transform -rotate-45 opacity-60 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Coherent Promotional Content on Banner with safe side padding to clear arrows */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center px-10 sm:px-14 py-4">
                  {/* Status Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#102D52]/90 border border-white/20 text-[#FF9D2E] text-[10.5px] sm:text-[11px] font-medium tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D2E] animate-pulse" />
                      {slide.eyebrow.split('•')[0].trim()}
                    </span>
                  </div>

                  {/* Punchy Promotional Headline with DM Serif Display */}
                  <h1 className="font-serif font-normal text-[clamp(1.35rem,5.2vw,1.85rem)] sm:text-[clamp(1.75rem,5vw,2.2rem)] leading-[1.2] text-white tracking-tight max-w-[340px] sm:max-w-md">
                    <span>{slide.headlineFirstLine}</span>{' '}
                    <span className="text-[#FF9D2E] font-serif">{slide.headlineHighlight}</span>
                  </h1>

                  {/* Compact Benefit Message in DM Sans (2 lines readable) */}
                  <p className="font-sans text-[12px] sm:text-[14px] text-white/90 line-clamp-2 mt-1.5 max-w-xs sm:max-w-sm leading-snug">
                    {slide.supportingText}
                  </p>

                  {/* Responsive CTA Buttons */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <Link
                      href={slide.primaryCtaHref}
                      prefetch={false}
                      className="h-[34px] sm:h-[36px] px-4 sm:px-5 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-[11.5px] sm:text-[12px] font-bold tracking-normal inline-flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                    >
                      <span>{slide.primaryCtaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {slide.secondaryCtaText && (
                      <Link
                        href={slide.secondaryCtaHref}
                        prefetch={false}
                        className="h-[34px] sm:h-[36px] px-3.5 sm:px-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 text-[11px] sm:text-[12px] font-medium tracking-normal inline-flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                      >
                        <span>{slide.secondaryCtaText}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Orange Navigation Arrows Positioned OVER the Banner on Left & Right */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] active:scale-90 text-[#102D52] flex items-center justify-center shadow-lg transition-transform focus-visible:outline-none"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] active:scale-90 text-[#102D52] flex items-center justify-center shadow-lg transition-transform focus-visible:outline-none"
                aria-label="Slide selanjutnya"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Centered Pagination Indicators Beneath the Banner Content */}
          {slides.length > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5">
              {slides.map((_, dotIdx) => {
                const isCurrent = dotIdx === currentIndex;
                return (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => goToSlide(dotIdx)}
                    className={`transition-all duration-300 rounded-full ${
                      isCurrent
                        ? 'w-5 h-1.5 bg-[#FF9D2E]'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Pindah ke slide ${dotIdx + 1}`}
                    aria-current={isCurrent ? 'true' : 'false'}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
