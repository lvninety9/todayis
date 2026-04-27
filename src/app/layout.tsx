import type { Metadata } from 'next';
import { Noto_Serif_KR, Noto_Sans_KR, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { HeadFonts } from '@/components/layout/HeadFonts';

const notoSerif = Noto_Serif_KR({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Todayis - 웨딩 초대장 플랫폼',
  description: '간편하게 나만의 웨딩 초대장을 만들어보세요',
  other: {
    'google-fonts-preconnect':
      '<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${notoSerif.variable} ${notoSans.variable} ${playfair.variable} ${inter.variable} font-sans`}>
        {children}
        <Toaster position="top-right" />
        <HeadFonts />
      </body>
    </html>
  );
}
