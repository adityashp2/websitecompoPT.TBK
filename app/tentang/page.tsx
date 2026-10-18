import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  FileCheck2, 
  Users,
  Calculator, 
  ArrowRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Tentang Kami | PT. Terbang Bersama Kawan (PT. TBK)',
  description: 'Profil resmi PT. Terbang Bersama Kawan, pengembang perumahan bersubsidi terpercaya di Bandar Lampung. Visi, misi, legalitas Kemenkumham, dan komitmen mutu pembangunan.',
};

export default async function TentangPage() {
  const content = await getSiteContent();

  const values = (content.about.values && content.about.values.length > 0)
    ? content.about.values
    : [
        {
          title: 'Legalitas & Kepastian Hukum',
          desc: 'Beroperasi berlandaskan Akta Pendirian Notaris resmi dan SK Pengesahan Kemenkumham RI Tahun 2021 untuk keamanan hak kepemilikan konsumen.',
        },
        {
          title: 'Standar Mutu Konstruksi',
          desc: 'Pondasi batu belah, struktur beton bertulang, dinding plester aci, dan sanitasi terencana sesuai standar teknis Kementerian PUPR.',
        },
        {
          title: 'Kemitraan Perbankan FLPP',
          desc: 'Bekerja sama dengan bank penyalur KPR bersubsidi guna memudahkan proses persetujuan kredit dengan suku bunga ringan flat 5%.',
        },
        {
          title: 'Transparansi Layanan',
          desc: 'Keterbukaan informasi harga, tahapan berkas, progres fisik lapangan, serta pendampingan langsung hingga serah terima kunci unit.',
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
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70 mb-6" suppressHydrationWarning>
              <Link href="/" className="hover:text-[#FF9D2E] transition-colors" suppressHydrationWarning>
                Beranda
              </Link>
              <span>/</span>
              <span className="text-[#FF9D2E] font-bold">Tentang Perusahaan</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-[11px] font-medium tracking-wide">
                <Building2 className="w-3.5 h-3.5" />
                <span>{content.about.badge || 'Profil Resmi Perseroan'}</span>
              </div>
              <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[46px] tracking-tight text-white leading-[1.15]">
                {content.about.title || 'Membangun Hunian Layak, Berkualitas & Berkelanjutan'}
              </h1>
              <p className="font-sans text-white/85 text-[15px] sm:text-base leading-relaxed max-w-2xl">
                Mengenal lebih dekat dedikasi PT. Terbang Bersama Kawan dalam mewujudkan impian rumah pertama bagi keluarga Indonesia di Provinsi Lampung.
              </p>
            </div>
          </div>
        </section>

        {/* Overview & Key Facts Bar */}
        <section className="bg-[#F4F7FC] border-b border-[#DCE7F5] py-8">
          <div className="container-editorial">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#DCE7F5]">
              <div className="pt-4 sm:pt-0 sm:pl-0 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium">Domisili Kantor</div>
                <div className="font-semibold text-xl sm:text-2xl text-[#102D52]">Bandar Lampung</div>
                <div className="text-[11.5px] text-[#526783]">Provinsi Lampung</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium">SK Kemenkumham RI</div>
                <div className="font-semibold text-xl sm:text-2xl text-[#102D52]">Tahun 2021</div>
                <div className="text-[11.5px] font-mono text-[#526783]">AHU-0016462.AH.01.01</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium">Kategori Pembangunan</div>
                <div className="font-semibold text-xl sm:text-2xl text-[#073B78]">Hunian Subsidi</div>
                <div className="text-[11.5px] text-[#526783]">Program KPR FLPP</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] tracking-wide text-[#526783] font-medium">Proyek Unggulan</div>
                <div className="font-semibold text-xl sm:text-2xl text-[#FF9D2E]">Puri Gunung Langgar</div>
                <div className="text-[11.5px] text-[#526783]">Tanjung Bintang, Lamsel</div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Sejarah & Komitmen */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Latar Belakang</span>
                  </div>
                  <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                    Sejarah &amp; Pendirian Perseroan
                  </h2>
                </div>

                <div className="space-y-4 font-sans text-sm sm:text-base text-[#526783] leading-relaxed">
                  <p>
                    {content.about.description || 'PT. Terbang Bersama Kawan (PT. TBK) didirikan dengan komitmen kuat untuk menjadi pengembang perumahan yang amanah, profesional, dan memberikan dampak nyata bagi penyediaan papan di Provinsi Lampung.'}
                  </p>
                  <p>
                    Dengan meningkatnya kebutuhan hunian bersubsidi berkualitas di sekitar pusat pertumbuhan ekonomi Kota Bandar Lampung dan Kabupaten Lampung Selatan, PT. TBK menghadirkan perumahan bersubsidi <strong className="text-[#102D52] font-semibold">Puri Gunung Langgar</strong> di Desa Sabah Balau, Tanjung Bintang.
                  </p>
                </div>

                {/* Visi Statement */}
                <div className="border-l-4 border-[#FF9D2E] bg-[#F4F7FC] rounded-r-2xl p-6 space-y-2">
                  <span className="text-[11px] font-medium tracking-wide text-[#FF9D2E] block">
                    Visi Perseroan
                  </span>
                  <blockquote className="font-serif text-xl sm:text-2xl font-normal italic text-[#102D52] leading-relaxed">
                    &ldquo;{content.about.visionText || 'Menjadi perusahaan properti yang berkualitas dan terpercaya.'}&rdquo;
                  </blockquote>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/proyek"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-xs font-semibold tracking-normal transition-all duration-200 hover:-translate-y-[1px] shadow-sm"
                  >
                    <span>Lihat Proyek Puri Gunung Langgar</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/simulasi-kpr"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#073B78] hover:bg-[#073B78] hover:text-white text-[#073B78] text-xs font-semibold tracking-normal transition-all duration-200"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#FF9D2E]" />
                    <span>Hitung Simulasi KPR</span>
                  </Link>
                  <Link
                    href="/legalitas"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#DCE7F5] hover:border-[#073B78] text-[#102D52] text-xs font-semibold tracking-normal transition-all duration-200"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#073B78]" />
                    <span>Salinan Legalitas</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Misi Perusahaan */}
              <div className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-[#DCE7F5] space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Arah Kebijakan</span>
                  </div>
                  <h3 className="font-serif font-normal text-2xl text-[#102D52]">
                    {content.about.missionTitle || 'Misi Perusahaan'}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                    Pedoman arah langkah perseroan dalam melayani calon pemilik rumah:
                  </p>
                </div>

                <div className="divide-y divide-[#DCE7F5]">
                  {content.about.missions?.map((misi, i) => (
                    <div key={i} className="py-4 first:pt-0 flex items-start gap-4">
                      <span className="font-serif text-2xl text-[#FF9D2E] leading-none shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="font-sans text-xs sm:text-[13.5px] text-[#102D52] font-medium leading-relaxed">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#DCE7F5] flex items-center gap-2.5 text-xs text-[#15966A] font-medium font-sans">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Berkomitmen penuh menjalankan tata kelola pengembang yang bertanggung jawab.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Nilai Utama */}
        <section className="py-16 sm:py-24 bg-[#F4F7FC] border-t border-b border-[#DCE7F5]">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-2 text-[#FF9D2E] font-medium text-xs tracking-wider mb-2">
                <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                <span>Nilai Fundamental</span>
              </div>
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                Pilar Kepercayaan Konsumen
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#526783] mt-1 leading-relaxed">
                Empat standar integritas yang kami junjung tinggi dalam setiap tahap pembangunan dan akad kredit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-[#DCE7F5] shadow-sm hover:shadow-md transition-shadow space-y-3"
                >
                  <span className="font-serif text-3xl text-[#073B78] block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-[16px] text-[#102D52] leading-snug">{v.title}</h3>
                  <p className="font-sans text-xs sm:text-[13px] text-[#526783] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-4xl text-white max-w-xl mx-auto">
              Siap Mengetahui Lebih Jauh Proyek Kami?
            </h2>
            <p className="font-sans text-white/85 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Tim representatif PT. Terbang Bersama Kawan siap memberikan informasi ketersediaan unit, simulasi KPR FLPP, serta pendampingan survei lokasi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/proyek"
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-xs font-semibold tracking-normal transition-all duration-200 hover:-translate-y-[1px] shadow-lg"
              >
                <span>Eksplorasi Proyek</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/40 hover:border-white hover:bg-white/10 text-white text-xs font-semibold tracking-normal transition-all duration-200"
              >
                <span>Hubungi Layanan Konsultasi</span>
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
