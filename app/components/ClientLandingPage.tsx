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
  Maximize2,
  MessageCircle,
  ShieldCheck,
  Building2,
  Home,
  CheckCircle2,
  TreePine,
  Wallet,
  Leaf,
  Briefcase,
  Users,
  User,
  HardHat
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Header from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import PromoBannerCarousel from './PromoBannerCarousel';
import {
  HeaderHousesIllustration,
  Step1ConsultationIllustration,
  Step2DocumentIllustration,
  Step3BankIllustration,
  Step4HandshakeIllustration,
} from './BuyingProcessIllustrations';
import PromoPopupModal from './PromoPopupModal';
import type { LookbookItem } from './LookbookModal';
import { SiteContent, initialSiteContent } from '@/lib/initialData';

const LookbookModal = dynamic(() => import('./LookbookModal'), { ssr: false });

const featureColorClasses = [
  { bg: 'bg-[#EBF3FC]', text: 'text-[#073B78]', hover: 'group-hover:text-[#073B78]' },
  { bg: 'bg-[#F3EBF9]', text: 'text-[#7C3AED]', hover: 'group-hover:text-[#7C3AED]' },
  { bg: 'bg-[#E6F7F3]', text: 'text-[#059669]', hover: 'group-hover:text-[#059669]' },
  { bg: 'bg-[#FEF5E7]', text: 'text-[#D97706]', hover: 'group-hover:text-[#D97706]' },
];

