'use client';

import React from 'react';
import { Template } from '@/types/template';
import { useTemplateEditor } from '@/hooks/use-template-editor';
import { FieldEditor } from './FieldEditor';

interface TemplateEditorProps {
  template: Template;
  initialData?: {
    getValue: (fieldName: string) => string | null;
  };
  onUpdate?: (data: { templateId: string; values: Record<string, string> }) => void;
}

/**
 * TemplateEditor 컴포넌트
 * 
 * 템플릿 전체 편집기 컴포넌트
 * - Left: Field list (필드 목록)
 * - Right: FieldEditor per field (필드 편집기)
 * - Bottom: Validate button + Save button
 */
export function TemplateEditor({ template, initialData, onUpdate }: TemplateEditorProps) {
  const { data, errors, updateField, validateAll, getErrors, getData } = useTemplateEditor({
    template,
    initialData: initialData ? {
      templateId: template.id,
      values: template.fields.reduce((acc, field) => {
        const value = initialData.getValue(field.name);
        acc[field.name] = value ?? '';
        return acc;
      }, {} as Record<string, string>),
      validate: () => true,
      getValue: initialData.getValue,
      setValue: () => {},
      getFieldNames: () => template.fields.map(f => f.name),
    } : undefined,
  });

  const handleValidate = () => {
    const isValid = validateAll();
    if (!isValid) {
      const errors = getErrors();
      Object.keys(errors).forEach((fieldName) => {
        alert(`${template.fields.find(f => f.name === fieldName)?.label}: ${errors[fieldName]}`);
      });
    }
    return isValid;
  };

  const handleSave = () => {
    if (handleValidate()) {
      const currentData = getData();
      if (onUpdate) {
        onUpdate({
          templateId: currentData.templateId,
          values: { ...currentData.values },
        });
      }
    }
  };

  return (
    <div className="template-editor">
      <div className="template-editor-header">
        <h2 className="text-xl font-bold">{template.name} 편집</h2>
      </div>

      <div className="template-editor-body">
        {/* Left: 필드 목록 */}
        <div className="field-list">
          <h3 className="text-lg font-semibold mb-4">필드 목록</h3>
          <div className="space-y-2">
            {template.fields.map((field) => (
              <div
                key={field.name}
                className={`p-2 rounded ${
                  errors[field.name] ? 'bg-red-50 border-l-4 border-red-500' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{field.label}</span>
                  {field.required && <span className="text-red-500 text-sm">*</span>}
                </div>
                <span className="text-xs text-gray-500">{field.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 필드 편집기 */}
        <div className="field-editors">
          <h3 className="text-lg font-semibold mb-4">편집기</h3>
          {template.fields.map((field) => (
            <FieldEditor
              key={field.name}
              field={field}
              value={data[field.name] || ''}
              onChange={(value) => updateField(field.name, value)}
              error={errors[field.name]}
            />
          ))}
        </div>
      </div>

      {/* Bottom: Validate & Save buttons */}
      <div className="template-editor-footer">
        <button
          type="button"
          onClick={handleValidate}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
        >
          Validate
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default TemplateEditor;
