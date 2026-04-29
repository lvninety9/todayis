/**
 * Font Utility Library
 * 
 * 폰트 로딩, 매핑, CSS 변수 생성 유틸리티
 * - Google Fonts 매핑
 * - CSS 변수 생성
 * - 커스텀 폰트 지원
 */

export type FontOption =
  | 'inherit'
  | 'Noto Serif KR'
  | 'Playfair Display'
  | 'Pretendard'
  | 'Gmarket Sans'
  | 'Lato'
  | 'custom';

const GOOGLE_FONTS: Record<string, string> = {
  'Noto Serif KR': 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap',
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
  Pretendard: 'https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap',
  'Gmarket Sans': 'https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@400;700&display=swap',
  Lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
};

const FONT_FAMILIES: Record<string, string> = {
  inherit: 'inherit',
  'Noto Serif KR': "'Noto Serif KR', serif",
  'Playfair Display': "'Playfair Display', serif",
  Pretendard: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  'Gmarket Sans': "'Gmarket Sans', sans-serif",
  Lato: "'Lato', sans-serif",
  custom: 'var(--font-custom)',
};

export function getFontFamily(fontFamily: string): string {
  return FONT_FAMILIES[fontFamily] || FONT_FAMILIES['inherit'];
}

export function getFontCSSVar(fontFamily: string): string {
  if (fontFamily === 'custom') {
    return '--font-custom';
  }
  const name = fontFamily.replace(/\s+/g, '-').toLowerCase();
  return `--font-${name}`;
}

export function loadGoogleFont(fontFamily: string): string | null {
  return GOOGLE_FONTS[fontFamily] || null;
}

export function getGoogleFontsCSS(): string {
  const urls = Object.values(GOOGLE_FONTS);
  return urls.map((url) => `<link rel="stylesheet" href="${url}" />`).join('\n');
}

export function getGoogleFontsPreconnect(): string {
  return '<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />';
}

export interface CustomFont {
  id: string;
  name: string;
  url: string;
  family: string;
}

export function getCustomFontCSS(fontUrl: string, fontName: string): string {
  return `
    @font-face {
      font-family: '${fontName}';
      src: url('${fontUrl}') format('truetype');
      font-display: swap;
    }
  `;
}

export function loadCustomFontCSS(fonts: CustomFont[]): string {
  return fonts
    .map((font) => getCustomFontCSS(font.url, font.name))
    .join('\n');
}
