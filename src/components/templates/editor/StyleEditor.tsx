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
 */
export function StyleEditor({ style, onChange }: StyleEditorProps) {
  const handleChange = (key: keyof TemplateStyle, value: string) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="style-editor space-y-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">스타일 설정</h3>
      
      {/* 애니메이션 */}
      <div className="space-y-2">
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
          배경 음악 URL
        </label>
        <Input
          type="url"
          placeholder="https://example.com/music.mp3"
          value={style.music || ''}
          onChange={(e) => handleChange('music', e.target.value)}
        />
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