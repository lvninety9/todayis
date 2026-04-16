'use client';

import React, { useState } from 'react';
import { Template, TemplateData } from '@/types/template';
import { TemplateEngine } from '../engine/TemplateEngine';

interface TemplatePreviewProps {
  template: Template;
  data: TemplateData;
  onUpdate?: (data: TemplateData) => void;
}

/**
 * 템플릿 미리보기 컴포넌트
 * 
 * 템플릿을 실시간으로 미리보기하는 컴포넌트
 * - TemplateEngine 을 내부에서 사용
 * - 실시간 미리보기 영역
 * - 편집 컨트롤 skeleton (Task 4 에서 구현)
 * - 반응형 레이아웃 (Desktop/Mobile 전환 skeleton)
 */
export function TemplatePreview({ template, data, onUpdate }: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // 데이터 업데이트 핸들러
  const handleUpdate = (fieldName: string, value: string) => {
    if (onUpdate) {
      data.setValue(fieldName, value);
      onUpdate(data);
    }
  };

  return (
    <div className="template-preview">
      {/* 미리보기 컨트롤 */}
      <div className="preview-controls">
        <div className="view-mode-toggle">
          <button
            type="button"
            className={viewMode === 'desktop' ? 'active' : ''}
            onClick={() => setViewMode('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            className={viewMode === 'mobile' ? 'active' : ''}
            onClick={() => setViewMode('mobile')}
          >
            Mobile
          </button>
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div className={`preview-area ${viewMode}`}>
        <TemplateEngine template={template} data={data} />
      </div>

      {/* 편집 컨트롤 (skeleton - Task 4 에서 구현) */}
      <div className="edit-controls">
        <div className="edit-controls-header">
          <h3>Edit Controls</h3>
          <p className="hint">Field editors will be implemented here</p>
        </div>
        <div className="edit-controls-body">
          {template.fields.map((field) => (
            <div key={field.name} className="edit-control-item">
              <label>{field.label}</label>
              {/* 실제 입력 컴포넌트는 Task 4 에서 구현 */}
              <input
                type={field.type === 'date' ? 'date' : 'text'}
                defaultValue={data.getValue(field.name) || field.defaultValue || ''}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                onChange={(e) => handleUpdate(field.name, e.target.value)}
                disabled
              />
              <span className="skeleton-hint">Skeleton - Task 4</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplatePreview;
