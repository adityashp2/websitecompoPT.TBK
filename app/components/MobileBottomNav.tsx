'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  Compass,
  Calculator,
  Phone,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Beranda',
    href: '/',
    icon: Home,
    isActive: (pathname) => pathname === '/',
  },
  {
    label: 'Tentang',
    href: '/tentang',
    icon: Building2,
    isActive: (pathname) => pathname.startsWith('/tentang') || pathname.startsWith('/pimpinan'),
  },
  {
    label: 'Proyek',
    href: '/proyek',
    icon: Compass,
    isActive: (pathname) => pathname.startsWith('/proyek') || pathname.startsWith('/kegiatan'),
  },
  {
    label: 'Simulasi',
    href: '/simulasi-kpr',
    icon: Calculator,
    isActive: (pathname) => pathname.startsWith('/simulasi-kpr'),
  },
  {
    label: 'Kontak',
    href: '/kontak',
    icon: Phone,
    isActive: (pathname) => pathname.startsWith('/kontak'),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname() || '/';

  // Do not render bottom nav inside admin panel
  if (pathname.startsWith('/A9MIN') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <nav
      aria-label="Navigasi Bawah Seluler"
      role="navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-[800] bg-[#102D52] border-t border-[#1C5795] shadow-[0_-6px_20px_rgba(0,0,0,0.35)] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 h-[58px] max-w-lg mx-auto px-1 items-center">
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`group flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 select-none relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D2E] rounded-[8px] ${
                active
                  ? 'text-[#FF9D2E]'
                  : 'text-white/65 hover:text-white active:scale-95'
              }`}
            >
              {/* Active orange indicator pip on top */}
              {active && (
                <span
                  className="absolute -top-1 w-5 h-0.5 rounded-full bg-[#FF9D2E] shadow-[0_0_8px_rgba(255,157,46,0.6)] animate-in fade-in zoom-in-75 duration-200"
                  aria-hidden="true"
                />
              )}

              <Icon
                className={`w-[19px] h-[19px] transition-transform duration-200 ${
                  active ? 'scale-110 stroke-[2.25]' : 'group-hover:scale-105 stroke-[1.75]'
                }`}
              />

              <span
                className={`text-[10.5px] tracking-tight mt-1 font-medium transition-colors ${
                  active ? 'font-bold text-[#FF9D2E]' : 'text-white/70'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
