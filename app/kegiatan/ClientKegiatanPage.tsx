'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { SiteContent, initialSiteContent, getYouTubeEmbedUrl } from '@/lib/initialData';
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

  const safeContent = content || initialSiteContent;
  const activities = safeContent?.activities || initialSiteContent.activities;
  const rawActivities = Array.isArray(activities?.items) ? activities.items : [];

  const filteredItems = filterTag === 'all'
    ? rawActivities
    : rawActivities.filter((item) => (item?.tag || '').toLowerCase().includes(filterTag.toLowerCase()));

  // Dynamically collect unique tags for filters
  const uniqueTags = Array.from(new Set(rawActivities.map((i) => i?.tag).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#262722] flex flex-col font-sans selection:bg-[#C5A568] selection:text-[#262722]">
      <Header content={safeContent} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#262722] text-[#F3EFE6] pt-12 pb-16 px-4 border-b border-white/[0.08] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#F3EFE6]/60 mb-6">
              <Link href="/" className="hover:text-[#C5A568] transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-[#C5A568] font-semibold">Dokumentasi Lapangan</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/[0.06] border border-white/10 text-[#C5A568] text-[11px] font-semibold uppercase tracking-wider">
                <HardHat className="w-3.5 h-3.5" />
                <span>{activities?.badge || 'AKTIVITAS & PROGRES PROYEK'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3EFE6] leading-tight">
                {activities?.title || 'Dokumentasi Pekerjaan Lapangan'}
              </h1>
              <p className="text-[#F3EFE6]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {activities?.subtitle || 'Transparansi tahapan konstruksi fisik di Puri Gunung Langgar, Desa Sabah Balau, Tanjung Bintang, Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Filter Tabs & Content Section: Open Editorial Grid */}
        <section className="py-16 sm:py-20">
          <div className="container-editorial space-y-10">
            {/* Filter Buttons */}
            {rawActivities.length > 0 && uniqueTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-b border-[#DDD8CE] pb-6">
                <button
                  type="button"
                  onClick={() => setFilterTag('all')}
                  className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
                    filterTag === 'all'
                      ? 'bg-[#262722] text-[#F3EFE6]'
                      : 'bg-white/60 hover:bg-white text-[#262722] border border-[#DDD8CE]'
                  }`}
                >
                  Semua ({rawActivities.length})
                </button>
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFilterTag(tag)}
                    className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
                      filterTag === tag
                        ? 'bg-[#262722] text-[#F3EFE6]'
                        : 'bg-white/60 hover:bg-white text-[#262722] border border-[#DDD8CE]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Activities Grid: Open Photographic Layout */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredItems.map((item, idx) => {
                  const hasImage = item.image && item.image.trim() !== '';
                  const hasVideo = !!item.videoUrl && item.videoUrl.trim() !== '';
                  return (
                    <div
                      key={idx}
                      className="group space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {hasImage ? (
                          <div
                            onClick={() =>
                              setLightbox({
                                open: true,
                                image: item.image,
                                caption: `${item.title} (${item.tag || `Tahap 0${idx + 1}`}) - Puri Gunung Langgar`,
                              })
                            }
                            className="relative h-60 rounded-[12px] overflow-hidden border border-[#DDD8CE] bg-[#262722] cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="px-3 py-1.5 rounded-[8px] bg-[#262722]/80 backdrop-blur-md text-[#F3EFE6] text-xs font-medium flex items-center gap-1.5 border border-white/20">
                                <Maximize2 className="w-3.5 h-3.5 text-[#C5A568]" />
                                <span>Perbesar Foto</span>
                              </span>
                            </div>
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-[4px] bg-[#262722]/80 backdrop-blur-sm text-[#F3EFE6] text-[11px] font-semibold">
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
                                className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-[4px] bg-[#262722]/85 text-[#C5A568] border border-[#C5A568]/40 text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
                              >
                                <Play className="w-3 h-3 fill-[#C5A568]" />
                                <span>Video</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="relative h-40 rounded-[12px] border border-[#DDD8CE] bg-white/40 flex items-center justify-between px-6">
                            <span className="px-2.5 py-1 rounded-[4px] bg-[#262722] text-[#C5A568] text-xs font-semibold">
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
                                className="px-2.5 py-1 rounded-[6px] bg-[#262722] text-[#C5A568] border border-[#C5A568]/40 text-xs font-semibold flex items-center gap-1.5 shadow"
                              >
                                <Play className="w-3 h-3 fill-[#C5A568]" />
                                <span>Putar Video</span>
                              </button>
                            ) : (
                              <HardHat className="w-8 h-8 text-[#77766F]/50" />
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <h3 className="font-serif text-xl text-[#262722] group-hover:text-[#C5A568] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#77766F] leading-relaxed">
                            {item.description}
                          </p>

                          <div className="space-y-1.5 text-xs text-[#77766F] pt-2 border-t border-[#DDD8CE]">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#C5A568] shrink-0" />
                              <span>Sesuai standar teknis perumahan PUPR</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#C5A568] shrink-0" />
                              <span>Pengawasan mutu langsung tim teknis perseroan</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#DDD8CE] flex flex-wrap items-center justify-between gap-2">
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
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#262722] hover:text-[#C5A568] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 text-[#C5A568]" />
                            <span>Tonton Video</span>
                          </button>
                        )}
                        <Link
                          href="/kontak"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#262722] hover:text-[#C5A568] transition-colors ml-auto"
                        >
                          <span>Survei Lokasi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 border border-dashed border-[#DDD8CE] rounded-[12px]">
                <HardHat className="w-10 h-10 text-[#77766F]/50 mx-auto" />
                <h3 className="font-serif text-lg text-[#262722]">Belum Ada Dokumentasi Kegiatan</h3>
                <p className="text-xs sm:text-sm text-[#77766F] max-w-md mx-auto">
                  Dokumentasi kegiatan dan tahapan fisik sedang diperbarui. Anda dapat menambahkan kegiatan melalui Admin Panel.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner: Charcoal Editorial Section */}
        <section className="py-16 sm:py-20 bg-[#262722] text-[#F3EFE6]">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F3EFE6] max-w-xl mx-auto">
              Ingin Melihat Langsung Lapangan?
            </h2>
            <p className="text-[#F3EFE6]/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Kunjungi lokasi proyek Puri Gunung Langgar di Desa Sabah Balau, Tanjung Bintang didampingi staf resmi kami.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[#C5A568] hover:bg-[#B69455] text-[#262722] text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-[1.5px] active:scale-[0.99]"
              >
                <span>Hubungi Kami untuk Jadwal Survei</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
