import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import './globals.css';

const bodyFont = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const headingFont = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: { default: 'Grabin | Move with intent', template: '%s | Grabin' },
  description: 'Performance essentials and considered gear for the everyday athlete.',
  applicationName: 'Grabin',
  keywords: ['sportswear', 'running gear', 'cycling apparel', 'athletic essentials', 'Grabin'],
  openGraph: { type: 'website', siteName: 'Grabin', title: 'Grabin | Move with intent', description: 'Performance essentials and considered gear for the everyday athlete.' },
  twitter: { card: 'summary_large_image', title: 'Grabin | Move with intent', description: 'Performance essentials and considered gear for the everyday athlete.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
