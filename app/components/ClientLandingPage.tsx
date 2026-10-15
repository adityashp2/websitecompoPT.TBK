'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  FileCheck2,
  ArrowRight,
  Check,
  Maximize2,
  Calculator,
  Play,
  Image as ImageIcon,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  Compass
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import { SiteContent, getYouTubeEmbedUrl } from '@/lib/initialData';

function sanitize(val: string | undefined, fallback: string): string {
  if (!val || val.includes('[ISI:') || val === 'aadad' || val === '23232433') {
    return fallback;
  }
  return val;
}

export default function ClientLandingPage({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setContent(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Hero Background Slideshow with authentic project photography
  const heroBgImage = (content.hero?.backgroundImage || '').trim();
  const rawSlides = Array.isArray(content.hero?.slides) ? content.hero.slides : [];
  const validSlides = rawSlides.filter((s) => s && s.image && s.image.trim() !== '');

  const activeBgSlides: Array<{ image: string; caption?: string }> = (() => {
    if (heroBgImage) {
      const otherSlides = validSlides.filter((s) => s.image !== heroBgImage);
      return [
        {
          image: heroBgImage,
          caption: content.hero?.heading || 'Puri Gunung Langgar',
        },
        ...otherSlides,
      ];
    }
    return validSlides.length > 0
      ? validSlides
      : [{ image: '/assets/hero-villa.jpg', caption: 'Puri Gunung Langgar, Lampung Selatan' }];
  })();

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Auto-slide effect for hero (5.5s)
  useEffect(() => {
    if (activeBgSlides.length <= 1 || isHeroPaused) return;
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % activeBgSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeBgSlides.length, isHeroPaused]);

  // Project Media State (Foto Slideshow vs Video YouTube)
  const rawProjectSlides = Array.isArray(content.project?.slides) ? content.project.slides : [];
  const projectSlides = rawProjectSlides.filter((s) => s && s.image && s.image.trim() !== '');
  const activeProjectSlides = projectSlides.length > 0
    ? projectSlides
    : [
        { image: '/assets/project-workspace.jpg', caption: 'Kawasan Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan' },
        { image: '/assets/service-construction.jpg', caption: 'Pematangan dan Perataan Lahan Kawasan' },
        { image: '/assets/service-residential.jpg', caption: 'Progres Pembangunan Unit Hunian Subsidi' },
        { image: '/assets/hero-villa.jpg', caption: 'Visualisasi Standar Kualitas Hunian PT. TBK' },
      ];

  const ytEmbedUrl = getYouTubeEmbedUrl(content.project?.videoUrl);
  const [projectMediaTab, setProjectMediaTab] = useState<'photo' | 'video'>(
    content.project?.mediaType === 'video' && ytEmbedUrl ? 'video' : 'photo'
  );
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);

  // Mobile Touch Swipe State for Project Image Gallery
  const [galleryTouchStartX, setGalleryTouchStartX] = useState<number | null>(null);

  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    setGalleryTouchStartX(e.touches[0].clientX);
  };

  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    if (galleryTouchStartX === null) return;
    const touchDiff = galleryTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(touchDiff) > 40) {
      if (touchDiff > 0) {
        // Swipe left -> Next slide
        setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
      } else {
        // Swipe right -> Prev slide
        setCurrentProjectSlide((prev) => (prev - 1 + activeProjectSlides.length) % activeProjectSlides.length);
      }
    }
    setGalleryTouchStartX(null);
  };

  // Lightbox Modal for Fullscreen Photo Viewing
  const [lightbox, setLightbox] = useState<{ open: boolean; image: string; caption: string }>({
    open: false,
    image: '',
    caption: '',
  });

  // Interactive Mortgage / KPR Simulator State (Subsidized FLPP 5% Flat)
  const [kprHarga, setKprHarga] = useState(166000000);
  const [kprDp, setKprDp] = useState(2000000);
  const [kprTenor, setKprTenor] = useState(20); // 10, 15, or 20 years

  const kprPokok = Math.max(0, kprHarga - kprDp);
  const kprRate = 0.05 / 12; // 5% flat annual for FLPP
  const kprMonths = kprTenor * 12;
  const kprAngsuran = Math.round(
    (kprPokok * (kprRate * Math.pow(1 + kprRate, kprMonths))) / (Math.pow(1 + kprRate, kprMonths) - 1)
  );
  const kprPerHari = Math.round(kprAngsuran / 30);

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Nama lengkap dan nomor WhatsApp wajib diisi.');
      return;
    }
    setFormSubmitting(true);
    setFormError('');

    const rawWaNumber = sanitize(content.contact?.whatsapp, '0812-7890-1234').replace(/[^0-9]/g, '');
    const formattedWaNumber = rawWaNumber.startsWith('0')
      ? `62${rawWaNumber.slice(1)}`
      : rawWaNumber.startsWith('62')
      ? rawWaNumber
      : `62${rawWaNumber}`;

    const waText = `Halo PT. Terbang Bersama Kawan, saya ingin berkonsultasi mengenai perumahan Puri Gunung Langgar.

Data Konsumen:
• Nama: ${formData.name.trim()}
• WhatsApp: ${formData.phone.trim()}${formData.email.trim() ? `\n• Email: ${formData.email.trim()}` : ''}${formData.message.trim() ? `\n• Pertanyaan: ${formData.message.trim()}` : ''}

Mohon informasi ketersediaan unit, tahapan berkas KPR subsidi FLPP, dan jadwal survei lokasi. Terima kasih.`;

    const directWaUrl = `https://wa.me/${formattedWaNumber}?text=${encodeURIComponent(waText)}`;

    // Sync to backend DB
    try {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => {});
    } catch {}

    window.open(directWaUrl, '_blank');
    setFormSuccess(true);
    setFormSubmitting(false);
  };

  const whatsappNumber = sanitize(content.contact?.whatsapp, '0812-7890-1234').replace(/[^0-9]/g, '');
  const waUrl = whatsappNumber.startsWith('0')
    ? `https://wa.me/62${whatsappNumber.slice(1)}`
    : `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#262722] font-sans antialiased selection:bg-[#C5A568] selection:text-[#262722]">
      {/* Refined Fixed Header */}
      <Header content={content} />

      <main id="main-content">
        {/* ========================================================= */}
        {/* SECTION 1: HERO SECTION (Architectural Editorial Focus) */}
        {/* ========================================================= */}
        <section
          id="beranda"
          className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-end bg-[#262722] overflow-hidden select-none"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          aria-label="Beranda PT. Terbang Bersama Kawan"
        >
          {/* Architectural Background Photography */}
          <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            {activeBgSlides.map((slide, idx) => {
              const isActive = idx === currentBgIndex;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                />
              );
            })}
          </div>

          {/* Directional Gradient Overlay: Darker behind text on left, revealing facade & stone textures on right */}
          <div
            className="absolute inset-0 z-[1] hidden sm:block pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(38,39,34,0.86) 0%, rgba(38,39,34,0.64) 36%, rgba(38,39,34,0.20) 68%, rgba(38,39,34,0.02) 100%)',
            }}
            aria-hidden="true"
          />
          {/* Mobile Directional Gradient: Bottom-up for text contrast */}
          <div
            className="absolute inset-0 z-[1] sm:hidden pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(38,39,34,0.92) 0%, rgba(38,39,34,0.62) 50%, rgba(38,39,34,0.12) 100%)',
            }}
            aria-hidden="true"
          />

          {/* Hero Content Container */}
          <div className="relative z-10 w-full container-editorial pb-10 sm:pb-14 lg:pb-16 pt-24 sm:pt-32">
            <div className="max-w-[540px] text-left">
              {/* Compact Project Status Label */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-black/40 border border-white/15 text-[#C5A568] text-[10.5px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase mb-3 sm:mb-3.5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Puri Gunung Langgar &bull; Proyek Berjalan</span>
              </div>

              {/* Headline: Refined Editorial Serif (Reduced by ~12% on desktop, intentional line breaks) */}
              <h1 className="font-serif font-normal text-[26px] sm:text-[36px] lg:text-[45px] leading-[1.18] sm:leading-[1.2] tracking-[-0.01em] text-[#F3EFE6] max-w-[530px]">
                <span className="block">Hunian bersubsidi yang layak,</span>
                <span className="block text-[#C5A568]">dibangun dari Lampung.</span>
              </h1>

              {/* Supporting Copy: Clean Sans-Serif, controlled length */}
              <p className="font-sans text-[13.5px] sm:text-[15px] leading-[1.62] text-[#F3EFE6]/85 max-w-[480px] mt-3 sm:mt-3.5 mb-6 sm:mb-7">
                PT. Terbang Bersama Kawan adalah pengembang perumahan di Bandar Lampung. Saat ini kami sedang membangun Puri Gunung Langgar di Lampung Selatan.
              </p>

              {/* Refined CTA Button System */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-3.5">
                <Link
                  href="/proyek"
                  prefetch={false}
                  className="group h-[42px] sm:h-[44px] px-5 sm:px-6 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-[12px] sm:text-[12.5px] font-semibold tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.99] shadow-sm hover:shadow flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Lihat Proyek</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/kontak"
                  prefetch={false}
                  className="h-[42px] sm:h-[44px] px-5 sm:px-6 rounded-[12px] border border-white/40 hover:border-[#C5A568] hover:bg-[#C5A568]/15 text-[#F3EFE6] text-[12px] sm:text-[12.5px] font-semibold tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.99] flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>

            {/* Subtle Architectural Slide Counter (Bottom Right) */}
            {activeBgSlides.length > 1 && (
              <div className="hidden sm:flex absolute right-6 lg:right-12 bottom-12 lg:bottom-16 items-center gap-3 text-xs text-[#F3EFE6]/70">
                <span className="font-mono text-[#C5A568] tracking-widest">
                  0{currentBgIndex + 1} / 0{activeBgSlides.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentBgIndex((prev) => (prev - 1 + activeBgSlides.length) % activeBgSlides.length)}
                    className="w-8 h-8 rounded-[3px] border border-white/20 hover:border-white text-white flex items-center justify-center transition-colors"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentBgIndex((prev) => (prev + 1) % activeBgSlides.length)}
                    className="w-8 h-8 rounded-[3px] border border-white/20 hover:border-white text-white flex items-center justify-center transition-colors"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: DEDICATED PROJECT SECTION (Immediately after Hero!) */}
        {/* Background: Warm Ivory #F3EFE6 */}
        {/* ========================================================= */}
        <section id="proyek" className="py-20 sm:py-28 bg-[#F3EFE6] border-b border-[#DDD8CE]">
          <div className="container-editorial">
            {/* Section Header */}
            <div className="max-w-2xl mb-12 sm:mb-16">
              <span className="text-xs uppercase tracking-[0.14em] text-[#C5A568] font-semibold block mb-2">
                Proyek Unggulan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#262722] leading-tight">
                Puri Gunung Langgar
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#77766F] mt-3 leading-relaxed">
                Kawasan perumahan subsidi terencana di Tanjung Bintang, Lampung Selatan. Menghadirkan rumah tapak berkualitas dengan kepastian legalitas dan lingkungan yang asri.
              </p>
            </div>

            {/* Asymmetrical Editorial Showcase: Visual Photo Left, Spec Sheet Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Authentic Architectural Media Viewer */}
              <div className="lg:col-span-7 space-y-3">
                <div
                  className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-[10px] overflow-hidden bg-[#262722] border border-[#DDD8CE] shadow-sm select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A568]"
                  tabIndex={0}
                  role="region"
                  aria-label="Galeri foto dokumentasi proyek Puri Gunung Langgar. Gunakan tombol panah kiri dan kanan pada keyboard untuk berganti foto."
                  onTouchStart={handleGalleryTouchStart}
                  onTouchEnd={handleGalleryTouchEnd}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      setCurrentProjectSlide((prev) => (prev - 1 + activeProjectSlides.length) % activeProjectSlides.length);
                    } else if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
                    }
                  }}
                >
                  {/* Layered Crossfade & Subtle Scale (1.025 to 1.0) Transitions */}
                  {activeProjectSlides.map((slide, sIdx) => {
                    const isActive = sIdx === currentProjectSlide;
                    return (
                      <div
                        key={sIdx}
                        className={`absolute inset-0 transition-all duration-500 ease-out cursor-pointer ${
                          isActive
                            ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                            : 'opacity-0 scale-[1.025] z-0 pointer-events-none'
                        }`}
                        onClick={() =>
                          setLightbox({
                            open: true,
                            image: slide.image,
                            caption: `${content.project.name} - ${slide.caption || 'Dokumentasi Proyek'}`,
                          })
                        }
                        aria-hidden={!isActive}
                      >
                        <img
                          src={slide.image}
                          alt={slide.caption || 'Puri Gunung Langgar'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}

                  {/* Top Bar: Minimal Counter & Enlarge Button */}
                  <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                    {/* Minimal Image Counter: 01 / 04 */}
                    <div className="px-2.5 py-1 rounded-[6px] bg-[#262722]/80 backdrop-blur-sm border border-white/15 text-[#F3EFE6] font-mono text-[11px] font-medium tracking-wider shadow-sm pointer-events-auto">
                      <span className="text-[#C5A568]">0{currentProjectSlide + 1}</span>
                      <span className="text-white/40 mx-1">/</span>
                      <span>0{activeProjectSlides.length}</span>
                    </div>

                    {/* Corner Enlarge Indicator */}
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({
                          open: true,
                          image: activeProjectSlides[currentProjectSlide]?.image || '/assets/project-workspace.jpg',
                          caption: `${content.project.name} - ${activeProjectSlides[currentProjectSlide]?.caption || 'Dokumentasi Proyek'}`,
                        })
                      }
                      className="bg-[#262722]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-[6px] text-[11px] font-medium flex items-center gap-1.5 border border-white/15 shadow-sm hover:bg-[#262722] hover:border-[#C5A568] transition-colors pointer-events-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A568]"
                      aria-label="Perbesar foto dokumentasi proyek"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#C5A568]" />
                      <span className="hidden sm:inline">Perbesar</span>
                    </button>
                  </div>

                  {/* Understated Previous and Next Controls */}
                  {activeProjectSlides.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProjectSlide((prev) => (prev - 1 + activeProjectSlides.length) % activeProjectSlides.length);
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#262722]/75 hover:bg-[#262722] border border-white/20 text-[#F3EFE6] backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A568] shadow-sm"
                        aria-label="Foto sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#262722]/75 hover:bg-[#262722] border border-white/20 text-[#F3EFE6] backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A568] shadow-sm"
                        aria-label="Foto berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Caption Bar Synchronized with Image Transition */}
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#262722]/95 via-[#262722]/60 to-transparent p-4 sm:p-5 text-[#F3EFE6] pointer-events-none">
                    <div className="text-[11px] sm:text-xs uppercase tracking-wider text-[#C5A568] font-semibold mb-0.5">
                      Dokumentasi Fisik Lapangan
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-[#F3EFE6]/90 line-clamp-1">
                      {activeProjectSlides[currentProjectSlide]?.caption || 'Kawasan Puri Gunung Langgar, Lampung Selatan.'}
                    </p>
                  </div>
                </div>

                {/* Thumbnail Strip: Active Muted Gold Border, Hover Zoom, Inactive Overlay */}
                {activeProjectSlides.length > 1 && (
                  <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pt-1" role="tablist" aria-label="Pilihan sudut galeri proyek">
                    {activeProjectSlides.map((slide, sIdx) => {
                      const isActive = sIdx === currentProjectSlide;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setCurrentProjectSlide(sIdx)}
                          className={`group/thumb relative aspect-[4/3] rounded-[8px] overflow-hidden border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A568] focus-visible:ring-offset-2 ${
                            isActive
                              ? 'border-[#C5A568] ring-1 ring-[#C5A568] shadow-sm'
                              : 'border-[#DDD8CE] hover:border-[#C5A568]/60'
                          }`}
                          aria-label={`Pilih sudut dokumentasi ${sIdx + 1} dari ${activeProjectSlides.length}`}
                        >
                          <img
                            src={slide.image}
                            alt={slide.caption || `Sudut ${sIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/thumb:scale-105"
                          />
                          {/* Restrained Overlay on Inactive Thumbnails */}
                          <div
                            className={`absolute inset-0 transition-colors duration-200 ${
                              isActive ? 'bg-transparent' : 'bg-black/25 group-hover/thumb:bg-black/5'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Architectural Fact & Spec Sheet (Open Editorial Layout) */}
              <div className="lg:col-span-5 flex flex-col justify-between pt-1">
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#DDD8CE]">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#77766F] block font-medium">Kategori Proyek</span>
                      <span className="font-serif text-lg text-[#262722]">Rumah Tapak Bersubsidi</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#262722] font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[#C5A568] uppercase text-[11px] tracking-wider font-semibold">Tahap Konstruksi</span>
                    </div>
                  </div>

                  <dl className="py-2 divide-y divide-[#DDD8CE]/70 text-xs sm:text-[13px]">
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#77766F] font-medium">Lokasi Proyek</dt>
                      <dd className="font-medium text-[#262722] text-right">Desa Sabah Balau, Tanjung Bintang, Lampung Selatan</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#77766F] font-medium">Tipe Bangunan</dt>
                      <dd className="font-semibold text-[#262722]">Tipe 36 / 72 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#77766F] font-medium">Luas Bangunan</dt>
                      <dd className="font-semibold text-[#262722]">36 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#77766F] font-medium">Luas Tanah</dt>
                      <dd className="font-semibold text-[#262722]">72 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#77766F] font-medium">Legalitas Lahan</dt>
                      <dd className="font-semibold text-[#262722]">Sertifikat Hak Milik (SHM)</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#77766F] font-medium">Fasilitas Dasar</dt>
                      <dd className="font-medium text-[#262722] text-right">Jalan Paving, Listrik PLN, Air Bersih</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#77766F] font-medium">Skema Pembiayaan</dt>
                      <dd className="font-semibold text-[#262722]">KPR Bersubsidi FLPP 5% & Mandiri</dd>
                    </div>
                  </dl>
                </div>

                <div className="pt-6 border-t border-[#DDD8CE] space-y-3">
                  <Link
                    href="/proyek"
                    prefetch={false}
                    className="group w-full h-[44px] rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.99] shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#262722]"
                  >
                    <span>Lihat Detail Proyek</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-[44px] rounded-[12px] border border-[#262722]/30 hover:border-[#C5A568] hover:bg-[#C5A568]/10 text-[#262722] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A568]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C5A568]" />
                    <span>Tanya Ketersediaan Kavling</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: COMPANY PROFILE (Tentang PT. TBK) */}
        {/* Background: White #FFFFFF */}
        {/* ========================================================= */}
        <section id="tentang" className="py-20 sm:py-28 bg-white border-b border-[#DDD8CE]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Narrative & Corporate Identity */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.14em] text-[#C5A568] font-semibold block mb-2">
                    Profil Pengembang
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#262722] leading-tight">
                    Membangun dengan Komitmen & Legalitas Nyata
                  </h2>
                </div>

                <p className="text-[15px] sm:text-[16px] text-[#262722]/85 leading-relaxed">
                  {content.about?.description || 'PT. Terbang Bersama Kawan (PT. TBK) adalah perusahaan pengembang properti yang berbasis di Bandar Lampung. Didirikan secara sah dengan Akta Notaris No. 10 tanggal 18 Maret 2021 dan disahkan oleh Kementerian Hukum dan HAM RI pada 19 Maret 2021.'}
                </p>

                <p className="text-[15px] text-[#77766F] leading-relaxed">
                  {content.about?.commitmentBody || 'Sebagai pengembang properti resmi di Provinsi Lampung, PT. Terbang Bersama Kawan mengutamakan kepastian hukum, keterbukaan informasi progres fisik, dan mutu konstruksi terbaik agar masyarakat dapat memiliki rumah impian dengan rasa tenang.'}
                </p>

                {/* 3 Clear Development Pillars (Open Editorial Layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-[#DDD8CE]">
                  <div>
                    <span className="font-serif text-2xl text-[#C5A568] block mb-1.5 font-normal">01</span>
                    <h3 className="font-semibold text-xs text-[#262722] uppercase tracking-wider mb-1.5">Kepastian Hukum</h3>
                    <p className="text-xs text-[#77766F] leading-relaxed">Legalitas tanah SHM dan terdaftar resmi di Kemenkumham RI.</p>
                  </div>
                  <div className="sm:border-l sm:border-[#DDD8CE] sm:pl-6">
                    <span className="font-serif text-2xl text-[#C5A568] block mb-1.5 font-normal">02</span>
                    <h3 className="font-semibold text-xs text-[#262722] uppercase tracking-wider mb-1.5">Mutu Konstruksi</h3>
                    <p className="text-xs text-[#77766F] leading-relaxed">Standar teknis bangunan kokoh dan tata lingkungan terencana.</p>
                  </div>
                  <div className="sm:border-l sm:border-[#DDD8CE] sm:pl-6">
                    <span className="font-serif text-2xl text-[#C5A568] block mb-1.5 font-normal">03</span>
                    <h3 className="font-semibold text-xs text-[#262722] uppercase tracking-wider mb-1.5">Kemudahan KPR</h3>
                    <p className="text-xs text-[#77766F] leading-relaxed">Bantuan pendampingan berkas program subsidi FLPP 5% flat.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/tentang"
                    prefetch={false}
                    className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#262722] hover:text-[#C5A568] transition-colors"
                  >
                    <span>Baca Selengkapnya Tentang PT. TBK</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Editorial Corporate Visual & Vision Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="relative aspect-[4/3] rounded-[8px] overflow-hidden border border-[#DDD8CE] shadow-sm bg-[#262722]">
                  <img
                    src="/assets/project-identity.jpg"
                    alt="Kantor & Perencanaan PT. TBK"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#262722]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-[#F3EFE6] text-xs">
                    <span className="font-semibold text-[#C5A568] uppercase tracking-wider block text-[10px]">Kantor Pusat</span>
                    Bandar Lampung, Provinsi Lampung
                  </div>
                </div>

                {/* Open Editorial Vision Statement */}
                <div className="pt-1 border-l-2 border-[#C5A568] pl-4 sm:pl-5 space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-[#C5A568] font-semibold block">
                    Visi Perseroan
                  </span>
                  <blockquote className="font-serif italic text-base sm:text-lg text-[#262722] leading-snug">
                    &ldquo;{content.about?.visionText || 'Perusahaan properti yang berkualitas dan terpercaya.'}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: HOUSING PURCHASE PROCESS (Alur Kepemilikan) */}
        {/* Background: Warm Ivory #F3EFE6 */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-28 bg-[#F3EFE6] border-b border-[#DDD8CE]">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <span className="text-xs uppercase tracking-[0.14em] text-[#C5A568] font-semibold block mb-2">
                Panduan Konsumen
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#262722] leading-tight">
                Tahapan Pembelian Rumah Subsidi
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#77766F] mt-3 leading-relaxed">
                Alur pengajuan yang transparan dan terstruktur bagi masyarakat, dari pemilihan kavling hingga serah terima kunci.
              </p>
            </div>

            {/* Editorial Connected Horizontal Timeline (Desktop) */}
            <div className="hidden md:block relative pt-2">
              {/* Thin Horizontal Connecting Line */}
              <div 
                className="absolute top-[22px] left-[4%] right-[4%] h-[1px] bg-[#DDD8CE] z-0" 
                aria-hidden="true" 
              />

              <div className="grid grid-cols-4 gap-8 lg:gap-12 relative z-10">
                {/* Stage 01 */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-3 h-3 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568] shrink-0" />
                      <span className="font-serif text-3xl lg:text-4xl text-[#C5A568] font-normal leading-none">01</span>
                    </div>
                    <h3 className="font-semibold text-sm lg:text-[15px] text-[#262722] tracking-wide mb-2">
                      Pilih Unit &amp; Konsultasi
                    </h3>
                    <p className="text-xs lg:text-[13px] text-[#77766F] leading-relaxed">
                      Kunjungi kantor pemasaran atau lokasi proyek untuk memilih nomor kavling yang tersedia dan melakukan konsultasi syarat KPR.
                    </p>
                  </div>
                  <div className="pt-3 mt-5 border-t border-[#DDD8CE]/70 text-[11px] text-[#77766F] font-medium tracking-wide">
                    Survei kavling langsung
                  </div>
                </div>

                {/* Stage 02 */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-3 h-3 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568] shrink-0" />
                      <span className="font-serif text-3xl lg:text-4xl text-[#C5A568] font-normal leading-none">02</span>
                    </div>
                    <h3 className="font-semibold text-sm lg:text-[15px] text-[#262722] tracking-wide mb-2">
                      Pemberkasan Dokumen
                    </h3>
                    <p className="text-xs lg:text-[13px] text-[#77766F] leading-relaxed">
                      Menyiapkan berkas identitas (KTP, KK, NPWP, Slip Gaji atau Keterangan Usaha) untuk verifikasi kelayakan subsidi FLPP.
                    </p>
                  </div>
                  <div className="pt-3 mt-5 border-t border-[#DDD8CE]/70 text-[11px] text-[#77766F] font-medium tracking-wide">
                    Didampingi tim admin
                  </div>
                </div>

                {/* Stage 03 */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-3 h-3 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568] shrink-0" />
                      <span className="font-serif text-3xl lg:text-4xl text-[#C5A568] font-normal leading-none">03</span>
                    </div>
                    <h3 className="font-semibold text-sm lg:text-[15px] text-[#262722] tracking-wide mb-2">
                      Wawancara &amp; Analisis Bank
                    </h3>
                    <p className="text-xs lg:text-[13px] text-[#77766F] leading-relaxed">
                      Proses persetujuan pembiayaan oleh perbankan mitra penyalur KPR bersubsidi dengan suku bunga 5% flat pemerintah.
                    </p>
                  </div>
                  <div className="pt-3 mt-5 border-t border-[#DDD8CE]/70 text-[11px] text-[#77766F] font-medium tracking-wide">
                    Kepastian plafon kredit
                  </div>
                </div>

                {/* Stage 04 */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-3 h-3 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568] shrink-0" />
                      <span className="font-serif text-3xl lg:text-4xl text-[#C5A568] font-normal leading-none">04</span>
                    </div>
                    <h3 className="font-semibold text-sm lg:text-[15px] text-[#262722] tracking-wide mb-2">
                      Akad &amp; Serah Terima
                    </h3>
                    <p className="text-xs lg:text-[13px] text-[#77766F] leading-relaxed">
                      Penandatanganan akta di hadapan Notaris resmi perseroan dan serah terima kunci unit rumah kepada konsumen.
                    </p>
                  </div>
                  <div className="pt-3 mt-5 border-t border-[#DDD8CE]/70 text-[11px] text-[#77766F] font-medium tracking-wide">
                    Sertifikat Hak Milik (SHM)
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Connected Vertical Sequence (Mobile < md) */}
            <div className="md:hidden relative pl-6 border-l border-[#DDD8CE] ml-2 space-y-8" role="list">
              {/* Mobile Stage 01 */}
              <div className="relative" role="listitem">
                <span 
                  className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568]" 
                  aria-hidden="true" 
                />
                <span className="font-serif text-2xl text-[#C5A568] block mb-1 font-normal">01</span>
                <h3 className="font-semibold text-sm text-[#262722] tracking-wide mb-1.5">
                  Pilih Unit &amp; Konsultasi
                </h3>
                <p className="text-xs text-[#77766F] leading-relaxed mb-2">
                  Kunjungi kantor pemasaran atau lokasi proyek untuk memilih nomor kavling yang tersedia dan melakukan konsultasi syarat KPR.
                </p>
                <span className="text-[11px] text-[#77766F] font-medium">Survei kavling langsung</span>
              </div>

              {/* Mobile Stage 02 */}
              <div className="relative" role="listitem">
                <span 
                  className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568]" 
                  aria-hidden="true" 
                />
                <span className="font-serif text-2xl text-[#C5A568] block mb-1 font-normal">02</span>
                <h3 className="font-semibold text-sm text-[#262722] tracking-wide mb-1.5">
                  Pemberkasan Dokumen
                </h3>
                <p className="text-xs text-[#77766F] leading-relaxed mb-2">
                  Menyiapkan berkas identitas (KTP, KK, NPWP, Slip Gaji atau Keterangan Usaha) untuk verifikasi kelayakan subsidi FLPP.
                </p>
                <span className="text-[11px] text-[#77766F] font-medium">Didampingi tim admin</span>
              </div>

              {/* Mobile Stage 03 */}
              <div className="relative" role="listitem">
                <span 
                  className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568]" 
                  aria-hidden="true" 
                />
                <span className="font-serif text-2xl text-[#C5A568] block mb-1 font-normal">03</span>
                <h3 className="font-semibold text-sm text-[#262722] tracking-wide mb-1.5">
                  Wawancara &amp; Analisis Bank
                </h3>
                <p className="text-xs text-[#77766F] leading-relaxed mb-2">
                  Proses persetujuan pembiayaan oleh perbankan mitra penyalur KPR bersubsidi dengan suku bunga 5% flat pemerintah.
                </p>
                <span className="text-[11px] text-[#77766F] font-medium">Kepastian plafon kredit</span>
              </div>

              {/* Mobile Stage 04 */}
              <div className="relative" role="listitem">
                <span 
                  className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#F3EFE6] border-2 border-[#C5A568]" 
                  aria-hidden="true" 
                />
                <span className="font-serif text-2xl text-[#C5A568] block mb-1 font-normal">04</span>
                <h3 className="font-semibold text-sm text-[#262722] tracking-wide mb-1.5">
                  Akad &amp; Serah Terima
                </h3>
                <p className="text-xs text-[#77766F] leading-relaxed mb-2">
                  Penandatanganan akta di hadapan Notaris resmi perseroan dan serah terima kunci unit rumah kepada konsumen.
                </p>
                <span className="text-[11px] text-[#77766F] font-medium">Sertifikat Hak Milik (SHM)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: INTERACTIVE KPR SIMULATOR (Dramatic Contrast Rhythm) */}
        {/* Background: Charcoal #262722 */}
        {/* ========================================================= */}
        <section id="simulasi-kpr" className="py-20 sm:py-28 bg-[#262722] text-[#F3EFE6] border-b border-[#DDD8CE]/15">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Context & Overview */}
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs uppercase tracking-[0.14em] text-[#C5A568] font-semibold block">
                  Kalkulator Finansial
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#F3EFE6] leading-tight">
                  Simulasi Angsuran KPR Bersubsidi
                </h2>
                <p className="text-[15px] text-[#F3EFE6]/75 leading-relaxed">
                  Hitung perkiraan angsuran bulanan rumah subsidi Puri Gunung Langgar melalui skema FLPP (Fasilitas Likuiditas Pembiayaan Perumahan) dengan suku bunga tetap 5% p.a.
                </p>

                <div className="pt-4 space-y-3 text-xs text-[#F3EFE6]/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A568]" />
                    <span>Suku Bunga Tetap (Flat) 5% sampai lunas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A568]" />
                    <span>Bebas PPN dan premi asuransi bersubsidi</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A568]" />
                    <span>Pilihan jangka waktu fleksibel hingga 20 tahun</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculator Box */}
              <div className="lg:col-span-7 bg-[#1E201A] p-6 sm:p-9 rounded-[4px] border border-white/10 shadow-xl space-y-6">
                {/* Sliders */}
                <div className="space-y-5">
                  {/* Harga Unit */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-[#F3EFE6]/80 mb-2">
                      <span className="uppercase tracking-wider">Harga Rumah</span>
                      <span className="font-mono text-sm font-semibold text-[#C5A568]">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprHarga)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={140000000}
                      max={200000000}
                      step={1000000}
                      value={kprHarga}
                      onChange={(e) => setKprHarga(Number(e.target.value))}
                      className="w-full accent-[#C5A568] cursor-pointer h-1.5 bg-white/10 rounded-none"
                    />
                  </div>

                  {/* Uang Muka DP */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-[#F3EFE6]/80 mb-2">
                      <span className="uppercase tracking-wider">Uang Muka (DP)</span>
                      <span className="font-mono text-sm font-semibold text-emerald-400">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprDp)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={20000000}
                      step={500000}
                      value={kprDp}
                      onChange={(e) => setKprDp(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-none"
                    />
                  </div>

                  {/* Tenor */}
                  <div>
                    <div className="text-xs text-[#F3EFE6]/80 uppercase tracking-wider mb-2">
                      Jangka Waktu Pinjaman
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[10, 15, 20].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setKprTenor(yr)}
                          className={`py-2 px-3 rounded-[10px] text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 ${
                            kprTenor === yr
                              ? 'bg-[#C5A568] text-[#262722] shadow-sm'
                              : 'bg-white/[0.05] hover:bg-white/[0.1] text-[#F3EFE6]/75'
                          }`}
                        >
                          {yr} Tahun
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Output Highlight */}
                <div className="p-5 bg-black/30 rounded-[6px] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#77766F] block">
                      Estimasi Angsuran Flat per Bulan
                    </span>
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[#C5A568] tracking-tight mt-0.5">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprAngsuran)}
                      <span className="text-xs text-[#F3EFE6]/60 font-sans font-normal"> / bulan</span>
                    </div>
                  </div>
                  <div className="text-xs text-[#F3EFE6]/70 text-right">
                    <div>Perkiraan harian: <strong className="text-white font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPerHari)}/hari</strong></div>
                    <div className="text-[11px] text-[#77766F] mt-0.5">Sisa pokok KPR: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPokok)}</div>
                  </div>
                </div>

                {/* Consultation Button */}
                <a
                  href={`${waUrl}?text=${encodeURIComponent(
                    `Halo PT. TBK, saya tertarik dengan simulasi KPR Puri Gunung Langgar: Harga Unit Rp ${kprHarga.toLocaleString('id-ID')}, DP Rp ${kprDp.toLocaleString('id-ID')}, Tenor ${kprTenor} Tahun (Angsuran sekitar Rp ${kprAngsuran.toLocaleString('id-ID')}/bln). Mohon info ketersediaan unit dan persyaratan berkasnya.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full h-[46px] rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.99] shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi Simulasi Ini via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: KEGIATAN LAPANGAN (Dokumentasi Riil) */}
        {/* Background: White #FFFFFF */}
        {/* ========================================================= */}
        <section id="kegiatan" className="py-20 sm:py-28 bg-white border-b border-[#DDD8CE]">
          <div className="container-editorial">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
              <div className="max-w-2xl">
                <span className="text-xs uppercase tracking-[0.14em] text-[#C5A568] font-semibold block mb-2">
                  Dokumentasi Riil
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#262722] leading-tight">
                  Progres Pekerjaan Lapangan
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#77766F] mt-3 leading-relaxed">
                  Aktivitas fisik konstruksi kawasan perumahan Puri Gunung Langgar yang terpantau secara berkala.
                </p>
              </div>

              <Link
                href="/kegiatan"
                prefetch={false}
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#262722] hover:text-[#C5A568] transition-colors self-start sm:self-end"
              >
                <span>Lihat Seluruh Dokumentasi</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Photographic Grid (4 Items) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(content.activities?.items?.slice(0, 4) || [
                {
                  title: 'Perataan Tanah & Akses Jalan',
                  description: 'Pekerjaan cut and fill perataan kontur lahan dan pembukaan akses jalan utama perumahan.',
                  image: '/assets/service-construction.jpg',
                  tag: 'Tahap 1',
                },
                {
                  title: 'Pengukuran & Pematokan',
                  description: 'Pengukuran presisi batas tanah dan pematokan kavling unit hunian.',
                  image: '/assets/service-residential.jpg',
                  tag: 'Tahap 2',
                },
                {
                  title: 'Pondasi & Struktur Bangunan',
                  description: 'Pekerjaan konstruksi pondasi batu belah dan penegakan struktur dinding bata.',
                  image: '/assets/service-interior.jpg',
                  tag: 'Tahap 3',
                },
                {
                  title: 'Infrastruktur Lingkungan',
                  description: 'Pembangunan saluran drainase dan pengerasan jalan lingkungan kawasan.',
                  image: '/assets/project-coastal.jpg',
                  tag: 'Tahap 4',
                },
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col justify-between space-y-3"
                >
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-[#262722] cursor-pointer border border-[#DDD8CE]/60 shadow-sm"
                    onClick={() =>
                      setLightbox({
                        open: true,
                        image: item.image,
                        caption: `${item.title}: ${item.description}`,
                      })
                    }
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#262722]/85 text-[#F3EFE6] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[3px] backdrop-blur-sm">
                      {item.tag || `Tahap ${idx + 1}`}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="font-semibold text-sm text-[#262722] leading-snug group-hover:text-[#C5A568] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#77766F] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: LEGALITAS & TRANSPARANSI */}
        {/* Background: Warm Ivory #F3EFE6 */}
        {/* ========================================================= */}
        <section id="legalitas" className="py-20 sm:py-28 bg-[#F3EFE6] border-b border-[#DDD8CE]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs uppercase tracking-[0.14em] text-[#C5A568] font-semibold block">
                  Kepastian Hukum
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#262722] leading-tight">
                  Legalitas Resmi Perseroan
                </h2>
                <p className="text-[15px] text-[#77766F] leading-relaxed">
                  Setiap unit hunian dan pengembangan kawasan PT. Terbang Bersama Kawan berlandaskan kekuatan hukum resmi Republik Indonesia.
                </p>

                <div className="pt-2">
                  <Link
                    href="/legalitas"
                    prefetch={false}
                    className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#262722] hover:text-[#C5A568] transition-colors"
                  >
                    <span>Pelajari Dokumen Legalitas Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Legal Certificate Fact Sheet (Open Editorial Specification Table) */}
              <div className="lg:col-span-7 pt-1">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#DDD8CE]">
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className="w-5 h-5 text-[#C5A568] shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm text-[#262722]">PT. Terbang Bersama Kawan (PT. TBK)</h3>
                      <span className="text-[11px] text-[#77766F]">Terdaftar resmi di Kemenkumham RI</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#C5A568] uppercase tracking-wider font-mono">
                    AHU Terverifikasi
                  </span>
                </div>

                <dl className="divide-y divide-[#DDD8CE]/70 text-xs sm:text-[13px]">
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="text-[#77766F] font-medium sm:w-1/3">Akta Notaris</dt>
                    <dd className="font-medium text-[#262722] sm:w-2/3 sm:text-right">
                      <span className="font-mono font-semibold text-[#262722]">{content.legal?.aktaNumber || 'No. 10'}</span>
                      <span className="text-[#77766F] block text-[11px] mt-0.5">Tanggal {content.legal?.aktaDate || '18 Maret 2021'} &bull; Notaris: {content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.'}</span>
                    </dd>
                  </div>

                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="text-[#77766F] font-medium sm:w-1/3">SK Pengesahan Menkumham</dt>
                    <dd className="font-medium text-[#262722] sm:w-2/3 sm:text-right">
                      <span className="font-mono font-semibold text-[#262722] break-all">{content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}</span>
                      <span className="text-[#77766F] block text-[11px] mt-0.5">Tanggal SK: {content.legal?.skDate || '19 Maret 2021'}</span>
                    </dd>
                  </div>

                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="text-[#77766F] font-medium sm:w-1/3">Status Hak Lahan</dt>
                    <dd className="font-medium text-[#262722] sm:w-2/3 sm:text-right">
                      <span className="font-semibold text-[#262722]">Sertifikat Hak Milik (SHM)</span>
                      <span className="text-[#77766F] block text-[11px] mt-0.5">Hak kepemilikan mutlak dan sah atas nama pembeli</span>
                    </dd>
                  </div>

                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="text-[#77766F] font-medium sm:w-1/3">Kewenangan Perseroan</dt>
                    <dd className="font-medium text-[#262722] sm:w-2/3 sm:text-right">
                      <span>Pengembang Resmi Perumahan</span>
                      <span className="text-[#77766F] block text-[11px] mt-0.5">Wilayah operasional Kota Bandar Lampung &amp; Lampung Selatan</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 8: KONTAK & KONSULTASI RESMI */}
        {/* Background: White #FFFFFF */}
        {/* ========================================================= */}
        <section id="kontak" className="py-20 sm:py-28 bg-white">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <span className="text-xs uppercase tracking-[0.14em] text-[#C5A568] font-semibold block mb-2">
                Hubungi Kami
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#262722] leading-tight">
                Konsultasi & Layanan Informasi
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#77766F] mt-3 leading-relaxed">
                Tim pemasaran resmi PT. Terbang Bersama Kawan siap memberikan informasi ketersediaan unit, tahapan berkas, dan pendampingan survei lokasi.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Coordinates (Open Editorial Vertical List) */}
              <div className="lg:col-span-5 space-y-8">
                <div className="divide-y divide-[#DDD8CE]">
                  <div className="py-4 first:pt-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block mb-1">
                      Alamat Kantor Pemasaran
                    </span>
                    <p className="text-xs sm:text-[13px] text-[#262722] font-medium leading-relaxed">
                      {content.contact?.address || 'Bandar Lampung, Provinsi Lampung, Indonesia'}
                    </p>
                  </div>

                  <div className="py-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block mb-1">
                      Layanan WhatsApp Resmi
                    </span>
                    <p className="font-mono text-sm sm:text-base font-semibold text-[#262722]">
                      {content.contact?.whatsapp || '0812-7890-1234'}
                    </p>
                    <span className="text-[11px] text-[#77766F] block mt-0.5">Layanan respon cepat konsultasi calon konsumen</span>
                  </div>

                  <div className="py-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block mb-1">
                      Jam Pelayanan Kantor
                    </span>
                    <p className="text-xs sm:text-[13px] text-[#262722] font-medium">
                      {content.contact?.operatingHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}
                    </p>
                    <span className="text-[11px] text-[#77766F] block mt-0.5">Survei hari Minggu dengan konfirmasi awal</span>
                  </div>
                </div>

                {/* Refined Tasteful WhatsApp Action */}
                <div>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-[12px] border border-emerald-700/30 hover:border-emerald-700 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span>Konsultasi WhatsApp Langsung</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-emerald-700" />
                  </a>
                </div>
              </div>

              {/* Right Column: Inquiry Form (Direct on Page Background, No Enclosing Outer Card) */}
              <div className="lg:col-span-7">
                <div className="mb-6">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#262722] mb-1.5">
                    Formulir Konsultasi Proyek
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#77766F]">
                    Silakan isi data diri Anda. Tim representatif kami akan memberikan informasi ketersediaan kavling dan pendampingan berkas KPR.
                  </p>
                </div>

                {formSuccess && (
                  <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[8px] flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pesan berhasil dikirim. WhatsApp Anda akan terhubung langsung dengan tim representatif kami.</span>
                  </div>
                )}

                {formError && (
                  <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-[8px]">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="form-name" className="block font-semibold text-[#262722] uppercase tracking-wider mb-1.5 text-[11px]">
                      Nama Lengkap *
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full h-[44px] px-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-phone" className="block font-semibold text-[#262722] uppercase tracking-wider mb-1.5 text-[11px]">
                        Nomor WhatsApp *
                      </label>
                      <input
                        id="form-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 08123456789"
                        className="w-full h-[44px] px-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="form-email" className="block font-semibold text-[#262722] uppercase tracking-wider mb-1.5 text-[11px]">
                        Alamat Email (Opsional)
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@contoh.com"
                        className="w-full h-[44px] px-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="form-message" className="block font-semibold text-[#262722] uppercase tracking-wider mb-1.5 text-[11px]">
                      Pesan atau Pertanyaan
                    </label>
                    <textarea
                      id="form-message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pertanyaan seputar kavling atau simulasi angsuran..."
                      className="w-full p-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="group w-full h-[46px] rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] font-semibold tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.99] shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#262722]"
                  >
                    <span>{formSubmitting ? 'Memproses...' : 'Kirim Pesan Konsultasi'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-[#262722]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightbox({ open: false, image: '', caption: '' })}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox({ open: false, image: '', caption: '' })}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors p-1"
              aria-label="Tutup foto"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightbox.image}
              alt={lightbox.caption}
              className="max-h-[75vh] w-auto object-contain rounded-[3px] border border-white/20"
            />
            {lightbox.caption && (
              <p className="mt-3 text-xs sm:text-sm text-[#F3EFE6]/90 text-center max-w-xl">
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer content={content} />

      {/* WhatsApp Consultation Action */}
      <FloatingWhatsApp content={content} />
    </div>
  );
}
