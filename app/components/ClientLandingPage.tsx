'use client';

import React, { useState, useEffect } from 'react';
import { SiteContent, getYouTubeEmbedUrl } from '@/lib/initialData';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  FileCheck2,
  HardHat,
  ArrowRight,
  Check,
  Building2,
  Award,
  ExternalLink,
  ArrowUp,
  Sparkles,
  Maximize2,
  Calculator,
  Video,
  Image as ImageIcon,
  Play,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';

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

  // Hero Background Slideshow & Main Background Image:
  // Use hero.backgroundImage as the primary background if set, plus any additional slideshow slides.
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
    return validSlides;
  })();

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mobile Touch Swipe Handling for Hero Slideshow
  const [heroTouchStart, setHeroTouchStart] = useState<number | null>(null);
  const [heroTouchEnd, setHeroTouchEnd] = useState<number | null>(null);

  const onHeroTouchStart = (e: React.TouchEvent) => {
    setHeroTouchEnd(null);
    setHeroTouchStart(e.targetTouches[0].clientX);
  };
  const onHeroTouchMove = (e: React.TouchEvent) => {
    setHeroTouchEnd(e.targetTouches[0].clientX);
  };
  const onHeroTouchEnd = () => {
    if (heroTouchStart === null || heroTouchEnd === null) return;
    const distance = heroTouchStart - heroTouchEnd;
    if (distance > 45) {
      setCurrentBgIndex((prev) => (prev + 1) % activeBgSlides.length);
    } else if (distance < -45) {
      setCurrentBgIndex((prev) => (prev - 1 + activeBgSlides.length) % activeBgSlides.length);
    }
  };

  // Lightbox modal for viewing high-res project / activity photos
  const [lightbox, setLightbox] = useState<{ open: boolean; image: string; caption: string }>({
    open: false,
    image: '',
    caption: '',
  });

  // Video modal for YouTube activities documentation playback
  const [videoModal, setVideoModal] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: '',
    title: '',
  });

  // Project Media State (Foto Slideshow vs Video YouTube)
  // Project Media State: Use ONLY user slides.
  const rawProjectSlides = Array.isArray(content.project?.slides) ? content.project.slides : [];
  const projectSlides = rawProjectSlides.filter((s) => s && s.image && s.image.trim() !== '');

  const ytEmbedUrl = getYouTubeEmbedUrl(content.project?.videoUrl);
  const [projectMediaTab, setProjectMediaTab] = useState<'photo' | 'video'>(
    content.project?.mediaType === 'video' && ytEmbedUrl ? 'video' : 'photo'
  );
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [isProjectPaused, setIsProjectPaused] = useState(false);

  // Mobile Touch Swipe Handling for Project Slideshow
  const [projectTouchStart, setProjectTouchStart] = useState<number | null>(null);
  const [projectTouchEnd, setProjectTouchEnd] = useState<number | null>(null);

  const onProjectTouchStart = (e: React.TouchEvent) => {
    setProjectTouchEnd(null);
    setProjectTouchStart(e.targetTouches[0].clientX);
  };
  const onProjectTouchMove = (e: React.TouchEvent) => {
    setProjectTouchEnd(e.targetTouches[0].clientX);
  };
  const onProjectTouchEnd = () => {
    if (projectTouchStart === null || projectTouchEnd === null) return;
    const distance = projectTouchStart - projectTouchEnd;
    if (distance > 45) {
      setCurrentProjectSlide((prev) => (prev + 1) % projectSlides.length);
    } else if (distance < -45) {
      setCurrentProjectSlide((prev) => (prev - 1 + projectSlides.length) % projectSlides.length);
    }
  };

  // Auto-slide effect for Project Showcase (every 5 seconds)
  useEffect(() => {
    if (projectSlides.length <= 1 || isProjectPaused || projectMediaTab === 'video') return;
    const interval = setInterval(() => {
      setCurrentProjectSlide((prev) => (prev + 1) % projectSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [projectSlides.length, isProjectPaused, projectMediaTab]);

  // Tab for Right Side of Project Section: 'specs' (Spesifikasi Unit) or 'kpr' (Kalkulator Simulasi KPR)
  const [projectRightTab, setProjectRightTab] = useState<'specs' | 'kpr'>('specs');

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

  // Scroll Reveal Observer: observe all .reveal-item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-item');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-slide effect every 4.5 seconds with pause on hover
  useEffect(() => {
    if (activeBgSlides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % activeBgSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBgSlides.length, isPaused]);

  // Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedWaUrl, setSubmittedWaUrl] = useState('');

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

Berikut data diri saya:
• Nama Lengkap: ${formData.name.trim()}
• Nomor WhatsApp / HP: ${formData.phone.trim()}${formData.email.trim() ? `\n• Alamat Email: ${formData.email.trim()}` : ''}${formData.message.trim() ? `\n• Pesan / Keterangan: ${formData.message.trim()}` : ''}

Mohon informasi ketersediaan unit, simulasi KPR FLPP, serta jadwal survei lokasi perumahan. Terima kasih.`;

    const directWaUrl = `https://wa.me/${formattedWaNumber}?text=${encodeURIComponent(waText)}`;
    setSubmittedWaUrl(directWaUrl);

    // Kirim data ke database API di background agar tercatat di panel admin
    try {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => {});
    } catch {}

    // Buka WhatsApp langsung di tab baru
    window.open(directWaUrl, '_blank');

    setFormSuccess(true);
    setFormSubmitting(false);
  };

  const whatsappNumber = sanitize(content.contact?.whatsapp, '0812-7890-1234').replace(/[^0-9]/g, '');
  const waUrl = whatsappNumber.startsWith('0') 
    ? `https://wa.me/62${whatsappNumber.slice(1)}`
    : `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-600 selection:text-white">
      {/* Navbar Header (Fixed atas hero, transparan to dark frosted blur) */}
      <Header content={content} />

      {/* HERO SECTION - Full-Screen Architectural with Dark Contrast Overlay */}
      <section
        id="beranda"
        className="relative w-full min-h-screen min-h-[100dvh] flex flex-col justify-end bg-[#14161A] overflow-hidden group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onHeroTouchStart}
        onTouchMove={onHeroTouchMove}
        onTouchEnd={onHeroTouchEnd}
        aria-label="Beranda PT. Terbang Bersama Kawan"
      >
        {/* Background Slideshow (or dark architectural backdrop when empty) */}
        {activeBgSlides.length > 0 ? (
          <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            {activeBgSlides.map((slide, idx) => {
              const isActive = idx === currentBgIndex;
              const isPrev = (idx === currentBgIndex - 1) || (currentBgIndex === 0 && idx === activeBgSlides.length - 1);
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform ${
                    isActive
                      ? 'opacity-100 translate-x-0 scale-100 z-10'
                      : isPrev
                      ? 'opacity-0 -translate-x-12 scale-105 z-0 pointer-events-none'
                      : 'opacity-0 translate-x-12 scale-105 z-0 pointer-events-none'
                  }`}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#121418] via-[#0E1014] to-[#08090C]" aria-hidden="true">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C9A96A_1px,transparent_1px)] [background-size:28px_28px]" />
          </div>
        )}

        {/* Contrast Overlay: linear-gradient(rgba(10,12,16,0.52), rgba(10,12,16,0.80)) */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,12,16,0.52) 0%, rgba(10,12,16,0.82) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Previous / Next Slide Arrows (Desktop only - Mobile uses touch swipe) */}
        {activeBgSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentBgIndex((prev) => (prev - 1 + activeBgSlides.length) % activeBgSlides.length)}
              className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-[#C9A96A] text-white hover:text-[#0E1014] border border-white/20 items-center justify-center transition-all duration-200 backdrop-blur-md opacity-75 hover:opacity-100 focus:opacity-100 focus:outline-none"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentBgIndex((prev) => (prev + 1) % activeBgSlides.length)}
              className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-[#C9A96A] text-white hover:text-[#0E1014] border border-white/20 items-center justify-center transition-all duration-200 backdrop-blur-md opacity-75 hover:opacity-100 focus:opacity-100 focus:outline-none"
              aria-label="Slide berikutnya"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators (Kanan Bawah Hero, Responsive all device) */}
        {activeBgSlides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 right-5 sm:right-6 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/15 shadow-lg">
            {activeBgSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentBgIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === currentBgIndex
                    ? 'w-5 sm:w-6 h-1.5 bg-[#C9A96A]'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Lihat slide ke-${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Animated Slide Progress Bar along bottom */}
        {activeBgSlides.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20 overflow-hidden" aria-hidden="true">
            <div
              key={currentBgIndex}
              className="h-full bg-gradient-to-r from-[#C9A96A] via-amber-400 to-[#C9A96A]"
              style={{
                animation: isPaused ? 'none' : 'slideTimerBar 4.5s linear forwards',
              }}
            />
          </div>
        )}

        {/* Hero Content placed at bottom-left */}
        <div className="relative z-10 w-full max-w-[1120px] mx-auto px-5 sm:px-6 min-[900px]:px-8 pb-9 sm:pb-12 min-[900px]:pb-[68px] pt-10 sm:pt-20">
          <div className="max-w-[620px] text-left animate-fade-in">
            {/* Live Project Status Badge */}
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-full border border-white/15 text-[11px] sm:text-xs text-[#F4EFE6] shadow-md mb-2.5 sm:mb-4">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-bold text-emerald-400 uppercase tracking-wide">{content.hero?.activeBadgeLabel || 'PROYEK AKTIF'}</span>
              <span className="text-white/40">&bull;</span>
              <span className="text-[#F4EFE6]/90 truncate">{content.hero?.activeBadgeProject || 'Puri Gunung Langgar'}</span>
            </div>

            {/* Judul: Font serif elegan Playfair Display, clamp responsif all device */}
            <h1 className="font-serif font-semibold text-[26px] sm:text-[38px] min-[900px]:text-[52px] leading-[1.18] sm:leading-[1.15] tracking-[-0.01em] max-w-[18ch] text-left [text-wrap:balance]">
              <span className="block text-[#F4EFE6]">{content.hero?.headlineTop || content.hero?.heading || 'Hunian bersubsidi yang layak,'}</span>
              <span className="block text-[#C9A96A]">{content.hero?.headlineBottom || 'dibangun dari Lampung.'}</span>
            </h1>

            {/* Paragraf: font sans (Plus Jakarta Sans) responsif */}
            <p className="font-sans text-[13px] sm:text-[15px] min-[900px]:text-[16px] leading-[1.55] sm:leading-[1.6] text-[#F4EFE6]/85 max-w-[54ch] mt-2.5 sm:mt-4 mb-4 sm:mb-7">
              {content.hero?.bodyText || content.hero?.subheading || 'PT. Terbang Bersama Kawan adalah pengembang perumahan di Bandar Lampung. Saat ini kami sedang membangun Puri Gunung Langgar di Lampung Selatan.'}
            </p>

            {/* Dua Tombol: Side-by-side rapi di mobile & desktop tanpa terpotong */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3.5">
              {/* Tombol 1: Ke Halaman Proyek */}
              <Link
                href="/proyek"
                prefetch={false}
                className="flex-1 sm:flex-initial h-[44px] sm:h-[46px] px-4 sm:px-6 rounded-xl border border-[#C9A96A] bg-[#C9A96A] text-[#0E1014] hover:bg-amber-400 text-[12.5px] sm:text-[14px] font-bold flex items-center justify-center text-center shadow-lg shadow-amber-900/20 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C9A96A]"
              >
                Lihat Proyek
              </Link>

              {/* Tombol 2: Ke Halaman Kontak */}
              <Link
                href="/kontak"
                prefetch={false}
                className="flex-1 sm:flex-initial h-[44px] sm:h-[46px] px-4 sm:px-6 rounded-xl border border-white/30 bg-black/40 backdrop-blur-md hover:border-white text-white text-[12.5px] sm:text-[14px] font-semibold flex items-center justify-center text-center transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C9A96A]"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CREDENTIALS & STATS BAR (Grid 2x2 di mobile agar rapi & ringkas) */}
      <div className="bg-white border-b border-slate-200 py-4 sm:py-8 shadow-sm">
        <div className="container-std">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-4">
            <Link href="/kontak" prefetch={false} className="p-3 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 flex items-center gap-2.5 sm:gap-3.5 transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs uppercase font-semibold text-slate-500 tracking-wider truncate">Domisili Kantor</div>
                <div className="text-[13px] sm:text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">Bandar Lampung</div>
              </div>
            </Link>

            <Link href="/legalitas" prefetch={false} className="p-3 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 flex items-center gap-2.5 sm:gap-3.5 transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs uppercase font-semibold text-slate-500 tracking-wider truncate">Legalitas Sah</div>
                <div className="text-[13px] sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">SK Tahun 2021</div>
              </div>
            </Link>

            <Link href="/proyek" prefetch={false} className="p-3 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 flex items-center gap-2.5 sm:gap-3.5 transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs uppercase font-semibold text-slate-500 tracking-wider truncate">Proyek Unggulan</div>
                <div className="text-[13px] sm:text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">Puri Gg. Langgar</div>
              </div>
            </Link>

            <Link href="/tentang" prefetch={false} className="p-3 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 flex items-center gap-2.5 sm:gap-3.5 transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs uppercase font-semibold text-slate-500 tracking-wider truncate">Kategori Unit</div>
                <div className="text-[13px] sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">Rumah Subsidi</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION: TENTANG KAMI */}
      <section id="tentang" className="py-20 sm:py-24 bg-white overflow-hidden">
        <div className="container-std">
          <div className="max-w-3xl mb-14 reveal-item">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
              {content.about.badge || 'TENTANG PERUSAHAAN'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              {content.about.title || 'Membangun dengan Komitmen & Legalitas Nyata'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {content.about.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Narrative & Key Commitments */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between reveal-item reveal-delay-1">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-900">
                  {content.about?.commitmentTitle || 'Komitmen Utama Perseroan'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {content.about?.commitmentBody || 'Sebagai pengembang properti resmi di Provinsi Lampung, PT. Terbang Bersama Kawan mengutamakan kepastian hukum, keterbukaan informasi, dan mutu konstruksi terbaik agar masyarakat berpenghasilan rendah hingga menengah dapat memiliki rumah impian dengan rasa tenang.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {(content.about?.commitmentPoints || [
                    { title: 'Legalitas 100% Sah', subtitle: 'Terdaftar Kemenkumham & Notaris resmi' },
                    { title: 'Kualitas Konstruksi', subtitle: 'Standar mutu teknis perumahan layak' },
                    { title: 'Akses Strategis', subtitle: 'Dekat fasilitas umum & transportasi' },
                    { title: 'Kemitraan Perbankan', subtitle: 'Kemudahan fasilitas KPR bersubsidi' },
                  ]).map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{point.title}</div>
                        <div className="text-xs text-slate-500">{point.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4 hover:border-amber-400 hover:shadow-md transition-all">
                <div>
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                    Visi Perseroan
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-amber-950 italic">
                    &ldquo;{content.about.visionText || 'Menjadi perusahaan properti yang berkualitas dan terpercaya.'}&rdquo;
                  </div>
                </div>
                <Building2 className="w-8 h-8 text-amber-600 shrink-0" />
              </div>
            </div>

            {/* Right Misi Card */}
            <div className="lg:col-span-5 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between reveal-item reveal-delay-2 hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-5">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {content.about.missionTitle || 'Misi Perusahaan'}
                </h3>
                <ul className="space-y-4">
                  {content.about.missions?.map((misi, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-slate-700 text-sm sm:text-[14.5px] leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        {i + 1}
                      </span>
                      <span>{misi}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <span>Pilar orientasi dalam setiap perwujudan hunian bagi keluarga Indonesia.</span>
                <Link
                  href="/tentang"
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 font-bold text-amber-800 hover:text-amber-900 group shrink-0"
                >
                  <span>Profil Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PROYEK RESMI PURI GUNUNG LANGGAR */}
      <section id="proyek" className="py-20 sm:py-24 bg-slate-100 border-t border-b border-slate-200 overflow-hidden">
        <div className="container-std">
          <div className="max-w-3xl mb-14 reveal-item">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
              {content.project.badge || 'PROYEK RESMI PERSEROAN'}
            </span>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                {content.project.name || 'Puri Gunung Langgar'}
              </h2>
              <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold">
                {content.project.type || 'Perumahan Subsidi'}
              </span>
            </div>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {content.project.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visual Showcase Card: Dynamic Video Embed OR Automated Slideshow */}
            <div
              className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-300 shadow-md relative min-h-[380px] sm:min-h-[460px] bg-slate-900 flex flex-col justify-between group"
              onMouseEnter={() => setIsProjectPaused(true)}
              onMouseLeave={() => setIsProjectPaused(false)}
            >
              {/* Media Switcher Tab (If YouTube video is set, lets visitor switch between Video & Photos) */}
              {ytEmbedUrl && (
                <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/15 text-xs shadow-lg">
                  <button
                    type="button"
                    onClick={() => setProjectMediaTab('photo')}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      projectMediaTab === 'photo'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Galeri Foto ({projectSlides.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectMediaTab('video')}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      projectMediaTab === 'video'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Video YouTube</span>
                  </button>
                </div>
              )}

              {/* VIDEO MODE */}
              {projectMediaTab === 'video' && ytEmbedUrl ? (
                <div className="relative w-full h-full min-h-[360px] sm:min-h-[440px] flex flex-col justify-between bg-black">
                  <div className="relative w-full aspect-video sm:aspect-[16/10] h-full overflow-hidden">
                    <iframe
                      src={ytEmbedUrl}
                      title={`Video Resmi ${content.project.name}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  {/* Bottom Video Location Info */}
                  <div className="p-4 sm:p-5 bg-slate-950 border-t border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{content.project.location}, {content.project.district}</span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono uppercase tracking-wider">
                      Dokumentasi Video Resmi
                    </span>
                  </div>
                </div>
              ) : (
                /* PHOTO SLIDESHOW MODE (OTOMATIS SLIDE SHOW) */
                <div
                  className="relative w-full h-full min-h-[360px] sm:min-h-[440px] cursor-pointer flex flex-col justify-end overflow-hidden"
                  onTouchStart={onProjectTouchStart}
                  onTouchMove={onProjectTouchMove}
                  onTouchEnd={onProjectTouchEnd}
                  onClick={() =>
                    setLightbox({
                      open: true,
                      image: projectSlides[currentProjectSlide]?.image || '/assets/project-workspace.jpg',
                      caption: `${content.project.name} - ${projectSlides[currentProjectSlide]?.caption || 'Dokumentasi Proyek'}`,
                    })
                  }
                >
                  {/* Slide Background Images with Smooth Crossfade & Zoom */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
                    {projectSlides.length > 0 ? (
                      projectSlides.map((slide, idx) => {
                        const isActive = idx === currentProjectSlide;
                        return (
                          <div
                            key={idx}
                            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
                              isActive
                                ? 'opacity-100 scale-100 z-10'
                                : 'opacity-0 scale-105 z-0 pointer-events-none'
                            }`}
                            style={{
                              backgroundImage: `url(${slide.image})`,
                            }}
                          />
                        );
                      })
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#16191E] via-[#0E1013] to-black flex items-center justify-center p-6 text-center">
                        <div className="text-white/40 text-xs flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-500/50" />
                          <span>Belum ada foto galeri proyek yang diunggah</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gradient Contrast Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20 z-10" />

                  {/* Top Right: Lightbox Trigger Hint */}
                  <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-lg text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-white/20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Klik untuk Perbesar</span>
                  </div>

                  {/* Left & Right Chevron Controls (Touch & Desktop) */}
                  {projectSlides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProjectSlide((prev) => (prev - 1 + projectSlides.length) % projectSlides.length);
                        }}
                        className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md opacity-85 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Slide foto proyek sebelumnya"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProjectSlide((prev) => (prev + 1) % projectSlides.length);
                        }}
                        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md opacity-85 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Slide foto proyek berikutnya"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Bottom Content Bar: Location & Caption & Slide Dots */}
                  <div className="relative z-20 p-5 sm:p-6 text-white space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500 text-slate-950 text-xs font-bold shadow">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Lokasi Resmi</span>
                      </div>
                      {projectSlides.length > 1 && (
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] font-mono text-amber-300">
                          <span>{currentProjectSlide + 1}</span>
                          <span className="text-white/40">/</span>
                          <span>{projectSlides.length}</span>
                        </div>
                      )}
                    </div>

                    <div className="font-bold text-base sm:text-lg text-white">
                      {content.project.location}, {content.project.district}, {content.project.province}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl line-clamp-2">
                      {projectSlides[currentProjectSlide]?.caption || 'Akses strategis, suasana lingkungan asri, dan pengembangan kawasan terencana.'}
                    </p>

                    {/* Slide Dots */}
                    {projectSlides.length > 1 && (
                      <div className="flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                        {projectSlides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentProjectSlide(idx)}
                            className={`transition-all rounded-full ${
                              idx === currentProjectSlide
                                ? 'w-6 h-1.5 bg-amber-400'
                                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
                            }`}
                            aria-label={`Lihat slide foto proyek ke-${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Animated Progress Timer Bar */}
                  {projectSlides.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15 z-30 overflow-hidden" aria-hidden="true">
                      <div
                        key={currentProjectSlide}
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500"
                        style={{
                          animation: isProjectPaused ? 'none' : 'slideTimerBar 5s linear forwards',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel: Tab Spesifikasi Unit & Kalkulator KPR Interaktif */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                {/* Tab Header: Specs vs KPR Calculator */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => setProjectRightTab('specs')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      projectRightTab === 'specs'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-amber-600" />
                    <span>Spesifikasi Unit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectRightTab('kpr')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      projectRightTab === 'kpr'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="flex items-center gap-1">
                      <span>Simulasi KPR</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </button>
                </div>

                {/* TAB 1: SPESIFIKASI UNIT */}
                {projectRightTab === 'specs' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Home className="w-4 h-4 text-amber-600" />
                        <span>Rincian Teknis Unit Hunian</span>
                      </h3>
                      <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Standar FLPP
                      </span>
                    </div>

                    <div className="space-y-2">
                      {content.project.specs?.map((spec, i) => {
                        const cleanVal = sanitize(spec.value, 'Tersedia');
                        return (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs sm:text-[13px] hover:border-amber-300 transition-colors"
                          >
                            <span className="text-slate-500 font-medium">{spec.label}</span>
                            <span className="font-bold text-slate-900 text-right">{cleanVal}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* TAB 2: KALKULATOR KPR SUBSIDI INTERAKTIF */
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                          <Calculator className="w-4 h-4 text-emerald-600" />
                          <span>Simulasi Angsuran KPR</span>
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Skema Subsidi Pemerintah (Bunga 5% Flat)
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        FLPP 5%
                      </span>
                    </div>

                    {/* Harga & DP Sliders */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>Plafon / Harga Unit</span>
                          <span className="text-amber-700 font-bold font-mono">
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
                          className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>Uang Muka (DP)</span>
                          <span className="text-emerald-700 font-bold font-mono">
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
                          className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                        />
                      </div>

                      {/* Tenor Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Jangka Waktu Pinjaman (Tenor)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[10, 15, 20].map((yr) => (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => setKprTenor(yr)}
                              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                                kprTenor === yr
                                  ? 'bg-slate-900 text-white shadow'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {yr} Tahun
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Result Box */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200 text-center space-y-1">
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Estimasi Angsuran Bulanan
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight text-emerald-700">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprAngsuran)}
                          <span className="text-xs font-semibold text-slate-500"> /bulan</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Hanya sekitar <strong className="text-slate-900 font-bold font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPerHari)}/hari</strong> (Sisa pokok: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPokok)})
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-slate-100 space-y-2">
                {projectRightTab === 'kpr' ? (
                  <>
                    <a
                      href={`${waUrl}?text=${encodeURIComponent(
                        `Halo PT. Terbang Bersama Kawan, saya tertarik dengan perumahan Puri Gunung Langgar.\n\nBerikut hasil simulasi KPR saya:\n- Plafon: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprHarga)}\n- DP: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprDp)}\n- Tenor: ${kprTenor} Tahun\n- Estimasi Angsuran: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprAngsuran)} / bulan\n\nMohon info ketersediaan unit dan persyaratan berkas KPR bersubsidi.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
                    >
                      <span>Konsultasikan Angsuran Ini via WA</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link
                      href="/simulasi-kpr"
                      prefetch={false}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C9A96A] hover:text-[#0E1014] text-white font-bold text-xs transition-colors"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Buka Halaman Simulasi KPR Lengkap</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/proyek"
                      prefetch={false}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
                    >
                      <span>Lihat Rincian & Denah Proyek Lengkap</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/kontak"
                      prefetch={false}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                    >
                      <span>Jadwalkan Kunjungan Lokasi</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: DOKUMENTASI PEKERJAAN LAPANGAN */}
      <section id="kegiatan" className="py-20 sm:py-24 bg-white overflow-hidden">
        <div className="container-std">
          <div className="max-w-3xl mb-14 reveal-item">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
              {content.activities.badge || 'DOKUMENTASI PEKERJAAN'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              {content.activities.title || 'Dokumentasi Pekerjaan Lapangan'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {content.activities.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.activities.items?.map((item, idx) => {
              const delayClass = idx % 3 === 1 ? 'reveal-delay-1' : idx % 3 === 2 ? 'reveal-delay-2' : '';
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between reveal-item ${delayClass} group`}
                >
                  <div>
                    {item.image && item.image.trim() !== '' ? (
                      <div
                        onClick={() =>
                          setLightbox({
                            open: true,
                            image: item.image!,
                            caption: `${item.title} (${item.tag || `Tahap 0${idx + 1}`}) - Puri Gunung Langgar`,
                          })
                        }
                        className="relative h-52 sm:h-56 overflow-hidden bg-slate-100 cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 border border-white/20">
                            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Perbesar Foto</span>
                          </span>
                        </div>
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm text-white text-xs font-semibold">
                          {item.tag || `Tahap 0${idx + 1}`}
                        </div>
                        {item.videoUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoModal({
                                open: true,
                                url: item.videoUrl!,
                                title: `${item.title} (${item.tag || `Tahap 0${idx + 1}`})`,
                              });
                            }}
                            className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-md transition-colors"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Video</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-200 border-b border-slate-200 flex items-center justify-between px-5">
                        <div className="px-3 py-1 rounded-md bg-slate-900 text-amber-400 text-xs font-semibold">
                          {item.tag || `Tahap 0${idx + 1}`}
                        </div>
                        {item.videoUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setVideoModal({
                                open: true,
                                url: item.videoUrl!,
                                title: `${item.title} (${item.tag || `Tahap 0${idx + 1}`})`,
                              })
                            }
                            className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Putar Video</span>
                          </button>
                        ) : (
                          <HardHat className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="font-bold text-lg text-slate-900 mb-2.5 group-hover:text-amber-800 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Sesuai standar teknis tata ruang</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Pengawasan langsung tim teknis perseroan</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 space-y-2">
                    {item.videoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setVideoModal({
                            open: true,
                            url: item.videoUrl!,
                            title: `${item.title} (${item.tag || `Tahap 0${idx + 1}`})`,
                          })
                        }
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-red-700" />
                        <span>Tonton Video Dokumentasi</span>
                      </button>
                    )}
                    <Link
                      href="/kegiatan"
                      prefetch={false}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-[#C9A96A] hover:bg-amber-50 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <span>Lihat Detail Dokumentasi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A96A]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center reveal-item">
            <Link
              href="/kegiatan"
              prefetch={false}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-[#C9A96A] hover:text-[#0E1014] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Lihat Seluruh Dokumentasi Pekerjaan Lapangan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: LEGALITAS RESMI */}
      <section id="legalitas" className="py-20 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="container-std">
          <div className="max-w-3xl mb-14 reveal-item">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">
              {content.legal.badge || 'LEGALITAS & TRANSPARANSI PERUSAHAAN'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
              {content.legal.title || 'Dokumen Resmi Perseroan'}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {content.legal.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Akta Notaris Card */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 reveal-item hover:border-amber-400/40 hover:-translate-y-1.5 transition-all duration-300 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Akta Pendirian Perseroan
              </div>
              <div className="text-xl font-bold text-white">
                Akta No. 10
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tanggal: <strong>{content.legal.aktaDate}</strong><br />
                Notaris: <strong>{content.legal.notary}</strong>
              </p>
            </div>

            {/* SK Menkumham Card */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 reveal-item reveal-delay-1 hover:border-emerald-400/40 hover:-translate-y-1.5 transition-all duration-300 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Pengesahan Kemenkumham RI
              </div>
              <div className="text-base sm:text-lg font-bold text-white break-all">
                {content.legal.skMenkumham}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tanggal Keputusan: <strong>{content.legal.skDate}</strong><br />
                Terdaftar di Administrasi Hukum Umum RI
              </p>
            </div>

            {/* Kewenangan Direksi Card */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 reveal-item reveal-delay-2 hover:border-amber-400/40 hover:-translate-y-1.5 transition-all duration-300 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Kewenangan Direksi
              </div>
              <div className="text-xl font-bold text-white">
                Mewakili Perseroan
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {content.legal.directorAuthority}
              </p>
            </div>
          </div>

          {/* Legal Summary Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 reveal-item">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Seluruh kegiatan perumahan dan transaksi berlandaskan hukum positif Republik Indonesia.</span>
            </div>
            <Link
              href="/legalitas"
              prefetch={false}
              className="inline-flex items-center gap-1.5 font-bold text-[#C9A96A] hover:text-amber-300 transition-colors shrink-0"
            >
              <span>Periksa Legalitas Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: STRUKTUR PENGURUS */}
      <section id="pimpinan" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="container-std">
          <div className="max-w-3xl mb-14 reveal-item">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
              {content.leadership.badge || 'STRUKTUR PENGURUS RESMI'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              {content.leadership.title || 'Dewan Pengurus Perseroan'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {content.leadership.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {content.leadership.members?.map((member, idx) => (
              <div
                key={idx}
                className={`group rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col reveal-item ${idx === 1 ? 'reveal-delay-1' : ''}`}
              >
                {/* Executive Portrait Frame */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
                  {member.image && member.image.trim() !== '' ? (
                    <>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Vignette Gradient Overlay at Bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
                    </>
                  ) : (
                    /* Fallback: Executive Architectural Monogram Podium */
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-[#141822] to-slate-950 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, #C9A96A 1px, transparent 0)`,
                          backgroundSize: '24px 24px',
                        }}
                      />
                      <div className="relative z-10 w-24 h-28 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/15 to-transparent flex flex-col items-center justify-center p-4 shadow-2xl backdrop-blur-sm">
                        <Building2 className="w-7 h-7 text-[#C9A96A] mb-1.5" />
                        <span className="text-2xl font-serif font-black text-[#C9A96A] tracking-wider">
                          {member.name ? member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'TBK'}
                        </span>
                      </div>
                      <span className="relative z-10 mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                        Portret Eksekutif Perseroan
                      </span>
                    </div>
                  )}

                  {/* Floating Role Badge */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-[#C9A96A] text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{member.role}</span>
                  </div>

                  {/* Official SK Status Badge */}
                  <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>SK Sah Kemenkumham</span>
                  </div>

                  {/* Name Banner at bottom of portrait for cinematic look */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-[#C9A96A] font-semibold block mb-0.5">
                      {member.role} PT. TBK
                    </span>
                    <h3 className="font-extrabold text-lg text-white tracking-tight drop-shadow-md">
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        Amanat & Tanggung Jawab
                      </span>
                      <span className="h-px flex-1 bg-amber-200/60" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {member.roleDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96A] shrink-0" />
                      <span className="font-medium text-slate-600">Akta Pendirian Notaris No. 10</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">18 Maret 2021</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center max-w-3xl reveal-item">
            <Link
              href="/pimpinan"
              prefetch={false}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-[#C9A96A] hover:text-[#0E1014] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Lihat Struktur Pengurus & Tata Kelola Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: KONTAK & FORMULIR INQUIRY */}
      <section id="kontak" className="py-20 sm:py-24 bg-white overflow-hidden">
        <div className="container-std">
          <div className="max-w-3xl mb-14 reveal-item">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
              {content.contact.badge || 'HUBUNGI PERSEROAN'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              {content.contact.title || 'Layanan Konsultasi & Pemesanan'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {content.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Contact Information */}
            <div className="lg:col-span-5 p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-6 reveal-item hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                  Kantor & Domisili
                </div>
                <div className="text-lg font-bold text-slate-900 mb-2">
                  {content.contact.city || 'Bandar Lampung'}
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{sanitize(content.contact.address, 'Kawasan Puri Gunung Langgar, Desa Sabah Balau, Kec. Tanjung Bintang, Lampung Selatan')}</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                  Layanan WhatsApp Official
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sanitize(content.contact.whatsapp, '0812-7890-1234')}</span>
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Chat Langsung via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-5 border-t border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                  Surat Elektronik (Email)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{sanitize(content.contact.email, 'info@terbangbersamakawan.co.id')}</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                  Jam Operasional
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{sanitize(content.contact.operatingHours, 'Senin - Sabtu: 08.00 - 17.00 WIB')}</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Form */}
            <div className="lg:col-span-7 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Formulir Minat & Konsultasi Unit
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Silakan isi data diri Anda di bawah ini. Tim representatif kami akan segera menghubungi Anda untuk memberikan penjelasan lengkap dan jadwal survei lokasi.
              </p>

              {formSuccess ? (
                <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                    <MessageCircle className="w-7 h-7 fill-emerald-600 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-900">
                      Mengarahkan ke WhatsApp...
                    </div>
                    <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                      Format pesan konsultasi unit telah otomatis disiapkan sesuai data yang Anda masukkan. WhatsApp tim PT. TBK terbuka di tab baru.
                    </p>
                  </div>

                  {submittedWaUrl && (
                    <div className="pt-2">
                      <a
                        href={submittedWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Buka Chat WhatsApp Sekarang</span>
                      </a>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormSuccess(false);
                        setFormData({ name: '', phone: '', email: '', message: '' });
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
                    >
                      Kirim formulir lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-base sm:text-sm min-h-[46px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Nomor WhatsApp / HP *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 0812xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-base sm:text-sm min-h-[46px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Alamat Email (Opsional)
                      </label>
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-base sm:text-sm min-h-[46px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Pesan / Keterangan Minat
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tuliskan pertanyaan Anda mengenai ketersediaan unit, simulasi angsuran, atau jadwal kunjungan lokasi..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-base sm:text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 min-h-[48px] active:scale-[0.98]"
                  >
                    {formSubmitting ? (
                      <span>Menyiapkan WhatsApp...</span>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 fill-white" />
                        <span>Kirim Langsung ke WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer content={content} />

      {/* Floating Back to Top Button with Circular Progress Meter */}
      <BackToTopButton />

      {/* Lightbox Modal for High-Res Asset Inspection */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setLightbox({ open: false, image: '', caption: '' })}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-[#0E1014] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={lightbox.image}
                alt={lightbox.caption}
                className="max-w-full max-h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setLightbox({ open: false, image: '', caption: '' })}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all"
                aria-label="Tutup foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5 bg-[#14161A] border-t border-white/10 flex items-center justify-between text-white text-xs sm:text-sm">
              <span className="font-medium text-[#F4EFE6]">{lightbox.caption}</span>
              <span className="text-xs text-[#C9A96A] font-semibold shrink-0 ml-4">PT. Terbang Bersama Kawan</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal for Activities Documentation */}
      {videoModal.open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setVideoModal({ open: false, url: '', title: '' })}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoModal({ open: false, url: '', title: '' })}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
              aria-label="Tutup video"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {getYouTubeEmbedUrl(videoModal.url) ? (
                <iframe
                  src={`${getYouTubeEmbedUrl(videoModal.url)}?autoplay=1`}
                  title={videoModal.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoModal.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="p-4 bg-slate-950 text-white text-xs sm:text-sm border-t border-white/10 flex items-center justify-between">
              <span className="font-semibold text-white">{videoModal.title}</span>
              <span className="text-[#C9A96A] font-semibold shrink-0 ml-4">Video Lapangan PT. TBK</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive WhatsApp Pop-Up Widget */}
      <FloatingWhatsApp content={content} />

      {/* Mobile Sticky Quick Action Dock (<640px) */}
      <aside 
        aria-label="Aksi Cepat Mobile"
        className="fixed bottom-0 inset-x-0 z-30 bg-[#0E1014]/98 backdrop-blur-xl border-t border-white/10 px-3.5 py-2.5 flex items-center justify-between sm:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
      >
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-[#C9A96A] uppercase tracking-wider truncate">
              Puri Gunung Langgar
            </span>
          </div>
          <span className="text-[12px] font-semibold text-[#F4EFE6]/90 truncate">
            Cicilan Subsidi ~Rp 1 Jt-an/bln
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setProjectRightTab('kpr');
              const el = document.getElementById('proyek');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="h-[38px] px-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-[#F4EFE6] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>KPR</span>
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[38px] px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Tanya WA</span>
          </a>
        </div>
      </aside>
    </div>
  );
}

function BackToTopButton() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (total > 0) {
            setProgress((window.scrollY / total) * 100);
          }
          setShow(window.scrollY > 320);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-[74px] left-3 sm:bottom-24 sm:right-6 sm:left-auto z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950/90 hover:bg-slate-950 text-[#C9A96A] hover:text-white flex items-center justify-center shadow-xl backdrop-blur-md border border-white/15 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#C9A96A]"
      aria-label="Kembali ke atas halaman"
    >
      <svg className="w-10 h-10 sm:w-11 sm:h-11 -rotate-90 absolute inset-0 pointer-events-none" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2.5"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="#C9A96A"
          strokeWidth="2.5"
          strokeDasharray={113.1}
          strokeDashoffset={113.1 - (113.1 * progress) / 100}
          className="transition-all duration-150"
        />
      </svg>
      <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
