/**
 * Filter Effects Library
 * 
 *婚礼 초대장 이미지 필터 효과
 * - Sepia, Vintage, Grayscale 등
 * - 밝기, 대비, 채도 조절
 */

/**
 * 필터 타입
 */
export type FilterType = 
  | 'sepia'
  | 'vintage'
  | 'grayscale'
  | 'warm'
  | 'cool'
  | 'vivid';

/**
 * Sepia 필터 (브라운-ton)
 */
export const sepia = 'sepia(50%)';

/**
 * Vintage 필터 (，复古)
 */
export const vintage = 'sepia(30%) contrast(110%) brightness(105%)';

/**
 * Grayscale 필터 (흑백)
 */
export const grayscale = 'grayscale(100%)';

/**
 * Warm 필터 (따뜻한色调)
 */
export const warm = 'hue-rotate(-10deg) saturate(120%)';

/**
 * Cool 필터 (차로운色调)
 */
export const cool = 'hue-rotate(10deg) saturate(110%)';

/**
 * Vivid 필터 (선명)
 */
export const vivid = 'saturate(150%) contrast(110%)';

/**
 * 필터 스타일 생성
 * @param type 필터 타입
 * @param additional 추가 필터 (brightness, contrast, saturate)
 * @returns CSS filter 문자열
 */
export function getFilterStyle(
  type: FilterType | null,
  additional?: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
  }
): string {
  let filter = '';
  
  switch (type) {
    case 'sepia':
      filter = sepia;
      break;
    case 'vintage':
      filter = vintage;
      break;
    case 'grayscale':
      filter = grayscale;
      break;
    case 'warm':
      filter = warm;
      break;
    case 'cool':
      filter = cool;
      break;
    case 'vivid':
      filter = vivid;
      break;
    default:
      filter = 'none';
  }
  
  // 추가 필터 적용
  const parts: string[] = [];
  if (filter !== 'none') {
    parts.push(filter);
  }
  
  if (additional) {
    if (additional.brightness !== undefined && additional.brightness !== 100) {
      parts.push(`brightness(${additional.brightness}%)`);
    }
    if (additional.contrast !== undefined && additional.contrast !== 100) {
      parts.push(`contrast(${additional.contrast}%)`);
    }
    if (additional.saturate !== undefined && additional.saturate !== 100) {
      parts.push(`saturate(${additional.saturate}%)`);
    }
  }
  
  return parts.length > 0 ? parts.join(' ') : 'none';
}

/**
 * 필터 클래스 생성
 * @param type 필터 타입
 * @returns CSS 클래스
 */
export function getFilterClass(type: FilterType | null): string {
  switch (type) {
    case 'sepia': return 'filter-sepia';
    case 'vintage': return 'filter-vintage';
    case 'grayscale': return 'filter-grayscale';
    case 'warm': return 'filter-warm';
    case 'cool': return 'filter-cool';
    case 'vivid': return 'filter-vivid';
    default: return '';
  }
}

/**
 * 사용 가능한 필터 목록
 */
export const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'sepia', label: '브라운-ton' },
  { value: 'vintage', label: '，复古' },
  { value: 'grayscale', label: '흑백' },
  { value: 'warm', label: '따뜻함' },
  { value: 'cool', label: '차름함' },
  { value: 'vivid', label: '선명함' },
];

/**
 * 이미지 조절값 타입
 */
export interface ImageAdjustments {
  brightness: number;  // 0-200, 기본 100
  contrast: number;   // 0-200, 기본 100
  saturate: number;   // 0-200, 기본 100
}

/**
 * 기본 이미지 조절값
 */
export const defaultAdjustments: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
};