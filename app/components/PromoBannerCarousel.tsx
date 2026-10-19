'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

import { BannerSlide, defaultBannerSlides, getYouTubeEmbedUrl } from '@/lib/initialData';
export type { BannerSlide };

interface PromoBannerCarouselProps {
  slides?: BannerSlide[];
  whatsappUrl?: string;
}


export const getFontFamilyStyle = (family?: string) => {
  switch (family) {
    case 'sans':
      return 'var(--font-sans), sans-serif';
    case 'cormorant':
      return 'var(--font-cormorant), Garamond, serif';
    case 'system':
      return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    case 'georgia':
      return "Georgia, 'Times New Roman', serif";
    case 'serif':
    default:
      return 'var(--font-serif), Georgia, serif';
  }
};

export const getFontWeightStyle = (weight?: string) => {
  switch (weight) {
    case 'medium': return 500;
    case 'semibold': return 600;
    case 'bold': return 700;
    case 'extrabold': return 800;
    case 'normal':
    default: return 400;
  }
};

export const getDesktopFontSize = (size?: string) => {
  switch (size) {
    case 'sm': return 'clamp(2.25rem, 3.2vw, 2.75rem)';
    case 'base': return 'clamp(2.75rem, 3.8vw, 3.5rem)';
    case 'xl': return 'clamp(3.5rem, 5.2vw, 4.85rem)';
    case '2xl': return 'clamp(4rem, 6vw, 5.5rem)';
    case 'lg':
    default: return 'clamp(3rem, 4.5vw, 4.25rem)';
  }
};

export const getMobileFontSize = (size?: string) => {
  switch (size) {
    case 'sm': return 'clamp(1.15rem, 4.2vw, 1.45rem)';
    case 'base': return 'clamp(1.25rem, 4.8vw, 1.65rem)';
    case 'xl': return 'clamp(1.55rem, 5.8vw, 2.15rem)';
    case '2xl': return 'clamp(1.75rem, 6.5vw, 2.45rem)';
    case 'lg':
    default: return 'clamp(1.35rem, 5.2vw, 1.85rem)';
  }
};

export const getSupportingTextFontSize = (size?: string, isMobile = false) => {
  if (isMobile) {
    switch (size) {
      case 'xs': return '11px';
      case 'base': return '13.5px';
      case 'lg': return '15px';
      case 'sm':
      default: return '12px';
    }
  }
  switch (size) {
    case 'xs': return '14px';
    case 'base': return '16px';
    case 'lg': return '19px';
    case 'sm':
    default: return '16.5px';
  }
};

export function hexToRgb(hex?: string): string {
  let clean = (hex || '').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return '7, 59, 120';
  const r = parseInt(clean.substring(0, 2), 16) || 7;
  const g = parseInt(clean.substring(2, 4), 16) || 59;
  const b = parseInt(clean.substring(4, 6), 16) || 120;
  return `${r}, ${g}, ${b}`;
}

export function getOverlayStyle(slide?: Partial<BannerSlide> | null): React.CSSProperties {
  if (!slide) {
    return {
      background: 'linear-gradient(to right, rgba(7, 59, 120, 0.9) 0%, rgba(7, 59, 120, 0.85) 30%, rgba(7, 59, 120, 0.45) 60%, transparent 85%)',
    };
  }
  const color = slide.overlayColor || '#073B78';
  const rgb = hexToRgb(color);
  const opacity = (slide.overlayOpacity !== undefined ? slide.overlayOpacity : 90) / 100;
  const coverage = slide.overlayCoverage !== undefined ? slide.overlayCoverage : 60;
  const direction = slide.overlayDirection || 'left';

  if (direction === 'full') {
    return {
      backgroundColor: `rgba(${rgb}, ${opacity})`,
    };
  }

  if (direction === 'right') {
    return {
      background: `linear-gradient(to left, rgba(${rgb}, ${opacity}) 0%, rgba(${rgb}, ${opacity * 0.95}) ${Math.max(5, coverage - 30)}%, rgba(${rgb}, ${opacity * 0.45}) ${coverage}%, transparent ${Math.min(100, coverage + 25)}%)`,
    };
  }

  if (direction === 'top') {
    return {
      background: `linear-gradient(to bottom, rgba(${rgb}, ${opacity}) 0%, rgba(${rgb}, ${opacity * 0.9}) ${Math.max(5, coverage - 25)}%, rgba(${rgb}, ${opacity * 0.4}) ${coverage}%, transparent ${Math.min(100, coverage + 20)}%)`,
    };
  }

  return {
    background: `linear-gradient(to right, rgba(${rgb}, ${opacity}) 0%, rgba(${rgb}, ${opacity * 0.95}) ${Math.max(5, coverage - 30)}%, rgba(${rgb}, ${opacity * 0.45}) ${coverage}%, transparent ${Math.min(100, coverage + 25)}%)`,
  };
}

