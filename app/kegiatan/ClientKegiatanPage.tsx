'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import LookbookModal, { LookbookItem } from '../components/LookbookModal';
import { SiteContent, initialSiteContent, getYouTubeEmbedUrl } from '@/lib/initialData';
import { 
  Maximize2, 
  X, 
  ArrowRight, 
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
    <div className="min-h-screen bg-[#000000] text-[#cccccc] flex flex-col font-serif selection:bg-white selection:text-black">
      <Header content={safeContent} />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="bg-[#000000] text-white pt-20 pb-24 px-6 border-b border-[#262626] relative overflow-hidden">
          <div className="container-editorial relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-[#999999] mb-8">
              <Link href="/" className="hover:text-white transition-colors">BERANDA</Link>
              <span>/</span>
              <span className="text-white">DOKUMENTASI LAPANGAN</span>
            </nav>

            <div className="max-w-4xl space-y-5">
              <span className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border border-[#262626] text-white inline-block">
                {activities?.badge || 'AKTIVITAS &amp; PROGRES PROYEK'}
              </span>
              <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[70px] uppercase tracking-[3px] text-white leading-[1.08]">
                {activities?.title || 'Dokumentasi Pekerjaan Lapangan'}
              </h1>
              <p className="font-serif text-[#cccccc] text-base sm:text-lg leading-relaxed max-w-2xl pt-2">
                {activities?.subtitle || 'Transparansi tahapan konstruksi fisik di Puri Gunung Langgar, Desa Sabah Balau, Tanjung Bintang, Lampung Selatan.'}
              </p>
            </div>
          </div>
        </section>

        {/* Filter Tabs & Content Section */}
        <section className="py-24 sm:py-32 bg-[#000000]">
          <div className="container-editorial space-y-12">
            {/* Filter Buttons (Bugatti Monospace Outlined Tabs) */}
            {rawActivities.length > 0 && uniqueTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 border-b border-[#262626] pb-8">
                <button
                  type="button"
                  onClick={() => setFilterTag('all')}
                  className={`px-5 py-2 font-mono text-xs tracking-[2px] uppercase transition-all rounded-full border ${
                    filterTag === 'all'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-[#999999] border-[#262626] hover:border-white hover:text-white'
                  }`}
                >
                  SEMUA ({rawActivities.length})
                </button>
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFilterTag(tag)}
                    className={`px-5 py-2 font-mono text-xs tracking-[2px] uppercase transition-all rounded-full border ${
                      filterTag === tag
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-[#999999] border-[#262626] hover:border-white hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Activities Grid (Bugatti Newsroom Article Cards) */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, idx) => {
                  const hasImage = item.image && item.image.trim() !== '';
                  const hasVideo = !!item.videoUrl && item.videoUrl.trim() !== '';
                  return (
                    <div
                      key={idx}
                      className="card-bugatti overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        {hasImage && (
                          <div
                            onClick={() =>
                              setLightbox({
                                open: true,
                                currentIndex: idx,
                                items: filteredLookbookItems,
                              })
                            }
                            className="relative aspect-[16/10] bg-black overflow-hidden cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute top-3 left-3 bg-black/80 font-mono text-[9px] tracking-[2px] uppercase px-2.5 py-1 border border-[#262626] text-white">
                              {item.tag || `TAHAP 0${idx + 1}`}
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
                                className="absolute top-3 right-3 z-10 px-3 py-1 bg-black/80 text-white border border-[#262626] hover:border-white font-mono text-[9px] tracking-[2px] uppercase flex items-center gap-1.5 transition-colors"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>VIDEO</span>
                              </button>
                            )}
                          </div>
                        )}

                        <div className="p-6 space-y-3">
                          <h3 className="font-display font-normal text-xl uppercase tracking-[1.5px] text-white group-hover:text-white/80 transition-colors">
                            {item.title}
                          </h3>
                          <p className="font-serif text-sm text-[#999999] leading-relaxed line-clamp-3">
                            {item.description}
                          </p>

                          <div className="pt-3 border-t border-[#262626] font-mono text-[10px] tracking-[1.5px] uppercase text-[#666666]">
                            STANDAR PENGAWASAN MUTU PUPR
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0 flex items-center justify-between">
                        <Link
                          href="/kontak"
                          className="font-mono text-xs tracking-[2px] uppercase text-[#c3d9f3] hover:text-white inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>SURVEI LAPANGAN</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card-bugatti p-16 text-center space-y-3">
                <h3 className="font-display uppercase tracking-[2px] text-xl text-white">Tidak Ada Dokumentasi</h3>
                <p className="font-serif text-sm text-[#999999]">Pilih kategori lain untuk melihat dokumentasi.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Video Modal Overlay */}
      {videoModal.open && (
        <div className="fixed inset-0 z-[100060] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#0d0d0d] border border-[#262626] overflow-hidden">
            <div className="p-4 border-b border-[#262626] flex items-center justify-between">
              <span className="font-mono text-xs tracking-[2px] uppercase text-white truncate max-w-md">{videoModal.title}</span>
              <button
                type="button"
                onClick={() => setVideoModal({ open: false, url: '', title: '' })}
                className="w-8 h-8 rounded-full border border-[#262626] hover:border-white text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {getYouTubeEmbedUrl(videoModal.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(videoModal.url, { autoplay: true })!}
                  title={videoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={videoModal.url} autoPlay controls className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lookbook Modal */}
      <LookbookModal
        isOpen={lightbox.open}
        onClose={() => setLightbox((prev) => ({ ...prev, open: false }))}
        items={lightbox.items}
        currentIndex={lightbox.currentIndex}
        onIndexChange={(idx) => setLightbox((prev) => ({ ...prev, currentIndex: idx }))}
        projectName={content.project?.name || 'Puri Gunung Langgar'}
        whatsappNumber={content.contact?.whatsapp || ''}
      />

      <Footer content={safeContent} />
      <FloatingWhatsApp content={safeContent} />
    </div>
  );
}
