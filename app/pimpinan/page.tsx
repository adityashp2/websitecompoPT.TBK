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
  keywords: [
    'Komisaris PT Terbang Bersama Kawan',
    'Direktur Utama PT TBK',
    'Riski Apriadi PT TBK',
    'Heri Ilhamsyah PT TBK',
    'Manajemen PT Terbang Bersama Kawan'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id/pimpinan',
  },
  openGraph: {
    title: 'Dewan Pengurus & Manajemen Perseroan | PT. Terbang Bersama Kawan',
    description: 'Profil pimpinan dan dewan pengurus pengembang perumahan PT. Terbang Bersama Kawan.',
    url: 'https://terbangbersamakawan.co.id/pimpinan',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
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
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#000000] text-white pt-16 sm:pt-20 pb-16 px-4 border-b border-[#262626] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#999999] uppercase mb-8">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-white">Dewan Pengurus &amp; Manajemen</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#262626] text-white font-mono text-[10px] tracking-[0.2em] uppercase">
                <Users className="w-3.5 h-3.5 text-white" />
                <span>{content.leadership.badge || 'Struktur Pengurus Resmi'}</span>
              </div>
              <h1 className="font-display font-normal uppercase text-3xl sm:text-5xl lg:text-6xl tracking-[0.06em] text-white leading-tight">
                {content.leadership.title || 'Dewan Pengurus & Manajemen Perseroan'}
              </h1>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl">
                {content.leadership.subtitle || 'Dikelola oleh pengurus resmi yang tercantum dalam Anggaran Dasar, Akta Pendirian, serta tim manajemen profesional yang berdedikasi membangun kawasan perumahan berkualitas di Lampung.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 1: Dewan Pengawas & Direksi Utama */}
        <section className="py-20 sm:py-28 border-b border-[#262626] bg-[#000000]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999999]">
                Pimpinan Tertinggi Perseroan
              </p>
              <h2 className="font-display font-normal uppercase text-2xl sm:text-4xl text-white tracking-[0.06em]">
                Dewan Komisaris &amp; Direksi Utama
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                Tercantum secara sah dalam Akta Notaris {content.legal?.aktaNumber || 'No. 10'} tanggal {content.legal?.aktaDate || '18 Maret 2021'} dan disahkan melalui Keputusan Menteri Hukum dan HAM RI Nomor {content.legal?.skMenkumham || 'AHU-0016462.AH.01.01.TAHUN 2021'}.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
              {displayPrimary.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-[#262626] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-stretch transition-colors duration-300 hover:border-[#3a3a3a]"
                >
                  {/* Pas Foto Proporsional 3:4 */}
                  <div className="relative w-40 sm:w-48 aspect-[3/4] shrink-0 overflow-hidden border border-[#262626] bg-[#0d0d0d]">
                    {member.image && member.image.trim() !== '' ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        style={{
                          objectFit: member.imageFit || 'cover',
                          objectPosition: `${member.imageOffsetX !== undefined ? member.imageOffsetX : 50}% ${member.imageOffsetY !== undefined ? member.imageOffsetY : 12}%`,
                          transform: `scale(${(member.imageZoom !== undefined ? member.imageZoom : 100) / 100})`,
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-white text-center">
                        <Building2 className="w-8 h-8 text-[#999999] mb-2" />
                        <span className="font-display uppercase tracking-[0.2em] text-lg">TBK</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-[#3a3a3a] text-white font-mono text-[9px] uppercase tracking-[0.2em]">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Konten Keterangan Eksekutif */}
                  <div className="flex flex-col flex-1 justify-between space-y-4 text-left w-full">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#c3d9f3]" />
                          <span>SK Kemenkumham RI</span>
                        </span>
                      </div>
                      <h3 className="font-display uppercase tracking-[0.04em] text-xl sm:text-2xl text-white font-normal">
                        {member.name}
                      </h3>
                      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#999999] block mt-1">
                        {member.department || 'Pengurus Inti Perseroan'}
                      </span>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#999999] mb-1.5 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Amanat &amp; Tanggung Jawab</span>
                      </div>
                      <p className="font-serif text-sm text-[#cccccc] leading-relaxed line-clamp-4">
                        {member.roleDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#262626] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[#999999]">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>Akta Notaris {content.legal?.aktaNumber || 'No. 10'}</span>
                      </div>
                      <span className="text-[#cccccc]">{content.legal?.aktaDate || '18 Maret 2021'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Jajaran Manajemen Operasional */}
        {displayOperational.length > 0 && (
          <section className="py-20 sm:py-28 border-b border-[#262626] bg-[#0d0d0d]">
            <div className="container-editorial space-y-16">
              <div className="max-w-2xl space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999999]">
                  Struktur Pelaksana &amp; Operasional
                </p>
                <h2 className="font-display font-normal uppercase text-2xl sm:text-4xl text-white tracking-[0.06em]">
                  Jajaran Manajemen &amp; Kepala Divisi
                </h2>
                <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
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
                      className="bg-[#141414] border border-[#262626] p-6 flex flex-col justify-between transition-colors duration-200 hover:border-[#3a3a3a]"
                    >
                      <div className="space-y-4">
                        <div className="relative w-full aspect-square bg-[#000000] border border-[#262626] overflow-hidden flex items-center justify-center">
                          {member.image && member.image.trim() !== '' ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              style={{
                                objectFit: member.imageFit || 'cover',
                                objectPosition: `${member.imageOffsetX !== undefined ? member.imageOffsetX : 50}% ${member.imageOffsetY !== undefined ? member.imageOffsetY : 15}%`,
                                transform: `scale(${(member.imageZoom !== undefined ? member.imageZoom : 100) / 100})`,
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center p-4">
                              <div className="w-14 h-14 border border-[#3a3a3a] bg-[#141414] flex items-center justify-center mb-2">
                                <span className="font-display text-lg text-white tracking-widest">
                                  {initials}
                                </span>
                              </div>
                              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#999999]">
                                Divisi Profesional
                              </span>
                            </div>
                          )}

                          {member.department && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-[#3a3a3a] text-white font-mono text-[9px] uppercase tracking-[0.2em]">
                              {member.department}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="font-mono text-[10px] text-[#999999] uppercase tracking-[0.2em] block mb-1">
                            {member.role}
                          </span>
                          <h4 className="font-display uppercase text-lg text-white tracking-[0.04em] leading-snug">
                            {member.name}
                          </h4>
                        </div>

                        <p className="font-serif text-sm text-[#999999] leading-relaxed">
                          {member.roleDescription}
                        </p>
                      </div>

                      <div className="pt-4 mt-6 border-t border-[#262626] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[#999999]">
                        <span className="text-[#cccccc]">PT. TBK Lampung</span>
                        <span className="text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c3d9f3]" /> Aktif
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
        <section className="py-20 sm:py-28 border-b border-[#262626] bg-[#000000]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999999]">
                Tata kelola &amp; rantai komando
              </p>
              <h2 className="font-display font-normal uppercase text-2xl sm:text-4xl text-white tracking-[0.06em]">
                Bagan Struktur Organisasi Perseroan
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                Struktur hierarki pembagian wewenang yang menjamin akuntabilitas, pengawasan independen, dan kelancaran rantai operasional pembangunan.
              </p>
            </div>

            {/* Architecture Hierarchy Diagram */}
            <div className="p-8 sm:p-12 bg-[#0d0d0d] border border-[#262626] space-y-10">
              {/* Level 1: RUPS */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md p-6 bg-[#141414] text-white text-center border border-[#3a3a3a]">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#999999] block mb-1">
                    Tingkat 1 &bull; Pemegang Saham
                  </span>
                  <h4 className="font-display uppercase tracking-[0.06em] text-lg sm:text-xl text-white">
                    Rapat Umum Pemegang Saham (RUPS)
                  </h4>
                  <p className="font-serif text-xs text-[#999999] mt-2">
                    Pemegang kekuasaan tertinggi dalam penetapan arah strategis perseroan
                  </p>
                </div>

                <div className="w-[1px] h-10 bg-[#262626]" />
              </div>

              {/* Level 2: Dewan Komisaris & Direksi Utama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto relative">
                {/* Dewan Komisaris */}
                <div className="p-6 bg-[#141414] border border-[#262626] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#000000] border border-[#262626] text-white font-mono text-[10px] uppercase tracking-[0.2em]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c3d9f3]" />
                      <span>Fungsi Pengawasan</span>
                    </div>
                    <h5 className="font-display uppercase tracking-[0.04em] text-xl text-white">Dewan Komisaris</h5>
                    {displayPrimary[0] && (
                      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#cccccc]">
                        {displayPrimary[0].name} ({displayPrimary[0].role})
                      </p>
                    )}
                    <p className="font-serif text-sm text-[#999999] leading-relaxed">
                      {displayPrimary[0]?.roleDescription || 'Mengawasi kebijakan direksi dalam menjalankan perseroan serta memberikan nasihat pengelolaan risiko investasi.'}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] mt-4 pt-3 border-t border-[#262626]">
                    Independensi &amp; Kepatuhan
                  </span>
                </div>

                {/* Direktur Utama */}
                <div className="p-6 bg-[#141414] border border-[#3a3a3a] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#000000] border border-[#3a3a3a] text-white font-mono text-[10px] uppercase tracking-[0.2em]">
                      <Landmark className="w-3.5 h-3.5 text-white" />
                      <span>Fungsi Eksekutif</span>
                    </div>
                    <h5 className="font-display uppercase tracking-[0.04em] text-xl text-white">Direksi Utama</h5>
                    {displayPrimary[1] && (
                      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                        {displayPrimary[1].name} ({displayPrimary[1].role})
                      </p>
                    )}
                    <p className="font-serif text-sm text-[#999999] leading-relaxed">
                      {displayPrimary[1]?.roleDescription || 'Memimpin pengurusan perseroan, mewakili perusahaan secara hukum, dan mengkoordinasikan seluruh divisi pelaksana.'}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] mt-4 pt-3 border-t border-[#262626]">
                    Akta Notaris {content.legal?.aktaNumber || 'No. 10'}
                  </span>
                </div>
              </div>

              {/* Connecting line to Level 3 */}
              <div className="flex flex-col items-center">
                <div className="w-[1px] h-10 bg-[#262626]" />
              </div>

              {/* Level 3: Pilar Divisi Operasional Proyek */}
              <div>
                <div className="text-center mb-8">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999999]">
                    Divisi Pelaksana Proyek Puri Gunung Langgar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayOperational.length > 0 ? (
                    displayOperational.map((member, idx) => (
                      <div key={idx} className="p-5 bg-[#141414] border border-[#262626] space-y-3">
                        <div className="w-8 h-8 bg-[#000000] border border-[#262626] text-white flex items-center justify-center">
                          {idx === 0 ? <HardHat className="w-4 h-4" /> : idx === 1 ? <BadgePercent className="w-4 h-4" /> : idx === 2 ? <Compass className="w-4 h-4" /> : <FileCheck2 className="w-4 h-4" />}
                        </div>
                        <h6 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#999999]">{member.role}</h6>
                        <p className="font-display uppercase text-sm text-white tracking-[0.04em]">{member.name}</p>
                        <p className="font-serif text-xs text-[#999999] leading-relaxed line-clamp-3">
                          {member.roleDescription}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 font-serif text-sm text-[#999999]">
                      Belum ada jajaran operasional tambahan yang terdaftar.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Prinsip Good Corporate Governance */}
        <section className="py-20 sm:py-28 border-b border-[#262626] bg-[#0d0d0d]">
          <div className="container-editorial space-y-16">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999999]">
                Tata kelola perusahaan
              </p>
              <h3 className="font-display font-normal uppercase text-2xl sm:text-4xl text-white tracking-[0.06em]">
                Prinsip Good Corporate Governance
              </h3>
              <p className="font-serif text-sm sm:text-base text-[#999999] leading-relaxed">
                Komitmen segenap dewan komisaris, direksi, dan jajaran manajemen dalam menjaga integritas, kepatuhan regulasi, dan akuntabilitas perseroan:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-8 bg-[#141414] border border-[#262626] space-y-4">
                <span className="font-display text-4xl text-white block">01</span>
                <h4 className="font-display uppercase text-lg text-white tracking-[0.04em]">Transparansi Finansial</h4>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Pembukuan berkala yang rapi dan seluruh penerimaan pembayaran melalui rekening giro perseroan resmi tanpa perantara tidak resmi.
                </p>
              </div>

              <div className="p-8 bg-[#141414] border border-[#262626] space-y-4">
                <span className="font-display text-4xl text-white block">02</span>
                <h4 className="font-display uppercase text-lg text-white tracking-[0.04em]">Pengawasan Mutu Konstruksi</h4>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Setiap tahap pekerjaan fisik di lapangan diawasi langsung agar spesifikasi teknis presisi dengan standar kelayakan perumahan nasional.
                </p>
              </div>

              <div className="p-8 bg-[#141414] border border-[#262626] space-y-4">
                <span className="font-display text-4xl text-white block">03</span>
                <h4 className="font-display uppercase text-lg text-white tracking-[0.04em]">Akuntabilitas Konsumen</h4>
                <p className="font-serif text-sm text-[#999999] leading-relaxed">
                  Layanan konsultasi transparan, kepastian pemecahan sertifikat SHM, serta masa pemeliharaan unit pasca serah terima kunci.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Bottom CTA */}
        <section className="py-24 sm:py-32 bg-[#000000] text-white">
          <div className="container-editorial text-center space-y-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999999]">
              Layanan Konsultasi Langsung
            </p>
            <h2 className="font-display font-normal uppercase text-3xl sm:text-5xl lg:text-6xl text-white max-w-2xl mx-auto leading-tight tracking-[0.06em]">
              Konsultasikan Rencana Kepemilikan Rumah Anda
            </h2>
            <p className="font-serif text-[#999999] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Manajemen dan staf PT. Terbang Bersama Kawan siap mendampingi proses KPR Anda hingga tuntas dan serah terima kunci.
            </p>
            <div className="pt-4">
              <Link
                href="/kontak"
                className="btn-bugatti-primary"
              >
                <span>Hubungi Manajemen &amp; Pemasaran</span>
                <ArrowRight className="w-4 h-4 ml-2" />
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
