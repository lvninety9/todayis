'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TemplateStyle {
  animation?: string;
  music?: string;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  backgroundColor?: string;
  textDecoration?: string;
  // V2 Enhanced Features
  backgroundEffect?: string;
  textAnimation?: string;
  imageFilter?: string;
  imageBrightness?: number;
  imageContrast?: number;
  imageSaturate?: number;
  pageTransition?: string;
}

interface StyleEditorProps {
  style: TemplateStyle;
  onChange: (style: TemplateStyle) => void;
}

const animationOptions = [
  { value: 'none', label: '없음' },
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'slideUp', label: 'Slide Up' },
  { value: 'slideLeft', label: 'Slide Left' },
  { value: 'slideRight', label: 'Slide Right' },
  { value: 'scaleIn', label: 'Scale In' },
  { value: 'bounce', label: 'Bounce' },
];

// V2 Enhanced Animation Options
const backgroundEffectOptions = [
  { value: 'none', label: '없음' },
  { value: 'gradientAnim', label: '变动 그라데이션' },
  { value: 'particleEffect', label: '입자 효과' },
  { value: 'fallingFlowers', label: '꽃잎 떨어짐' },
];

const textAnimationOptions = [
  { value: 'none', label: '없음' },
  { value: 'fadeIn', label: '페이드인' },
  { value: 'slideInLeft', label: '좌에서 우' },
  { value: 'slideInRight', label: '우에서 좌' },
  { value: 'scaleIn', label: '확대' },
  { value: 'textAppear', label: '텍스트appear' },
];

const imageFilterOptions = [
  { value: 'none', label: '없음' },
  { value: 'sepia', label: '브라운-ton' },
  { value: 'vintage', label: '复古' },
  { value: 'grayscale', label: '흑백' },
  { value: 'warm', label: '따뜻함' },
  { value: 'cool', label: '차름함' },
  { value: 'vivid', label: '선명함' },
];

const pageTransitionOptions = [
  { value: 'none', label: '없음' },
  { value: 'swipeLeft', label: '좌에서 우' },
  { value: 'swipeRight', label: '우에서 좌' },
  { value: 'fade', label: '페이드' },
];

const fontFamilyOptions = [
  { value: 'inherit', label: '기본값' },
  { value: 'Pretendard', label: 'Pretendard' },
  { value: 'Noto Sans KR', label: 'Noto Sans KR' },
  { value: 'Nanum Gothic', label: 'Nanum Gothic' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Playfair Display', label: 'Playfair Display' },
];

const fontSizeOptions = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
  { value: 'xlarge', label: '매우 크게' },
];

const textDecorationOptions = [
  { value: 'none', label: '없음' },
  { value: 'underline', label: '밑줄' },
  { value: 'line-through', label: '취소선' },
  { value: 'italic', label: '이탤릭' },
  { value: 'bold', label: '굵게' },
];

/**
 * StyleEditor 컴포넌트
 * 
 * 템플릿 스타일 편집기
 * - 애니메이션, 음악, 폰트, 색상 등의 스타일 설정
 * - V2 Enhanced Features (배경 효과, 필터, 페이지 넘기기)
 */
export function StyleEditor({ style, onChange }: StyleEditorProps) {
  const handleChange = (key: keyof TemplateStyle, value: string | number | undefined) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="style-editor space-y-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">스타일 설정</h3>
      
      {/* ========== V2 Enhanced: 배경 효과 ========== */}
      <div className="space-y-2 border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          배경 효과 (V2)
        </label>
        <Select 
          value={style.backgroundEffect || 'none'} 
          onValueChange={(value) => handleChange('backgroundEffect', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="배경 효과 선택" />
          </SelectTrigger>
          <SelectContent>
            {backgroundEffectOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ========== V2 Enhanced: 텍스트 애니메이션 ========== */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          텍스트 애니메이션 (V2)
        </label>
        <Select 
          value={style.textAnimation || 'none'} 
          onValueChange={(value) => handleChange('textAnimation', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="텍스트 애니메이션 선택" />
          </SelectTrigger>
          <SelectContent>
            {textAnimationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ========== V2 Enhanced: 이미지 필터 ========== */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          사진 필터 (V2)
        </label>
        <Select 
          value={style.imageFilter || 'none'} 
          onValueChange={(value) => handleChange('imageFilter', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="필터 선택" />
          </SelectTrigger>
          <SelectContent>
            {imageFilterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ========== V2 Enhanced: 이미지 조절 ========== */}
      {(style.imageFilter && style.imageFilter !== 'none') && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          {/* 밝기 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              밝기: {style.imageBrightness ?? 100}%
            </label>
            <Input
              type="range"
              min={50}
              max={150}
              step={5}
              value={style.imageBrightness ?? 100}
              onChange={(e) => handleChange('imageBrightness', Number(e.target.value))}
            />
          </div>
          
          {/* 대비 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              대비: {style.imageContrast ?? 100}%
            </label>
            <Input
              type="range"
              min={50}
              max={150}
              step={5}
              value={style.imageContrast ?? 100}
              onChange={(e) => handleChange('imageContrast', Number(e.target.value))}
            />
          </div>
          
          {/* 채도 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              채도: {style.imageSaturate ?? 100}%
            </label>
            <Input
              type="range"
              min={50}
              max={150}
              step={5}
              value={style.imageSaturate ?? 100}
              onChange={(e) => handleChange('imageSaturate', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* ========== V2 Enhanced: 페이지 넘기기 ========== */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          페이지 넘기기 (V2)
        </label>
        <Select 
          value={style.pageTransition || 'none'} 
          onValueChange={(value) => handleChange('pageTransition', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="페이지 넘기기 선택" />
          </SelectTrigger>
          <SelectContent>
            {pageTransitionOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ========== 기존: 입장 애니메이션 ========== */}
      <div className="space-y-2 border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
         入场 애니메이션
        </label>
        <Select 
          value={style.animation || 'none'} 
          onValueChange={(value) => handleChange('animation', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="애니메이션 선택" />
          </SelectTrigger>
          <SelectContent>
            {animationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 배경 음악 URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          배경 음악 URL (Suno 등)
        </label>
        <Input
          type="url"
          placeholder="https://example.com/music.mp3"
          value={style.music || ''}
          onChange={(e) => handleChange('music', e.target.value)}
        />
        <p className="text-xs text-gray-500">
          MP3, WAV, OGG 파일 URL을 입력하세요
        </p>
      </div>

      {/* 폰트 패밀리 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          폰트
        </label>
        <Select 
          value={style.fontFamily || 'inherit'} 
          onValueChange={(value) => handleChange('fontFamily', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="폰트 선택" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilyOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 폰트 크기 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          글자 크기
        </label>
        <Select 
          value={style.fontSize || 'medium'} 
          onValueChange={(value) => handleChange('fontSize', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="크기 선택" />
          </SelectTrigger>
          <SelectContent>
            {fontSizeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 글자 색상 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          글자 색상
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={style.textColor || '#000000'}
            onChange={(e) => handleChange('textColor', e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <Input
            type="text"
            placeholder="#000000"
            value={style.textColor || ''}
            onChange={(e) => handleChange('textColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* 배경 색상 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          배경 색상
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={style.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <Input
            type="text"
            placeholder="#ffffff"
            value={style.backgroundColor || ''}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* 텍스트 장식 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          텍스트 효과
        </label>
        <Select 
          value={style.textDecoration || 'none'} 
          onValueChange={(value) => handleChange('textDecoration', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="효과 선택" />
          </SelectTrigger>
          <SelectContent>
            {textDecorationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default StyleEditor;