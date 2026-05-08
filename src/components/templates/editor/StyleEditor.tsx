'use client';

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SectionStyle, FontSize } from '@/types/template';
import { CustomFont } from '@/lib/fonts';
import { Play, RotateCcw } from 'lucide-react';

/* ============================================
   Predefined Color Palettes
   ============================================ */

const PREDEFINED_PALETTES: Record<string, { name: string; colors: { backgroundColor: string; textColor: string; accentColor: string; borderColor: string } }> = {
  terracotta: {
    name: 'Terracotta',
    colors: {
      backgroundColor: '#F9F1EA',
      textColor: '#3D405B',
      accentColor: '#E07A5F',
      borderColor: '#E07A5F40',
    },
  },
  sage: {
    name: 'Sage',
    colors: {
      backgroundColor: '#F4F1DE',
      textColor: '#2D3A32',
      accentColor: '#81B29A',
      borderColor: '#81B29A40',
    },
  },
  blush: {
    name: 'Blush',
    colors: {
      backgroundColor: '#F8E8EE',
      textColor: '#5C3D4A',
      accentColor: '#F4A0B5',
      borderColor: '#F4A0B540',
    },
  },
};

/* ============================================
   Animation Options (matching SectionStyle type)
   ============================================ */

const ANIMATION_OPTIONS = [
  { value: 'none', label: '없음' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'scale-up', label: 'Scale Up' },
];

/* ============================================
   Font Options (5 Google Fonts)
   ============================================ */

const FONT_OPTIONS = [
  { value: 'inherit', label: '기본값' },
  { value: 'Noto Serif KR', label: 'Noto Serif KR (본문용)' },
  { value: 'Playfair Display', label: 'Playfair Display (제목용)' },
  { value: 'Pretendard', label: 'Pretendard (모던)' },
  { value: 'Gmarket Sans', label: 'Gmarket Sans (캐주얼)' },
  { value: 'Lato', label: 'Lato (미니멀)' },
];

const FONT_SIZE_OPTIONS = [
  { value: 'xs', label: '작게' },
  { value: 'sm', label: '소형' },
  { value: 'base', label: '보통' },
  { value: 'lg', label: '대형' },
  { value: 'xl', label: '특대' },
  { value: '2xl', label: '매우特大' },
];

/* ============================================
   StyleEditor Component
   ============================================ */

interface StyleEditorProps {
  style: SectionStyle;
  onChange: (style: SectionStyle) => void;
  sectionId?: string;
  sectionLabel?: string;
  templateId?: string;
  customFonts?: CustomFont[];
}

/**
 * StyleEditor 컴포넌트
 * 
 * Section별 스타일 편집기
 * - 애니메이션 설정 (fade-in, slide-up, bounce 등)
 * - 폰트 설정 (5개 Google Fonts)
 * - 색상 테마 (predefined palette + custom HEX)
 * - 커스텀 폰트 업로드 (기존 기능 유지)
 */
