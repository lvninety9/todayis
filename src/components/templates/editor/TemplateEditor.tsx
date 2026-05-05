'use client';

import React, { useState, useMemo } from 'react';
import { Template, TemplateField, Section, SectionStyle, SectionType } from '@/types/template';
import { useTemplateEditor } from '@/hooks/use-template-editor';
import { FieldEditor } from './FieldEditor';
import { StyleEditor } from './StyleEditor';
import { GripVertical, CheckCircle, AlertCircle, Settings, ChevronUp, ChevronDown, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TemplateEditorProps {
  template: Template;
  initialData?: {
    getValue: (fieldName: string) => string | null;
  };
  onUpdate?: (data: { templateId: string; values: Record<string, string> }) => void;
  onFieldChange?: (sectionId: string, fieldName: string, value: string) => void;
}

const SECTION_ICONS: Record<SectionType, string> = {
  image: '🖼️',
  announcement: '📢',
  invitation: '💌',
  map: '📍',
  accounts: '📞',
  gallery: '📸',
  story: '📖',
};

const SECTION_COLORS: Record<SectionType, string> = {
  image: 'bg-blue-50 border-blue-200 text-blue-700',
  announcement: 'bg-purple-50 border-purple-200 text-purple-700',
  invitation: 'bg-pink-50 border-pink-200 text-pink-700',
  map: 'bg-green-50 border-green-200 text-green-700',
  accounts: 'bg-orange-50 border-orange-200 text-orange-700',
  gallery: 'bg-teal-50 border-teal-200 text-teal-700',
  story: 'bg-rose-50 border-rose-200 text-rose-700',
};

/**
 * SectionEditor - Section 기반 편집기
 * 
 * - Left: Section list with Up/Down reorder buttons
 * - Right: Section field editor + Style editor
 * - Bottom: Validate + Save buttons
 * - Real-time preview toggle
 */
export function TemplateEditor({ template, initialData, onUpdate, onFieldChange }: TemplateEditorProps) {
  const hasSections = !!template.sections && template.sections.length > 0;

  // Flat field data (for backward compatibility)
  const {
    data: flatData,
    errors: flatErrors,
    updateField: updateFlatField,
    validateAll: validateFlat,
    getErrors: getFlatErrors,
    getData: getFlatData,
  } = useTemplateEditor({
    template,
    initialData: initialData
      ? {
          templateId: template.id,
          values: template.fields.reduce((acc, field) => {
            const value = initialData.getValue(field.name);
            acc[field.name] = value ?? '';
            return acc;
          }, {} as Record<string, string>),
          validate: () => true,
          getValue: initialData.getValue,
          setValue: () => {},
          getFieldNames: () => template.fields.map((f) => f.name),
        }
      : undefined,
  });

  // Section-based state
  const [sections, setSections] = useState<Section[]>(template.sections?.map((s) => ({ ...s })) || []);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    hasSections ? sections[0]?.id || null : null
  );
  const [sectionStyles, setSectionStyles] = useState<Record<string, SectionStyle>>({});
  const [sectionFieldValues, setSectionFieldValues] = useState<Record<string, Record<string, string>>>({});
  const [sectionFieldErrors, setSectionFieldErrors] = useState<Record<string, Record<string, string>>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Initialize section field values from initialData
  React.useEffect(() => {
    if (!hasSections || !initialData) return;
    const values: Record<string, Record<string, string>> = {};
    sections.forEach((section) => {
      values[section.id] = {};
      section.fields.forEach((field) => {
        const value = initialData.getValue(field.name);
        values[section.id][field.name] = value ?? '';
      });
    });
    setSectionFieldValues(values);
  }, [hasSections, sections.length, initialData]);

  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedSectionId),
    [sections, selectedSectionId]
  );

  // Section reorder (Up/Down)
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
    // Update order numbers
    newSections.forEach((s, i) => (s.order = i + 1));
  };

  // Update section field value
  const updateSectionField = (sectionId: string, fieldName: string, value: string) => {
    setSectionFieldValues((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [fieldName]: value,
      },
    }));
    // Clear error on change
    setSectionFieldErrors((prev) => {
      const errors = { ...(prev[sectionId] || {}) };
      delete errors[fieldName];
      return { ...prev, [sectionId]: errors };
    });
    // Notify parent of field change for real-time sync
    onFieldChange?.(sectionId, fieldName, value);
  };

  // Validate all sections
  const validateAllSections = (): boolean => {
    let valid = true;
    const allErrors: Record<string, Record<string, string>> = {};

    sections.forEach((section) => {
      const errors: Record<string, string> = {};
      section.fields.forEach((field) => {
        const value = sectionFieldValues[section.id]?.[field.name] ?? '';
        if (field.required && !value.trim()) {
          errors[field.name] = `${field.label}은(는) 필수입니다.`;
          valid = false;
        }
      });
      allErrors[section.id] = errors;
    });

    setSectionFieldErrors(allErrors);
    return valid;
  };

  // Get combined errors for flat field validation fallback
  const getSectionErrors = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    sections.forEach((section) => {
      const fieldErrors = sectionFieldErrors[section.id] || {};
      section.fields.forEach((field) => {
        if (fieldErrors[field.name]) {
          errors[field.name] = fieldErrors[field.name];
        }
      });
    });
    return errors;
  };

  // Collect all data for save
  const getAllData = (): Record<string, string> => {
    const allValues: Record<string, string> = {};
    sections.forEach((section) => {
      const fieldValues = sectionFieldValues[section.id] || {};
      section.fields.forEach((field) => {
        allValues[field.name] = fieldValues[field.name] ?? '';
      });
    });
    return allValues;
  };

  const handleValidate = () => {
    if (hasSections) {
      const isValid = validateAllSections();
      if (!isValid) {
        const errors = getSectionErrors();
        const firstErrorSection = sections.find((s) => {
          const fieldErrors = sectionFieldErrors[s.id] || {};
          return Object.keys(fieldErrors).length > 0;
        });
        if (firstErrorSection) {
          setSelectedSectionId(firstErrorSection.id);
        }
      }
      return isValid;
    }
    return validateFlat();
  };

  const handleSave = () => {
    const isValid = hasSections ? validateAllSections() : validateFlat();
    if (!isValid) return;

    const currentData = hasSections
      ? { templateId: template.id, values: getAllData() }
      : getFlatData();

    if (onUpdate) {
      onUpdate({
        templateId: currentData.templateId,
        values: { ...currentData.values },
      });
    }
  };

  const updateSectionStyle = (sectionId: string, style: SectionStyle) => {
    setSectionStyles((prev) => ({ ...prev, [sectionId]: style }));
    // Also update section's style
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, style: { ...s.style, ...style } } : s))
    );
  };

  // === Section-based UI ===
  if (hasSections) {
    return (
      <div className="template-editor space-y-4">
        {/* Header */}
        <div className="template-editor-header flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {template.name} 편집
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="border-gray-300 text-gray-700 dark:text-gray-300"
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showPreview ? '편집' : '미리보기'}
            </Button>
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
          </div>
        </div>

        {/* Main editor area */}
        <div className="template-editor-body grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Section list */}
          <div className="section-list space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">섹션 목록</h3>
            <p className="text-xs text-gray-500 mb-4">
              Up/Down 버튼으로 순서 변경
            </p>

            <div className="space-y-2">
              {sections.map((section, index) => {
                const isSelected = selectedSectionId === section.id;
                const hasErrors = Object.keys(sectionFieldErrors[section.id] || {}).length > 0;
                const colorClass = SECTION_COLORS[section.type] || 'bg-gray-50 border-gray-200';

                return (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={cn(
                      'relative rounded-lg border-2 transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-blue-500 shadow-md bg-blue-50/50 dark:bg-blue-950/20'
                        : cn('border-transparent hover:border-gray-200 dark:hover:border-gray-700', colorClass),
                      hasErrors && !isSelected && 'border-red-300 dark:border-red-700'
                    )}
                  >
                    {/* Section header */}
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{SECTION_ICONS[section.type]}</span>
                        <div>
                          <span className="font-medium text-sm">{section.label}</span>
                          <span className="ml-2 text-xs text-gray-400">
                            ({section.fields.length} fields)
                          </span>
                        </div>
                        {hasErrors && <AlertCircle className="w-3 h-3 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(index, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(index, 'down');
                          }}
                          disabled={index === sections.length - 1}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Section editor */}
          <div className="section-editors">
            {selectedSection ? (
              <div className="space-y-4">
                {/* Section title */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="text-lg">{SECTION_ICONS[selectedSection.type]}</span>
                    {selectedSection.label}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSectionId(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Section fields */}
                <div className="space-y-3">
                  {selectedSection.fields.map((field) => {
                    const value = sectionFieldValues[selectedSection.id]?.[field.name] ?? '';
                    const error = sectionFieldErrors[selectedSection.id]?.[field.name];

                    return (
                      <div
                        key={field.name}
                        className={cn(
                          'rounded-lg border transition-all duration-200',
                          error
                            ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/20'
                        )}
                      >
                        <div className="ml-8 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <span
                                className={cn(
                                  'font-medium text-sm',
                                  error
                                    ? 'text-red-700 dark:text-red-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                )}
                              >
                                {field.label}
                              </span>
                              {field.required && <span className="text-red-500 text-sm">*</span>}
                              {error && <AlertCircle className="w-3 h-3 text-red-500" />}
                            </div>
                          </div>
                          <FieldEditor
                            field={field}
                            value={value}
                            onChange={(newValue) =>
                              updateSectionField(selectedSection.id, field.name, newValue)
                            }
                            error={error}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Section style editor */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    섹션 스타일
                  </h4>
                  <StyleEditor
                    sectionId={selectedSection.id}
                    sectionLabel={selectedSection.label}
                    style={sectionStyles[selectedSection.id] || selectedSection.style || {}}
                    onChange={(s) => updateSectionStyle(selectedSection.id, s)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
                왼쪽에서 섹션을 선택하여 편집
              </div>
            )}
          </div>
        </div>

        {/* Real-time preview panel */}
        {showPreview && (
          <div className="preview-panel border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              실시간 미리보기
            </h3>
            <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                  const style = sectionStyles[section.id] || section.style || {};
                  const sectionValues = sectionFieldValues[section.id] || {};

                  return (
                    <div
                      key={section.id}
                      className="p-4 border-b last:border-b-0"
                      style={{
                        backgroundColor: style.backgroundColor || '#ffffff',
                        color: style.textColor || '#2d2d2d',
                      }}
                    >
                      <div className="text-xs text-gray-400 mb-1">
                        {SECTION_ICONS[section.type]} {section.label}
                      </div>
                      {section.type === 'image' && (
                        <div className="text-center py-4">
                          {sectionValues.heroTitle && (
                            <p
                              className="font-bold"
                              style={{
                                fontFamily: style.fontFamily,
                                fontSize:
                                  style.fontSize === 'xl'
                                    ? '1.5rem'
                                    : style.fontSize === 'lg'
                                      ? '1.25rem'
                                      : '1rem',
                                color: style.accentColor,
                              }}
                            >
                              {sectionValues.heroTitle}
                            </p>
                          )}
                          {!sectionValues.heroTitle && <p className="text-gray-300">이미지 영역</p>}
                        </div>
                      )}
                      {section.type === 'announcement' && (
                        <div className="space-y-1">
                          {sectionValues.groomName && sectionValues.brideName && (
                            <p className="font-bold text-center">
                              {sectionValues.groomName} & {sectionValues.brideName}
                            </p>
                          )}
                          {sectionValues.date && (
                            <p className="text-center text-sm text-gray-600">{sectionValues.date}</p>
                          )}
                          {sectionValues.location && (
                            <p className="text-center text-sm text-gray-600">{sectionValues.location}</p>
                          )}
                        </div>
                      )}
                      {section.type === 'invitation' && sectionValues.message && (
                        <p className="text-sm whitespace-pre-line text-center">{sectionValues.message}</p>
                      )}
                      {section.type === 'map' && sectionValues.venueName && (
                        <div className="text-center">
                          <p className="font-medium">{sectionValues.venueName}</p>
                          {sectionValues.address && (
                            <p className="text-xs text-gray-500">{sectionValues.address}</p>
                          )}
                        </div>
                      )}
                      {section.type === 'accounts' && (
                        <div className="text-center text-sm space-y-1">
                          {sectionValues.groomPhone && <p>신랑: {sectionValues.groomPhone}</p>}
                          {sectionValues.bridePhone && <p>신부: {sectionValues.bridePhone}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // === Fallback: Flat field-based UI (backward compatibility) ===

  const fieldIds = template.fields.map((f) => f.name);

  return (
    <div className="template-editor space-y-4">
      {/* Header */}
      <div className="template-editor-header flex items-center justify-between">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {template.name} 편집
        </h2>
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
        </div>
      </div>

      {/* Main editor area */}
      <div className="template-editor-body grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Field list */}
        <div className="field-list space-y-3">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">필드 목록</h3>
          <div className="space-y-2">
            {template.fields.map((field) => {
              const error = flatErrors[field.name];
              const isActive = activeField === field.name;

              return (
                <div
                  key={field.name}
                  onClick={() => setActiveField(field.name)}
                  className={cn(
                    'relative rounded-lg border-2 transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'border-blue-500 shadow-md bg-blue-50/50 dark:bg-blue-950/20'
                      : cn('border-transparent hover:border-gray-200 dark:hover:border-gray-700', error ? 'border-red-300' : ''),
                    error && !isActive && 'border-red-300 dark:border-red-700'
                  )}
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span
                        className={cn(
                          'font-medium text-sm',
                          error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {field.label}
                      </span>
                      {field.required && <span className="text-red-500 text-sm">*</span>}
                      {error && <AlertCircle className="w-3 h-3 text-red-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                  {template.fields.find((f) => f.name === activeField)?.label}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveField(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <FieldEditor
                field={template.fields.find((f) => f.name === activeField)!}
                value={flatData[activeField] || ''}
                onChange={(value) => updateFlatField(activeField, value)}
                error={flatErrors[activeField]}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
              필드를 선택하여 편집
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateEditor;
