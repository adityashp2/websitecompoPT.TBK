import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  User
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dewan Pengurus & Pimpinan | PT. Terbang Bersama Kawan',
  description: 'Struktur pengurus dan manajemen resmi PT. Terbang Bersama Kawan: Direktur Utama dan Komisaris perseroan yang berdedikasi membangun hunian layak di Lampung.',
};

export default function PimpinanPage() {
  const content = getSiteContent();
  const members = content.leadership?.members || [];

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
              <span className="text-[#C9A96A] font-semibold">Dewan Pengurus</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-[#C9A96A]/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>{content.leadership.badge || 'STRUKTUR PENGURUS RESMI'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight">
                {content.leadership.title || 'Dewan Pengurus Perseroan'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.leadership.subtitle || 'Sosok kepemimpinan yang berintegritas dalam memajukan standar perumahan bersubsidi di Provinsi Lampung.'}
              </p>
            </div>
          </div>
        </section>

        {/* Board of Directors Cards */}
        <section className="py-14 sm:py-16">
          <div className="container-std max-w-[1120px] mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-amber-400/50 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Executive Portrait Frame */}
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
                    {member.image && member.image.trim() !== '' ? (
                      <>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Vignette Gradient Overlay at Bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
                      </>
                    ) : (
                      /* Fallback: Executive Architectural Monogram Podium */
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-[#141822] to-slate-950 relative overflow-hidden">
                        <div 
                          className="absolute inset-0 opacity-10 pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #C9A96A 1px, transparent 0)`,
                            backgroundSize: '24px 24px',
                          }}
                        />
                        <div className="relative z-10 w-24 h-28 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/15 to-transparent flex flex-col items-center justify-center p-4 shadow-2xl backdrop-blur-sm">
                          <Building2 className="w-7 h-7 text-[#C9A96A] mb-1.5" />
                          <span className="text-2xl font-serif font-black text-[#C9A96A] tracking-wider">
                            {member.name ? member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'TBK'}
                          </span>
                        </div>
                        <span className="relative z-10 mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                          Portret Eksekutif Perseroan
                        </span>
                      </div>
                    )}

                    {/* Floating Role Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{member.role}</span>
                    </div>

                    {/* Official SK Status Badge */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[11px] font-semibold border border-emerald-500/30 flex items-center gap-1.5 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SK Sah Kemenkumham</span>
                    </div>

                    {/* Name Banner at bottom of portrait for cinematic look */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                      <span className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-semibold block mb-0.5">
                        {member.role} PT. TBK
                      </span>
                      <h3 className="font-extrabold text-2xl text-white tracking-tight drop-shadow-md">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          Amanat & Tanggung Jawab
                        </span>
                        <span className="h-px flex-1 bg-amber-200/60" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {member.roleDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#C9A96A] shrink-0" />
                        <span className="font-medium text-slate-700">Akta Pendirian Notaris No. 10</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">18 Maret 2021</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prinsip Tata Kelola (GCG) */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1 block">
                  GOOD CORPORATE GOVERNANCE
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Prinsip Tata Kelola Perusahaan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Komitmen manajemen dalam menjaga integritas, kepatuhan regulasi, dan akuntabilitas:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-[#FBF9F5] border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Transparansi Finansial</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pembukuan berkala yang rapi dan seluruh penerimaan pembayaran melalui rekening giro perseroan.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#FBF9F5] border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Pengawasan Konstruksi</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Setiap tahap pekerjaan diawasi langsung agar spesifikasi fisik di lapangan presisi dengan RAB teknis.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#FBF9F5] border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Akuntabilitas Konsumen</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Layanan purna jual dan garansi masa pemeliharaan unit pasca serah terima kunci.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-14 bg-[#0E1014] text-white">
          <div className="container-std max-w-[1120px] mx-auto text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EFE6]">
              Konsultasikan Rencana Kepemilikan Rumah Anda
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto">
              Manajemen dan staf PT. Terbang Bersama Kawan siap mendampingi proses KPR Anda hingga tuntas.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A96A] hover:bg-amber-500 text-[#0E1014] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Hubungi Manajemen & Pemasaran</span>
                <ArrowRight className="w-4 h-4" />
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
