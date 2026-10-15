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
              <span className="text-[#C9A96A] font-semibold">Legalitas Resmi</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-[#C9A96A]/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{content.legal.badge || 'LEGALITAS & TRANSPARANSI PERUSAHAAN'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight">
                {content.legal.title || 'Dokumen Resmi Perseroan'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.legal.subtitle || 'Kepastian hukum, transparansi data perseroan, dan jaminan keamanan transaksi properti bagi setiap konsumen.'}
              </p>
            </div>
          </div>
        </section>

        {/* 3 Main Legal Documents Grid */}
        <section className="py-14 sm:py-16">
          <div className="container-std max-w-[1120px] mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Akta Notaris */}
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-[#C9A96A] transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    Akta Pendirian Perseroan
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {content.legal.aktaNumber || 'Akta No. 10'}
                  </h3>
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3">
                  <div>Tanggal: <strong className="text-slate-900">{content.legal.aktaDate}</strong></div>
                  <div>Notaris Pembuat: <strong className="text-slate-900">{content.legal.notary}</strong></div>
                  <div>Wilayah Kerja: <strong className="text-slate-900">Bandar Lampung</strong></div>
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Dokumen autentik pendirian badan hukum perseroan terbatas sesuai UU No. 40 Tahun 2007.
                </div>
              </div>

              {/* Card 2: SK Kemenkumham */}
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    Pengesahan Kemenkumham RI
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 break-all">
                    {content.legal.skMenkumham}
                  </h3>
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3">
                  <div>Tanggal SK: <strong className="text-slate-900">{content.legal.skDate}</strong></div>
                  <div>Lembaga: <strong className="text-slate-900">Ditjen AHU Kemenkumham RI</strong></div>
                  <div>Status Badan Hukum: <strong className="text-emerald-700">Terdaftar & Sah</strong></div>
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Pengakuan resmi status badan hukum dari pemerintah Republik Indonesia.
                </div>
              </div>

              {/* Card 3: Kewenangan Direksi */}
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-blue-500 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    Kewenangan Direksi
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Mewakili Perseroan
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {content.legal.directorAuthority || 'Direktur berwenang penuh menjalankan kepengurusan dan mewakili perseroan secara sah di dalam dan di luar pengadilan.'}
                </p>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Memberikan kepastian hak hukum dalam penandatanganan Perjanjian Pengikatan Jual Beli (PPJB).
                </div>
              </div>
            </div>

            {/* Checklist Jaminan Transparansi Konsumen */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                  STANDAR KEPATUHAN
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Jaminan Keamanan & Perlindungan Konsumen
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Prinsip transparansi yang diterapkan PT. TBK untuk menghindari praktik pengembang fiktif atau bermasalah:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Rekening Resmi Perusahaan</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Semua dana konsumen masuk ke rekening koran giro atas nama PT. Terbang Bersama Kawan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Sertifikat Lahan Bersih & Aman</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Tidak dalam status sengketa pihak ketiga dan telah diverifikasi notaris rekanan perbankan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Kemitraan Bank Penyalur FLPP</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Memenuhi syarat ketat audit legalitas dari bank penyalur fasilitas likuiditas pembiayaan perumahan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Kantor Fisik & Representasi Nyata</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Kantor operasional berdomisili di Bandar Lampung dengan tim manajemen yang dapat ditemui langsung.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tanya Jawab Legalitas (FAQ) */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                  PERTANYAAN UMUM
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Pertanyaan Seputar Legalitas & Akad
                </h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <h4 className="font-bold text-base text-slate-900 flex items-start gap-2.5">
                      <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 pl-7 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="py-14 bg-[#0E1014] text-white">
          <div className="container-std max-w-[1120px] mx-auto text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EFE6]">
              Butuh Verifikasi Dokumen Legalitas Langsung?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto">
              Silakan hubungi perwakilan resmi kami atau kunjungi kantor kami di Bandar Lampung untuk memeriksa salinan berkas perseroan.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A96A] hover:bg-amber-500 text-[#0E1014] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Hubungi Layanan Konsultasi</span>
                <ArrowRight className="w-4 h-4" />
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
