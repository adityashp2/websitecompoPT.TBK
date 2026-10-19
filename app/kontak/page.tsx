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
    fetch('/api/content', { cache: 'no-store' })
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
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={content} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#000000] text-white pt-20 pb-24 px-6 border-b border-[#262626] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-[#999999] mb-8">
              <Link href="/" className="hover:text-white transition-colors">BERANDA</Link>
              <span>/</span>
              <span className="text-white">KONTAK &amp; KONSULTASI</span>
            </nav>

            <div className="max-w-4xl space-y-5">
              <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[#262626] text-white inline-block">
                {content.contact.badge || 'HUBUNGI PERSEROAN'}
              </span>
              <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[70px] uppercase tracking-[3px] text-white leading-[1.08]">
                {content.contact.title || 'Layanan Konsultasi & Pemesanan'}
              </h1>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl pt-2">
                {content.contact.subtitle || 'Konsultasikan rencana kepemilikan hunian subsidi Anda. Tim representatif kami siap memberikan penjelasan lengkap serta pendampingan survei lokasi.'}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 sm:py-32 bg-[#000000]">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Contact Information */}
              <div className="lg:col-span-5 card-bugatti p-8 sm:p-10 space-y-8">
                <div>
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                    INFORMASI KONTAK
                  </span>
                  <h2 className="font-display font-normal text-2xl sm:text-4xl uppercase tracking-[2px] text-white">
                    Kantor Pemasaran
                  </h2>
                </div>

                <div className="divide-y divide-[#262626]">
                  {content.contact?.address && content.contact.address.trim() !== '' && (
                    <div className="py-5 first:pt-0">
                      <span className="font-mono text-xs text-[#999999] tracking-[2px] uppercase block mb-1">
                        LOKASI KANTOR
                      </span>
                      <p className="font-serif text-white text-base leading-relaxed">
                        {content.contact.address}
                      </p>
                    </div>
                  )}

                  {hasWa && (
                    <div className="py-5">
                      <span className="font-mono text-xs text-[#999999] tracking-[2px] uppercase block mb-2">
                        WHATSAPP RESMI
                      </span>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-bugatti-primary w-full justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{content.contact.whatsapp}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {content.contact?.email && content.contact.email.trim() !== '' && (
                    <div className="py-5">
                      <span className="font-mono text-xs text-[#999999] tracking-[2px] uppercase block mb-1">
                        SURAT ELEKTRONIK
                      </span>
                      <p className="font-mono text-sm text-white">
                        {content.contact.email}
                      </p>
                    </div>
                  )}

                  {content.contact?.operatingHours && content.contact.operatingHours.trim() !== '' && (
                    <div className="py-5">
                      <span className="font-mono text-xs text-[#999999] tracking-[2px] uppercase block mb-1">
                        JAM PELAYANAN
                      </span>
                      <p className="font-serif text-white text-sm">
                        {content.contact.operatingHours}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pendampingan Survei Note */}
                <div className="p-5 border border-[#262626] bg-[#0d0d0d] space-y-2">
                  <div className="font-mono text-xs tracking-[2px] uppercase text-white">
                    SURVEI KAVLING LANGSUNG
                  </div>
                  <p className="font-serif text-xs text-[#999999] leading-relaxed">
                    Survei lokasi Puri Gunung Langgar dapat dijadwalkan setiap hari dengan konfirmasi terlebih dahulu melalui WhatsApp.
                  </p>
                </div>
              </div>

              {/* Right Interactive Form (Bugatti Underline-Only Inputs) */}
              <div className="lg:col-span-7 card-bugatti p-8 sm:p-12 space-y-8">
                <div>
                  <span className="font-mono text-xs tracking-[2.5px] uppercase text-[#999999] block mb-2">
                    FORMULIR PEMESANAN
                  </span>
                  <h2 className="font-display font-normal text-2xl sm:text-4xl uppercase tracking-[2px] text-white">
                    Minat &amp; Penjadwalan Survei
                  </h2>
                  <p className="font-serif text-sm text-[#999999] mt-2">
                    Silakan isi data diri Anda. Tim perwakilan kami akan segera menghubungi nomor Anda untuk konfirmasi jadwal survei atau detail berkas KPR.
                  </p>
                </div>

                {formSuccess ? (
                  <div className="p-8 bg-[#0d0d0d] border border-[#262626] text-center space-y-4">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-white" />
                    <div className="font-display uppercase tracking-[2px] text-xl text-white">Pesan Anda Berhasil Terkirim</div>
                    <p className="font-serif text-sm text-[#999999] max-w-md mx-auto">
                      Terima kasih atas ketertarikan Anda. Tim pemasaran PT. Terbang Bersama Kawan akan segera menghubungi nomor WhatsApp Anda.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSuccess(false)}
                      className="btn-bugatti-primary text-xs"
                    >
                      KIRIM PESAN LAIN
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-6">
                    {formError && (
                      <div className="p-4 border border-red-500/40 bg-red-950/20 text-red-400 font-mono text-xs tracking-[1px] uppercase">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="kontak-name" className="block font-mono text-xs tracking-[2px] uppercase text-[#999999] mb-1">
                        NAMA LENGKAP *
                      </label>
                      <input
                        id="kontak-name"
                        type="text"
                        required
                        placeholder="MASUKKAN NAMA LENGKAP"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-bugatti w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="kontak-phone" className="block font-mono text-xs tracking-[2px] uppercase text-[#999999] mb-1">
                          NOMOR WHATSAPP *
                        </label>
                        <input
                          id="kontak-phone"
                          type="tel"
                          required
                          placeholder="CONTOH: 0812XXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input-bugatti w-full font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="kontak-email" className="block font-mono text-xs tracking-[2px] uppercase text-[#999999] mb-1">
                          EMAIL (OPSIONAL)
                        </label>
                        <input
                          id="kontak-email"
                          type="email"
                          placeholder="NAMA@EMAIL.COM"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-bugatti w-full font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="kontak-message" className="block font-mono text-xs tracking-[2px] uppercase text-[#999999] mb-1">
                        PESAN ATAU PERTANYAAN
                      </label>
                      <textarea
                        id="kontak-message"
                        rows={4}
                        placeholder="TULISKAN PERTANYAAN KETERSEDIAAN KAVLING, SYARAT KPR, ATAU RENCANA TANGGAL SURVEI..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3 bg-transparent border-b border-[#3a3a3a] focus:border-white text-white font-serif text-sm outline-none resize-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full btn-bugatti-primary justify-center"
                    >
                      {formSubmitting ? (
                        <span>MENGIRIMKAN DATA...</span>
                      ) : (
                        <>
                          <span>KIRIM FORMULIR PEMINATAN</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
