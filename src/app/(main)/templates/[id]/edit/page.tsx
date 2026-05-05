'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { Template, Section } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { TemplatePreview } from '@/components/templates/preview/TemplatePreview';
import { TemplateEditor } from '@/components/templates/editor/TemplateEditor';
import { toast } from 'sonner';
import Link from 'next/link';
import { Monitor, Smartphone, Eye, Split, Save } from 'lucide-react';

/**
 * Template Edit 페이지 (Section 기반)
 * 
 * - Section 기반 템플릿: TemplateEditor 컴포넌트 사용
 * - Flat 필드 기반 템플릿: 기존 폼 사용 (하위 호환)
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

  // Preview state
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [splitView, setSplitView] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  // Edit state (flat fields for backward compatibility)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('wedding');
  const [thumbnail, setThumbnail] = useState('');
  const [layout, setLayout] = useState('simple');
  const [isPublished, setIsPublished] = useState(false);

  // Section field values (for section-based templates)
  const [sectionFieldValues, setSectionFieldValues] = useState<Record<string, Record<string, string>>>({});

  // Sync field changes from TemplateEditor to page state
  const handleFieldChange = useCallback(
    (sectionId: string, fieldName: string, value: string) => {
      setSectionFieldValues((prev) => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          [fieldName]: value,
        },
      }));
    },
    []
  );

  const categories = ['wedding', 'birthday', 'custom'];
  const layoutOptions = [
    { value: 'simple', label: '심플 (단일 컬럼)' },
    { value: 'classic', label: '클래식 (헤더 + 콘텐츠 + 푸터)' },
    { value: 'modern', label: '모던 (그리드 기반)' },
  ];

  // 템플릿 데이터 로드
  const fetchTemplate = useCallback(async () => {
    try {
      const token = session.session?.access_token;
      const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
      const headers: Record<string, string> = {};
      let url = `/api/templates/${templateId}`;

      if (isDev && !token) {
        url += '?dev=true';
      } else if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

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
      setIsPublished(data.isPublished);
      setError(null);

      // Initialize section field values
      if (data.sections && data.sections.length > 0) {
        const values: Record<string, Record<string, string>> = {};
        data.sections.forEach((section) => {
          values[section.id] = {};
          section.fields.forEach((field) => {
            values[section.id][field.name] = field.defaultValue ?? '';
          });
        });
        setSectionFieldValues(values);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [templateId, session.session, router]);

  useEffect(() => {
    if (!session.loading && !session.user) {
      router.push('/login');
      return;
    }
    if (templateId) {
      fetchTemplate();
    }
  }, [session.loading, session.user, templateId, fetchTemplate, router]);

  // Debounced preview update
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewKey((k) => k + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [name, category, thumbnail, layout, sectionFieldValues]);

  const previewWidth = previewMode === 'mobile' ? 375 : 1200;

  const hasSections = !!template?.sections && template.sections.length > 0;

  // Section-based save
  const handleSectionSave = useCallback(
    (data: { templateId: string; values: Record<string, string> }) => {
      handleSaveFlat(data.values);
    },
    []
  );

  // Flat field save (for backward compatibility)
  const handleSaveFlat = async (fieldValues?: Record<string, string>) => {
    if (saving) return;
    setSaving(true);
    setError(null);

    if (!name.trim()) {
      setError('템플릿 이름을 입력해주세요');
      setSaving(false);
      return;
    }

    try {
      const token = session.session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      let url = `/api/templates/${templateId}`;
      const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';

      if (isDev && !token) {
        url += '?dev=true';
      } else if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const body: any = {
        name: name.trim(),
        category,
        thumbnail: thumbnail.trim(),
        layout,
        is_published: isPublished,
      };

      if (hasSections && fieldValues) {
        // For section-based templates, also save sections structure
        body.sections = template?.sections?.map((section) => ({
          ...section,
          fields: section.fields.map((field) => ({
            ...field,
            defaultValue: fieldValues[field.name] ?? field.defaultValue,
          })),
        }));
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
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

  const handleDelete = async () => {
    if (!confirm('정말 이 템플릿을 삭제하시겠습니까?')) return;
    try {
      const token = session.session?.access_token;
      const headers: Record<string, string> = {};
      let url = `/api/templates/${templateId}`;
      const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';

      if (isDev && !token) {
        url += '?dev=true';
      } else if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { method: 'DELETE', headers });

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

  // Build preview data from section field values
  const previewData = React.useMemo(() => {
    if (!template) return null;

    const values: Record<string, string> = {};
    if (hasSections) {
      Object.values(sectionFieldValues).forEach((sectionValues) => {
        Object.assign(values, sectionValues);
      });
    } else {
      template.fields.forEach((field) => {
        values[field.name] = field.defaultValue ?? '';
      });
    }

    return {
      templateId: template.id,
      values,
      validate: () => true,
      getValue: (name: string) => values[name] ?? null,
      setValue: () => {},
      getFieldNames: () => Object.keys(values),
    };
  }, [template, sectionFieldValues, hasSections]);

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

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">템플릿을 찾을 수 없습니다</p>
            <Link href="/templates" className="inline-block mt-4 text-blue-600 hover:underline">
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
              &larr; 템플릿 라이브러리
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">템플릿 편집: {name || template.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/templates')}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              삭제
            </Button>
            <Button onClick={() => handleSaveFlat()} disabled={saving}>
              {saving ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Section-based template: use TemplateEditor */}
        {hasSections ? (
          <div className="space-y-6">
            {/* Template metadata (name, category, etc.) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="edit-name">템플릿 이름</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 로맨틱 웨딩"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">카테고리</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="edit-category">
                    <SelectValue />
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
              <div className="space-y-2">
                <Label htmlFor="edit-layout">레이아웃</Label>
                <Select value={layout} onValueChange={setLayout}>
                  <SelectTrigger id="edit-layout">
                    <SelectValue />
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
            </div>

            {/* Section editor */}
            <TemplateEditor
              template={{
                ...template,
                name,
                category,
                thumbnail,
                layout,
                isPublished,
                sections: template.sections?.map((section) => ({
                  ...section,
                  fields: section.fields.map((field) => ({
                    ...field,
                    defaultValue: sectionFieldValues[section.id]?.[field.name] ?? field.defaultValue,
                  })),
                })),
              }}
              initialData={previewData ?? undefined}
              onUpdate={handleSectionSave}
              onFieldChange={handleFieldChange}
            />

            {/* Preview */}
            {splitView && previewData && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-lg font-semibold">미리보기</Label>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className="h-7 px-2"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className="h-7 px-2"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg bg-gray-50 overflow-hidden transition-all duration-300" style={{ maxWidth: previewWidth }}>
                  <TemplatePreview key={previewKey} template={template} data={previewData} />
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  {previewMode === 'mobile' ? '모바일 (375px)' : '데스크톱 (1200px)'}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Flat field-based template (backward compatibility) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Edit form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">템플릿 이름 *</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 로맨틱 웨딩"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">카테고리 *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="edit-category">
                    <SelectValue />
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
              <div className="space-y-2">
                <Label htmlFor="edit-thumbnail">썸네일 URL *</Label>
                <Input
                  id="edit-thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-layout">레이아웃 *</Label>
                <Select value={layout} onValueChange={setLayout}>
                  <SelectTrigger id="edit-layout">
                    <SelectValue />
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

              {/* Flat field editor */}
              <div className="space-y-3">
                <Label>템플릿 필드</Label>
                {template.fields.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 border rounded-lg">
                    필드가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {template.fields.map((field, index) => (
                      <FlatFieldRow
                        key={field.name}
                        field={field}
                        index={index}
                        onChange={(updatedField) => {
                          // Flat field editing - not used for section-based templates
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Preview */}
            {splitView && previewData && (
              <div className="space-y-4">
                <div className="sticky top-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-lg font-semibold">미리보기</Label>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <Button
                        variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                        className="h-7 px-2"
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewMode('mobile')}
                        className="h-7 px-2"
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div
                    className="border rounded-lg bg-gray-50 overflow-hidden transition-all duration-300"
                    style={{ maxWidth: previewWidth }}
                  >
                    <TemplatePreview
                      key={previewKey}
                      template={{
                        ...template,
                        name: name || '템플릿 이름',
                        category,
                        thumbnail,
                        layout,
                        isPublished,
                      }}
                      data={previewData}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    {previewMode === 'mobile' ? '모바일 (375px)' : '데스크톱 (1200px)'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating toolbar (mobile) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSplitView(!splitView)}
              className="h-8 px-2"
              title={splitView ? '미리보기 숨기기' : '미리보기 표시'}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSaveFlat()}
              disabled={saving}
              className="h-8 px-2"
              title="저장하기"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!splitView && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSplitView(true)}
              className="bg-white dark:bg-gray-800 shadow-lg"
            >
              <Split className="w-4 h-4 mr-1" />
              미리보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Flat field row component (backward compatibility)
 */
function FlatFieldRow({
  field,
  index,
  onChange,
}: {
  field: any;
  index: number;
  onChange: (field: any) => void;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
      <div className="flex justify-between items-center">
        <span className="font-medium">{field.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">이름</Label>
          <Input value={field.name} disabled className="text-sm" />
        </div>
        <div>
          <Label className="text-xs">타입</Label>
          <Input value={field.type} disabled className="text-sm" />
        </div>
      </div>
    </div>
  );
}
