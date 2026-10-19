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

  const legalDocs = [
    {
      code: 'DOC-01',
      category: 'AKTA PENDIRIAN BADAN HUKUM',
      title: 'Akta Notaris Pendirian Perseroan Terbatas',
      number: content.legal?.aktaNumber || 'Akta Notaris No. 10',
      date: content.legal?.aktaDate || '18 Maret 2021',
      authority: content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.',
      jurisdiction: 'Kota Bandar Lampung',
      icon: FileText,
      description: 'Dokumen konstitusi perseroan terbatas yang memuat anggaran dasar, maksud, dan tujuan perseroan dalam bidang pembangunan serta pengembangan perumahan.',
      status: 'TERDAFTAR & SAH',
    },
    {
      code: 'DOC-02',
      category: 'PENGESAHAN NEGARA RI',
      title: 'Surat Keputusan Menteri Hukum & HAM RI',
      number: content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021',
      date: content.legal?.skDate || '19 Maret 2021',
      authority: 'Ditjen Administrasi Hukum Umum (AHU), Kemenkumham RI',
      jurisdiction: 'Republik Indonesia',
      icon: Landmark,
      description: 'Pengesahan pendirian badan hukum perseroan terbatas PT. Terbang Bersama Kawan secara resmi tercatat dalam basis data kenegaraan Kemenkumham RI.',
      status: 'TERVERIFIKASI NEGARA',
    },
    {
      code: 'DOC-03',
      category: 'KEPASTIAN ALAS HAK LAHAN',
      title: 'Sertifikat Hak Milik (SHM) Kawasan',
      number: content.legal?.landStatus || 'Sertifikat Hak Milik (SHM)',
      date: 'Progres Berkala 2021 - 2024',
      authority: 'Badan Pertanahan Nasional (BPN) Lampung Selatan',
      jurisdiction: 'Desa Sabah Balau, Kec. Tanjung Bintang',
      icon: MapPin,
      description: content.legal?.landStatusDetail || 'Lahan pengembangan perumahan Puri Gunung Langgar berstatus Sertifikat Hak Milik (SHM) yang clean and clear, bebas sita jaminan luar dan siap pemecahan sertifikat per unit.',
      status: 'SHM BERSIH',
    },
    {
      code: 'DOC-04',
      category: 'REPRESENTASI SAH PERSEROAN',
      title: 'Mandat Direksi & Otoritas Perjanjian',
      number: 'Pasal Anggaran Dasar & Akta Otentik',
      date: 'Aktif Sejak 18 Maret 2021',
      authority: 'Direksi & Dewan Komisaris PT. TBK',
      jurisdiction: 'Wilayah Hukum Republik Indonesia',
      icon: Scale,
      description: content.legal?.directorAuthority || 'Direktur berhak bertindak sah mewakili perseroan di dalam dan di luar pengadilan, termasuk menandatangani PPJB, AJB Notaris, serta perikatan kerjasama KPR Perbankan.',
      status: 'KEWENANGAN SAH',
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana status hukum kepemilikan tanah proyek Puri Gunung Langgar?',
      a: 'Lahan kawasan perumahan Puri Gunung Langgar telah berstatus sertifikat resmi (SHM Induk) dan dalam proses pemecahan sertifikat per kavling sesuai penetapan tata ruang Badan Pertanahan Nasional (BPN) Kabupaten Lampung Selatan.',
    },
    {
      q: 'Apakah seluruh pembayaran wajib masuk ke rekening resmi perusahaan?',
      a: 'Ya, seluruh transaksi pembayaran biaya pemesanan (booking fee), uang muka, maupun cicilan wajib disetorkan melalui Rekening Giro resmi atas nama PT. Terbang Bersama Kawan, bukan rekening pribadi sales atau perorangan.',
    },
    {
      q: 'Bagaimana jika berkas permohonan KPR tidak disetujui oleh pihak Bank?',
      a: 'Ketentuan dan mekanisme pengembalian dana pemesanan/DP diatur secara transparan dalam Surat Pemesanan Rumah (SPR) yang disepakati bersama sebelum proses pengajuan berkas ke perbankan mitra.',
    },
    {
      q: 'Dapatkah calon konsumen melihat salinan fisik dokumen legalitas perusahaan?',
      a: 'Tentu. Calon pembeli dipersilakan berkunjung ke kantor pemasaran kami di Bandar Lampung untuk memeriksa salinan legalisir dokumen perseroan didampingi tim legalitas kami.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#000000] text-white pt-20 pb-24 px-6 border-b border-[#262626] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-[#999999] mb-8">
              <Link href="/" className="hover:text-white transition-colors">
                BERANDA
              </Link>
              <span>/</span>
              <span className="text-white">LEGALITAS DOKUMEN</span>
            </nav>

            <div className="max-w-4xl space-y-5">
              <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[#262626] text-white inline-block">
                KEPASTIAN HUKUM &amp; TRANSPARANSI KONSUMEN
              </span>
              <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[70px] uppercase tracking-[3px] text-white leading-[1.08]">
                Legalitas &amp; Dokumen Resmi
              </h1>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl pt-2">
                Sebagai pengembang perumahan subsidi terpercaya di Bandar Lampung, PT. Terbang Bersama Kawan
                menjamin seluruh perizinan usaha, akta pendirian, pengesahan kementerian, dan sertifikat lahan
                terdokumentasi lengkap serta dapat diverifikasi secara sah.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: 4 Verified Legal Pillars */}
        <section className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="max-w-2xl mb-16">
              <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                DOKUMEN FONDASI PERSEROAN
              </span>
              <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                Empat Pilar Legalitas Terverifikasi
              </h2>
              <p className="font-serif text-base text-[#999999] mt-2 leading-relaxed">
                Setiap dokumen hukum perseroan terdaftar pada lembaga berwenang dan memiliki kekuatan hukum mengikat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalDocs.map((doc) => (
                <div
                  key={doc.code}
                  className="card-bugatti p-8 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999]">
                        {doc.code}
                      </span>
                      <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-white/60 text-white">
                        {doc.status}
                      </span>
                    </div>

                    <div>
                      <span className="font-mono text-[11px] text-[#999999] uppercase tracking-[2px] block">
                        {doc.category}
                      </span>
                      <h3 className="font-display font-normal text-xl sm:text-2xl uppercase tracking-[1.5px] text-white mt-1">
                        {doc.title}
                      </h3>
                    </div>

                    <div className="p-4 bg-[#000000] border border-[#262626] space-y-2 font-mono text-xs tracking-[1px] uppercase">
                      <div className="flex justify-between gap-2">
                        <span className="text-[#999999]">NOMOR:</span>
                        <strong className="text-white text-right">{doc.number}</strong>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#999999]">TANGGAL:</span>
                        <span className="text-white text-right">{doc.date}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#999999]">OTORITAS:</span>
                        <span className="text-white text-right">{doc.authority}</span>
                      </div>
                    </div>

                    <p className="font-serif text-sm text-[#cccccc] leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Kepastian Perlindungan Konsumen */}
        <section className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block">
                  STANDAR KEAMANAN TRANSAKSI
                </span>
                <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white leading-tight">
                  Perlindungan Nyata Bagi Pembeli Rumah
                </h2>
                <p className="font-serif text-base text-[#cccccc] leading-relaxed">
                  Kami mengutamakan keamanan dana dan keabsahan hak tanah konsumen sejak awal pemesanan hingga sertifikat berada di tangan Anda.
                </p>

                {hasWa && (
                  <div className="pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-bugatti-primary"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>KONSULTASI TIM LEGALITAS</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card-bugatti p-6 space-y-3">
                  <div className="font-mono text-[11px] tracking-[2px] uppercase text-[#999999]">01</div>
                  <h4 className="font-display font-normal text-lg uppercase tracking-[1.5px] text-white">Rekening Giro Resmi</h4>
                  <p className="font-serif text-xs text-[#999999] leading-relaxed">
                    Pembayaran hanya melalui rekening perseroan resmi atas nama PT. Terbang Bersama Kawan.
                  </p>
                </div>

                <div className="card-bugatti p-6 space-y-3">
                  <div className="font-mono text-[11px] tracking-[2px] uppercase text-[#999999]">02</div>
                  <h4 className="font-display font-normal text-lg uppercase tracking-[1.5px] text-white">Perjanjian SPR Tertulis</h4>
                  <p className="font-serif text-xs text-[#999999] leading-relaxed">
                    Surat Pemesanan Rumah (SPR) mencantumkan spesifikasi unit, hak, dan kewajiban secara berkekuatan hukum.
                  </p>
                </div>

                <div className="card-bugatti p-6 space-y-3">
                  <div className="font-mono text-[11px] tracking-[2px] uppercase text-[#999999]">03</div>
                  <h4 className="font-display font-normal text-lg uppercase tracking-[1.5px] text-white">Alas Hak Bersih (SHM)</h4>
                  <p className="font-serif text-xs text-[#999999] leading-relaxed">
                    Lahan induk bebas dari klaim pihak ketiga atau jaminan kredit luar di luar perbankan mitra resmi.
                  </p>
                </div>

                <div className="card-bugatti p-6 space-y-3">
                  <div className="font-mono text-[11px] tracking-[2px] uppercase text-[#999999]">04</div>
                  <h4 className="font-display font-normal text-lg uppercase tracking-[1.5px] text-white">Kantor Fisik Terbuka</h4>
                  <p className="font-serif text-xs text-[#999999] leading-relaxed">
                    Kantor operasional tetap di Bandar Lampung siap melayani peninjauan berkas fisik kapan saja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Tanya Jawab Seputar Legalitas (FAQ) */}
        <section className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16 space-y-2">
              <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block">
                PERTANYAAN KONSUMEN
              </span>
              <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                Tanya Jawab Legalitas
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="card-bugatti p-6 sm:p-8 space-y-3"
                >
                  <h3 className="font-display font-normal text-lg sm:text-xl uppercase tracking-[1.5px] text-white flex items-start gap-3">
                    <span className="font-mono text-xs text-[#999999] tracking-[2px] shrink-0 mt-1">0{idx + 1}</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="font-serif text-sm text-[#cccccc] leading-relaxed pl-7 border-l border-[#262626]">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Direct Verification CTA */}
        <section className="py-24 bg-[#000000] text-white">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white max-w-2xl mx-auto">
              Periksa Salinan Fisik Dokumen di Kantor Kami
            </h2>
            <p className="font-serif text-sm sm:text-base text-[#cccccc] max-w-xl mx-auto leading-relaxed">
              Tim legalitas kami siap menyambut Anda di kantor operasional Bandar Lampung untuk peninjauan berkas notaris dan konsultasi skema KPR FLPP.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/kontak"
                className="btn-bugatti-primary"
              >
                <span>ALAMAT KANTOR &amp; PETA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {hasWa && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bugatti-primary border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>HUBUNGI ADMIN LEGALITAS</span>
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
