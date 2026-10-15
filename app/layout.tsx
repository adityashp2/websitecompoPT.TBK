import type { Metadata, Viewport } from 'next';
import './globals.css';
import MobileBottomNav from './components/MobileBottomNav';

export const viewport: Viewport = {
  themeColor: '#262722',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://terbangbersamakawan.co.id'),
  title: {
    default: 'PT. Terbang Bersama Kawan (PT. TBK) | Pengembang Perumahan Berkualitas & Terpercaya',
    template: '%s | PT. Terbang Bersama Kawan',
  },
  description: 'Website resmi PT. Terbang Bersama Kawan (PT. TBK), pengembang perumahan subsidi berkualitas dan terpercaya di Lampung. Menghadirkan proyek hunian Puri Gunung Langgar di Tanjung Bintang, Lampung Selatan dengan legalitas SHM dan skema KPR FLPP bunga 5% tetap.',
  keywords: [
    'PT Terbang Bersama Kawan',
    'PT TBK',
    'Puri Gunung Langgar',
    'Rumah Subsidi Lampung',
    'KPR FLPP Lampung',
    'Perumahan Tanjung Bintang',
    'Pengembang Properti Lampung',
    'Rumah Murah Bandar Lampung',
    'Developer Terpercaya Lampung'
  ],
  authors: [{ name: 'PT. Terbang Bersama Kawan' }],
  creator: 'PT. Terbang Bersama Kawan',
  publisher: 'PT. Terbang Bersama Kawan',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PT. Terbang Bersama Kawan (PT. TBK) | Pengembang Perumahan Berkualitas & Terpercaya',
    description: 'Pengembang perumahan subsidi berkualitas dan berizin resmi di Lampung. Menghadirkan Puri Gunung Langgar dengan legalitas sah dan standar PUPR.',
    url: 'https://terbangbersamakawan.co.id',
    siteName: 'PT. Terbang Bersama Kawan',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/project-workspace.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawasan Puri Gunung Langgar oleh PT. Terbang Bersama Kawan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT. Terbang Bersama Kawan (PT. TBK)',
    description: 'Pengembang perumahan subsidi berkualitas dan berizin resmi di Lampung.',
    images: ['/assets/project-workspace.jpg'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'PT. Terbang Bersama Kawan',
  alternateName: 'PT. TBK',
  url: 'https://terbangbersamakawan.co.id',
  logo: 'https://terbangbersamakawan.co.id/assets/logo-tbk.png',
  image: 'https://terbangbersamakawan.co.id/assets/project-workspace.jpg',
  description: 'Pengembang perumahan subsidi berkualitas dan terpercaya di Lampung. Menghadirkan proyek perumahan Puri Gunung Langgar di Tanjung Bintang, Lampung Selatan.',
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
  telephone: '+6281278901234',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  priceRange: 'Rp 166.000.000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#F3EFE6] text-[#262722] font-sans antialiased selection:bg-[#C5A568] selection:text-[#262722] min-h-screen pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
