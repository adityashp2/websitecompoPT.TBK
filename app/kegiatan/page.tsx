import React from 'react';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import { initialSiteContent } from '@/lib/initialData';
import ClientKegiatanPage from './ClientKegiatanPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dokumentasi Lapangan & Progres | PT. Terbang Bersama Kawan',
  description: 'Dokumentasi tahapan pembangunan fisik perumahan subsidi Puri Gunung Langgar oleh PT. Terbang Bersama Kawan di Desa Sabah Balau, Tanjung Bintang, Lampung Selatan.',
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
