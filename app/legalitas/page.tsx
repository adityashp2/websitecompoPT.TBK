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
              <span className="text-[#C5A568] font-semibold">Legalitas Resmi</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/[0.06] border border-white/10 text-[#C5A568] text-[11px] font-semibold uppercase tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{content.legal.badge || 'LEGALITAS & TRANSPARANSI PERUSAHAAN'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3EFE6] leading-tight">
                {content.legal.title || 'Dokumen Resmi Perseroan'}
              </h1>
              <p className="text-[#F3EFE6]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.legal.subtitle || 'Kepastian hukum, transparansi data perseroan, dan jaminan keamanan transaksi properti bagi setiap konsumen.'}
              </p>
            </div>
          </div>
        </section>

        {/* 3 Main Legal Documents: Open Architectural Showcase */}
        <section className="py-16 sm:py-20">
          <div className="container-editorial space-y-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                Landasan Yuridis
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                Dokumen Otentik Badan Hukum Perseroan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 md:divide-x md:divide-[#DDD8CE]">
              {/* Document 1: Akta Notaris */}
              <div className="space-y-4">
                <span className="font-serif text-3xl text-[#C5A568] block">01</span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold block">
                    Akta Pendirian Perseroan
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#262722] mt-0.5">
                    {content.legal.aktaNumber || 'Akta No. 10'}
                  </h3>
                </div>
                <div className="divide-y divide-[#DDD8CE] text-xs text-[#77766F] pt-2">
                  <div className="py-2 flex justify-between">
                    <span>Tanggal Akta</span>
                    <strong className="text-[#262722] font-medium">{content.legal.aktaDate}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Notaris Pembuat</span>
                    <strong className="text-[#262722] font-medium">{content.legal.notary}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Wilayah Kerja</span>
                    <strong className="text-[#262722] font-medium">Bandar Lampung</strong>
                  </div>
                </div>
                <p className="text-xs text-[#77766F] leading-relaxed pt-1">
                  Dokumen autentik pendirian badan hukum perseroan terbatas sesuai UU No. 40 Tahun 2007.
                </p>
              </div>

              {/* Document 2: SK Kemenkumham */}
              <div className="md:pl-10 space-y-4">
                <span className="font-serif text-3xl text-[#C5A568] block">02</span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold block">
                    Pengesahan Kemenkumham RI
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-[#262722] mt-0.5 font-mono break-all">
                    {content.legal.skMenkumham}
                  </h3>
                </div>
                <div className="divide-y divide-[#DDD8CE] text-xs text-[#77766F] pt-2">
                  <div className="py-2 flex justify-between">
                    <span>Tanggal SK</span>
                    <strong className="text-[#262722] font-medium">{content.legal.skDate}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Lembaga Penerbit</span>
                    <strong className="text-[#262722] font-medium">Ditjen AHU RI</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Status Badan Hukum</span>
                    <strong className="text-emerald-700 font-medium">Terdaftar &amp; Sah</strong>
                  </div>
                </div>
                <p className="text-xs text-[#77766F] leading-relaxed pt-1">
                  Pengakuan resmi status badan hukum dari pemerintah Republik Indonesia.
                </p>
              </div>

              {/* Document 3: Kewenangan Direksi */}
              <div className="md:pl-10 space-y-4">
                <span className="font-serif text-3xl text-[#C5A568] block">03</span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold block">
                    Kewenangan Direksi
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#262722] mt-0.5">
                    Mewakili Perseroan
                  </h3>
                </div>
                <div className="pt-2 text-xs text-[#77766F] leading-relaxed">
                  <p>
                    {content.legal.directorAuthority || 'Direktur berwenang penuh menjalankan kepengurusan dan mewakili perseroan secara sah di dalam dan di luar pengadilan.'}
                  </p>
                </div>
                <p className="text-xs text-[#77766F] leading-relaxed pt-1 border-t border-[#DDD8CE]">
                  Memberikan kepastian hak hukum dalam penandatanganan Perjanjian Pengikatan Jual Beli (PPJB).
                </p>
              </div>
            </div>

            {/* Checklist Jaminan Transparansi: Open Editorial Section */}
            <div className="pt-12 border-t border-[#DDD8CE] space-y-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                  Standar Kepatuhan
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                  Jaminan Keamanan &amp; Perlindungan Konsumen
                </h3>
                <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                  Prinsip transparansi yang diterapkan PT. TBK untuk menghindari praktik pengembang fiktif atau bermasalah:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A568] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-[#262722]">Rekening Resmi Perusahaan</h4>
                    <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                      Semua dana konsumen masuk ke rekening koran giro atas nama PT. Terbang Bersama Kawan, bukan rekening perorangan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A568] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-[#262722]">Sertifikat Lahan Bersih &amp; Aman</h4>
                    <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                      Tidak dalam status sengketa pihak ketiga dan telah diverifikasi notaris rekanan perbankan penyalur FLPP.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A568] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-[#262722]">Kemitraan Bank Penyalur FLPP</h4>
                    <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                      Memenuhi syarat ketat audit legalitas dari bank penyalur fasilitas likuiditas pembiayaan perumahan nasional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A568] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-[#262722]">Kantor Fisik &amp; Representasi Nyata</h4>
                    <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                      Kantor operasional berdomisili di Bandar Lampung dengan tim manajemen yang dapat ditemui langsung setiap jam kerja.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tanya Jawab Legalitas (FAQ): Open Editorial List with Dividers */}
            <div className="pt-12 border-t border-[#DDD8CE] space-y-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                  Pertanyaan Umum
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                  Pertanyaan Seputar Legalitas &amp; Akad
                </h3>
              </div>

              <div className="divide-y divide-[#DDD8CE]">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="py-6 first:pt-0 space-y-2">
                    <h4 className="font-serif text-lg sm:text-xl text-[#262722] flex items-start gap-3">
                      <span className="font-mono text-sm text-[#C5A568] font-bold mt-1">Q.</span>
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-[#77766F] pl-6 sm:pl-7 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Banner: Charcoal Editorial Section */}
        <section className="py-16 sm:py-20 bg-[#262722] text-[#F3EFE6]">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F3EFE6] max-w-xl mx-auto">
              Butuh Verifikasi Dokumen Legalitas Langsung?
            </h2>
            <p className="text-[#F3EFE6]/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Silakan hubungi perwakilan resmi kami atau kunjungi kantor kami di Bandar Lampung untuk memeriksa salinan berkas perseroan.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
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
