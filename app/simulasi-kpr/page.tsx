'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Navbar';
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
    fetch('/api/content', { cache: 'no-store' })
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

  const rawWa = content.contact?.whatsapp?.trim() || '';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const hasWa = cleanPhone.length >= 7;
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;

  const waSimulasiMessage = `Halo PT. TBK, saya ingin konsultasi pengajuan KPR Puri Gunung Langgar dengan rincian simulasi:\n- Harga Rumah: ${formatRupiah(harga)}\n- Uang Muka (DP): ${formatRupiah(dp)}\n- Pokok Pinjaman: ${formatRupiah(sisaPokok)}\n- Jangka Waktu (Tenor): ${tenor} Tahun\n- Estimasi Angsuran: ${formatRupiah(angsuranBulan)} / bulan\n\nMohon informasi persyaratan berkas dan survei unit contoh.`;
  const waUrl = hasWa ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(waSimulasiMessage)}` : '';

  return (
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#000000] text-white pt-20 pb-24 px-6 border-b border-[#262626] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-[#999999] mb-8">
              <Link href="/" className="hover:text-white transition-colors">BERANDA</Link>
              <span>/</span>
              <span className="text-white">SIMULASI KPR FLPP</span>
            </nav>

            <div className="max-w-4xl space-y-5">
              <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[#262626] text-white inline-block">
                {content.kprSimulation?.badge || 'KALKULATOR RESMI KPR FLPP'}
              </span>
              <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[70px] uppercase tracking-[3px] text-white leading-[1.08]">
                {content.kprSimulation?.title || 'Simulasi Angsuran Rumah Subsidi'}
              </h1>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl pt-2">
                {content.kprSimulation?.subtitle || 'Hitung estimasi angsuran bulanan rumah bersubsidi Puri Gunung Langgar dengan suku bunga tetap 5% flat per tahun sesuai skema Fasilitas Likuiditas Pembiayaan Perumahan (FLPP).'}
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Section */}
        <section className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Interactive Inputs */}
              <div className="lg:col-span-7 card-bugatti p-8 sm:p-10 space-y-8">
                <div>
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                    PARAMETER SIMULASI
                  </span>
                  <h2 className="font-display font-normal text-2xl sm:text-4xl uppercase tracking-[2px] text-white">
                    Perhitungan Angsuran KPR
                  </h2>
                  <p className="font-serif text-sm text-[#999999] mt-2 leading-relaxed">
                    Sesuaikan nilai uang muka dan pilihan jangka waktu pinjaman:
                  </p>
                </div>

                {/* Harga Rumah */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs tracking-[1.5px] uppercase text-[#999999]">
                    <label>HARGA UNIT RUMAH</label>
                    <span className="text-white">STANDAR FLPP LAMPUNG</span>
                  </div>
                  <div className="w-full py-3 px-4 bg-[#0d0d0d] border border-[#262626] font-mono text-sm text-white">
                    {formatRupiah(harga)}
                  </div>
                  <span className="font-mono text-[11px] tracking-[1px] uppercase text-[#666666] block">
                    Berdasarkan Kepmen PUPR untuk zona Lampung dan sekitarnya.
                  </span>
                </div>

                {/* Uang Muka DP */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs tracking-[1.5px] uppercase text-[#999999]">
                    <label>UANG MUKA (DP): <span className="text-white">{formatRupiah(dp)}</span></label>
                    <span>{((dp / harga) * 100).toFixed(1)}% DARI HARGA</span>
                  </div>

                  <input
                    type="range"
                    min={content.kprSimulation?.minDp || 1000000}
                    max={content.kprSimulation?.maxDp || 30000000}
                    step={500000}
                    value={dp}
                    onChange={(e) => setDp(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-1.5 bg-[#262626] rounded-none"
                  />

                  {/* Quick DP Preset Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[2000000, 5000000, 10000000, 15000000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDp(val)}
                        className={`px-4 py-2 font-mono text-[11px] tracking-[1.5px] uppercase transition-all border ${
                          dp === val
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-[#999999] border-[#262626] hover:border-white hover:text-white'
                        }`}
                      >
                        {formatRupiah(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenor */}
                <div className="space-y-3">
                  <label className="font-mono text-xs tracking-[1.5px] uppercase text-[#999999] block">
                    JANGKA WAKTU PINJAMAN (TENOR)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[10, 15, 20].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenor(t)}
                        className={`py-3 px-4 font-mono text-xs tracking-[2px] uppercase border transition-all text-center ${
                          tenor === t
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-[#999999] border-[#262626] hover:border-white hover:text-white'
                        }`}
                      >
                        <div>{t} TAHUN</div>
                        <div className="text-[10px] tracking-[1px] opacity-75">{t * 12} BULAN</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bunga */}
                <div className="py-3 px-4 border border-[#262626] bg-[#0d0d0d] flex items-center justify-between font-mono text-xs tracking-[1.5px] uppercase text-white">
                  <span>SUKU BUNGA SUBSIDI FLPP</span>
                  <span className="text-[#c3d9f3]">{(rateTahunan * 100).toFixed(1)}% TETAP SAMPAI LUNAS</span>
                </div>
              </div>

              {/* Right Column: Calculation Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="card-bugatti p-8 sm:p-10 space-y-6">
                  <div>
                    <span className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999] block mb-1">
                      HASIL KALKULASI RESMI
                    </span>
                    <h3 className="font-display font-normal text-2xl uppercase tracking-[2px] text-white">
                      Estimasi Cicilan Bulanan
                    </h3>
                  </div>

                  {/* Main Highlighted Number */}
                  <div className="p-6 bg-[#000000] border border-[#262626] text-center space-y-2">
                    <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999]">
                      TENOR {tenor} TAHUN (FLPP {(rateTahunan * 100).toFixed(0)}% TETAP)
                    </div>
                    <div className="font-display font-normal text-3xl sm:text-4xl text-white tracking-[2px]">
                      {formatRupiah(angsuranBulan)}
                      <span className="text-xs font-mono text-[#999999] tracking-[1.5px] uppercase"> /BULAN</span>
                    </div>
                    <div className="font-mono text-xs tracking-[1.5px] uppercase text-[#999999] pt-1">
                      SEKITAR {formatRupiah(angsuranHari)}/HARI
                    </div>
                  </div>

                  {/* Breakdown List */}
                  <div className="divide-y divide-[#262626] font-mono text-xs tracking-[1.5px] uppercase">
                    <div className="flex justify-between py-2.5">
                      <span className="text-[#999999]">HARGA RUMAH</span>
                      <span className="text-white">{formatRupiah(harga)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-[#999999]">UANG MUKA (DP)</span>
                      <span className="text-white">{formatRupiah(dp)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-[#999999]">POKOK PINJAMAN</span>
                      <span className="text-white">{formatRupiah(sisaPokok)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-[#999999]">BUNGA FLPP</span>
                      <span className="text-[#c3d9f3]">{(rateTahunan * 100).toFixed(0)}% TETAP</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {hasWa && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-bugatti-primary justify-center"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>KONSULTASI HASIL SIMULASI INI</span>
                      </a>
                    )}

                    <Link
                      href="/kontak"
                      className="w-full btn-bugatti-primary justify-center border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                    >
                      <span>ISI FORMULIR PEMINATAN</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Perbandingan Tenor */}
                <div className="card-bugatti p-6 space-y-4">
                  <div className="font-mono text-xs tracking-[2px] uppercase text-[#999999]">
                    PERBANDINGAN TENOR LAINNYA (DP {formatRupiah(dp)})
                  </div>
                  <div className="divide-y divide-[#262626] font-mono text-xs tracking-[1.5px] uppercase">
                    {[10, 15, 20].map((t) => (
                      <div
                        key={t}
                        onClick={() => setTenor(t)}
                        className={`py-3 flex items-center justify-between cursor-pointer transition-colors ${
                          tenor === t
                            ? 'text-white'
                            : 'text-[#666666] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 ${tenor === t ? 'bg-white' : 'bg-transparent'}`} />
                          <span>TENOR {t} TAHUN ({t * 12} BULAN)</span>
                        </div>
                        <span>{formatRupiah(hitungAngsuran(t))}/BLN</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Syarat Pengajuan KPR Bersubsidi */}
        <section className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl">
              <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                PERSYARATAN RESMI FLPP
              </span>
              <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                Syarat &amp; Dokumen KPR Subsidi
              </h2>
              <p className="font-serif text-base text-[#999999] mt-2 leading-relaxed">
                Kriteria calon pembeli yang berhak mendapatkan fasilitas subsidi FLPP dari pemerintah:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-bugatti p-8 space-y-4">
                <h3 className="font-display font-normal text-xl uppercase tracking-[1.5px] text-white">
                  Kriteria Calon Penerima Subsidi
                </h3>
                <ul className="space-y-3 font-serif text-sm text-[#cccccc] pl-5 list-disc leading-relaxed">
                  <li>Warga Negara Indonesia (WNI) berusia minimal 21 tahun atau telah menikah.</li>
                  <li>Belum pernah memiliki rumah pribadi dibuktikan surat keterangan belum memiliki rumah.</li>
                  <li>Belum pernah menerima subsidi bantuan perumahan dari pemerintah.</li>
                  <li>Penghasilan total keluarga tidak melebihi ambang batas regulasi FLPP (maksimal Rp 8 juta/bulan).</li>
                  <li>Memiliki masa kerja atau kegiatan usaha aktif minimal 1 tahun.</li>
                </ul>
              </div>

              <div className="card-bugatti p-8 space-y-4">
                <h3 className="font-display font-normal text-xl uppercase tracking-[1.5px] text-white">
                  Berkas yang Harus Disiapkan
                </h3>
                <ul className="space-y-3 font-serif text-sm text-[#cccccc] pl-5 list-disc leading-relaxed">
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
