'use client';

import React, { useState } from 'react';
import { Template, TemplateField } from '@/types/template';
import { useTemplateEditor } from '@/hooks/use-template-editor';
import { FieldEditor } from './FieldEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle, AlertCircle, Settings, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { StyleEditor } from './StyleEditor';

interface SectionStyle {
  animation?: string;
  music?: string;
  fontFamily?: string;
  align?: string;
}

interface TemplateEditorProps {
  template: Template;
  initialData?: {
    getValue: (fieldName: string) => string | null;
  };
  onUpdate?: (data: { templateId: string; values: Record<string, string> }) => void;
}

/**
 * SortableField component - individual sortable field section with drag handle
 */
interface SortableFieldProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isActive: boolean;
  onSettingsClick?: (fieldName: string) => void;
}

function SortableField({ field, value, onChange, error, isActive, onSettingsClick }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative rounded-lg border-2 transition-all duration-200',
        isDragging ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-transparent',
        isActive ? 'bg-blue-50/80 dark:bg-blue-950/30' : 'bg-white/60 dark:bg-black/20',
        error ? 'border-red-300 dark:border-red-700' : 'hover:border-gray-200 dark:hover:border-gray-700'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-l-lg"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Field content */}
      <div className="ml-8 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={cn('font-medium text-sm', error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300')}>
              {field.label}
            </span>
            {field.required && <span className="text-red-500 text-sm">*</span>}
            {error && <AlertCircle className="w-3 h-3 text-red-500" />}
          </div>
          {onSettingsClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSettingsClick(field.name);
              }}
              className="p-1 rounded hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Settings className="w-3 h-3" />
            </button>
          )}
        </div>
        <FieldEditor
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      </div>
    </div>
  );
}

/**
 * TemplateEditor - Completely redesigned template editor
 * 
 * - Left: Sortable field list with drag handles
 * - Right: Field details (shown on click)
 * - Bottom: Validate button + Save button
 * - Simplified toolbar with expandable options
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

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // UI state
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showSecondaryToolbar, setShowSecondaryToolbar] = useState(false);
  const [sectionSettingsOpen, setSectionSettingsOpen] = useState(false);

  // Section-specific styles (per field)
  const [sectionStyles, setSectionStyles] = useState<Record<string, SectionStyle>>({});

  // Drag handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // In a real implementation, we would reorder the fields array here
      console.log('Reordering:', active.id, '->', over.id);
    }
  };

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

  const fieldIds = template.fields.map((f) => f.name);

  return (
    <div className="template-editor space-y-4">
      {/* Header with simplified toolbar */}
      <div className="template-editor-header flex items-center justify-between">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {template.name} 편집
        </h2>

        {/* Simplified toolbar with expandable options */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleValidate}
            className="border-yellow-500/50 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            확인
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
          >
            저장
          </Button>

          {/* Expandable secondary options */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSecondaryToolbar(!showSecondaryToolbar)}
            className="ml-2"
          >
            {showSecondaryToolbar ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expandable secondary toolbar */}
      {showSecondaryToolbar && (
        <div className="flex gap-2 p-2 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg animate-in slide-in-from-top-2">
          <Button variant="outline" size="sm">
            이미지 업로드
          </Button>
          <Button variant="outline" size="sm">
            배경 설정
          </Button>
          <Button variant="outline" size="sm">
            폰트 설정
          </Button>
        </div>
      )}

      {/* Main editor area with drag-and-drop */}
      <div className="template-editor-body grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Sortable field list */}
        <div className="field-list space-y-3">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">필드 목록</h3>
          <p className="text-xs text-gray-500 mb-4">
            드래그하여 순서 변경
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {template.fields.map((field) => (
                  <SortableField
                    key={field.name}
                    field={field}
                    value={data[field.name] || ''}
                    onChange={(value) => updateField(field.name, value)}
                    error={errors[field.name]}
                    isActive={activeField === field.name}
                    onSettingsClick={() => {
                  // Open section settings dialog
                  setActiveField(field.name);
                  setSectionSettingsOpen(true);
                }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right: Field editor */}
        <div className="field-editors">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            편집기
          </h3>
          {activeField ? (
            <div className="p-4 bg-white/60 dark:bg-black/20 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">
                  {template.fields.find(f => f.name === activeField)?.label}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveField(null)}
                >
                  <AlertCircle className="w-4 h-4" />
                </Button>
              </div>
              <FieldEditor
                field={template.fields.find(f => f.name === activeField)!}
                value={data[activeField] || ''}
                onChange={(value) => updateField(activeField, value)}
                error={errors[activeField]}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
              필드를 선택하여 편집
            </div>
          )}
        </div>

        {/* Section Settings Dialog */}
        <Dialog open={sectionSettingsOpen} onOpenChange={setSectionSettingsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {template.fields.find(f => f.name === activeField)?.label} 설정
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <StyleEditor
                style={sectionStyles[activeField || ''] || {}}
                onChange={(style) => setSectionStyles((prev) => ({
                  ...prev,
                  [activeField || '']: style,
                }))}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default TemplateEditor;
