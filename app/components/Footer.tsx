'use client';

import React from 'react';
import Link from 'next/link';
import { SiteContent } from '@/lib/initialData';
import { MapPin, Phone, Mail, FileCheck2, ExternalLink } from 'lucide-react';

interface FooterProps {
  content: SiteContent;
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-[#102D52] text-[#DCE7F5]/85 pt-16 pb-28 md:pb-12 border-t border-white/10 text-[13.5px]">
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Company Profile & Verification */}
          <div className="md:col-span-12 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center p-1.5 shrink-0 group-hover:border-[#FF9D2E]/50 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#FF9D2E]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21h18M5 21V7l5-4v18M14 21V9l5 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 9h.01M8 13h.01M8 17h.01M16 15h.01M16 18h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-[15px] text-white tracking-[0.04em] uppercase group-hover:text-[#FF9D2E] transition-colors">
                  {content.footer?.companyName || 'PT. Terbang Bersama Kawan'}
                </span>
                <span className="text-[10.5px] text-[#FF9D2E] uppercase tracking-[0.05em] font-medium">
                  Pengembang Properti Bandar Lampung
                </span>
              </div>
            </Link>

            <p className="text-[#DCE7F5]/75 text-[13px] leading-relaxed max-w-sm">
              {content.footer?.summary || 'Pengembang perumahan resmi berdomisili di Bandar Lampung. Mengutamakan transparansi informasi, kepastian legalitas, dan mutu hunian layak bagi masyarakat.'}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-white/80">
              <FileCheck2 className="w-4 h-4 text-[#FF9D2E] shrink-0" />
              <span>SK Kemenkumham: {content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}</span>
            </div>
          </div>

          {/* Column 2: Address & Coordinates */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3.5">
            <div className="text-xs uppercase tracking-[0.12em] text-[#FF9D2E] font-bold">
              Kantor &amp; Lokasi Proyek
            </div>
            <div className="text-[13px] text-[#DCE7F5]/85 space-y-3 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF9D2E] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Kantor:</strong> {content.contact?.address || 'Bandar Lampung, Provinsi Lampung, Indonesia.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#15966A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Proyek:</strong> {content.project?.name || 'Puri Gunung Langgar'}, {content.project?.district || 'Desa Sabah Balau, Kec. Tanjung Bintang'}, Lampung Selatan.
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-1 text-[#DCE7F5]/75">
                <Phone className="w-4 h-4 text-[#FF9D2E] shrink-0" />
                <span>WhatsApp: {content.contact?.whatsapp || '0812-7890-1234'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#DCE7F5]/75">
                <Mail className="w-4 h-4 text-[#FF9D2E] shrink-0" />
                <span>Email: {content.contact?.email || 'info@terbangbersamakawan.co.id'}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Google Maps Architectural Preview */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.12em] text-[#FF9D2E] font-bold">
                Peta Lokasi Kantor
              </span>
              <a
                href={content.contact?.mapsUrl || "https://maps.google.com/?q=Bandar+Lampung"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#DCE7F5]/70 hover:text-[#FF9D2E] flex items-center gap-1 transition-colors"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/15 bg-[#073B78]">
              <iframe
                src={content.contact?.mapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127103.95764032483!2d105.19799639726562!3d-5.412499999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da473d091219%3A0x3039d80b220cc70!2sKota%20Bandar%20Lampung%2C%20Lampung!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Kantor PT. Terbang Bersama Kawan"
                className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-[11.5px] text-[#DCE7F5]/70">
              Jam Operasional: {content.contact?.operatingHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[#DCE7F5]/70 text-[12.5px] gap-3">
          <div>
            &copy; {new Date().getFullYear()} {content.footer?.copyrightText || 'PT. Terbang Bersama Kawan. Hak Cipta Dilindungi Undang-Undang.'}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/legalitas" className="hover:text-white transition-colors">Legalitas Perusahaan</Link>
            <Link href="/kontak" className="hover:text-white transition-colors">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
