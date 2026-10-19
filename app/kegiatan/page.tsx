import React from 'react';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import { initialSiteContent } from '@/lib/initialData';
import ClientKegiatanPage from './ClientKegiatanPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Progres Pembangunan & Dokumentasi Lapangan | PT. Terbang Bersama Kawan',
  description: 'Galeri dokumentasi tahapan pembangunan fisik perumahan subsidi Puri Gunung Langgar oleh developer PT. Terbang Bersama Kawan di Desa Sabah Balau, Tanjung Bintang, Lampung Selatan.',
  keywords: [
    'Progres Proyek Puri Gunung Langgar',
    'Foto Lapangan PT TBK',
    'Pembangunan Rumah Subsidi Lampung',
    'Dokumentasi Puri Gunung Langgar Lampung'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id/kegiatan',
  },
  openGraph: {
    title: 'Dokumentasi & Progres Lapangan | PT. Terbang Bersama Kawan',
    description: 'Bukti transparansi dan komitmen pembangunan fisik perumahan subsidi di Lampung Selatan.',
    url: 'https://terbangbersamakawan.co.id/kegiatan',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
};

export default async function KegiatanPage() {
  let content = initialSiteContent;
  try {
    const fetched = await getSiteContent();
    if (fetched) content = fetched;
  } catch (err) {
    console.error('Failed to getSiteContent on KegiatanPage:', err);
  }
  return <ClientKegiatanPage content={content} />;
}
