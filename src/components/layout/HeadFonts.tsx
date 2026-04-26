'use client';

import { useEffect } from 'react';

const GOOGLE_FONTS_URLS = [
  'https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
];

/**
 * HeadFonts 컴포넌트
 * 
 * Google Fonts를 동적으로 로드하는 클라이언트 컴포넌트
 * InvitationViewer에서 사용되는 모든 폰트를 포함
 */
export function HeadFonts() {
  useEffect(() => {
    for (const url of GOOGLE_FONTS_URLS) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  }, []);

  return null;
}

export default HeadFonts;
