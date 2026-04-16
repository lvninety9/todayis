'use client';

import { useState, useCallback, useMemo } from 'react';
import { Template, TemplateData, TemplateField, FieldType } from '@/types/template';
import { validateTemplateData, getDefaultValue } from '@/lib/template-utils';

/**
 * useTemplateEditor Hook
 * 
 * 템플릿 편집을 위한 custom hook
 * - 실시간 데이터 관리
 * - 유효성 검사
 * - 에러 처리
 */

interface UseTemplateEditorOptions {
  template: Template;
  initialData?: TemplateData;
}

interface EditorState {
  data: Record<string, string>;
  errors: Record<string, string>;
}

export function useTemplateEditor({ template, initialData }: UseTemplateEditorOptions) {
  // 초기 데이터 설정
  const initialDataValues: Record<string, string> = useMemo(() => {
    if (initialData) {
      return template.fields.reduce((acc, field) => {
        const value = initialData.getValue(field.name);
        acc[field.name] = value ?? getDefaultValue(null, field);
        return acc;
      }, {} as Record<string, string>);
    }
    
    // 기본값으로 초기화
    return template.fields.reduce((acc, field) => {
      acc[field.name] = getDefaultValue(null, field);
      return acc;
    }, {} as Record<string, string>);
  }, [template, initialData]);

  // 현재 데이터 상태
  const [data, setData] = useState<Record<string, string>>(initialDataValues);
  
  // 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 필드 값 업데이트
  const updateField = useCallback((fieldName: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // 실시간 유효성 검사
    const field = template.fields.find((f) => f.name === fieldName);
    if (field) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        
        // 유효성 검사
        if (field.required && value.trim() === '') {
          newErrors[fieldName] = `${field.label}은(는) 필수입니다`;
        } else if (field.type === 'date' && value.trim() !== '') {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            newErrors[fieldName] = '유효한 날짜를 입력해주세요';
          } else {
            delete newErrors[fieldName];
          }
        } else {
          delete newErrors[fieldName];
        }
        
        return newErrors;
      });
    }
  }, [template.fields]);

  // 전체 유효성 검사
  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of template.fields) {
      const value = data[field.name] || '';

      if (field.required && value.trim() === '') {
        newErrors[field.name] = `${field.label}은(는) 필수입니다`;
      } else if (field.type === 'date' && value.trim() !== '') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          newErrors[field.name] = '유효한 날짜를 입력해주세요';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [template.fields, data]);

  // 에러 상태 가져오기
  const getErrors = useCallback((): Record<string, string> => {
    return errors;
  }, [errors]);

  // 현재 데이터 가져오기
  const getData = useCallback((): TemplateData => {
    // TemplateData 인터페이스를 구현한 객체 반환
    const values = { ...data };
    
    return {
      templateId: template.id,
      values,
      
      validate() {
        return validateTemplateData(this, template.fields);
      },
      
      getValue(fieldName: string) {
        return values[fieldName] ?? null;
      },
      
      setValue(fieldName: string, value: string) {
        values[fieldName] = value;
      },
      
      getFieldNames() {
        return template.fields.map((f) => f.name);
      },
    };
  }, [data, template]);

  return {
    data,
    errors,
    updateField,
    validateAll,
    getErrors,
    getData,
  };
}

export default useTemplateEditor;
