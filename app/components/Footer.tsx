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
    <footer className="bg-[#262722] text-[#F3EFE6]/80 pt-16 pb-12 border-t border-[#DDD8CE]/15 text-[13px]">
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Company Profile & Verification */}
          <div className="md:col-span-12 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src={content.meta?.logo || "/assets/logo-tbk.png"}
                alt="Logo PT. TBK"
                className="h-9 w-auto object-contain"
                width="36"
                height="36"
              />
              <div className="flex flex-col text-left">
                <span className="font-bold text-[14px] text-[#F3EFE6] tracking-[0.06em] uppercase group-hover:text-[#C5A568] transition-colors">
                  {content.footer?.companyName || 'PT. Terbang Bersama Kawan'}
                </span>
                <span className="text-[10px] text-[#C5A568] uppercase tracking-[0.08em] font-medium">
                  Pengembang Properti Bandar Lampung
                </span>
              </div>
            </Link>

            <p className="text-[#77766F] text-[13px] leading-relaxed max-w-sm">
              {content.footer?.summary || 'Pengembang perumahan resmi berdomisili di Bandar Lampung. Mengutamakan transparansi informasi, kepastian legalitas, dan mutu hunian layak bagi masyarakat.'}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#F3EFE6]/70">
              <FileCheck2 className="w-4 h-4 text-[#C5A568] shrink-0" />
              <span>SK Kemenkumham: {content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}</span>
            </div>
          </div>

          {/* Column 2: Address & Coordinates */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3.5">
            <div className="text-xs uppercase tracking-[0.1em] text-[#C5A568] font-semibold">
              Kantor & Lokasi Proyek
            </div>
            <div className="text-[13px] text-[#F3EFE6]/80 space-y-3 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A568] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F3EFE6]">Kantor:</strong> {content.contact?.address || 'Bandar Lampung, Provinsi Lampung, Indonesia.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F3EFE6]">Proyek:</strong> {content.project?.name || 'Puri Gunung Langgar'}, {content.project?.district || 'Desa Sabah Balau, Kec. Tanjung Bintang'}, Lampung Selatan.
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-1 text-[#77766F]">
                <Phone className="w-4 h-4 text-[#C5A568] shrink-0" />
                <span>WhatsApp: {content.contact?.whatsapp || '0812-7890-1234'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#77766F]">
                <Mail className="w-4 h-4 text-[#C5A568] shrink-0" />
                <span>Email: {content.contact?.email || 'info@terbangbersamakawan.co.id'}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Google Maps Architectural Preview */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.1em] text-[#C5A568] font-semibold">
                Peta Lokasi Kantor
              </span>
              <a
                href={content.contact?.mapsUrl || "https://maps.google.com/?q=Bandar+Lampung"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11.5px] text-[#77766F] hover:text-[#C5A568] flex items-center gap-1 transition-colors"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full h-36 rounded-[4px] overflow-hidden border border-white/10 bg-[#1B1C18]">
              <iframe
                src={content.contact?.mapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127103.95764032483!2d105.19799639726562!3d-5.412499999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da473d091219%3A0x3039d80b220cc70!2sKota%20Bandar%20Lampung%2C%20Lampung!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Kantor PT. Terbang Bersama Kawan"
                className="w-full h-full opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-[11.5px] text-[#77766F]">
              Jam Operasional: {content.contact?.operatingHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}
            </p>
          </div>
        </div>

        {/* Bottom Editorial Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[#77766F] text-[12px] gap-3">
          <div>
            &copy; {new Date().getFullYear()} {content.footer?.copyrightText || 'PT. Terbang Bersama Kawan. Hak Cipta Dilindungi Undang-Undang.'}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/legalitas" className="hover:text-[#F3EFE6] transition-colors">Legalitas Perusahaan</Link>
            <Link href="/kontak" className="hover:text-[#F3EFE6] transition-colors">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
