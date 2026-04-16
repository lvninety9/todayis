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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <input
              type="text"
              value={value}
              onChange={handleDateInputChange}
              placeholder="YYYY-MM-DD"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        );
      
      case 'image':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
      
      case 'location':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Address (e.g., Seoul, Korea)"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              📍 지도 선택 (Coming soon)
            </button>
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
