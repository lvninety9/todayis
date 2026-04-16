'use client';

import React from 'react';
import { Template, TemplateData, TemplateField } from '@/types/template';
import { validateTemplateData, getDefaultValue, renderField } from '@/lib/template-utils';

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
 * - 필드 타입별 렌더링 (실제 구현)
 */
export function TemplateEngine({ template, data }: TemplateEngineProps) {
  // 유효성 검사
  const isValid = validateTemplateData(data, template.fields);

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
      const displayValue = getDefaultValue(value, field);
      
      // 필드 타입별 렌더링 (실제 구현)
      return (
        <div key={field.name} className={`field ${field.type}-field`}>
          <label>{field.label}</label>
          <div className="field-value">
            {renderField(displayValue, field.type)}
          </div>
        </div>
      );
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