export function StyleEditor({ style, onChange, sectionId, sectionLabel, templateId, customFonts = [] }: StyleEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleChange = (key: keyof SectionStyle, value: string | number | undefined) => {
    onChange({ ...style, [key]: value });
  };

  const applyPalette = (paletteKey: string) => {
    const palette = PREDEFINED_PALETTES[paletteKey];
    if (!palette) return;
    onChange({
      ...style,
      backgroundColor: palette.colors.backgroundColor,
      textColor: palette.colors.textColor,
      accentColor: palette.colors.accentColor,
      borderColor: palette.colors.borderColor,
    });
  };

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !templateId) return;

    if (customFonts.length >= 5) {
      setUploadError('템플릿당 최대 5개까지 업로드 가능합니다.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateId', templateId);
    const customFontName = (style as any).customFontName as string | undefined;
    if (customFontName) {
      formData.append('fontName', customFontName);
    }

    try {
      const res = await fetch('/api/fonts', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || '업로드에 실패했습니다.');
        return;
      }

      const existingFonts = (style as any).customFonts || [];
      const newFont: CustomFont = {
        id: data.fontId,
        name: data.fontFamily,
        url: data.fontUrl,
        family: data.fontFamily,
      };
      onChange({
        ...style,
        ...(existingFonts !== undefined && { customFonts: [...existingFonts, newFont] }),
      });
    } catch {
      setUploadError('서버 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFont = async (font: CustomFont) => {
    try {
      const res = await fetch(`/api/fonts?url=${encodeURIComponent(font.url)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const existingFonts = (style as any).customFonts || [];
        onChange({
          ...style,
          ...(existingFonts !== undefined && { customFonts: existingFonts.filter((f: CustomFont) => f.id !== font.id) }),
        });
      }
    } catch {
      setUploadError('삭제에 실패했습니다.');
    }
  };

  const animationDurationMap: Record<string, number> = {
    '0.3': 300,
    '0.6': 600,
    '1.0': 1000,
  };

  const animationDurationLabel = (() => {
    const duration = style.animationDuration;
    if (duration === 300) return '빠름 (0.3s)';
    if (duration === 1000) return '느림 (1.0s)';
    return '보통 (0.6s)';
  })();

  const handlePlayPreview = useCallback(() => {
    setIsPreviewing(true);
  }, []);

  const animationDurationMs = style.animationDuration || 600;

  const previewAnimationStyle: React.CSSProperties = style.animation && style.animation !== 'none'
    ? {
        animationName: `animate-${style.animation}`,
        animationDuration: `${animationDurationMs}ms`,
        animationTimingFunction: 'ease-out',
        animationDelay: `${style.animationDelay || 0}ms`,
        animationFillMode: 'both',
      }
    : {};

  return (
    <div className="space-y-4">
      {/* Section label */}
      {sectionLabel && (
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-800">
            {sectionLabel} 섹션 스타일
          </span>
          {sectionId && (
            <span className="text-xs text-gray-400 font-mono">{sectionId}</span>
          )}
        </div>
      )}

      {/* ========== Section Animation Settings ========== */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="text-sm font-semibold text-gray-700">애니메이션</h4>
        
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">입장 애니메이션</label>
          <Select
            value={style.animation || 'none'}
            onValueChange={(value) => handleChange('animation', value as SectionStyle['animation'])}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="애니메이션 선택" />
            </SelectTrigger>
            <SelectContent>
              {ANIMATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">속도</label>
          <Select
            value={String(style.animationDuration || 600)}
            onValueChange={(value) => handleChange('animationDuration', animationDurationMap[value])}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.3">{animationDurationLabel === '빠름 (0.3s)' ? animationDurationLabel : '빠름 (0.3s)'}</SelectItem>
              <SelectItem value="0.6">{animationDurationLabel === '보통 (0.6s)' ? animationDurationLabel : '보통 (0.6s)'}</SelectItem>
              <SelectItem value="1.0">{animationDurationLabel === '느림 (1.0s)' ? animationDurationLabel : '느림 (1.0s)'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">지연 시간 (ms)</label>
          <Input
            type="number"
            min={0}
            max={3000}
            step={100}
            placeholder="0"
            value={style.animationDelay || 0}
            onChange={(e) => handleChange('animationDelay', Number(e.target.value))}
            className="h-9 text-sm"
          />
        </div>

        {/* Animation Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs text-gray-500">미리보기</label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPreview}
                className="h-7 px-2 text-xs gap-1"
              >
                <Play className="w-3 h-3" />
                재생
              </Button>
              {isPreviewing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewing(false)}
                  className="h-7 px-2 text-xs gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  재재생
                </Button>
              )}
            </div>
          </div>
          <div className="relative h-16 bg-gray-50 rounded-md border border-gray-200 overflow-hidden flex items-center">
            {isPreviewing && (
              <div
                className="absolute inset-y-0 left-0 flex items-center px-3"
                style={previewAnimationStyle}
              >
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                  애니메이션 미리보기
                </span>
              </div>
            )}
            {!isPreviewing && (
              <span className="text-xs text-gray-400 px-3">
                {style.animation && style.animation !== 'none' ? '재생 버튼을 클릭하세요' : '애니메이션을 선택하세요'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========== Section Color Theme Settings ========== */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="text-sm font-semibold text-gray-700">색상 테마</h4>

        {/* Predefined palettes */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">프리셋 팔레트</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(PREDEFINED_PALETTES).map(([key, palette]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPalette(key)}
                className={
                  'relative p-2 rounded-lg border-2 transition-all text-left ' +
                  (style.backgroundColor === palette.colors.backgroundColor &&
                   style.textColor === palette.colors.textColor
                    ? 'border-blue-500 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300')
                }
              >
                <div className="flex gap-0.5 mb-1">
                  <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: palette.colors.backgroundColor }} />
                  <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: palette.colors.textColor }} />
                  <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: palette.colors.accentColor }} />
                </div>
                <span className="text-xs text-gray-600">{palette.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Individual color controls */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">배경 색상</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-10 h-9 rounded cursor-pointer border border-gray-200"
            />
            <Input
              type="text"
              placeholder="#ffffff"
              value={style.backgroundColor || ''}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="flex-1 h-9 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">텍스트 색상</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.textColor || '#000000'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-10 h-9 rounded cursor-pointer border border-gray-200"
            />
            <Input
              type="text"
              placeholder="#000000"
              value={style.textColor || ''}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="flex-1 h-9 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">액센트 색상</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.accentColor || '#E07A5F'}
              onChange={(e) => handleChange('accentColor', e.target.value)}
              className="w-10 h-9 rounded cursor-pointer border border-gray-200"
            />
            <Input
              type="text"
              placeholder="#E07A5F"
              value={style.accentColor || ''}
              onChange={(e) => handleChange('accentColor', e.target.value)}
              className="flex-1 h-9 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">테두리 색상</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={stripAlpha(style.borderColor) || '#E07A5F40'}
              onChange={(e) => handleChange('borderColor', e.target.value + '40')}
              className="w-10 h-9 rounded cursor-pointer border border-gray-200"
            />
            <Input
              type="text"
              placeholder="#E07A5F40"
              value={style.borderColor || ''}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              className="flex-1 h-9 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* ========== Section Font Settings ========== */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="text-sm font-semibold text-gray-700">글꼴</h4>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">폰트 패밀리</label>
          <Select
            value={style.fontFamily || 'inherit'}
            onValueChange={(value) => handleChange('fontFamily', value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="폰트 선택" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">글자 크기</label>
          <Select
            value={style.fontSize || 'base'}
            onValueChange={(value) => handleChange('fontSize', value as FontSize)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="크기 선택" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ========== Custom Font Upload (legacy) ========== */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="text-sm font-semibold text-gray-700">커스텀 폰트</h4>
        
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">폰트 이름 (선택사항)</label>
          <Input
            type="text"
            placeholder="폰트 이름"
            value={(style as any).customFontName || ''}
            onChange={(e) => handleChange('customFontName' as any, e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">폰트 파일 업로드</label>
          <Input
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFontUpload}
            disabled={uploading}
            className="text-sm"
          />
          <p className="text-xs text-gray-400">.ttf, .otf, .woff, .woff2 (최대 5MB)</p>
        </div>

        {uploading && <p className="text-xs text-blue-600">업로드 중...</p>}
        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

        {customFonts.length > 0 && (
          <div className="space-y-1 mt-2">
            <p className="text-xs text-gray-500">업로드된 폰트 ({customFonts.length}/5)</p>
            {customFonts.map((font) => (
              <div key={font.id} className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs">
                <span className="truncate flex-1 font-medium">{font.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFont(font)}
                  className="h-5 px-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  제거
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   Helpers
   ============================================ */

function stripAlpha(hex: string | undefined): string {
  if (!hex) return '#ffffff';
  // Remove alpha channel if present (e.g., "#E07A5F40" -> "#E07A5F")
  if (hex.length === 9) {
    return hex.slice(0, 7);
  }
  return hex;
}

export default StyleEditor;
