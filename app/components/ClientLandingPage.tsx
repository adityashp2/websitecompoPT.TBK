'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
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
import PartnersCarousel from './PartnersCarousel';
import {
  HeaderHousesIllustration,
  Step1ConsultationIllustration,
  Step2DocumentIllustration,
  Step3BankIllustration,
  Step4HandshakeIllustration,
} from './BuyingProcessIllustrations';
import PromoPopupModal from './PromoPopupModal';
import type { LookbookItem } from './LookbookModal';
import { SiteContent, initialSiteContent, upgradeGoogleImageUrl } from '@/lib/initialData';

const LookbookModal = dynamic(() => import('./LookbookModal'), { ssr: false });

function getFeatureIcon(iconName?: string) {
  switch ((iconName || '').toLowerCase()) {
    case 'shield':
    case 'harga':
    case 'keamanan':
      return <ShieldCheck className="w-5 h-5 stroke-[1.5]" />;
    case 'map':
    case 'lokasi':
      return <MapPin className="w-5 h-5 stroke-[1.5]" />;
    case 'leaf':
    case 'lingkungan':
    case 'asri':
      return <Leaf className="w-5 h-5 stroke-[1.5]" />;
    case 'building':
      return <Building2 className="w-5 h-5 stroke-[1.5]" />;
    case 'wallet':
      return <Wallet className="w-5 h-5 stroke-[1.5]" />;
    case 'tree':
      return <TreePine className="w-5 h-5 stroke-[1.5]" />;
    case 'home':
    case 'hunian':
    default:
      return <Home className="w-5 h-5 stroke-[1.5]" />;
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
    fetch('/api/content', { cache: 'no-store' })
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
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30) {
        setTimeout(() => {
          el.classList.add('is-revealed');
        }, 80);
      } else {
        observer.observe(el);
      }
    });

    const timer = setTimeout(() => {
      elements.forEach((el) => el.classList.add('is-revealed'));
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
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

  // Auto slideshow for project photos (4.5s interval)
  useEffect(() => {
    if (activeProjectSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
    }, 4500);
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
  const kprRate = kprAnnualRate / 12;
  const kprMonths = kprTenor * 12;
  const kprAngsuran = Math.round(
    (kprPokok * (kprRate * Math.pow(1 + kprRate, kprMonths))) / (Math.pow(1 + kprRate, kprMonths) - 1)
  );
  const kprPerHari = Math.round(kprAngsuran / 30);

  const rawWaClean = (content.contact?.whatsapp || '').replace(/[^0-9]/g, '');
  const hasWa = rawWaClean.length >= 7;
  const whatsappNumber = hasWa ? rawWaClean : '';
  const waUrl = hasWa
    ? (whatsappNumber.startsWith('0')
      ? `https://wa.me/62${whatsappNumber.slice(1)}`
      : `https://wa.me/${whatsappNumber}`)
    : '';

  // Leadership Data
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
  const displayOperationalLeaders = operationalLeaders.length > 0 ? operationalLeaders : rawLeadershipMembers.slice(2);

  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] font-serif antialiased selection:bg-white selection:text-black" suppressHydrationWarning>
      {/* 1. Header (Austere Luxury Top Nav) */}
      <Header content={content} />

      <main id="main-content" suppressHydrationWarning>
        <h1 className="sr-only">
          PT. Terbang Bersama Kawan (PT. TBK) - Pengembang Perumahan Subsidi Berkualitas Puri Gunung Langgar Lampung
        </h1>

        {/* 2. Hero Photographic Band */}
        <div className="w-full pt-[56px] sm:pt-[64px]" suppressHydrationWarning>
          <PromoBannerCarousel slides={content.bannerSlides} whatsappUrl={waUrl} />
        </div>

        {/* ========================================================= */}
        {/* STATISTIK & REKAM JEJAK PERSEROAN (Bugatti Spec Row)       */}
        {/* ========================================================= */}
        {(() => {
          const statsList = Array.isArray(content.hero?.stats) && content.hero.stats.length > 0
            ? content.hero.stats
            : [
                { label: "DOMISILI RESMI", value: "BANDAR LAMPUNG" },
                { label: "PENGESAHAN KEMENKUMHAM", value: "2021" },
                { label: "PROYEK UTAMA", value: "PURI GUNUNG LANGGAR" },
                { label: "STANDAR TEKNIS", value: "HUNIAN BERSUBSIDI PUPR" },
              ];

          return (
            <section aria-label="Statistik Utama Perseroan" className="w-full bg-[#000000] border-b border-[#262626]">
              <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#262626] py-8 sm:py-10">
                  {statsList.map((st, sIdx) => (
                    <div key={sIdx} className="px-4 sm:px-8 py-4 sm:py-2 flex flex-col justify-center">
                      <span className="font-display font-normal text-2xl sm:text-3xl lg:text-4xl text-white tracking-[2px] uppercase">
                        {st.value}
                      </span>
                      <span className="font-mono text-[10.5px] sm:text-xs text-[#999999] tracking-[2px] uppercase mt-1.5">
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
        {/* ======================================================================= */}
        <section id="tentang-ringkas" className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Headline & Editorial Mission */}
              <div className="lg:col-span-5 space-y-6 reveal-left-on-scroll">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-white/40" />
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999]">
                    {content.about?.homeIntroBadge || 'TENTANG KAMI'}
                  </span>
                </div>

                <h2 className="font-display font-normal text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[3px] leading-[1.1]">
                  {content.about?.homeIntroTitle || 'MEMBANGUN RUMAH,'}<br />
                  <span className="text-white/80">{content.about?.homeIntroHighlight || 'MEWUJUDKAN MASA DEPAN.'}</span>
                </h2>

                <p className="font-serif text-[16px] text-[#cccccc] leading-relaxed">
                  {content.about?.homeIntroText || 'Kami hadir untuk menyediakan hunian berkualitas dengan harga terjangkau, khususnya bagi keluarga Indonesia. Dengan pengalaman dan komitmen tinggi, PT. Terbang Bersama Kawan terus berinovasi dalam menghadirkan lingkungan yang nyaman, aman, dan berkelanjutan.'}
                </p>

                <div className="pt-2">
                  <Link
                    href={content.about?.homeIntroCtaLink || '/tentang'}
                    className="btn-bugatti-primary"
                  >
                    <span>{content.about?.homeIntroCtaText || 'KENAL LEBIH DEKAT'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: 2x2 Feature Cards Grid (0px radius, #141414 surface) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 reveal-right-on-scroll delay-100">
                {(Array.isArray(content.about?.features)
                  ? content.about.features
                  : [
                      { title: 'Hunian Berkualitas', desc: 'Rumah tapak kokoh dengan infrastruktur dan sanitasi terencana.', icon: 'home' },
                      { title: 'Harga Terjangkau', desc: 'Skema subsidi FLPP pemerintah dengan angsuran flat.', icon: 'shield' },
                      { title: 'Lokasi Strategis', desc: 'Akses cepat menuju jalan poros utama dan pusat kota.', icon: 'map' },
                      { title: 'Lingkungan Asri', desc: 'Kawasan tertata dengan ruang terbuka hijau dan udara segar.', icon: 'leaf' },
                    ]
                ).map((card, idx) => (
                  <div
                    key={idx}
                    className="card-bugatti p-6 sm:p-8 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 border border-[#262626] group-hover:border-white rounded-full flex items-center justify-center text-white transition-colors">
                        {getFeatureIcon(card.icon)}
                      </div>
                      <span className="font-mono text-[11px] tracking-[2px] uppercase text-[#666666]">
                        0{idx + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-normal text-lg sm:text-xl text-white uppercase tracking-[1.5px]">
                        {card.title}
                      </h3>
                      <p className="font-serif text-sm text-[#999999] mt-2 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* OUR PARTNERS: CAROUSEL                                    */}
        {/* ========================================================= */}
        <PartnersCarousel partners={content.partners} />

        {/* ========================================================= */}
        {/* SECTION 2: PROJECT HIGHLIGHT (Puri Gunung Langgar)        */}
        {/* ========================================================= */}
        <section id="proyek" className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial">
            {/* Section Header */}
            <div className="max-w-2xl mb-12 sm:mb-16 reveal-on-scroll">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-[1px] bg-white/40" />
                <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999]">
                  PROYEK UNGGULAN
                </span>
              </div>
              <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                Puri Gunung Langgar
              </h2>
              <p className="font-serif text-base sm:text-lg text-[#cccccc] mt-3 leading-relaxed">
                Kawasan perumahan subsidi terencana di Tanjung Bintang, Lampung Selatan. Menghadirkan rumah tapak berkualitas dengan kepastian legalitas dan lingkungan yang asri.
              </p>
            </div>

            {/* Showcase: Photo Gallery Left, Spec Sheet Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Media Gallery Viewer */}
              <div className="lg:col-span-7 flex flex-col space-y-4 reveal-left-on-scroll delay-100">
                {activeProjectSlides.length > 0 ? (
                  <div
                    className="relative w-full aspect-[16/10] bg-[#141414] border border-[#262626] rounded-none overflow-hidden select-none group"
                    onTouchStart={handleGalleryTouchStart}
                    onTouchEnd={handleGalleryTouchEnd}
                  >
                    {activeProjectSlides.map((slide, sIdx) => {
                      const isActive = sIdx === currentProjectSlide;
                      const cleanImg = upgradeGoogleImageUrl(slide.image);
                      return (
                        <div
                          key={sIdx}
                          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        >
                          <img
                            src={cleanImg}
                            alt={slide.caption || 'Foto Proyek'}
                            style={{
                              objectFit: 'cover',
                              objectPosition: `${(slide as any).imageOffsetX !== undefined ? (slide as any).imageOffsetX : 50}% ${(slide as any).imageOffsetY !== undefined ? (slide as any).imageOffsetY : 50}%`,
                            }}
                            onClick={() => {
                              const projectLookbookItems: LookbookItem[] = activeProjectSlides.map((s, idx) => ({
                                image: upgradeGoogleImageUrl(s.image),
                                title: s.caption || `${content.project?.name || 'Puri Gunung Langgar'} - Dokumentasi Foto`,
                                description: `Dokumentasi visual proyek ${content.project?.name || 'Puri Gunung Langgar'} oleh PT. Terbang Bersama Kawan.`,
                                tag: `Dokumentasi 0${idx + 1}`,
                                category: 'Galeri Proyek',
                              }));
                              setLightbox({
                                open: true,
                                currentIndex: sIdx,
                                items: projectLookbookItems,
                              });
                            }}
                            className="w-full h-full cursor-pointer filter brightness-90 hover:brightness-100 transition-all duration-500"
                            loading="lazy"
                          />
                        </div>
                      );
                    })}

                    {/* Navigation Controls */}
                    {activeProjectSlides.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentProjectSlide((prev) => (prev - 1 + activeProjectSlides.length) % activeProjectSlides.length);
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#262626] bg-[#000000]/70 hover:border-white text-white flex items-center justify-center transition-colors"
                          aria-label="Foto sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentProjectSlide((prev) => (prev + 1) % activeProjectSlides.length);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#262626] bg-[#000000]/70 hover:border-white text-white flex items-center justify-center transition-colors"
                          aria-label="Foto selanjutnya"
                        >
                          <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </>
                    )}

                    {/* Maximize Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const projectLookbookItems: LookbookItem[] = activeProjectSlides.map((s, idx) => ({
                          image: upgradeGoogleImageUrl(s.image),
                          title: s.caption || `${content.project?.name || 'Puri Gunung Langgar'} - Dokumentasi Foto`,
                          description: `Dokumentasi visual proyek ${content.project?.name || 'Puri Gunung Langgar'}.`,
                          tag: `Dokumentasi 0${idx + 1}`,
                          category: 'Galeri Proyek',
                        }));
                        setLightbox({
                          open: true,
                          currentIndex: currentProjectSlide,
                          items: projectLookbookItems,
                        });
                      }}
                      className="absolute top-3 right-3 z-30 font-mono text-[10px] tracking-[2px] uppercase bg-black/70 hover:bg-black text-white px-3 py-1.5 border border-[#262626] hover:border-white flex items-center gap-1.5 transition-colors"
                      aria-label="Perbesar foto"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>PERBESAR</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-[360px] flex flex-col items-center justify-center p-8 bg-[#141414] border border-[#262626] text-center">
                    <Building2 className="w-10 h-10 text-[#666666] mb-3" />
                    <h3 className="font-display uppercase tracking-[2px] text-lg text-white">Dokumentasi Proyek</h3>
                    <p className="font-serif text-sm text-[#999999] mt-1">Sedang diperbarui oleh tim pengembang.</p>
                  </div>
                )}

                {/* Caption & Counter */}
                <div className="flex items-center justify-between font-mono text-[11px] tracking-[2px] uppercase text-[#999999] pt-1">
                  <span>{activeProjectSlides[currentProjectSlide]?.caption || 'Kawasan Puri Gunung Langgar'}</span>
                  <span>0{currentProjectSlide + 1} / 0{activeProjectSlides.length}</span>
                </div>
              </div>

              {/* Right Column: Spec Sheet Card (Bugatti Spec Cells) */}
              <div className="lg:col-span-5 card-bugatti p-6 sm:p-8 flex flex-col justify-between reveal-right-on-scroll delay-200">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#999999] block">KATEGORI PROYEK</span>
                      <span className="font-display uppercase tracking-[2px] text-xl text-white">Hunian Bersubsidi</span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[2px] px-2.5 py-1 border border-[#262626] text-white">
                      OPERASIONAL
                    </span>
                  </div>

                  {/* Spec Cells */}
                  <dl className="py-2 divide-y divide-[#262626]">
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">Lokasi</dt>
                      <dd className="font-serif text-white text-right text-sm">Tanjung Bintang, Lampung Selatan</dd>
                    </div>
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">Tipe Unit</dt>
                      <dd className="font-display uppercase tracking-[1.5px] text-base text-white">Tipe 36 / 72 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">Luas Bangunan</dt>
                      <dd className="font-mono text-xs uppercase text-white">36 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">Luas Lahan</dt>
                      <dd className="font-mono text-xs uppercase text-white">72 m²</dd>
                    </div>
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">Legalitas</dt>
                      <dd className="font-serif text-white">Sertifikat Hak Milik (SHM)</dd>
                    </div>
                    <div className="flex items-baseline justify-between py-3">
                      <dt className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">Pembiayaan</dt>
                      <dd className="font-mono text-xs uppercase tracking-[1px] text-[#c3d9f3]">KPR FLPP 5% FLAT</dd>
                    </div>
                  </dl>
                </div>

                <div className="pt-6 border-t border-[#262626] space-y-3">
                  <Link
                    href="/proyek"
                    className="w-full btn-bugatti-primary justify-center"
                  >
                    <span>DETAIL SPESIFIKASI PROYEK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {hasWa && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-bugatti-primary justify-center border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>KONSULTASI KETERSEDIAAN UNIT</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: CORPORATE IDENTITY & PILLARS                   */}
        {/* ========================================================= */}
        <section id="tentang" className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Heading & 3 Pillars */}
              <div className="lg:col-span-7 space-y-6 reveal-left-on-scroll">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-white/40" />
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999]">
                    PROFIL PENGEMBANG
                  </span>
                </div>

                <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white leading-tight">
                  Membangun dengan Komitmen &amp; Legalitas Nyata
                </h2>

                <p className="font-serif text-[16px] text-[#cccccc] leading-relaxed">
                  PT. Terbang Bersama Kawan (PT. TBK) adalah badan usaha pengembang properti berdomisili di Bandar Lampung. Didirikan secara sah dengan Akta Notaris No. 10 tanggal 18 Maret 2021 dan disahkan oleh Kementerian Hukum dan HAM RI pada 19 Maret 2021.
                </p>

                {/* 3 Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#262626]">
                  <div>
                    <span className="font-display text-3xl text-white tracking-[2px] block mb-2">
                      01
                    </span>
                    <h3 className="font-display font-normal text-base text-white tracking-[1.5px] uppercase mb-1.5">
                      Kepastian Hukum
                    </h3>
                    <p className="font-serif text-sm text-[#999999] leading-relaxed">
                      Sertifikat Hak Milik (SHM) dan perseroan berizin resmi Kemenkumham RI.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-[#262626] sm:pl-8">
                    <span className="font-display text-3xl text-white tracking-[2px] block mb-2">
                      02
                    </span>
                    <h3 className="font-display font-normal text-base text-white tracking-[1.5px] uppercase mb-1.5">
                      Mutu Konstruksi
                    </h3>
                    <p className="font-serif text-sm text-[#999999] leading-relaxed">
                      Standar teknis bangunan kokoh berpedoman pada spesifikasi kelayakan PUPR.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-[#262626] sm:pl-8">
                    <span className="font-display text-3xl text-white tracking-[2px] block mb-2">
                      03
                    </span>
                    <h3 className="font-display font-normal text-base text-white tracking-[1.5px] uppercase mb-1.5">
                      Fasilitas KPR
                    </h3>
                    <p className="font-serif text-sm text-[#999999] leading-relaxed">
                      Didukung kemitraan perbankan BUMN untuk penyaluran skema FLPP bunga 5% tetap.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/tentang"
                    className="font-mono text-xs tracking-[2px] uppercase text-[#c3d9f3] hover:text-white inline-flex items-center gap-2 transition-colors"
                  >
                    <span>BACA PROFIL LENGKAP PERSEROAN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Office Photography & Vision Quote */}
              <div className="lg:col-span-5 space-y-6 reveal-right-on-scroll delay-150">
                {content.about?.officeImage && content.about.officeImage.trim() !== '' && (
                  <div className="relative aspect-[4/3] border border-[#262626] bg-[#141414] overflow-hidden">
                    <img
                      src={content.about.officeImage}
                      alt={content.about.officeCaption || 'Kantor Pusat PT. TBK'}
                      className="w-full h-full object-cover filter brightness-90"
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 left-4 right-4 font-mono text-[10px] tracking-[2px] uppercase text-white/80">
                      {content.about.officeCaption || 'KANTOR PUSAT BANDAR LAMPUNG'}
                    </div>
                  </div>
                )}

                <div className="p-6 border-l-2 border-white/60 bg-[#141414] border border-[#262626] space-y-2">
                  <span className="font-mono text-[10px] tracking-[2px] uppercase text-[#999999] block">
                    VISI PERSEROAN
                  </span>
                  <blockquote className="font-serif italic text-lg sm:text-xl text-white font-normal leading-relaxed">
                    &ldquo;{content.about?.visionText || 'Menjadi pengembang perumahan bersubsidi terpercaya yang konsisten menghadirkan hunian berkualitas dan berdaya guna bagi masyarakat.'}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: LEADERSHIP                                     */}
        {/* ========================================================= */}
        <section id="pimpinan" className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626] scroll-mt-16">
          <div className="container-editorial">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 reveal-on-scroll">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-[1px] bg-white/40" />
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999]">
                    STRUKTUR PENGURUS RESMI
                  </span>
                </div>
                <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                  Dewan Komisaris &amp; Direksi
                </h2>
                <p className="font-serif text-base sm:text-lg text-[#cccccc] mt-3 leading-relaxed">
                  Pengurus resmi yang disahkan dalam Akta Notaris &amp; SK Kemenkumham RI untuk menjamin tata kelola profesional dan kepastian hukum konsumen.
                </p>
              </div>

              <div className="self-start sm:self-end shrink-0">
                <Link
                  href="/pimpinan"
                  className="btn-bugatti-primary text-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>STRUKTUR LENGKAP</span>
                </Link>
              </div>
            </div>

            {/* Primary Leadership Duo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {displayPrimaryLeaders.map((member, idx) => (
                <div
                  key={idx}
                  className="card-bugatti overflow-hidden flex flex-col group reveal-on-scroll"
                >
                  <div className="relative w-full aspect-[4/5] bg-[#141414] overflow-hidden">
                    {member.image && member.image.trim() !== '' ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <Building2 className="w-10 h-10 text-[#666666] mb-2" />
                        <span className="font-mono text-xs uppercase tracking-[2px] text-[#999999]">Portret Resmi</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 bg-black/80 border border-[#262626] text-white">
                      {member.role}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <span className="font-mono text-[10px] tracking-[2px] uppercase text-[#999999] block mb-1">
                        {member.department || 'PENGURUS INTI'}
                      </span>
                      <h3 className="font-display font-normal text-2xl uppercase tracking-[2px] text-white">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between space-y-4">
                    <p className="font-serif text-sm text-[#cccccc] leading-relaxed">
                      {member.roleDescription}
                    </p>
                    <div className="pt-3 border-t border-[#262626] flex items-center justify-between font-mono text-[10.5px] tracking-[1.5px] uppercase text-[#666666]">
                      <span>AKTA NOTARIS NO. 10</span>
                      <span>PT. TBK</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Management Team */}
            {displayOperationalLeaders.length > 0 && (
              <div className="border-t border-[#262626] pt-16">
                <div className="max-w-2xl mb-10">
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">PELAKSANA TEKNIS</span>
                  <h3 className="font-display font-normal text-2xl sm:text-3xl uppercase tracking-[2px] text-white">
                    Manajemen Operasional &amp; Lapangan
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayOperationalLeaders.map((op, idx) => (
                    <div
                      key={idx}
                      className="card-bugatti overflow-hidden flex flex-col group"
                    >
                      <div className="relative w-full aspect-[4/5] bg-[#141414] overflow-hidden">
                        {op.image && op.image.trim() !== '' ? (
                          <img
                            src={op.image}
                            alt={op.name}
                            className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#666666]">
                            Foto Profil
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999999] block">
                            {op.department || 'MANAJEMEN'}
                          </span>
                          <span className="font-display font-normal text-lg tracking-[1.5px] uppercase block truncate text-white">
                            {op.name}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-mono text-[11px] tracking-[1px] uppercase text-[#c3d9f3] mb-1">
                            {op.role}
                          </div>
                          <p className="font-serif text-xs text-[#999999] leading-relaxed line-clamp-3">
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
        {/* SECTION 5: BUYING PROCESS                                 */}
        {/* ========================================================= */}
        <section id="alur-pembelian" className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626] scroll-mt-16">
          <div className="max-w-4xl mx-auto px-6 sm:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
              <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                PANDUAN KONSUMEN
              </span>
              <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                Tahapan Pembelian Rumah
              </h2>
              <p className="font-serif text-base text-[#cccccc] mt-3 leading-relaxed">
                Alur pengajuan yang terstruktur dan transparan bagi masyarakat dari penentuan kavling hingga serah terima kunci.
              </p>
            </div>

            {(() => {
              const defaultSteps = [
                {
                  step: '01',
                  title: 'PILIH KAVLING & KONSULTASI',
                  desc: 'Kunjungi kantor pemasaran atau lokasi proyek untuk memilih kavling yang tersedia dan verifikasi syarat subsidi KPR.',
                  highlight: 'SURVEI KAVLING LANGSUNG',
                },
                {
                  step: '02',
                  title: 'PEMBERKASAN DOKUMEN',
                  desc: 'Menyiapkan berkas identitas dan penghasilan (KTP, KK, NPWP, Slip Gaji/Keterangan Usaha) untuk verifikasi FLPP.',
                  highlight: 'DIDAMPINGI TIM PENGEMBANG',
                },
                {
                  step: '03',
                  title: 'ANALISIS & PERSETUJUAN BANK',
                  desc: 'Proses persetujuan kredit oleh bank mitra penyalur KPR subsidi dengan suku bunga anuitas 5% tetap pemerintah.',
                  highlight: 'KEPASTIAN PLAFON KPR',
                },
                {
                  step: '04',
                  title: 'AKAD NOTARIS & SERAH TERIMA',
                  desc: 'Penandatanganan akta di hadapan Notaris resmi perseroan dan serah terima kunci fisik unit perumahan.',
                  highlight: 'SERTIFIKAT HAK MILIK (SHM)',
                },
              ];

              const steps = Array.isArray(content.buyingProcess?.steps) && content.buyingProcess.steps.length > 0
                ? content.buyingProcess.steps
                : defaultSteps;

              return (
                <div className="space-y-6">
                  {steps.map((item, idx) => (
                    <div
                      key={idx}
                      className="card-bugatti p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-white/40 transition-colors"
                    >
                      <div className="flex items-start gap-6">
                        <span className="font-display text-4xl sm:text-5xl text-white tracking-[2px] font-normal shrink-0">
                          {item.step || `0${idx + 1}`}
                        </span>
                        <div className="space-y-1.5">
                          <h3 className="font-display font-normal text-xl sm:text-2xl text-white uppercase tracking-[2px]">
                            {item.title}
                          </h3>
                          <p className="font-serif text-sm text-[#cccccc] leading-relaxed max-w-xl">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="self-end sm:self-center font-mono text-[10.5px] tracking-[2px] uppercase px-3 py-1.5 border border-[#262626] text-[#999999] whitespace-nowrap">
                        {item.highlight}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: KPR SIMULATION                                 */}
        {/* ========================================================= */}
        <section id="simulasi-kpr" className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-6 reveal-left-on-scroll">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-white/40" />
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999]">
                    KALKULATOR FINANSIAL
                  </span>
                </div>
                <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white leading-tight">
                  Simulasi Angsuran KPR FLPP
                </h2>
                <p className="font-serif text-base sm:text-lg text-[#cccccc] leading-relaxed">
                  Hitung estimasi angsuran bulanan kepemilikan unit Puri Gunung Langgar melalui skema fasilitas likuiditas pembiayaan perumahan (FLPP) dengan bunga 5% p.a. flat.
                </p>

                <div className="pt-4 space-y-3 font-mono text-xs tracking-[1.5px] uppercase text-[#999999]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>SUKU BUNGA TETAP 5% SAMPAI LUNAS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>BEBAS PPN DAN PREMI ASURANSI BERSUBSIDI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>PILIHAN TENOR FLEKSIBEL HINGGA 20 TAHUN</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculator Card */}
              <div className="lg:col-span-7 card-bugatti p-8 sm:p-10 space-y-8 reveal-right-on-scroll delay-150">
                <div className="space-y-6">
                  {/* Harga Unit */}
                  <div>
                    <div className="flex justify-between items-center font-mono text-xs tracking-[2px] uppercase text-[#999999] mb-3">
                      <span>HARGA RUMAH</span>
                      <span className="text-white text-sm">
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
                      className="w-full accent-white cursor-pointer h-1.5 bg-[#262626] rounded-none"
                    />
                  </div>

                  {/* DP */}
                  <div>
                    <div className="flex justify-between items-center font-mono text-xs tracking-[2px] uppercase text-[#999999] mb-3">
                      <span>UANG MUKA (DP)</span>
                      <span className="text-white text-sm">
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
                      className="w-full accent-white cursor-pointer h-1.5 bg-[#262626] rounded-none"
                    />
                  </div>

                  {/* Tenor */}
                  <div>
                    <div className="font-mono text-xs tracking-[2px] uppercase text-[#999999] mb-3">
                      JANGKA WAKTU PINJAMAN
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[10, 15, 20].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setKprTenor(yr)}
                          className={`py-3 px-4 font-mono text-xs tracking-[2px] uppercase border transition-all ${
                            kprTenor === yr
                              ? 'border-white text-black bg-white'
                              : 'border-[#262626] text-[#999999] hover:border-white hover:text-white bg-transparent'
                          }`}
                        >
                          {yr} TAHUN
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Highlight */}
                <div className="p-6 bg-[#0d0d0d] border border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10.5px] uppercase tracking-[2px] text-[#999999] block mb-1">
                      ESTIMASI ANGSURAN PER BULAN (5% FLAT)
                    </span>
                    <div className="font-display font-normal text-3xl sm:text-4xl text-white tracking-[2px]">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprAngsuran)}
                      <span className="text-xs font-mono text-[#999999] tracking-[1.5px] uppercase"> / BULAN</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[#999999] tracking-[1.5px] uppercase text-left sm:text-right">
                    <div>POKOK: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPokok)}</div>
                    <div>SEKITAR {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPerHari)}/HARI</div>
                  </div>
                </div>

                {/* Action CTA */}
                {hasWa && (
                  <a
                    href={`${waUrl}?text=${encodeURIComponent(
                      `Halo PT. TBK, saya tertarik dengan simulasi KPR Puri Gunung Langgar: Harga Unit Rp ${kprHarga.toLocaleString('id-ID')}, DP Rp ${kprDp.toLocaleString('id-ID')}, Tenor ${kprTenor} Tahun (Angsuran sekitar Rp ${kprAngsuran.toLocaleString('id-ID')}/bln). Mohon info ketersediaan unit dan persyaratannya.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-bugatti-primary justify-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>KONSULTASI SIMULASI INI KE WHATSAPP</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: CONSTRUCTION PROGRESS (Newsroom Article Cards) */}
        {/* ========================================================= */}
        <section id="kegiatan" className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 reveal-on-scroll">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-[1px] bg-white/40" />
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999]">
                    DOKUMENTASI RIIL
                  </span>
                </div>
                <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                  Progres Pekerjaan Lapangan
                </h2>
                <p className="font-serif text-base sm:text-lg text-[#cccccc] mt-3 leading-relaxed">
                  Aktivitas fisik konstruksi kawasan perumahan Puri Gunung Langgar yang dipantau secara transparan dan berkala.
                </p>
              </div>

              <Link
                href="/kegiatan"
                className="btn-bugatti-primary text-xs self-start sm:self-end"
              >
                <span>SEMUA DOKUMENTASI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Photographic 4-grid */}
            {(() => {
              const rawActivities = Array.isArray(content.activities?.items) ? content.activities.items : [];
              const activitiesList = rawActivities.filter((item) => item && (item.title || item.image)).slice(0, 4);

              if (activitiesList.length === 0) {
                return (
                  <div className="card-bugatti p-12 text-center space-y-3">
                    <HardHat className="w-10 h-10 text-[#666666] mx-auto" />
                    <h3 className="font-display uppercase tracking-[2px] text-lg text-white">Dokumentasi Sedang Diperbarui</h3>
                    <p className="font-serif text-sm text-[#999999]">Foto progres lapangan segera diunggah.</p>
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
                      className="card-bugatti overflow-hidden flex flex-col justify-between group cursor-pointer"
                      onClick={() =>
                        setLightbox({
                          open: true,
                          currentIndex: idx,
                          items: activityLookbookItems,
                        })
                      }
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-black/80 font-mono text-[9px] tracking-[2px] uppercase px-2.5 py-1 border border-[#262626] text-white">
                          {item.tag || `TAHAP 0${idx + 1}`}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-display font-normal text-lg uppercase tracking-[1.5px] text-white group-hover:text-white/80 transition-colors">
                          {item.title}
                        </h3>
                        <p className="font-serif text-xs text-[#999999] leading-relaxed line-clamp-2">
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
        {/* SECTION 8: LEGALITAS RESMI                                */}
        {/* ========================================================= */}
        <section id="legalitas" className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-6 reveal-left-on-scroll">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-white/40" />
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999]">
                    KEPASTIAN HUKUM
                  </span>
                </div>
                <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white leading-tight">
                  Legalitas Resmi Perseroan
                </h2>
                <p className="font-serif text-base sm:text-lg text-[#cccccc] leading-relaxed">
                  Setiap unit hunian dan perizinan kawasan PT. Terbang Bersama Kawan berlandaskan kekuatan hukum resmi dan dokumen sah Republik Indonesia.
                </p>

                <div className="pt-2">
                  <Link
                    href="/legalitas"
                    className="btn-bugatti-primary"
                  >
                    <span>PELAJARI DOKUMEN HUKUM</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Legal Certificate Fact Sheet */}
              <div className="lg:col-span-7 card-bugatti p-8 sm:p-10 reveal-right-on-scroll delay-150">
                <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-6 h-6 text-white shrink-0" />
                    <div>
                      <h3 className="font-display uppercase tracking-[2px] text-lg text-white">PT. TERBANG BERSAMA KAWAN</h3>
                      <span className="font-mono text-xs text-[#999999] tracking-[1.5px] uppercase">Terdaftar resmi di Kemenkumham RI</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-white/60 text-white">
                    TERVERIFIKASI
                  </span>
                </div>

                <dl className="divide-y divide-[#262626]">
                  <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <dt className="font-mono text-xs tracking-[2px] uppercase text-[#999999] sm:w-1/3">Akta Notaris</dt>
                    <dd className="font-serif text-white sm:w-2/3 sm:text-right">
                      <span className="font-mono text-sm uppercase text-white block">{content.legal?.aktaNumber || 'No. 10'}</span>
                      <span className="text-xs text-[#999999] mt-0.5 block">Tanggal {content.legal?.aktaDate || '18 Maret 2021'} &bull; Notaris: {content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.'}</span>
                    </dd>
                  </div>

                  <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <dt className="font-mono text-xs tracking-[2px] uppercase text-[#999999] sm:w-1/3">SK Menkumham</dt>
                    <dd className="font-serif text-white sm:w-2/3 sm:text-right">
                      <span className="font-mono text-xs sm:text-sm uppercase text-white block break-all">{content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}</span>
                      <span className="text-xs text-[#999999] mt-0.5 block">Pengesahan Resmi Tanggal {content.legal?.skDate || '19 Maret 2021'}</span>
                    </dd>
                  </div>

                  <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <dt className="font-mono text-xs tracking-[2px] uppercase text-[#999999] sm:w-1/3">Status Hak Tanah</dt>
                    <dd className="font-serif text-white sm:w-2/3 sm:text-right">
                      <span className="font-display uppercase tracking-[1.5px] text-base text-white block">Sertifikat Hak Milik (SHM)</span>
                      <span className="text-xs text-[#999999] mt-0.5 block">Hak milik mutlak dan sah atas nama konsumen</span>
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

      {/* Promotional Pop-up Modal */}
      <PromoPopupModal promo={content.promoPopup} />
    </div>
  );
}
