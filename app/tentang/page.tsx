import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  Building2, 
  CheckCircle2, 
  FileCheck2, 
  Calculator, 
  ArrowRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Tentang Perusahaan & Visi Misi | PT. Terbang Bersama Kawan (PT. TBK)',
  description: 'Profil resmi PT. Terbang Bersama Kawan, pengembang perumahan bersubsidi terpercaya di Lampung. Visi, misi, legalitas SK Kemenkumham RI Tahun 2021, dan komitmen penyediaan rumah layak huni bagi masyarakat.',
  keywords: [
    'Profil PT Terbang Bersama Kawan',
    'Sejarah PT TBK',
    'Developer Properti Bandar Lampung',
    'Visi Misi PT Terbang Bersama Kawan',
    'Pengembang Rumah Subsidi Lampung'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id/tentang',
  },
  openGraph: {
    title: 'Tentang Perusahaan | PT. Terbang Bersama Kawan (PT. TBK)',
    description: 'Profil, visi, misi, dan komitmen pengembang hunian berkualitas di Lampung.',
    url: 'https://terbangbersamakawan.co.id/tentang',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
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
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#000000] text-white pt-20 pb-24 px-6 border-b border-[#262626] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-[#999999] mb-8">
              <Link href="/" className="hover:text-white transition-colors">
                BERANDA
              </Link>
              <span>/</span>
              <span className="text-white">TENTANG PERUSAHAAN</span>
            </nav>

            <div className="max-w-4xl space-y-5">
              <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[#262626] text-white inline-block">
                {content.about.badge || 'PROFIL RESMI PERSEROAN'}
              </span>
              <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[70px] uppercase tracking-[3px] text-white leading-[1.08]">
                {content.about.title || 'Membangun Hunian Layak, Berkualitas & Berkelanjutan'}
              </h1>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl pt-2">
                {content.about.headerSubtitle || 'Mengenal lebih dekat dedikasi PT. Terbang Bersama Kawan dalam mewujudkan impian rumah pertama bagi keluarga Indonesia di Provinsi Lampung.'}
              </p>
            </div>
          </div>
        </section>

        {/* Overview & Key Facts Bar */}
        <section className="bg-[#0d0d0d] border-b border-[#262626] py-10">
          <div className="container-editorial">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#262626]">
              <div className="pt-4 sm:pt-0 sm:pl-0 space-y-1.5">
                <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999]">DOMISILI RESMI</div>
                <div className="font-display font-normal text-2xl uppercase tracking-[1.5px] text-white">Bandar Lampung</div>
                <div className="font-serif text-xs text-[#999999]">Provinsi Lampung</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1.5">
                <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999]">SK KEMENKUMHAM RI</div>
                <div className="font-display font-normal text-2xl uppercase tracking-[1.5px] text-white">TAHUN 2021</div>
                <div className="font-mono text-xs text-[#999999]">AHU-0016462</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1.5">
                <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999]">KATEGORI PROYEK</div>
                <div className="font-display font-normal text-2xl uppercase tracking-[1.5px] text-white">Hunian Bersubsidi</div>
                <div className="font-serif text-xs text-[#999999]">KPR FLPP 5%</div>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-8 space-y-1.5">
                <div className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#999999]">PROYEK AKTIF</div>
                <div className="font-display font-normal text-2xl uppercase tracking-[1.5px] text-white">Puri Gunung Langgar</div>
                <div className="font-serif text-xs text-[#999999]">Tanjung Bintang</div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-24 sm:py-32 bg-[#000000] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Sejarah & Komitmen */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                    LATAR BELAKANG
                  </span>
                  <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                    Sejarah &amp; Pendirian Perseroan
                  </h2>
                </div>

                <div className="space-y-4 font-serif text-base text-[#cccccc] leading-relaxed">
                  <p>
                    {content.about.description || 'PT. Terbang Bersama Kawan (PT. TBK) didirikan dengan komitmen kuat untuk menjadi pengembang perumahan yang amanah, profesional, dan memberikan dampak nyata bagi penyediaan papan di Provinsi Lampung.'}
                  </p>
                  <p>
                    Dengan meningkatnya kebutuhan hunian bersubsidi berkualitas di sekitar pusat pertumbuhan ekonomi Kota Bandar Lampung dan Kabupaten Lampung Selatan, PT. TBK menghadirkan perumahan bersubsidi <strong className="text-white font-normal">Puri Gunung Langgar</strong> di Desa Sabah Balau, Tanjung Bintang.
                  </p>
                </div>

                {/* Visi Statement */}
                <div className="border-l-2 border-white p-6 bg-[#0d0d0d] border border-[#262626] space-y-2">
                  <span className="font-mono text-[10px] tracking-[2px] uppercase text-[#999999] block">
                    VISI PERSEROAN
                  </span>
                  <blockquote className="font-serif text-xl sm:text-2xl font-normal italic text-white leading-relaxed">
                    &ldquo;{content.about.visionText || 'Menjadi perusahaan properti yang berkualitas dan terpercaya.'}&rdquo;
                  </blockquote>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/proyek"
                    className="btn-bugatti-primary"
                  >
                    <span>LIHAT PROYEK PURI GUNUNG LANGGAR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/simulasi-kpr"
                    className="btn-bugatti-primary border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
                  >
                    <span>SIMULASI KPR</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Misi Perusahaan */}
              <div className="lg:col-span-5 lg:pl-12 lg:border-l lg:border-[#262626] space-y-6">
                <div>
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                    ARAH KEBIJAKAN
                  </span>
                  <h3 className="font-display font-normal text-2xl sm:text-3xl uppercase tracking-[2px] text-white">
                    {content.about.missionTitle || 'Misi Perusahaan'}
                  </h3>
                  <p className="font-serif text-sm text-[#999999] mt-2 leading-relaxed">
                    Pedoman arah langkah perseroan dalam melayani calon pemilik rumah:
                  </p>
                </div>

                <div className="divide-y divide-[#262626]">
                  {content.about.missions?.map((misi, i) => (
                    <div key={i} className="py-4 first:pt-0 flex items-start gap-4">
                      <span className="font-display text-2xl text-white tracking-[1px] leading-none shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="font-serif text-sm text-[#cccccc] leading-relaxed">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#262626] flex items-center gap-2.5 font-mono text-xs tracking-[1px] uppercase text-[#999999]">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>BERKOMITMEN MENJALANKAN TATA KELOLA BERTANGGUNG JAWAB</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Nilai Utama */}
        <section className="py-24 sm:py-32 bg-[#0d0d0d] border-b border-[#262626]">
          <div className="container-editorial">
            <div className="max-w-2xl mb-16">
              <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                NILAI FUNDAMENTAL
              </span>
              <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white">
                Pilar Kepercayaan Konsumen
              </h2>
              <p className="font-serif text-base text-[#999999] mt-2 leading-relaxed">
                Empat standar integritas yang kami junjung tinggi dalam setiap tahap pembangunan dan proses perbankan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="card-bugatti p-8 space-y-3 group"
                >
                  <span className="font-display text-4xl text-white tracking-[2px] block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display font-normal text-lg uppercase tracking-[1.5px] text-white">{v.title}</h3>
                  <p className="font-serif text-sm text-[#999999] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-24 bg-[#000000] text-white">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-display font-normal text-3xl sm:text-5xl uppercase tracking-[3px] text-white max-w-2xl mx-auto">
              Siap Memiliki Rumah Impian Anda?
            </h2>
            <p className="font-serif text-[#cccccc] text-base max-w-xl mx-auto leading-relaxed">
              Tim perwakilan PT. Terbang Bersama Kawan siap memberikan konsultasi persyaratan KPR FLPP, pemilihan kavling, serta survei lokasi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/proyek"
                className="btn-bugatti-primary"
              >
                <span>EKSPLORASI PROYEK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/kontak"
                className="btn-bugatti-primary border-[#3a3a3a] text-[#cccccc] hover:border-white hover:text-white"
              >
                <span>HUBUNGI KAMI</span>
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
