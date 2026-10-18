'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, MessageCircle, ArrowRight } from 'lucide-react';
import { SiteContent } from '@/lib/initialData';

interface HeaderProps {
  content: SiteContent;
}

interface SearchItem {
  title: string;
  category: string;
  href: string;
  description: string;
  keywords: string[];
}

const SEARCH_DATABASE: SearchItem[] = [
  {
    title: 'Puri Gunung Langgar',
    category: 'Proyek Perumahan',
    href: '/proyek',
    description: 'Perumahan subsidi Type 36/72 di Sabah Balau, Tanjung Bintang, Lampung Selatan.',
    keywords: ['puri', 'gunung', 'langgar', 'proyek', 'rumah', 'subsidi', 'tipe 36', 'tanjung bintang', 'lampung selatan', 'harga', 'shm', 'kavling']
  },
  {
    title: 'Simulasi KPR FLPP 5%',
    category: 'Kalkulator Finansial',
    href: '/simulasi-kpr',
    description: 'Hitung estimasi angsuran bulanan KPR subsidi pemerintah suku bunga tetap 5%.',
    keywords: ['simulasi', 'kpr', 'flpp', 'cicilan', 'angsuran', 'dp', 'uang muka', 'tenor', 'bunga 5%', 'hitung']
  },
  {
    title: 'Profil & Tentang PT. TBK',
    category: 'Tentang Perusahaan',
    href: '/tentang',
    description: 'Sejarah perseroan, visi misi, komitmen mutu, dan nilai tata kelola perusahaan.',
    keywords: ['tentang', 'profil', 'pt tbk', 'terbang bersama kawan', 'visi', 'misi', 'sejarah', 'developer']
  },
  {
    title: 'Dokumentasi & Progres Proyek',
    category: 'Aktivitas Lapangan',
    href: '/kegiatan',
    description: 'Foto dan video progres pembangunan infrastruktur serta unit Puri Gunung Langgar.',
    keywords: ['kegiatan', 'progres', 'lapangan', 'konstruksi', 'foto', 'video', 'dokumentasi', 'infrastruktur']
  },
  {
    title: 'Legalitas & Dokumen Resmi',
    category: 'Kepastian Hukum',
    href: '/legalitas',
    description: 'Akta Notaris, SK Pengesahan Kemenkumham RI, NIB, dan kepastian sertifikat SHM.',
    keywords: ['legalitas', 'akta', 'notaris', 'kemenkumham', 'nib', 'izin', 'shm', 'hukum', 'sertifikat']
  },
  {
    title: 'Kontak & Kantor Pemasaran',
    category: 'Layanan Konsumen',
    href: '/kontak',
    description: 'Alamat kantor pusat di Bandar Lampung, WhatsApp resmi, dan formulir konsultasi.',
    keywords: ['kontak', 'hubungi', 'whatsapp', 'alamat', 'telepon', 'lokasi', 'kantor', 'survei', 'email']
  }
];

