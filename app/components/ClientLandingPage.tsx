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
  Briefcase
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import PromoBannerCarousel from './PromoBannerCarousel';
import LookbookModal, { LookbookItem } from './LookbookModal';
import { SiteContent, initialSiteContent } from '@/lib/initialData';

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

  // Scroll Reveal IntersectionObserver with reduced motion support
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-left-on-scroll, .reveal-right-on-scroll');

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target); // Trigger once without replaying on scroll back and forth
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [content]);

  // Project Media State
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

  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);

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

  // Leadership / Dewan Pengurus & Manajemen Data
  const rawLeadershipMembers = Array.isArray(content.leadership?.members) && content.leadership.members.length > 0
    ? content.leadership.members
    : initialSiteContent.leadership.members;

  const primaryLeaders = rawLeadershipMembers.filter(
    (m) => m.role.toLowerCase().includes('komisaris') || m.role.toLowerCase().includes('direktur utama')
  );
  const operationalLeaders = rawLeadershipMembers.filter(
    (m) => !m.role.toLowerCase().includes('komisaris') && !m.role.toLowerCase().includes('direktur utama')
  );
  const displayPrimaryLeaders = primaryLeaders.length > 0 ? primaryLeaders : rawLeadershipMembers.slice(0, 2);
  const displayOperationalLeaders = primaryLeaders.length > 0 ? operationalLeaders : rawLeadershipMembers.slice(2);

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
    <div className="min-h-screen bg-white text-[#102D52] font-sans antialiased selection:bg-[#FF9D2E] selection:text-[#102D52]">
      {/* 1. Header (ICC-Style Full-Width Navy Header with Logo, Search Modal, and Hamburger) */}
      <Header content={content} />

      <main id="main-content">
        {/* ========================================================= */}
        {/* 2. FULL-WIDTH PROMOTIONAL BANNER CAROUSEL (HIGHEST PRIORITY) */}
        {/* Inspired by Indonesian Certification Center (ICC)          */}
        {/* Edge-to-edge, over-the-banner orange arrows, bottom dots   */}
        {/* ========================================================= */}
        <div className="w-full pt-[58px] min-[980px]:pt-[68px]">
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
              {/* Left Column: Media Gallery Viewer */}
              <div className="lg:col-span-7 space-y-3 reveal-left-on-scroll delay-100">
                <div
                  className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#102D52] border border-[#DCE7F5] shadow-md select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E]"
                  tabIndex={0}
                  role="region"
                  aria-label="Galeri foto dokumentasi proyek Puri Gunung Langgar. Geser untuk berganti foto."
                  onTouchStart={handleGalleryTouchStart}
                  onTouchEnd={handleGalleryTouchEnd}
                >
                  {activeProjectSlides.map((slide, sIdx) => {
                    const isActive = sIdx === currentProjectSlide;
                    const projectLookbookItems: LookbookItem[] = activeProjectSlides.map((s, idx) => ({
                      image: s.image,
                      title: s.caption || `${content.project?.name || 'Puri Gunung Langgar'} - Dokumentasi Foto`,
                      description: `Dokumentasi visual proyek ${content.project?.name || 'Puri Gunung Langgar'} yang dikembangkan oleh PT. Terbang Bersama Kawan.`,
                      tag: `Sudut 0${idx + 1}`,
                      category: 'Galeri Proyek',
                    }));

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
                            currentIndex: sIdx,
                            items: projectLookbookItems,
                          })
                        }
                        aria-hidden={!isActive}
                      >
                        <img
                          src={slide.image}
                          alt={slide.caption || 'Puri Gunung Langgar'}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    );
                  })}

                  {/* Top Bar: Minimal Counter & Enlarge Button */}
                  <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                    <div className="px-3 py-1 rounded-full bg-[#102D52]/85 backdrop-blur-sm border border-white/15 text-white font-mono text-[11px] font-medium tracking-wider shadow-sm pointer-events-auto">
                      <span className="text-[#FF9D2E]">0{currentProjectSlide + 1}</span>
                      <span className="text-white/40 mx-1">/</span>
                      <span>0{activeProjectSlides.length}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const projectLookbookItems: LookbookItem[] = activeProjectSlides.map((s, idx) => ({
                          image: s.image,
                          title: s.caption || `${content.project?.name || 'Puri Gunung Langgar'} - Dokumentasi Foto`,
                          description: `Dokumentasi visual proyek ${content.project?.name || 'Puri Gunung Langgar'} yang dikembangkan oleh PT. Terbang Bersama Kawan.`,
                          tag: `Sudut 0${idx + 1}`,
                          category: 'Galeri Proyek',
                        }));
                        setLightbox({
                          open: true,
                          currentIndex: currentProjectSlide,
                          items: projectLookbookItems,
                        });
                      }}
                      className="bg-[#102D52]/85 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 border border-white/15 shadow-sm hover:bg-[#073B78] hover:border-[#FF9D2E] transition-all hover:scale-105 active:scale-95 pointer-events-auto"
                      aria-label="Perbesar foto"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#FF9D2E]" />
                      <span className="hidden sm:inline">Perbesar</span>
                    </button>
                  </div>

                  {/* Previous and Next Controls */}
                  {activeProjectSlides.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProjectSlide((prev) => (prev - 1 + activeProjectSlides.length) % activeProjectSlides.length);
                        }}
                        className="w-9 h-9 rounded-full bg-[#102D52]/85 hover:bg-[#FF9D2E] hover:text-[#102D52] border border-white/20 text-white backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto shadow-sm"
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
                        className="w-9 h-9 rounded-full bg-[#102D52]/85 hover:bg-[#FF9D2E] hover:text-[#102D52] border border-white/20 text-white backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto shadow-sm"
                        aria-label="Foto berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Caption Bar */}
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#102D52]/95 via-[#102D52]/60 to-transparent p-4 sm:p-5 text-white pointer-events-none">
                    <div className="text-[11px] sm:text-xs uppercase tracking-wider text-[#FF9D2E] font-bold mb-0.5">
                      Dokumentasi Fisik Lapangan
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-white/90 line-clamp-1">
                      {activeProjectSlides[currentProjectSlide]?.caption || 'Kawasan Puri Gunung Langgar, Lampung Selatan.'}
                    </p>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {activeProjectSlides.length > 1 && (
                  <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                    {activeProjectSlides.map((slide, sIdx) => {
                      const isActive = sIdx === currentProjectSlide;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setCurrentProjectSlide(sIdx)}
                          className={`group/thumb relative aspect-[4/3] rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 ${
                            isActive
                              ? 'border-[#FF9D2E] ring-2 ring-[#FF9D2E]/40 shadow-sm'
                              : 'border-[#DCE7F5] hover:border-[#FF9D2E]/60'
                          }`}
                          aria-label={`Pilih sudut dokumentasi ${sIdx + 1}`}
                        >
                          <img
                            src={slide.image}
                            alt={slide.caption || `Sudut ${sIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/thumb:scale-105"
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
                    href="/proyek"
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
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#DCE7F5] shadow-sm bg-[#102D52] interactive-card">
                  <img
                    src={content.about.officeImage || '/assets/project-identity.jpg'}
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

                <div className="pt-1 border-l-4 border-[#FF9D2E] pl-4 sm:pl-5 space-y-1">
                  <span className="text-[11px] tracking-wider text-[#FF9D2E] font-medium block">
                    Visi Perseroan
                  </span>
                  <blockquote className="font-serif italic text-lg sm:text-xl text-[#102D52] font-normal leading-relaxed">
                    &ldquo;Perusahaan properti yang berkualitas dan terpercaya.&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION: JAJARAN PIMPINAN & STRUKTUR MANAJEMEN (#pimpinan) */}
        {/* Placed prominently on homepage as requested by user       */}
        {/* Editorial styling with DM Serif Display & DM Sans         */}
        {/* ========================================================= */}
        <section id="pimpinan" className="py-16 sm:py-24 bg-[#F4F7FC] border-b border-[#DCE7F5] scroll-mt-16">
          <div className="container-editorial">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 reveal-on-scroll">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>Struktur Kepemimpinan</span>
                </div>
                <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                  Dewan Komisaris &amp; Direksi Perseroan
                </h2>
                <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] mt-2.5 leading-relaxed">
                  Dikelola oleh pengurus resmi yang tercantum dalam Akta Notaris &amp; SK Kemenkumham RI, serta jajaran manajemen profesional yang berdedikasi membangun kawasan perumahan berkualitas di Lampung.
                </p>
              </div>

              <div className="self-start sm:self-end">
                <Link
                  href="/pimpinan"
                  prefetch={false}
                  className="group inline-flex items-center gap-2 text-xs font-semibold tracking-normal text-[#073B78] hover:text-[#FF9D2E] transition-colors"
                >
                  <span>Lihat Seluruh Struktur Organisasi</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Primary Leadership Duo: Dewan Komisaris & Direktur Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto mb-14 sm:mb-18">
              {displayPrimaryLeaders.map((member, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl bg-white border border-[#DCE7F5] overflow-hidden flex flex-col transition-all duration-300 hover:border-[#073B78] shadow-sm hover:shadow-md reveal-on-scroll delay-100 interactive-card"
                >
                  {/* Executive Portrait Frame */}
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[#073B78] overflow-hidden">
                    {member.image && member.image.trim() !== '' ? (
                      <>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#102D52]/95 via-[#102D52]/50 to-transparent pointer-events-none" />
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

                    {/* Responsive Badges Header (Role & Legal Verified) */}
                    <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-10 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
                      <div className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#102D52]/90 backdrop-blur-md border border-[#FF9D2E]/60 text-[#FF9D2E] text-[10px] sm:text-[11px] font-medium tracking-wide shadow-sm pointer-events-auto">
                        <span>{member.role}</span>
                      </div>
                      <div className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#102D52]/90 backdrop-blur-md text-[#15966A] text-[10px] sm:text-[11px] font-medium border border-[#15966A]/40 flex items-center gap-1 shadow-sm pointer-events-auto">
                        <CheckCircle2 className="w-3 h-3 text-[#15966A]" />
                        <span>SK Kemenkumham</span>
                      </div>
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
                      <p className="font-sans text-xs sm:text-[13.5px] text-[#526783] leading-relaxed">
                        {member.roleDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#DCE7F5] flex items-center justify-between text-[11px] text-[#526783]">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#073B78] shrink-0" />
                        <span>Akta Notaris {content.legal?.aktaNumber || 'No. 10'}</span>
                      </div>
                      <span className="font-mono text-[#526783]">{content.legal?.aktaDate || '18 Maret 2021'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-section: Operational Division Heads */}
            {displayOperationalLeaders.length > 0 && (
              <div className="space-y-6 pt-2">
                <div className="border-t border-[#DCE7F5] pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-medium tracking-wide text-[#FF9D2E] uppercase block mb-1">
                      Manajemen Lapangan &amp; Pelayanan
                    </span>
                    <h3 className="font-serif font-normal text-2xl text-[#102D52]">
                      Kepala Divisi &amp; Pelaksana Teknis
                    </h3>
                  </div>
                  <p className="text-xs text-[#526783] max-w-md sm:text-right">
                    Memastikan kelancaran proses verifikasi KPR FLPP, pengawasan fisik konstruksi, dan sertifikasi tanah secara tepat waktu.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {displayOperationalLeaders.map((member, idx) => (
                    <div
                      key={idx}
                      className="group rounded-2xl bg-white border border-[#DCE7F5] p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#073B78] hover:-translate-y-1 shadow-sm hover:shadow-md reveal-on-scroll interactive-card"
                    >
                      <div className="space-y-4">
                        <div className="relative w-full aspect-square rounded-xl bg-[#073B78] overflow-hidden flex items-center justify-center">
                          {member.image && member.image.trim() !== '' ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center p-4">
                              <Building2 className="w-8 h-8 text-[#FF9D2E] mb-1" />
                              <span className="text-xs text-white/80 font-medium">PT. TBK</span>
                            </div>
                          )}

                          {member.department && (
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#102D52]/90 backdrop-blur-md border border-white/15 text-[#FF9D2E] text-[9.5px] font-semibold tracking-wide">
                              {member.department}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-[#FF9D2E] block mb-1">
                            {member.role}
                          </span>
                          <h4 className="font-sans font-bold text-[15px] text-[#102D52] leading-snug">
                            {member.name}
                          </h4>
                        </div>

                        <p className="text-xs text-[#526783] leading-relaxed line-clamp-3">
                          {member.roleDescription}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#DCE7F5] flex items-center justify-between text-[11px] text-[#526783]">
                        <span className="font-semibold text-[#102D52]">PT. TBK Lampung</span>
                        <span className="text-[#15966A] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Berwenang</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION C: BUYING PROCESS (Alur Kepemilikan)              */}
        {/* Background: Clean White #FFFFFF                          */}
        {/* ========================================================= */}
        <section id="alur-pembelian" className="py-16 sm:py-24 bg-white border-b border-[#DCE7F5] scroll-mt-16">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12 sm:mb-16 reveal-on-scroll">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>{content.buyingProcess?.badge || 'Panduan Konsumen'}</span>
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                {content.buyingProcess?.title || 'Tahapan Pembelian Rumah Subsidi'}
              </h2>
              <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] mt-2.5 leading-relaxed">
                {content.buyingProcess?.subtitle || 'Alur pengajuan yang transparan dan terstruktur bagi masyarakat, dari pemilihan kavling hingga serah terima kunci.'}
              </p>
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
                <div className="relative pt-2">
                  <div
                    className="hidden md:block absolute top-[24px] left-[5%] right-[5%] h-[2px] bg-[#DCE7F5] z-0"
                    aria-hidden="true"
                  />

                  <ol className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10 relative z-10 pl-6 md:pl-0 border-l-2 border-[#DCE7F5] md:border-l-0 ml-2 md:ml-0">
                    {steps.map((item, idx) => (
                      <li key={idx} className={`relative flex flex-col justify-between reveal-on-scroll ${item.delayClass}`}>
                        <span
                          className="md:hidden absolute -left-[32px] top-1 w-4 h-4 rounded-full bg-white border-4 border-[#FF9D2E]"
                          aria-hidden="true"
                        />

                        <div>
                          <div className="hidden md:flex items-center gap-3 mb-4">
                            <span className="w-4 h-4 rounded-full bg-white border-4 border-[#FF9D2E] shrink-0" aria-hidden="true" />
                            <span className="font-serif text-3xl lg:text-4xl text-[#073B78] leading-none">{item.step}</span>
                          </div>

                          <span className="md:hidden font-serif text-2xl text-[#073B78] block mb-1">{item.step}</span>

                          <h3 className="font-semibold text-[16px] text-[#102D52] tracking-normal mb-2">
                            {item.title}
                          </h3>
                          <p className="text-xs lg:text-[13px] text-[#526783] leading-relaxed mb-3">
                            {item.desc}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-[#DCE7F5] text-[11.5px] text-[#073B78] font-semibold">
                          {item.highlight}
                        </div>
                      </li>
                    ))}
                  </ol>
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
              const activitiesList = content.activities?.items?.slice(0, 4) || [
                {
                  title: 'Perataan Tanah & Akses Jalan',
                  description: 'Dokumentasi riil pekerjaan cut and fill perataan kontur lahan dan pembukaan akses jalan utama perumahan.',
                  image: '/assets/service-construction.jpg',
                  tag: 'Tahap 1 • Lapangan',
                  delayClass: 'delay-100',
                },
                {
                  title: 'Pengukuran & Pematokan Kavling',
                  description: 'Dokumentasi riil pengukuran presisi batas-batas tanah dan pematokan kavling unit hunian sesuai master plan.',
                  image: '/assets/service-residential.jpg',
                  tag: 'Tahap 2 • Lapangan',
                  delayClass: 'delay-200',
                },
                {
                  title: 'Pondasi & Struktur Bangunan',
                  description: 'Dokumentasi riil pekerjaan konstruksi pondasi batu belah dan penegakan struktur dinding bata.',
                  image: '/assets/service-interior.jpg',
                  tag: 'Tahap 3 • Lapangan',
                  delayClass: 'delay-300',
                },
                {
                  title: 'Infrastruktur Lingkungan',
                  description: 'Dokumentasi riil pembangunan saluran drainase dan pengerasan jalan lingkungan kawasan.',
                  image: '/assets/project-coastal.jpg',
                  tag: 'Tahap 4 • Lapangan',
                  delayClass: 'delay-400',
                },
              ];

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

        {/* ========================================================= */}
        {/* SECTION G: CONTACT & INQUIRY FORM                         */}
        {/* Clean White Background, Direct WhatsApp Access, Valid Form */}
        {/* ========================================================= */}
        <section id="kontak" className="py-16 sm:py-24 bg-white">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12 sm:mb-16 reveal-on-scroll">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Hubungi Kami</span>
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#102D52] leading-tight">
                Konsultasi &amp; Layanan Informasi
              </h2>
              <p className="font-sans text-[15px] sm:text-[16px] text-[#526783] mt-2.5 leading-relaxed">
                Tim pemasaran resmi PT. Terbang Bersama Kawan siap memberikan informasi ketersediaan unit, tahapan berkas, dan pendampingan survei lokasi.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Direct Coordinates */}
              <div className="lg:col-span-5 space-y-6 reveal-left-on-scroll delay-100">
                <div className="p-6 rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] shadow-sm space-y-5 interactive-card">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F1FC] text-[#073B78] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium tracking-wide text-[#FF9D2E] block">
                        Alamat Kantor Pemasaran
                      </span>
                      <p className="text-xs sm:text-[13.5px] text-[#102D52] font-semibold leading-relaxed mt-0.5">
                        {content.contact?.address || 'Bandar Lampung, Provinsi Lampung, Indonesia'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-[#DCE7F5]">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F7F3] text-[#15966A] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium tracking-wide text-[#FF9D2E] block">
                        WhatsApp &amp; Telepon
                      </span>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-[13.5px] text-[#102D52] font-semibold hover:text-[#073B78] transition-colors block mt-0.5"
                      >
                        {content.contact?.whatsapp || '0812-7890-1234'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-[#DCE7F5]">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] text-[#FF9D2E] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium tracking-wide text-[#FF9D2E] block">
                        Email Resmi
                      </span>
                      <a
                        href={`mailto:${content.contact?.email || 'kontak@terbangbersamakawan.co.id'}`}
                        className="text-xs sm:text-[13.5px] text-[#102D52] font-semibold hover:text-[#073B78] transition-colors block mt-0.5"
                      >
                        {content.contact?.email || 'kontak@terbangbersamakawan.co.id'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-[#DCE7F5]">
                    <div className="w-10 h-10 rounded-xl bg-[#F0EBFC] text-[#7C3AED] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium tracking-wide text-[#FF9D2E] block">
                        Jam Layanan Kantor
                      </span>
                      <p className="text-xs sm:text-[13.5px] text-[#102D52] font-medium mt-0.5">
                        {content.contact?.operatingHours || 'Senin - Sabtu: 08:00 - 17:00 WIB'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Callout Button */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-btn w-full min-h-[50px] px-6 rounded-2xl bg-[#15966A] hover:bg-[#12805A] text-white font-semibold text-xs sm:text-[13px] tracking-normal flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat WhatsApp Tim Pemasaran</span>
                </a>
              </div>

              {/* Right Column: Inquiry Consultation Form */}
              <div className="lg:col-span-7 bg-[#F4F7FC] p-6 sm:p-9 rounded-2xl border border-[#DCE7F5] shadow-sm reveal-right-on-scroll delay-200 interactive-card">
                <h3 className="font-serif font-normal text-xl sm:text-2xl text-[#102D52] mb-1">
                  Kirim Formulir Konsultasi
                </h3>
                <p className="font-sans text-xs sm:text-[13.5px] text-[#526783] mb-6">
                  Silakan isi informasi di bawah ini. Tim kami akan segera merespons via WhatsApp atau telepon.
                </p>

                {formSuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-[#E6F7F3] border border-[#15966A]/30 text-[#15966A] text-xs sm:text-[13.5px] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Terima kasih! WhatsApp sedang terbuka untuk mengirim rincian konsultasi Anda.</span>
                  </div>
                )}

                {formError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-[13.5px] font-semibold flex items-center gap-2">
                    <X className="w-5 h-5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#102D52] mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCE7F5] text-xs sm:text-[13.5px] text-[#102D52] placeholder-[#526783]/60 focus:outline-none focus:ring-2 focus:ring-[#FF9D2E] focus:border-transparent transition-all font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#102D52] mb-1.5">
                        Nomor WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCE7F5] text-xs sm:text-[13.5px] text-[#102D52] placeholder-[#526783]/60 focus:outline-none focus:ring-2 focus:ring-[#FF9D2E] focus:border-transparent transition-all font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#102D52] mb-1.5">
                        Alamat Email (Opsional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCE7F5] text-xs sm:text-[13.5px] text-[#102D52] placeholder-[#526783]/60 focus:outline-none focus:ring-2 focus:ring-[#FF9D2E] focus:border-transparent transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#102D52] mb-1.5">
                      Pesan atau Pertanyaan
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pertanyaan seputar kavling, berkas KPR subsidi, atau jadwal survei..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCE7F5] text-xs sm:text-[13.5px] text-[#102D52] placeholder-[#526783]/60 focus:outline-none focus:ring-2 focus:ring-[#FF9D2E] focus:border-transparent transition-all resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="interactive-btn w-full h-[48px] rounded-full bg-[#073B78] hover:bg-[#102D52] text-white text-xs font-semibold tracking-normal flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <span>{formSubmitting ? 'Mengirim...' : 'Kirim & Lanjutkan ke WhatsApp'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer content={content} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp content={content} />

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
    </div>
  );
}
