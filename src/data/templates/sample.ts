/**
 * Sample Templates
 * 
 * MVP 에 사용할 샘플 템플릿 데이터
 * - WEDDING_TEMPLATE: 웨딩 초대장
 * - BIRTHDAY_TEMPLATE: 생일 초대장
 */

import { Template, TemplateField, TemplateData, Section, SectionStyle } from '@/types/template';

/**
 * 웨딩 템플릿 정의
 */
export const WEDDING_TEMPLATE: Template = {
  id: 'wedding-001',
  name: '웨딩 초대장',
  category: 'wedding',
  thumbnail: '/templates/wedding-thumbnail.png',
  userId: 'sample-user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPublished: true,
  downloadCount: 0,
  price: 0,
  isPurchased: false,
  fields: [
    {
      name: 'groomName',
      type: 'text',
      label: '신랑 이름',
      required: true,
      defaultValue: '신랑 이름',
    },
    {
      name: 'brideName',
      type: 'text',
      label: '신부 이름',
      required: true,
      defaultValue: '신부 이름',
    },
    {
      name: 'date',
      type: 'date',
      label: '결혼식 날짜',
      required: true,
      defaultValue: '2026-06-01',
    },
    {
      name: 'time',
      type: 'text',
      label: '결혼식 시간',
      required: false,
      defaultValue: '오후 3 시',
    },
    {
      name: 'location',
      type: 'location',
      label: '결혼식 장소',
      required: true,
      defaultValue: '서울 호텔 ballroom',
    },
    {
      name: 'message',
      type: 'text',
      label: '메시지',
      required: false,
      defaultValue: '환영합니다',
    },
  ],
  layout: 'simple',
};

/**
 * 생일 템플릿 정의
 */
export const BIRTHDAY_TEMPLATE: Template = {
  id: 'birthday-001',
  name: '생일 초대장',
  category: 'birthday',
  thumbnail: '/templates/birthday-thumbnail.png',
  userId: 'sample-user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPublished: true,
  downloadCount: 0,
  price: 0,
  isPurchased: false,
  fields: [
    {
      name: 'hostName',
      type: 'text',
      label: '주최자 이름',
      required: true,
      defaultValue: '주최자 이름',
    },
    {
      name: 'birthday',
      type: 'text',
      label: '생일 축하 대상',
      required: true,
      defaultValue: '생일 축하 대상',
    },
    {
      name: 'date',
      type: 'date',
      label: '파티 날짜',
      required: true,
      defaultValue: '2026-07-15',
    },
    {
      name: 'time',
      type: 'text',
      label: '파티 시간',
      required: false,
      defaultValue: '오후 6 시',
    },
    {
      name: 'location',
      type: 'location',
      label: '파티 장소',
      required: true,
      defaultValue: '레스토랑 이름',
    },
    {
      name: 'message',
      type: 'text',
      label: '메시지',
      required: false,
      defaultValue: '많은 참석 부탁드립니다',
    },
  ],
  layout: 'simple',
};

/**
 * 웨딩 템플릿 샘플 데이터 생성
 */
export function getSampleWeddingData(): TemplateData {
  const data: TemplateData = {
    templateId: 'wedding-001',
    values: {
      groomName: '김철수',
      brideName: '이영희',
      date: '2026-06-01',
      time: '오후 3 시',
      location: '그랜드 호텔 ballroom',
      message: '환영합니다',
    },
    validate() {
      return Object.values(this.values).every((v) => v !== null && v.trim() !== '');
    },
    getValue(fieldName: string): string | null {
      return this.values[fieldName] ?? null;
    },
    setValue(fieldName: string, value: string): void {
      this.values[fieldName] = value;
    },
    getFieldNames(): string[] {
      return Object.keys(this.values);
    },
  };
  return data;
}

/**
 * 생일 템플릿 샘플 데이터 생성
 */
