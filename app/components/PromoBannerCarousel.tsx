'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';

export interface BannerSlide {
  id: string;
  eyebrow: string;
  headlineFirstLine: string;
  headlineHighlight: string;
  supportingText: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  isSecondaryExternal?: boolean;
  image: string;
  imageAlt: string;
}

interface PromoBannerCarouselProps {
  whatsappUrl?: string;
}

export default function PromoBannerCarousel({ whatsappUrl }: PromoBannerCarouselProps) {
  const defaultWa = whatsappUrl || 'https://wa.me/6281278901234';

  const slides: BannerSlide[] = [
    {
      id: 'slide-puri-gunung-langgar',
      eyebrow: 'PURI GUNUNG LANGGAR • PROYEK BERJALAN',
      headlineFirstLine: 'Hunian bersubsidi yang layak,',
      headlineHighlight: 'dibangun dari Lampung.',
      supportingText:
        'PT. Terbang Bersama Kawan adalah pengembang perumahan di Bandar Lampung. Saat ini kami sedang membangun Puri Gunung Langgar di Lampung Selatan.',
      primaryCtaText: 'LIHAT PROYEK',
      primaryCtaHref: '/proyek',
      secondaryCtaText: 'HUBUNGI KAMI',
      secondaryCtaHref: '/kontak',
      image: '/assets/hero-marketing.jpg',
      imageAlt: 'Perumahan Puri Gunung Langgar PT. Terbang Bersama Kawan',
    },
    {
      id: 'slide-kpr-flpp',
      eyebrow: 'KPR BERSUBSIDI FLPP • BUNGA TETAP 5%',
      headlineFirstLine: 'Cicilan ringan mulai 1 jutaan,',
      headlineHighlight: 'proses mudah sampai serah kunci.',
      supportingText:
        'Miliki rumah impian subsidi pemerintah dengan bunga tetap 5% hingga 20 tahun, bebas PPN, dan pendampingan berkas lengkap hingga akad kredit.',
      primaryCtaText: 'SIMULASI KPR',
      primaryCtaHref: '/simulasi-kpr',
      secondaryCtaText: 'KONSULTASI WHATSAPP',
      secondaryCtaHref: `${defaultWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin berkonsultasi mengenai program KPR FLPP Puri Gunung Langgar.')}`,
      isSecondaryExternal: true,
      image: '/assets/project-workspace.jpg',
      imageAlt: 'Master Plan Kawasan Perumahan Puri Gunung Langgar',
    },
    {
      id: 'slide-legalitas-lokasi',
      eyebrow: 'LEGALITAS SHM PASTI • TANJUNG BINTANG',
      headlineFirstLine: 'Kawasan asri terencana dengan,',
      headlineHighlight: 'kepastian hukum nyata.',
      supportingText:
        'Lokasi strategis di Sabah Balau, dekat fasilitas umum, jalan lingkungan paving lebar, jaringan listrik PLN, dan instalasi air bersih siap huni.',
      primaryCtaText: 'DETAIL LEGALITAS',
      primaryCtaHref: '/legalitas',
      secondaryCtaText: 'HUBUNGI KAMI',
      secondaryCtaHref: '/kontak',
      image: '/assets/service-residential.jpg',
      imageAlt: 'Pekerjaan Pembangunan Fisik Unit Rumah Subsidi',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch Swipe tracking for Mobile Carousel
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  }, [slides.length, resetTimer]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    resetTimer();
  }, [slides.length, resetTimer]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    resetTimer();
  }, [resetTimer]);

  // Autoplay effect (5.5s) with pause, visibility, and reduced motion check
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleVisibility = () => {
      if (document.hidden) {
        resetTimer();
      } else if (!isPaused) {
        resetTimer();
        timerRef.current = setInterval(() => {
          goToNext();
        }, 5500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    timerRef.current = setInterval(() => {
      goToNext();
    }, 5500);

    return () => {
      resetTimer();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [slides.length, isPaused, goToNext, resetTimer]);

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
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
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

  const currentSlide = slides[currentIndex];

  return (
    <section
      id="beranda"
      className="relative w-full overflow-hidden select-none bg-[#073B78]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promosi Unggulan PT. Terbang Bersama Kawan"
    >
      {/* ======================================================================= */}
      {/* 1. DESKTOP HERO: EXACT MATCH TO PT. TBK DESIGN CONCEPT (>= 980px)      */}
      {/* Left: pill, split bold headline with orange highlight, text, 2 buttons  */}
      {/* Right: residential photograph with marketing officer & diagonal accents */}
      {/* Controls: bottom-right circular arrows & 3 pagination dots              */}
      {/* ======================================================================= */}
      <div className="hidden min-[980px]:block relative w-full bg-gradient-to-r from-[#073B78] via-[#084284] to-[#0A4B91] overflow-hidden">
        {/* Subtle Architectural Grid Texture in deep background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden="true"
        />

        <div className="w-full max-w-[1360px] mx-auto px-6 lg:px-8 py-10 lg:py-14 min-h-[520px] lg:min-h-[560px] flex items-center">
          <div className="w-full grid grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Headline & Promotional Copy */}
            <div className="col-span-7 z-10 space-y-5 lg:space-y-6">
              {/* Pill Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102D52] border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF9D2E] animate-pulse" />
                <span>{currentSlide.eyebrow}</span>
              </div>

              {/* Headline with Orange Highlight */}
              <h1 className="font-sans font-black text-[34px] lg:text-[44px] xl:text-[48px] leading-[1.16] tracking-tight text-white">
                <span>{currentSlide.headlineFirstLine}</span>
                <span className="block text-[#FF9D2E] mt-1">
                  {currentSlide.headlineHighlight}
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-[15px] lg:text-[16px] text-white/85 leading-relaxed max-w-xl">
                {currentSlide.supportingText}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={currentSlide.primaryCtaHref}
                  prefetch={false}
                  className="group h-[48px] px-8 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-[12.5px] font-black tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[#FF9D2E]/25 flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{currentSlide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                {currentSlide.isSecondaryExternal ? (
                  <a
                    href={currentSlide.secondaryCtaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[48px] px-8 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 text-white text-[12.5px] font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FF9D2E]" />
                    <span>{currentSlide.secondaryCtaText}</span>
                  </a>
                ) : (
                  <Link
                    href={currentSlide.secondaryCtaHref}
                    prefetch={false}
                    className="h-[48px] px-8 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 text-white text-[12.5px] font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {currentSlide.secondaryCtaText}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Visual Composition with Geometric Accents */}
            <div className="col-span-5 relative flex items-center justify-center">
              {/* Geometric Diagonal Ribbons matching PT. TBK design concept */}
              <div className="absolute -left-10 bottom-6 z-10 pointer-events-none transform -rotate-45 space-y-3">
                <div className="w-36 lg:w-44 h-5 lg:h-6 bg-[#FF9D2E] rounded-full shadow-lg" />
                <div className="w-24 lg:w-32 h-4 lg:h-5 bg-[#1C5795] rounded-full opacity-90 shadow-md ml-4" />
              </div>

              {/* Main Residential Photograph Frame */}
              <div className="relative w-full aspect-[4/3] lg:aspect-[15/11] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15 bg-[#102D52]">
                {slides.map((slide, sIdx) => {
                  const isActive = sIdx === currentIndex;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        className={`w-full h-full object-cover object-center transition-transform duration-1000 ${
                          isActive ? 'scale-105' : 'scale-100'
                        }`}
                        loading={sIdx === 0 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#073B78]/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  );
                })}

                {/* Bottom Right Carousel Controls (Dots + Circular Arrows) */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3 bg-[#102D52]/85 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 shadow-lg">
                  {/* 3 Pagination Dots */}
                  <div className="flex items-center gap-1.5 mr-1">
                    {slides.map((_, dotIdx) => {
                      const isCurrent = dotIdx === currentIndex;
                      return (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => goToSlide(dotIdx)}
                          className={`transition-all duration-300 rounded-full ${
                            isCurrent
                              ? 'w-5 h-2 bg-[#FF9D2E]'
                              : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                          }`}
                          aria-label={`Pindah ke slide ${dotIdx + 1}`}
                          aria-current={isCurrent ? 'true' : 'false'}
                        />
                      );
                    })}
                  </div>

                  {/* Circular Prev/Next Arrow Buttons */}
                  <div className="flex items-center gap-1.5 border-l border-white/20 pl-2">
                    <button
                      type="button"
                      onClick={goToPrev}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white flex items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                      aria-label="Slide sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white flex items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                      aria-label="Slide selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. MOBILE HERO: FULL-WIDTH PROMOTIONAL BANNER CAROUSEL (< 980px)        */}
      {/* Edge-to-edge, compact height, orange arrows over banner, bottom dots    */}
      {/* Replaces the vertical stack with a banner-first promotional experience */}
      {/* ======================================================================= */}
      <div
        className="block min-[980px]:hidden relative w-full overflow-hidden bg-[#073B78]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner container with calibrated promotional aspect ratio */}
        <div className="relative w-full h-[250px] sm:h-[300px] md:h-[360px] overflow-hidden">
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
                {/* Background Residential Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover object-center"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
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

                {/* Coherent Promotional Content on Banner */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 sm:px-10 pr-12">
                  {/* Status Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#102D52]/90 border border-white/20 text-[#FF9D2E] text-[10px] font-black uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D2E] animate-pulse" />
                      {slide.eyebrow.split('•')[0].trim()}
                    </span>
                  </div>

                  {/* Punchy Promotional Headline */}
                  <h1 className="font-sans font-black text-[20px] sm:text-[26px] leading-[1.2] text-white tracking-tight max-w-[280px] sm:max-w-md">
                    <span>{slide.headlineFirstLine}</span>{' '}
                    <span className="text-[#FF9D2E]">{slide.headlineHighlight}</span>
                  </h1>

                  {/* Compact Benefit Message */}
                  <p className="text-[12px] sm:text-[13.5px] text-white/85 line-clamp-1 sm:line-clamp-2 mt-1 max-w-sm">
                    {slide.supportingText}
                  </p>

                  {/* Compact CTA Button */}
                  <div className="mt-3.5 flex items-center gap-2">
                    <Link
                      href={slide.primaryCtaHref}
                      prefetch={false}
                      className="h-[36px] px-5 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-[11px] font-black tracking-wider uppercase inline-flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <span>{slide.primaryCtaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
