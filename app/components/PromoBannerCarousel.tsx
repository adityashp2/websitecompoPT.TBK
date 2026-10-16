'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';

export interface BannerSlide {
  id: string;
  eyebrow: string;
  headline: string;
  headlineHighlight?: string;
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
      headline: 'Hunian Bersubsidi yang Layak untuk ',
      headlineHighlight: 'Masa Depan Keluarga.',
      supportingText:
        'Temukan hunian berkualitas dengan informasi proyek, legalitas, dan simulasi KPR yang transparan.',
      primaryCtaText: 'LIHAT PROYEK',
      primaryCtaHref: '/proyek',
      secondaryCtaText: 'SIMULASI KPR',
      secondaryCtaHref: '/simulasi-kpr',
      image: '/assets/hero-marketing.jpg',
      imageAlt: 'Perumahan Puri Gunung Langgar PT. Terbang Bersama Kawan',
    },
    {
      id: 'slide-kpr-flpp',
      eyebrow: 'KPR BERSUBSIDI FLPP • BUNGA TETAP 5%',
      headline: 'Cicilan Ringan Mulai Rp 1 Jutaan ',
      headlineHighlight: 'per Bulan Sampai Lunas.',
      supportingText:
        'Bebas PPN, uang muka terjangkau, dan tenor hingga 20 tahun. Didampingi proses verifikasi berkas hingga serah terima kunci.',
      primaryCtaText: 'HITUNG SIMULASI',
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
      headline: 'Kawasan Asri Terencana dengan ',
      headlineHighlight: 'Kepastian Hukum Nyata.',
      supportingText:
        'Lokasi strategis di Sabah Balau, dekat kampus dan fasilitas umum. Jalan lingkungan paving, jaringan listrik PLN, dan air bersih.',
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
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch Swipe tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToPrev = useCallback(() => {
    setSlideDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  }, [slides.length, resetTimer]);

  const goToNext = useCallback(() => {
    setSlideDirection('next');
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    resetTimer();
  }, [slides.length, resetTimer]);

  const goToSlide = useCallback((index: number) => {
    setSlideDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
    resetTimer();
  }, [currentIndex, resetTimer]);

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
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch Swipe Handlers
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
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <section
      id="beranda"
      className="relative w-full overflow-hidden select-none bg-[#073B78]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promosi Unggulan PT. Terbang Bersama Kawan"
    >
      {/* Edge-to-Edge Full-Width Slides Container */}
      <div className="relative w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] xl:min-h-[620px] flex items-center">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} dari ${slides.length}: ${slide.eyebrow}`}
            >
              {/* Background Photography with Coordinated Zoom Reveal */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className={`w-full h-full object-cover object-center ${
                    isActive ? 'animate-hero-image' : 'scale-100'
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>

              {/* ICC-Inspired Dark Corporate Navy Gradient Overlay */}
              <div
                className="absolute inset-0 z-[1] bg-gradient-to-r from-[#073B78] via-[#073B78]/90 to-[#073B78]/45 sm:from-[#073B78]/95 sm:via-[#073B78]/80 sm:to-[#102D52]/30"
                aria-hidden="true"
              />

              {/* Decorative Geometric Diagonal Slashes that slide in smoothly */}
              <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden opacity-30 sm:opacity-40" aria-hidden="true">
                <div
                  className={`absolute -bottom-8 -left-8 w-44 sm:w-60 h-8 sm:h-10 bg-[#FF9D2E] rounded-full transform -rotate-45 shadow-xl transition-transform duration-700 ease-out ${
                    isActive ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                />
                <div
                  className={`absolute -top-6 -right-6 w-36 sm:w-48 h-6 sm:h-8 bg-[#1C5795] rounded-full transform -rotate-45 transition-transform duration-700 ease-out delay-150 ${
                    isActive ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                  }`}
                />
              </div>

              {/* Subtle top & bottom shadow gradient for contrast with header and next section */}
              <div
                className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#073B78]/70 to-transparent z-[2] pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#073B78]/80 to-transparent z-[2] pointer-events-none"
                aria-hidden="true"
              />

              {/* Coordinated Content Entrance Sequence (Key-based to re-trigger on change) */}
              {isActive && (
                <div key={`content-${slide.id}-${currentIndex}`} className="relative z-10 w-full h-full flex items-center">
                  <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                    <div className="max-w-xl sm:max-w-2xl text-left space-y-4 sm:space-y-5">
                      {/* 1. Eyebrow Status Badge (Slides in smoothly) */}
                      <div className="animate-hero-eyebrow">
                        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#102D52]/85 border border-white/20 text-white text-[10.5px] sm:text-[12px] font-bold tracking-wider uppercase backdrop-blur-sm shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-[#FF9D2E] animate-pulse" />
                          <span>{slide.eyebrow}</span>
                        </div>
                      </div>

                      {/* 2. Headline (Fades in & moves upward with delay) */}
                      <h1 className="animate-hero-headline font-sans font-black text-[27px] sm:text-[38px] lg:text-[46px] leading-[1.18] sm:leading-[1.15] tracking-tight text-white">
                        <span>{slide.headline}</span>
                        {slide.headlineHighlight && (
                          <span className="block text-[#FF9D2E] mt-0.5 sm:mt-1">
                            {slide.headlineHighlight}
                          </span>
                        )}
                      </h1>

                      {/* 3. Supporting Text (Appears with delay) */}
                      <p className="animate-hero-text text-[14px] sm:text-[15.5px] lg:text-[16.5px] leading-relaxed text-white/90 max-w-lg">
                        {slide.supportingText}
                      </p>

                      {/* 4. Action Buttons (Appear last in sequence) */}
                      <div className="animate-hero-cta flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                        <Link
                          href={slide.primaryCtaHref}
                          prefetch={false}
                          className="group h-[44px] sm:h-[48px] px-6 sm:px-8 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-[12px] sm:text-[13px] font-black tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.98] shadow-lg shadow-[#FF9D2E]/25 flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          <span>{slide.primaryCtaText}</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        {slide.isSecondaryExternal ? (
                          <a
                            href={slide.secondaryCtaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-[44px] sm:h-[48px] px-6 sm:px-8 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 text-white text-[12px] sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            <MessageCircle className="w-4 h-4 text-[#FF9D2E]" />
                            <span>{slide.secondaryCtaText}</span>
                          </a>
                        ) : (
                          <Link
                            href={slide.secondaryCtaHref}
                            prefetch={false}
                            className="h-[44px] sm:h-[48px] px-6 sm:px-8 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 text-white text-[12px] sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.98] flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            {slide.secondaryCtaText}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Carousel Arrow Controls (Positioned OVER the banner with hover lift) */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2.5 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#073B78]/85 hover:bg-[#102D52] hover:scale-105 active:scale-95 border border-white/20 text-[#FF9D2E] flex items-center justify-center transition-all duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E]"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2.5 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#073B78]/85 hover:bg-[#102D52] hover:scale-105 active:scale-95 border border-white/20 text-[#FF9D2E] flex items-center justify-center transition-all duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E]"
              aria-label="Slide selanjutnya"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Centered Pagination Indicators (Positioned below / bottom, with smooth pill width expand) */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
            {slides.map((_, dotIdx) => {
              const isCurrent = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => goToSlide(dotIdx)}
                  className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E] ${
                    isCurrent
                      ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#FF9D2E] shadow-sm'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70 border border-white/30'
                  }`}
                  aria-label={`Pindah ke slide ${dotIdx + 1}`}
                  aria-current={isCurrent ? 'true' : 'false'}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
