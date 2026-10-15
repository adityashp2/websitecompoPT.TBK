'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { initialSiteContent, SiteContent } from '@/lib/initialData';
import { 
  Calculator, 
  HelpCircle, 
  FileCheck2, 
  CheckCircle2, 
  Phone, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Info
} from 'lucide-react';

export default function SimulasiKprPage() {
  const [content, setContent] = useState<SiteContent>(initialSiteContent);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setContent(json.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const [harga, setHarga] = useState<number>(166000000);
  const [dp, setDp] = useState<number>(2000000);
  const [tenor, setTenor] = useState<number>(20); // 10, 15, or 20

  const sisaPokok = Math.max(0, harga - dp);
  const rateTahunan = 0.05; // 5% flat FLPP
  const rateBulanan = rateTahunan / 12;

  const hitungAngsuran = (t: number) => {
    const months = t * 12;
    if (sisaPokok <= 0) return 0;
    return Math.round(
      (sisaPokok * (rateBulanan * Math.pow(1 + rateBulanan, months))) /
        (Math.pow(1 + rateBulanan, months) - 1)
    );
  };

  const angsuranBulan = hitungAngsuran(tenor);
  const angsuranHari = Math.round(angsuranBulan / 30);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const rawWa = content.contact?.whatsapp || '0812-7890-1234';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;

  const waSimulasiMessage = `Halo PT. TBK, saya ingin konsultasi pengajuan KPR Puri Gunung Langgar dengan rincian simulasi:\n- Harga Rumah: ${formatRupiah(harga)}\n- Uang Muka (DP): ${formatRupiah(dp)}\n- Pokok Pinjaman: ${formatRupiah(sisaPokok)}\n- Jangka Waktu (Tenor): ${tenor} Tahun\n- Estimasi Angsuran: ${formatRupiah(angsuranBulan)} / bulan\n\nMohon informasi persyaratan berkas dan survei unit contoh.`;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent(waSimulasiMessage)}`;

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
              <span className="text-[#C9A96A] font-semibold">Simulasi KPR FLPP</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-[#C9A96A]/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>KALKULATOR RESMI KPR FLPP</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight">
                Simulasi Angsuran Rumah Subsidi
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                Hitung estimasi angsuran bulanan rumah bersubsidi Puri Gunung Langgar dengan suku bunga tetap 5% flat per tahun sesuai skema fasilitas likuiditas pembiayaan perumahan (FLPP).
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Section */}
        <section className="py-12 sm:py-16">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Inputs */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-700" />
                    <span>Parameter Simulasi KPR</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Sesuaikan nilai uang muka dan pilihan jangka waktu pinjaman:
                  </p>
                </div>

                {/* Input Harga Rumah */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Harga Unit Rumah
                    </label>
                    <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Standar FLPP Lampung
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={formatRupiah(harga)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 text-sm sm:text-base cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Berdasarkan Kepmen PUPR untuk zona Lampung dan sekitarnya.
                  </span>
                </div>

                {/* Input Uang Muka (DP) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Uang Muka (DP): <span className="text-emerald-700 font-mono">{formatRupiah(dp)}</span>
                    </label>
                    <span className="text-xs text-slate-500 font-mono">
                      {((dp / harga) * 100).toFixed(1)}% dari harga
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1000000}
                    max={30000000}
                    step={500000}
                    value={dp}
                    onChange={(e) => setDp(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />

                  {/* Quick DP Preset Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[2000000, 5000000, 10000000, 15000000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDp(val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                          dp === val
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {formatRupiah(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenor Pinjaman */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Jangka Waktu Pinjaman (Tenor)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 15, 20].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenor(t)}
                        className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all border text-center ${
                          tenor === t
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div>{t} Tahun</div>
                        <div className="text-[11px] font-normal opacity-75">{t * 12} Bulan</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suku Bunga Notice */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Suku Bunga KPR Subsidi FLPP</span>
                  </div>
                  <span className="font-bold text-emerald-700 font-mono">5.0% Flat Sampai Lunas</span>
                </div>
              </div>

              {/* Right Column: Calculation Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#0E1014] text-white p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-xl space-y-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                      HASIL SIMULASI ANGSURAN
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#F4EFE6]">
                      Estimasi Cicilan Bulanan
                    </h3>
                  </div>

                  {/* Main Highlighted Number */}
                  <div className="p-5 rounded-xl bg-white/[0.06] border border-white/10 text-center space-y-1">
                    <div className="text-xs uppercase tracking-wider text-white/60">
                      Angsuran Tenor {tenor} Tahun
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#C9A96A] font-mono tracking-tight">
                      {formatRupiah(angsuranBulan)}
                      <span className="text-xs font-normal text-white/60"> /bulan</span>
                    </div>
                    <div className="text-xs text-white/80 pt-1">
                      Setara dengan sekitar <strong className="text-emerald-400 font-mono">{formatRupiah(angsuranHari)}/hari</strong>
                    </div>
                  </div>

                  {/* Breakdown List */}
                  <div className="space-y-2.5 text-xs text-white/80">
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span>Harga Rumah</span>
                      <span className="font-mono font-semibold text-white">{formatRupiah(harga)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span>Uang Muka (DP)</span>
                      <span className="font-mono font-semibold text-white">{formatRupiah(dp)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span>Pokok Pinjaman Bank</span>
                      <span className="font-mono font-semibold text-white">{formatRupiah(sisaPokok)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span>Suku Bunga FLPP</span>
                      <span className="font-mono font-semibold text-emerald-400">5% Tetap (Flat)</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Ajukan Simulasi Ini via WA</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      href="/kontak"
                      className="w-full py-3.5 px-4 rounded-xl border border-white/20 hover:border-white text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
                    >
                      <span>Isi Formulir Minat Unit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Perbandingan 3 Tenor */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Perbandingan Tenor Lainnya (DP {formatRupiah(dp)})
                  </div>
                  <div className="space-y-2 text-xs">
                    {[10, 15, 20].map((t) => (
                      <div
                        key={t}
                        onClick={() => setTenor(t)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          tenor === t
                            ? 'bg-amber-50 border-amber-300 font-bold text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>Tenor {t} Tahun ({t * 12} bln)</span>
                        <span className="font-mono text-slate-900">{formatRupiah(hitungAngsuran(t))}/bln</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Syarat Pengajuan KPR Bersubsidi */}
        <section className="py-14 bg-white border-t border-b border-slate-200">
          <div className="container-std max-w-[1120px] mx-auto space-y-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                PERSYARATAN RESMI FLPP
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Syarat & Dokumen Pengajuan KPR Bersubsidi
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Kriteria calon pembeli yang berhak mendapatkan fasilitas subsidi FLPP dari pemerintah:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Kriteria Calon Penerima Subsidi</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-7 list-disc">
                  <li>Warga Negara Indonesia (WNI) berusia minimal 21 tahun atau telah menikah.</li>
                  <li>Belum pernah memiliki rumah pribadi dibuktikan surat keterangan belum memiliki rumah.</li>
                  <li>Belum pernah menerima subsidi bantuan perumahan dari pemerintah.</li>
                  <li>Penghasilan total keluarga tidak melebihi ambang batas regulasi FLPP (maksimal Rp 8 juta/bulan).</li>
                  <li>Memiliki masa kerja atau kegiatan usaha aktif minimal 1 tahun.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <FileCheck2 className="w-5 h-5 text-[#C9A96A] shrink-0" />
                  <span>Berkas yang Harus Disiapkan</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-7 list-disc">
                  <li>Fotokopi KTP Pemohon & Pasangan (jika menikah).</li>
                  <li>Fotokopi Kartu Keluarga (KK) & Surat Nikah/Cerai.</li>
                  <li>Nomor Pokok Wajib Pajak (NPWP) & Bukti SPT Tahunan PPh 21.</li>
                  <li>Slip Gaji 3 bulan terakhir / Surat Keterangan Usaha (SKU) bagi wirausaha.</li>
                  <li>Rekening koran tabungan 3 bulan terakhir.</li>
                  <li>Riwayat kredit lancar (BI Checking / SLIK OJK Kolektibilitas 1).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
