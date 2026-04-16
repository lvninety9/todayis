'use client';

import React from 'react';
import { Template, TemplateData } from '@/types/template';

interface TemplateEngineProps {
  template: Template;
  data: TemplateData;
}

/**
 * 템플릿 렌더링 엔진
 * 
 * 템플릿 정의와 데이터를 받아서 렌더링하는 엔진 컴포넌트
 * - 유효성 검사 수행
 * - 데이터 바인딩
 * - 필드 타입별 렌더링 (skeleton)
 */
export function TemplateEngine({ template, data }: TemplateEngineProps) {
  // 유효성 검사
  const isValid = data.validate();

  if (!isValid) {
    return (
      <div className="template-engine error">
        <div className="error-message">
          <h3>Invalid Template Data</h3>
          <p>Some required fields are missing or invalid.</p>
        </div>
      </div>
    );
  }

  // 데이터 바인딩 및 렌더링
  const renderFields = () => {
    return template.fields.map((field) => {
      const value = data.getValue(field.name);
      
      // 필드 타입별 렌더링 (skeleton)
      switch (field.type) {
        case 'text':
          return (
            <div key={field.name} className="field text-field">
              <label>{field.label}</label>
              <span className="field-value">{value || field.defaultValue || 'N/A'}</span>
            </div>
          );
        case 'date':
          return (
            <div key={field.name} className="field date-field">
              <label>{field.label}</label>
              <span className="field-value">{value || field.defaultValue || 'N/A'}</span>
            </div>
          );
        case 'image':
          return (
            <div key={field.name} className="field image-field">
              <label>{field.label}</label>
              <img 
                src={value || field.defaultValue || '/placeholder-image.png'} 
                alt={field.label}
                className="field-image"
              />
            </div>
          );
        case 'location':
          return (
            <div key={field.name} className="field location-field">
              <label>{field.label}</label>
              <span className="field-value">{value || field.defaultValue || 'N/A'}</span>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="template-engine">
      <div className="template-header">
        <h1>{template.name}</h1>
      </div>
      <div className="template-body">
        {renderFields()}
      </div>
    </div>
  );
}

export default TemplateEngine;
