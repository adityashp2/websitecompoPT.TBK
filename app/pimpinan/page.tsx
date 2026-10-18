import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Briefcase,
  Landmark,
  FileCheck2,
  HardHat,
  BadgePercent,
  Compass
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dewan Pengurus & Manajemen Perseroan | PT. Terbang Bersama Kawan',
  description: 'Struktur dewan komisaris, direksi utama, dan jajaran manajemen operasional resmi PT. Terbang Bersama Kawan. Berintegritas membangun kawasan perumahan Puri Gunung Langgar di Lampung.',
};

export default async function PimpinanPage() {
  const content = await getSiteContent();
  const members = content.leadership?.members || [];

  const primaryLeaders = members.filter(
    (m) => m.role.toLowerCase().includes('komisaris') || m.role.toLowerCase().includes('direktur utama')
  );
  const operationalTeam = members.filter(
    (m) => !m.role.toLowerCase().includes('komisaris') && !m.role.toLowerCase().includes('direktur utama')
  );

  const displayPrimary = primaryLeaders.length > 0 ? primaryLeaders : members.slice(0, 2);
  const displayOperational = primaryLeaders.length > 0 ? operationalTeam : members.slice(2);

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
              <span className="text-[#FF9D2E] font-bold">Dewan Pengurus &amp; Manajemen</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-[11px] font-medium tracking-wide">
                <Users className="w-3.5 h-3.5" />
                <span>{content.leadership.badge || 'Struktur Pengurus Resmi'}</span>
              </div>
              <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[46px] tracking-tight text-white leading-[1.15]">
                {content.leadership.title || 'Dewan Pengurus & Manajemen Perseroan'}
              </h1>
              <p className="font-sans text-white/85 text-[15px] sm:text-base leading-relaxed max-w-2xl">
                {content.leadership.subtitle || 'Dikelola oleh pengurus resmi yang tercantum dalam Anggaran Dasar, Akta Pendirian, serta tim manajemen profesional yang berdedikasi membangun kawasan perumahan berkualitas di Lampung.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 1: Dewan Pengawas & Direksi Utama */}
        <section className="py-16 sm:py-24 border-b border-[#DCE7F5] bg-white">
          <div className="container-editorial space-y-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Pimpinan Tertinggi Perseroan</span>
              </div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                Dewan Komisaris &amp; Direksi Utama
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#526783] mt-1.5 leading-relaxed">
                Tercantum secara sah dalam Akta Notaris {content.legal?.aktaNumber || 'No. 10'} tanggal {content.legal?.aktaDate || '18 Maret 2021'} dan disahkan melalui Keputusan Menteri Hukum dan HAM RI Nomor {content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {displayPrimary.map((member, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-stretch transition-all duration-300 hover:border-[#073B78] shadow-sm hover:shadow-md"
                >
                  {/* Pas Foto Proporsional 3:4 (Wajah Utuh Tidak Terpotong) */}
                  <div className="relative w-36 sm:w-44 aspect-[3/4] shrink-0 rounded-xl overflow-hidden shadow-md border border-[#DCE7F5] bg-[#073B78]">
                    {member.image && member.image.trim() !== '' ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-white text-center">
                        <Building2 className="w-8 h-8 text-[#FF9D2E] mb-1" />
                        <span className="text-xl font-bold">TBK</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-[#102D52]/90 backdrop-blur-md text-[#FF9D2E] text-[9.5px] font-bold tracking-wide border border-[#FF9D2E]/40">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Konten Keterangan Eksekutif di Sebelah Kanan */}
                  <div className="flex flex-col flex-1 justify-between space-y-3 text-left w-full">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>SK Kemenkumham RI</span>
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#102D52] font-normal tracking-tight">
                        {member.name}
                      </h3>
                      <span className="text-[11px] tracking-wide text-[#FF9D2E] font-medium block">
                        {member.department || 'Pengurus Inti Perseroan'}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10.5px] font-medium tracking-wide text-[#FF9D2E] mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Amanat &amp; Tanggung Jawab</span>
                      </div>
                      <p className="font-sans text-xs sm:text-[13px] text-[#526783] leading-relaxed line-clamp-3 sm:line-clamp-4">
                        {member.roleDescription}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#DCE7F5] flex items-center justify-between text-[10.5px] text-[#526783]">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#073B78] shrink-0" />
                        <span>Akta Notaris {content.legal?.aktaNumber || 'No. 10'}</span>
                      </div>
                      <span className="font-mono text-[#526783]">{content.legal?.aktaDate || '18 Maret 2021'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Jajaran Manajemen Operasional */}
        {displayOperational.length > 0 && (
          <section className="py-16 sm:py-24 border-b border-[#DCE7F5] bg-[#F4F7FC]">
            <div className="container-editorial space-y-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                  <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                  <span>Struktur Pelaksana &amp; Operasional</span>
                </div>
                <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                  Jajaran Manajemen &amp; Kepala Divisi
                </h2>
                <p className="text-xs sm:text-sm text-[#526783] mt-1.5 leading-relaxed">
                  Tim profesional multidisiplin yang memimpin langsung eksekusi teknis, administrasi KPR subsidi, legalitas lahan, dan pelayanan konsumen perumahan Puri Gunung Langgar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayOperational.map((member, idx) => {
                  const initials = member.name
                    ? member.name.replace(/Ir\.|S\.T\.|S\.Ak\.|S\.I\.Kom\.|S\.H\.|dr\.|M\./g, '')
                        .trim()
                        .split(' ')
                        .filter(Boolean)
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'TB';

                  return (
                    <div
                      key={idx}
                      className="group rounded-2xl bg-white border border-[#DCE7F5] p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#073B78] hover:-translate-y-1 shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <div className="relative w-full aspect-square rounded-xl bg-[#073B78] overflow-hidden flex items-center justify-center">
                          {member.image && member.image.trim() !== '' ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center p-4">
                              <div className="w-14 h-14 rounded-full border border-white/20 bg-white/10 flex items-center justify-center mb-2">
                                <span className="font-bold text-lg text-[#FF9D2E] tracking-wider">
                                  {initials}
                                </span>
                              </div>
                              <span className="text-[10px] uppercase font-mono tracking-wider text-white/70">
                                Divisi Profesional
                              </span>
                            </div>
                          )}

                          {member.department && (
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#102D52]/90 backdrop-blur-md border border-white/15 text-[#FF9D2E] text-[9.5px] font-bold uppercase tracking-wider">
                              {member.department}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-[#FF9D2E] uppercase tracking-wider block mb-1">
                            {member.role}
                          </span>
                          <h4 className="font-sans font-bold text-[16px] text-[#102D52] leading-snug">
                            {member.name}
                          </h4>
                        </div>

                        <p className="text-xs text-[#526783] leading-relaxed">
                          {member.roleDescription}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#DCE7F5] flex items-center justify-between text-[11px] text-[#526783]">
                        <span className="font-semibold text-[#102D52]">PT. TBK Lampung</span>
                        <span className="text-[#15966A] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: Bagan Struktur Organisasi Perseroan */}
        <section className="py-16 sm:py-24 border-b border-[#DCE7F5] bg-white">
          <div className="container-editorial space-y-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-semibold text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Tata kelola &amp; rantai komando</span>
              </div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                Bagan Struktur Organisasi Perseroan
              </h2>
              <p className="text-xs sm:text-sm text-[#526783] mt-1.5 leading-relaxed">
                Struktur hierarki pembagian wewenang yang menjamin akuntabilitas, pengawasan independen, dan kelancaran rantai operasional pembangunan.
              </p>
            </div>

            {/* Architecture Hierarchy Diagram */}
            <div className="p-6 sm:p-10 rounded-2xl bg-[#F4F7FC] border border-[#DCE7F5] shadow-sm space-y-8">
              {/* Level 1: RUPS */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md p-5 rounded-xl bg-gradient-to-r from-[#073B78] to-[#102D52] text-white text-center border border-white/10 shadow-md">
                  <span className="text-[11px] font-medium tracking-wider text-[#FF9D2E] block mb-0.5">Tingkat 1 &bull; Pemegang Saham</span>
                  <h4 className="font-serif font-normal text-lg sm:text-xl text-white">Rapat Umum Pemegang Saham (RUPS)</h4>
                  <p className="text-xs text-white/80 mt-1">Pemegang kekuasaan tertinggi dalam penetapan arah strategis perseroan</p>
                </div>

                <div className="w-[2px] h-8 bg-[#DCE7F5]" />
              </div>

              {/* Level 2: Dewan Komisaris & Direksi Utama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto relative">
                {/* Dewan Komisaris */}
                <div className="p-6 rounded-2xl border border-[#DCE7F5] bg-white shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#073B78] text-white text-[11px] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF9D2E]" />
                      <span>Fungsi Pengawasan</span>
                    </div>
                    <h5 className="font-serif font-normal text-xl text-[#102D52]">Dewan Komisaris</h5>
                    {displayPrimary[0] && (
                      <p className="text-xs text-[#073B78] font-semibold">
                        {displayPrimary[0].name} ({displayPrimary[0].role})
                      </p>
                    )}
                    <p className="text-xs text-[#526783] leading-relaxed">
                      {displayPrimary[0]?.roleDescription || 'Mengawasi kebijakan direksi dalam menjalankan perseroan serta memberikan nasihat pengelolaan risiko investasi.'}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#526783] mt-3 pt-2 border-t border-[#DCE7F5]">Independensi &amp; Kepatuhan</span>
                </div>

                {/* Direktur Utama */}
                <div className="p-6 rounded-2xl border-2 border-[#FF9D2E]/60 bg-white shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF9D2E] text-[#102D52] text-[11px] font-semibold">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Fungsi Eksekutif</span>
                    </div>
                    <h5 className="font-serif font-normal text-xl text-[#102D52]">Direksi Utama</h5>
                    {displayPrimary[1] && (
                      <p className="text-xs text-[#102D52] font-semibold">
                        {displayPrimary[1].name} ({displayPrimary[1].role})
                      </p>
                    )}
                    <p className="text-xs text-[#526783] leading-relaxed">
                      {displayPrimary[1]?.roleDescription || 'Memimpin pengurusan perseroan, mewakili perusahaan secara hukum, dan mengkoordinasikan seluruh divisi pelaksana.'}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#526783] mt-3 pt-2 border-t border-[#DCE7F5]">Akta Notaris {content.legal?.aktaNumber || 'No. 10'}</span>
                </div>
              </div>

              {/* Connecting line to Level 3 */}
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-8 bg-[#DCE7F5]" />
              </div>

              {/* Level 3: Pilar Divisi Operasional Proyek */}
              <div>
                <div className="text-center mb-6">
                  <span className="text-xs font-semibold text-[#526783] tracking-wide">
                    Divisi Pelaksana Proyek Puri Gunung Langgar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayOperational.length > 0 ? (
                    displayOperational.map((member, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-[#DCE7F5] bg-white space-y-2 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-[#073B78] text-[#FF9D2E] flex items-center justify-center">
                          {idx === 0 ? <HardHat className="w-4 h-4" /> : idx === 1 ? <BadgePercent className="w-4 h-4" /> : idx === 2 ? <Compass className="w-4 h-4" /> : <FileCheck2 className="w-4 h-4" />}
                        </div>
                        <h6 className="font-semibold text-xs text-[#102D52]">{member.role}</h6>
                        <p className="text-[11px] font-semibold text-[#073B78]">{member.name}</p>
                        <p className="text-[11.5px] text-[#526783] leading-relaxed line-clamp-3">
                          {member.roleDescription}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-xs text-[#526783]">
                      Belum ada jajaran operasional tambahan yang terdaftar.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Prinsip Good Corporate Governance */}
        <section className="py-16 sm:py-24 border-b border-[#DCE7F5] bg-[#F4F7FC]">
          <div className="container-editorial space-y-10">
            <div>
              <div className="flex items-center gap-2 text-[#FF9D2E] font-semibold text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Tata kelola perusahaan</span>
              </div>
              <h3 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                Prinsip Good Corporate Governance
              </h3>
              <p className="text-xs sm:text-sm text-[#526783] mt-1.5 leading-relaxed">
                Komitmen segenap dewan komisaris, direksi, dan jajaran manajemen dalam menjaga integritas, kepatuhan regulasi, dan akuntabilitas perseroan:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 rounded-2xl bg-white border border-[#DCE7F5] shadow-sm space-y-3">
                <span className="font-serif text-3xl text-[#073B78] block">01</span>
                <h4 className="font-semibold text-lg text-[#102D52]">Transparansi Finansial</h4>
                <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                  Pembukuan berkala yang rapi dan seluruh penerimaan pembayaran melalui rekening giro perseroan resmi tanpa perantara tidak resmi.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#DCE7F5] shadow-sm space-y-3">
                <span className="font-serif text-3xl text-[#073B78] block">02</span>
                <h4 className="font-semibold text-lg text-[#102D52]">Pengawasan Mutu Konstruksi</h4>
                <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                  Setiap tahap pekerjaan fisik di lapangan diawasi langsung agar spesifikasi teknis presisi dengan standar kelayakan perumahan nasional.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#DCE7F5] shadow-sm space-y-3">
                <span className="font-serif text-3xl text-[#073B78] block">03</span>
                <h4 className="font-semibold text-lg text-[#102D52]">Akuntabilitas Konsumen</h4>
                <p className="text-xs sm:text-sm text-[#526783] leading-relaxed">
                  Layanan konsultasi transparan, kepastian pemecahan sertifikat SHM, serta masa pemeliharaan unit pasca serah terima kunci.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Bottom CTA */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-4xl text-white max-w-xl mx-auto leading-tight">
              Konsultasikan Rencana Kepemilikan Rumah Anda
            </h2>
            <p className="text-white/85 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Manajemen dan staf PT. Terbang Bersama Kawan siap mendampingi proses KPR Anda hingga tuntas dan serah terima kunci.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-sm font-semibold transition-all duration-200 hover:-translate-y-[1px] shadow-lg"
              >
                <span>Hubungi manajemen &amp; pemasaran</span>
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
