import React from 'react';
import { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import { initialSiteContent } from '@/lib/initialData';
import ClientLegalitasArchive from './ClientLegalitasArchive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Legalitas & Dokumen Resmi Perseroan | The Corporate Archive | PT. Terbang Bersama Kawan',
  description: 'Arsip legalitas resmi PT. Terbang Bersama Kawan: Akta Notaris No. 10, SK Pengesahan Kemenkumham RI AHU-0016462.AH.01.01.TAHUN 2021, kepastian alas hak tanah SHM Puri Gunung Langgar, dan jaminan perlindungan konsumen.',
  openGraph: {
    title: 'Legalitas & Dokumen Resmi Perseroan | PT. Terbang Bersama Kawan',
    description: 'Arsip otentik badan hukum perseroan dan kepastian legalitas perumahan bersubsidi di Lampung.',
  },
};

export default function LegalitasPage() {
  let content = initialSiteContent;
  try {
    const fetched = getSiteContent();
    if (fetched) content = fetched;
  } catch (err) {
    console.error('Failed to getSiteContent on LegalitasPage:', err);
  }

  return <ClientLegalitasArchive content={content} />;
}
