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
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#0E1014] text-white pt-12 pb-16 px-4 border-b border-white/[0.08] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C9A96A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="container-std relative z-10 max-w-[1120px] mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/60 mb-6">
              <Link href="/" className="hover:text-[#C9A96A] transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-[#C9A96A] font-semibold">Proyek Puri Gunung Langgar</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-[#C9A96A]/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{content.project.badge || 'PROYEK RESMI PERSEROAN'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>KPR FLPP Bersubsidi</span>
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight">
                {content.project.name || 'Puri Gunung Langgar'}
              </h1>
              <div className="flex items-center gap-2 text-white/80 text-sm sm:text-base">
                <MapPin className="w-4 h-4 text-[#C9A96A] shrink-0" />
                <span>{content.project.location}, {content.project.district}, {content.project.province}</span>
              </div>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.project.description || 'Puri Gunung Langgar merupakan perwujudan komitmen PT. Terbang Bersama Kawan dalam menghadirkan perumahan bersubsidi berkualitas dengan tata ruang tertata dan lingkungan asri di Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Highlights Bar */}
        <section className="bg-white border-b border-slate-200 py-6 shadow-sm">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-semibold text-slate-500">Tipe Rumah</div>
                  <div className="text-base font-bold text-slate-900">Tipe 36 / 72 m²</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-semibold text-slate-500">Suku Bunga KPR</div>
                  <div className="text-base font-bold text-slate-900">5.0% Flat Tenor</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-semibold text-slate-500">Legalitas Tanah</div>
                  <div className="text-base font-bold text-slate-900">Sertifikat Terjamin</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-semibold text-slate-500">Status Lahan</div>
                  <div className="text-base font-bold text-slate-900">Tahap Konstruksi</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Gallery Grid */}
        <section className="py-14 sm:py-16">
          <div className="container-std max-w-[1120px] mx-auto space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                GALERI & VISUAL KAWASAN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dokumentasi Proyek Puri Gunung Langgar
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Foto-foto asli pematangan lahan, pembangunan struktur, serta lingkungan kawasan perumahan.
              </p>
            </div>

            {slides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      <img
                        src={s.image}
                        alt={s.caption || `Foto ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-[11px] font-semibold text-white">
                        Foto #{idx + 1}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {s.caption || 'Dokumentasi kawasan resmi Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan.'}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>PT. Terbang Bersama Kawan</span>
                        <span className="text-[#C9A96A] font-semibold">Resmi</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">Belum Ada Foto Galeri</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Dokumentasi foto kawasan belum ditambahkan. Anda dapat mengunggah foto melalui halaman Admin Panel.
                </p>
              </div>
            )}

            {/* Video Showcase jika ada */}
            {ytEmbedUrl && (
              <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg font-bold text-[#F4EFE6]">
                    Video Dokumentasi Lapangan Proyek
                  </h3>
                  <span className="text-xs text-[#C9A96A] font-mono uppercase tracking-wider">
                    YouTube Official
                  </span>
                </div>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
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

        {/* Detailed Unit Specs & Blueprint */}
        <section className="py-14 bg-white border-t border-b border-slate-200">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left: Spesifikasi Teknis */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                    RINCIAN BANGUNAN
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Spesifikasi Teknis Hunian
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Setiap unit dibangun dengan material berstandar teknis agar tahan lama, aman, dan nyaman ditinggali keluarga Anda.
                  </p>
                </div>

                <div className="space-y-3">
                  {content.project.specs?.map((spec, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs sm:text-sm hover:border-amber-300 transition-colors"
                    >
                      <span className="text-slate-600 font-medium">{spec.label}</span>
                      <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Spesifikasi mengacu pada ketentuan teknis rumah sederhana sehat Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR).
                  </span>
                </div>
              </div>

              {/* Right: Denah & Pembagian Ruang */}
              <div className="lg:col-span-5 bg-[#FBF9F5] p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-[#C9A96A] text-xs font-bold uppercase tracking-wider mb-3">
                    <Home className="w-3.5 h-3.5" />
                    <span>Tipe 36/72</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Pembagian Ruang Unit
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Dirancang optimal untuk efisiensi ruang dan sirkulasi udara alami:
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Kamar Tidur Utama</span>
                    <span className="font-bold text-slate-900">3.00 × 3.00 m</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Kamar Tidur Anak</span>
                    <span className="font-bold text-slate-900">3.00 × 2.75 m</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Ruang Tamu & Keluarga</span>
                    <span className="font-bold text-slate-900">Terbuka & Fleksibel</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Kamar Mandi / WC</span>
                    <span className="font-bold text-slate-900">1.50 × 1.50 m</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Halaman Depan & Carport</span>
                    <span className="font-bold text-slate-900">Tersedia Area Parkir</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Sisa Lahan Belakang</span>
                    <span className="font-bold text-slate-900">Bisa untuk Dapur / Taman</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <Link
                    href="/simulasi-kpr"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-[#C9A96A] hover:text-[#0E1014] text-white font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Hitung Simulasi Angsuran KPR</span>
                  </Link>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Tanya Ketersediaan Kavling via WA</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Keunggulan Lokasi */}
        <section className="py-16 bg-[#FBF9F5]">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                AKSESIBILITAS LOKASI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Nilai Strategis Kawasan Puri Gunung Langgar
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Lokasi berkembang di Desa Sabah Balau yang menjanjikan kenaikan nilai investasi jangka panjang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Dekat Perbatasan Kota</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Akses lancar menuju pusat perkantoran, perbelanjaan, dan fasilitas umum di Kota Bandar Lampung maupun Sukarame.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Lingkungan Asri & Bebas Banjir</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Kontur tanah berbukit yang terbebas dari genangan air banjir, dengan sirkulasi udara segar pegunungan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Infrastruktur Terpadu</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Jalan lingkungan memadai untuk akses kendaraan roda empat, jaringan drainase kawasan, dan fasilitas listrik PLN.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Teaser */}
        <section className="py-14 bg-[#0E1014] text-white">
          <div className="container-std max-w-[1120px] mx-auto text-center space-y-5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EFE6]">
              Jadwalkan Survei Lokasi Proyek Sekarang
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto">
              Tim lapangan PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/kontak"
                className="px-6 py-3 rounded-xl bg-[#C9A96A] hover:bg-amber-500 text-[#0E1014] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Isi Formulir Survei
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                WhatsApp Pemasaran
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
