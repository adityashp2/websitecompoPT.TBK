'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { SiteContent } from '@/lib/initialData';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Lock,
  Scale,
  Building2,
  Phone,
  Compass,
  X,
  FileCheck,
  Info,
  Calendar,
  MapPin,
  ChevronDown
} from 'lucide-react';

interface LegalRecord {
  id: string;
  code: string;
  category: string;
  title: string;
  refNumber: string;
  date: string;
  authority: string;
  jurisdiction: string;
  summary: string;
  legalBasis: string;
  status: string;
  statusType: 'verified' | 'gazetted' | 'active' | 'in-progress';
  details: { label: string; value: string }[];
  externalUrl?: string;
  isPhysicalCustody: boolean;
}

export default function ClientLegalitasArchive({ content }: { content: SiteContent }) {
  // State for active document record
  const [activeRecordId, setActiveRecordId] = useState<string>('rec-01');
  const [showCurtain, setShowCurtain] = useState<boolean>(true);
  const [curtainParted, setCurtainParted] = useState<boolean>(false);
  const [selectedModalDoc, setSelectedModalDoc] = useState<LegalRecord | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Curtain Reveal on Initial Entry with prefers-reduced-motion check
  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShowCurtain(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setCurtainParted(true);
    }, 120);

    const timer2 = setTimeout(() => {
      setShowCurtain(false);
    }, 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rawWa = content.contact?.whatsapp || '0812-7890-1234';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const baseWaUrl = `https://wa.me/${formattedWa}`;

  // Authentic Corporate Records based on PT. TBK verified documentation
  const records: LegalRecord[] = [
    {
      id: 'rec-01',
      code: 'ARC / 01 • STATUTORY FOUNDATION',
      category: 'Akta Pendirian Perseroan',
      title: 'Akta Pendirian Perseroan Terbatas PT. Terbang Bersama Kawan',
      refNumber: content.legal?.aktaNumber || 'Akta Notaris No. 10',
      date: content.legal?.aktaDate || '18 Maret 2021',
      authority: content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.',
      jurisdiction: 'Kota Bandar Lampung, Provinsi Lampung',
      legalBasis: 'Undang-Undang Republik Indonesia Nomor 40 Tahun 2007 tentang Perseroan Terbatas',
      summary:
        'Dokumen otentik konstitusi perseroan terbatas yang memuat anggaran dasar, permodalan, pembagian saham, serta maksud dan tujuan perseroan dalam bidang pembangunan dan pengembangan perumahan.',
      status: 'Terdaftar & Berlaku Sah',
      statusType: 'verified',
      details: [
        { label: 'Nomor Berkas Akta', value: content.legal?.aktaNumber || 'No. 10' },
        { label: 'Tanggal Pengesahan Akta', value: content.legal?.aktaDate || '18 Maret 2021' },
        { label: 'Pejabat Notaris Pembuat', value: content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.' },
        { label: 'Wilayah Jabatan Notaris', value: 'Kota Bandar Lampung' },
        { label: 'Bentuk Badan Hukum', value: 'Perseroan Terbatas (PT)' },
        { label: 'Status Fisik Berkas', value: 'Asli tersimpan di Brankas Arsip Legalitas Perseroan' },
      ],
      isPhysicalCustody: true,
    },
    {
      id: 'rec-02',
      code: 'ARC / 02 • MINISTERIAL DECREE',
      category: 'Pengesahan Kemenkumham RI',
      title: 'Surat Keputusan Menteri Hukum & HAM RI Pengesahan Badan Hukum',
      refNumber: content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021',
      date: content.legal?.skDate || '19 Maret 2021',
      authority: 'Ditjen Administrasi Hukum Umum (Ditjen AHU), Kemenkumham RI',
      jurisdiction: 'Republik Indonesia',
      legalBasis: 'Keputusan Menkumham RI tentang Pengesahan Pendirian Badan Hukum Perseroan Terbatas',
      summary:
        'Bukti negara yang mengakui eksistensi yuridis PT. Terbang Bersama Kawan sebagai subjek hukum mandiri di Republik Indonesia dengan hak dan kewajiban perdata penuh.',
      status: 'Disahkan Negara (SK AHU)',
      statusType: 'gazetted',
      externalUrl: 'https://ahu.go.id/',
      details: [
        { label: 'Nomor Register SK', value: content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021' },
        { label: 'Tanggal Penerbitan SK', value: content.legal?.skDate || '19 Maret 2021' },
        { label: 'Instansi Penerbit', value: 'Kementerian Hukum dan HAM Republik Indonesia' },
        { label: 'Direktorat', value: 'Direktorat Jenderal Administrasi Hukum Umum (Ditjen AHU)' },
        { label: 'Verifikasi Publik Portal', value: 'ahu.go.id (Sistem Administrasi Badan Hukum)' },
        { label: 'Keabsahan Operasional', value: 'Berlaku mengikat secara nasional tanpa kedaluwarsa' },
      ],
      isPhysicalCustody: false,
    },
    {
      id: 'rec-03',
      code: 'ARC / 03 • EXECUTIVE MANDATE',
      category: 'Kewenangan Direksi & Perikatan',
      title: 'Mandat Eksekutif & Hak Representasi Hukum Perseroan',
      refNumber: 'Pasal Anggaran Dasar & Akta Otentik Perseroan',
      date: 'Aktif Sejak 18 Maret 2021',
      authority: 'Rapat Umum Pemegang Saham (RUPS) & Anggaran Dasar Perseroan',
      jurisdiction: 'Pengadilan Negeri & Kantor Notaris/PPAT di Indonesia',
      legalBasis: 'Kewenangan Direktur Utama mewakili perseroan di dalam dan di luar pengadilan',
      summary:
        content.legal?.directorAuthority ||
        'Direktur berhak bertindak untuk dan atas nama Direksi serta mewakili Perseroan secara sah dalam penandatanganan Perjanjian Pengikatan Jual Beli (PPJB), Akta Jual Beli (AJB), serta perikatan perbankan KPR.',
      status: 'Kewenangan Penuh & Mengikat',
      statusType: 'active',
      details: [
        { label: 'Kewenangan Hukum', value: 'Mewakili perseroan di dalam dan di luar pengadilan' },
        { label: 'Otoritas Penandatanganan', value: 'PPJB, AJB Notaris, Perjanjian Kerjasama Bank (PKS)' },
        { label: 'Pengawasan Independen', value: 'Dewan Komisaris Perseroan' },
        { label: 'Keabsahan Transaksi', value: 'Memberikan kepastian hak mutlak bagi pembeli unit' },
      ],
      isPhysicalCustody: true,
    },
    {
      id: 'rec-04',
      code: 'ARC / 04 • LAND & DEVELOPMENT TITLE',
      category: 'Status Tanah & Izin Kawasan',
      title: 'Status Kepemilikan Lahan & Rencana Kawasan Puri Gunung Langgar',
      refNumber: 'SHM Induk Kawasan & Penetapan Tata Ruang Pemda',
      date: 'Progres Berkala 2021 - 2024',
      authority: 'Badan Pertanahan Nasional (BPN) Kabupaten Lampung Selatan',
      jurisdiction: 'Desa Sabah Balau, Kec. Tanjung Bintang, Lampung Selatan',
      legalBasis: 'Kepatuhan Regulasi Tata Ruang Perumahan & Standar FLPP Kementerian PUPR',
      summary:
        'Lahan pengembangan Puri Gunung Langgar berstatus Sertifikat Hak Milik (SHM) yang clean and clear dari sengketa, dalam tahapan penerbitan sertifikat pecahan per unit kavling serta pemenuhan standar kelayakan fasilitas FLPP.',
      status: 'Sertifikat SHM & Proses Pemecahan',
      statusType: 'in-progress',
      details: [
        { label: 'Lokasi Kawasan', value: 'Desa Sabah Balau, Tanjung Bintang, Kab. Lampung Selatan' },
        { label: 'Status Alas Hak Awal', value: 'Sertifikat Hak Milik (SHM) Induk' },
        { label: 'Target Alas Hak Konsumen', value: 'Sertifikat Hak Milik (SHM) mandiri per unit kavling' },
        { label: 'Status Bebas Sengketa', value: 'Bebas sita jaminan perbankan luar dan bebas sengketa batas' },
        { label: 'Skema Pembiayaan', value: 'Didukung KPR Bersubsidi FLPP Suku Bunga 5% Tetap' },
      ],
      isPhysicalCustody: true,
    },
  ];

  const activeRecord = records.find((r) => r.id === activeRecordId) || records[0];

  const faqs = [
    {
      q: 'Bagaimana status hukum kepemilikan tanah proyek Puri Gunung Langgar?',
      a: 'Lahan kawasan perumahan Puri Gunung Langgar telah berstatus sertifikat resmi (SHM) dan dalam proses pemecahan sertifikat per kavling sesuai penetapan tata ruang Badan Pertanahan Nasional (BPN) Kabupaten Lampung Selatan.',
    },
    {
      q: 'Apakah seluruh transaksi pembayaran masuk ke rekening perusahaan?',
      a: 'Ya, seluruh transaksi pembayaran biaya pemesanan (booking fee), uang muka, maupun cicilan wajib disetorkan melalui Rekening Giro resmi atas nama PT. Terbang Bersama Kawan, bukan rekening pribadi sales atau perorangan.',
    },
    {
      q: 'Bagaimana jika berkas permohonan KPR tidak disetujui oleh pihak Bank?',
      a: 'Ketentuan dan mekanisme pengembalian dana pemesanan/DP diatur secara transparan dalam Surat Pemesanan Rumah (SPR) yang disepakati bersama sebelum proses pengajuan berkas ke perbankan mitra.',
    },
    {
      q: 'Apakah PT. TBK memiliki pengesahan resmi dari Kemenkumham RI?',
      a: `Ya, perseroan telah memperoleh Surat Keputusan Menteri Hukum dan Hak Asasi Manusia Republik Indonesia Nomor ${content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'} bertanggal ${content.legal?.skDate || '19 Maret 2021'}.`,
    },
    {
      q: 'Dapatkah calon konsumen melihat salinan fisik dokumen legalitas perusahaan?',
      a: 'Tentu. Calon pembeli dipersilakan berkunjung ke kantor operasional kami di Bandar Lampung untuk memeriksa salinan legalisir dokumen perseroan didampingi tim legalitas kami.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#252A30] font-sans selection:bg-[#FF9828] selection:text-[#0B2D50] relative">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#FF9828] z-40 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* ONE-TIME SPLIT CURTAIN REVEAL ON INITIAL ENTRY */}
      {showCurtain && (
        <div
          className="fixed inset-0 z-50 pointer-events-none flex flex-col md:flex-row overflow-hidden"
          aria-hidden="true"
        >
          {/* Left / Top Curtain Panel */}
          <div
            className={`w-full md:w-1/2 h-1/2 md:h-full bg-[#F5F1E8] border-b md:border-b-0 md:border-r border-[#0B2D50]/20 flex flex-col justify-end md:justify-center p-8 transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
              curtainParted ? '-translate-y-full md:-translate-y-0 md:-translate-x-full' : 'translate-y-0 translate-x-0'
            }`}
          >
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-[#0B2D50]/60 uppercase block">
                PT. TERBANG BERSAMA KAWAN
              </span>
              <div className="font-serif text-3xl md:text-5xl text-[#0B2D50] tracking-tight">
                Corporate Archive
              </div>
              <div className="w-12 h-[2px] bg-[#FF9828]" />
            </div>
          </div>

          {/* Right / Bottom Curtain Panel */}
          <div
            className={`w-full md:w-1/2 h-1/2 md:h-full bg-[#0B2D50] text-[#F5F1E8] flex flex-col justify-start md:justify-center p-8 transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
              curtainParted ? 'translate-y-full md:translate-y-0 md:translate-x-full' : 'translate-y-0 translate-x-0'
            }`}
          >
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-[#FF9828] uppercase block">
                STATUTORY RECORDS • AHU-2021
              </span>
              <div className="font-cormorant italic text-2xl md:text-4xl text-[#F5F1E8]/90">
                Kepastian Hukum Sejak Fondasi Pertama
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header content={content} />

      <main id="main-content" className="relative">
        {/* ========================================================= */}
        {/* SECTION 1: ASYMMETRICAL EDITORIAL OPENING                 */}
        {/* ========================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#0B2D50]/15 bg-[#F5F1E8] bg-archive-grid overflow-hidden">
          {/* Subtle architectural coordinates watermark */}
          <div className="absolute top-8 right-8 font-mono text-[10px] tracking-widest text-[#0B2D50]/35 select-none pointer-events-none hidden sm:block">
            REF // N° 2021.TBK • LAT -5.39714° LONG 105.32115°
          </div>

          <div className="container-editorial relative z-10">
            {/* Small Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#0B2D50]/65 mb-8">
              <Link href="/" className="hover:text-[#FF9828] transition-colors">
                Beranda
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-[#FF9828] font-medium">The Corporate Archive</span>
              <span className="opacity-40">/</span>
              <span className="text-[#0B2D50] font-semibold">Legalitas Resmi</span>
            </nav>

            {/* Asymmetrical 12-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column (7 Columns): Oversized Editorial Typography */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-[#0B2D50]/5 border border-[#0B2D50]/15 text-[#0B2D50] text-[11px] font-mono tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9828]" />
                  <span>01 / CORPORATE ARCHIVE &amp; STATUTORY RECORDS</span>
                </div>

                <div className="space-y-3">
                  <h1 className="font-serif font-normal text-6xl sm:text-7xl lg:text-[92px] leading-[0.92] text-[#0B2D50] tracking-tight">
                    LEGALITAS
                  </h1>
                  {/* Subtle animated orange drafting line */}
                  <div className="w-24 h-[2px] bg-[#FF9828] transition-all duration-700" />
                </div>

                <p className="font-cormorant italic text-2xl sm:text-3xl lg:text-[34px] leading-[1.18] text-[#124B82] max-w-xl">
                  &ldquo;Kepastian hukum dan ketertiban yuridis adalah fondasi hakiki dari setiap jengkal hunian yang kami bangun.&rdquo;
                </p>

                <p className="text-sm sm:text-base text-[#252A30]/80 leading-relaxed max-w-xl pt-2">
                  Sebagai pengembang perumahan subsidi terpercaya di Bandar Lampung, PT. Terbang Bersama Kawan
                  menegakkan standar transparansi penuh. Seluruh izin usaha, akta notaris pendirian, pengesahan kementerian,
                  serta alas hak sertifikat lahan terdokumentasi rapi dan dapat diverifikasi oleh konsumen maupun mitra perbankan.
                </p>
              </div>

              {/* Right Column (5 Columns): Technical Architectural Spec Ledger */}
              <div className="lg:col-span-5 bg-white border border-[#0B2D50]/15 p-6 sm:p-8 shadow-sm space-y-6 relative">
                {/* Architectural Drafting Corner Marks */}
                <div className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF9828]" />
                <div className="absolute -bottom-[5px] -right-[5px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF9828]" />

                <div className="flex items-center justify-between pb-4 border-b border-[#0B2D50]/10">
                  <span className="font-mono text-[11px] tracking-wider text-[#0B2D50]/60 uppercase">
                    DATA PERSEROAN TERVERIFIKASI
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#15966A]/10 text-[#15966A] rounded-sm">
                    AKTIF &amp; SAH
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-[#252A30]/85 divide-y divide-[#0B2D50]/10">
                  <div className="pt-2 flex justify-between gap-4">
                    <span className="text-[#0B2D50]/60 font-medium">Badan Hukum</span>
                    <strong className="text-[#0B2D50] text-right font-semibold">
                      PT. Terbang Bersama Kawan
                    </strong>
                  </div>
                  <div className="pt-3 flex justify-between gap-4">
                    <span className="text-[#0B2D50]/60 font-medium">Akta Notaris</span>
                    <strong className="text-[#0B2D50] text-right font-semibold">
                      {content.legal?.aktaNumber || 'No. 10'} (18 Maret 2021)
                    </strong>
                  </div>
                  <div className="pt-3 flex justify-between gap-4">
                    <span className="text-[#0B2D50]/60 font-medium">Notaris Rekanan</span>
                    <strong className="text-[#0B2D50] text-right font-semibold">
                      {content.legal?.notary || 'Eka Dian Anggraini, S.H., M.Kn.'}
                    </strong>
                  </div>
                  <div className="pt-3 flex justify-between gap-4">
                    <span className="text-[#0B2D50]/60 font-medium">SK Kemenkumham</span>
                    <strong className="text-[#124B82] text-right font-mono font-bold break-all">
                      {content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.2021'}
                    </strong>
                  </div>
                  <div className="pt-3 flex justify-between gap-4">
                    <span className="text-[#0B2D50]/60 font-medium">Yurisdiksi Operasional</span>
                    <strong className="text-[#0B2D50] text-right font-semibold">
                      Bandar Lampung &amp; Lampung Selatan
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0B2D50]/10">
                  <a
                    href="#archive-explorer"
                    className="group inline-flex items-center gap-2 text-xs font-semibold text-[#0B2D50] hover:text-[#FF9828] transition-colors"
                  >
                    <span>Jelajahi Berkas Dokumen Resmi</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: THE CORPORATE ARCHIVE EXPLORER                 */}
        {/* ========================================================= */}
        <section id="archive-explorer" className="py-20 md:py-32 bg-white border-b border-[#0B2D50]/15 scroll-mt-20">
          <div className="container-editorial space-y-12">
            {/* Section Header with Refined Editorial Contrast */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#0B2D50]/15">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 font-mono text-xs text-[#FF9828] tracking-widest uppercase">
                  <span>02 / STATUTORY DOSSIER</span>
                  <span className="w-6 h-px bg-[#FF9828]" />
                </div>
                <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl text-[#0B2D50] leading-tight">
                  Arsip Yuridis &amp; Kepastian Dokumen
                </h2>
                <p className="text-xs sm:text-sm text-[#252A30]/75 leading-relaxed">
                  Pilih salah satu nomor arsip di bawah ini untuk meninjau rincian metadata, landasan hukum,
                  dan verifikasi otentisitas dokumen operasional perseroan.
                </p>
              </div>

              <div className="font-mono text-xs text-[#0B2D50]/50 tracking-wider hidden md:block">
                TOTAL DOKUMEN: {records.length} BERKAS
              </div>
            </div>

            {/* Asymmetric Desktop Layout & Responsive Mobile Stacking */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column (7 Columns): Numbered Editorial Document List */}
              <div className="lg:col-span-7 space-y-3">
                {records.map((rec, index) => {
                  const isActive = activeRecordId === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setActiveRecordId(rec.id)}
                      onMouseEnter={() => setActiveRecordId(rec.id)}
                      className={`group p-6 sm:p-7 border transition-all duration-200 cursor-pointer text-left relative ${
                        isActive
                          ? 'border-[#0B2D50] bg-[#F5F1E8]/70 shadow-sm'
                          : 'border-[#0B2D50]/15 bg-white hover:border-[#124B82]/50 hover:bg-[#F5F1E8]/20'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#FF9828]" aria-hidden="true" />
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span
                            className={`tracking-wider ${
                              isActive ? 'text-[#FF9828] font-bold' : 'text-[#0B2D50]/50 group-hover:text-[#0B2D50]'
                            }`}
                          >
                            {rec.code}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10.5px] rounded-sm font-sans font-medium ${
                              rec.statusType === 'verified'
                                ? 'bg-[#15966A]/10 text-[#15966A]'
                                : rec.statusType === 'gazetted'
                                ? 'bg-[#0B2D50]/10 text-[#0B2D50]'
                                : 'bg-[#FF9828]/15 text-[#0B2D50]'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-[#124B82] block mb-1">
                            {rec.category}
                          </span>
                          <h3
                            className={`font-serif text-xl sm:text-2xl transition-colors ${
                              isActive ? 'text-[#0B2D50]' : 'text-[#252A30] group-hover:text-[#0B2D50]'
                            }`}
                          >
                            {rec.title}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#0B2D50]/10 text-xs text-[#252A30]/75">
                          <div>
                            <span className="text-[#0B2D50]/50 font-medium block">Nomor Referensi:</span>
                            <span className="font-mono text-[#0B2D50] font-semibold">{rec.refNumber}</span>
                          </div>
                          <div>
                            <span className="text-[#0B2D50]/50 font-medium block">Penerbit / Instansi:</span>
                            <span className="text-[#0B2D50] font-medium truncate block">{rec.authority}</span>
                          </div>
                        </div>

                        {/* Mobile preview accordion trigger (Mobile Only) */}
                        <div className="lg:hidden pt-3 border-t border-[#0B2D50]/10 flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#FF9828]">
                            {isActive ? 'Sedang Ditampilkan' : 'Ketuk untuk Meninjau'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalDoc(rec);
                            }}
                            className="text-xs font-semibold text-[#0B2D50] underline hover:text-[#FF9828]"
                          >
                            Rincian Dokumen &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column (5 Columns): Asymmetrically Sized Live Dossier Preview */}
              <div className="lg:col-span-5 sticky top-24">
                <div className="bg-[#F5F1E8] border border-[#0B2D50]/20 p-7 sm:p-9 shadow-md relative overflow-hidden">
                  {/* Subtle architectural drafting stamp */}
                  <div className="flex items-center justify-between pb-5 border-b border-[#0B2D50]/15">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#FF9828]" />
                      <span className="font-mono text-[11px] tracking-widest text-[#0B2D50] uppercase font-bold">
                        VERIFIED LEGAL DOSSIER
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#0B2D50]/50">
                      ID: {activeRecord.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Active Document Details */}
                  <div className="py-6 space-y-5">
                    <div>
                      <span className="font-mono text-[11px] text-[#FF9828] uppercase tracking-wider block mb-1">
                        {activeRecord.category}
                      </span>
                      <h4 className="font-serif text-2xl sm:text-3xl text-[#0B2D50] leading-snug">
                        {activeRecord.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#252A30]/80 leading-relaxed italic bg-white/70 p-4 border-l-2 border-[#FF9828]">
                      &ldquo;{activeRecord.summary}&rdquo;
                    </p>

                    <div className="space-y-3 pt-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#0B2D50]/60 block">
                        METADATA RESMI PERSEROAN:
                      </span>
                      <div className="divide-y divide-[#0B2D50]/10 text-xs text-[#252A30]">
                        {activeRecord.details.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-[#0B2D50]/65 font-medium">{item.label}:</span>
                            <span className="text-[#0B2D50] font-semibold text-left sm:text-right">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Document Actions & Custody Feedback */}
                  <div className="pt-6 border-t border-[#0B2D50]/15 space-y-3">
                    <button
                      type="button"
                      onClick={() => setSelectedModalDoc(activeRecord)}
                      className="w-full py-3.5 px-5 bg-[#0B2D50] hover:bg-[#124B82] text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <FileCheck className="w-4 h-4 text-[#FF9828]" />
                      <span>Verifikasi &amp; Permintaan Salinan Berkas</span>
                    </button>

                    {activeRecord.externalUrl ? (
                      <a
                        href={activeRecord.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-white border border-[#0B2D50]/20 hover:border-[#0B2D50] text-[#0B2D50] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Validasi Portal AHU Kemenkumham RI</span>
                      </a>
                    ) : (
                      <div className="p-3 bg-white/50 border border-[#0B2D50]/10 rounded-sm flex items-start gap-2.5 text-[11.5px] text-[#0B2D50]/80">
                        <Info className="w-4 h-4 text-[#FF9828] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          Berkas fisik asli tersimpan dalam brankas hukum PT. TBK. Salinan berlegalisir dapat diverifikasi langsung di kantor perseroan.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: VISUAL INTERLUDE (THE DELIBERATE PAUSE)       */}
        {/* ========================================================= */}
        <section className="py-24 md:py-36 bg-[#0B2D50] text-[#F5F1E8] relative overflow-hidden border-b border-[#0B2D50]">
          {/* Subtle CAD architectural grid in deep navy */}
          <div className="absolute inset-0 bg-archive-grid-dark opacity-35 pointer-events-none" aria-hidden="true" />

          {/* Oversized archive watermark in Cormorant Garamond */}
          <div className="absolute -bottom-8 -right-8 font-cormorant text-[160px] sm:text-[240px] text-[#F5F1E8]/5 select-none pointer-events-none leading-none">
            N° 2021
          </div>

          <div className="container-editorial relative z-10">
            <div className="max-w-4xl mx-auto space-y-10">
              {/* Technical Marker */}
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#FF9828] uppercase">
                <span className="w-8 h-px bg-[#FF9828]" />
                <span>03 / VISUAL INTERLUDE • ARCHITECTURAL MANDATE</span>
              </div>

              {/* The Powerful Transparency Statement */}
              <blockquote className="space-y-6">
                <p className="font-cormorant italic text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.14] text-[#F5F1E8]">
                  &ldquo;Sebuah rumah bukan sekadar dinding bata dan atap genteng, melainkan hak hukum atas ruang hidup yang terlindungi. Di PT. Terbang Bersama Kawan, kepastian legalitas mendahului peletakan batu pertama.&rdquo;
                </p>
                <div className="w-20 h-0.5 bg-[#FF9828]" />
              </blockquote>

              {/* Technical Drawing Blueprint Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#F5F1E8]/15 text-xs">
                <div className="space-y-1">
                  <span className="text-[#FF9828] font-mono tracking-wider block">PRINSIP 01</span>
                  <div className="font-serif text-lg text-[#F5F1E8]">Kepastian Hak Konsumen</div>
                  <p className="text-[#F5F1E8]/70 text-[11.5px] leading-relaxed">
                    Setiap unit kavling memiliki jalur legalitas bersih yang siap ditingkatkan menjadi SHM mandiri.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#FF9828] font-mono tracking-wider block">PRINSIP 02</span>
                  <div className="font-serif text-lg text-[#F5F1E8]">Sinergi Perbankan FLPP</div>
                  <p className="text-[#F5F1E8]/70 text-[11.5px] leading-relaxed">
                    Telah lolos audit uji tuntas badan hukum dari bank-bank penyalur program subsidi perumahan pemerintah.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#FF9828] font-mono tracking-wider block">PRINSIP 03</span>
                  <div className="font-serif text-lg text-[#F5F1E8]">Domisili Nyata &amp; Akuntabel</div>
                  <p className="text-[#F5F1E8]/70 text-[11.5px] leading-relaxed">
                    Operasional perseroan dijalankan langsung dari kantor fisik di Bandar Lampung dengan tim pengurus yang transparan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: STANDAR KEPATUHAN & VERIFIKASI KONSUMEN        */}
        {/* ========================================================= */}
        <section className="py-20 md:py-32 bg-[#F5F1E8] border-b border-[#0B2D50]/15">
          <div className="container-editorial space-y-16">
            {/* Header */}
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[#FF9828] tracking-widest uppercase">
                <span>04 / COMPLIANCE PROTOCOL</span>
                <span className="w-6 h-px bg-[#FF9828]" />
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#0B2D50]">
                Protokol Perlindungan Hukum Konsumen
              </h2>
              <p className="text-xs sm:text-sm text-[#252A30]/75 leading-relaxed">
                Empat pilar kepatuhan ketat yang membedakan PT. TBK dari pengembang tanpa izin atau perumahan bermasalah:
              </p>
            </div>

            {/* Asymmetrical 4-Pillar Ledger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <div className="p-8 bg-white border border-[#0B2D50]/15 shadow-sm space-y-4 relative">
                <span className="font-cormorant text-4xl text-[#0B2D50] font-bold block">
                  01
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#0B2D50]">
                  Rekening Resmi Badan Usaha Perseroan
                </h3>
                <p className="text-xs sm:text-sm text-[#252A30]/80 leading-relaxed">
                  Seluruh dana konsumen (booking fee, uang muka DP, atau titipan biaya administrasi) wajib disetorkan
                  melalui rekening koran giro resmi beratasnamakan <strong>PT. Terbang Bersama Kawan</strong>.
                  Kami melarang keras transaksi pembayaran ke rekening pribadi perorangan atau tenaga pemasar.
                </p>
                <div className="pt-2 text-xs font-mono text-[#15966A] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Jaminan audit pembukuan perseroan</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-8 bg-white border border-[#0B2D50]/15 shadow-sm space-y-4 relative">
                <span className="font-cormorant text-4xl text-[#0B2D50] font-bold block">
                  02
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#0B2D50]">
                  Sertifikat Lahan Bersih &amp; Terverifikasi
                </h3>
                <p className="text-xs sm:text-sm text-[#252A30]/80 leading-relaxed">
                  Lahan kawasan Puri Gunung Langgar telah berstatus Sertifikat Hak Milik (SHM) yang tidak dalam status sengketa,
                  tidak digadaikan ke pihak ketiga yang melanggar hak pembeli, dan sedang diproses pecah sertifikat per kavling
                  melalui koordinasi resmi bersama BPN Kabupaten Lampung Selatan.
                </p>
                <div className="pt-2 text-xs font-mono text-[#15966A] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kordinasi Kantor Pertanahan BPN</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-8 bg-white border border-[#0B2D50]/15 shadow-sm space-y-4 relative">
                <span className="font-cormorant text-4xl text-[#0B2D50] font-bold block">
                  03
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#0B2D50]">
                  Audit Legalitas Bank Penyalur FLPP
                </h3>
                <p className="text-xs sm:text-sm text-[#252A30]/80 leading-relaxed">
                  Untuk dapat menyalurkan KPR Bersubsidi dengan suku bunga 5% tetap, perseroan wajib lulus uji tuntas (due diligence)
                  kelayakan hukum, teknis konstruksi, dan kredibilitas manajemen oleh perbankan nasional yang bekerja sama dengan BP Tapera.
                </p>
                <div className="pt-2 text-xs font-mono text-[#15966A] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Standar kelayakan nasional BP Tapera</span>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-8 bg-white border border-[#0B2D50]/15 shadow-sm space-y-4 relative">
                <span className="font-cormorant text-4xl text-[#0B2D50] font-bold block">
                  04
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#0B2D50]">
                  Kantor Operasional &amp; Manajemen Nyata
                </h3>
                <p className="text-xs sm:text-sm text-[#252A30]/80 leading-relaxed">
                  PT. TBK beroperasi secara riil di Bandar Lampung. Calon pembeli dipersilakan berkunjung langsung
                  ke kantor pemasaran atau kantor operasional perseroan pada jam kerja untuk berkonsultasi langsung
                  dengan direksi, staf legalitas, dan divisi teknik.
                </p>
                <div className="pt-2 text-xs font-mono text-[#15966A] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Akses konsultasi tatap muka terbuka</span>
                </div>
              </div>
            </div>

            {/* Tanya Jawab Hukum (FAQ Accordion) */}
            <div className="pt-10 border-t border-[#0B2D50]/15 space-y-8">
              <div className="max-w-xl space-y-1">
                <span className="font-mono text-xs text-[#FF9828] uppercase tracking-wider block">
                  TANYA JAWAB HUKUM
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#0B2D50]">
                  Pertanyaan Konsumen Terkait Aspek Legalitas
                </h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[#0B2D50]/15 bg-white transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4"
                        aria-expanded={isOpen}
                      >
                        <span className="font-serif text-base sm:text-lg text-[#0B2D50]">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#FF9828] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#252A30]/80 leading-relaxed border-t border-[#0B2D50]/10">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: RESTRAINED CLOSING SECTION                     */}
        {/* ========================================================= */}
        <section className="py-20 md:py-28 bg-[#252A30] text-[#F5F1E8] relative overflow-hidden">
          <div className="container-editorial">
            <div className="max-w-3xl space-y-8">
              <div className="flex items-center gap-2 font-mono text-xs text-[#FF9828] tracking-widest uppercase">
                <span>05 / DIRECT VERIFICATION</span>
                <span className="w-8 h-px bg-[#FF9828]" />
              </div>

              <div className="space-y-4">
                <h2 className="font-cormorant italic text-3xl sm:text-4xl md:text-5xl text-[#F5F1E8] leading-tight">
                  Integritas Korporasi Dimulai dari Keterbukaan
                </h2>
                <p className="text-xs sm:text-sm text-[#F5F1E8]/75 leading-relaxed max-w-2xl">
                  Manajemen dan staf legalitas PT. Terbang Bersama Kawan membuka akses seluas-luasnya bagi calon pembeli
                  dan mitra perbankan untuk memverifikasi dokumen asli perseroan di kantor kami di Bandar Lampung.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/kontak"
                  className="px-8 py-3.5 bg-[#FF9828] hover:bg-[#F28A17] text-[#0B2D50] text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-md text-center"
                >
                  Jadwalkan Konsultasi Legalitas di Kantor
                </Link>

                <a
                  href={`${baseWaUrl}?text=${encodeURIComponent(
                    'Halo Tim Legalitas PT. TBK, saya ingin bertanya dan berkonsultasi mengenai keabsahan dokumen serta status sertifikat perumahan Puri Gunung Langgar.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 border border-[#F5F1E8]/30 hover:border-[#F5F1E8] text-[#F5F1E8] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF9828]" />
                  <span>Konsultasi Cepat via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* MODAL / DRAWER: DOCUMENT CUSTODY & VERIFICATION FEEDBACK   */}
      {/* ========================================================= */}
      {selectedModalDoc && (
        <div
          className="fixed inset-0 z-50 bg-[#0B2D50]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedModalDoc(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl bg-[#F5F1E8] border border-[#0B2D50]/20 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#0B2D50]/15">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#FF9828] uppercase tracking-wider block">
                  {selectedModalDoc.code}
                </span>
                <h4 className="font-serif text-2xl text-[#0B2D50] leading-snug">
                  {selectedModalDoc.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalDoc(null)}
                className="p-1 rounded-sm text-[#0B2D50]/60 hover:text-[#0B2D50] hover:bg-[#0B2D50]/10 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Metadata Sheet */}
            <div className="space-y-4 text-xs text-[#252A30]">
              <div className="p-4 bg-white border border-[#0B2D50]/15 space-y-2.5">
                <div className="text-[11px] font-mono uppercase text-[#0B2D50]/60 font-bold">
                  KETERANGAN RESMI DOKUMEN:
                </div>
                <div className="divide-y divide-[#0B2D50]/10 text-xs">
                  {selectedModalDoc.details.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between gap-2">
                      <span className="text-[#0B2D50]/60 font-medium">{item.label}</span>
                      <span className="text-[#0B2D50] font-semibold text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custody Notice */}
              <div className="p-4 bg-[#0B2D50]/5 border-l-2 border-[#FF9828] space-y-2">
                <div className="flex items-center gap-2 font-semibold text-[#0B2D50] text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#15966A]" />
                  <span>Pemberitahuan Penyimpanan Fisik Berkas</span>
                </div>
                <p className="text-[12px] text-[#252A30]/80 leading-relaxed">
                  Berkas fisik autentik dokumen ini tersimpan aman di dalam brankas hukum kantor operasional PT. Terbang Bersama Kawan.
                  Untuk keperluan penelaahan notariat, validasi perbankan, atau verifikasi calon pembeli, permohonan salinan legalisir
                  atau jadwal pemeriksaan berkas dapat diajukan secara langsung.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#0B2D50]/15 flex flex-col sm:flex-row gap-3">
              <a
                href={`${baseWaUrl}?text=${encodeURIComponent(
                  `Halo PT. TBK, saya ingin mengajukan permohonan verifikasi/pemeriksaan salinan resmi dokumen: ${selectedModalDoc.title} (${selectedModalDoc.refNumber}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#FF9828] hover:bg-[#F28A17] text-[#0B2D50] text-xs font-semibold tracking-wider uppercase text-center transition-colors shadow-sm"
              >
                Ajukan Salinan via WhatsApp
              </a>

              {selectedModalDoc.externalUrl && (
                <a
                  href={selectedModalDoc.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-white border border-[#0B2D50]/20 hover:border-[#0B2D50] text-[#0B2D50] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Portal AHU</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setSelectedModalDoc(null)}
                className="py-3 px-4 bg-transparent border border-[#0B2D50]/20 text-[#0B2D50] text-xs font-medium hover:bg-[#0B2D50]/5 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer & WhatsApp Action */}
      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
