'use client';

import React, { useState, useMemo } from 'react';
import { Template, TemplateData } from '@/types/template';
import { TemplateEngine } from '../engine/TemplateEngine';
import { TemplateEditor } from '../editor/TemplateEditor';

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
 * - Split view: Editor (left) + Preview (right)
 * - 반응형: Mobile 은 stack, Desktop 은 split
 */
export function TemplatePreview({ template, data, onUpdate }: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);

  // Editor 에서 사용할 데이터
  const editorData = useMemo(() => {
    return {
      templateId: template.id,
      values: template.fields.reduce((acc, field) => {
        const value = data.getValue(field.name);
        acc[field.name] = value ?? '';
        return acc;
      }, {} as Record<string, string>),
      validate: () => true,
      getValue: data.getValue.bind(data),
      setValue: () => {},
      getFieldNames: () => template.fields.map(f => f.name),
    };
  }, [template, data]);

  // 데이터 업데이트 핸들러
  const handleUpdate = (updatedData: { templateId: string; values: Record<string, string> }) => {
    if (onUpdate) {
      const newData: TemplateData = {
        templateId: updatedData.templateId,
        values: { ...updatedData.values },
        validate: () => true,
        getValue: (fieldName: string) => updatedData.values[fieldName] ?? null,
        setValue: (fieldName: string, value: string) => {
          updatedData.values[fieldName] = value;
        },
        getFieldNames: () => template.fields.map(f => f.name),
      };
      onUpdate(newData);
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
        
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEditing ? '미리보기 모드' : '편집 모드'}
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className={`preview-area ${viewMode} ${isEditing ? 'editing' : ''}`}>
        {isEditing ? (
          <div className="split-view">
            {/* Left: Editor */}
            <div className="editor-panel">
              <TemplateEditor
                template={template}
                initialData={editorData}
                onUpdate={handleUpdate}
              />
            </div>
            
            {/* Right: Preview */}
            <div className="preview-panel">
              <div className="preview-header">
                <h3 className="text-lg font-semibold">실시간 미리보기</h3>
              </div>
              <div className="preview-content">
                <TemplateEngine template={template} data={data} />
              </div>
            </div>
          </div>
        ) : (
          <TemplateEngine template={template} data={data} />
        )}
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .template-preview {
          width: 100%;
        }
        
        .preview-controls {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .view-mode-toggle {
          display: flex;
          gap: 0.5rem;
        }
        
        .view-mode-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
        }
        
        .view-mode-toggle button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .preview-area {
          min-height: 500px;
        }
        
        .preview-area.desktop.editing {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
        }
        
        .preview-area.mobile.editing {
          display: flex;
          flex-direction: column;
        }
        
        .split-view {
          display: flex;
          gap: 1rem;
          height: 500px;
        }
        
        .editor-panel {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }
        
        .preview-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .preview-header {
          padding: 0.5rem 1rem;
          background: #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .preview-content {
          flex: 1;
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0 0 0.5rem 0.5rem;
          overflow-y: auto;
        }
        
        @media (max-width: 768px) {
          .preview-area.desktop.editing {
            grid-template-columns: 1fr;
          }
          
          .split-view {
            flex-direction: column;
            height: auto;
          }
          
          .editor-panel,
          .preview-panel {
            height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}

export default TemplatePreview;
