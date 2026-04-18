'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Template, TemplateField, FieldType } from '@/types/template';
import { TemplatePreview } from '../preview/TemplatePreview';
import { TemplateData } from '@/types/template';
import { Checkbox } from '@/components/ui/checkbox';

interface TemplateUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    category: string;
    thumbnail: string;
    fields: TemplateField[];
    layout: string;
  }) => Promise<void>;
}

/**
 * TemplateUploadDialog 컴포넌트
 * 
 * 새 템플릿 생성 다이얼로그
 * - 템플릿 이름, 카테고리, 썸네일 URL 입력
 * - 미리보기 기능
 * - 유효성 검사 및 에러 처리
 */
export function TemplateUploadDialog({
  open,
  onOpenChange,
  onSubmit,
}: TemplateUploadDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('wedding');
  const [thumbnail, setThumbnail] = useState('');
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [layout, setLayout] = useState('simple');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 목록
  const categories = ['wedding', 'birthday', 'custom'];

  // 필드 타입 목록
  const fieldTypes: FieldType[] = ['text', 'date', 'image', 'location'];

  // 레이아웃 옵션
  const layoutOptions = [
    { value: 'simple', label: '심플 (단일 컬럼)' },
    { value: 'classic', label: '클래식 (헤더 + 콘텐츠 + 푸터)' },
    { value: 'modern', label: '모던 (그리드 기반)' },
  ];

  // 필드 추가
  const addField = () => {
    const newField: TemplateField = {
      name: `field_${fields.length + 1}`,
      type: 'text',
      label: `필드 ${fields.length + 1}`,
      required: false,
      defaultValue: null,
    };
    setFields([...fields, newField]);
  };

  // 필드 제거
  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // 필드 업데이트
  const updateField = (index: number, data: Partial<TemplateField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...data };
    setFields(updatedFields);
  };

  // 유효성 검사
  const validateForm = (): boolean => {
    setError(null);

    if (!name.trim()) {
      setError('템플릿 이름을 입력해주세요');
      return false;
    }

    if (name.length < 1 || name.length > 255) {
      setError('템플릿 이름은 1-255 자이어야 합니다');
      return false;
    }

    if (!category) {
      setError('카테고리를 선택해주세요');
      return false;
    }

    if (!thumbnail.trim()) {
      setError('썸네일 URL 을 입력해주세요');
      return false;
    }

    // URL 형식 검사
    try {
      new URL(thumbnail);
    } catch {
      setError('유효한 URL 형식을 입력해주세요');
      return false;
    }

    return true;
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        category,
        thumbnail: thumbnail.trim(),
        fields,
        layout,
      });

      // 성공 후 초기화
      setName('');
      setCategory('wedding');
      setThumbnail('');
      setFields([]);
      setLayout('simple');
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '템플릿 생성에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 미리보기 데이터 생성
  const previewData: TemplateData = {
    templateId: 'preview',
    values: {},
    validate: () => true,
    getValue: () => null,
    setValue: () => {},
    getFieldNames: () => [],
  };

  // 미리보기 템플릿
  const previewTemplate: Template = {
    id: 'preview',
    userId: 'preview',
    name: name || '템플릿 이름',
    category,
    thumbnail: thumbnail || '',
    fields: [],
    layout: '',
    isPublished: false,
    downloadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 템플릿 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 템플릿 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">템플릿 이름 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 로맨틱 웨딩"
              disabled={isSubmitting}
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
              <SelectTrigger id="category">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'wedding' ? '웨딩' : cat === 'birthday' ? '생일' : '커스텀'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 썸네일 URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">썸네일 URL *</Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>

          {/* 레이아웃 설정 */}
          <div className="space-y-2">
            <Label htmlFor="layout">레이아웃 *</Label>
            <Select value={layout} onValueChange={setLayout} disabled={isSubmitting}>
              <SelectTrigger id="layout">
                <SelectValue placeholder="레이아웃 선택" />
              </SelectTrigger>
              <SelectContent>
                {layoutOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 필드 설정 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>템플릿 필드</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addField}
                disabled={isSubmitting}
              >
                + 필드 추가
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-4 text-gray-500 border rounded-lg">
                필드가 없습니다. 필드를 추가해주세요.
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">필드 {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(index)}
                        disabled={isSubmitting}
                      >
                        제거
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`field-name-${index}`}>필드 이름</Label>
                      <Input
                        id={`field-name-${index}`}
                        value={field.name}
                        onChange={(e) =>
                          updateField(index, { name: e.target.value })
                        }
                        placeholder="예: groom_name"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`field-label-${index}`}>표시 라벨</Label>
                      <Input
                        id={`field-label-${index}`}
                        value={field.label}
                        onChange={(e) =>
                          updateField(index, { label: e.target.value })
                        }
                        placeholder="예: 신랑 이름"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`field-type-${index}`}>필드 타입</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) =>
                          updateField(index, { type: value as FieldType })
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id={`field-type-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === 'text'
                                ? '텍스트'
                                : type === 'date'
                                ? '날짜'
                                : type === 'image'
                                ? '이미지'
                                : '위치'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-required-${index}`}
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          updateField(index, { required: checked as boolean })
                        }
                        disabled={isSubmitting}
                      />
                      <Label
                        htmlFor={`field-required-${index}`}
                        className="text-sm font-normal"
                      >
                        필수 필드
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 미리보기 */}
          {thumbnail && (
            <div className="space-y-2">
              <Label>미리보기</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <TemplatePreview template={previewTemplate} data={previewData} />
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim() || !thumbnail.trim()}
            >
              {isSubmitting ? '생성 중...' : '생성하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateUploadDialog;
