/**
 * Sample Templates
 * 
 * MVP 에 사용할 샘플 템플릿 데이터
 * - WEDDING_TEMPLATE: 웨딩 초대장
 * - BIRTHDAY_TEMPLATE: 생일 초대장
 */

import { Template, TemplateField, TemplateData } from '@/types/template';

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
