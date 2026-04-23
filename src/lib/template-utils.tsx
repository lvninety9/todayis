/**
 * Template Utility Functions
 * 
 * 템플릿 처리를 위한 유틸리티 함수
 * - 유효성 검사
 * - 기본값 처리
 * - 타입별 렌더링
 */

import { TemplateField, TemplateData } from '@/types/template';

/**
 * 템플릿 데이터 유효성 검사
 * 
 * @param data - 검사할 템플릿 데이터
 * @param fields - 템플릿 필드 정의 목록
 * @returns 유효하면 true, 아니면 false
 */
export function validateTemplateData(
  data: TemplateData,
  fields: TemplateField[]
): boolean {
  // 모든 필수 필드가 값이 있는지 확인
  for (const field of fields) {
    if (field.required) {
      const value = data.getValue(field.name);
      if (!value || value.trim() === '') {
        return false;
      }
    }
  }
  return true;
}

/**
 * 필드 값 또는 기본값 가져오기
 * 
 * @param value - 현재 값 (null 일 수 있음)
 * @param field - 필드 정의
 * @returns 값이 있으면 값, 없으면 기본값
 */
export function getDefaultValue(
  value: string | null,
  field: TemplateField
): string {
  if (value !== null && value.trim() !== '') {
    return value;
  }
  return field.defaultValue || '';
}

/**
 * 필드 타입별 렌더링
 * 
 * @param value - 렌더링할 값
 * @param fieldType - 필드 타입 ('text' | 'date' | 'image' | 'location')
 * @returns React.ReactNode
 */
export function renderField(
  value: string,
  fieldType: string
): React.ReactNode {
  switch (fieldType) {
    case 'text':
      return <span>{value}</span>;
    
    case 'date':
      // 날짜 포맷팅: YYYY 년 MM 월 DD 일
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return <span>{value}</span>;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return <span>{`${year} 년 ${month} 월 ${day} 일`}</span>;
      } catch {
        return <span>{value}</span>;
      }
    
    case 'image':
      return (
        <img
          src={value}
          alt=""
          className="field-image"
        />
      );
    
    case 'location':
      return (
        <div className="location-container">
          <span className="location-text">{value}</span>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(value)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            지도 보기
          </a>
        </div>
      );
    
    default:
      return <span>{value}</span>;
  }
}
