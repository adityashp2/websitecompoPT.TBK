import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PT. Terbang Bersama Kawan (PT. TBK) | Pengembang Perumahan Berkualitas & Terpercaya',
  description: 'Website resmi PT. Terbang Bersama Kawan (PT. TBK), pengembang perumahan subsidi berkualitas dan terpercaya di Lampung. Menghadirkan proyek Puri Gunung Langgar.',
  icons: {
    icon: '/favicon.png',
  },
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
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-600 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
