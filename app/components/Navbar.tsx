'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ArrowRight, MessageCircle } from 'lucide-react';
import { SiteContent, getCrispLogoUrl } from '@/lib/initialData';

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
  const [mounted, setMounted] = useState(false);
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
      if (searchOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 80);
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen, searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rawWa = content.contact?.whatsapp?.trim() || '';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const hasWa = cleanPhone.length >= 7;
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = hasWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya tertarik dengan informasi unit Puri Gunung Langgar.')}`
    : '';

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

  const mainNavItems = [
    { label: 'BERANDA', href: '/' },
    { label: 'TENTANG', href: '/tentang' },
    { label: 'PROYEK', href: '/proyek' },
    { label: 'LEGALITAS', href: '/legalitas' },
    { label: 'KEGIATAN', href: '/kegiatan' },
    { label: 'SIMULASI KPR', href: '/simulasi-kpr' },
    { label: 'KONTAK', href: '/kontak' },
  ];

  return (
    <>
      {/* Skip to Main Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100001] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-mono focus:text-xs focus:tracking-[2px] focus:outline-none"
      >
        MENUJU KE KONTEN UTAMA
      </a>

      {/* Spacer for non-homepage views */}
      {!isHomePage && (
        <div className="h-[56px] sm:h-[64px] bg-[#000000]" aria-hidden="true" />
      )}

      {/* Top Nav (Austere Luxury Bugatti Navigation Bar) */}
      <header
        suppressHydrationWarning
        className={`fixed top-0 inset-x-0 w-full h-[56px] sm:h-[64px] z-[100000] transition-colors duration-300 border-b ${
          isScrolled
            ? 'bg-[#000000]/95 backdrop-blur-md border-[#262626]'
            : 'bg-[#000000]/80 backdrop-blur-sm border-[#262626]/60'
        }`}
      >
        <div className="w-full max-w-[1360px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Trigger + Brand Emblem */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 border border-[#262626] rounded-full flex items-center justify-center text-white hover:border-white transition-colors"
              aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4 stroke-[1.5]" /> : <Menu className="w-4 h-4 stroke-[1.5]" />}
            </button>

            {/* Wordmark Logo Display */}
            <Link
              href="/"
              className="flex items-center gap-3 focus:outline-none group"
              aria-label="PT. Terbang Bersama Kawan - Beranda"
            >
              {content.meta?.logo && (
                <img
                  src={getCrispLogoUrl(content.meta.logo)}
                  alt="Logo"
                  width={34}
                  height={34}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain filter invert contrast-125"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              )}
              <span className="font-display font-normal text-sm sm:text-base tracking-[4px] sm:tracking-[6px] text-white uppercase group-hover:text-white/80 transition-opacity whitespace-nowrap">
                PT. TBK
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Trinity */}
          <nav aria-label="Menu utama" className="hidden lg:flex items-center gap-6 xl:gap-8">
            {mainNavItems.map((item) => {
              const isActive = mounted && (item.href === '/'
                ? pathname === '/'
                : item.href.includes('#')
                ? false
                : pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-mono text-[11px] xl:text-[12px] tracking-[2px] uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-white border-b border-white'
                      : 'text-[#999999] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Search & Signature CTA Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 border border-[#262626] hover:border-white text-white rounded-full flex items-center justify-center transition-all"
              aria-label="Cari di website"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5]" />
            </button>

            {hasWa ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex btn-bugatti-primary text-[11px] sm:text-[12px] h-[38px] px-6"
              >
                KONSULTASI
              </a>
            ) : (
              <Link
                href="/kontak"
                className="hidden sm:inline-flex btn-bugatti-primary text-[11px] sm:text-[12px] h-[38px] px-6"
              >
                KONTAK
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SEARCH MODAL (Dark Monochrome Luxury Overlay)             */}
      {/* ========================================================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100050] flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-[#0d0d0d] border border-[#262626] rounded-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian Direktori PT. TBK"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-[#262626] flex items-center gap-4 bg-[#141414]">
              <Search className="w-4 h-4 text-[#999999] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="CARI PROYEK, SPESIFIKASI, LEGALITAS, KPR..."
                className="w-full bg-transparent text-white placeholder-[#666666] font-mono text-xs sm:text-sm tracking-[2px] uppercase outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-[#999999] hover:text-white"
                  aria-label="Hapus teks pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="font-mono text-[11px] tracking-[2px] uppercase px-3 py-1 border border-[#262626] text-[#999999] hover:text-white hover:border-white transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-[#262626]">
              {filteredSearch.length === 0 ? (
                <div className="py-12 text-center text-[#999999] font-mono text-xs tracking-[2px] uppercase">
                  Tidak ditemukan data untuk &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                filteredSearch.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="p-4 hover:bg-[#141414] flex items-start gap-4 transition-colors group block"
                  >
                    <div className="w-8 h-8 border border-[#262626] group-hover:border-white text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-display font-normal text-base text-white tracking-[2px] uppercase group-hover:text-white">
                          {item.title}
                        </span>
                        <span className="font-mono text-[10px] tracking-[2px] uppercase px-2 py-0.5 border border-[#262626] text-[#999999]">
                          {item.category}
                        </span>
                      </div>
                      <p className="font-serif text-sm text-[#999999] mt-1 line-clamp-1">
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
      {/* MOBILE DRAWER: Austere Monochrome Architectural Panel     */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100010] transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mobile-nav-panel"
            className="fixed top-[56px] right-0 w-full sm:w-[380px] bottom-0 bg-[#0d0d0d] border-l border-[#262626] z-[100020] p-6 pb-28 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-4 duration-200"
          >
            <div className="space-y-6">
              {/* Status Pill */}
              <div className="p-3 bg-[#141414] border border-[#262626] flex items-center justify-between font-mono text-[11px] tracking-[2px] uppercase">
                <span className="text-white">PURI GUNUNG LANGGAR</span>
                <span className="text-[#999999]">OPERASIONAL</span>
              </div>

              {/* Navigation Links */}
              <nav aria-label="Menu seluler" className="divide-y divide-[#262626]">
                {mainNavItems.map((item) => {
                  const isActive = mounted && (item.href === '/'
                    ? pathname === '/'
                    : item.href.includes('#')
                    ? false
                    : pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[50px] flex items-center justify-between font-mono text-xs tracking-[2.5px] uppercase transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-[#999999] hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#666666]" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#262626] space-y-3">
              <Link
                href="/kontak"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-bugatti-primary justify-center"
              >
                HUBUNGI KAMI
              </Link>
              {hasWa && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-bugatti-primary justify-center border-[#3a3a3a] text-[#cccccc]"
                >
                  KONSULTASI WHATSAPP
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
