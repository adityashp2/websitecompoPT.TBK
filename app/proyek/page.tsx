import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import { getYouTubeEmbedUrl } from '@/lib/initialData';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  Home, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Calculator, 
  Phone, 
  ShieldCheck, 
  HardHat, 
  Maximize2,
  FileText,
  Compass,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Proyek Puri Gunung Langgar | PT. Terbang Bersama Kawan',
  description: 'Informasi lengkap perumahan subsidi Puri Gunung Langgar di Desa Sabah Balau, Tanjung Bintang, Lampung Selatan. Spesifikasi unit tipe 36/72, fasilitas, lokasi strategis, dan KPR FLPP.',
};

export default function ProyekPage() {
  const content = getSiteContent();

  const slides = (content.project?.slides || []).filter(s => s && s.image && s.image.trim() !== '');

  const ytEmbedUrl = getYouTubeEmbedUrl(content.project?.videoUrl);

  const rawWa = content.contact?.whatsapp || '0812-7890-1234';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya tertarik dengan informasi unit Puri Gunung Langgar.')}`;

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#262722] flex flex-col font-sans selection:bg-[#C5A568] selection:text-[#262722]">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#262722] text-[#F3EFE6] pt-12 pb-16 px-4 border-b border-white/[0.08] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#F3EFE6]/60 mb-6">
              <Link href="/" className="hover:text-[#C5A568] transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-[#C5A568] font-semibold">Proyek Puri Gunung Langgar</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white/[0.06] border border-white/10 text-[#C5A568] text-[11px] font-semibold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{content.project.badge || 'PROYEK RESMI PERSEROAN'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>KPR FLPP Bersubsidi</span>
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3EFE6] leading-tight">
                {content.project.name || 'Puri Gunung Langgar'}
              </h1>
              <div className="flex items-center gap-2 text-[#F3EFE6]/80 text-sm sm:text-base">
                <MapPin className="w-4 h-4 text-[#C5A568] shrink-0" />
                <span>{content.project.location}, {content.project.district}, {content.project.province}</span>
              </div>
              <p className="text-[#F3EFE6]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.project.description || 'Puri Gunung Langgar merupakan perwujudan komitmen PT. Terbang Bersama Kawan dalam menghadirkan perumahan bersubsidi berkualitas dengan tata ruang tertata dan lingkungan asri di Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Highlights Bar: Open Horizontal Metrics with Thin Dividers */}
        <section className="bg-[#F3EFE6] border-b border-[#DDD8CE] py-8">
          <div className="container-editorial">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#DDD8CE]">
              <div className="pt-4 sm:pt-0 sm:pl-0 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#C5A568]" />
                  <span>Tipe Rumah</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">Tipe 36 / 72 m²</div>
                <div className="text-[11px] text-[#77766F]">Luas Bangunan &amp; Kavling</div>
              </div>

              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#C5A568]" />
                  <span>Suku Bunga KPR</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">5.0% Flat</div>
                <div className="text-[11px] text-[#77766F]">FLPP Tetap Sampai Lunas</div>
              </div>

              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A568]" />
                  <span>Legalitas Lahan</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">Sertifikat Resmi</div>
                <div className="text-[11px] text-[#77766F]">Proses Pemecahan BPN</div>
              </div>

              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5 text-[#C5A568]" />
                  <span>Status Proyek</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">Tahap Konstruksi</div>
                <div className="text-[11px] text-[#77766F]">Pematangan Lahan &amp; Struktur</div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Gallery Grid: Open Editorial Presentation */}
        <section className="py-16 sm:py-20">
          <div className="container-editorial space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DDD8CE] pb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                  Dokumentasi Kawasan
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                  Galeri Visual Puri Gunung Langgar
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#77766F] max-w-md">
                Dokumentasi asli pematangan lahan, pembangunan struktur fisik, serta lingkungan kawasan perumahan di Tanjung Bintang.
              </p>
            </div>

            {slides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {slides.map((s, idx) => (
                  <div
                    key={idx}
                    className="group space-y-3"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] border border-[#DDD8CE] bg-[#262722]">
                      <img
                        src={s.image}
                        alt={s.caption || `Foto ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-[4px] bg-[#262722]/80 backdrop-blur-sm text-[11px] font-mono font-medium text-[#F3EFE6]">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-[13px] text-[#262722] leading-relaxed">
                        {s.caption || 'Dokumentasi kawasan resmi Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan.'}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-[#77766F] pt-1">
                        <span>PT. Terbang Bersama Kawan</span>
                        {(s.caption || '').toLowerCase().includes('ilustrasi') || (s.caption || '').toLowerCase().includes('visualisasi') ? (
                          <span className="text-amber-600 font-medium">Ilustrasi Konsep</span>
                        ) : (
                          <span className="text-[#C5A568] font-medium">Dokumen Lapangan</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 border border-dashed border-[#DDD8CE] rounded-[12px]">
                <ImageIcon className="w-10 h-10 text-[#77766F]/50 mx-auto" />
                <h3 className="font-serif text-lg text-[#262722]">Belum Ada Foto Galeri</h3>
                <p className="text-xs sm:text-sm text-[#77766F] max-w-md mx-auto">
                  Dokumentasi foto kawasan belum ditambahkan. Anda dapat mengunggah foto melalui halaman Admin Panel.
                </p>
              </div>
            )}

            {/* Video Showcase jika ada */}
            {ytEmbedUrl && (
              <div className="mt-12 p-6 sm:p-8 rounded-[14px] bg-[#262722] text-[#F3EFE6] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-serif text-lg sm:text-xl text-[#F3EFE6]">
                    Video Dokumentasi Lapangan Proyek
                  </h3>
                  <span className="text-xs text-[#C5A568] font-mono uppercase tracking-wider">
                    YouTube Official PT. TBK
                  </span>
                </div>
                <div className="aspect-video w-full rounded-[10px] overflow-hidden bg-black border border-white/10">
                  <iframe
                    src={ytEmbedUrl}
                    title="Video Dokumentasi Proyek"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Detailed Unit Specs & Blueprint: Open Architectural Layout */}
        <section className="py-16 sm:py-20 bg-white/40 border-t border-b border-[#DDD8CE]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left: Spesifikasi Teknis (Open List with Thin Dividers) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                    Standar Bangunan
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                    Spesifikasi Teknis Hunian
                  </h2>
                  <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                    Setiap unit dibangun dengan material berstandar teknis agar tahan lama, aman, dan nyaman ditinggali keluarga Anda.
                  </p>
                </div>

                <div className="divide-y divide-[#DDD8CE]">
                  {content.project.specs?.map((spec, i) => (
                    <div
                      key={i}
                      className="py-3.5 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <span className="text-[#77766F] font-normal">{spec.label}</span>
                      <span className="font-medium text-[#262722] text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-l-2 border-[#C5A568] pl-4 py-2 text-xs text-[#77766F] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A568] shrink-0 mt-0.5" />
                  <span>
                    Spesifikasi mengacu pada ketentuan teknis rumah sederhana sehat Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR).
                  </span>
                </div>
              </div>

              {/* Right: Denah & Pembagian Ruang (Open List, Aligned Grid) */}
              <div className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-[#DDD8CE] space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                    Denah Tata Ruang
                  </span>
                  <h3 className="font-serif text-2xl text-[#262722]">
                    Pembagian Ruang Unit Tipe 36/72
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                    Dirancang optimal untuk efisiensi ruang dan sirkulasi udara alami:
                  </p>
                </div>

                <div className="divide-y divide-[#DDD8CE] text-xs sm:text-sm">
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#77766F]">Kamar Tidur Utama</span>
                    <span className="font-medium text-[#262722]">3.00 × 3.00 m</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#77766F]">Kamar Tidur Anak</span>
                    <span className="font-medium text-[#262722]">3.00 × 2.75 m</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#77766F]">Ruang Tamu &amp; Keluarga</span>
                    <span className="font-medium text-[#262722]">Terbuka &amp; Fleksibel</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#77766F]">Kamar Mandi / WC</span>
                    <span className="font-medium text-[#262722]">1.50 × 1.50 m</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#77766F]">Halaman Depan &amp; Carport</span>
                    <span className="font-medium text-[#262722]">Tersedia Area Parkir</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#77766F]">Sisa Lahan Belakang</span>
                    <span className="font-medium text-[#262722]">Bisa untuk Dapur / Taman</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Link
                    href="/simulasi-kpr"
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99] text-center"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Hitung Simulasi Angsuran KPR</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] border border-[#262722]/30 hover:border-[#C5A568] hover:bg-[#C5A568]/10 text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99] text-center"
                  >
                    <Phone className="w-4 h-4 text-[#C5A568]" />
                    <span>Tanya Ketersediaan Kavling</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Keunggulan Lokasi: Open 3-Column Editorial Grid with Vertical Dividers */}
        <section className="py-16 sm:py-20">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                Aksesibilitas Kawasan
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                Nilai Strategis Kawasan Puri Gunung Langgar
              </h2>
              <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                Lokasi berkembang di Desa Sabah Balau yang menjanjikan kemudahan akses dan kenaikan nilai investasi jangka panjang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 md:divide-x md:divide-[#DDD8CE]">
              <div className="space-y-3">
                <span className="font-serif text-3xl text-[#C5A568] block">01</span>
                <h3 className="font-serif text-xl text-[#262722]">Dekat Perbatasan Kota</h3>
                <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                  Akses lancar menuju pusat perkantoran, perbelanjaan, dan fasilitas umum di Kota Bandar Lampung maupun Sukarame.
                </p>
              </div>

              <div className="md:pl-10 space-y-3">
                <span className="font-serif text-3xl text-[#C5A568] block">02</span>
                <h3 className="font-serif text-xl text-[#262722]">Lingkungan Asri &amp; Bebas Banjir</h3>
                <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                  Kontur tanah berbukit yang terbebas dari genangan air banjir, dengan sirkulasi udara segar alami perbukitan.
                </p>
              </div>

              <div className="md:pl-10 space-y-3">
                <span className="font-serif text-3xl text-[#C5A568] block">03</span>
                <h3 className="font-serif text-xl text-[#262722]">Infrastruktur Terpadu</h3>
                <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                  Jalan lingkungan memadai untuk akses kendaraan roda empat, jaringan drainase kawasan, dan fasilitas listrik PLN.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Teaser: Architectural Charcoal CTA Banner */}
        <section className="py-16 sm:py-20 bg-[#262722] text-[#F3EFE6]">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F3EFE6] max-w-xl mx-auto">
              Jadwalkan Survei Lokasi Proyek Sekarang
            </h2>
            <p className="text-[#F3EFE6]/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Tim lapangan PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
              >
                <span>Isi Formulir Survei</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] border border-white/20 hover:border-[#C5A568] hover:bg-[#C5A568]/10 text-[#F3EFE6] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
              >
                <span>WhatsApp Pemasaran</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
