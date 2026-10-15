'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  Users, 
  Compass, 
  Phone, 
  HardHat,
  FileCheck2,
  Calculator,
  ExternalLink,
  MessageCircle,
  Lock
} from 'lucide-react';
import { SiteContent } from '@/lib/initialData';

interface HeaderProps {
  content: SiteContent;
}

export default function Header({ content }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to toggle transparent vs solid frosted background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key press or route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const rawWa = content.contact?.whatsapp || '0812-7890-1234';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin bertanya tentang perumahan subsidi Puri Gunung Langgar.')}`;

  const navItems = [
    { label: 'BERANDA', href: '/', id: 'beranda', icon: Home, desc: 'Halaman Utama & Rangkuman' },
    { label: 'TENTANG', href: '/tentang', id: 'tentang', icon: Building2, desc: 'Profil & Visi Misi Perseroan' },
    { label: 'PROYEK', href: '/proyek', id: 'proyek', icon: Compass, desc: 'Puri Gunung Langgar & Spesifikasi' },
    { label: 'SIMULASI KPR', href: '/simulasi-kpr', id: 'kpr', icon: Calculator, desc: 'Kalkulator Angsuran FLPP' },
    { label: 'KEGIATAN', href: '/kegiatan', id: 'kegiatan', icon: HardHat, desc: 'Dokumentasi Lapangan' },
    { label: 'LEGALITAS', href: '/legalitas', id: 'legalitas', icon: FileCheck2, desc: 'SK Menkumham & Akta Notaris' },
    { label: 'PIMPINAN', href: '/pimpinan', id: 'pimpinan', icon: Users, desc: 'Dewan Pengurus & Direksi' },
    { label: 'KONTAK', href: '/kontak', id: 'kontak', icon: Phone, desc: 'Lokasi Kantor & Form Minat' },
  ];

  return (
    <>
      {/* Skip to Content Link (Accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#C9A96A] focus:text-[#0E1014] focus:rounded focus:font-semibold focus:shadow-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Menuju ke konten utama
      </a>

      {/* Spacer for non-homepage pages so content starts cleanly below the fixed header */}
      {!isHomePage && (
        <div className="h-[60px] min-[980px]:h-[72px]" aria-hidden="true" />
      )}

      {/* Navbar Header: Fixed top. Transparan saat di paling atas homepage, solid frosted saat di-scroll */}
      <header
        className={`fixed top-0 inset-x-0 z-50 h-[60px] min-[980px]:h-[72px] w-full transition-all duration-300 ease-in-out ${
          isHomePage
            ? isScrolled || mobileMenuOpen
              ? 'bg-[#0E1014]/95 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/40'
              : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent border-b border-transparent backdrop-blur-none'
            : 'bg-[#0E1014]/95 backdrop-blur-md border-b border-white/[0.08] shadow-md shadow-black/30'
        }`}
      >
        <div className="max-w-[1240px] mx-auto h-full px-4 min-[980px]:px-6 flex items-center justify-between">
          {/* Kiri: Logo PT. TBK */}
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96A] rounded p-1 group"
            aria-label="PT. Terbang Bersama Kawan - Beranda"
          >
            <img
              src={content.meta?.logo || '/assets/logo-tbk.png'}
              alt="Logo PT. Terbang Bersama Kawan"
              className="h-8 sm:h-10 w-auto object-contain shrink-0 drop-shadow-md"
              width="40"
              height="40"
            />
            <div className="flex flex-col text-left">
              <span className="text-[11.5px] sm:text-[13px] font-bold tracking-wider text-[#F4EFE6] leading-none uppercase group-hover:text-[#C9A96A] transition-colors drop-shadow-sm">
                PT. TBK
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-[#C9A96A] font-semibold tracking-tight mt-0.5 truncate max-w-[150px] sm:max-w-none drop-shadow-sm">
                Terbang Bersama Kawan
              </span>
            </div>
          </Link>

          {/* Kanan: Menu teks desktop responsif */}
          <nav aria-label="Menu utama" className="hidden min-[980px]:flex items-center gap-4 min-[1120px]:gap-6">
            {navItems.map((item) => {
              const isActive = item.href === '/' 
                ? pathname === '/' 
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={false}
                  className={`text-[11.5px] min-[1120px]:text-[12px] font-medium tracking-[0.06em] uppercase transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96A] rounded whitespace-nowrap ${
                    isActive
                      ? 'text-[#F4EFE6] font-semibold'
                      : 'text-[rgba(244,239,230,0.75)] hover:text-[#F4EFE6]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-[#C9A96A]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA Pill */}
          <div className="hidden min-[980px]:flex items-center">
            <Link
              href="/kontak"
              prefetch={false}
              className="h-[36px] px-4 rounded-[6px] border border-[#C9A96A] text-[#F4EFE6] hover:bg-[#C9A96A] hover:text-[#0E1014] text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center whitespace-nowrap"
            >
              Hubungi Kami
            </Link>
          </div>

          {/* Mobile Hamburger Button (<980px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-[980px]:hidden w-11 h-11 flex items-center justify-center rounded-lg text-[#F4EFE6] bg-white/[0.04] border border-white/10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96A] shrink-0 transition-colors"
            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C9A96A]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Panel (<980px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed top-[60px] inset-x-0 bottom-0 bg-[#0E1014]/98 backdrop-blur-2xl z-40 px-5 py-5 flex flex-col justify-between overflow-y-auto min-[980px]:hidden font-sans border-t border-white/[0.08] animate-in fade-in duration-200"
        >
          {/* Top Status Banner */}
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/20 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Proyek Unggulan Aktif
              </div>
              <div className="text-[13px] font-semibold text-[#F4EFE6] truncate">
                Puri Gunung Langgar, Lampung Selatan
              </div>
            </div>
          </div>

          {/* Navigation Links with Icons */}
          <nav aria-label="Menu seluler" className="space-y-1.5 my-auto py-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.href === '/' 
                ? pathname === '/' 
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={false}
                  onClick={() => {
                    setTimeout(() => setMobileMenuOpen(false), 80);
                  }}
                  className={`min-h-[48px] px-3.5 rounded-xl flex items-center justify-between transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C9A96A]/20 to-transparent text-[#F4EFE6] border border-[#C9A96A]/40'
                      : 'text-[#F4EFE6]/80 hover:bg-white/[0.04] hover:text-[#F4EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-[#C9A96A] text-[#0E1014]' : 'bg-white/[0.06] text-[#C9A96A]'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] font-semibold tracking-[0.04em] uppercase">
                        {item.label}
                      </span>
                      <span className="text-[10.5px] text-white/50 font-normal">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#C9A96A]" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Bottom Quick Actions */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2 mt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi WhatsApp</span>
            </a>
            <Link
              href="/kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] px-4 rounded-xl border border-[#C9A96A] text-[#F4EFE6] hover:bg-[#C9A96A] hover:text-[#0E1014] font-semibold text-[13px] flex items-center justify-center transition-colors"
            >
              Formulir Pemesanan Unit
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
