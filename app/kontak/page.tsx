'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { initialSiteContent, SiteContent } from '@/lib/initialData';
import { 
  Phone, 
  CheckCircle2, 
  MessageCircle, 
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

  const rawWa = content.contact?.whatsapp?.trim() || '';
  const cleanPhone = rawWa.replace(/\D/g, '');
  const hasWa = cleanPhone.length >= 7;
  const formattedWa = cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : `62${cleanPhone}`;
  const waUrl = hasWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent('Halo PT. TBK, saya ingin bertanya tentang perumahan subsidi Puri Gunung Langgar.')}`
    : '';

  return (
    <div className="min-h-screen bg-white text-[#102D52] flex flex-col font-sans selection:bg-[#FF9D2E] selection:text-[#102D52]">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white pt-14 pb-16 px-4 border-b border-white/10 relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70 mb-6">
              <Link href="/" className="hover:text-[#FF9D2E] transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-[#FF9D2E] font-medium">Kontak &amp; Konsultasi</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-xs font-medium">
                <Phone className="w-3.5 h-3.5" />
                <span>{content.contact.badge || 'Hubungi perseroan'}</span>
              </div>
              <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {content.contact.title || 'Layanan Konsultasi & Pemesanan'}
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.contact.subtitle || 'Konsultasikan rencana kepemilikan hunian subsidi Anda. Tim representatif kami siap memberikan penjelasan lengkap serta pendampingan survei lokasi.'}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Contact Information */}
              <div className="lg:col-span-5 bg-[#F4F7FC] p-4 sm:p-7 lg:p-8 rounded-2xl border border-[#DCE7F5] shadow-sm space-y-6 sm:space-y-8">
                <div>
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-semibold text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Informasi kontak</span>
                  </div>
                  <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52]">
                    Kantor Pemasaran &amp; Domisili
                  </h2>
                </div>

                <div className="divide-y divide-[#DCE7F5]">
                  {content.contact?.address && content.contact.address.trim() !== '' && (
                    <div className="py-4 first:pt-0">
                      <span className="text-xs text-[#FF9D2E] font-semibold block mb-1">
                        Lokasi kantor
                      </span>
                      <p className="text-xs sm:text-[13.5px] text-[#102D52] font-semibold leading-relaxed">
                        {content.contact.address}
                      </p>
                    </div>
                  )}

                  {hasWa && (
                    <div className="py-4">
                      <span className="text-xs text-[#FF9D2E] font-semibold block mb-1.5">
                        Layanan WhatsApp resmi
                      </span>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#102D52] font-mono text-sm sm:text-base font-bold transition-all shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 text-[#15966A] fill-current shrink-0" />
                        <span>{content.contact.whatsapp}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#15966A] transition-transform duration-200 group-hover:translate-x-1 ml-1" />
                      </a>
                      <span className="text-[11px] text-[#526783] block mt-1.5">
                        Klik nomor di atas untuk langsung chat dengan tim pemasaran kami
                      </span>
                    </div>
                  )}

                  {content.contact?.email && content.contact.email.trim() !== '' && (
                    <div className="py-4">
                      <span className="text-xs text-[#FF9D2E] font-semibold block mb-1">
                        Surat elektronik (email)
                      </span>
                      <p className="text-xs sm:text-[13.5px] text-[#102D52] font-medium">
                        {content.contact.email}
                      </p>
                    </div>
                  )}

                  {content.contact?.operatingHours && content.contact.operatingHours.trim() !== '' && (
                    <div className="py-4">
                      <span className="text-xs text-[#FF9D2E] font-semibold block mb-1">
                        Jam pelayanan kantor
                      </span>
                      <p className="text-xs sm:text-[13.5px] text-[#102D52] font-medium">
                        {content.contact.operatingHours}
                      </p>
                      <span className="text-[11px] text-[#526783] block mt-0.5">Survei akhir pekan dengan perjanjian awal</span>
                    </div>
                  )}
                </div>

                {/* Pendampingan Survei Note */}
                <div className="pt-4 border-l-4 border-[#073B78] bg-white rounded-r-xl p-4 space-y-1">
                  <div className="text-xs font-semibold text-[#073B78]">
                    Pendampingan survei gratis
                  </div>
                  <p className="text-xs text-[#526783] leading-relaxed">
                    Survei lokasi Puri Gunung Langgar dapat dijadwalkan setiap hari dengan konfirmasi terlebih dahulu melalui WhatsApp.
                  </p>
                </div>
              </div>

              {/* Right Interactive Form */}
              <div className="lg:col-span-7 bg-[#F4F7FC] p-4 sm:p-7 lg:p-9 rounded-2xl border border-[#DCE7F5] shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-[#FF9D2E] font-semibold text-xs tracking-wider mb-2">
                    <span className="w-5 h-0.5 bg-[#FF9D2E] rounded-full" />
                    <span>Formulir pemesanan</span>
                  </div>
                  <h2 className="font-serif font-normal text-2xl sm:text-3xl text-[#102D52] mb-1.5">
                    Formulir Minat &amp; Pemesanan Unit
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[#526783]">
                    Silakan isi data diri Anda di bawah ini. Tim representatif kami akan segera menghubungi nomor Anda untuk memberikan jadwal survei atau detail berkas KPR.
                  </p>
                </div>

                {formSuccess ? (
                  <div className="p-8 rounded-2xl bg-[#E6F7F3] border border-[#15966A]/30 text-[#102D52] text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-[#15966A]" />
                    <div className="text-base font-semibold text-[#15966A]">Pesan Anda Berhasil Terkirim</div>
                    <p className="text-xs sm:text-sm text-[#526783] max-w-md mx-auto">
                      Terima kasih atas ketertarikan Anda. Tim pemasaran PT. Terbang Bersama Kawan akan segera menghubungi nomor WhatsApp Anda.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSuccess(false)}
                      className="mt-3 px-6 py-2.5 rounded-full bg-[#073B78] hover:bg-[#1C5795] text-white font-semibold text-xs transition-colors"
                    >
                      Kirim pertanyaan lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {formError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="kontak-name" className="block text-xs font-semibold text-[#102D52] mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        id="kontak-name"
                        type="text"
                        required
                        placeholder="Masukkan nama lengkap Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-[46px] px-4 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/50 focus:outline-none focus:border-[#073B78] focus:ring-1 focus:ring-[#073B78] text-xs sm:text-sm transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="kontak-phone" className="block text-xs font-semibold text-[#102D52] mb-1.5">
                          Nomor WhatsApp *
                        </label>
                        <input
                          id="kontak-phone"
                          type="tel"
                          required
                          placeholder="Contoh: 0812xxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/50 focus:outline-none focus:border-[#073B78] focus:ring-1 focus:ring-[#073B78] text-xs sm:text-sm transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="kontak-email" className="block text-xs font-semibold text-[#102D52] mb-1.5">
                          Alamat Email (Opsional)
                        </label>
                        <input
                          id="kontak-email"
                          type="email"
                          placeholder="nama@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/50 focus:outline-none focus:border-[#073B78] focus:ring-1 focus:ring-[#073B78] text-xs sm:text-sm transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="kontak-message" className="block text-xs font-semibold text-[#102D52] mb-1.5">
                        Pesan atau Minat Khusus
                      </label>
                      <textarea
                        id="kontak-message"
                        rows={4}
                        placeholder="Tuliskan pertanyaan mengenai kavling yang diminati, estimasi cicilan KPR, atau jadwal yang diinginkan untuk survei lokasi..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-4 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/50 focus:outline-none focus:border-[#073B78] focus:ring-1 focus:ring-[#073B78] text-xs sm:text-sm transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="group w-full h-[48px] rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] font-semibold text-sm shadow-md transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formSubmitting ? (
                        <span>Mengirim data...</span>
                      ) : (
                        <>
                          <span>Kirim formulir minat</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
