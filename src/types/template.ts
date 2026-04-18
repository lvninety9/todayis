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
 */
export type FieldType = 'text' | 'date' | 'image' | 'location';

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
  /** 정의된 필드 목록 */
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
}

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
