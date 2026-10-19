'use client';

import React from 'react';
import Link from 'next/link';
import { SiteContent, getCrispLogoUrl } from '@/lib/initialData';
import { MapPin, Phone, Mail, FileCheck2, ExternalLink } from 'lucide-react';

interface FooterProps {
  content: SiteContent;
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-[#000000] text-[#999999] pt-24 pb-28 md:pb-16 border-t border-[#262626] font-serif text-[14px]">
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#262626]">
          {/* Column 1: Company Profile & Verification */}
          <div className="md:col-span-12 lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {content.meta?.logo && (
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <img
                    src={getCrispLogoUrl(content.meta.logo)}
                    alt="Logo"
                    className="w-full h-full object-contain filter invert contrast-125"
                  />
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="font-display font-normal text-base text-white tracking-[4px] uppercase group-hover:text-white/80 transition-colors">
                  {content.footer?.companyName || 'PT. TERBANG BERSAMA KAWAN'}
                </span>
                <span className="font-mono text-[10px] text-[#666666] uppercase tracking-[2px] mt-0.5">
                  {content.footer?.tagline || 'PENGEMBANG PROPERTI RESMI'}
                </span>
              </div>
            </Link>

            <p className="text-[#cccccc] text-[14px] leading-relaxed max-w-sm">
              {content.footer?.summary || 'Pengembang perumahan bersubsidi resmi berdomisili di Kota Bandar Lampung. Menghadirkan proyek Puri Gunung Langgar dengan legalitas sah dan standar mutu PUPR.'}
            </p>

            {content.legal?.skMenkumham && content.legal.skMenkumham.trim() !== '' && (
              <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-[#999999] tracking-[1.5px] uppercase">
                <FileCheck2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span>SK KEMENKUMHAM: {content.legal.skMenkumham}</span>
              </div>
            )}
          </div>

          {/* Column 2: Navigation Directory */}
          <div className="md:col-span-4 lg:col-span-2 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-[2px] text-white">
              DIREKTORI
            </div>
            <ul className="space-y-2.5 font-mono text-xs tracking-[1.5px] uppercase">
              <li>
                <Link href="/" className="text-[#999999] hover:text-white transition-colors">BERANDA</Link>
              </li>
              <li>
                <Link href="/tentang" className="text-[#999999] hover:text-white transition-colors">TENTANG</Link>
              </li>
              <li>
                <Link href="/proyek" className="text-[#999999] hover:text-white transition-colors">PROYEK</Link>
              </li>
              <li>
                <Link href="/legalitas" className="text-[#999999] hover:text-white transition-colors">LEGALITAS</Link>
              </li>
              <li>
                <Link href="/kegiatan" className="text-[#999999] hover:text-white transition-colors">KEGIATAN</Link>
              </li>
              <li>
                <Link href="/simulasi-kpr" className="text-[#999999] hover:text-white transition-colors">SIMULASI KPR</Link>
              </li>
              <li>
                <Link href="/kontak" className="text-[#999999] hover:text-white transition-colors">KONTAK</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Address & Coordinates */}
          <div className="md:col-span-8 lg:col-span-3 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-[2px] text-white">
              KANTOR &amp; PROYEK
            </div>
            <div className="text-[13.5px] text-[#cccccc] space-y-3 leading-relaxed">
              {content.contact?.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white font-mono text-xs tracking-[1.5px] uppercase block mb-0.5">Kantor Pusat</strong>
                    {content.contact.address}
                  </span>
                </div>
              )}
              {content.project?.name && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#999999] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white font-mono text-xs tracking-[1.5px] uppercase block mb-0.5">Lokasi Proyek</strong>
                    {content.project.name}, {content.project.district || 'Tanjung Bintang'}, {content.project.province || 'Lampung Selatan'}
                  </span>
                </div>
              )}
              {content.contact?.whatsapp && (
                <div className="flex items-center gap-2.5 pt-1 font-mono text-xs tracking-[1.5px]">
                  <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>WA: {content.contact.whatsapp}</span>
                </div>
              )}
              {content.contact?.email && (
                <div className="flex items-center gap-2.5 font-mono text-xs tracking-[1.5px]">
                  <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>{content.contact.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Map Location */}
          <div className="md:col-span-12 lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[2px]">
              <span className="text-white">PETA LOKASI</span>
              {content.contact?.mapsUrl && (
                <a
                  href={content.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c3d9f3] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>MAPS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {content.contact?.mapsEmbedUrl && (
              <div className="relative w-full h-36 rounded-none overflow-hidden border border-[#262626] bg-[#0d0d0d]">
                <iframe
                  src={content.contact.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Kantor PT. Terbang Bersama Kawan"
                  className="w-full h-full filter invert contrast-125 opacity-75 hover:opacity-100 transition-opacity"
                />
              </div>
            )}
            {content.contact?.operatingHours && (
              <p className="font-mono text-[11px] tracking-[1px] uppercase text-[#666666]">
                OPERASIONAL: {content.contact.operatingHours}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Centered Wordmark */}
        <div className="pt-10 flex flex-col items-center justify-between gap-6 text-center">
          <div className="font-display text-sm sm:text-base tracking-[6px] text-white/50 uppercase select-none">
            PT. TERBANG BERSAMA KAWAN
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full font-mono text-[11px] tracking-[1.5px] uppercase text-[#666666] gap-3">
            <div>
              &copy; {new Date().getFullYear()} {content.footer?.copyrightText || 'PT. TERBANG BERSAMA KAWAN. ALL RIGHTS RESERVED.'}
            </div>
            <div className="flex items-center gap-6 text-[#999999]">
              <Link href="/legalitas" className="hover:text-white transition-colors">LEGALITAS</Link>
              <Link href="/kontak" className="hover:text-white transition-colors">KONTAK</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
