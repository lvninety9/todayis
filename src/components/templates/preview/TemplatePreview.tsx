'use client';

import React, { useState, useMemo } from 'react';
import { Template, TemplateData } from '@/types/template';
import { TemplateEngine } from '../engine/TemplateEngine';
import { TemplateEditor } from '../editor/TemplateEditor';
import { GlassCard } from '@/components/ui/card';

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
 * - 애니메이션 및 glassmorphism 적용
 */
export function TemplatePreview({ template, data, onUpdate }: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);

  // Editor 에서 사용할 데이터
  const effectiveFields = useMemo(() => {
    if (template.fields && template.fields.length > 0) return template.fields;
    const fields: typeof template.fields = [];
    if (template.sections) {
      for (const section of template.sections) {
        if (section.fields) {
          for (const field of section.fields) {
            fields.push(field);
          }
        }
      }
    }
    return fields;
  }, [template.fields, template.sections]);

  const editorData = useMemo(() => {
    return {
      templateId: template.id,
      values: effectiveFields.reduce((acc, field) => {
        const value = data.getValue(field.name);
        acc[field.name] = value ?? '';
        return acc;
      }, {} as Record<string, string>),
      validate: () => true,
      getValue: data.getValue.bind(data),
      setValue: () => {},
      getFieldNames: () => effectiveFields.map(f => f.name),
    };
  }, [template, data, effectiveFields]);

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
        getFieldNames: () => effectiveFields.map(f => f.name),
      };
      onUpdate(newData);
    }
  };

  return (
    <div className="template-preview space-y-4">
      {/* 미리보기 컨트롤 */}
      <GlassCard className="flex items-center justify-between p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`px-4 py-2 rounded-md transition-all ${
              viewMode === 'desktop'
                ? 'bg-[hsl(var(--primary))] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-4 py-2 rounded-md transition-all ${
              viewMode === 'mobile'
                ? 'bg-[hsl(var(--primary))] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Mobile
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:bg-[hsl(var(--terracotta-dark))] transition-all"
        >
          {isEditing ? '미리보기 모드' : '편집 모드'}
        </button>
      </GlassCard>

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
              <GlassCard className="h-full overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">실시간 미리보기</h3>
                </div>
                <div className="preview-content">
                  <TemplateEngine template={template} data={data} />
                </div>
              </GlassCard>
            </div>
          </div>
        ) : (
          <div className="transition-all duration-300 ease-in-out">
            <TemplateEngine template={template} data={data} />
          </div>
        )}
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .template-preview {
          width: 100%;
        }
        
        .preview-area {
          min-height: 500px;
          transition: all 0.3s ease-in-out;
        }
        
        .preview-area.desktop.editing {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .preview-area.mobile.editing {
          display: flex;
          flex-direction: column;
        }
        
        .split-view {
          display: flex;
          gap: 1rem;
          height: 500px;
          animation: fadeIn 0.3s ease-out;
        }
        
        .editor-panel {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(10px);
          border-radius: 0.5rem;
        }
        
        .preview-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .preview-content {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          animation: slideUp 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
            min-height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}

export default TemplatePreview;