'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  HardHat,
  Scale,
  MapPin,
  Calendar,
  FileCheck2,
  Home
} from 'lucide-react';
import Header from './Navbar';
import Footer from './Footer';
import PromoBannerCarousel from './PromoBannerCarousel';
import PartnersCarousel from './PartnersCarousel';
import {
  HeaderHousesIllustration,
  Step1ConsultationIllustration,
  Step2DocumentIllustration,
  Step3BankIllustration,
  Step4HandshakeIllustration,
} from './BuyingProcessIllustrations';
import PromoPopupModal from './PromoPopupModal';
import type { LookbookItem } from './LookbookModal';
import { SiteContent, initialSiteContent, upgradeGoogleImageUrl } from '@/lib/initialData';

const LookbookModal = dynamic(() => import('./LookbookModal'), { ssr: false });

interface ClientLandingPageProps {
  initialContent?: SiteContent;
}

export default function ClientLandingPage({ initialContent }: ClientLandingPageProps) {
  const content = initialContent || initialSiteContent;

  const [lightbox, setLightbox] = useState<{
    open: boolean;
    currentIndex: number;
    items: LookbookItem[];
  }>({
    open: false,
    currentIndex: 0,
    items: [],
  });

  // KPR Calculator States
  const [kprHarga, setKprHarga] = useState<number>(185000000);
  const [kprDp, setKprDp] = useState<number>(2000000);
  const [kprTenor, setKprTenor] = useState<number>(20);

  const kprPokok = Math.max(0, kprHarga - kprDp);
  const kprBungaPerTahun = 0.05;
  const kprBulan = kprTenor * 12;
  const kprBungaBulanan = kprBungaPerTahun / 12;

  const kprAngsuran =
    kprPokok > 0 && kprBulan > 0
      ? Math.round(
          (kprPokok * kprBungaBulanan * Math.pow(1 + kprBungaBulanan, kprBulan)) /
            (Math.pow(1 + kprBungaBulanan, kprBulan) - 1)
        )
      : 0;
  const kprPerHari = Math.round(kprAngsuran / 30);

  const rawWa = content.contact?.whatsapp || '';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const hasWa = cleanPhone.length >= 7;
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = hasWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin konsultasi mengenai perumahan Puri Gunung Langgar.')}`
    : '';

  const rawLeadershipMembers = Array.isArray(content.leadership?.members)
    ? content.leadership.members
    : (initialSiteContent.leadership?.members || []);

  const primaryLeaders = rawLeadershipMembers.filter(
    (m) => m.role.toLowerCase().includes('komisaris') || m.role.toLowerCase().includes('direktur utama')
  );
  const displayPrimaryLeaders = primaryLeaders.length > 0 ? primaryLeaders : rawLeadershipMembers.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] font-serif antialiased selection:bg-white selection:text-black" suppressHydrationWarning>
      <Header content={content} />

      <main id="main-content" suppressHydrationWarning>
        <h1 className="sr-only">
          PT. Terbang Bersama Kawan (PT. TBK) - Pengembang Perumahan Subsidi Berkualitas Puri Gunung Langgar Lampung
        </h1>

        {/* 1. HERO BANNER CAROUSEL */}
        <div className="w-full pt-[56px] min-[980px]:pt-[64px]" suppressHydrationWarning>
          <PromoBannerCarousel slides={content.bannerSlides} whatsappUrl={waUrl} />
        </div>

        {/* 2. STATISTIK UTAMA */}
        {(() => {
          const statsList = Array.isArray(content.hero?.stats) && content.hero.stats.length > 0
            ? content.hero.stats
            : [
                { label: "Domisili Perusahaan", value: "Bandar Lampung" },
                { label: "Pengesahan Kemenkumham", value: "2021" },
                { label: "Proyek Utama", value: "Puri Gunung Langgar" },
                { label: "Kategori Pembangunan", value: "Hunian Bersubsidi" },
              ];

          return (
            <section aria-label="Statistik Utama Perseroan" className="w-full bg-[#0d0d0d] text-white py-12">
              <div className="container-editorial">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {statsList.map((st, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <span className="font-display font-normal uppercase text-3xl sm:text-4xl text-white tracking-[0.06em] block">
                        {st.value}
                      </span>
                      <span className="text-xs text-[#999999] tracking-wider uppercase block">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* 3. TENTANG PERUSAHAAN (EDITORIAL SPLIT) */}
        <section className="py-24 sm:py-32 bg-[#000000]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 space-y-6">
                <p className="text-xs uppercase tracking-widest text-[#999999]">
                  Integritas &amp; Komitmen Pengembang
                </p>
                <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl text-white tracking-[0.06em] leading-tight">
                  {content.about?.title || 'Membangun Kawasan Hunian Bernilai Lebih'}
                </h2>
                <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed">
                  {content.about?.description || 'PT. Terbang Bersama Kawan berdedikasi menghadirkan kawasan perumahan subsidi berkualitas dengan kepastian legalitas, perencanaan tapak terpadu, dan spesifikasi bangunan yang teruji.'}
                </p>
                <div>
                  <Link href="/tentang" className="btn-bugatti-primary">
                    <span>Profil Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-[#141414] space-y-3">
                  <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">Legalitas Sah</h3>
                  <p className="font-serif text-sm text-[#999999] leading-relaxed">
                    Tercatat resmi dalam Akta Notaris No. 10 dan disahkan oleh Keputusan Menkumham RI Tahun 2021.
                  </p>
                </div>
                <div className="p-8 bg-[#141414] space-y-3">
                  <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">Sertifikat SHM</h3>
                  <p className="font-serif text-sm text-[#999999] leading-relaxed">
                    Alas hak tanah berstatus Sertifikat Hak Milik yang dipecah per kavling untuk kepemilikan konsumen.
                  </p>
                </div>
                <div className="p-8 bg-[#141414] space-y-3">
                  <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">Akses Strategis</h3>
                  <p className="font-serif text-sm text-[#999999] leading-relaxed">
                    Berada di koridor Tanjung Bintang yang terkoneksi langsung dengan sentra industri dan fasilitas umum.
                  </p>
                </div>
                <div className="p-8 bg-[#141414] space-y-3">
                  <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">Mitra Perbankan</h3>
                  <p className="font-serif text-sm text-[#999999] leading-relaxed">
                    Bekerja sama dengan bank penyalur KPR FLPP resmi dengan bunga subsidi flat 5% hingga lunas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROYEK UNGGULAN (PURI GUNUNG LANGGAR) */}
        <section className="py-24 sm:py-32 bg-[#0d0d0d]">
          <div className="container-editorial space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-widest text-[#999999]">
                  Proyek Berjalan
                </p>
                <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl text-white tracking-[0.06em]">
                  {content.project?.name || 'Puri Gunung Langgar'}
                </h2>
                <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                  {content.project?.location || 'Tanjung Bintang, Lampung Selatan'} &bull; Kawasan hunian asri dengan perencanaan infrastruktur jalan cor, drainase tertata, dan ruang terbuka hijau.
                </p>
              </div>

              <Link href="/proyek" className="btn-bugatti-primary self-start sm:self-auto">
                <span>Lihat Detail Spesifikasi</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Featured Image & Technical Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 bg-[#141414] overflow-hidden aspect-[16/10]">
                {content.project?.image ? (
                  <img
                    src={upgradeGoogleImageUrl(content.project.image)}
                    alt={content.project?.name || 'Puri Gunung Langgar'}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#999999]">
                    Foto Kawasan Puri Gunung Langgar
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-[#141414] p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="font-display uppercase text-2xl text-white tracking-[0.04em]">
                    Spesifikasi Standar Bangunan
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-[#262626]">
                      <span className="text-[#999999]">Tipe Hunian</span>
                      <span className="text-white font-medium">36 / 72 m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#262626]">
                      <span className="text-[#999999]">Struktur</span>
                      <span className="text-white font-medium">Beton Bertulang</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#262626]">
                      <span className="text-[#999999]">Dinding</span>
                      <span className="text-white font-medium">Bata Merah / Hebel Plester Aci</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#262626]">
                      <span className="text-[#999999]">Atap</span>
                      <span className="text-white font-medium">Rangka Baja Ringan &amp; Genteng</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#262626]">
                      <span className="text-[#999999]">Air &amp; Listrik</span>
                      <span className="text-white font-medium">Sumur Bor &amp; PLN 1.300 VA</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-xs text-[#999999] uppercase tracking-wider mb-1">Status Kepemilikan</div>
                  <div className="font-display uppercase text-lg text-[#c3d9f3] tracking-wide">
                    Sertifikat Hak Milik (SHM)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. JAJARAN PIMPINAN UTAMA */}
        <section className="py-24 sm:py-32 bg-[#000000]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#999999]">
                Tata Kelola &amp; Pengawasan
              </p>
              <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl text-white tracking-[0.06em]">
                Dewan Pengurus Perseroan
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                Dipimpin oleh dewan komisaris dan direksi yang tercatat secara sah di Kemenkumham RI, mengawasi langsung kelancaran pembangunan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
              {displayPrimaryLeaders.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-stretch"
                >
                  <div className="relative w-40 sm:w-48 aspect-[3/4] shrink-0 bg-[#000000] overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        TBK
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 justify-between space-y-4 text-left w-full">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#999999]">
                        {member.role}
                      </p>
                      <h3 className="font-display uppercase tracking-[0.04em] text-xl sm:text-2xl text-white mt-1">
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#999999] mt-0.5">
                        {member.department || 'Pengurus Inti'}
                      </p>
                    </div>

                    <p className="font-serif text-sm text-[#cccccc] leading-relaxed line-clamp-3">
                      {member.roleDescription}
                    </p>

                    <div className="pt-3 border-t border-[#262626] text-xs text-[#999999]">
                      Akta Notaris {content.legal?.aktaNumber || 'No. 10'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Link href="/pimpinan" className="btn-bugatti-primary">
                <span>Struktur Manajemen Lengkap</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. TAHAPAN PEMBELIAN RUMAH (BUYING PROCESS) */}
        <section id="alur-pembelian" className="py-24 sm:py-32 bg-[#0d0d0d] scroll-mt-16">
          <div className="container-editorial space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-widest text-[#999999]">
                  Transparansi Prosedur
                </p>
                <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl text-white tracking-[0.06em]">
                  {content.buyingProcess?.title || 'Tahapan Pembelian Rumah Subsidi'}
                </h2>
                <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                  {content.buyingProcess?.subtitle || 'Alur pengajuan yang transparan dan terstruktur, dari peninjauan lokasi hingga serah terima kunci.'}
                </p>
              </div>

              <div className="shrink-0">
                <HeaderHousesIllustration className="w-28 sm:w-36 h-auto" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-8 bg-[#141414] space-y-4">
                <Step1ConsultationIllustration className="w-14 h-14" />
                <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">
                  Pilih Unit &amp; Konsultasi
                </h3>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Survei kavling langsung di lokasi Puri Gunung Langgar dan konsultasikan kriteria eligibilitas KPR FLPP.
                </p>
              </div>

              <div className="p-8 bg-[#141414] space-y-4">
                <Step2DocumentIllustration className="w-14 h-14" />
                <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">
                  Pemberkasan Dokumen
                </h3>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Penyusunan berkas administrasi KTP, KK, NPWP, dan slip gaji dengan pendampingan tim marketing resmi.
                </p>
              </div>

              <div className="p-8 bg-[#141414] space-y-4">
                <Step3BankIllustration className="w-14 h-14" />
                <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">
                  Analisis Bank &amp; SP3K
                </h3>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Verifikasi kemampuan finansial oleh bank mitra hingga terbit surat persetujuan kredit formal (SP3K).
                </p>
              </div>

              <div className="p-8 bg-[#141414] space-y-4">
                <Step4HandshakeIllustration className="w-14 h-14" />
                <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">
                  Akad &amp; Terima Kunci
                </h3>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Penandatanganan akta kredit di hadapan notaris dan perbankan, dilanjutkan penyerahan kunci unit Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. KPR SIMULATION CALCULATOR */}
        <section id="simulasi-kpr" className="py-24 sm:py-32 bg-[#000000]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 space-y-6">
                <p className="text-xs uppercase tracking-widest text-[#999999]">
                  Kalkulator Angsuran Tetap
                </p>
                <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl text-white tracking-[0.06em] leading-tight">
                  {content.kprSimulation?.title || 'Simulasi KPR Subsidi FLPP'}
                </h2>
                <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed">
                  {content.kprSimulation?.subtitle || 'Hitung estimasi angsuran bulanan rumah subsidi Puri Gunung Langgar melalui skema fasilitas FLPP dengan suku bunga tetap 5% per tahun hingga masa pinjaman berakhir.'}
                </p>

                <div className="space-y-2 text-sm text-[#999999]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c3d9f3]" />
                    <span>Suku bunga tetap 5% anuitas hingga lunas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c3d9f3]" />
                    <span>Bebas biaya PPN 11% subsidi pemerintah</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c3d9f3]" />
                    <span>Jangka waktu fleksibel hingga 20 tahun</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#141414] p-8 sm:p-10 space-y-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center text-xs text-[#999999] uppercase tracking-wider mb-2">
                      <span>Harga Rumah</span>
                      <span className="text-white font-medium">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprHarga)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={140000000}
                      max={200000000}
                      step={1000000}
                      value={kprHarga}
                      onChange={(e) => setKprHarga(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer h-1.5 bg-[#262626]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs text-[#999999] uppercase tracking-wider mb-2">
                      <span>Uang Muka (DP)</span>
                      <span className="text-white font-medium">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprDp)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={20000000}
                      step={500000}
                      value={kprDp}
                      onChange={(e) => setKprDp(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer h-1.5 bg-[#262626]"
                    />
                  </div>

                  <div>
                    <div className="text-xs text-[#999999] uppercase tracking-wider mb-2">
                      Jangka Waktu Pinjaman
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[10, 15, 20].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setKprTenor(yr)}
                          className={`py-2.5 text-xs uppercase tracking-wider transition-colors ${
                            kprTenor === yr
                              ? 'bg-white text-black font-semibold'
                              : 'bg-[#000000] text-[#999999] hover:text-white'
                          }`}
                        >
                          {yr} Tahun
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#000000] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#999999] uppercase tracking-wider block">
                      Estimasi Angsuran Tetap (5% p.a.)
                    </span>
                    <div className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-1">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprAngsuran)}
                      <span className="text-xs font-serif text-[#999999]"> / bulan</span>
                    </div>
                  </div>
                  <div className="text-xs text-[#999999] text-right">
                    <div>Perkiraan harian: <span className="text-white">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kprPerHari)}/hari</span></div>
                  </div>
                </div>

                {hasWa && (
                  <a
                    href={`${waUrl}?text=${encodeURIComponent(
                      `Halo PT. TBK, saya tertarik dengan simulasi KPR Puri Gunung Langgar: Harga Unit Rp ${kprHarga.toLocaleString('id-ID')}, DP Rp ${kprDp.toLocaleString('id-ID')}, Tenor ${kprTenor} Tahun (Angsuran sekitar Rp ${kprAngsuran.toLocaleString('id-ID')}/bln). Mohon info ketersediaan unit dan persyaratannya.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-bugatti-primary w-full justify-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>Konsultasi Simulasi Ini via WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 8. PARTNER BANK CAROUSEL */}
        <PartnersCarousel partners={content.partners} />

        {/* 9. RINGKASAN LEGALITAS */}
        <section id="legalitas" className="py-24 sm:py-32 bg-[#0d0d0d]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 space-y-6">
                <p className="text-xs uppercase tracking-widest text-[#999999]">
                  Kepastian Hukum
                </p>
                <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl text-white tracking-[0.06em] leading-tight">
                  Legalitas Resmi Perseroan
                </h2>
                <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed">
                  Setiap unit hunian dan pengembangan kawasan PT. Terbang Bersama Kawan berlandaskan kekuatan hukum resmi Republik Indonesia.
                </p>
                <div>
                  <Link href="/legalitas" className="btn-bugatti-primary">
                    <span>Lihat Dokumen Legalitas</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#141414] p-8 sm:p-10 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                  <div>
                    <h3 className="font-display uppercase text-lg text-white tracking-[0.04em]">
                      PT. Terbang Bersama Kawan
                    </h3>
                    <span className="text-xs text-[#999999]">Terdaftar resmi di Kemenkumham RI</span>
                  </div>
                  <span className="text-xs text-[#c3d9f3] uppercase tracking-wider">
                    AHU Terverifikasi
                  </span>
                </div>

                <div className="space-y-4 text-sm pt-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[#262626] gap-1">
                    <span className="text-[#999999]">Akta Notaris</span>
                    <span className="text-white text-right">
                      {content.legal?.aktaNumber || 'No. 10'} ({content.legal?.aktaDate || '18 Maret 2021'})
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[#262626] gap-1">
                    <span className="text-[#999999]">SK Kemenkumham</span>
                    <span className="text-white text-right break-all">
                      {content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[#262626] gap-1">
                    <span className="text-[#999999]">Status Lahan</span>
                    <span className="text-white text-right">
                      Sertifikat Hak Milik (SHM)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} />

      <LookbookModal
        isOpen={lightbox.open}
        onClose={() => setLightbox((prev) => ({ ...prev, open: false }))}
        items={lightbox.items}
        currentIndex={lightbox.currentIndex}
        onIndexChange={(idx) => setLightbox((prev) => ({ ...prev, currentIndex: idx }))}
        projectName={content.project?.name || 'Puri Gunung Langgar'}
        whatsappNumber={content.contact?.whatsapp || ''}
      />

      <PromoPopupModal promo={content.promoPopup} />
    </div>
  );
}
