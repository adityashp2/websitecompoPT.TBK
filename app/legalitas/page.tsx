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
  title: 'Legalitas & Dokumen Resmi | PT. Terbang Bersama Kawan',
  description: 'Arsip legalitas resmi PT. Terbang Bersama Kawan: Akta Notaris No. 10, SK Pengesahan Kemenkumham RI AHU-0016462.AH.01.01.TAHUN 2021, dan kepastian alas hak SHM Puri Gunung Langgar.',
  openGraph: {
    title: 'Legalitas & Dokumen Resmi | PT. Terbang Bersama Kawan',
    description: 'Kepastian hukum dan legalitas perumahan bersubsidi di Lampung Selatan.',
  },
};

export default async function LegalitasPage() {
  const content = await getSiteContent();

  const rawWa = content.contact?.whatsapp || '0812-7890-1234';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo Tim Legalitas PT. TBK, saya ingin bertanya mengenai keabsahan berkas legalitas perumahan Puri Gunung Langgar.')}`;

  const legalDocs = [
    {
      code: 'DOC-01',
      category: 'Akta Pendirian Badan Hukum',
      title: 'Akta Notaris Pendirian Perseroan Terbatas',
      number: content.legal?.aktaNumber || 'Akta Notaris No. 10',
      date: content.legal?.aktaDate || '18 Maret 2021',
      authority: content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.',
      jurisdiction: 'Kota Bandar Lampung',
      icon: FileText,
      description: 'Dokumen konstitusi perseroan terbatas yang memuat anggaran dasar, maksud, dan tujuan perseroan dalam bidang pembangunan serta pengembangan perumahan.',
      status: 'Terdaftar & Berlaku Sah',
    },
    {
      code: 'DOC-02',
      category: 'Pengesahan Negara RI',
      title: 'Surat Keputusan Menteri Hukum & HAM RI',
      number: content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021',
      date: content.legal?.skDate || '19 Maret 2021',
      authority: 'Ditjen Administrasi Hukum Umum (AHU), Kemenkumham RI',
      jurisdiction: 'Republik Indonesia',
      icon: Landmark,
      description: 'Pengesahan pendirian badan hukum perseroan terbatas PT. Terbang Bersama Kawan secara resmi tercatat dalam basis data kenegaraan Kemenkumham RI.',
      status: 'Terverifikasi Negara',
    },
    {
      code: 'DOC-03',
      category: 'Kepastian Alas Hak Lahan',
      title: 'Sertifikat Hak Milik (SHM) Kawasan',
      number: content.legal?.landStatus || 'Sertifikat Hak Milik (SHM)',
      date: 'Progres Berkala 2021 - 2024',
      authority: 'Badan Pertanahan Nasional (BPN) Lampung Selatan',
      jurisdiction: 'Desa Sabah Balau, Kec. Tanjung Bintang',
      icon: MapPin,
      description: content.legal?.landStatusDetail || 'Lahan pengembangan perumahan Puri Gunung Langgar berstatus Sertifikat Hak Milik (SHM) yang clean and clear, bebas sita jaminan luar dan siap pemecahan sertifikat per unit.',
      status: 'SHM Bebas Sengketa',
    },
    {
      code: 'DOC-04',
      category: 'Representasi Sah Perusahaan',
      title: 'Mandat Direksi & Otoritas Perjanjian',
      number: 'Pasal Anggaran Dasar & Akta Otentik',
      date: 'Aktif Sejak 18 Maret 2021',
      authority: 'Direksi & Dewan Komisaris PT. TBK',
      jurisdiction: 'Wilayah Hukum Republik Indonesia',
      icon: Scale,
      description: content.legal?.directorAuthority || 'Direktur berhak bertindak sah mewakili perseroan di dalam dan di luar pengadilan, termasuk menandatangani PPJB, AJB Notaris, serta perikatan kerjasama KPR Perbankan.',
      status: 'Kewenangan Mengikat',
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
    <div className="min-h-screen bg-white text-[#102D52] flex flex-col font-sans selection:bg-[#FF9D2E] selection:text-[#102D52]">
      {/* 1. Consistent Header Navbar */}
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header: Consistent with other subpages */}
        <section className="bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white pt-12 pb-16 px-4 border-b border-white/10 relative overflow-hidden">
          <div className="w-full max-w-[1240px] mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70 mb-6">
              <Link href="/" className="hover:text-[#FF9D2E] transition-colors">
                Beranda
              </Link>
              <span>/</span>
              <span className="text-[#FF9D2E] font-bold">Legalitas Dokumen</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Kepastian Hukum & Transparansi Hak Konsumen</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Legalitas & Dokumen Resmi Perseroan
              </h1>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                Sebagai pengembang perumahan subsidi terpercaya di Bandar Lampung, PT. Terbang Bersama Kawan
                menjamin seluruh perizinan usaha, akta pendirian, pengesahan kementerian, dan sertifikat lahan
                terdokumentasi lengkap serta dapat diverifikasi secara transparan.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: 4 Verified Legal Pillars */}
        <section className="py-14 sm:py-20 bg-[#F8FAFD] border-b border-[#DCE7F5]">
          <div className="w-full max-w-[1240px] mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                Dokumen Fondasi Perusahaan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#073B78]">
                Empat Pilar Legalitas Terverifikasi
              </h2>
              <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                Setiap dokumen hukum perseroan terdaftar pada lembaga berwenang dan memiliki kekuatan hukum mengikat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {legalDocs.map((doc) => {
                const IconComponent = doc.icon;
                return (
                  <div
                    key={doc.code}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DCE7F5] shadow-sm hover:shadow-md hover:border-[#073B78]/30 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#073B78]/10 text-[#073B78] flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{doc.status}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono font-semibold text-[#FF9D2E] uppercase tracking-wider block">
                          {doc.category}
                        </span>
                        <h3 className="text-lg font-bold text-[#073B78] mt-1">
                          {doc.title}
                        </h3>
                      </div>

                      <div className="p-3.5 bg-[#F4F7FC] rounded-xl border border-[#DCE7F5]/70 space-y-2 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="text-[#526783]">Nomor Berkas:</span>
                          <strong className="text-[#073B78] font-semibold text-right">{doc.number}</strong>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#526783]">Tanggal Terbit:</span>
                          <span className="text-[#102D52] font-medium text-right">{doc.date}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#526783]">Otoritas Penerbit:</span>
                          <span className="text-[#102D52] font-medium text-right">{doc.authority}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#526783] leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Kepastian Perlindungan Konsumen */}
        <section className="py-14 sm:py-20 bg-white border-b border-[#DCE7F5]">
          <div className="w-full max-w-[1240px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                  Standar Keamanan Transaksi
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#073B78] leading-tight">
                  Perlindungan Nyata Bagi Setiap Pembeli Rumah
                </h2>
                <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                  Kami mengutamakan keamanan dana dan keabsahan hak tanah konsumen sejak awal pemesanan hingga sertifikat berada di tangan Anda.
                </p>

                <div className="pt-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#073B78] hover:bg-[#0A4B91] text-white text-xs font-bold tracking-wide transition-all shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-[#FF9D2E]" />
                    <span>Konsultasi Legalitas via WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-[#073B78] text-sm">Rekening Giro Resmi</h4>
                  <p className="text-xs text-[#526783] leading-relaxed">
                    Pembayaran hanya melalui rekening perseroan resmi atas nama PT. Terbang Bersama Kawan.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-[#073B78]/10 text-[#073B78] flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-[#073B78] text-sm">Perjanjian SPR Jelas</h4>
                  <p className="text-xs text-[#526783] leading-relaxed">
                    Surat Pemesanan Rumah (SPR) mencantumkan spesifikasi unit, hak, dan kewajiban secara tertulis.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-[#FF9D2E]/10 text-[#FF9D2E] flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-[#073B78] text-sm">Alas Hak Bersih (SHM)</h4>
                  <p className="text-xs text-[#526783] leading-relaxed">
                    Lahan induk bebas dari klaim pihak ketiga atau jaminan kredit luar di luar perbankan mitra.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-[#073B78] text-sm">Kantor Fisik Terverifikasi</h4>
                  <p className="text-xs text-[#526783] leading-relaxed">
                    Kantor operasional tetap di Bandar Lampung siap melayani pemeriksaan berkas fisik asli kapan saja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Tanya Jawab Seputar Legalitas (FAQ) */}
        <section className="py-14 sm:py-20 bg-[#F8FAFD] border-b border-[#DCE7F5]">
          <div className="w-full max-w-[880px] mx-auto px-4">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                Pertanyaan Konsumen
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#073B78]">
                Tanya Jawab Seputar Legalitas
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DCE7F5] shadow-sm space-y-2"
                >
                  <h3 className="font-bold text-[#073B78] text-sm sm:text-base flex items-start gap-2.5">
                    <span className="text-[#FF9D2E] font-black shrink-0">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#526783] leading-relaxed pl-5 border-l-2 border-[#DCE7F5]">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Direct Verification CTA */}
        <section className="py-14 sm:py-16 bg-[#073B78] text-white">
          <div className="w-full max-w-[1240px] mx-auto px-4 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ingin Memeriksa Salinan Dokumen Asli di Kantor?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
              Tim legalitas kami siap menyambut Anda di kantor operasional Bandar Lampung untuk peninjauan berkas notaris dan konsultasi skema KPR FLPP.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/kontak"
                className="px-6 py-3 rounded-xl bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] font-bold text-xs tracking-wide transition-all shadow-md"
              >
                Lihat Alamat Kantor & Peta Lokasi
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs tracking-wide transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#FF9D2E]" />
                <span>Hubungi Admin Legalitas</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Consistent Footer & Floating WhatsApp */}
      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