function getFeatureIcon(iconName?: string) {
  switch ((iconName || '').toLowerCase()) {
    case 'shield':
    case 'harga':
    case 'keamanan':
      return <ShieldCheck className="w-6 h-6 stroke-[2]" />;
    case 'map':
    case 'lokasi':
      return <MapPin className="w-6 h-6 stroke-[2]" />;
    case 'leaf':
    case 'lingkungan':
    case 'asri':
      return <Leaf className="w-6 h-6 stroke-[2]" />;
    case 'building':
      return <Building2 className="w-6 h-6 stroke-[2]" />;
    case 'wallet':
      return <Wallet className="w-6 h-6 stroke-[2]" />;
    case 'tree':
      return <TreePine className="w-6 h-6 stroke-[2]" />;
    case 'home':
    case 'hunian':
    default:
      return <Home className="w-6 h-6 stroke-[2]" />;
  }
}

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

  // Scroll Reveal - Animate elements in when scrolled into viewport
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.reveal-on-scroll, .reveal-left-on-scroll, .reveal-right-on-scroll'
    );
    if (!elements.length) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If element is already in initial screen viewport on load, reveal it immediately
      if (rect.top < window.innerHeight - 30) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [content]);

  // Project Media State
  const rawProjectSlides = Array.isArray(content.project?.slides) ? content.project.slides : [];
  const projectSlides = rawProjectSlides.filter((s) => s && s.image && s.image.trim() !== '');
  const activeProjectSlides = projectSlides.length > 0
    ? projectSlides
    : (content.project?.image && content.project.image.trim() !== ''
        ? [{ image: content.project.image, caption: content.project?.name || 'Puri Gunung Langgar' }]
        : []);

  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  // Auto slideshow for project photos (3.8s interval)
  useEffect(() => {
    if (activeProjectSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [activeProjectSlides.length]);

  // Mobile Touch Swipe for Project Image Gallery
  const [galleryTouchStartX, setGalleryTouchStartX] = useState<number | null>(null);

  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    setGalleryTouchStartX(e.touches[0].clientX);
  };

  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    if (galleryTouchStartX === null) return;
    const touchDiff = galleryTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(touchDiff) > 40) {
      if (touchDiff > 0) {
        setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
      } else {
        setCurrentProjectSlide((prev) => (prev - 1 + activeProjectSlides.length) % activeProjectSlides.length);
      }
    }
    setGalleryTouchStartX(null);
  };

  // Fullscreen Photo Modal
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    currentIndex: number;
    items: LookbookItem[];
  }>({
    open: false,
    currentIndex: 0,
    items: [],
  });

  // Mortgage / KPR Simulator State
  const kprConfig = content.kprSimulation;
  const [kprHarga, setKprHarga] = useState(kprConfig?.defaultPrice || 166000000);
  const [kprDp, setKprDp] = useState(kprConfig?.defaultDp || 2000000);
  const [kprTenor, setKprTenor] = useState(kprConfig?.defaultTenor || 20);

  useEffect(() => {
    if (content.kprSimulation) {
      if (content.kprSimulation.defaultPrice) setKprHarga(content.kprSimulation.defaultPrice);
      if (content.kprSimulation.defaultDp) setKprDp(content.kprSimulation.defaultDp);
      if (content.kprSimulation.defaultTenor) setKprTenor(content.kprSimulation.defaultTenor);
    }
  }, [content.kprSimulation]);

  const kprAnnualRate = content.kprSimulation?.annualInterestRate || 0.05;
  const kprPokok = Math.max(0, kprHarga - kprDp);
  const kprRate = kprAnnualRate / 12; // monthly rate
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

  // Leadership / Dewan Pengurus & Manajemen Data
  const rawLeadershipMembers = Array.isArray(content.leadership?.members)
    ? content.leadership.members
    : (initialSiteContent.leadership?.members || []);

  const primaryLeaders = rawLeadershipMembers.filter(
    (m) => m.role.toLowerCase().includes('komisaris') || m.role.toLowerCase().includes('direktur utama')
  );
  const operationalLeaders = rawLeadershipMembers.filter(
    (m) => !m.role.toLowerCase().includes('komisaris') && !m.role.toLowerCase().includes('direktur utama')
  );
  const displayPrimaryLeaders = primaryLeaders.length > 0 ? primaryLeaders : rawLeadershipMembers.slice(0, 2);
  const displayOperationalLeaders = primaryLeaders.length > 0 ? operationalLeaders : rawLeadershipMembers.slice(2);

  return (
    <div className="min-h-screen bg-white text-[#102D52] font-sans antialiased selection:bg-[#FF9D2E] selection:text-[#102D52]" suppressHydrationWarning>
      {/* 1. Header (ICC-Style Full-Width Navy Header with Logo, Search Modal, and Hamburger) */}
      <Header content={content} />

      <main id="main-content" suppressHydrationWarning>
        {/* ========================================================= */}
        {/* 2. FULL-WIDTH PROMOTIONAL BANNER CAROUSEL (HIGHEST PRIORITY) */}
        {/* Inspired by Indonesian Certification Center (ICC)          */}
        {/* Edge-to-edge, over-the-banner orange arrows, bottom dots   */}
        {/* ========================================================= */}
        <div className="w-full pt-[58px] min-[980px]:pt-[68px]" suppressHydrationWarning>
          <PromoBannerCarousel slides={content.bannerSlides} whatsappUrl={waUrl} />
        </div>

        {/* ========================================================= */}
        {/* STATISTIK & REKAM JEJAK UTAMA PERSEROAN                   */}
        {/* Responsive 4-metric editorial bar on mobile, tablet & desktop */}
        {/* ========================================================= */}
        {(() => {
          const statsList = Array.isArray(content.hero?.stats) && content.hero.stats.length > 0
            ? content.hero.stats
            : [
                { label: "Domisili Perusahaan", value: "Bandar Lampung" },
                { label: "Pengesahan Kemenkumham", value: "2021" },
                { label: "Proyek Utama", value: "Puri Gunung Langgar" },
                { label: "Kategori Pembangunan", value: "Hunian Bersubsidi" },
              ];

          return (
            <section aria-label="Statistik Utama Perseroan" className="w-full bg-[#073B78] text-white border-b border-[#0A4B91]/80">
              <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15 py-4 sm:py-5">
                  {statsList.map((st, sIdx) => (
                    <div key={sIdx} className="px-3 sm:px-6 py-2.5 sm:py-1 flex flex-col justify-center">
                      <span className="font-serif font-normal text-lg sm:text-xl lg:text-2xl text-[#FF9D2E] leading-tight tracking-tight">
                        {st.value}
                      </span>
                      <span className="text-[10.5px] sm:text-xs text-white/75 font-medium uppercase tracking-wider mt-1">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* ======================================================================= */}
        {/* SECTION 1: ABOUT PT. TBK & VALUE PROPOSITIONS                           */}
        {/* Exact match to PT. TBK design concept (media_1792119389037.jpg)         */}
        {/* Left: TENTANG KAMI, Membangun Rumah, Mewujudkan Masa Depan, CTA button  */}
        {/* Right: 4 feature cards in 2x2 grid (Hunian Berkualitas, Harga Terjangkau, */}
        {/* Lokasi Strategis, Lingkungan Asri)                                      */}
        {/* ======================================================================= */}
        <section id="tentang-ringkas" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-[#DCE7F5]">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column: Headline & Editorial Mission */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-5 reveal-left-on-scroll">
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>{content.about?.homeIntroBadge || 'Tentang Kami'}</span>
                </div>

                <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-[38px] text-[#102D52] leading-[1.18] tracking-tight">
                  {content.about?.homeIntroTitle || 'Membangun Rumah,'}<br />
                  <span className="text-[#073B78] font-serif">{content.about?.homeIntroHighlight || 'Mewujudkan Masa Depan.'}</span>
                </h2>

                <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] leading-relaxed">
                  {content.about?.homeIntroText || 'Kami hadir untuk menyediakan hunian berkualitas dengan harga terjangkau, khususnya bagi keluarga Indonesia. Dengan pengalaman dan komitmen tinggi, PT. Terbang Bersama Kawan terus berinovasi dalam menghadirkan lingkungan yang nyaman, aman, dan berkelanjutan.'}
                </p>

                <div className="pt-2">
                  <Link
                    href={content.about?.homeIntroCtaLink || '/tentang'}
                    prefetch={false}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border-2 border-[#073B78] hover:bg-[#073B78] hover:text-white text-[#073B78] font-semibold text-xs tracking-normal transition-all duration-200 shadow-sm active:scale-95 group"
                  >
                    <span>{content.about?.homeIntroCtaText || 'Kenal Lebih Dekat'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: 2x2 Feature Cards Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 reveal-right-on-scroll delay-100">
                {(Array.isArray(content.about?.features)
                  ? content.about.features
                  : [
                      { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                      { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                      { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                      { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                    ]
                ).map((card, idx) => {
                  const style = featureColorClasses[idx % featureColorClasses.length];
                  return (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DCE7F5] hover:border-[#FF9D2E]/60 hover:shadow-md transition-all duration-200 flex items-start gap-4 group"
                    >
                      <div className={`w-12 h-12 rounded-full ${style.bg} ${style.text} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        {getFeatureIcon(card.icon)}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-[#102D52] text-[15px] sm:text-[16px] ${style.hover} transition-colors`}>
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#526783] mt-1 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: PROJECT HIGHLIGHT (Puri Gunung Langgar)        */}
        {/* Clean Editorial Layout, Real Data, Interactive Gallery    */}
        {/* ========================================================= */}
        <section id="proyek" className="py-16 sm:py-24 bg-white border-b border-[#DCE7F5]">
          <div className="container-editorial">
            {/* Section Header */}
            <div className="max-w-2xl mb-10 sm:mb-14 reveal-on-scroll">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Proyek Unggulan</span>
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                Puri Gunung Langgar
              </h2>
              <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] mt-2.5 leading-relaxed">
                Kawasan perumahan subsidi terencana di Tanjung Bintang, Lampung Selatan. Menghadirkan rumah tapak berkualitas dengan kepastian legalitas dan lingkungan yang asri.
              </p>
            </div>

            {/* Showcase: Photo Gallery Left, Spec Sheet Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Media Gallery Viewer - Frameless & Auto Slideshow */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-3 reveal-left-on-scroll delay-100">
                {/* Frameless Slideshow Stage */}
                {activeProjectSlides.length > 0 ? (
                  <div
                    className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] flex items-center justify-center select-none group"
                    tabIndex={0}
                    role="region"
                    aria-label="Slideshow dokumentasi proyek Puri Gunung Langgar. Geser atau klik untuk memperbesar."
                    onTouchStart={handleGalleryTouchStart}
                    onTouchEnd={handleGalleryTouchEnd}
                  >
                    {activeProjectSlides.map((slide, sIdx) => {
                      const isActive = sIdx === currentProjectSlide;
                      return (
                        <div
                          key={sIdx}
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                            isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        >
                          {/* Gambar Apa Adanya tanpa Frame Tebal / Letterbox Hitam */}
                          <img
                            src={slide.image}
                            alt={slide.caption || 'Foto Proyek'}
                            onClick={() => {
                              const projectLookbookItems: LookbookItem[] = activeProjectSlides.map((s, idx) => ({
                                image: s.image,
                                title: s.caption || `${content.project?.name || 'Puri Gunung Langgar'} - Dokumentasi Foto`,
                                description: `Dokumentasi visual proyek ${content.project?.name || 'Puri Gunung Langgar'} yang dikembangkan oleh PT. Terbang Bersama Kawan.`,
                                tag: `Dokumentasi 0${idx + 1}`,
                                category: 'Galeri Proyek',
                              }));
                              setLightbox({
                                open: true,
                                currentIndex: sIdx,
                                items: projectLookbookItems,
                              });
                            }}
                            className="max-h-[400px] sm:max-h-[460px] md:max-h-[500px] w-auto max-w-full object-contain rounded-2xl shadow-lg border border-slate-200/80 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                            loading="lazy"
                          />
                        </div>
                      );
                    })}

                    {/* Tombol Navigasi Kiri & Kanan */}
                    {activeProjectSlides.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentProjectSlide((prev) => (prev - 1 + activeProjectSlides.length) % activeProjectSlides.length);
                          }}
                          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-[#FF9D2E] text-[#102D52] hover:text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-200/80 backdrop-blur-sm"
                          aria-label="Foto sebelumnya"
                        >
                          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
                          }}
                          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-[#FF9D2E] text-[#102D52] hover:text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-200/80 backdrop-blur-sm"
                          aria-label="Foto selanjutnya"
                        >
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </>
                    )}

                    {/* Tombol Perbesar Floating di Pojok Kanan Atas */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const projectLookbookItems: LookbookItem[] = activeProjectSlides.map((s, idx) => ({
                          image: s.image,
                          title: s.caption || `${content.project?.name || 'Puri Gunung Langgar'} - Dokumentasi Foto`,
                          description: `Dokumentasi visual proyek ${content.project?.name || 'Puri Gunung Langgar'} yang dikembangkan oleh PT. Terbang Bersama Kawan.`,
                          tag: `Dokumentasi 0${idx + 1}`,
                          category: 'Galeri Proyek',
                        }));
                        setLightbox({
                          open: true,
                          currentIndex: currentProjectSlide,
                          items: projectLookbookItems,
                        });
                      }}
                      className="absolute top-3 right-3 sm:right-6 z-30 bg-black/60 hover:bg-[#073B78] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border border-white/20"
                      aria-label="Perbesar foto"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#FF9D2E]" />
                      <span className="hidden sm:inline">Perbesar Foto</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-[360px] sm:h-[420px] flex flex-col items-center justify-center p-8 bg-[#F4F7FC] rounded-2xl border border-dashed border-[#DCE7F5] text-center">
                    <Building2 className="w-12 h-12 text-[#526783]/40 mb-3" />
                    <h3 className="font-semibold text-lg text-[#102D52]">Dokumentasi Proyek Sedang Diperbarui</h3>
                    <p className="text-xs sm:text-sm text-[#526783] mt-1 max-w-sm">
                      Dokumentasi foto kawasan perumahan Puri Gunung Langgar sedang dipersiapkan oleh tim pengembang.
                    </p>
                  </div>
                )}

                {/* Indikator Slideshow Dots & Caption di Luar (Tidak Menutupi Poster) */}
                <div className="flex flex-col items-center gap-1.5 pt-1 text-center w-full">
                  {activeProjectSlides.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      {activeProjectSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentProjectSlide(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentProjectSlide
                              ? 'w-6 bg-[#073B78]'
                              : 'w-2 bg-[#DCE7F5] hover:bg-[#A9C3E5]'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {activeProjectSlides[currentProjectSlide]?.caption && (
                    <p className="text-xs sm:text-sm text-[#526783] font-medium max-w-md line-clamp-1">
                      {activeProjectSlides[currentProjectSlide].caption}
                    </p>
                  )}
                </div>

                {/* Mini Clean Thumbnail Strip Tanpa Frame Gelap */}
                {activeProjectSlides.length > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-1 overflow-x-auto max-w-full">
                    {activeProjectSlides.map((slide, sIdx) => {
                      const isActive = sIdx === currentProjectSlide;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setCurrentProjectSlide(sIdx)}
                          className={`relative h-14 sm:h-16 aspect-[3/4] sm:aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                            isActive
                              ? 'border-[#FF9D2E] shadow-md scale-105 opacity-100 ring-2 ring-[#FF9D2E]/25'
                              : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                          aria-label={`Pilih foto ${sIdx + 1}`}
                        >
                          <img
                            src={slide.image}
                            alt={slide.caption || `Foto ${sIdx + 1}`}
                            className="w-full h-full object-contain p-1"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Spec Sheet Card */}
              <div className="lg:col-span-5 bg-[#F4F7FC] p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm flex flex-col justify-between reveal-right-on-scroll delay-200 interactive-card">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F5]">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#526783] block font-semibold">Kategori Proyek</span>
                      <span className="font-bold text-lg text-[#102D52]">Rumah Tapak Bersubsidi</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#15966A] font-bold bg-[#E6F7F3] px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-[#15966A]" />
                      <span>Tahap Konstruksi</span>
                    </div>
                  </div>

                  <dl className="py-2 divide-y divide-[#DCE7F5]/80 text-xs sm:text-[13.5px]">
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#526783] font-medium">Lokasi Proyek</dt>
                      <dd className="font-semibold text-[#102D52] text-right">Desa Sabah Balau, Tanjung Bintang, Lamsel</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#526783] font-medium">Tipe Bangunan</dt>
                      <dd className="font-bold text-[#102D52]">Tipe 36 / 72 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#526783] font-medium">Luas Bangunan</dt>
                      <dd className="font-bold text-[#102D52]">36 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#526783] font-medium">Luas Tanah</dt>
                      <dd className="font-bold text-[#102D52]">72 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#526783] font-medium">Legalitas Lahan</dt>
                      <dd className="font-bold text-[#102D52]">Sertifikat Hak Milik (SHM)</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#526783] font-medium">Fasilitas Dasar</dt>
                      <dd className="font-medium text-[#102D52] text-right">Jalan Paving, Listrik PLN, Air Bersih</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[#526783] font-medium">Skema Pembiayaan</dt>
                      <dd className="font-bold text-[#15966A]">KPR Bersubsidi FLPP 5% & Mandiri</dd>
                    </div>
                  </dl>
                </div>

                <div className="pt-6 border-t border-[#DCE7F5] space-y-3">
                  <Link
                    href="/proyek#galeri"
                    prefetch={false}
                    className="interactive-btn group w-full h-[46px] rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-xs font-semibold tracking-normal flex items-center justify-center gap-2 shadow-sm hover:shadow"
                  >
                    <span>Lihat Detail Spesifikasi Proyek</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-btn w-full h-[46px] rounded-full border border-[#073B78] hover:bg-[#073B78] hover:text-white text-[#073B78] text-xs font-semibold tracking-normal flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FF9D2E]" />
                    <span>Tanya Ketersediaan Kavling</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION B: ABOUT PT. TBK (Corporate Strengths Layout)    */}
        {/* White background, strong heading, 3 clean strengths       */}
        {/* ========================================================= */}
        <section id="tentang" className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#DCE7F5]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Heading, Company Profile, 3 Strengths */}
              <div className="lg:col-span-7 space-y-6 reveal-left-on-scroll">
                <div>
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Profil Pengembang</span>
                  </div>
                  <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                    Membangun dengan Komitmen &amp; Legalitas Nyata
                  </h2>
                </div>

                <p className="font-sans text-[15px] sm:text-[16px] text-[#102D52]/85 leading-relaxed">
                  PT. Terbang Bersama Kawan (PT. TBK) adalah perusahaan pengembang properti dan real estat yang berbasis di Bandar Lampung. Didirikan secara sah dengan Akta Notaris No. 10 tanggal 18 Maret 2021 dan disahkan oleh Kementerian Hukum dan HAM RI pada 19 Maret 2021.
                </p>

                <p className="font-sans text-[14.5px] text-[#526783] leading-relaxed">
                  Sebagai pengembang perumahan resmi di Provinsi Lampung, PT. Terbang Bersama Kawan mengutamakan kepastian hukum, keterbukaan informasi, dan mutu konstruksi terbaik agar masyarakat berpenghasilan rendah hingga menengah dapat memiliki rumah impian dengan rasa tenang.
                </p>

                {/* 3 Pillars in Clean Layout with Staggered Delays */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-[#DCE7F5]">
                  <div className="reveal-on-scroll delay-100">
                    <span className="font-serif text-2xl sm:text-3xl text-[#FF9D2E] block mb-1.5">
                      01
                    </span>
                    <h3 className="font-semibold text-[15px] text-[#102D52] tracking-normal mb-1.5">
                      Kepastian Hukum
                    </h3>
                    <p className="text-xs text-[#526783] leading-relaxed">
                      Legalitas tanah SHM dan perseroan berizin resmi Kemenkumham RI.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-[#DCE7F5] sm:pl-6 reveal-on-scroll delay-200">
                    <span className="font-serif text-2xl sm:text-3xl text-[#FF9D2E] block mb-1.5">
                      02
                    </span>
                    <h3 className="font-semibold text-[15px] text-[#102D52] tracking-normal mb-1.5">
                      Mutu Konstruksi
                    </h3>
                    <p className="text-xs text-[#526783] leading-relaxed">
                      Standar teknis bangunan kokoh dan tata lingkungan terencana.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-[#DCE7F5] sm:pl-6 reveal-on-scroll delay-300">
                    <span className="font-serif text-2xl sm:text-3xl text-[#FF9D2E] block mb-1.5">
                      03
                    </span>
                    <h3 className="font-semibold text-[15px] text-[#102D52] tracking-normal mb-1.5">
                      Kemudahan KPR
                    </h3>
                    <p className="text-xs text-[#526783] leading-relaxed">
                      Bantuan pendampingan berkas program subsidi FLPP bunga 5% flat.
                    </p>
                  </div>
                </div>

                <div className="pt-2 reveal-on-scroll delay-350">
                  <Link
                    href="/tentang"
                    prefetch={false}
                    className="group inline-flex items-center gap-2 text-xs font-semibold tracking-normal text-[#073B78] hover:text-[#FF9D2E] transition-colors"
                  >
                    <span>Baca Selengkapnya Tentang PT. TBK</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Office Photography & Vision Quote */}
              <div className="lg:col-span-5 space-y-6 reveal-right-on-scroll delay-150">
                {content.about?.officeImage && content.about.officeImage.trim() !== '' && (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#DCE7F5] shadow-sm bg-[#102D52] interactive-card">
                    <img
                      src={content.about.officeImage}
                      alt={content.about.officeCaption || 'Kantor & Perencanaan PT. TBK'}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102D52]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                      <span className="font-semibold text-[#FF9D2E] tracking-wider block text-[10.5px]">
                        {(content.about.officeCaption || 'Kantor Pusat').split(' - ')[0] || 'Kantor Pusat'}
                      </span>
                      {(content.about.officeCaption || 'Kantor Pusat - Bandar Lampung, Provinsi Lampung').split(' - ').slice(1).join(' - ') || 'Bandar Lampung, Provinsi Lampung'}
                    </div>
                  </div>
                )}

                <div className="pt-1 border-l-4 border-[#FF9D2E] pl-4 sm:pl-5 space-y-1">
                  <span className="text-[11px] tracking-wider text-[#FF9D2E] font-medium block">
                    Visi Perseroan
                  </span>
                  <blockquote className="font-serif italic text-lg sm:text-xl text-[#102D52] font-normal leading-relaxed">
                    &ldquo;{content.about?.visionText || 'Perusahaan properti yang berkualitas dan terpercaya.'}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION: DEWAN PENGURUS & DIREKSI PERSEROAN               */}
        {/* Background: #F4F7FC (Soft Elegant Contrast)               */}
        {/* ========================================================= */}
        <section id="pimpinan" className="py-16 sm:py-24 bg-[#F4F7FC] border-b border-[#DCE7F5] scroll-mt-16">
          <div className="container-editorial">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16 reveal-on-scroll">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>{content.leadership?.badge || 'STRUKTUR KEPEMIMPINAN RESMI'}</span>
                </div>
                <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                  {content.leadership?.title || 'Dewan Komisaris & Direksi Perseroan'}
                </h2>
                <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] mt-2.5 leading-relaxed">
                  {content.leadership?.subtitle || 'Dikelola oleh pengurus resmi yang tercantum dalam Akta Notaris & SK Kemenkumham RI, serta jajaran manajemen profesional yang berdedikasi membangun kawasan perumahan berkualitas di Lampung.'}
                </p>
              </div>

              <div className="self-start sm:self-end shrink-0">
                <Link
                  href="/pimpinan"
                  prefetch={false}
                  className="group inline-flex items-center gap-2 text-xs font-semibold tracking-normal text-[#073B78] hover:text-[#FF9D2E] transition-colors bg-white px-4 py-2.5 rounded-full border border-[#DCE7F5] shadow-xs"
                >
                  <Users className="w-3.5 h-3.5 text-[#FF9D2E]" />
                  <span>Lihat Seluruh Struktur Organisasi</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Primary Leadership Duo: Dewan Komisaris & Direktur Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto mb-12 sm:mb-16">
              {displayPrimaryLeaders.map((member, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl bg-white border border-[#DCE7F5] overflow-hidden flex flex-col transition-all duration-300 hover:border-[#073B78] shadow-sm hover:shadow-md reveal-on-scroll"
                >
                  {/* Executive Portrait Frame - 3:4 Aspect Ratio with Full Face Visibility */}
                  <div className="relative w-full aspect-[3/4] bg-[#073B78] overflow-hidden">
                    {member.image && member.image.trim() !== '' ? (
                      <>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#102D52]/95 via-[#102D52]/50 to-transparent pointer-events-none" />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#073B78] relative overflow-hidden">
                        <div className="relative z-10 w-24 h-28 rounded-2xl border border-white/20 bg-white/10 flex flex-col items-center justify-center p-4">
                          <Building2 className="w-7 h-7 text-[#FF9D2E] mb-1" />
                          <span className="text-2xl font-bold text-white tracking-wider">
                            {member.name ? member.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : 'TBK'}
                          </span>
                        </div>
                        <span className="relative z-10 mt-3 text-[11px] font-medium text-white/70 tracking-wider">
                          Portret Resmi Perseroan
                        </span>
                      </div>
                    )}

                    {/* Role Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#102D52]/90 backdrop-blur-md border border-[#FF9D2E]/60 text-[#FF9D2E] text-[11px] font-medium tracking-wide shadow-sm">
                      <span>{member.role}</span>
                    </div>

                    {/* Legal Verified Badge */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#102D52]/90 backdrop-blur-md text-[#15966A] text-[11px] font-medium border border-[#15966A]/40 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15966A]" />
                      <span>SK Kemenkumham</span>
                    </div>

                    {/* Name at bottom of portrait */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 text-white">
                      <span className="text-[11px] tracking-wide text-[#FF9D2E] font-medium block mb-0.5">
                        {member.department || 'Pengurus Inti Perseroan'}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-tight">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4 bg-white">
                    <div>
                      <div className="text-[11px] font-medium tracking-wide text-[#FF9D2E] mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Amanat &amp; Tanggung Jawab</span>
                      </div>
                      <p className="text-[13px] sm:text-[13.5px] text-[#526783] leading-relaxed">
                        {member.roleDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#DCE7F5] flex items-center justify-between text-xs text-[#526783]">
                      <span className="flex items-center gap-1.5 text-xs text-[#15966A]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15966A]" />
                        <span>Akta Notaris No. 10</span>
                      </span>
                      <span className="font-mono text-[11px]">PT. TBK</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Management Team Grid */}
            {displayOperationalLeaders.length > 0 && (
              <div className="border-t border-[#DCE7F5] pt-10 sm:pt-14">
                <div className="max-w-2xl mb-8">
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-1.5">
                    <span className="w-4 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Jajaran Manajemen Operasional</span>
                  </div>
                  <h3 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                    {content.leadership?.operationalTitle || 'Kepala Divisi & Pelaksana Teknis'}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                    {content.leadership?.operationalSubtitle || 'Memastikan kelancaran proses verifikasi KPR FLPP, pengawasan fisik konstruksi, dan sertifikasi tanah secara tepat waktu.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayOperationalLeaders.map((op, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-[#DCE7F5] overflow-hidden flex flex-col transition-all duration-300 hover:border-[#073B78] shadow-xs hover:shadow-sm"
                    >
                      <div className="relative w-full aspect-[4/5] bg-[#073B78] overflow-hidden">
                        {op.image && op.image.trim() !== '' ? (
                          <img
                            src={op.image}
                            alt={op.name}
                            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
                            Portret Foto
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="text-[10px] text-[#FF9D2E] font-medium block">
                            {op.department || 'Manajemen'}
                          </span>
                          <span className="font-bold text-sm leading-tight block truncate">
                            {op.name}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="text-[11px] font-bold text-[#073B78] mb-1">
                            {op.role}
                          </div>
                          <p className="text-[11.5px] text-[#526783] line-clamp-3 leading-relaxed">
                            {op.roleDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION C: BUYING PROCESS (Tahapan Pembelian Rumah)       */}
        {/* Background: Soft Modern Tone #F8FAFC                     */}
        {/* ========================================================= */}
        <section id="alur-pembelian" className="py-14 sm:py-20 bg-[#F8FAFC] border-y border-[#E2E8F0] scroll-mt-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* Header with Title & Suburban Houses Vector Illustration */}
            <div className="flex items-start justify-between gap-4 mb-8 sm:mb-10 reveal-on-scroll">
              <div className="max-w-lg">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#102D52] leading-tight tracking-tight">
                  {content.buyingProcess?.title || 'Tahapan Pembelian Rumah Subsidi'}
                </h2>
                <p className="font-sans text-[13px] sm:text-[14.5px] text-[#526783] mt-2.5 leading-relaxed">
                  {content.buyingProcess?.subtitle || 'Alur pengajuan yang transparan dan terstruktur bagi masyarakat, dari pemilihan kavling hingga serah terima kunci.'}
                </p>
              </div>
              <div className="shrink-0 pt-1">
                <HeaderHousesIllustration className="w-28 sm:w-36 md:w-44 h-auto drop-shadow-sm" />
              </div>
            </div>

            {(() => {
              const defaultSteps = [
                {
                  step: '01',
                  title: 'Pilih Unit & Konsultasi',
                  desc: 'Kunjungi kantor pemasaran atau lokasi proyek untuk memilih nomor kavling yang tersedia dan melakukan konsultasi syarat KPR.',
                  highlight: 'Survei kavling langsung',
                  delayClass: 'delay-100',
                },
                {
                  step: '02',
                  title: 'Pemberkasan Dokumen',
                  desc: 'Menyiapkan berkas identitas (KTP, KK, NPWP, Slip Gaji atau Keterangan Usaha) untuk verifikasi kelayakan subsidi FLPP.',
                  highlight: 'Didampingi tim admin',
                  delayClass: 'delay-200',
                },
                {
                  step: '03',
                  title: 'Wawancara & Analisis Bank',
                  desc: 'Proses persetujuan pembiayaan oleh perbankan mitra penyalur KPR bersubsidi dengan suku bunga 5% tetap pemerintah.',
                  highlight: 'Kepastian plafon kredit',
                  delayClass: 'delay-300',
                },
                {
                  step: '04',
                  title: 'Akad & Serah Terima',
                  desc: 'Penandatanganan akta di hadapan Notaris resmi perseroan dan serah terima kunci unit rumah kepada konsumen.',
                  highlight: 'Sertifikat Hak Milik (SHM)',
                  delayClass: 'delay-400',
                },
              ];

              const steps = Array.isArray(content.buyingProcess?.steps) && content.buyingProcess.steps.length > 0
                ? content.buyingProcess.steps.map((s, i) => ({
                    ...s,
                    delayClass: `delay-${((i % 4) + 1) * 100}`,
                  }))
                : defaultSteps;

              return (
                <div className="relative pl-6 sm:pl-9">
                  {/* Dashed vertical timeline line running through all items */}
                  <div
                    className="absolute left-[7px] sm:left-[11px] top-6 bottom-8 w-0 border-l-2 border-dashed border-[#CBD5E1]"
                    aria-hidden="true"
                  />

                  <div className="space-y-4 sm:space-y-5">
                    {steps.map((item, idx) => {
                      let illustration = <Step1ConsultationIllustration className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />;
                      let highlightIcon = <CheckCircle2 className="w-4 h-4 text-[#102D52] shrink-0" />;

                      if (idx === 1 || item.step === '02') {
                        illustration = <Step2DocumentIllustration className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />;
                        highlightIcon = <User className="w-4 h-4 text-[#102D52] shrink-0" />;
                      } else if (idx === 2 || item.step === '03') {
                        illustration = <Step3BankIllustration className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />;
                        highlightIcon = <CheckCircle2 className="w-4 h-4 text-[#102D52] shrink-0" />;
                      } else if (idx === 3 || item.step === '04') {
                        illustration = <Step4HandshakeIllustration className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />;
                        highlightIcon = <CheckCircle2 className="w-4 h-4 text-[#102D52] shrink-0" />;
                      }

                      const isHandshakeStep = idx === 3 || item.step === '04';

                      return (
                        <div key={idx} className={`relative group reveal-on-scroll ${item.delayClass}`}>
                          {/* Circular Timeline Node Dot */}
                          <div
                            className="absolute -left-[27px] sm:-left-[39px] top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border-[3.5px] border-[#F59E0B] shadow-sm z-10 transition-transform group-hover:scale-110"
                            aria-hidden="true"
                          />

                          {/* White Illustrated Card */}
                          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_rgba(16,45,82,0.05)] border border-[#E2E8F0] hover:shadow-[0_6px_20px_rgba(16,45,82,0.08)] transition-all duration-200">
                            {/* Card Top: Number, Title & Illustration */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#D97706] tracking-tight leading-none">
                                    {item.step}
                                  </span>
                                  {isHandshakeStep && (
                                    <span className="text-xl sm:text-2xl leading-none" role="img" aria-label="handshake">
                                      🤝
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-bold text-base sm:text-lg text-[#102D52] mt-1.5 tracking-tight leading-snug">
                                  {item.title}
                                </h3>
                              </div>

                              <div className="shrink-0">
                                {illustration}
                              </div>
                            </div>

                            {/* Card Body: Description */}
                            <p className="font-sans text-xs sm:text-[13.5px] text-[#526783] leading-relaxed mt-2.5 mb-3.5">
                              {item.desc}
                            </p>

                            {/* Card Footer: Subtle Divider + Icon Highlight */}
                            <div className="pt-3 border-t border-[#F1F5F9] flex items-center gap-2 text-xs font-medium text-[#334155]">
                              {highlightIcon}
                              <span>{item.highlight}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION D: KPR SIMULATION (Simulasi Angsuran FLPP 5%)      */}
        {/* Corporate Navy Background, Clear Sliders, Output Box      */}
        {/* ========================================================= */}
        <section id="simulasi-kpr" className="py-16 sm:py-24 bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white border-b border-white/10">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Context & Overview */}
              <div className="lg:col-span-5 space-y-5 reveal-left-on-scroll">
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>{content.kprSimulation?.badge || 'Kalkulator Finansial'}</span>
                </div>
                <h2 className="font-serif font-normal text-3xl sm:text-4xl text-white leading-tight">
                  {content.kprSimulation?.title || 'Simulasi Angsuran KPR Bersubsidi'}
                </h2>
                <p className="font-sans text-[15px] sm:text-[16px] text-white/85 leading-relaxed">
                  {content.kprSimulation?.subtitle || 'Hitung perkiraan angsuran bulanan rumah subsidi Puri Gunung Langgar melalui skema FLPP dengan suku bunga tetap 5% p.a.'}
                </p>

                <div className="pt-4 space-y-3 text-xs sm:text-[13px] text-white/80">
                  {(Array.isArray(content.kprSimulation?.benefits) && content.kprSimulation.benefits.length > 0
                    ? content.kprSimulation.benefits
                    : [
                        'Suku Bunga Tetap (Anuitas) 5% sampai lunas',
                        'Bebas PPN dan premi asuransi bersubsidi',
                        'Pilihan jangka waktu fleksibel hingga 20 tahun'
                      ]
                  ).map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF9D2E] shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Calculator Box */}
              <div className="lg:col-span-7 bg-white text-[#102D52] p-6 sm:p-9 rounded-2xl border border-[#DCE7F5] shadow-2xl space-y-6 reveal-right-on-scroll delay-150 interactive-card">
                <div className="space-y-5">
                  {/* Harga Unit */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-[#526783] mb-2 font-medium">
                      <span>Harga Rumah</span>
                      <span className="font-mono text-sm font-bold text-[#073B78]">
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
                      className="w-full accent-[#FF9D2E] cursor-pointer h-2 bg-[#DCE7F5] rounded-full transition-all"
                    />
                  </div>

                  {/* Uang Muka DP */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-[#526783] mb-2 font-medium">
                      <span>Uang Muka (DP)</span>
                      <span className="font-mono text-sm font-bold text-[#15966A]">
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
                      className="w-full accent-[#15966A] cursor-pointer h-2 bg-[#DCE7F5] rounded-full transition-all"
                    />
                  </div>

                  {/* Tenor */}
                  <div>
                    <div className="text-xs text-[#526783] mb-2 font-medium">
                      Jangka Waktu Pinjaman
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[10, 15, 20].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setKprTenor(yr)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-normal transition-all duration-200 active:scale-95 ${
                            kprTenor === yr
                              ? 'bg-[#073B78] text-white shadow-md'
                              : 'bg-[#F4F7FC] hover:bg-[#DCE7F5] text-[#526783]'
                          }`}
                        >
                          {yr} Tahun
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Output Highlight */}
                <div className="p-5 bg-gradient-to-r from-[#073B78] to-[#102D52] rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-md">
                  <div>
                    <span className="text-[11px] text-white/80 block font-medium">
                      Estimasi Angsuran Tetap per Bulan (FLPP 5%)
                    </span>
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[#FF9D2E] tracking-tight mt-0.5">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprAngsuran)}
                      <span className="text-xs text-white/70 font-sans font-normal"> / bulan</span>
                    </div>
                  </div>
                  <div className="text-xs text-white/85 text-right">
                    <div>Perkiraan harian: <strong className="text-white font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPerHari)}/hari</strong></div>
                    <div className="text-[11px] text-white/70 mt-0.5">Sisa pokok KPR: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPokok)}</div>
                  </div>
                </div>

                {/* Consultation Button */}
                <a
                  href={`${waUrl}?text=${encodeURIComponent(
                    `Halo PT. TBK, saya tertarik dengan simulasi KPR Puri Gunung Langgar: Harga Unit Rp ${kprHarga.toLocaleString('id-ID')}, DP Rp ${kprDp.toLocaleString('id-ID')}, Tenor ${kprTenor} Tahun (Angsuran sekitar Rp ${kprAngsuran.toLocaleString('id-ID')}/bln). Mohon info ketersediaan unit dan persyaratannya.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-btn group w-full h-[48px] rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] font-semibold text-xs tracking-normal flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi Simulasi Ini via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION E: CONSTRUCTION PROGRESS (Dokumentasi Lapangan)   */}
        {/* Background: Clean White #FFFFFF                          */}
        {/* ========================================================= */}
        <section id="kegiatan" className="py-16 sm:py-24 bg-white border-b border-[#DCE7F5]">
          <div className="container-editorial">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14 reveal-on-scroll">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>Dokumentasi Riil</span>
                </div>
                <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                  Progres Pekerjaan Lapangan
                </h2>
                <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] mt-2.5 leading-relaxed">
                  Aktivitas fisik konstruksi kawasan perumahan Puri Gunung Langgar yang terpantau secara berkala.
                </p>
              </div>

              <Link
                href="/kegiatan"
                prefetch={false}
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-normal text-[#073B78] hover:text-[#FF9D2E] transition-colors self-start sm:self-end"
              >
                <span>Lihat Seluruh Dokumentasi Progres</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Photographic Grid with Staggered Delays */}
            {(() => {
              const rawActivities = Array.isArray(content.activities?.items) ? content.activities.items : [];
              const activitiesList = rawActivities.filter((item) => item && (item.title || item.image)).slice(0, 4);

              if (activitiesList.length === 0) {
                return (
                  <div className="p-12 text-center space-y-3 border border-dashed border-[#DCE7F5] rounded-2xl">
                    <HardHat className="w-10 h-10 text-[#526783]/50 mx-auto" />
                    <h3 className="font-semibold text-lg text-[#102D52]">Dokumentasi Lapangan Sedang Diperbarui</h3>
                    <p className="text-xs sm:text-sm text-[#526783] max-w-md mx-auto">
                      Dokumentasi foto dan video progres pekerjaan kawasan sedang dipersiapkan oleh tim lapangan.
                    </p>
                  </div>
                );
              }

              const activityLookbookItems: LookbookItem[] = activitiesList.map((item, idx) => ({
                image: item.image,
                title: item.title,
                description: item.description,
                tag: item.tag || `Tahap 0${idx + 1}`,
                category: 'Progres Lapangan',
              }));

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activitiesList.map((item, idx) => (
                    <div
                      key={idx}
                      className={`group flex flex-col justify-between space-y-3 bg-[#F4F7FC] p-4 rounded-2xl border border-[#DCE7F5] shadow-sm hover:shadow-md transition-shadow reveal-on-scroll ${item.delayClass} interactive-card`}
                    >
                      <div
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#102D52] cursor-pointer"
                        onClick={() =>
                          setLightbox({
                            open: true,
                            currentIndex: idx,
                            items: activityLookbookItems,
                          })
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#073B78]/90 text-white text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {item.tag || `Tahap ${idx + 1}`}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <h3 className="font-semibold text-[15px] text-[#102D52] leading-snug group-hover:text-[#073B78] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#526783] leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION F: LEGALITAS RESMI PERSEROAN                      */}
        {/* Background: Soft Alt #F4F7FC                             */}
        {/* ========================================================= */}
        <section id="legalitas" className="py-16 sm:py-24 bg-[#F4F7FC] border-b border-[#DCE7F5]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-4 reveal-left-on-scroll">
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>Kepastian Hukum</span>
                </div>
                <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                  Legalitas Resmi Perseroan
                </h2>
                <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] leading-relaxed">
                  Setiap unit hunian dan pengembangan kawasan PT. Terbang Bersama Kawan berlandaskan kekuatan hukum resmi Republik Indonesia.
                </p>

                <div className="pt-2">
                  <Link
                    href="/legalitas"
                    prefetch={false}
                    className="group inline-flex items-center gap-2 text-xs font-semibold tracking-normal text-[#073B78] hover:text-[#FF9D2E] transition-colors"
                  >
                    <span>Pelajari Dokumen Legalitas Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Legal Certificate Fact Sheet */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm reveal-right-on-scroll delay-150 interactive-card">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F5]">
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-6 h-6 text-[#073B78] shrink-0" />
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#102D52]">PT. Terbang Bersama Kawan (PT. TBK)</h3>
                      <span className="text-[11.5px] text-[#526783]">Terdaftar resmi di Kemenkumham RI</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#15966A] bg-[#E6F7F3] px-3 py-1 rounded-full tracking-wide font-mono">
                    AHU Terverifikasi
                  </span>
                </div>

                <dl className="divide-y divide-[#DCE7F5] text-xs sm:text-[13.5px]">
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="text-[#526783] font-medium sm:w-1/3">Akta Notaris</dt>
                    <dd className="font-medium text-[#102D52] sm:w-2/3 sm:text-right">
                      <span className="font-mono font-bold text-[#102D52]">{content.legal?.aktaNumber || 'No. 10'}</span>
                      <span className="text-[#526783] block text-[11px] mt-0.5 font-normal">Tanggal {content.legal?.aktaDate || '18 Maret 2021'} &bull; Notaris: {content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.'}</span>
                    </dd>
                  </div>

                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="text-[#526783] font-medium sm:w-1/3">SK Pengesahan Menkumham</dt>
                    <dd className="font-medium text-[#102D52] sm:w-2/3 sm:text-right">
                      <span className="font-mono font-bold text-[#102D52] break-all">{content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}</span>
                      <span className="text-[#526783] block text-[11px] mt-0.5 font-normal">Tanggal SK: {content.legal?.skDate || '19 Maret 2021'}</span>
                    </dd>
                  </div>

                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="text-[#526783] font-medium sm:w-1/3">Status Hak Lahan</dt>
                    <dd className="font-semibold text-[#102D52] sm:w-2/3 sm:text-right">
                      <span className="text-[#102D52]">Sertifikat Hak Milik (SHM)</span>
                      <span className="text-[#526783] block text-[11px] mt-0.5 font-normal">Hak kepemilikan mutlak dan sah atas nama pembeli</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer content={content} />

      {/* Fullscreen Lookbook Modal */}
      <LookbookModal
        isOpen={lightbox.open}
        onClose={() => setLightbox((prev) => ({ ...prev, open: false }))}
        items={lightbox.items}
        currentIndex={lightbox.currentIndex}
        onIndexChange={(idx) => setLightbox((prev) => ({ ...prev, currentIndex: idx }))}
        projectName={content.project?.name || 'Puri Gunung Langgar'}
        whatsappNumber={content.contact?.whatsapp || ''}
      />

      {/* Promotional Pop-up Modal (Muncul saat baru buka web jika diaktifkan admin) */}
      <PromoPopupModal promo={content.promoPopup} />
    </div>
  );
}
