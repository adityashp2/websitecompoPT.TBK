import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  FileCheck2, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Lock,
  Award
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Legalitas & Dokumen Resmi | PT. Terbang Bersama Kawan',
  description: 'Legalitas lengkap PT. Terbang Bersama Kawan: Akta Notaris No. 10, SK Pengesahan Kemenkumham RI AHU-0016462.AH.01.01.TAHUN 2021, dan jaminan kepastian hukum konsumen.',
};

export default function LegalitasPage() {
  const content = getSiteContent();

  const faqs = [
    {
      q: 'Bagaimana status hukum kepemilikan tanah proyek Puri Gunung Langgar?',
      a: 'Lahan kawasan perumahan Puri Gunung Langgar telah berstatus sertifikat resmi dan dalam proses pemecahan sertifikat per kavling sesuai penetapan tata ruang BPN Kabupaten Lampung Selatan.',
    },
    {
      q: 'Apakah seluruh transaksi pembayaran masuk ke rekening perusahaan?',
      a: 'Ya, seluruh transaksi pembayaran biaya pemesanan (booking fee), uang muka, maupun cicilan wajib disetorkan melalui Rekening Resmi atas nama PT. Terbang Bersama Kawan, bukan rekening pribadi sales atau perorangan.',
    },
    {
      q: 'Bagaimana jika berkas permohonan KPR tidak disetujui oleh pihak Bank?',
      a: 'Ketentuan dan mekanisme pengembalian dana pemesanan/DP diatur secara transparan dalam Surat Pemesanan Rumah (SPR) yang disepakati bersama sebelum proses pengajuan berkas ke perbankan.',
    },
    {
      q: 'Apakah PT. TBK memiliki pengesahan resmi dari Kemenkumham RI?',
      a: `Ya, perseroan telah memperoleh Surat Keputusan Menteri Hukum dan Hak Asasi Manusia Republik Indonesia Nomor ${content.legal.skMenkumham} bertanggal ${content.legal.skDate}.`,
    },
  ];

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
              <span className="text-[#FF9D2E] font-bold">Legalitas Resmi</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-[11px] font-bold uppercase tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{content.legal.badge || 'LEGALITAS & TRANSPARANSI PERUSAHAAN'}</span>
              </div>
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {content.legal.title || 'Dokumen Resmi Perseroan'}
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.legal.subtitle || 'Kepastian hukum, transparansi data perseroan, dan jaminan keamanan transaksi properti bagi setiap konsumen.'}
              </p>
            </div>
          </div>
        </section>

        {/* 3 Main Legal Documents */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-editorial space-y-16">
            <div>
              <div className="flex items-center gap-2 text-[#FF9D2E] font-bold text-xs uppercase tracking-[0.14em] mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Landasan Yuridis</span>
              </div>
              <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#102D52]">
                Dokumen Otentik Badan Hukum Perseroan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Document 1: Akta Notaris */}
              <div className="bg-[#F4F7FC] p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-4">
                <span className="font-extrabold text-3xl text-[#073B78] block">01</span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#FF9D2E] font-bold block">
                    Akta Pendirian Perseroan
                  </span>
                  <h3 className="font-bold text-xl sm:text-2xl text-[#102D52] mt-0.5">
                    {content.legal.aktaNumber || 'Akta No. 10'}
                  </h3>
                </div>
                <div className="divide-y divide-[#DCE7F5] text-xs text-[#526783] pt-2">
                  <div className="py-2.5 flex justify-between">
                    <span>Tanggal Akta</span>
                    <strong className="text-[#102D52] font-semibold">{content.legal.aktaDate}</strong>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span>Notaris Pembuat</span>
                    <strong className="text-[#102D52] font-semibold">{content.legal.notary}</strong>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span>Wilayah Kerja</span>
                    <strong className="text-[#102D52] font-semibold">Bandar Lampung</strong>
                  </div>
                </div>
                <p className="text-xs text-[#526783] leading-relaxed pt-1">
                  Dokumen autentik pendirian badan hukum perseroan terbatas sesuai UU No. 40 Tahun 2007.
                </p>
              </div>

              {/* Document 2: SK Kemenkumham */}
              <div className="bg-[#F4F7FC] p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-4">
                <span className="font-extrabold text-3xl text-[#073B78] block">02</span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#FF9D2E] font-bold block">
                    Pengesahan Kemenkumham RI
                  </span>
                  <h3 className="font-bold text-lg sm:text-xl text-[#102D52] mt-0.5 font-mono break-all">
                    {content.legal.skMenkumham}
                  </h3>
                </div>
                <div className="divide-y divide-[#DCE7F5] text-xs text-[#526783] pt-2">
                  <div className="py-2.5 flex justify-between">
                    <span>Tanggal SK</span>
                    <strong className="text-[#102D52] font-semibold">{content.legal.skDate}</strong>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span>Lembaga Penerbit</span>
                    <strong className="text-[#102D52] font-semibold">Ditjen AHU RI</strong>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span>Status Badan Hukum</span>
                    <strong className="text-[#15966A] font-bold bg-[#E6F7F3] px-2 py-0.5 rounded">Terdaftar &amp; Sah</strong>
                  </div>
                </div>
                <p className="text-xs text-[#526783] leading-relaxed pt-1">
                  Pengakuan resmi status badan hukum dari pemerintah Republik Indonesia.
                </p>
              </div>

              {/* Document 3: Kewenangan Direksi */}
              <div className="bg-[#F4F7FC] p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-4">
                <span className="font-extrabold text-3xl text-[#073B78] block">03</span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#FF9D2E] font-bold block">
                    Kewenangan Direksi
                  </span>
                  <h3 className="font-bold text-xl sm:text-2xl text-[#102D52] mt-0.5">
                    Mewakili Perseroan
                  </h3>
                </div>
                <div className="pt-2 text-xs text-[#526783] leading-relaxed">
                  <p>
                    {content.legal.directorAuthority || 'Direktur berwenang penuh menjalankan kepengurusan dan mewakili perseroan secara sah di dalam dan di luar pengadilan.'}
                  </p>
                </div>
                <p className="text-xs text-[#526783] leading-relaxed pt-2 border-t border-[#DCE7F5]">
                  Memberikan kepastian hak hukum dalam penandatanganan Perjanjian Pengikatan Jual Beli (PPJB).
                </p>
              </div>
            </div>

            {/* Checklist Jaminan Transparansi */}
            <div className="pt-12 border-t border-[#DCE7F5] space-y-8">
              <div>
                <div className="flex items-center gap-2 text-[#FF9D2E] font-bold text-xs uppercase tracking-[0.14em] mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>Standar Kepatuhan</span>
                </div>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[#102D52]">
                  Jaminan Keamanan &amp; Perlindungan Konsumen
                </h3>
                <p className="text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                  Prinsip transparansi yang diterapkan PT. TBK untuk menghindari praktik pengembang fiktif atau bermasalah:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#F4F7FC] border border-[#DCE7F5]">
                  <CheckCircle2 className="w-5 h-5 text-[#15966A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-[16px] text-[#102D52]">Rekening Resmi Perusahaan</h4>
                    <p className="text-xs sm:text-[13px] text-[#526783] leading-relaxed">
                      Semua dana konsumen masuk ke rekening koran giro atas nama PT. Terbang Bersama Kawan, bukan rekening perorangan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#F4F7FC] border border-[#DCE7F5]">
                  <CheckCircle2 className="w-5 h-5 text-[#15966A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-[16px] text-[#102D52]">Sertifikat Lahan Bersih &amp; Aman</h4>
                    <p className="text-xs sm:text-[13px] text-[#526783] leading-relaxed">
                      Tidak dalam status sengketa pihak ketiga dan telah diverifikasi notaris rekanan perbankan penyalur FLPP.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#F4F7FC] border border-[#DCE7F5]">
                  <CheckCircle2 className="w-5 h-5 text-[#15966A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-[16px] text-[#102D52]">Kemitraan Bank Penyalur FLPP</h4>
                    <p className="text-xs sm:text-[13px] text-[#526783] leading-relaxed">
                      Memenuhi syarat ketat audit legalitas dari bank penyalur fasilitas likuiditas pembiayaan perumahan nasional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#F4F7FC] border border-[#DCE7F5]">
                  <CheckCircle2 className="w-5 h-5 text-[#15966A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-[16px] text-[#102D52]">Kantor Fisik &amp; Representasi Nyata</h4>
                    <p className="text-xs sm:text-[13px] text-[#526783] leading-relaxed">
                      Kantor operasional berdomisili di Bandar Lampung dengan tim manajemen yang dapat ditemui langsung setiap jam kerja.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tanya Jawab Legalitas (FAQ) */}
            <div className="pt-12 border-t border-[#DCE7F5] space-y-8">
              <div>
                <div className="flex items-center gap-2 text-[#FF9D2E] font-bold text-xs uppercase tracking-[0.14em] mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>Pertanyaan Umum</span>
                </div>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[#102D52]">
                  Pertanyaan Seputar Legalitas &amp; Akad
                </h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] space-y-2">
                    <h4 className="font-bold text-base sm:text-lg text-[#102D52] flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#073B78] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span>
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-xs sm:text-[13.5px] text-[#526783] pl-9 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white max-w-xl mx-auto">
              Butuh Verifikasi Dokumen Legalitas Langsung?
            </h2>
            <p className="text-white/85 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Silakan hubungi perwakilan resmi kami atau kunjungi kantor kami di Bandar Lampung untuk memeriksa salinan berkas perseroan.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1px] shadow-lg"
              >
                <span>Hubungi Layanan Konsultasi</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
