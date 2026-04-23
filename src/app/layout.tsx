import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Todayis - 웨딩 초대장 플랫폼',
  description: '간편하게 나만의 웨딩 초대장을 만들어보세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
