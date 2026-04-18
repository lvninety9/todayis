/**
 * Supabase Database Types
 * 
 * Supabase 데이터베이스 스키마 정의
 * - Template 테이블 스키마
 * - Row, Insert, Update 타입
 */

/**
 * 템플릿 필드 타입 (PostgreSQL JSONB)
 */
export interface TemplateField {
  name: string;
  type: 'text' | 'date' | 'image' | 'location';
  label: string;
  required: boolean;
  defaultValue: string | null;
}

/**
 * Template 테이블 Row 타입
 */
export interface Template {
  /** UUID 식별자 */
  id: string;
  /** 사용자 ID (auth.users 참조) */
  user_id: string;
  /** 템플릿 이름 */
  name: string;
  /** 카테고리 */
  category: string;
  /** 썸네일 URL */
  thumbnail: string;
  /** 필드 정의 (JSONB) */
  fields: TemplateField[];
  /** 레이아웃 설정 (JSONB) */
  layout: string;
  /** 공개 여부 */
  is_published: boolean;
  /** 다운로드 카운트 */
  download_count: number;
  /** 생성일시 */
  created_at: string;
  /** 수정일시 */
  updated_at: string;
}

/**
 * Template 테이블 Insert 타입 (생성 시)
 */
export interface TemplateInsert {
  /** UUID 식별자 (생략 시 자동 생성) */
  id?: string;
  /** 사용자 ID (auth.users 참조) */
  user_id: string;
  /** 템플릿 이름 */
  name: string;
  /** 카테고리 */
  category: string;
  /** 썸네일 URL */
  thumbnail: string;
  /** 필드 정의 (JSONB) */
  fields: TemplateField[];
  /** 레이아웃 설정 (JSONB) */
  layout: string;
  /** 공개 여부 (기본값: false) */
  is_published?: boolean;
  /** 다운로드 카운트 (기본값: 0) */
  download_count?: number;
  /** 생성일시 (생략 시 자동 설정) */
  created_at?: string;
  /** 수정일시 (생략 시 자동 설정) */
  updated_at?: string;
}

/**
 * Template 테이블 Update 타입 (수정 시)
 */
export interface TemplateUpdate {
  /** 템플릿 이름 */
  name?: string;
  /** 카테고리 */
  category?: string;
  /** 썸네일 URL */
  thumbnail?: string;
  /** 필드 정의 (JSONB) */
  fields?: TemplateField[];
  /** 레이아웃 설정 (JSONB) */
  layout?: string;
  /** 공개 여부 */
  is_published?: boolean;
  /** 다운로드 카운트 */
  download_count?: number;
  /** 수정일시 (생략 시 자동 업데이트) */
  updated_at?: string;
}