export function getMobileOverlayStyle(slide?: Partial<BannerSlide> | null): React.CSSProperties {
  if (!slide) {
    return {
      background: 'linear-gradient(to right, rgba(7, 59, 120, 0.95) 0%, rgba(7, 59, 120, 0.9) 55%, rgba(7, 59, 120, 0.6) 100%)',
    };
  }
  const color = slide.overlayColor || '#073B78';
  const rgb = hexToRgb(color);
  const opacity = (slide.overlayOpacity !== undefined ? Math.min(100, slide.overlayOpacity + 5) : 95) / 100;
  const coverage = slide.overlayCoverage !== undefined ? Math.min(100, slide.overlayCoverage + 15) : 75;

  return {
    background: `linear-gradient(to right, rgba(${rgb}, ${opacity}) 0%, rgba(${rgb}, ${opacity * 0.9}) ${Math.max(10, coverage - 20)}%, rgba(${rgb}, ${opacity * 0.6}) 100%)`,
  };
}

export default function PromoBannerCarousel({ slides: propSlides }: PromoBannerCarouselProps) {
  const slides: BannerSlide[] = Array.isArray(propSlides)
    ? propSlides
    : defaultBannerSlides;

  if (!slides || slides.length === 0) {
    return null;
  }

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
                      src={getYouTubeEmbedUrl(slide.videoUrl, { autoplay: true, mute: true, loop: true, controls: false })!}
                      className="w-full h-full object-cover pointer-events-none scale-125 border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
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
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: slide.imageFit || 'cover',
                      objectPosition: `${(slide as any).imageOffsetX !== undefined ? (slide as any).imageOffsetX : 50}% ${slide.imageOffsetY !== undefined ? slide.imageOffsetY : 50}%`,
                      transform: `scale(${((slide.imageZoom !== undefined ? slide.imageZoom : 100) / 100) * (isActive ? 1.05 : 1)})`,
                    }}
                    className="w-full h-full transition-transform duration-1000"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                )}
              </div>

              {/* Dark Left-to-Right Corporate Navy Gradient Overlay */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none transition-all duration-500"
                style={getOverlayStyle(slide)}
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

                  {/* Headline with Customizable Typography, Size & Colors */}
                  <h1
                    style={{
                      fontFamily: getFontFamilyStyle(slide.headlineFontFamily),
                      fontSize: getDesktopFontSize(slide.headlineFontSize),
                      fontWeight: getFontWeightStyle(slide.headlineFontWeight),
                      lineHeight: 1.12,
                    }}
                    className="tracking-tight text-white"
                  >
                    <span style={{ color: slide.headlineFirstLineColor || '#FFFFFF' }}>
                      {slide.headlineFirstLine}
                    </span>
                    <br />
                    <span style={{ color: slide.headlineHighlightColor || '#FF9D2E' }}>
                      {slide.headlineHighlight}
                    </span>
                  </h1>

                  {/* Supporting Description with Customizable Size & Color */}
                  {slide.supportingText && slide.supportingText.trim() !== '' && (
                    <p
                      style={{
                        color: slide.supportingTextColor || 'rgba(255, 255, 255, 0.9)',
                        fontSize: getSupportingTextFontSize(slide.supportingTextFontSize, false),
                      }}
                      className="font-sans leading-relaxed max-w-xl"
                    >
                      {slide.supportingText}
                    </p>
                  )}

                  {/* Action CTA Buttons */}
                  <div className="flex items-center gap-4 pt-2">
                    {slide.primaryCtaText && slide.primaryCtaText.trim() !== '' && slide.primaryCtaHref && slide.primaryCtaHref.trim() !== '' && (
                      <Link
                        href={slide.primaryCtaHref}
                        prefetch={false}
                        className="group h-[48px] px-7 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-[13.5px] font-semibold tracking-normal transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-[#FF9D2E]/25 flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <span>{slide.primaryCtaText}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    )}

                    {slide.secondaryCtaText && slide.secondaryCtaText.trim() !== '' && slide.secondaryCtaHref && slide.secondaryCtaHref.trim() !== '' && (
                      slide.isSecondaryExternal ? (
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
                      )
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
                        src={getYouTubeEmbedUrl(slide.videoUrl, { autoplay: true, mute: true, loop: true, controls: false })!}
                        className="w-full h-full object-cover pointer-events-none scale-125 border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
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
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: slide.imageFit || 'cover',
                        objectPosition: `${(slide as any).imageOffsetX !== undefined ? (slide as any).imageOffsetX : 50}% ${slide.imageOffsetY !== undefined ? slide.imageOffsetY : 50}%`,
                        transform: `scale(${(slide.imageZoom !== undefined ? slide.imageZoom : 100) / 100})`,
                      }}
                      className="w-full h-full"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  )}
                </div>

                {/* ICC-Inspired Multi-Stop Navy Gradient Overlay */}
                <div
                  className="absolute inset-0 z-[1] pointer-events-none transition-all duration-500"
                  style={getMobileOverlayStyle(slide)}
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
                  {slide.eyebrow && slide.eyebrow.trim() !== '' && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#102D52]/90 border border-white/20 text-[#FF9D2E] text-[10.5px] sm:text-[11px] font-medium tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D2E] animate-pulse" />
                        {slide.eyebrow.split('•')[0].trim()}
                      </span>
                    </div>
                  )}

                  {/* Punchy Promotional Headline with Customizable Typography & Colors */}
                  <h1
                    style={{
                      fontFamily: getFontFamilyStyle(slide.headlineFontFamily),
                      fontSize: getMobileFontSize(slide.headlineFontSize),
                      fontWeight: getFontWeightStyle(slide.headlineFontWeight),
                      lineHeight: 1.2,
                    }}
                    className="text-white tracking-tight max-w-[340px] sm:max-w-md"
                  >
                    <span style={{ color: slide.headlineFirstLineColor || '#FFFFFF' }}>
                      {slide.headlineFirstLine}
                    </span>{' '}
                    <span style={{ color: slide.headlineHighlightColor || '#FF9D2E' }}>
                      {slide.headlineHighlight}
                    </span>
                  </h1>

                  {/* Compact Benefit Message in DM Sans with Customizable Color & Size */}
                  {slide.supportingText && slide.supportingText.trim() !== '' && (
                    <p
                      style={{
                        color: slide.supportingTextColor || 'rgba(255, 255, 255, 0.9)',
                        fontSize: getSupportingTextFontSize(slide.supportingTextFontSize, true),
                      }}
                      className="font-sans line-clamp-2 mt-1.5 max-w-xs sm:max-w-sm leading-snug"
                    >
                      {slide.supportingText}
                    </p>
                  )}

                  {/* Responsive CTA Buttons */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    {slide.primaryCtaText && slide.primaryCtaText.trim() !== '' && slide.primaryCtaHref && slide.primaryCtaHref.trim() !== '' && (
                      <Link
                        href={slide.primaryCtaHref}
                        prefetch={false}
                        className="h-[34px] sm:h-[36px] px-4 sm:px-5 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-[11.5px] sm:text-[12px] font-bold tracking-normal inline-flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                      >
                        <span>{slide.primaryCtaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {slide.secondaryCtaText && slide.secondaryCtaText.trim() !== '' && slide.secondaryCtaHref && slide.secondaryCtaHref.trim() !== '' && (
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
