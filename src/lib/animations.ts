/**
 * Animation Effects Library
 * 
 *婚礼 초대장 애니메이션 효과
 * - 페이드인, 슬라이드, 스케일 효과
 * - 동적 배경 (그라데이션, 입자, 꽃잎)
 */

/**
 * 애니메이션 타입
 */
export type AnimationType = 
  | 'fadeIn'
  | 'slideInLeft'
  | 'slideInRight'
  | 'scaleIn'
  | 'textAppear'
  | 'gradientAnim'
  | 'particleEffect'
  | 'fallingFlowers';

/**
 * 페이드인 애니메이션
 */
export const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

/**
 * 좌에서 우 슬라이드 인
 */
export const slideInLeft = `
  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

/**
 * 우에서 좌 슬라이드 인
 */
export const slideInRight = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

/**
 * 스케일 인 (확대)
 */
export const scaleIn = `
  @keyframes scaleIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

/**
 * 텍스트appear (글자별 순차 표시)
 */
export const textAppear = `
  @keyframes textAppear {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .text-appear span {
    display: inline-block;
    animation: textAppear 0.5s ease forwards;
    opacity: 0;
  }
`;

/**
 * 그라데이션 애니메이션 배경
 */
export const gradientAnim = `
  @keyframes gradientAnim {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .gradient-anim {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientAnim 15s ease infinite;
  }
`;

/**
 * 입자 효과 (Particle Effect)
 */
export const particleEffect = `
  @keyframes particleFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
  
  .particle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: particleFloat linear infinite;
  }
`;

/**
 * 꽃잎 떨어지는 효과
 */
export const fallingFlowers = `
  @keyframes fallingFlower {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  
  .flower-petal {
    position: absolute;
    font-size: 20px;
    animation: fallingFlower linear infinite;
  }
`;

/**
 * 애니메이션 스타일 생성
 * @param type 애니메이션 타입
 * @param duration 시간 (초)
 * @returns CSS 스타일 문자열
 */
export function getAnimationStyle(type: AnimationType, duration = 1): string {
  const baseStyle = 'animation-fill-mode: forwards;';
  
  switch (type) {
    case 'fadeIn':
      return `${fadeIn} .animate-fade { animation: fadeIn ${duration}s ease ${baseStyle}; }`;
    case 'slideInLeft':
      return `${slideInLeft} .animate-slide-left { animation: slideInLeft ${duration}s ease ${baseStyle}; }`;
    case 'slideInRight':
      return `${slideInRight} .animate-slide-right { animation: slideInRight ${duration}s ease ${baseStyle}; }`;
    case 'scaleIn':
      return `${scaleIn} .animate-scale { animation: scaleIn ${duration}s ease ${baseStyle}; }`;
    case 'textAppear':
      return `${textAppear} .animate-text { animation: textAppear ${duration}s ease ${baseStyle}; }`;
    case 'gradientAnim':
      return `${gradientAnim} .animate-gradient { animation: gradientAnim ${duration * 15}s ease infinite; }`;
    case 'particleEffect':
      return `${particleEffect} .animate-particles { position: relative; overflow: hidden; }`;
    case 'fallingFlowers':
      return `${fallingFlowers} .animate-flowers { position: relative; overflow: hidden; }`;
    default:
      return '';
  }
}

/**
 * 애니메이션 클래스 이름
 */
export function getAnimationClass(type: AnimationType): string {
  switch (type) {
    case 'fadeIn': return 'animate-fade';
    case 'slideInLeft': return 'animate-slide-left';
    case 'slideInRight': return 'animate-slide-right';
    case 'scaleIn': return 'animate-scale';
    case 'textAppear': return 'animate-text';
    case 'gradientAnim': return 'animate-gradient';
    case 'particleEffect': return 'animate-particles';
    case 'fallingFlowers': return 'animate-flowers';
    default: return '';
  }
}

/**
 * 사용 가능한 애니메이션 목록
 */
export const animationOptions: { value: AnimationType; label: string }[] = [
  { value: 'fadeIn', label: '페이드인' },
  { value: 'slideInLeft', label: '좌에서 우' },
  { value: 'slideInRight', label: '우에서 좌' },
  { value: 'scaleIn', label: '확대' },
  { value: 'textAppear', label: '텍스트appear' },
  { value: 'gradientAnim', label: '变动 배경' },
  { value: 'particleEffect', label: '입자 효과' },
  { value: 'fallingFlowers', label: '꽃잎 떨어짐' },
];