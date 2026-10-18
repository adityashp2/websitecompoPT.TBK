'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/SiteHeader';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { initialSiteContent, SiteContent } from '@/lib/initialData';
import { 
  Calculator, 
  FileCheck2, 
  CheckCircle2, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight
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

  const kprConfig = content.kprSimulation;
  const [harga, setHarga] = useState<number>(kprConfig?.defaultPrice || 166000000);
  const [dp, setDp] = useState<number>(kprConfig?.defaultDp || 2000000);
  const [tenor, setTenor] = useState<number>(kprConfig?.defaultTenor || 20);

  useEffect(() => {
    if (content.kprSimulation) {
      if (content.kprSimulation.defaultPrice) setHarga(content.kprSimulation.defaultPrice);
      if (content.kprSimulation.defaultDp) setDp(content.kprSimulation.defaultDp);
      if (content.kprSimulation.defaultTenor) setTenor(content.kprSimulation.defaultTenor);
    }
  }, [content.kprSimulation]);

  const sisaPokok = Math.max(0, harga - dp);
  const rateTahunan = content.kprSimulation?.annualInterestRate || 0.05;
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
              <span className="text-[#FF9D2E] font-medium">Simulasi KPR FLPP</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-xs font-medium">
                <Calculator className="w-3.5 h-3.5" />
                <span>{content.kprSimulation?.badge || 'Kalkulator resmi KPR FLPP'}</span>
              </div>
              <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {content.kprSimulation?.title || 'Simulasi Angsuran Rumah Subsidi'}
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.kprSimulation?.subtitle || 'Hitung estimasi angsuran bulanan rumah bersubsidi Puri Gunung Langgar dengan suku bunga tetap 5% flat per tahun sesuai skema Fasilitas Likuiditas Pembiayaan Perumahan (FLPP).'}
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Interactive Inputs */}
              <div className="lg:col-span-7 bg-[#F4F7FC] p-4 sm:p-7 lg:p-9 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-6 sm:space-y-8">
                <div>
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-semibold text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Perhitungan angsuran</span>
                  </div>
                  <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                    Parameter Simulasi KPR
                  </h2>
                  <p className="text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                    Sesuaikan nilai uang muka dan pilihan jangka waktu pinjaman:
                  </p>
                </div>

                {/* Input Harga Rumah */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#102D52]">
                      Harga unit rumah
                    </label>
                    <span className="text-xs text-[#073B78] font-medium bg-[#E8F1FC] px-2.5 py-0.5 rounded-full">
                      Standar FLPP Lampung
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={formatRupiah(harga)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCE7F5] font-mono font-bold text-[#102D52] text-sm sm:text-base cursor-not-allowed shadow-inner"
                  />
                  <span className="text-[11.5px] text-[#526783] block">
                    Berdasarkan Kepmen PUPR untuk zona Lampung dan sekitarnya.
                  </span>
                </div>

                {/* Input Uang Muka (DP) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#102D52]">
                      Uang muka (DP): <span className="text-[#FF9D2E] font-mono font-bold">{formatRupiah(dp)}</span>
                    </label>
                    <span className="text-xs text-[#526783] font-mono font-medium">
                      {((dp / harga) * 100).toFixed(1)}% dari harga
                    </span>
                  </div>

                  <input
                    type="range"
                    min={content.kprSimulation?.minDp || 1000000}
                    max={content.kprSimulation?.maxDp || 30000000}
                    step={500000}
                    value={dp}
                    onChange={(e) => setDp(Number(e.target.value))}
                    className="w-full accent-[#FF9D2E] cursor-pointer h-2 bg-[#DCE7F5] rounded-full"
                  />

                  {/* Quick DP Preset Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[2000000, 5000000, 10000000, 15000000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDp(val)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          dp === val
                            ? 'bg-[#073B78] text-white border-[#073B78] shadow-sm'
                            : 'bg-white hover:bg-white text-[#102D52] border-[#DCE7F5]'
                        }`}
                      >
                        {formatRupiah(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenor Pinjaman */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#102D52] block">
                    Jangka waktu pinjaman (tenor)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 15, 20].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenor(t)}
                        className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center ${
                          tenor === t
                            ? 'bg-[#073B78] text-white border-[#073B78] shadow-md'
                            : 'bg-white hover:bg-[#E8F1FC] text-[#102D52] border-[#DCE7F5]'
                        }`}
                      >
                        <div>{t} Tahun</div>
                        <div className="text-[11px] font-normal opacity-75">{t * 12} Bulan</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suku Bunga Notice */}
                <div className="py-3 px-4 rounded-xl border border-[#DCE7F5] bg-white flex items-center justify-between text-xs text-[#102D52]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#15966A] shrink-0" />
                    <span className="font-medium">Suku bunga KPR subsidi FLPP</span>
                  </div>
                  <span className="font-mono font-bold text-[#15966A]">{(rateTahunan * 100).toFixed(1)}% Tetap Sampai Lunas</span>
                </div>
              </div>

              {/* Right Column: Calculation Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-gradient-to-br from-[#073B78] to-[#102D52] text-white p-4 sm:p-7 lg:p-8 rounded-2xl shadow-xl space-y-6">
                  <div>
                    <span className="text-xs font-medium text-[#FF9D2E] mb-1 block">
                      Hasil simulasi angsuran
                    </span>
                    <h3 className="font-serif font-normal text-2xl text-white">
                      Estimasi Cicilan Bulanan
                    </h3>
                  </div>

                  {/* Main Highlighted Number */}
                  <div className="p-5 rounded-xl bg-white/10 border border-white/15 text-center space-y-1">
                    <div className="text-xs text-white/80 font-medium">
                      Angsuran Tenor {tenor} Tahun (FLPP {(rateTahunan * 100).toFixed(0)}% Tetap)
                    </div>
                    <div className="text-3xl sm:text-4xl font-mono font-bold text-[#FF9D2E] tracking-tight">
                      {formatRupiah(angsuranBulan)}
                      <span className="text-xs font-normal text-white/70 font-sans"> /bulan</span>
                    </div>
                    <div className="text-xs text-white/90 pt-1">
                      Setara dengan sekitar <strong className="text-white font-mono bg-white/20 px-2 py-0.5 rounded">{formatRupiah(angsuranHari)}/hari</strong>
                    </div>
                  </div>

                  {/* Breakdown List */}
                  <div className="divide-y divide-white/10 text-xs sm:text-[13px] text-white/85">
                    <div className="flex justify-between py-2.5">
                      <span>Harga Rumah</span>
                      <span className="font-mono font-bold text-white">{formatRupiah(harga)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span>Uang Muka (DP)</span>
                      <span className="font-mono font-bold text-[#FF9D2E]">{formatRupiah(dp)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span>Pokok Pinjaman Bank</span>
                      <span className="font-mono font-bold text-white">{formatRupiah(sisaPokok)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span>Suku Bunga FLPP</span>
                      <span className="font-mono font-bold text-[#15966A]">{(rateTahunan * 100).toFixed(0)}% Tetap Sampai Lunas</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-full py-3.5 px-4 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.99] text-center shadow-lg"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Ajukan simulasi ini via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      href="/kontak"
                      className="w-full py-3 px-4 rounded-full border border-white/40 hover:border-white hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 text-center"
                    >
                      <span>Isi formulir minat unit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <p className="text-[11px] text-white/70 italic leading-relaxed pt-2 text-center">
                      *Perhitungan di atas adalah estimasi simulasi mengacu pada skema subsidi FLPP pemerintah dengan suku bunga anuitas 5% tetap sampai lunas.
                    </p>
                  </div>
                </div>

                {/* Perbandingan 3 Tenor */}
                <div className="p-5 rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] space-y-3">
                  <div className="text-xs font-semibold text-[#526783]">
                    Perbandingan tenor lainnya (DP {formatRupiah(dp)})
                  </div>
                  <div className="divide-y divide-[#DCE7F5] text-xs">
                    {[10, 15, 20].map((t) => (
                      <div
                        key={t}
                        onClick={() => setTenor(t)}
                        className={`py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                          tenor === t
                            ? 'font-bold text-[#073B78]'
                            : 'text-[#526783] hover:text-[#102D52]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${tenor === t ? 'bg-[#FF9D2E]' : 'bg-transparent'}`} />
                          <span>Tenor {t} Tahun ({t * 12} bulan)</span>
                        </div>
                        <span className="font-mono font-bold">{formatRupiah(hitungAngsuran(t))}/bln</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Syarat Pengajuan KPR Bersubsidi */}
        <section className="py-16 sm:py-24 bg-[#F4F7FC] border-t border-b border-[#DCE7F5]">
          <div className="container-editorial space-y-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-semibold text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Persyaratan resmi FLPP</span>
              </div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                Syarat &amp; Dokumen Pengajuan KPR Bersubsidi
              </h2>
              <p className="text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                Kriteria calon pembeli yang berhak mendapatkan fasilitas subsidi FLPP dari pemerintah:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#073B78]">
                  <CheckCircle2 className="w-6 h-6 text-[#15966A] shrink-0" />
                  <h3 className="font-semibold text-lg text-[#102D52]">Kriteria Calon Penerima Subsidi</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#526783] pl-6 list-disc leading-relaxed">
                  <li>Warga Negara Indonesia (WNI) berusia minimal 21 tahun atau telah menikah.</li>
                  <li>Belum pernah memiliki rumah pribadi dibuktikan surat keterangan belum memiliki rumah.</li>
                  <li>Belum pernah menerima subsidi bantuan perumahan dari pemerintah.</li>
                  <li>Penghasilan total keluarga tidak melebihi ambang batas regulasi FLPP (maksimal Rp 8 juta/bulan).</li>
                  <li>Memiliki masa kerja atau kegiatan usaha aktif minimal 1 tahun.</li>
                </ul>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#073B78]">
                  <FileCheck2 className="w-6 h-6 text-[#073B78] shrink-0" />
                  <h3 className="font-semibold text-lg text-[#102D52]">Berkas yang Harus Disiapkan</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#526783] pl-6 list-disc leading-relaxed">
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