export function getSampleBirthdayData(): TemplateData {
  const data: TemplateData = {
    templateId: 'birthday-001',
    values: {
      hostName: '박민수',
      birthday: '김사랑',
      date: '2026-07-15',
      time: '오후 6 시',
      location: '스타벅스 강남점',
      message: '많은 참석 부탁드립니다',
    },
    validate() {
      return Object.values(this.values).every((v) => v !== null && v.trim() !== '');
    },
    getValue(fieldName: string): string | null {
      return this.values[fieldName] ?? null;
    },
    setValue(fieldName: string, value: string): void {
      this.values[fieldName] = value;
    },
    getFieldNames(): string[] {
      return Object.keys(this.values);
    },
  };
  return data;
}

/**
 * Section 기반 웨딩 템플릿 - 로맨틱 (Romantic)
 * 구조: 이미지 → announcements → invitation → map → accounts
 */
export const ROMANTIC_TEMPLATE: Template = {
  id: 'romantic-001',
  name: '로맨틱 웨딩',
  category: 'wedding',
  thumbnail: '/templates/romantic-thumbnail.png',
  userId: 'sample-user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPublished: true,
  downloadCount: 0,
  price: 5000,
  isPurchased: false,
  layout: 'simple',
  fields: [],
  sections: [
    {
      id: 'image-hero',
      type: 'image',
      order: 1,
      label: '헤드라인 이미지',
      fields: [
        {
          name: 'heroImage',
          type: 'image',
          label: '헤드라인 이미지',
          required: false,
          defaultValue: null,
        },
        {
          name: 'heroTitle',
          type: 'text',
          label: '타이틀',
          required: false,
          defaultValue: 'We are getting married',
        },
      ],
      style: {
        animation: 'fade-in',
        animationDuration: 800,
        animationDelay: 200,
        backgroundColor: '#FFF5F5',
        textColor: '#4A3728',
        accentColor: '#C48B7F',
        fontFamily: 'Noto Serif KR',
        fontSize: 'xl',
      },
    },
    {
      id: 'announcement-main',
      type: 'announcement',
      order: 2,
      label: '주요 공지',
      fields: [
        {
          name: 'groomName',
          type: 'text',
          label: '신랑 이름',
          required: true,
          defaultValue: '김철수',
        },
        {
          name: 'brideName',
          type: 'text',
          label: '신부 이름',
          required: true,
          defaultValue: '이영희',
        },
        {
          name: 'date',
          type: 'date',
          label: '결혼식 날짜',
          required: true,
          defaultValue: '2026-06-01',
        },
        {
          name: 'time',
          type: 'text',
          label: '결혼식 시간',
          required: false,
          defaultValue: '오후 3 시',
        },
        {
          name: 'location',
          type: 'location',
          label: '결혼식 장소',
          required: true,
          defaultValue: '서울 그랜드 호텔 ballroom',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 400,
        backgroundColor: '#FFFFFF',
        textColor: '#2D2D2D',
        accentColor: '#C48B7F',
        fontFamily: 'Noto Serif KR',
        fontSize: 'lg',
      },
    },
    {
      id: 'invitation-message',
      type: 'invitation',
      order: 3,
      label: '초대 메시지',
      fields: [
        {
          name: 'message',
          type: 'message',
          label: '초대 메시지',
          required: false,
          defaultValue: '소중한 분들에게 이 기쁨을 나누고 싶습니다.\n바쁘시더라도 꼭 참석해 주시길 바랍니다.',
        },
        {
          name: 'dressCode',
          type: 'text',
          label: '드레스 코드',
          required: false,
          defaultValue: 'White or Neutral tones',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 600,
        backgroundColor: '#FFF9F5',
        textColor: '#4A3728',
        accentColor: '#D4A59A',
        fontFamily: 'Noto Serif KR',
        fontSize: 'base',
      },
    },
    {
      id: 'map-location',
      type: 'map',
      order: 4,
      label: '오시는 길',
      fields: [
        {
          name: 'venueName',
          type: 'text',
          label: '장소명',
          required: true,
          defaultValue: '그랜드 호텔',
        },
        {
          name: 'address',
          type: 'location',
          label: '주소',
          required: true,
          defaultValue: '서울특별시 용산구 한강대로 123',
        },
        {
          name: 'mapUrl',
          type: 'text',
          label: '지도 URL',
          required: false,
          defaultValue: 'https://map.naver.com',
        },
        {
          name: 'navigation',
          type: 'text',
          label: '네비게이션 주소',
          required: false,
          defaultValue: '서울특별시 용산구 한강대로 123 그랜드 호텔',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 800,
        backgroundColor: '#FFFFFF',
        textColor: '#2D2D2D',
        accentColor: '#C48B7F',
        fontFamily: 'Pretendard',
        fontSize: 'sm',
      },
    },
    {
      id: 'accounts-contact',
      type: 'accounts',
      order: 5,
      label: '문의 연락처',
      fields: [
        {
          name: 'groomPhone',
          type: 'account',
          label: '신랑 연락처',
          required: false,
          defaultValue: '010-1234-5678',
        },
        {
          name: 'bridePhone',
          type: 'account',
          label: '신부 연락처',
          required: false,
          defaultValue: '010-8765-4321',
        },
        {
          name: 'plannerName',
          type: 'text',
          label: '플래너 이름',
          required: false,
          defaultValue: '김플래너',
        },
        {
          name: 'plannerPhone',
          type: 'account',
          label: '플래너 연락처',
          required: false,
          defaultValue: '02-1234-5678',
        },
      ],
      style: {
        animation: 'fade-in',
        animationDuration: 500,
        animationDelay: 1000,
        backgroundColor: '#F8F0EC',
        textColor: '#4A3728',
        accentColor: '#C48B7F',
        fontFamily: 'Pretendard',
        fontSize: 'sm',
      },
    },
  ],
};

/**
 * Section 기반 클래식 템플릿 (Classic)
 */
export const CLASSIC_TEMPLATE: Template = {
  id: 'classic-001',
  name: '클래식 웨딩',
  category: 'wedding',
  thumbnail: '/templates/classic-thumbnail.png',
  userId: 'sample-user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPublished: true,
  downloadCount: 0,
  price: 5000,
  isPurchased: false,
  layout: 'simple',
  fields: [],
  sections: [
    {
      id: 'image-hero-classic',
      type: 'image',
      order: 1,
      label: '헤드라인 이미지',
      fields: [
        {
          name: 'heroImage',
          type: 'image',
          label: '헤드라인 이미지',
          required: false,
          defaultValue: null,
        },
        {
          name: 'heroTitle',
          type: 'text',
          label: '타이틀',
          required: false,
          defaultValue: 'Together with their families',
        },
      ],
      style: {
        animation: 'fade-in',
        animationDuration: 800,
        animationDelay: 200,
        backgroundColor: '#F5F0EB',
        textColor: '#3D3D3D',
        accentColor: '#8B7355',
        fontFamily: 'Playfair Display',
        fontSize: 'xl',
      },
    },
    {
      id: 'announcement-classic',
      type: 'announcement',
      order: 2,
      label: '주요 공지',
      fields: [
        {
          name: 'groomName',
          type: 'text',
          label: '신랑 이름',
          required: true,
          defaultValue: '김철수',
        },
        {
          name: 'brideName',
          type: 'text',
          label: '신부 이름',
          required: true,
          defaultValue: '이영희',
        },
        {
          name: 'date',
          type: 'date',
          label: '결혼식 날짜',
          required: true,
          defaultValue: '2026-06-15',
        },
        {
          name: 'time',
          type: 'text',
          label: '결혼식 시간',
          required: false,
          defaultValue: '오후 2 시',
        },
        {
          name: 'location',
          type: 'location',
          label: '결혼식 장소',
          required: true,
          defaultValue: '코엑스 그랜드 ballroom',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 400,
        backgroundColor: '#FFFFFF',
        textColor: '#2D2D2D',
        accentColor: '#8B7355',
        fontFamily: 'Playfair Display',
        fontSize: 'lg',
      },
    },
    {
      id: 'invitation-classic',
      type: 'invitation',
      order: 3,
      label: '초대 메시지',
      fields: [
        {
          name: 'message',
          type: 'message',
          label: '초대 메시지',
          required: false,
          defaultValue: '두 가문의 행복한 결합을 알립니다.\n많은 축하와 격려를 부탁드립니다.',
        },
        {
          name: 'dressCode',
          type: 'text',
          label: '드레스 코드',
          required: false,
          defaultValue: 'Elegant Attire',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 600,
        backgroundColor: '#FAFAF8',
        textColor: '#3D3D3D',
        accentColor: '#A89578',
        fontFamily: 'Playfair Display',
        fontSize: 'base',
      },
    },
    {
      id: 'map-classic',
      type: 'map',
      order: 4,
      label: '오시는 길',
      fields: [
        {
          name: 'venueName',
          type: 'text',
          label: '장소명',
          required: true,
          defaultValue: '코엑스 그랜드 ballroom',
        },
        {
          name: 'address',
          type: 'location',
          label: '주소',
          required: true,
          defaultValue: '서울특별시 강남구 오산대로 502',
        },
        {
          name: 'mapUrl',
          type: 'text',
          label: '지도 URL',
          required: false,
          defaultValue: 'https://map.naver.com',
        },
        {
          name: 'navigation',
          type: 'text',
          label: '네비게이션 주소',
          required: false,
          defaultValue: '서울특별시 강남구 오산대로 502 코엑스',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 800,
        backgroundColor: '#FFFFFF',
        textColor: '#2D2D2D',
        accentColor: '#8B7355',
        fontFamily: 'Pretendard',
        fontSize: 'sm',
      },
    },
    {
      id: 'accounts-classic',
      type: 'accounts',
      order: 5,
      label: '문의 연락처',
      fields: [
        {
          name: 'groomPhone',
          type: 'account',
          label: '신랑 연락처',
          required: false,
          defaultValue: '010-1234-5678',
        },
        {
          name: 'bridePhone',
          type: 'account',
          label: '신부 연락처',
          required: false,
          defaultValue: '010-8765-4321',
        },
        {
          name: 'plannerName',
          type: 'text',
          label: '플래너 이름',
          required: false,
          defaultValue: '박플래너',
        },
        {
          name: 'plannerPhone',
          type: 'account',
          label: '플래너 연락처',
          required: false,
          defaultValue: '02-9876-5432',
        },
      ],
      style: {
        animation: 'fade-in',
        animationDuration: 500,
        animationDelay: 1000,
        backgroundColor: '#F5F0EB',
        textColor: '#3D3D3D',
        accentColor: '#8B7355',
        fontFamily: 'Pretendard',
        fontSize: 'sm',
      },
    },
  ],
};

/**
 * Section 기반 모던 템플릿 (Modern)
 */
export const MODERN_TEMPLATE: Template = {
  id: 'modern-001',
  name: '모던 웨딩',
  category: 'wedding',
  thumbnail: '/templates/modern-thumbnail.png',
  userId: 'sample-user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPublished: true,
  downloadCount: 0,
  price: 5000,
  isPurchased: false,
  layout: 'simple',
  fields: [],
  sections: [
    {
      id: 'image-hero-modern',
      type: 'image',
      order: 1,
      label: '헤드라인 이미지',
      fields: [
        {
          name: 'heroImage',
          type: 'image',
          label: '헤드라인 이미지',
          required: false,
          defaultValue: null,
        },
        {
          name: 'heroTitle',
          type: 'text',
          label: '타이틀',
          required: false,
          defaultValue: 'SINCE WE MET',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 800,
        animationDelay: 200,
        backgroundColor: '#1A1A2E',
        textColor: '#FFFFFF',
        accentColor: '#E94560',
        fontFamily: 'Pretendard',
        fontSize: 'xl',
      },
    },
    {
      id: 'announcement-modern',
      type: 'announcement',
      order: 2,
      label: '주요 공지',
      fields: [
        {
          name: 'groomName',
          type: 'text',
          label: '신랑 이름',
          required: true,
          defaultValue: '김철수',
        },
        {
          name: 'brideName',
          type: 'text',
          label: '신부 이름',
          required: true,
          defaultValue: '이영희',
        },
        {
          name: 'date',
          type: 'date',
          label: '결혼식 날짜',
          required: true,
          defaultValue: '2026-07-01',
        },
        {
          name: 'time',
          type: 'text',
          label: '결혼식 시간',
          required: false,
          defaultValue: '오후 4 시',
        },
        {
          name: 'location',
          type: 'location',
          label: '결혼식 장소',
          required: true,
          defaultValue: '반코 서울 강남',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 400,
        backgroundColor: '#16213E',
        textColor: '#E0E0E0',
        accentColor: '#E94560',
        fontFamily: 'Pretendard',
        fontSize: 'lg',
      },
    },
    {
      id: 'invitation-modern',
      type: 'invitation',
      order: 3,
      label: '초대 메시지',
      fields: [
        {
          name: 'message',
          type: 'message',
          label: '초대 메시지',
          required: false,
          defaultValue: '우리의 사랑 이야기를 함께해 주세요.\n소중한 순간들을 나누고 싶습니다.',
        },
        {
          name: 'dressCode',
          type: 'text',
          label: '드레스 코드',
          required: false,
          defaultValue: 'Smart Casual',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 600,
        backgroundColor: '#0F3460',
        textColor: '#E0E0E0',
        accentColor: '#E94560',
        fontFamily: 'Pretendard',
        fontSize: 'base',
      },
    },
    {
      id: 'map-modern',
      type: 'map',
      order: 4,
      label: '오시는 길',
      fields: [
        {
          name: 'venueName',
          type: 'text',
          label: '장소명',
          required: true,
          defaultValue: '반코 서울 강남',
        },
        {
          name: 'address',
          type: 'location',
          label: '주소',
          required: true,
          defaultValue: '서울특별시 강남구 테헤란로 123',
        },
        {
          name: 'mapUrl',
          type: 'text',
          label: '지도 URL',
          required: false,
          defaultValue: 'https://map.naver.com',
        },
        {
          name: 'navigation',
          type: 'text',
          label: '네비게이션 주소',
          required: false,
          defaultValue: '서울특별시 강남구 테헤란로 123 반코 서울 강남',
        },
      ],
      style: {
        animation: 'slide-up',
        animationDuration: 600,
        animationDelay: 800,
        backgroundColor: '#16213E',
        textColor: '#E0E0E0',
        accentColor: '#E94560',
        fontFamily: 'Pretendard',
        fontSize: 'sm',
      },
    },
    {
      id: 'accounts-modern',
      type: 'accounts',
      order: 5,
      label: '문의 연락처',
      fields: [
        {
          name: 'groomPhone',
          type: 'account',
          label: '신랑 연락처',
          required: false,
          defaultValue: '010-1234-5678',
        },
        {
          name: 'bridePhone',
          type: 'account',
          label: '신부 연락처',
          required: false,
          defaultValue: '010-8765-4321',
        },
        {
          name: 'plannerName',
          type: 'text',
          label: '플래너 이름',
          required: false,
          defaultValue: '최플래너',
        },
        {
          name: 'plannerPhone',
          type: 'account',
          label: '플래너 연락처',
          required: false,
          defaultValue: '02-5555-1234',
        },
      ],
      style: {
        animation: 'fade-in',
        animationDuration: 500,
        animationDelay: 1000,
        backgroundColor: '#1A1A2E',
        textColor: '#E0E0E0',
        accentColor: '#E94560',
        fontFamily: 'Pretendard',
        fontSize: 'sm',
      },
    },
  ],
};

/**
 * Section 기반 템플릿 목록
 */
export const SECTION_BASED_TEMPLATES: Template[] = [
  ROMANTIC_TEMPLATE,
  CLASSIC_TEMPLATE,
  MODERN_TEMPLATE,
];

/**
 * Section 기반 템플릿 ID로 찾기
 */
export function findSectionBasedTemplate(id: string): Template | undefined {
  return SECTION_BASED_TEMPLATES.find((t) => t.id === id);
}
