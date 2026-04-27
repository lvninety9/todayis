'use client';

import React, { useState } from 'react';
import { TemplateField } from '@/types/template';

interface FieldEditorProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
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
  const [calendarDate, setCalendarDate] = useState<string | undefined>(
    value ? new Date(value).toISOString().split('T')[0] : undefined
  );

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
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500">MP4 파일 URL</p>
            {value && (
              <video controls src={value} className="w-full mt-2 rounded-md" />
            )}
          </div>
        );
      
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

export default FieldEditor;
