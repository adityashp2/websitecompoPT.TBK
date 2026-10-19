import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Kontak & Kantor Pemasaran Resmi | PT. Terbang Bersama Kawan',
  description: 'Hubungi tim pemasaran resmi PT. Terbang Bersama Kawan. Kunjungi kantor pemasaran perumahan Puri Gunung Langgar di Sabah Balau, Tanjung Bintang, Lampung Selatan. Konsultasi dan survei lokasi gratis.',
  keywords: [
    'Kontak PT Terbang Bersama Kawan',
    'Kantor Pemasaran Puri Gunung Langgar',
    'Marketing Rumah Subsidi Lampung',
    'Nomor WhatsApp PT TBK',
    'Lokasi Perumahan Tanjung Bintang Lampung'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id/kontak',
  },
  openGraph: {
    title: 'Kontak & Kantor Pemasaran Resmi | PT. Terbang Bersama Kawan',
    description: 'Hubungi marketing resmi PT. TBK untuk info promo subsidi, konsultasi berkas KPR, dan survei lokasi langsung ke Puri Gunung Langgar.',
    url: 'https://terbangbersamakawan.co.id/kontak',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
