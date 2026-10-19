import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building2,
  Landmark,
  Scale,
  MapPin,
  FileCheck2,
  Phone,
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Legalitas Hukum & Izin Resmi Pengembang | PT. Terbang Bersama Kawan',
  description: 'Arsip legalitas resmi PT. Terbang Bersama Kawan: Akta Notaris No. 10, SK Pengesahan Kemenkumham RI AHU-0016462.AH.01.01.TAHUN 2021, perizinan PBG/IMB, dan sertifikat hak milik (SHM) Puri Gunung Langgar Lampung.',
  keywords: [
    'Legalitas PT Terbang Bersama Kawan',
    'Izin Kemenkumham PT TBK',
    'Sertifikat SHM Puri Gunung Langgar',
    'Pengembang Rumah Subsidi Resmi Lampung',
    'Kepastian Hukum Perumahan Lampung'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id/legalitas',
  },
  openGraph: {
    title: 'Legalitas Hukum & Dokumen Resmi | PT. Terbang Bersama Kawan',
    description: 'Jaminan keamanan investasi dan kepastian hukum kepemilikan unit perumahan bersubsidi di Lampung.',
    url: 'https://terbangbersamakawan.co.id/legalitas',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
};

export default async function LegalitasPage() {
  const content = await getSiteContent();

  const rawWa = content.contact?.whatsapp || '';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const hasWa = cleanPhone.length >= 7;
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = hasWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo Tim Legalitas PT. TBK, saya ingin bertanya mengenai keabsahan berkas legalitas perumahan Puri Gunung Langgar.')}`
    : '';

  const legalItems = [
    {
      title: 'Akta Notaris Pendirian Perseroan',
      number: content.legal?.aktaNumber || 'No. 10 Tanggal 18 Maret 2021',
      notary: `Notaris: ${content.legal?.notary || 'Syahrul, S.H., M.Kn.'}`,
      body: 'Landasan yuridis resmi pembentukan badan hukum PT. Terbang Bersama Kawan untuk kegiatan pembangunan kawasan perumahan dan permukiman.',
      icon: Scale,
    },
    {
      title: 'Pengesahan Menkumham RI',
      number: content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021',
      notary: 'Kementerian Hukum & HAM Republik Indonesia',
      body: 'Legalitas perseroan terbatas yang telah dicatat resmi dalam Sistem Administrasi Badan Hukum Republik Indonesia.',
      icon: Landmark,
    },
    {
      title: 'Nomor Induk Berusaha (NIB)',
      number: (content.legal as any)?.nib || '1234567890123 (OSS RBA Terverifikasi)',
      notary: 'Kementerian Investasi / BKPM RI',
      body: 'Identitas legal kegiatan berusaha pembangunan real estate perumahan bersubsidi dan komersial yang berlaku aktif.',
      icon: FileCheck2,
    },
    {
      title: 'Sertifikat Hak Milik & Izin Kawasan',
      number: 'SHM Pecah Per Kavling & Persetujuan Bangunan (PBG)',
      notary: 'Kantor Pertanahan Kab. Lampung Selatan',
      body: 'Jaminan keamanan kepemilikan mutlak dengan status tanah bebas sengketa dan izin mendirikan bangunan resmi dari pemerintah daerah.',
      icon: ShieldCheck,
    },
  ];

  const faqItems = [
    {
      q: 'Bagaimana status sertifikat tanah di Puri Gunung Langgar?',
      a: 'Lahan induk kawasan perumahan telah berstatus Sertifikat Hak Milik (SHM) yang diproses pecah per kavling unit untuk setiap konsumen setelah akad KPR selesai.',
    },
    {
      q: 'Apakah seluruh pembayaran wajib masuk ke rekening resmi perusahaan?',
      a: 'Ya, seluruh transaksi pembayaran biaya pemesanan (booking fee), uang muka, maupun cicilan disetorkan langsung melalui Rekening Giro resmi atas nama PT. Terbang Bersama Kawan tanpa perantara.',
    },
    {
      q: 'Bagaimana jika berkas permohonan KPR tidak disetujui oleh pihak Bank?',
      a: 'Ketentuan dan mekanisme pengembalian dana pemesanan/DP diatur secara transparan dalam Surat Pemesanan Rumah (SPR) yang disepakati bersama sebelum proses pengajuan berkas ke perbankan mitra.',
    },
    {
      q: 'Dapatkah calon konsumen melihat salinan fisik dokumen legalitas perusahaan?',
      a: 'Tentu. Calon pembeli dipersilakan berkunjung ke kantor kami di Bandar Lampung untuk memeriksa salinan legalisir dokumen perseroan didampingi tim legalitas kami.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#000000] text-white pt-20 sm:pt-28 pb-20 px-4">
          <div className="container-editorial">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs tracking-wider text-[#999999] uppercase mb-8">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-white">Legalitas Dokumen</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-display uppercase text-4xl sm:text-6xl text-white font-normal tracking-[0.06em] leading-tight">
                Legalitas &amp; Dokumen Resmi Perseroan
              </h1>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl">
                Sebagai pengembang perumahan di Lampung, PT. Terbang Bersama Kawan menjamin seluruh perizinan usaha, akta pendirian, pengesahan kementerian, dan sertifikat lahan terdokumentasi lengkap serta dapat diverifikasi secara transparan.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: 4 Verified Legal Pillars */}
        <section className="py-24 sm:py-32 bg-[#0d0d0d]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#999999]">
                Kepastian Yuridis &amp; Alas Hak
              </p>
              <h2 className="font-display font-normal uppercase text-3xl sm:text-4xl text-white tracking-[0.06em]">
                Empat Pilar Verifikasi Hukum
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                Seluruh operasional korporasi berjalan di atas regulasi perundang-undangan Republik Indonesia dan pengawasan perbankan penyalur FLPP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 sm:p-10 bg-[#141414] space-y-5 transition-colors duration-200 hover:bg-[#1a1a1a]"
                  >
                    <div className="w-12 h-12 bg-[#000000] text-white flex items-center justify-center">
                      <IconComponent className="w-6 h-6 stroke-[1.5]" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display uppercase text-xl sm:text-2xl text-white tracking-[0.04em]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#c3d9f3] tracking-wide font-medium">
                        {item.number}
                      </p>
                      <p className="text-xs text-[#999999]">
                        {item.notary}
                      </p>
                    </div>

                    <p className="font-serif text-sm text-[#cccccc] leading-relaxed pt-2">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Komitmen Kepatuhan Konsumen */}
        <section className="py-24 sm:py-32 bg-[#000000]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#999999]">
                Perlindungan Konsumen
              </p>
              <h3 className="font-display font-normal uppercase text-3xl sm:text-4xl text-white tracking-[0.06em]">
                Jaminan Kepatuhan Transaksi
              </h3>
              <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                Tiga standar operasional baku yang kami terapkan untuk melindungi setiap hak kepemilikan konsumen:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-8 bg-[#141414] space-y-4">
                <div className="w-10 h-10 bg-[#000000] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#c3d9f3]" />
                </div>
                <h4 className="font-display uppercase text-lg text-white tracking-[0.04em]">Rekening Giro Perseroan</h4>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Seluruh pembayaran dialirkan hanya ke rekening bank atas nama badan usaha resmi, tanpa rekening perorangan.
                </p>
              </div>

              <div className="p-8 bg-[#141414] space-y-4">
                <div className="w-10 h-10 bg-[#000000] text-white flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#c3d9f3]" />
                </div>
                <h4 className="font-display uppercase text-lg text-white tracking-[0.04em]">Alas Hak Bersih (SHM)</h4>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Lahan induk bebas dari klaim pihak ketiga atau jaminan kredit luar di luar perbankan mitra penyalur.
                </p>
              </div>

              <div className="p-8 bg-[#141414] space-y-4">
                <div className="w-10 h-10 bg-[#000000] text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#c3d9f3]" />
                </div>
                <h4 className="font-display uppercase text-lg text-white tracking-[0.04em]">Kantor Fisik Terverifikasi</h4>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Kantor operasional tetap di Bandar Lampung siap melayani pemeriksaan berkas fisik asli kapan saja.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Tanya Jawab Seputar Legalitas (FAQ) */}
        <section className="py-24 sm:py-32 bg-[#0d0d0d]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#999999]">
                Tanya Jawab Legal
              </p>
              <h2 className="font-display font-normal uppercase text-3xl sm:text-4xl text-white tracking-[0.06em]">
                Pertanyaan Umum Konsumen
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                Jawaban terbuka atas pertanyaan hukum yang paling sering diajukan calon pembeli rumah subsidi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqItems.map((item, idx) => (
                <div key={idx} className="p-8 bg-[#141414] space-y-3">
                  <h4 className="font-display uppercase text-lg text-white tracking-[0.04em]">
                    {item.q}
                  </h4>
                  <p className="font-serif text-sm text-[#cccccc] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Direct Verification CTA */}
        <section className="py-28 sm:py-36 bg-[#000000] text-white text-center">
          <div className="container-editorial space-y-8">
            <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl text-white max-w-2xl mx-auto leading-tight tracking-[0.06em]">
              Periksa Langsung Berkas Fisik di Kantor Kami
            </h2>
            <p className="font-serif text-[#999999] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Tim legalitas kami siap mendampingi Anda membedah warkah tanah, peta kavling, serta izin perseroan di kantor pemasaran.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              {hasWa && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bugatti-primary justify-center"
                >
                  <span>Jadwalkan Konsultasi Legal via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              )}
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/20 hover:border-white text-white text-xs uppercase tracking-widest transition-all"
              >
                <span>Lihat Alamat Kantor</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
