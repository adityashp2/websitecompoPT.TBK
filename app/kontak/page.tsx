'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { initialSiteContent, SiteContent } from '@/lib/initialData';
import { 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

export default function KontakPage() {
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

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormSuccess(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setFormError(data.error || 'Terjadi kendala saat mengirim pesan.');
      }
    } catch {
      setFormError('Gagal menghubungkan ke server. Silakan hubungi langsung via WhatsApp.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const rawWa = content.contact?.whatsapp || '0812-7890-1234';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin bertanya tentang perumahan subsidi Puri Gunung Langgar.')}`;

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
              <span className="text-[#C9A96A] font-semibold">Kontak & Konsultasi</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-[#C9A96A]/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" />
                <span>{content.contact.badge || 'HUBUNGI PERSEROAN'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight">
                {content.contact.title || 'Layanan Konsultasi & Pemesanan'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.contact.subtitle || 'Konsultasikan rencana kepemilikan hunian subsidi Anda. Tim representatif kami siap memberikan penjelasan lengkap serta pendampingan survei lokasi.'}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section: Info & Form */}
        <section className="py-14 sm:py-16">
          <div className="container-std max-w-[1120px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Contact Information */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1 block">
                    Kantor & Domisili
                  </span>
                  <div className="text-xl font-bold text-slate-900 mb-2">
                    {content.contact.city || 'Bandar Lampung'}
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{content.contact.address || 'Kawasan Puri Gunung Langgar, Desa Sabah Balau, Kec. Tanjung Bintang, Lampung Selatan'}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5 block">
                    WhatsApp Official
                  </span>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-bold font-mono">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{content.contact.whatsapp || '0812-7890-1234'}</span>
                  </div>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat WhatsApp Sekarang</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5 block">
                    Surat Elektronik (Email)
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{content.contact.email || 'info@terbangbersamakawan.co.id'}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5 block">
                    Jam Layanan Operasional
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{content.contact.operatingHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Pendampingan Survei Gratis</span>
                  </div>
                  <p className="leading-relaxed">
                    Survei lokasi Puri Gunung Langgar dapat dijadwalkan setiap hari dengan konfirmasi terlebih dahulu melalui WhatsApp.
                  </p>
                </div>
              </div>

              {/* Right Interactive Form */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Formulir Minat & Pemesanan Unit
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Silakan isi data diri Anda di bawah ini. Tim representatif kami akan segera menghubungi nomor Anda untuk memberikan jadwal survei atau detail berkas KPR.
                </p>

                {formSuccess ? (
                  <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
                    <div className="text-lg font-bold">Pesan Anda Berhasil Terkirim</div>
                    <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                      Terima kasih atas ketertarikan Anda. Tim pemasaran PT. Terbang Bersama Kawan akan segera menghubungi nomor WhatsApp Anda.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSuccess(false)}
                      className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                    >
                      Kirim Pertanyaan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {formError && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan nama lengkap Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Nomor WhatsApp / HP *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Contoh: 0812xxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Alamat Email (Opsional)
                        </label>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Pesan / Minat Khusus
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tuliskan pertanyaan mengenai kavling yang diminati, estimasi cicilan KPR, atau jadwal yang diinginkan untuk survei lokasi..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs sm:text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formSubmitting ? (
                        <span>Mengirim data...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Formulir Minat</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
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
