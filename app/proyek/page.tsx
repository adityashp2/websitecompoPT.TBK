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
    <div className="min-h-screen bg-white text-[#102D52] flex flex-col font-sans selection:bg-[#FF9D2E] selection:text-[#102D52]">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white pt-12 pb-16 px-4 border-b border-white/10 relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70 mb-6">
              <Link href="/" className="hover:text-[#FF9D2E] transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-[#FF9D2E] font-bold">Proyek Puri Gunung Langgar</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-[11px] font-medium tracking-wide">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{content.project.badge || 'Proyek Resmi Perseroan'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15966A]/20 border border-[#15966A]/40 text-[#15966A] text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#15966A] animate-pulse" />
                  <span>KPR FLPP Bersubsidi</span>
                </span>
              </div>

              <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[46px] tracking-tight text-white leading-[1.15]">
                {content.project.name || 'Puri Gunung Langgar'}
              </h1>
              <div className="flex items-center gap-2 text-white/85 text-sm sm:text-base font-sans">
                <MapPin className="w-4 h-4 text-[#FF9D2E] shrink-0" />
                <span>{content.project.location}, {content.project.district}, {content.project.province}</span>
              </div>
              <p className="font-sans text-white/85 text-[15px] sm:text-base leading-relaxed max-w-2xl">
                {content.project.description || 'Puri Gunung Langgar merupakan perwujudan komitmen PT. Terbang Bersama Kawan dalam menghadirkan perumahan bersubsidi berkualitas dengan tata ruang tertata dan lingkungan asri di Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Highlights Bar */}
        <section className="bg-[#F4F7FC] border-b border-[#DCE7F5] py-8">
          <div className="container-editorial">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#DCE7F5]">
              <div className="pt-4 sm:pt-0 sm:pl-0 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#073B78]" />
                  <span>Tipe Rumah</span>
                </div>
                <div className="font-semibold text-xl sm:text-2xl text-[#102D52]">Tipe 36 / 72 m²</div>
                <div className="text-[11.5px] text-[#526783]">Luas Bangunan &amp; Kavling</div>
              </div>

              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#15966A]" />
                  <span>Suku Bunga KPR</span>
                </div>
                <div className="font-semibold text-xl sm:text-2xl text-[#15966A]">5.0% Flat</div>
                <div className="text-[11.5px] text-[#526783]">FLPP Tetap Sampai Lunas</div>
              </div>

              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#073B78]" />
                  <span>Legalitas Lahan</span>
                </div>
                <div className="font-semibold text-xl sm:text-2xl text-[#102D52]">Sertifikat Resmi</div>
                <div className="text-[11.5px] text-[#526783]">Proses Pemecahan BPN</div>
              </div>

              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5 text-[#FF9D2E]" />
                  <span>Status Proyek</span>
                </div>
                <div className="font-semibold text-xl sm:text-2xl text-[#FF9D2E]">Tahap Konstruksi</div>
                <div className="text-[11.5px] text-[#526783]">Pematangan Lahan &amp; Struktur</div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Gallery Grid */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-editorial space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE7F5] pb-6">
              <div>
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>Dokumentasi Kawasan</span>
                </div>
                <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                  Galeri Visual Puri Gunung Langgar
                </h2>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#526783] max-w-md">
                Dokumentasi asli pematangan lahan, pembangunan struktur fisik, serta lingkungan kawasan perumahan di Tanjung Bintang.
              </p>
            </div>

            {slides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {slides.map((s, idx) => (
                  <div
                    key={idx}
                    className="group space-y-3 bg-[#F4F7FC] p-4 rounded-2xl border border-[#DCE7F5] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[#DCE7F5] bg-[#073B78]">
                      <img
                        src={s.image}
                        alt={s.caption || `Foto ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#073B78]/85 backdrop-blur-sm text-[11px] font-mono font-bold text-white">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-[13.5px] text-[#102D52] font-semibold leading-relaxed">
                        {s.caption || 'Dokumentasi kawasan resmi Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan.'}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-[#526783] pt-1">
                        <span>PT. Terbang Bersama Kawan</span>
                        {(s.caption || '').toLowerCase().includes('ilustrasi') || (s.caption || '').toLowerCase().includes('visualisasi') ? (
                          <span className="text-[#FF9D2E] font-bold">Ilustrasi Konsep</span>
                        ) : (
                          <span className="text-[#15966A] font-bold">Dokumen Lapangan</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 border border-dashed border-[#DCE7F5] rounded-2xl">
                <ImageIcon className="w-10 h-10 text-[#526783]/50 mx-auto" />
                <h3 className="font-bold text-lg text-[#102D52]">Belum Ada Foto Galeri</h3>
                <p className="text-xs sm:text-sm text-[#526783] max-w-md mx-auto">
                  Dokumentasi foto kawasan belum ditambahkan.
                </p>
              </div>
            )}

            {/* Video Showcase jika ada */}
            {ytEmbedUrl && (
              <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#073B78] to-[#102D52] text-white space-y-4 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-bold text-lg sm:text-xl text-white">
                    Video Dokumentasi Lapangan Proyek
                  </h3>
                  <span className="text-xs text-[#FF9D2E] font-mono uppercase tracking-wider font-bold">
                    YouTube Official PT. TBK
                  </span>
                </div>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
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

        {/* Detailed Unit Specs */}
        <section className="py-16 sm:py-24 bg-[#F4F7FC] border-t border-b border-[#DCE7F5]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left: Spesifikasi Teknis */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Standar Bangunan</span>
                  </div>
                  <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                    Spesifikasi Teknis Hunian
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                    Setiap unit dibangun dengan material berstandar teknis agar tahan lama, aman, dan nyaman ditinggali keluarga Anda.
                  </p>
                </div>

                <div className="divide-y divide-[#DCE7F5]">
                  {content.project.specs?.map((spec, i) => (
                    <div
                      key={i}
                      className="py-3.5 flex items-center justify-between text-xs sm:text-[13.5px]"
                    >
                      <span className="text-[#526783] font-medium">{spec.label}</span>
                      <span className="font-semibold text-[#102D52] text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-l-4 border-[#15966A] bg-[#E6F7F3] rounded-r-xl pl-4 py-2 text-xs text-[#102D52] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15966A] shrink-0 mt-0.5" />
                  <span className="font-sans">
                    Spesifikasi mengacu pada ketentuan teknis rumah sederhana sehat Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR).
                  </span>
                </div>
              </div>

              {/* Right: Denah Tata Ruang */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Denah Tata Ruang</span>
                  </div>
                  <h3 className="font-serif font-normal text-2xl text-[#102D52]">
                    Pembagian Ruang Tipe 36/72
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                    Dirancang optimal untuk efisiensi ruang dan sirkulasi udara alami:
                  </p>
                </div>

                <div className="divide-y divide-[#DCE7F5] text-xs sm:text-[13.5px]">
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#526783] font-medium">Kamar Tidur Utama</span>
                    <span className="font-semibold text-[#102D52]">3.00 × 3.00 m</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#526783] font-medium">Kamar Tidur Anak</span>
                    <span className="font-semibold text-[#102D52]">3.00 × 2.75 m</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#526783] font-medium">Ruang Tamu &amp; Keluarga</span>
                    <span className="font-semibold text-[#102D52]">Terbuka &amp; Fleksibel</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#526783] font-medium">Kamar Mandi / WC</span>
                    <span className="font-semibold text-[#102D52]">1.50 × 1.50 m</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#526783] font-medium">Halaman Depan &amp; Carport</span>
                    <span className="font-semibold text-[#102D52]">Tersedia Area Parkir</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#526783] font-medium">Sisa Lahan Belakang</span>
                    <span className="font-semibold text-[#102D52]">Bisa untuk Dapur / Taman</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Link
                    href="/simulasi-kpr"
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-xs font-semibold tracking-normal transition-all duration-200 hover:-translate-y-[1px] shadow-sm text-center"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Hitung Simulasi Angsuran KPR</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#073B78] hover:bg-[#073B78] hover:text-white text-[#073B78] text-xs font-semibold tracking-normal transition-all duration-200 text-center"
                  >
                    <Phone className="w-4 h-4 text-[#FF9D2E]" />
                    <span>Tanya Ketersediaan Kavling</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Keunggulan Lokasi */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Aksesibilitas Kawasan</span>
              </div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                Nilai Strategis Kawasan Puri Gunung Langgar
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                Lokasi berkembang di Desa Sabah Balau yang menjanjikan kemudahan akses dan kenaikan nilai investasi jangka panjang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] space-y-3">
                <span className="font-serif text-3xl text-[#073B78] block">01</span>
                <h3 className="font-semibold text-lg text-[#102D52]">Dekat Perbatasan Kota</h3>
                <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                  Akses lancar menuju pusat perkantoran, perbelanjaan, dan fasilitas umum di Kota Bandar Lampung maupun Sukarame.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] space-y-3">
                <span className="font-serif text-3xl text-[#073B78] block">02</span>
                <h3 className="font-semibold text-lg text-[#102D52]">Lingkungan Asri &amp; Bebas Banjir</h3>
                <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                  Kontur tanah berbukit yang terbebas dari genangan air banjir, dengan sirkulasi udara segar alami perbukitan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] space-y-3">
                <span className="font-serif text-3xl text-[#073B78] block">03</span>
                <h3 className="font-semibold text-lg text-[#102D52]">Infrastruktur Terpadu</h3>
                <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                  Jalan lingkungan memadai untuk akses kendaraan roda empat, jaringan drainase kawasan, dan fasilitas listrik PLN.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Teaser CTA Banner */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-4xl text-white max-w-xl mx-auto">
              Jadwalkan Survei Lokasi Proyek Sekarang
            </h2>
            <p className="font-sans text-white/85 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Tim lapangan PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-xs font-semibold tracking-normal transition-all duration-200 hover:-translate-y-[1px] shadow-lg"
              >
                <span>Isi Formulir Survei</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/40 hover:border-white hover:bg-white/10 text-white text-xs font-semibold tracking-normal transition-all duration-200"
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
