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
              <span className="text-[#C5A568] font-semibold">Simulasi KPR FLPP</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/[0.06] border border-white/10 text-[#C5A568] text-[11px] font-semibold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>KALKULATOR RESMI KPR FLPP</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3EFE6] leading-tight">
                Simulasi Angsuran Rumah Subsidi
              </h1>
              <p className="text-[#F3EFE6]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                Hitung estimasi angsuran bulanan rumah bersubsidi Puri Gunung Langgar dengan suku bunga tetap 5% flat per tahun sesuai skema fasilitas likuiditas pembiayaan perumahan (FLPP).
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Section: Open Two-Column Grid */}
        <section className="py-16 sm:py-20">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Interactive Inputs (Open Editorial Form) */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                    Perhitungan Angsuran
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                    Parameter Simulasi KPR
                  </h2>
                  <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                    Sesuaikan nilai uang muka dan pilihan jangka waktu pinjaman:
                  </p>
                </div>

                {/* Input Harga Rumah */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#262722]">
                      Harga Unit Rumah
                    </label>
                    <span className="text-[11px] text-[#C5A568] font-medium">
                      Standar FLPP Lampung
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={formatRupiah(harga)}
                    className="w-full px-4 py-3 rounded-[10px] bg-white/60 border border-[#DDD8CE] font-mono font-medium text-[#262722] text-sm sm:text-base cursor-not-allowed"
                  />
                  <span className="text-[11px] text-[#77766F] block">
                    Berdasarkan Kepmen PUPR untuk zona Lampung dan sekitarnya.
                  </span>
                </div>

                {/* Input Uang Muka (DP) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#262722]">
                      Uang Muka (DP): <span className="text-[#C5A568] font-mono font-bold">{formatRupiah(dp)}</span>
                    </label>
                    <span className="text-xs text-[#77766F] font-mono">
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
                    className="w-full accent-[#C5A568] cursor-pointer h-2 bg-[#DDD8CE] rounded-lg"
                  />

                  {/* Quick DP Preset Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[2000000, 5000000, 10000000, 15000000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDp(val)}
                        className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all border ${
                          dp === val
                            ? 'bg-[#262722] text-[#F3EFE6] border-[#262722]'
                            : 'bg-white/60 hover:bg-white text-[#262722] border-[#DDD8CE]'
                        }`}
                      >
                        {formatRupiah(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenor Pinjaman */}
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#262722] block">
                    Jangka Waktu Pinjaman (Tenor)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 15, 20].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenor(t)}
                        className={`py-3 px-4 rounded-[10px] text-xs sm:text-sm font-semibold transition-all border text-center ${
                          tenor === t
                            ? 'bg-[#262722] text-[#F3EFE6] border-[#262722] shadow-sm'
                            : 'bg-white/60 hover:bg-white text-[#262722] border-[#DDD8CE]'
                        }`}
                      >
                        <div>{t} Tahun</div>
                        <div className="text-[11px] font-normal opacity-75">{t * 12} Bulan</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suku Bunga Notice: Open Thin Strip */}
                <div className="py-3 px-4 border-l-2 border-[#C5A568] bg-white/40 flex items-center justify-between text-xs text-[#262722]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A568] shrink-0" />
                    <span className="font-medium">Suku Bunga KPR Subsidi FLPP</span>
                  </div>
                  <span className="font-mono font-bold text-[#262722]">5.0% Flat Sampai Lunas</span>
                </div>
              </div>

              {/* Right Column: Calculation Summary (Distinct Architectural Panel) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#262722] text-[#F3EFE6] p-6 sm:p-8 rounded-[14px] border border-white/10 space-y-6">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] mb-1 block">
                      Hasil Simulasi Angsuran
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-[#F3EFE6]">
                      Estimasi Cicilan Bulanan
                    </h3>
                  </div>

                  {/* Main Highlighted Number */}
                  <div className="p-5 rounded-[10px] bg-white/[0.05] border border-white/10 text-center space-y-1">
                    <div className="text-xs uppercase tracking-wider text-[#F3EFE6]/60">
                      Angsuran Tenor {tenor} Tahun
                    </div>
                    <div className="text-3xl sm:text-4xl font-serif text-[#C5A568] tracking-tight">
                      {formatRupiah(angsuranBulan)}
                      <span className="text-xs font-normal text-[#F3EFE6]/60"> /bulan</span>
                    </div>
                    <div className="text-xs text-[#F3EFE6]/80 pt-1">
                      Setara dengan sekitar <strong className="text-emerald-400 font-mono">{formatRupiah(angsuranHari)}/hari</strong>
                    </div>
                  </div>

                  {/* Breakdown List */}
                  <div className="divide-y divide-white/10 text-xs text-[#F3EFE6]/80">
                    <div className="flex justify-between py-2">
                      <span>Harga Rumah</span>
                      <span className="font-mono font-semibold text-[#F3EFE6]">{formatRupiah(harga)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Uang Muka (DP)</span>
                      <span className="font-mono font-semibold text-[#F3EFE6]">{formatRupiah(dp)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Pokok Pinjaman Bank</span>
                      <span className="font-mono font-semibold text-[#F3EFE6]">{formatRupiah(sisaPokok)}</span>
                    </div>
                    <div className="flex justify-between py-2">
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
                      className="group w-full py-3 px-4 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99] text-center"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Ajukan Simulasi Ini via WA</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      href="/kontak"
                      className="w-full py-3 px-4 rounded-[12px] border border-white/20 hover:border-[#C5A568] hover:bg-[#C5A568]/10 text-[#F3EFE6] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99] text-center"
                    >
                      <span>Isi Formulir Minat Unit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Perbandingan 3 Tenor: Open List with Dividers */}
                <div className="pt-2 space-y-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#77766F]">
                    Perbandingan Tenor Lainnya (DP {formatRupiah(dp)})
                  </div>
                  <div className="divide-y divide-[#DDD8CE] text-xs">
                    {[10, 15, 20].map((t) => (
                      <div
                        key={t}
                        onClick={() => setTenor(t)}
                        className={`py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                          tenor === t
                            ? 'font-semibold text-[#262722]'
                            : 'text-[#77766F] hover:text-[#262722]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${tenor === t ? 'bg-[#C5A568]' : 'bg-transparent'}`} />
                          <span>Tenor {t} Tahun ({t * 12} bulan)</span>
                        </div>
                        <span className="font-mono">{formatRupiah(hitungAngsuran(t))}/bln</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Syarat Pengajuan KPR Bersubsidi: Open Editorial Layout */}
        <section className="py-16 sm:py-20 bg-white/40 border-t border-b border-[#DDD8CE]">
          <div className="container-editorial space-y-12">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                Persyaratan Resmi FLPP
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                Syarat &amp; Dokumen Pengajuan KPR Bersubsidi
              </h2>
              <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                Kriteria calon pembeli yang berhak mendapatkan fasilitas subsidi FLPP dari pemerintah:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:divide-x md:divide-[#DDD8CE]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#262722]">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A568] shrink-0" />
                  <h3 className="font-serif text-xl">Kriteria Calon Penerima Subsidi</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#77766F] pl-7 list-disc leading-relaxed">
                  <li>Warga Negara Indonesia (WNI) berusia minimal 21 tahun atau telah menikah.</li>
                  <li>Belum pernah memiliki rumah pribadi dibuktikan surat keterangan belum memiliki rumah.</li>
                  <li>Belum pernah menerima subsidi bantuan perumahan dari pemerintah.</li>
                  <li>Penghasilan total keluarga tidak melebihi ambang batas regulasi FLPP (maksimal Rp 8 juta/bulan).</li>
                  <li>Memiliki masa kerja atau kegiatan usaha aktif minimal 1 tahun.</li>
                </ul>
              </div>

              <div className="md:pl-10 space-y-4">
                <div className="flex items-center gap-2 text-[#262722]">
                  <FileCheck2 className="w-5 h-5 text-[#C5A568] shrink-0" />
                  <h3 className="font-serif text-xl">Berkas yang Harus Disiapkan</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#77766F] pl-7 list-disc leading-relaxed">
                  <li>Fotokopi KTP Pemohon &amp; Pasangan (jika menikah).</li>
                  <li>Fotokopi Kartu Keluarga (KK) &amp; Surat Nikah/Cerai.</li>
                  <li>Nomor Pokok Wajib Pajak (NPWP) &amp; Bukti SPT Tahunan PPh 21.</li>
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
