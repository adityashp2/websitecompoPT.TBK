'use client';

import React from 'react';
import Link from 'next/link';
import { SiteContent } from '@/lib/initialData';
import { MapPin, Phone, Mail, FileCheck2, ArrowRight, ExternalLink } from 'lucide-react';

interface FooterProps {
  content: SiteContent;
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-[#0A0C10] text-slate-400 py-14 border-t border-white/[0.08] text-xs sm:text-sm">
      <div className="container-std">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 pb-10 border-b border-white/[0.08]">
          {/* Column 1: Profil Perseroan */}
          <div className="md:col-span-12 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src={content.meta?.logo || "/assets/logo-tbk.png"}
                alt="Logo PT. TBK"
                className="h-10 w-auto object-contain"
                width="40"
                height="40"
              />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-base sm:text-lg text-[#F4EFE6] tracking-tight group-hover:text-[#C9A96A] transition-colors">
                  {content.footer?.companyName || 'PT. Terbang Bersama Kawan'}
                </span>
                <span className="text-[11px] text-[#C9A96A] font-medium tracking-wide uppercase">
                  Pengembang Perumahan Resmi
                </span>
              </div>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs sm:text-[13px]">
              {content.footer?.summary || 'Pengembang perumahan resmi, amanah, dan berkualitas berdomisili di Bandar Lampung. Mengutamakan transparansi, kepuasan konsumen, dan legalitas sah.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
              <FileCheck2 className="w-4 h-4 text-[#C9A96A] shrink-0" />
              <span>SK Kemenkumham RI: {content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}</span>
            </div>
          </div>

          {/* Column 2: Kantor & Lokasi Proyek */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3">
            <div className="font-bold text-[#C9A96A] uppercase tracking-wider text-xs">
              Kantor & Lokasi Proyek
            </div>
            <div className="text-slate-300 leading-relaxed text-xs sm:text-[13px] space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <span>
                  <strong>Kantor:</strong> {content.contact?.address || 'Bandar Lampung, Provinsi Lampung, Indonesia.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Proyek:</strong> {content.project?.location || 'Puri Gunung Langgar'}, {content.project?.district || 'Desa Sabah Balau, Kec. Tanjung Bintang'}, Lampung Selatan.
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <Phone className="w-4 h-4 text-[#C9A96A] shrink-0" />
                <span>WhatsApp: {content.contact?.whatsapp || '0812-7890-1234'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-[#C9A96A] shrink-0" />
                <span>Email: {content.contact?.email || 'info@terbangbersamakawan.co.id'}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Peta Lokasi Kantor (Google Maps Embed) */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[#C9A96A] uppercase tracking-wider text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>Peta Lokasi Kantor</span>
              </div>
              <a
                href={content.contact?.mapsUrl || "https://maps.google.com/?q=Bandar+Lampung"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-[#C9A96A] flex items-center gap-1 transition-colors"
                title="Buka rute navigasi di Google Maps"
              >
                <span>Buka Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Google Maps Embed Container */}
            <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#14161A] group">
              <iframe
                src={content.contact?.mapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127103.95764032483!2d105.19799639726562!3d-5.412499999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da473d091219%3A0x3039d80b220cc70!2sKota%20Bandar%20Lampung%2C%20Lampung!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Kantor PT. Terbang Bersama Kawan"
                className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute bottom-2.5 right-2.5 pointer-events-auto">
                <a
                  href={content.contact?.mapsUrl || "https://maps.google.com/?q=Bandar+Lampung"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#0E1014]/90 hover:bg-[#C9A96A] hover:text-[#0E1014] text-white text-[11px] font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C9A96A]" />
                  <span>Petunjuk Arah</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              {content.contact?.address || 'Bandar Lampung, Provinsi Lampung, Indonesia'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-4">
          <div>
            &copy; {new Date().getFullYear()} {content.footer?.copyrightText || 'Hak Cipta Dilindungi Undang-Undang. PT. Terbang Bersama Kawan (PT. TBK).'}
          </div>
          <div className="flex items-center gap-4">
            <span>Bandar Lampung, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
