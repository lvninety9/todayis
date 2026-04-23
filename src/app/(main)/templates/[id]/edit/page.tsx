'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { Template, TemplateField, FieldType } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { TemplatePreview } from '@/components/templates/preview/TemplatePreview';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Template Edit 페이지
 * 
 * 템플릿 편집 페이지
 * - GET /api/templates/[id] 로 템플릿 데이터 로드
 * - 템플릿 이름, 카테고리, 썸네일, 레이아웃, 필드 편집
 * - PATCH /api/templates/[id] 로 저장
 */
export default function TemplateEditPage() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  
  const templateId = params?.id as string;
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 편집 상태
  const [name, setName] = useState('');
  const [category, setCategory] = useState('wedding');
  const [thumbnail, setThumbnail] = useState('');
  const [layout, setLayout] = useState('simple');
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  // 카테고리 목록
  const categories = ['wedding', 'birthday', 'custom'];

  // 레이아웃 옵션
  const layoutOptions = [
    { value: 'simple', label: '심플 (단일 컬럼)' },
    { value: 'classic', label: '클래식 (헤더 + 콘텐츠 + 푸터)' },
    { value: 'modern', label: '모던 (그리드 기반)' },
  ];

  // 필드 타입 목록
  const fieldTypes: FieldType[] = ['text', 'date', 'image', 'location'];

  // 템플릿 데이터 로드
  const fetchTemplate = useCallback(async () => {
    try {
      const token = session.session?.access_token;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/templates/${templateId}`, { headers });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (response.status === 404) {
          toast.error('템플릿을 찾을 수 없습니다');
          router.push('/templates');
          return;
        }
        throw new Error('템플릿을 불러오는데 실패했습니다');
      }

      const data: Template = await response.json();
      setTemplate(data);
      setName(data.name);
      setCategory(data.category);
      setThumbnail(data.thumbnail);
      setLayout(data.layout);
      setFields(data.fields || []);
      setIsPublished(data.isPublished);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [templateId, session.session, router]);

  // 마운트 시 템플릿 로드
  useEffect(() => {
    if (!session.loading && !session.user) {
      router.push('/login');
      return;
    }

    if (templateId) {
      fetchTemplate();
    }
  }, [session.loading, session.user, templateId, fetchTemplate, router]);

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

  // 필드 유효성 검사
  const validateFields = (): boolean => {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (!field.name.trim()) {
        setError(`필드 ${i + 1}의 이름은 필수입니다`);
        return false;
      }

      if (!field.label.trim()) {
        setError(`필드 ${i + 1}의 표시 라벨은 필수입니다`);
        return false;
      }

      if (field.name.length > 100) {
        setError(`필드 ${i + 1}의 이름은 100자를 초과할 수 없습니다`);
        return false;
      }

      if (field.label.length > 100) {
        setError(`필드 ${i + 1}의 표시 라벨은 100자를 초과할 수 없습니다`);
        return false;
      }
    }
    return true;
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

    try {
      new URL(thumbnail);
    } catch {
      setError('유효한 URL 형식을 입력해주세요');
      return false;
    }

    // fields가 있을 경우 각 필드 유효성 검사
    if (fields.length > 0 && !validateFields()) {
      return false;
    }

    return true;
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = session.session?.access_token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          name: name.trim(),
          category,
          thumbnail: thumbnail.trim(),
          layout,
          fields,
          is_published: isPublished,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '템플릿 수정에 실패했습니다');
      }

      toast.success('템플릿이 수정되었습니다');
      router.push('/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : '템플릿 수정에 실패했습니다');
      toast.error(err instanceof Error ? err.message : '템플릿 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!confirm('정말 이 템플릿을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = session.session?.access_token;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '템플릿 삭제에 실패했습니다');
      }

      toast.success('템플릿이 삭제되었습니다');
      router.push('/templates');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '템플릿 삭제에 실패했습니다');
    }
  };

  // 로딩 상태
  if (session.loading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // 템플릿이 없거나 에러
  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">템플릿을 찾을 수 없습니다</p>
            <Link
              href="/templates"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              템플릿 라이브러리로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link
              href="/templates"
              className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
            >
              &larr; 템플릿 라이브러리
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              템플릿 편집: {name || template.name}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/templates')}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              삭제
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 편집 폼과 미리보기 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 편집 폼 */}
          <div className="space-y-4">
            {/* 템플릿 이름 */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">템플릿 이름 *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 로맨틱 웨딩"
                disabled={saving}
              />
            </div>

            {/* 카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">카테고리 *</Label>
              <Select value={category} onValueChange={setCategory} disabled={saving}>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'wedding' ? '웨딩' : cat === 'birthday' ? '생일' : '커스텀'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 썸네일 URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">썸네일 URL *</Label>
              <Input
                id="edit-thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={saving}
              />
            </div>

            {/* 레이아웃 설정 */}
            <div className="space-y-2">
              <Label htmlFor="edit-layout">레이아웃 *</Label>
              <Select value={layout} onValueChange={setLayout} disabled={saving}>
                <SelectTrigger id="edit-layout">
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

            {/* 공개 여부 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-published"
                checked={isPublished}
                onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                disabled={saving}
              />
              <Label htmlFor="edit-published" className="text-sm font-normal">
                공개 템플릿으로 설정
              </Label>
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
                  disabled={saving}
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
                          disabled={saving}
                        >
                          제거
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edit-field-name-${index}`}>필드 이름</Label>
                        <Input
                          id={`edit-field-name-${index}`}
                          value={field.name}
                          onChange={(e) =>
                            updateField(index, { name: e.target.value })
                          }
                          placeholder="예: groom_name"
                          disabled={saving}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edit-field-label-${index}`}>표시 라벨</Label>
                        <Input
                          id={`edit-field-label-${index}`}
                          value={field.label}
                          onChange={(e) =>
                            updateField(index, { label: e.target.value })
                          }
                          placeholder="예: 신랑 이름"
                          disabled={saving}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edit-field-type-${index}`}>필드 타입</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) =>
                            updateField(index, { type: value as FieldType })
                          }
                          disabled={saving}
                        >
                          <SelectTrigger id={`edit-field-type-${index}`}>
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
                          id={`edit-field-required-${index}`}
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            updateField(index, { required: checked as boolean })
                          }
                          disabled={saving}
                        />
                        <Label
                          htmlFor={`edit-field-required-${index}`}
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
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="space-y-4">
            <div className="sticky top-6">
              <Label className="text-lg font-semibold mb-3 block">미리보기</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <TemplatePreview
                  template={{
                    ...template,
                    name: name || '템플릿 이름',
                    category,
                    thumbnail: thumbnail || '',
                    layout,
                    fields,
                    isPublished,
                  }}
                  data={{
                    templateId: templateId,
                    values: {},
                    validate: () => true,
                    getValue: () => null,
                    setValue: () => {},
                    getFieldNames: () => fields.map((f) => f.name),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
