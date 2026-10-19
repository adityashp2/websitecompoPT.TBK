import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import { getYouTubeEmbedUrl } from '@/lib/initialData';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import ClientProyekGallery from './ClientProyekGallery';
import { 
  Home, 
  MapPin, 
  CheckCircle2, 
  Calculator, 
  Phone, 
  ShieldCheck, 
  HardHat, 
  Compass, 
  ArrowRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Perumahan Puri Gunung Langgar Tipe 36/72 | Rumah Subsidi Lampung - PT. TBK',
  description: 'Informasi lengkap spesifikasi rumah subsidi Puri Gunung Langgar tipe 36/72 di Desa Sabah Balau, Tanjung Bintang, Lampung Selatan. Fasilitas jalan cor beton, air sumur bor, listrik PLN, dan skema KPR FLPP bunga 5% tetap.',
  keywords: [
    'Puri Gunung Langgar',
    'Rumah Subsidi Tipe 36/72 Lampung',
    'Perumahan Subsidi Tanjung Bintang',
    'Rumah Murah Sabah Balau Lampung',
    'Harga Rumah Subsidi Lampung 2026',
    'Brosur Puri Gunung Langgar PT TBK'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id/proyek',
  },
  openGraph: {
    title: 'Perumahan Puri Gunung Langgar Tipe 36/72 | PT. Terbang Bersama Kawan',
    description: 'Rumah subsidi berkualitas berstandar PUPR di Tanjung Bintang, Lampung Selatan. Angsuran mulai 1 jutaan/bulan.',
    url: 'https://terbangbersamakawan.co.id/proyek',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
};

export default async function ProyekPage() {
  const content = await getSiteContent();

  const slides = (content.project?.slides || []).filter(s => s && s.image && s.image.trim() !== '');
  const ytEmbedUrl = getYouTubeEmbedUrl(content.project?.videoUrl);

  const rawWa = content.contact?.whatsapp?.trim() || '';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const hasWa = cleanPhone.length >= 7;
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = hasWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya tertarik dengan informasi unit Puri Gunung Langgar.')}`
    : '';

  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header (Bugatti Austere Display) */}
        <section className="bg-[#000000] text-white pt-20 pb-24 px-6 border-b border-[#262626] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-[#999999] mb-8">
              <Link href="/" className="hover:text-white transition-colors">BERANDA</Link>
              <span>/</span>
              <span className="text-white">PROYEK PURI GUNUNG LANGGAR</span>
            </nav>

            <div className="max-w-4xl space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[#262626] text-white">
                  {content.project.badge || 'PROYEK RESMI PERSEROAN'}
                </span>
                <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-white/60 text-white">
                  KPR FLPP BERSUBSIDI 5%
                </span>
              </div>

              <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[70px] uppercase tracking-[3px] text-white leading-[1.08]">
                {content.project.name || 'Puri Gunung Langgar'}
              </h1>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">
                <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{content.project.location}, {content.project.district}, {content.project.province}</span>
              </div>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl pt-2">
                {content.project.description || 'Puri Gunung Langgar merupakan perwujudan komitmen PT. Terbang Bersama Kawan dalam menghadirkan perumahan bersubsidi berkualitas dengan tata ruang tertata dan lingkungan asri di Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Highlights Bar (Bugatti Spec Cells) */}
        <section className="bg-[#0d0d0d] border-b border-[#262626] py-10">
          <div className="container-editorial">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#262626]">
              {(content.project.highlights && content.project.highlights.length > 0
                ? content.project.highlights
                : [
                    { label: "TIPE UNIT", value: "36 / 72 m²", subtext: "Luas Bangunan & Kavling", icon: "home" },
                    { label: "SUKU BUNGA", value: "5.0% FLAT", subtext: "FLPP Tetap Sampai Lunas", icon: "calculator" },
                    { label: "LEGALITAS", value: "SHM", subtext: "Sertifikat Hak Milik", icon: "shield" },
                    { label: "STATUS FISIK", value: "OPERASIONAL", subtext: "Pematangan Lahan & Struktur", icon: "hardhat" }
                  ]
              ).map((hl, idx) => (
                <div key={idx} className={`pt-4 sm:pt-0 ${idx > 0 ? 'sm:pl-8' : 'sm:pl-0'} space-y-1.5`}>
                  <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999] flex items-center gap-1.5">
                    {hl.label}
                  </div>
                  <div className="font-display font-normal text-2xl sm:text-3xl uppercase tracking-[1.5px] text-white">{hl.value}</div>
                  <div className="font-serif text-xs text-[#999999]">{hl.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Gallery Grid */}
        <section id="galeri" className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#262626] pb-8">
              <div>
                <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                  DOKUMENTASI KAWASAN
                </span>
                <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                  Galeri Visual Proyek
                </h2>
              </div>
              <p className="font-serif text-sm text-[#999999] max-w-md">
                Dokumentasi asli pematangan lahan, pembangunan struktur fisik, serta lingkungan kawasan perumahan di Tanjung Bintang.
              </p>
            </div>

            {/* Interactive Lightbox Visual Gallery */}
            <ClientProyekGallery
              slides={slides}
              projectName={content.project?.name || 'Puri Gunung Langgar'}
              whatsappNumber={content.contact?.whatsapp}
            />

            {/* Video Showcase jika ada */}
            {ytEmbedUrl && (
              <div className="mt-16 card-bugatti p-8 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-display font-normal text-xl uppercase tracking-[2px] text-white">
                    Video Dokumentasi Lapangan Proyek
                  </h3>
                  <span className="font-mono text-xs text-[#999999] uppercase tracking-[2px]">
                    OFFICIAL VIDEO PT. TBK
                  </span>
                </div>
                <div className="aspect-video w-full bg-black border border-[#262626]">
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
        <section className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left: Spesifikasi Teknis */}
              <div className="lg:col-span-7 card-bugatti p-8 sm:p-10 space-y-6">
                <div>
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                    STANDAR BANGUNAN
                  </span>
                  <h2 className="font-display font-normal text-2xl sm:text-4xl uppercase tracking-[2px] text-white">
                    Spesifikasi Teknis Hunian
                  </h2>
                  <p className="font-serif text-sm text-[#999999] mt-2 leading-relaxed">
                    Setiap unit dibangun dengan material berstandar teknis agar tahan lama, aman, dan nyaman ditinggali keluarga Anda.
                  </p>
                </div>

                <div className="divide-y divide-[#262626]">
                  {content.project.specs?.map((spec, i) => (
                    <div
                      key={i}
                      className="py-3.5 flex items-center justify-between text-sm"
                    >
                      <span className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">{spec.label}</span>
                      <span className="font-serif text-white text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#141414] border border-[#262626] font-mono text-xs tracking-[1px] uppercase text-[#cccccc] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>
                    Spesifikasi mengacu pada ketentuan teknis rumah sederhana sehat Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR).
                  </span>
                </div>
              </div>

              {/* Right: Denah Tata Ruang */}
              <div className="lg:col-span-5 card-bugatti p-8 sm:p-10 space-y-6">
                <div>
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                    DENAH TATA RUANG
                  </span>
                  <h3 className="font-display font-normal text-2xl uppercase tracking-[2px] text-white">
                    Pembagian Ruang {content.project?.type || 'Tipe 36/72'}
                  </h3>
                  <p className="font-serif text-sm text-[#999999] mt-2 leading-relaxed">
                    Dirancang optimal untuk efisiensi ruang dan sirkulasi udara alami:
                  </p>
                </div>

                <div className="divide-y divide-[#262626] text-sm">
                  {(content.project.floorPlan && content.project.floorPlan.length > 0
                    ? content.project.floorPlan
                    : [
                        { label: "Kamar Tidur Utama", value: "3.00 × 3.00 m" },
                        { label: "Kamar Tidur Anak", value: "3.00 × 2.75 m" },
                        { label: "Ruang Tamu & Keluarga", value: "Terbuka & Fleksibel" },
                        { label: "Kamar Mandi / WC", value: "1.50 × 1.50 m" },
                        { label: "Halaman Depan & Carport", value: "Tersedia Area Parkir" },
                        { label: "Sisa Lahan Belakang", value: "Bisa untuk Dapur / Taman" }
                      ]
                  ).map((fp, i) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-[1.5px] text-[#999999]">{fp.label}</span>
                      <span className="font-serif text-white">{fp.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <Link
                    href="/simulasi-kpr"
                    className="w-full btn-bugatti-primary justify-center"
                  >
                    <span>HITUNG SIMULASI KPR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {hasWa && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-bugatti-primary justify-center border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>KONSULTASI KAVLING VIA WHATSAPP</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Keunggulan Lokasi */}
        <section className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="max-w-2xl mb-16">
              <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                AKSESIBILITAS KAWASAN
              </span>
              <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                Nilai Strategis Kawasan
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#999999] mt-2 leading-relaxed">
                Lokasi berkembang di {content.project.location || 'Desa Sabah Balau'} yang menjanjikan kemudahan akses dan kenaikan nilai investasi jangka panjang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.project.locationAdvantages && content.project.locationAdvantages.length > 0
                ? content.project.locationAdvantages
                : [
                    {
                      number: "01",
                      title: "Dekat Perbatasan Kota",
                      desc: "Akses lancar menuju pusat perkantoran, perbelanjaan, dan fasilitas umum di Kota Bandar Lampung maupun Sukarame."
                    },
                    {
                      number: "02",
                      title: "Lingkungan Asri & Bebas Banjir",
                      desc: "Kontur tanah berbukit yang terbebas dari genangan air banjir, dengan sirkulasi udara segar alami perbukitan."
                    },
                    {
                      number: "03",
                      title: "Infrastruktur Terpadu",
                      desc: "Jalan lingkungan memadai untuk akses kendaraan roda empat, jaringan drainase kawasan, dan fasilitas listrik PLN."
                    }
                  ]
              ).map((adv, idx) => (
                <div key={idx} className="card-bugatti p-8 space-y-3 group">
                  <span className="font-display text-4xl text-white tracking-[2px] block">{adv.number || `0${idx + 1}`}</span>
                  <h3 className="font-display font-normal text-xl uppercase tracking-[1.5px] text-white">{adv.title}</h3>
                  <p className="font-serif text-sm text-[#999999] leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action Teaser CTA Banner (Bugatti Pre-footer Band) */}
        <section className="py-24 bg-[#0d0d0d] text-white border-b border-[#262626]">
          <div className="container-editorial text-center space-y-6">
            <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block">
              JADWALKAN SURVEI
            </span>
            <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white max-w-2xl mx-auto">
              {content.project.surveyCta?.title || 'Jadwalkan Kunjungan Lokasi Sekarang'}
            </h2>
            <p className="font-serif text-[#cccccc] text-base max-w-xl mx-auto leading-relaxed">
              {content.project.surveyCta?.subtitle || 'Tim pemasaran PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/kontak"
                className="btn-bugatti-primary"
              >
                <span>{content.project.surveyCta?.buttonText || 'FORMULIR SURVEI'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {hasWa && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bugatti-primary border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                >
                  <span>{content.project.surveyCta?.waButtonText || 'WHATSAPP PEMASARAN'}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
