'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import LookbookModal, { LookbookItem } from '../components/LookbookModal';
import { SiteContent, initialSiteContent, getYouTubeEmbedUrl } from '@/lib/initialData';
import { 
  HardHat, 
  Maximize2, 
  X, 
  ArrowRight, 
  Check,
  Play
} from 'lucide-react';

export default function ClientKegiatanPage({ content }: { content: SiteContent }) {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    currentIndex: number;
    items: LookbookItem[];
  }>({
    open: false,
    currentIndex: 0,
    items: [],
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

  const filteredLookbookItems: LookbookItem[] = filteredItems.map((item, idx) => ({
    image: item.image,
    title: item.title,
    description: item.description,
    tag: item.tag || `Tahap 0${idx + 1}`,
    category: 'Dokumentasi Lapangan',
  }));

  const uniqueTags = Array.from(new Set(rawActivities.map((i) => i?.tag).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-white text-[#102D52] flex flex-col font-sans selection:bg-[#FF9D2E] selection:text-[#102D52]">
      <Header content={safeContent} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white pt-12 pb-16 px-4 border-b border-white/10 relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70 mb-6">
              <Link href="/" className="hover:text-[#FF9D2E] transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-[#FF9D2E] font-medium">Dokumentasi Lapangan</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF9D2E] text-xs font-medium">
                <HardHat className="w-3.5 h-3.5" />
                <span>{activities?.badge || 'Aktivitas & progres proyek'}</span>
              </div>
              <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {activities?.title || 'Dokumentasi Pekerjaan Lapangan'}
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-2xl">
                {activities?.subtitle || 'Transparansi tahapan konstruksi fisik di Puri Gunung Langgar, Desa Sabah Balau, Tanjung Bintang, Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Filter Tabs & Content Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-editorial space-y-10">
            {/* Filter Buttons */}
            {rawActivities.length > 0 && uniqueTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE7F5] pb-6">
                <button
                  type="button"
                  onClick={() => setFilterTag('all')}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    filterTag === 'all'
                      ? 'bg-[#073B78] text-white shadow-sm'
                      : 'bg-[#F4F7FC] hover:bg-[#DCE7F5] text-[#526783] border border-[#DCE7F5]'
                  }`}
                >
                  Semua ({rawActivities.length})
                </button>
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFilterTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      filterTag === tag
                        ? 'bg-[#073B78] text-white shadow-sm'
                        : 'bg-[#F4F7FC] hover:bg-[#DCE7F5] text-[#526783] border border-[#DCE7F5]'
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
                      className="group space-y-4 flex flex-col justify-between bg-[#F4F7FC] p-5 rounded-2xl border border-[#DCE7F5] shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="space-y-4">
                        {hasImage ? (
                          <div
                            onClick={() =>
                              setLightbox({
                                open: true,
                                currentIndex: idx,
                                items: filteredLookbookItems,
                              })
                            }
                            className="relative h-60 rounded-xl overflow-hidden border border-[#DCE7F5] bg-[#073B78] cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="px-3.5 py-1.5 rounded-full bg-[#102D52]/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                                <Maximize2 className="w-3.5 h-3.5 text-[#FF9D2E]" />
                                <span>Perbesar Foto</span>
                              </span>
                            </div>
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#073B78]/90 backdrop-blur-sm text-white text-[11px] font-semibold">
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
                                className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-[#102D52]/90 text-[#FF9D2E] border border-[#FF9D2E]/50 text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
                              >
                                <Play className="w-3 h-3 fill-[#FF9D2E]" />
                                <span>Video</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="relative h-40 rounded-xl border border-[#DCE7F5] bg-white flex items-center justify-between px-6">
                            <span className="px-3 py-1 rounded-full bg-[#073B78] text-white text-xs font-semibold">
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
                                className="px-3 py-1.5 rounded-full bg-[#FF9D2E] text-[#102D52] font-semibold text-xs flex items-center gap-1.5 shadow"
                              >
                                <Play className="w-3.5 h-3.5 fill-[#102D52]" />
                                <span>Putar Video</span>
                              </button>
                            ) : (
                              <HardHat className="w-8 h-8 text-[#526783]/50" />
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-[#102D52] group-hover:text-[#073B78] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-[13px] text-[#526783] leading-relaxed">
                            {item.description}
                          </p>

                          <div className="space-y-1.5 text-xs text-[#526783] pt-2 border-t border-[#DCE7F5]">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#15966A] shrink-0 font-bold" />
                              <span>Sesuai standar teknis perumahan PUPR</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#15966A] shrink-0 font-bold" />
                              <span>Pengawasan mutu langsung tim teknis perseroan</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#DCE7F5] flex flex-wrap items-center justify-between gap-2">
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
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#073B78] hover:text-[#FF9D2E] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 text-[#FF9D2E]" />
                            <span>Tonton Video</span>
                          </button>
                        )}
                        <Link
                          href="/kontak"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#073B78] hover:text-[#FF9D2E] transition-colors ml-auto"
                        >
                          <span>Survei lokasi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 border border-dashed border-[#DCE7F5] rounded-2xl">
                <HardHat className="w-10 h-10 text-[#526783]/50 mx-auto" />
                <h3 className="font-semibold text-lg text-[#102D52]">Belum Ada Dokumentasi Kegiatan</h3>
                <p className="text-xs sm:text-sm text-[#526783] max-w-md mx-auto">
                  Dokumentasi kegiatan dan tahapan fisik sedang diperbarui.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] text-white">
          <div className="container-editorial text-center space-y-6">
            <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-4xl text-white max-w-xl mx-auto leading-tight">
              Ingin Melihat Langsung Lapangan?
            </h2>
            <p className="text-white/85 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Kunjungi lokasi proyek Puri Gunung Langgar di Desa Sabah Balau, Tanjung Bintang didampingi staf resmi kami.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9D2E] hover:bg-[#F28A17] text-[#102D52] text-sm font-semibold transition-all duration-200 hover:-translate-y-[1px] shadow-lg"
              >
                <span>Hubungi kami untuk jadwal survei</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Lookbook Modal */}
      <LookbookModal
        isOpen={lightbox.open}
        onClose={() => setLightbox((prev) => ({ ...prev, open: false }))}
        items={lightbox.items}
        currentIndex={lightbox.currentIndex}
        onIndexChange={(newIndex) =>
          setLightbox((prev) => ({ ...prev, currentIndex: newIndex }))
        }
        projectName={safeContent.project?.name || 'Puri Gunung Langgar'}
        whatsappNumber={safeContent.contact?.whatsapp || ''}
      />

      {/* Video Modal */}
      {videoModal.open && (
        <div
          className="fixed inset-0 z-50 bg-[#071C38]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setVideoModal({ open: false, url: '', title: '' })}
        >
          <div
            className="relative max-w-4xl w-full bg-[#102D52] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoModal({ open: false, url: '', title: '' })}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-[#FF9D2E] hover:text-[#102D52] text-white flex items-center justify-center transition-colors"
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
            <div className="p-4 bg-[#073B78] text-white text-xs sm:text-sm border-t border-white/10 flex items-center justify-between">
              <span className="font-semibold text-white">{videoModal.title}</span>
              <span className="text-[#FF9D2E] font-bold shrink-0 ml-4">Video Lapangan PT. TBK</span>
            </div>
          </div>
        </div>
      )}

      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </div>
  );
}
