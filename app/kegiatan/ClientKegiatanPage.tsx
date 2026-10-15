'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { SiteContent, getYouTubeEmbedUrl } from '@/lib/initialData';
import { 
  HardHat, 
  Maximize2, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  X, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Check,
  ImageIcon,
  Play,
  Video,
  Film
} from 'lucide-react';

export default function ClientKegiatanPage({ content }: { content: SiteContent }) {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [lightbox, setLightbox] = useState<{ open: boolean; image: string; caption: string }>({
    open: false,
    image: '',
    caption: '',
  });
  const [videoModal, setVideoModal] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: '',
    title: '',
  });

  const rawActivities = content.activities?.items || [];

  const filteredItems = filterTag === 'all'
    ? rawActivities
    : rawActivities.filter((item) => (item.tag || '').toLowerCase().includes(filterTag.toLowerCase()));

  // Dynamically collect unique tags for filters
  const uniqueTags = Array.from(new Set(rawActivities.map(i => i.tag).filter(Boolean)));

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
              <span className="text-[#C9A96A] font-semibold">Dokumentasi Lapangan</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-[#C9A96A]/40 text-[#C9A96A] text-xs font-bold uppercase tracking-wider">
                <HardHat className="w-3.5 h-3.5" />
                <span>{content.activities.badge || 'AKTIVITAS & PROGRES PROYEK'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight">
                {content.activities.title || 'Dokumentasi Pekerjaan Lapangan'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content.activities.subtitle || 'Transparansi tahapan konstruksi fisik di Puri Gunung Langgar, Desa Sabah Balau, Tanjung Bintang, Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Filter Tabs & Content Section */}
        <section className="py-12 sm:py-16">
          <div className="container-std max-w-[1120px] mx-auto space-y-8">
            {/* Filter Buttons */}
            {rawActivities.length > 0 && uniqueTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setFilterTag('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterTag === 'all'
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-amber-500/30'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  Semua ({rawActivities.length})
                </button>
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFilterTag(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filterTag === tag
                        ? 'bg-slate-900 text-white shadow-sm ring-2 ring-amber-500/30'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Activities Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, idx) => {
                  const hasImage = item.image && item.image.trim() !== '';
                  const hasVideo = !!item.videoUrl && item.videoUrl.trim() !== '';
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C9A96A] transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {hasImage ? (
                          <div
                            onClick={() =>
                              setLightbox({
                                open: true,
                                image: item.image,
                                caption: `${item.title} (${item.tag || `Tahap 0${idx + 1}`}) - Puri Gunung Langgar`,
                              })
                            }
                            className="relative h-56 overflow-hidden bg-slate-950 cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 border border-white/20">
                                <Maximize2 className="w-3.5 h-3.5 text-[#C9A96A]" />
                                <span>Perbesar Foto</span>
                              </span>
                            </div>
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm text-white text-xs font-semibold">
                              {item.tag || `Tahap 0${idx + 1}`}
                            </div>
                            {hasVideo && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVideoModal({
                                    open: true,
                                    url: item.videoUrl!,
                                    title: `${item.title} (${item.tag || `Tahap 0${idx + 1}`})`,
                                  });
                                }}
                                className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-md transition-colors"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Video</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 border-b border-slate-200 flex items-center justify-between px-6">
                            <span className="px-3 py-1 rounded-md bg-slate-900 text-amber-400 text-xs font-semibold">
                              {item.tag || `Tahap 0${idx + 1}`}
                            </span>
                            {hasVideo ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setVideoModal({
                                    open: true,
                                    url: item.videoUrl!,
                                    title: `${item.title} (${item.tag || `Tahap 0${idx + 1}`})`,
                                  })
                                }
                                className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Putar Video</span>
                              </button>
                            ) : (
                              <HardHat className="w-8 h-8 text-slate-400" />
                            )}
                          </div>
                        )}

                        <div className="p-6 space-y-3">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-800 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Sesuai standar teknis perumahan PUPR</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Pengawasan mutu langsung tim teknis perseroan</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 space-y-2">
                        {hasVideo && (
                          <button
                            type="button"
                            onClick={() =>
                              setVideoModal({
                                open: true,
                                url: item.videoUrl!,
                                title: `${item.title} (${item.tag || `Tahap 0${idx + 1}`})`,
                              })
                            }
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-red-700" />
                            <span>Tonton Video Dokumentasi</span>
                          </button>
                        )}
                        <Link
                          href="/kontak"
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-[#C9A96A] hover:bg-amber-50 text-slate-800 text-xs font-bold transition-colors"
                        >
                          <span>Jadwalkan Survei Lapangan</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C9A96A]" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                <HardHat className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">Belum Ada Dokumentasi Kegiatan</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Dokumentasi kegiatan dan tahapan fisik sedang diperbarui. Anda dapat menambahkan kegiatan melalui Admin Panel.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-14 bg-[#0E1014] text-white">
          <div className="container-std max-w-[1120px] mx-auto text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EFE6]">
              Ingin Melihat Langsung Lapangan?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto">
              Kunjungi lokasi proyek Puri Gunung Langgar di Desa Sabah Balau, Tanjung Bintang didampingi staf resmi kami.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A96A] hover:bg-amber-500 text-[#0E1014] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Hubungi Kami untuk Jadwal Survei</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox({ open: false, image: '', caption: '' })}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox({ open: false, image: '', caption: '' })}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
              aria-label="Tutup foto"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={lightbox.image}
                alt={lightbox.caption}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-4 bg-slate-950 text-white text-xs sm:text-sm border-t border-white/10 flex items-center justify-between">
              <span>{lightbox.caption}</span>
              <span className="text-[#C9A96A] font-semibold shrink-0 ml-4">Dokumentasi PT. TBK</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setVideoModal({ open: false, url: '', title: '' })}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoModal({ open: false, url: '', title: '' })}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
              aria-label="Tutup video"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {getYouTubeEmbedUrl(videoModal.url) ? (
                <iframe
                  src={`${getYouTubeEmbedUrl(videoModal.url)}?autoplay=1`}
                  title={videoModal.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoModal.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="p-4 bg-slate-950 text-white text-xs sm:text-sm border-t border-white/10 flex items-center justify-between">
              <span className="font-semibold text-white">{videoModal.title}</span>
              <span className="text-[#C9A96A] font-semibold shrink-0 ml-4">Video Lapangan PT. TBK</span>
            </div>
          </div>
        </div>
      )}

      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
