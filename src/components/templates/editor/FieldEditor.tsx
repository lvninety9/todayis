'use client';

import React, { useState } from 'react';
import { TemplateField, Section } from '@/types/template';
import { ChevronDown, ChevronRight, LayoutList, Upload, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FieldEditorProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  section?: Section | null;
}

interface SectionEditorProps {
  section: Section;
  values: Record<string, string>;
  errors: Record<string, string>;
  onUpdateField: (fieldName: string, value: string) => void;
}

/**
 * FieldEditor 컴포넌트
 * 
 * 필드 타입별 편집기 컴포넌트
 * - text: Input 컴포넌트
 * - date: Calendar 컴포넌트
 * - image: URL Input
 * - location: Input + Map button skeleton
 */
export function FieldEditor({ field, value, onChange, error }: FieldEditorProps) {
  const [calendarDate, setCalendarDate] = useState<string | undefined>(() => {
    if (!value || value.trim() === '') return undefined;
    const d = new Date(value);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString().split('T')[0];
  });

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const newValue = `${year}-${month}-${day}`;
      setCalendarDate(newValue);
      onChange(newValue);
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCalendarDate(newValue);
    onChange(newValue);
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
      
      case 'date':
        return (
          <div className="space-y-2">
            <input
              type="date"
              value={calendarDate || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setCalendarDate(newValue);
                onChange(newValue);
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <input
              type="text"
              value={value}
              onChange={handleDateInputChange}
              placeholder="YYYY-MM-DD"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg 또는 GIF"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF (애니메이션) 지원
            </p>
          </div>
        );
      
case 'location':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Address (e.g., Seoul, Korea)"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              className="text-sm text-terracotta-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              📍 지도 선택 (Coming soon)
            </button>
          </div>
        );
      
      // === Phase 15: Extended Field Types ===
      
      case 'account':
        return (
          <div className="space-y-3">
            <select
              value={value.split('|')[0] || ''}
              onChange={(e) => {
                const parts = value.split('|');
                const newValue = `${e.target.value}|${parts[1] || ''}|${parts[2] || ''}`;
                onChange(newValue);
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">은행 선택</option>
              <option value="KB">KB국민은행</option>
              <option value="NH">NH농협은행</option>
              <option value="WR">우리은행</option>
              <option value="SH">신한은행</option>
              <option value="IBK">IBK기업은행</option>
              <option value="KEB">KEB외환은행</option>
              <option value="SC">SC제일은행</option>
              <option value="CITI">씨티은행</option>
            </select>
            <input
              type="text"
              value={value.split('|')[1] || ''}
              onChange={(e) => {
                const parts = value.split('|');
                const newValue = `${parts[0] || ''}|${e.target.value}|${parts[2] || ''}`;
                onChange(newValue);
              }}
              placeholder="계좌번호 (- 없이 입력)"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <input
              type="text"
              value={value.split('|')[2] || ''}
              onChange={(e) => {
                const parts = value.split('|');
                const newValue = `${parts[0] || ''}|${parts[1] || ''}|${e.target.value}`;
                onChange(newValue);
              }}
              placeholder="예금주 성함"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500">형식: 은행|계좌번호|예금주</p>
          </div>
        );
      
      case 'audio':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/music.mp3"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500">MP3, OGG, WAV 파일 URL</p>
            {value && (
              <audio controls src={value} className="w-full mt-2" />
            )}
          </div>
        );
      
      case 'video':
        return <VideoFieldEditor value={value} onChange={onChange} error={error} />;
      
      case 'gallery':
        return (
          <div className="space-y-2">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500">쉼표로 구분된 이미지 URL 목록</p>
            {value && (
              <div className="flex flex-wrap gap-2 mt-2">
                {value.split(',').map((url, idx) => (
                  <img
                    key={idx}
                    src={url.trim()}
                    alt={`Gallery ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-md border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'message':
        return (
          <div className="space-y-2">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="축하 메시지를 입력하세요"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500">축의도 메시지 (여러 줄 입력 가능)</p>
          </div>
        );
      
      case 'dresscode':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="예: Smart Casual, 한복, 자유복장"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-sm">
              {value || 'Dress Code'}
            </div>
          </div>
        );
      
      case 'parents':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">신랑父</label>
              <input
                type="text"
                value={value.split('|')[0] || ''}
                onChange={(e) => {
                  const parts = value.split('|');
                  const newValue = `${e.target.value}|${parts[1] || ''}|${parts[2] || ''}|${parts[3] || ''}`;
                  onChange(newValue);
                }}
                placeholder="신랑 아버지 성함"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">신랑母</label>
              <input
                type="text"
                value={value.split('|')[1] || ''}
                onChange={(e) => {
                  const parts = value.split('|');
                  const newValue = `${parts[0] || ''}|${e.target.value}|${parts[2] || ''}|${parts[3] || ''}`;
                  onChange(newValue);
                }}
                placeholder="신랑 어머니 성함"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">신부父</label>
              <input
                type="text"
                value={value.split('|')[2] || ''}
                onChange={(e) => {
                  const parts = value.split('|');
                  const newValue = `${parts[0] || ''}|${parts[1] || ''}|${e.target.value}|${parts[3] || ''}`;
                  onChange(newValue);
                }}
                placeholder="신부 아버지 성함"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">신부母</label>
              <input
                type="text"
                value={value.split('|')[3] || ''}
                onChange={(e) => {
                  const parts = value.split('|');
                  const newValue = `${parts[0] || ''}|${parts[1] || ''}|${parts[2] || ''}|${e.target.value}`;
                  onChange(newValue);
                }}
                placeholder="신부 어머니 성함"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <p className="text-xs text-gray-500">형식: 신랑父|신랑母|신부父|신부母</p>
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  return (
    <div className="field-editor mb-4">
      <label 
        htmlFor={field.name} 
        className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
      >
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

/**
 * SectionEditor 컴포넌트
 * 
 * 섹션별 필드 그룹 편집기
 * - 섹션 헤더 (이름, 타입, collapse/expand)
 * - 섹션 스타일 편집 (배경색, 텍스트색, accent, 폰트, 애니메이션)
 * - 필드별 편집기 (FieldEditor)
 */
export function SectionEditor({ section, values, errors, onUpdateField }: SectionEditorProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sectionStyle = section.style || {};

  const styleOptions = {
    backgroundColor: ['#FFFFFF', '#FFF5F5', '#FFF9F5', '#F5F0EB', '#FAFAF8', '#1A1A2E', '#16213E', '#0F3460', '#F8F0EC'],
    textColor: ['#2D2D2D', '#4A3728', '#3D3D3D', '#E0E0E0', '#FFFFFF'],
    accentColor: ['#C48B7F', '#D4A59A', '#8B7355', '#A89578', '#E94560'],
    fontFamily: ['Noto Serif KR', 'Pretendard', 'Playfair Display', 'Inter', 'San Francisco'],
    animation: ['none', 'fade-in', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom-in', 'zoom-out'],
    fontSize: ['xs', 'sm', 'base', 'lg', 'xl'],
  };

  return (
    <div className="mb-6 border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      {/* Section Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <LayoutList className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">{section.label}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {section.type}
          </span>
        </div>
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Section Style Editor */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">배경색</label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={sectionStyle.backgroundColor || '#FFFFFF'}
                onChange={(e) => {
                  const newStyle = { ...sectionStyle, backgroundColor: e.target.value };
                  onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
                }}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={sectionStyle.backgroundColor || '#FFFFFF'}
                onChange={(e) => {
                  const newStyle = { ...sectionStyle, backgroundColor: e.target.value };
                  onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
                }}
                className="flex-1 px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">텍스트색</label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={sectionStyle.textColor || '#2D2D2D'}
                onChange={(e) => {
                  const newStyle = { ...sectionStyle, textColor: e.target.value };
                  onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
                }}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={sectionStyle.textColor || '#2D2D2D'}
                onChange={(e) => {
                  const newStyle = { ...sectionStyle, textColor: e.target.value };
                  onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
                }}
                className="flex-1 px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">accent</label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={sectionStyle.accentColor || '#C48B7F'}
                onChange={(e) => {
                  const newStyle = { ...sectionStyle, accentColor: e.target.value };
                  onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
                }}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={sectionStyle.accentColor || '#C48B7F'}
                onChange={(e) => {
                  const newStyle = { ...sectionStyle, accentColor: e.target.value };
                  onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
                }}
                className="flex-1 px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">폰트</label>
            <select
              value={sectionStyle.fontFamily || 'Noto Serif KR'}
              onChange={(e) => {
                const newStyle = { ...sectionStyle, fontFamily: e.target.value };
                onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
              }}
              className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              {styleOptions.fontFamily.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">크기</label>
            <select
              value={sectionStyle.fontSize || 'base'}
              onChange={(e) => {
                const newStyle = { ...sectionStyle, fontSize: e.target.value };
                onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
              }}
              className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              {styleOptions.fontSize.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">애니메이션</label>
            <select
              value={sectionStyle.animation || 'none'}
              onChange={(e) => {
                const newStyle = { ...sectionStyle, animation: e.target.value };
                onUpdateField(`__section_style_${section.id}`, JSON.stringify(newStyle));
              }}
              className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              {styleOptions.animation.map((anim) => (
                <option key={anim} value={anim}>{anim}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section Fields */}
      {!collapsed && section.fields && section.fields.length > 0 && (
        <div className="px-4 py-3 space-y-4">
          {section.fields.map((field) => (
            <FieldEditor
              key={field.name}
              field={field}
              value={values[field.name] ?? field.defaultValue ?? ''}
              onChange={(newValue) => onUpdateField(field.name, newValue)}
              error={errors[field.name]}
              section={section}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================
   Video Field Editor with Tabs
   ============================================ */

type VideoSourceType = 'youtube' | 'bilibili' | 'upload';

function VideoFieldEditor({ value, onChange, error }: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [activeTab, setActiveTab] = useState<VideoSourceType>(
    value.includes('youtube') ? 'youtube'
    : value.includes('bilibili') ? 'bilibili'
    : 'upload'
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', 'video');
    formData.append('templateId', 'current');

    try {
      const res = await fetch('/api/templates/media?dev=true', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || '업로드에 실패했습니다.');
        return;
      }

      onChange(data.mediaUrl);
      setActiveTab('upload');
    } catch {
      setUploadError('서버 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const tabs: { key: VideoSourceType; label: string; icon: string }[] = [
    { key: 'youtube', label: 'YouTube', icon: '▶️' },
    { key: 'bilibili', label: 'Bilibili', icon: '📺' },
    { key: 'upload', label: '파일 업로드', icon: '📁' },
  ];

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex gap-1 border rounded-md p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 px-2 py-1.5 text-xs font-medium rounded transition-all flex items-center justify-center gap-1',
              activeTab === tab.key
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-transparent text-gray-500 hover:bg-gray-100'
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* YouTube Tab */}
      {activeTab === 'youtube' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => { onChange(e.target.value); setActiveTab('youtube'); }}
              placeholder="https://www.youtube.com/watch?v=xxxxx"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {value && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange('')}
                className="shrink-0"
              >
                삭제
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-400">YouTube 영상 URL을 입력하세요</p>
          {value && (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${value.match(/(?:v=)([a-zA-Z0-9_-]+)/)?.[1] || ''}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube Preview"
              />
            </div>
          )}
        </div>
      )}

      {/* Bilibili Tab */}
      {activeTab === 'bilibili' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => { onChange(e.target.value); setActiveTab('bilibili'); }}
              placeholder="https://www.bilibili.com/video/BVxxxx"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {value && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange('')}
                className="shrink-0"
              >
                삭제
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-400">Bilibili 영상 URL을 입력하세요</p>
          {value && (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
              {(() => {
                const bvMatch = value.match(/BV[a-zA-Z0-9]+/);
                const bvid = bvMatch?.[0] || '';
                const playerUrl = bvid
                  ? `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1`
                  : '';
                return playerUrl ? (
                  <iframe src={playerUrl} className="w-full h-full" allowFullScreen title="Bilibili Preview" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">미리보기 불가 (URL 확인)</div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,image/gif"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  {uploading ? '업로드 중...' : '클릭하여 파일 선택'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  MP4, WebM, MOV, GIF (최대 50MB)
                </p>
              </div>
            </label>
          </div>
          {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
          {value && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 truncate">현재: {value}</p>
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                <video controls src={value} className="w-full h-full" preload="metadata" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange('')}
                className="w-full text-xs"
              >
                파일 삭제
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FieldEditor;
