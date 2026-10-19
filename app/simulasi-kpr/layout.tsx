import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Simulasi KPR FLPP Rumah Subsidi Lampung | Bunga 5% Flat - PT. TBK',
  description: 'Kalkulator hitung estimasi angsuran bulanan KPR subsidi FLPP bunga 5% flat hingga 20 tahun untuk perumahan Puri Gunung Langgar PT. Terbang Bersama Kawan di Lampung.',
  keywords: [
    'Simulasi KPR FLPP Lampung',
    'Kalkulator KPR Rumah Subsidi',
    'Angsuran Rumah Subsidi Puri Gunung Langgar',
    'KPR Bunga 5 Persen Flat',
    'KPR BTN Subsidi Lampung',
    'KPR BSI Rumah Subsidi Lampung'
  ],
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id/simulasi-kpr',
  },
  openGraph: {
    title: 'Simulasi KPR FLPP Rumah Subsidi Lampung | Bunga 5% Tetap - PT. TBK',
    description: 'Hitung estimasi cicilan rumah impian Anda mulai 1 jutaan/bulan dengan bunga subsidi FLPP 5% tetap sampai lunas.',
    url: 'https://terbangbersamakawan.co.id/simulasi-kpr',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    type: 'website',
  },
};

export default function SimulasiKprLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
