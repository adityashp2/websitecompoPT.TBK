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
  HelpCircle,
  ArrowRight
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
    <div className="min-h-screen bg-[#F3EFE6] text-[#262722] flex flex-col font-sans selection:bg-[#C5A568] selection:text-[#262722]">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#262722] text-[#F3EFE6] pt-14 pb-16 px-4 border-b border-white/[0.08] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#F3EFE6]/60 mb-6">
              <Link href="/" className="hover:text-[#C5A568] transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-[#C5A568] font-semibold">Kontak &amp; Konsultasi</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/[0.06] border border-white/10 text-[#C5A568] text-[11px] font-semibold uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" />
                <span>{content.contact.badge || 'HUBUNGI PERSEROAN'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3EFE6] leading-tight">
                {content.contact.title || 'Layanan Konsultasi & Pemesanan'}
              </h1>
              <p className="text-[#F3EFE6]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.contact.subtitle || 'Konsultasikan rencana kepemilikan hunian subsidi Anda. Tim representatif kami siap memberikan penjelasan lengkap serta pendampingan survei lokasi.'}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section: Open Editorial Two-Column Layout */}
        <section className="py-16 sm:py-20">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Contact Information (Open Editorial Vertical List) */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                    Informasi Kontak
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#262722]">
                    Kantor Pemasaran &amp; Domisili
                  </h2>
                </div>

                <div className="divide-y divide-[#DDD8CE]">
                  <div className="py-4 first:pt-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block mb-1">
                      Lokasi Kantor
                    </span>
                    <p className="text-xs sm:text-[13px] text-[#262722] font-medium leading-relaxed">
                      {content.contact.address || 'Kawasan Puri Gunung Langgar, Desa Sabah Balau, Kec. Tanjung Bintang, Lampung Selatan'}
                    </p>
                  </div>

                  <div className="py-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block mb-1">
                      Layanan WhatsApp Resmi
                    </span>
                    <p className="font-mono text-sm sm:text-base font-semibold text-[#262722]">
                      {content.contact.whatsapp || '0812-7890-1234'}
                    </p>
                    <span className="text-[11px] text-[#77766F] block mt-0.5">Respon cepat informasi berkas &amp; unit kavling</span>
                  </div>

                  <div className="py-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block mb-1">
                      Surat Elektronik (Email)
                    </span>
                    <p className="text-xs sm:text-[13px] text-[#262722] font-medium">
                      {content.contact.email || 'info@terbangbersamakawan.co.id'}
                    </p>
                  </div>

                  <div className="py-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A568] block mb-1">
                      Jam Pelayanan Kantor
                    </span>
                    <p className="text-xs sm:text-[13px] text-[#262722] font-medium">
                      {content.contact.operatingHours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}
                    </p>
                    <span className="text-[11px] text-[#77766F] block mt-0.5">Survei akhir pekan dengan perjanjian awal</span>
                  </div>
                </div>

                {/* Tasteful Direct WhatsApp Action */}
                <div>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-[12px] border border-emerald-700/30 hover:border-emerald-700 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span>Konsultasi WhatsApp Langsung</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-emerald-700" />
                  </a>
                </div>

                {/* Pendampingan Survei Note (Editorial Callout) */}
                <div className="pt-4 border-l-2 border-[#C5A568] pl-4 space-y-1">
                  <div className="text-xs font-semibold text-[#262722] uppercase tracking-wider">
                    Pendampingan Survei Gratis
                  </div>
                  <p className="text-xs text-[#77766F] leading-relaxed">
                    Survei lokasi Puri Gunung Langgar dapat dijadwalkan setiap hari dengan konfirmasi terlebih dahulu melalui WhatsApp.
                  </p>
                </div>
              </div>

              {/* Right Interactive Form (Open Layout, Direct on Page) */}
              <div className="lg:col-span-7">
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C5A568] block mb-2">
                    Formulir Pemesanan
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#262722] mb-1.5">
                    Formulir Minat &amp; Pemesanan Unit
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[#77766F]">
                    Silakan isi data diri Anda di bawah ini. Tim representatif kami akan segera menghubungi nomor Anda untuk memberikan jadwal survei atau detail berkas KPR.
                  </p>
                </div>

                {formSuccess ? (
                  <div className="p-8 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                    <div className="text-base font-bold">Pesan Anda Berhasil Terkirim</div>
                    <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                      Terima kasih atas ketertarikan Anda. Tim pemasaran PT. Terbang Bersama Kawan akan segera menghubungi nomor WhatsApp Anda.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSuccess(false)}
                      className="mt-3 px-5 py-2.5 rounded-[10px] bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                    >
                      Kirim Pertanyaan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {formError && (
                      <div className="p-3.5 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="kontak-name" className="block text-[11px] font-semibold uppercase tracking-wider text-[#262722] mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        id="kontak-name"
                        type="text"
                        required
                        placeholder="Masukkan nama lengkap Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-[44px] px-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] text-xs sm:text-sm transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="kontak-phone" className="block text-[11px] font-semibold uppercase tracking-wider text-[#262722] mb-1.5">
                          Nomor WhatsApp *
                        </label>
                        <input
                          id="kontak-phone"
                          type="tel"
                          required
                          placeholder="Contoh: 0812xxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-[44px] px-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] text-xs sm:text-sm transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="kontak-email" className="block text-[11px] font-semibold uppercase tracking-wider text-[#262722] mb-1.5">
                          Alamat Email (Opsional)
                        </label>
                        <input
                          id="kontak-email"
                          type="email"
                          placeholder="nama@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-[44px] px-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] text-xs sm:text-sm transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="kontak-message" className="block text-[11px] font-semibold uppercase tracking-wider text-[#262722] mb-1.5">
                        Pesan atau Minat Khusus
                      </label>
                      <textarea
                        id="kontak-message"
                        rows={4}
                        placeholder="Tuliskan pertanyaan mengenai kavling yang diminati, estimasi cicilan KPR, atau jadwal yang diinginkan untuk survei lokasi..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3.5 rounded-[8px] bg-white border border-[#DDD8CE] text-[#262722] placeholder-[#77766F]/50 focus:outline-none focus:border-[#C5A568] focus:ring-1 focus:ring-[#C5A568] text-xs sm:text-sm transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="group w-full h-[46px] rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] font-semibold text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#262722]"
                    >
                      {formSubmitting ? (
                        <span>Mengirim data...</span>
                      ) : (
                        <>
                          <span>Kirim Formulir Minat</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
