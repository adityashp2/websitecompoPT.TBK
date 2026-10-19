import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/db';
import ClientLandingPage from './components/ClientLandingPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'PT. Terbang Bersama Kawan (PT. TBK) | Rumah Subsidi Berkualitas di Lampung',
  description: 'Website resmi PT. Terbang Bersama Kawan (PT. TBK). Pengembang perumahan bersubsidi Puri Gunung Langgar di Tanjung Bintang, Lampung Selatan. Angsuran KPR FLPP 1 jutaan flat, lokasi strategis bebas banjir, dan legalitas SHM terjamin.',
  keywords: [
    'PT Terbang Bersama Kawan',
    'PT TBK',
    'Rumah Subsidi Lampung',
    'Puri Gunung Langgar',
    'Perumahan Subsidi Tanjung Bintang',
    'Rumah Murah Bandar Lampung',
    'KPR FLPP Lampung',
    'Developer Properti Terpercaya Lampung'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id',
  },
  openGraph: {
    title: 'PT. Terbang Bersama Kawan (PT. TBK) | Rumah Subsidi Berkualitas di Lampung',
    description: 'Pengembang perumahan bersubsidi resmi berizin Kemenkumham di Lampung. Dapatkan unit Puri Gunung Langgar dengan angsuran mulai 1 jutaan/bulan.',
    url: 'https://terbangbersamakawan.co.id',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
};

export default async function HomePage() {
  const content = await getSiteContent();
  return <ClientLandingPage initialContent={content} />;
}

