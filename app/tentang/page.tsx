import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  MapPin, 
  FileCheck2, 
  Users, 
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Tentang Kami | PT. Terbang Bersama Kawan (PT. TBK)',
  description: 'Profil resmi PT. Terbang Bersama Kawan, pengembang perumahan bersubsidi terpercaya di Bandar Lampung. Visi, misi, legalitas Kemenkumham, dan komitmen mutu pembangunan.',
};

export default function TentangPage() {
  const content = getSiteContent();

  const values = [
    {
      title: 'Legalitas & Kepastian Hukum',
      desc: 'Beroperasi berlandaskan Akta Pendirian Notaris resmi dan SK Pengesahan Kemenkumham RI Tahun 2021 untuk keamanan hak kepemilikan konsumen.',
      icon: ShieldCheck,
    },
    {
      title: 'Standar Mutu Konstruksi',
      desc: 'Pondasi batu belah, struktur beton bertulang, dinding plester aci, dan sanitasi terencana sesuai standar teknis Kementerian PUPR.',
      icon: CheckCircle2,
    },
    {
      title: 'Kemitraan Perbankan FLPP',
      desc: 'Bekerja sama dengan bank penyalur KPR bersubsidi guna memudahkan proses persetujuan kredit dengan suku bunga ringan flat 5%.',
      icon: Award,
    },
    {
      title: 'Transparansi Layanan',
      desc: 'Keterbukaan informasi harga, tahapan berkas, progres fisik lapangan, serta pendampingan langsung hingga serah terima kunci unit.',
      icon: Users,
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
              <span className="text-[#C5A568] font-semibold">Tentang Perusahaan</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/[0.06] border border-white/10 text-[#C5A568] text-[11px] font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>{content.about.badge || 'PROFIL RESMI PERSEROAN'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3EFE6] leading-tight">
                {content.about.title || 'Membangun Hunian Layak, Berkualitas & Berkelanjutan'}
              </h1>
              <p className="text-[#F3EFE6]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                Mengenal lebih dekat dedikasi PT. Terbang Bersama Kawan dalam mewujudkan impian rumah pertama bagi keluarga Indonesia di Provinsi Lampung.
              </p>
            </div>
          </div>
        </section>

        {/* Overview & Key Facts Bar: Open Horizontal Strip */}
        <section className="bg-[#F3EFE6] border-b border-[#DDD8CE] py-8">
          <div className="container-editorial">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#DDD8CE]">
              <div className="pt-4 sm:pt-0 sm:pl-0 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold">Domisili Kantor</div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">Bandar Lampung</div>
                <div className="text-[11px] text-[#77766F]">Provinsi Lampung</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold">SK Kemenkumham RI</div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">Tahun 2021</div>
                <div className="text-[11px] font-mono text-[#77766F]">AHU-0016462.AH.01.01</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold">Kategori Pembangunan</div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">Hunian Subsidi</div>
                <div className="text-[11px] text-[#77766F]">Program KPR FLPP</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#77766F] font-semibold">Proyek Unggulan</div>
                <div className="font-serif text-xl sm:text-2xl font-normal text-[#262722]">Puri Gunung Langgar</div>
                <div className="text-[11px] text-[#77766F]">Tanjung Bintang, Lamsel</div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section: Open Architectural Layout */}
        <section className="py-16 sm:py-20">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Sejarah & Komitmen (Open Storytelling) */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                    Latar Belakang
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                    Sejarah &amp; Pendirian Perseroan
                  </h2>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-[#77766F] leading-relaxed">
                  <p>
                    {content.about.description || 'PT. Terbang Bersama Kawan (PT. TBK) didirikan dengan komitmen kuat untuk menjadi pengembang perumahan yang amanah, profesional, dan memberikan dampak nyata bagi penyediaan papan di Provinsi Lampung.'}
                  </p>
                  <p>
                    Dengan meningkatnya kebutuhan hunian bersubsidi berkualitas di sekitar pusat pertumbuhan ekonomi Kota Bandar Lampung dan Kabupaten Lampung Selatan, PT. TBK menghadirkan perumahan bersubsidi <strong className="text-[#262722] font-semibold">Puri Gunung Langgar</strong> di Desa Sabah Balau, Tanjung Bintang.
                  </p>
                </div>

                {/* Visi: Architectural Pullquote */}
                <div className="border-l-2 border-[#C5A568] pl-6 py-2 my-8 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block">
                    Visi Perseroan
                  </span>
                  <blockquote className="font-serif text-xl sm:text-2xl italic text-[#262722] leading-snug">
                    &ldquo;{content.about.visionText || 'Menjadi perusahaan properti yang berkualitas dan terpercaya.'}&rdquo;
                  </blockquote>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/proyek"
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
                  >
                    <span>Lihat Proyek Puri Gunung Langgar</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/pimpinan"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] border border-[#262722]/30 hover:border-[#C5A568] hover:bg-[#C5A568]/10 text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#C5A568]" />
                    <span>Dewan Pengurus &amp; Manajemen</span>
                  </Link>
                  <Link
                    href="/legalitas"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] border border-[#262722]/30 hover:border-[#C5A568] hover:bg-[#C5A568]/10 text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#C5A568]" />
                    <span>Salinan Legalitas</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Misi Perusahaan (Open Numbered Editorial List) */}
              <div className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-[#DDD8CE] space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                    Arah Kebijakan
                  </span>
                  <h3 className="font-serif text-2xl text-[#262722]">
                    {content.about.missionTitle || 'Misi Perusahaan'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                    Pedoman arah langkah perseroan dalam melayani calon pemilik rumah:
                  </p>
                </div>

                <div className="divide-y divide-[#DDD8CE]">
                  {content.about.missions?.map((misi, i) => (
                    <div key={i} className="py-4 first:pt-0 flex items-start gap-4">
                      <span className="font-serif text-2xl text-[#C5A568] leading-none shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs sm:text-sm text-[#262722] leading-relaxed">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#DDD8CE] flex items-center gap-2.5 text-xs text-[#77766F]">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A568] shrink-0" />
                  <span>Berkomitmen penuh menjalankan tata kelola pengembang yang bertanggung jawab.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Nilai Utama: Open 4-Column Editorial Composition */}
        <section className="py-16 sm:py-20 bg-white/40 border-t border-b border-[#DDD8CE]">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                Nilai Fundamental
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                Pilar Kepercayaan Konsumen
              </h2>
              <p className="text-xs sm:text-sm text-[#77766F] mt-1 leading-relaxed">
                Empat standar integritas yang kami junjung tinggi dalam setiap tahap pembangunan dan akad kredit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-[#DDD8CE]">
              {values.map((v, i) => (
                <div
                  key={i}
                  className={`space-y-3 ${i > 0 ? 'lg:pl-8' : ''}`}
                >
                  <span className="font-serif text-3xl text-[#C5A568] block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-serif text-lg text-[#262722] leading-snug">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner: Charcoal Editorial Section */}
        <section className="py-16 sm:py-20 bg-[#262722] text-[#F3EFE6]">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F3EFE6] max-w-xl mx-auto">
              Siap Mengetahui Lebih Jauh Proyek Kami?
            </h2>
            <p className="text-[#F3EFE6]/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Tim representatif PT. Terbang Bersama Kawan siap memberikan informasi ketersediaan unit, simulasi KPR FLPP, serta pendampingan survei lokasi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/proyek"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
              >
                <span>Eksplorasi Proyek</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] border border-white/20 hover:border-[#C5A568] hover:bg-[#C5A568]/10 text-[#F3EFE6] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
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
