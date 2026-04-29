/**
 * Template Style Definitions
 * 
 * Wedding 템플릿의 3가지 visual style 정의
 * - romantic: rose, pink, blush 톤
 * - classic: ivory, gold, black 톤
 * - modern: minimalist, clean lines
 */

export type TemplateStyle = 'romantic' | 'classic' | 'modern';

export interface TemplateStyleConfig {
  name: string;
  description: string;
  cssVariables: Record<string, string>;
  fonts: {
    heading: string;
    body: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
}

export const templateStyles: Record<TemplateStyle, TemplateStyleConfig> = {
  romantic: {
    name: 'Romantic',
    description: '로맨틱한 느낌 — rose, pink, blush 톤',
    cssVariables: {
      '--style-primary': '350 70% 60%',      // blush/pink
      '--style-secondary': '30 80% 70%',      // peach
      '--style-accent': '300 50% 70%',        // lavender
      '--style-background': '30 20% 97%',     // warm white
      '--style-text': '350 40% 30%',          // deep rose
      '--style-border': '350 50% 80%',        // light pink
    },
    fonts: { heading: 'Playfair Display', body: 'Noto Serif KR' },
    colors: {
      primary: '#D4788F', secondary: '#F4A0B5', accent: '#C8A8D4',
      background: '#FFF9F9', text: '#5A3E4B', border: '#F4D4DC',
    },
  },
  classic: {
    name: 'Classic',
    description: '클래식한 느낌 — ivory, gold, black 톤',
    cssVariables: {
      '--style-primary': '45 70% 50%',        // gold
      '--style-secondary': '40 30% 85%',      // ivory
      '--style-accent': '30 10% 25%',         // dark brown
      '--style-background': '40 20% 96%',     // cream
      '--style-text': '30 10% 20%',           // dark
      '--style-border': '45 50% 75%',         // light gold
    },
    fonts: { heading: 'Playfair Display', body: 'Noto Serif KR' },
    colors: {
      primary: '#C9A96E', secondary: '#F5E6C8', accent: '#3D3B34',
      background: '#FDF8F0', text: '#2C2825', border: '#E8D5B0',
    },
  },
  modern: {
    name: 'Modern',
    description: '모던한 느낌 — minimalist, clean lines',
    cssVariables: {
      '--style-primary': '220 60% 50%',       // blue-gray
      '--style-secondary': '220 20% 90%',     // light gray
      '--style-accent': '160 40% 45%',        // sage
      '--style-background': '0 0% 98%',       // near white
      '--style-text': '220 20% 20%',          // dark gray
      '--style-border': '220 15% 85%',        // light gray
    },
    fonts: { heading: 'Pretendard', body: 'Pretendard' },
    colors: {
      primary: '#5B7FA5', secondary: '#E8ECF0', accent: '#81B29A',
      background: '#FAFAFA', text: '#2D3748', border: '#D4D8DC',
    },
  },
};

/**
 * CSS variables를 HTML element에 적용
 * @param style 템플릿 스타일
 * @param element 스타일을 적용할 element
 */
export function applyTemplateStyle(style: TemplateStyle, element: HTMLElement): void {
  const config = templateStyles[style];
  if (!config) return;
  Object.entries(config.cssVariables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}
