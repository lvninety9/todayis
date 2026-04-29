/**
 * Template System Types
 * 
 * 템플릿 엔진을 위한 타입 정의
 * - Template: 템플릿 정의
 * - TemplateField: 템플릿 필드 정의
 * - TemplateData: 템플릿 데이터 (바인딩된 값)
 */

/**
 * 템플릿 필드 타입
 * Extended in Phase 15: added account, audio, video, gallery, message, dresscode, parents
 */
export type FieldType = 'text' | 'date' | 'image' | 'location' | 'account' | 'audio' | 'video' | 'gallery' | 'message' | 'dresscode' | 'parents';

/**
 * 섹션 타입 (section 기반 렌더링)
 */
export type SectionType = 'image' | 'announcement' | 'invitation' | 'map' | 'accounts';

/**
 * 폰트 크기 옵션
 */
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';

/**
 * 섹션 스타일 정의
 */
export interface SectionStyle {
  animation?: 'none' | 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'bounce' | 'scale-up';
  animationDuration?: number;
  animationDelay?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  fontFamily?: string;
  fontSize?: FontSize;
}

/**
 * 템플릿 필드 정의
 */
export interface TemplateField {
  /** 필드 이름 (키로 사용) */
  name: string;
  /** 필드 타입 */
  type: FieldType;
  /** 표시 라벨 */
  label: string;
  /** 필수 여부 */
  required: boolean;
  /** 기본값 */
  defaultValue: string | null;
}

/**
 * 섹션 정의 (section 기반 구조)
 */
export interface Section {
  /** 고유 식별자 */
  id: string;
  /** 섹션 타입 */
  type: SectionType;
  /** 순서 (낮을수록 상단) */
  order: number;
  /** 표시 라벨 */
  label: string;
  /** 필드 목록 */
  fields: TemplateField[];
  /** 섹션별 스타일 */
  style?: SectionStyle;
}

/**
 * 템플릿 정의
 */
export interface Template {
  /** 고유 식별자 */
  id: string;
  /** 템플릿 이름 */
  name: string;
  /** 카테고리 */
  category: string;
  /** 썸네일 URL */
  thumbnail: string;
  /** 정의된 필드 목록 (기존 flat 구조, 하위 호환) */
  fields: TemplateField[];
  /** 레이아웃 (JSON 문자열 또는 경로) */
  layout: string;
  /** 사용자 ID (소유자) */
  userId: string;
  /** 생성일시 */
  createdAt: string;
  /** 수정일시 */
  updatedAt: string;
  /** 공개 여부 */
  isPublished: boolean;
  /** 다운로드 카운트 */
  downloadCount: number;
  /** 가격 (원화, 무료면 0) */
  price: number;
  /** 구매 여부 */
  isPurchased: boolean;
  /** 섹션 기반 구조 (신규, sections가 있으면 우선 사용) */
  sections?: Section[];
}

/**
 * 템플릿 스타일 타입
 */
export type TemplateStyle = 'romantic' | 'classic' | 'modern';

/**
 * 템플릿 데이터 (바인딩된 값)
 */
export interface TemplateData {
  /** 템플릿 ID */
  templateId: string;
  /** 필드 값 매핑 (field.name -> value) */
  values: Record<string, string>;
  
  /**
   * 유효성 검사
   * @returns 유효하면 true, 아니면 false
   */
  validate(): boolean;
  
  /**
   * 특정 필드의 값 가져오기
   * @param fieldName 필드 이름
   * @returns 값이 있으면 값, 없으면 null
   */
  getValue(fieldName: string): string | null;
  
  /**
   * 필드 값 설정
   * @param fieldName 필드 이름
   * @param value 값
   */
  setValue(fieldName: string, value: string): void;
  
  /**
   * 모든 필드 값 확인
   * @returns 모든 필드 이름 배열
   */
  getFieldNames(): string[];
}

/**
 * 섹션 ID 생성 헬퍼
 * @param type 섹션 타입
 * @returns 고유 섹션 ID
 */
export function generateSectionId(type: SectionType): string {
  return `${type}-${crypto.randomUUID().slice(0, 8)}`;
}
