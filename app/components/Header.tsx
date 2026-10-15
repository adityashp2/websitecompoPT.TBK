'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, ArrowRight } from 'lucide-react';
import { SiteContent } from '@/lib/initialData';

interface HeaderProps {
  content: SiteContent;
}

export default function Header({ content }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to toggle transparent vs solid architectural header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
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

  // Close mobile drawer on route change or Escape
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
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin berkonsultasi mengenai perumahan Puri Gunung Langgar.')}`;

  // Main Navigation Items including Pimpinan (Dewan Pengurus)
  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang', href: '/tentang' },
    { label: 'Proyek', href: '/proyek' },
    { label: 'Pimpinan', href: '/pimpinan' },
    { label: 'Simulasi KPR', href: '/simulasi-kpr' },
    { label: 'Kegiatan', href: '/kegiatan' },
    { label: 'Legalitas', href: '/legalitas' },
    { label: 'Kontak', href: '/kontak' },
  ];

  return (
    <>
      {/* Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#C5A568] focus:text-[#262722] focus:rounded focus:font-semibold focus:shadow-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Menuju ke konten utama
      </a>

      {/* Spacer for non-homepage views with dark background */}
      {!isHomePage && (
        <div className="h-[58px] min-[980px]:h-[64px] bg-[#262722]" aria-hidden="true" />
      )}

      {/* Main Architectural Header with guaranteed solid charcoal background */}
      <header
        style={{ backgroundColor: '#262722' }}
        className="fixed top-0 inset-x-0 z-50 h-[58px] min-[980px]:h-[64px] w-full bg-[#262722] border-b border-white/[0.08] shadow-sm transition-all duration-200 ease-out"
      >
        <div className="container-editorial h-full flex items-center justify-between">
          {/* Left: Brand Identity & Logo */}
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A568] rounded py-1 group"
            aria-label="PT. Terbang Bersama Kawan - Beranda"
          >
            <img
              src={content.meta?.logo || '/assets/logo-tbk.png'}
              alt="Logo PT. Terbang Bersama Kawan"
              className="h-7 min-[980px]:h-8 w-auto object-contain shrink-0"
              width="32"
              height="32"
            />
            <div className="flex flex-col text-left">
              <span className="text-[11.5px] min-[980px]:text-[12.5px] font-bold tracking-[0.08em] text-[#F3EFE6] uppercase group-hover:text-[#C5A568] transition-colors leading-tight">
                PT. TBK
              </span>
              <span className="text-[9.5px] text-[#C5A568] font-medium tracking-[0.04em] uppercase leading-tight mt-0.5">
                Terbang Bersama Kawan
              </span>
            </div>
          </Link>

          {/* Center-Right: Editorial Main Navigation (Desktop) with crisp high contrast */}
          <nav aria-label="Menu utama" className="hidden min-[980px]:flex items-center gap-3.5 min-[1100px]:gap-5">
            {navItems.map((item) => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`text-[12px] min-[1100px]:text-[12.5px] font-medium tracking-[0.01em] transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A568] rounded whitespace-nowrap ${
                    isActive
                      ? 'text-[#C5A568] font-bold'
                      : 'text-[#F3EFE6]/85 hover:text-[#C5A568]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-[4px] left-0 right-0 h-[2px] bg-[#C5A568]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Understated Architectural CTA Proportional to Header */}
          <div className="hidden min-[980px]:flex items-center">
            <Link
              href="/kontak"
              prefetch={false}
              className="group h-[36px] px-4 rounded-[10px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] shadow-sm hover:shadow flex items-center justify-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle (<980px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-[980px]:hidden w-10 h-10 flex items-center justify-center rounded-[4px] text-[#F3EFE6] bg-white/[0.04] border border-white/10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A568] shrink-0 transition-colors"
            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#C5A568]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (<980px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed top-[58px] inset-x-0 bottom-0 bg-[#262722]/98 backdrop-blur-xl z-40 px-6 py-6 flex flex-col justify-between overflow-y-auto min-[980px]:hidden border-t border-white/[0.08]"
        >
          {/* Project Status Banner */}
          <div className="p-3 rounded-[4px] bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-[#F3EFE6] tracking-wide">Puri Gunung Langgar</span>
            </div>
            <span className="text-[11px] text-[#C5A568] uppercase font-medium tracking-wider">Tahap Aktif</span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Menu seluler" className="space-y-1 my-auto py-4">
            {navItems.map((item) => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] px-3.5 rounded-[4px] flex items-center justify-between text-[13.5px] transition-colors ${
                    isActive
                      ? 'bg-white/[0.06] text-[#F3EFE6] font-semibold border-l-2 border-[#C5A568]'
                      : 'text-[#F3EFE6]/80 hover:bg-white/[0.03] hover:text-[#F3EFE6]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-[11px] text-[#C5A568] uppercase font-mono">Aktif</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
            <Link
              href="/kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[42px] px-4 rounded-[10px] bg-[#C5A568] hover:bg-[#B69455] active:scale-[0.99] text-[#262722] font-semibold text-[12.5px] tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[42px] px-4 rounded-[10px] border border-white/20 hover:border-[#C5A568] hover:bg-[#C5A568]/10 active:scale-[0.99] text-[#F3EFE6] text-[12.5px] font-medium flex items-center justify-center gap-2 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A568]" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
