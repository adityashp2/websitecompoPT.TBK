import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Serif_Display, DM_Sans, Cormorant_Garamond } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import RouteProgressBar from './components/RouteProgressBar';

const MobileBottomNav = dynamic(() => import('./components/MobileBottomNav'), { ssr: false });
const FloatingWhatsApp = dynamic(() => import('./components/FloatingWhatsApp'), { ssr: false });

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#073B78',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://terbangbersamakawan.co.id'),
  title: {
    default: 'PT. Terbang Bersama Kawan (PT. TBK) | Rumah Subsidi Lampung & Puri Gunung Langgar',
    template: '%s | PT. Terbang Bersama Kawan (PT. TBK)',
  },
  description: 'Website resmi PT. Terbang Bersama Kawan (PT. TBK), pengembang perumahan bersubsidi berkualitas dan terpercaya di Lampung. Menghadirkan proyek Puri Gunung Langgar di Tanjung Bintang, Lampung Selatan. Angsuran KPR FLPP mulai 1 jutaan flat, legalitas SHM aman & siap huni.',
  keywords: [
    'PT Terbang Bersama Kawan',
    'PT TBK',
    'PT TBK Lampung',
    'Puri Gunung Langgar',
    'Perumahan Puri Gunung Langgar',
    'Rumah Subsidi Lampung',
    'Rumah Subsidi Bandar Lampung',
    'Perumahan Subsidi Tanjung Bintang',
    'Rumah Murah Lampung Angsuran 1 Jutaan',
    'KPR FLPP Lampung 2026',
    'Pengembang Properti Lampung Terpercaya',
    'Developer Rumah Murah Lampung',
    'Perumahan Sabah Balau Lampung',
    'Rumah Subsidi Siap Huni Lampung',
    'KPR Subsidi Bank BTN BSI Lampung'
  ],
  authors: [{ name: 'PT. Terbang Bersama Kawan', url: 'https://terbangbersamakawan.co.id' }],
  creator: 'PT. Terbang Bersama Kawan',
  publisher: 'PT. Terbang Bersama Kawan',
  category: 'Real Estate',
  classification: 'Pengembang Perumahan Bersubsidi & Properti',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://terbangbersamakawan.co.id',
  },
  openGraph: {
    title: 'PT. Terbang Bersama Kawan (PT. TBK) | Rumah Subsidi Berkualitas Lampung',
    description: 'Pengembang perumahan bersubsidi terpercaya di Lampung. Proyek Puri Gunung Langgar Tanjung Bintang dengan sertifikat SHM, angsuran KPR FLPP flat 1 jutaan.',
    url: 'https://terbangbersamakawan.co.id',
    siteName: 'PT. Terbang Bersama Kawan (PT. TBK)',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/project-workspace.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawasan Perumahan Puri Gunung Langgar oleh PT. Terbang Bersama Kawan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT. Terbang Bersama Kawan (PT. TBK) | Rumah Subsidi Lampung',
    description: 'Pengembang perumahan bersubsidi resmi berizin Kemenkumham di Lampung. Angsuran mulai 1 jutaan/bulan.',
    images: ['/assets/project-workspace.jpg'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'RealEstateAgent'],
      '@id': 'https://terbangbersamakawan.co.id/#organization',
      name: 'PT. Terbang Bersama Kawan',
      legalName: 'PT TERBANG BERSAMA KAWAN',
      alternateName: ['PT. TBK', 'PT Terbang Bersama Kawan', 'Developer Puri Gunung Langgar'],
      url: 'https://terbangbersamakawan.co.id',
      logo: {
        '@type': 'ImageObject',
        url: 'https://terbangbersamakawan.co.id/assets/logo-tbk.png',
        caption: 'Logo Resmi PT. Terbang Bersama Kawan'
      },
      image: 'https://terbangbersamakawan.co.id/assets/project-workspace.jpg',
      description: 'Pengembang perumahan bersubsidi berkualitas dan terpercaya di Lampung. Menghadirkan proyek perumahan Puri Gunung Langgar di Tanjung Bintang, Lampung Selatan dengan legalitas sah dan standar mutu PUPR.',
      telephone: '+6281278901234',
      email: 'kontak@terbangbersamakawan.co.id',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kawasan Puri Gunung Langgar, Desa Sabah Balau, Kec. Tanjung Bintang',
        addressLocality: 'Lampung Selatan',
        addressRegion: 'Lampung',
        postalCode: '35361',
        addressCountry: 'ID',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -5.39714,
        longitude: 105.32115,
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Bandar Lampung' },
        { '@type': 'AdministrativeArea', name: 'Lampung Selatan' },
        { '@type': 'AdministrativeArea', name: 'Lampung' }
      ],
      priceRange: 'Rp 166.000.000',
      currenciesAccepted: 'IDR',
      paymentAccepted: 'Cash, KPR FLPP Bank BTN, Bank BSI, Bank Mandiri',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '17:00',
        },
      ],
      knowsAbout: [
        'Perumahan Subsidi Lampung',
        'KPR FLPP',
        'Puri Gunung Langgar',
        'Developer Properti Lampung',
        'Rumah Murah Tanjung Bintang'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': 'https://terbangbersamakawan.co.id/#website',
      url: 'https://terbangbersamakawan.co.id',
      name: 'PT. Terbang Bersama Kawan',
      publisher: {
        '@id': 'https://terbangbersamakawan.co.id/#organization'
      },
      inLanguage: 'id-ID'
    },
    {
      '@type': 'SingleFamilyResidence',
      '@id': 'https://terbangbersamakawan.co.id/proyek#puri-gunung-langgar',
      name: 'Puri Gunung Langgar Tipe 36/72',
      description: 'Hunian bersubsidi resmi berkualitas oleh PT. Terbang Bersama Kawan di Tanjung Bintang, Lampung Selatan. Dilengkapi fasilitas jalan cor, air sumur bor, listrik PLN, dan sertifikat SHM.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Desa Sabah Balau, Kec. Tanjung Bintang',
        addressLocality: 'Lampung Selatan',
        addressRegion: 'Lampung',
        postalCode: '35361',
        addressCountry: 'ID'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -5.39714,
        longitude: 105.32115
      },
      numberOfBedrooms: 2,
      numberOfBathroomsTotal: 1,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: 36,
        unitCode: 'MTK'
      },
      offers: {
        '@type': 'Offer',
        price: '166000000',
        priceCurrency: 'IDR',
        availability: 'https://schema.org/InStock',
        validFrom: '2021-01-01',
        seller: {
          '@id': 'https://terbangbersamakawan.co.id/#organization'
        }
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`scroll-smooth ${dmSerifDisplay.variable} ${dmSans.variable} ${cormorantGaramond.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${dmSans.className} bg-[#102D52] text-[#102D52] font-sans antialiased selection:bg-[#FF9D2E] selection:text-[#102D52] min-h-screen`}>
        <React.Suspense fallback={null}>
          <RouteProgressBar />
        </React.Suspense>
        {children}
        <MobileBottomNav />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