export default function Header({ content }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu or search modal is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, searchOpen]);

  const rawWa = content.contact?.whatsapp || '0812-7890-1234';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin berkonsultasi mengenai perumahan Puri Gunung Langgar.')}`;

  // Filtered search results
  const filteredSearch = searchQuery.trim() === ''
    ? SEARCH_DATABASE
    : SEARCH_DATABASE.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.keywords.some(k => k.includes(q))
        );
      });

  // Main Navigation Items (matching complete PT. TBK navigation)
  const mainNavItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang', href: '/tentang' },
    { label: 'Proyek', href: '/proyek' },
    { label: 'Legalitas', href: '/legalitas' },
    { label: 'Kegiatan', href: '/kegiatan' },
    { label: 'Simulasi', href: '/simulasi-kpr' },
  ];

  // Complete navigation items for slide-over drawer
  const allNavItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang', href: '/tentang' },
    { label: 'Proyek', href: '/proyek' },
    { label: 'Legalitas', href: '/legalitas' },
    { label: 'Kegiatan', href: '/kegiatan' },
    { label: 'Simulasi', href: '/simulasi-kpr' },
  ];

  return (
    <>
      {/* Skip to Main Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#FF9D2E] focus:text-[#102D52] focus:rounded focus:font-semibold focus:shadow-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Menuju ke konten utama
      </a>

      {/* Spacer for non-homepage views */}
      {!isHomePage && (
        <div className="h-[58px] min-[980px]:h-[68px] bg-[#073B78]" aria-hidden="true" />
      )}

      {/* Main Corporate Header: ICC-Inspired Full-Width Navy Blue */}
      <header
        suppressHydrationWarning
        className={`fixed top-0 inset-x-0 z-[900] h-[58px] min-[980px]:h-[68px] w-full transition-all duration-200 ease-out border-b border-white/10 ${
          isScrolled || !isHomePage
            ? 'bg-[#073B78] shadow-md'
            : 'bg-[#073B78]'
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
        }}
      >
        <div className="w-full max-w-[1360px] mx-auto h-full px-3.5 sm:px-6 flex items-center justify-between gap-2">
          {/* Left: Brand Identity with existing logo asset */}
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[calc(100%-86px)] min-[980px]:max-w-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E] rounded-lg py-1 group"
            aria-label="PT. Terbang Bersama Kawan - Beranda"
          >
            {/* Logo Image Asset */}
            <div className="h-8 sm:h-9 w-auto flex items-center shrink-0">
              <img
                src={content.meta?.logo || '/assets/logo-tbk.png'}
                alt={`Logo ${content.footer?.companyName || 'PT. Terbang Bersama Kawan'}`}
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
              />
            </div>

            <div className="flex flex-col text-left min-w-0 overflow-hidden">
              <span className="text-[13px] sm:text-[15px] font-bold tracking-[0.04em] text-white uppercase group-hover:text-[#FF9D2E] transition-colors leading-tight truncate">
                {content.footer?.shortName || 'PT. TBK'}
              </span>
              <span className="text-[9px] sm:text-[10.5px] text-[#FF9D2E] font-medium tracking-[0.03em] uppercase leading-tight mt-0.5 truncate">
                {content.meta?.tagline || 'Terbang Bersama Kawan'}
              </span>
            </div>
          </Link>

          {/* Center-Right: Desktop Navigation Menu */}
          <nav aria-label="Menu utama" suppressHydrationWarning className="hidden min-[980px]:flex items-center gap-3.5 min-[1120px]:gap-5 lg:gap-6 xl:gap-7">
            {mainNavItems.map((item) => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : item.href.includes('#')
                ? false
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  suppressHydrationWarning
                  className={`text-[12.5px] min-[1120px]:text-[13.5px] lg:text-[14px] font-medium transition-all relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9D2E] rounded whitespace-nowrap ${
                    isActive
                      ? 'text-[#FF9D2E] font-bold'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  <span suppressHydrationWarning>{item.label}</span>
                  {isActive && (
                    <span
                      className="absolute -bottom-[6px] left-0 right-0 h-[2.5px] bg-[#FF9D2E] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>


        </div>
      </header>

      {/* ========================================================= */}
      {/* SEARCH MODAL (Interactive & Functional)                   */}
      {/* ========================================================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-[950] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#DCE7F5] overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian Website"
          >
            {/* Search Input Bar */}
            <div className="p-3.5 sm:p-4 bg-[#F4F7FC] border-b border-[#DCE7F5] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#073B78] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proyek, KPR, syarat, legalitas..."
                className="w-full bg-transparent text-[#102D52] placeholder-[#526783] text-[14px] sm:text-[15px] font-medium outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-[#526783] hover:text-[#102D52]"
                  aria-label="Hapus teks pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-[#DCE7F5] text-[#526783] hover:text-[#102D52]"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 divide-y divide-[#DCE7F5]/60">
              {filteredSearch.length === 0 ? (
                <div className="py-8 text-center text-[#526783] text-sm">
                  Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;. Silakan coba kata kunci lain.
                </div>
              ) : (
                filteredSearch.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="p-3 rounded-xl hover:bg-[#F4F7FC] flex items-start gap-3 transition-colors group block"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#073B78]/10 text-[#073B78] group-hover:bg-[#FF9D2E] group-hover:text-[#102D52] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-bold text-[#102D52] group-hover:text-[#073B78]">
                          {item.title}
                        </span>
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#DCE7F5] text-[#073B78]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#526783] mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE & DESKTOP SLIDE DRAWER: ICC-Inspired Layout        */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <>
          {/* Subtle backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[880] transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mobile-nav-panel"
            className="fixed top-[58px] min-[980px]:top-[68px] inset-x-0 min-[980px]:left-auto min-[980px]:right-0 min-[980px]:w-[380px] min-[980px]:border-l min-[980px]:shadow-2xl bottom-0 bg-[#073B78] z-[890] px-5 py-5 pb-28 min-[980px]:pb-8 flex flex-col justify-between overflow-y-auto border-t min-[980px]:border-t-0 border-white/10 animate-in slide-in-from-right-4 duration-200"
          >
          {/* Project Status Pill */}
          <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9D2E] animate-pulse" />
              <span className="font-semibold text-white tracking-wide">Puri Gunung Langgar</span>
            </div>
            <span className="text-[11px] text-[#FF9D2E] uppercase font-bold tracking-wider">Proyek Berjalan</span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Menu seluler" className="space-y-1.5 my-3 py-2">
            {allNavItems.map((item) => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : item.href.includes('#')
                ? false
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  suppressHydrationWarning
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] px-4 rounded-xl flex items-center justify-between text-[14px] transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white font-bold border-l-4 border-[#FF9D2E]'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span suppressHydrationWarning>{item.label}</span>
                  {isActive && (
                    <span className="text-[11px] text-[#FF9D2E] uppercase font-bold">Aktif</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <Link
              href="/kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[42px] px-4 rounded-xl bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] font-semibold text-[13px] tracking-normal flex items-center justify-center gap-2 transition-all shadow"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[42px] px-4 rounded-xl border border-white/30 hover:border-[#FF9D2E] hover:bg-[#FF9D2E]/10 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#FF9D2E]" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </div>
        </>
      )}
    </>
  );
}
