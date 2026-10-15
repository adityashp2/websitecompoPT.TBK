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
              <span className="text-[#C9A96A] font-semibold">Tentang Perusahaan</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-[#C9A96A]/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>{content.about.badge || 'PROFIL RESMI PERSEROAN'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight">
                {content.about.title || 'Membangun Hunian Layak, Berkualitas & Berkelanjutan'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                Mengenal lebih dekat dedikasi PT. Terbang Bersama Kawan dalam mewujudkan impian rumah pertama bagi keluarga Indonesia di Provinsi Lampung.
              </p>
            </div>
          </div>
        </section>

        {/* Overview & Key Facts Bar */}
        <section className="bg-white border-b border-slate-200 py-8 shadow-sm">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="border-l-2 border-[#C9A96A] pl-4">
                <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Domisili Kantor</div>
                <div className="text-lg font-bold text-slate-900 mt-1">Bandar Lampung</div>
                <div className="text-xs text-slate-500 mt-0.5">Provinsi Lampung</div>
              </div>
              <div className="border-l-2 border-[#C9A96A] pl-4">
                <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">SK Kemenkumham RI</div>
                <div className="text-lg font-bold text-slate-900 mt-1">Tahun 2021</div>
                <div className="text-xs text-slate-500 mt-0.5">AHU-0016462.AH.01.01</div>
              </div>
              <div className="border-l-2 border-[#C9A96A] pl-4">
                <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Kategori Pembangunan</div>
                <div className="text-lg font-bold text-slate-900 mt-1">Hunian Subsidi</div>
                <div className="text-xs text-slate-500 mt-0.5">Program KPR FLPP</div>
              </div>
              <div className="border-l-2 border-[#C9A96A] pl-4">
                <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Proyek Unggulan</div>
                <div className="text-lg font-bold text-slate-900 mt-1">Puri Gunung Langgar</div>
                <div className="text-xs text-slate-500 mt-0.5">Tanjung Bintang, Lamsel</div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-16 sm:py-20">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Sejarah & Komitmen */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Sejarah & Latar Belakang Pendirian
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {content.about.description || 'PT. Terbang Bersama Kawan (PT. TBK) didirikan dengan komitmen kuat untuk menjadi pengembang perumahan yang amanah, profesional, dan memberikan dampak nyata bagi penyediaan papan di Provinsi Lampung.'}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    Dengan meningkatnya kebutuhan hunian bersubsidi berkualitas di sekitar pusat pertumbuhan ekonomi Kota Bandar Lampung dan Kabupaten Lampung Selatan, PT. TBK menghadirkan perumahan bersubsidi <strong>Puri Gunung Langgar</strong> di Desa Sabah Balau, Tanjung Bintang.
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                    <Link
                      href="/proyek"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C9A96A] hover:text-[#0E1014] text-white text-xs font-bold transition-colors"
                    >
                      <span>Lihat Proyek Puri Gunung Langgar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/legalitas"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                    >
                      <span>Periksa Salinan Legalitas</span>
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
                    </Link>
                  </div>
                </div>

                {/* Visi Card */}
                <div className="p-8 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Visi Perseroan
                    </div>
                    <blockquote className="text-base sm:text-lg font-serif italic text-amber-950 font-semibold leading-relaxed">
                      &ldquo;{content.about.visionText || 'Menjadi perusahaan properti yang berkualitas dan terpercaya.'}&rdquo;
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Right Column: Misi Perusahaan */}
              <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#C9A96A] flex items-center justify-center mb-4 border border-slate-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {content.about.missionTitle || 'Misi Perusahaan'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Pedoman arah langkah perseroan dalam melayani calon pemilik rumah:
                  </p>
                </div>

                <ul className="space-y-4">
                  {content.about.missions?.map((misi, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-slate-700 text-sm leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-[#C9A96A] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{misi}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Berkomitmen penuh menjalankan tata kelola pengembang yang bertanggung jawab.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Nilai Utama */}
        <section className="py-16 bg-white border-t border-b border-slate-200">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-2 block">
                NILAI FUNDAMENTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Pilar Kepercayaan Konsumen
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Empat standar integritas yang kami junjung tinggi dalam setiap tahap pembangunan dan akad kredit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => {
                const IconComp = v.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[#FBF9F5] border border-slate-200 hover:border-[#C9A96A] hover:shadow-md transition-all duration-200 space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-700 shadow-sm">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-16 bg-[#0E1014] text-white">
          <div className="container-std max-w-[1120px] mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] text-[#C9A96A] text-xs font-bold uppercase tracking-wider border border-[#C9A96A]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KONSULTASI GRATIS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold max-w-xl mx-auto text-[#F4EFE6]">
              Siap Mengetahui Lebih Jauh Proyek Kami?
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto">
              Tim representatif PT. Terbang Bersama Kawan siap memberikan informasi ketersediaan unit, simulasi KPR FLPP, serta pendampingan survei lokasi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/proyek"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C9A96A] hover:bg-amber-500 text-[#0E1014] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Eksplorasi Proyek
              </Link>
              <Link
                href="/kontak"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Hubungi Kami
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
