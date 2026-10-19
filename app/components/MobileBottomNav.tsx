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
    label: 'BERANDA',
    href: '/',
    icon: Home,
    isActive: (pathname) => pathname === '/',
  },
  {
    label: 'TENTANG',
    href: '/tentang',
    icon: Building2,
    isActive: (pathname) => pathname.startsWith('/tentang'),
  },
  {
    label: 'PROYEK',
    href: '/proyek',
    icon: Compass,
    isActive: (pathname) => pathname.startsWith('/proyek') || pathname.startsWith('/kegiatan'),
  },
  {
    label: 'SIMULASI',
    href: '/simulasi-kpr',
    icon: Calculator,
    isActive: (pathname) => pathname.startsWith('/simulasi-kpr'),
  },
  {
    label: 'KONTAK',
    href: '/kontak',
    icon: Phone,
    isActive: (pathname) => pathname.startsWith('/kontak'),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname() || '/';
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isNavAdmin = currentPath.toLowerCase().includes('admin') || currentPath.toLowerCase().includes('a9min') || currentPath.startsWith('/login');
  if (isNavAdmin) {
    return null;
  }

  return (
    <nav
      aria-label="Navigasi Bawah Seluler"
      role="navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-[800] bg-[#000000] border-t border-[#262626] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 h-[56px] max-w-lg mx-auto px-1 items-center">
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`group flex flex-col items-center justify-center py-1 px-1 transition-all select-none relative focus:outline-none ${
                active
                  ? 'text-white'
                  : 'text-[#666666] hover:text-white'
              }`}
            >
              {active && (
                <span
                  className="absolute -top-1 w-4 h-0.5 bg-white"
                  aria-hidden="true"
                />
              )}

              <Icon
                className={`w-[18px] h-[18px] stroke-[1.5] transition-transform ${
                  active ? 'scale-105' : 'group-hover:scale-105'
                }`}
              />

              <span
                className={`text-[9.5px] font-mono tracking-[1.5px] uppercase mt-1 transition-colors ${
                  active ? 'text-white' : 'text-[#666666]'
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
