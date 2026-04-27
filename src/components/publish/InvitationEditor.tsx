'use client';

import React, { useState, useCallback } from 'react';
import { Template, TemplateField } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

export interface InvitationFormData {
  title: string;
  data: Record<string, string>;
  is_published: boolean;
}

interface InvitationEditorProps {
  template: Template;
  initialData?: Record<string, string>;
  onSave: (formData: InvitationFormData) => void;
  onCancel: () => void;
  saving?: boolean;
}

const fieldInputType: Record<TemplateField['type'], string> = {
  text: 'text',
  date: 'date',
  image: 'text',
  location: 'text',
  account: 'text',
  audio: 'text',
  video: 'text',
  gallery: 'text',
  message: 'text',
  dresscode: 'text',
  parents: 'text',
};

export function InvitationEditor({
  template,
  initialData,
  onSave,
  onCancel,
  saving,
}: InvitationEditorProps) {
  const [title, setTitle] = useState('');
  const [data, setData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of template.fields) {
      initial[field.name] =
        initialData?.[field.name] ?? field.defaultValue ?? '';
    }
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublished, setIsPublished] = useState(false);

  const handleFieldChange = useCallback(
    (fieldName: string, value: string) => {
      setData((prev) => ({ ...prev, [fieldName]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = '초대장 제목은 필수입니다.';
    }

    for (const field of template.fields) {
      const value = data[field.name] ?? '';
      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label}은(는) 필수입니다.`;
      }
      if (field.type === 'date' && value.trim()) {
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) {
          newErrors[field.name] = '유효한 날짜를 입력해주세요.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, data, template.fields]);

  const handleSave = useCallback(() => {
    if (!validate()) {
      toast.error('입력값을 확인해주세요.');
      return;
    }
    onSave({ title: title.trim(), data: { ...data }, is_published: isPublished });
  }, [validate, onSave, title, data, isPublished]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">
          {template.name} - 초대장 정보
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="invitation-title">초대장 제목</Label>
          <Input
            id="invitation-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: Jay & Mina의 웨딩"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* 필드 값 입력 */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">필드 값</Label>
          {template.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label
                htmlFor={`field-${field.name}`}
                className="text-sm"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={`field-${field.name}`}
                type={fieldInputType[field.type]}
                value={data[field.name] ?? ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className={errors[field.name] ? 'border-red-500' : ''}
              />
              {errors[field.name] && (
                <p className="text-sm text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* 공개 토글 */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="is-published"
            checked={isPublished}
            onCheckedChange={(checked) =>
              setIsPublished(checked === true)
            }
          />
          <Label
            htmlFor="is-published"
            className="text-sm font-normal"
          >
            생성 후 바로 공개하기
          </Label>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          취소
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '생성 중...' : '생성하기'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default InvitationEditor;
