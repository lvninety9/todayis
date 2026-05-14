'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { Template } from '@/types/template';
import { TemplateLibrary } from '@/components/templates/library/TemplateLibrary';
import { TemplateUploadDialog } from '@/components/templates/library/TemplateUploadDialog';
import { TemplatePreviewModal } from '@/components/templates/preview/TemplatePreviewModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { ShareDialog } from '@/components/publish/ShareDialog';
import { Share2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Grid3X3,
  List,
} from 'lucide-react';

/**
 * Templates 페이지
 * 
 * 템플릿 라이브러리 페이지
 * - 템플릿 목록 조회 및 관리
 * - 생성, 편집, 삭제 기능
 * - 필터 및 검색 기능
 */
export default function TemplatesPage() {
  const session = useSession();
  const router = useRouter();
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'name'>('latest');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  // 템플릿 목록 조회
  const fetchTemplates = useCallback(async () => {
    // Dev mode: session 없이도 진행
    const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
    if (!session.session?.access_token && !isDev) {
      setLoading(false);
      return;
    }

    try {
      const headers: Record<string, string> = {};
      let url = '/api/templates';
      
      // 로그인한 사용자는 토큰 사용, 비로그인时만 dev=true
      if (isDev && !session.session?.access_token) {
        url += '?dev=true';
      } else if (session.session?.access_token) {
        headers['Authorization'] = `Bearer ${session.session.access_token}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          setLoading(false);
          return;
        }
        throw new Error('템플릿을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTemplates(data.templates || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [session.session?.access_token]);

  // 마운트 시 템플릿 조회
  useEffect(() => {
    if (session.loading) {
      return;
    }

    if (!session.user) {
      router.push('/login');
      return;
    }

    fetchTemplates();
  }, [session.loading, session.user, fetchTemplates, router]);

  // 템플릿 생성
  const handleCreate = async (data: {
    name: string;
    category: string;
    thumbnail: string;
    fields: any[];
    layout: string;
  }) => {
    const token = session.session?.access_token;
    const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    let url = '/api/templates';
    
    if (isDev && !token) {
      url += '?dev=true';
    } else if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '템플릿 생성에 실패했습니다');
    }

    toast.success('템플릿이 생성되었습니다');
    fetchTemplates();
  };

  // 템플릿 선택 (편집)
  const handleSelect = (template: Template) => {
    router.push(`/templates/${template.id}/edit`);
  };

  // 템플릿 삭제
  const handleDelete = async (template: Template) => {
    const token = session.session?.access_token;
    const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
    
    const headers: Record<string, string> = {};
    let url = `/api/templates/${template.id}`;
    
    if (isDev && !token) {
      url += '?dev=true';
    } else if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '템플릿 삭제에 실패했습니다');
    }

    toast.success('템플릿이 삭제되었습니다');
    fetchTemplates();
  };

  // 필터링
  const handleFilter = (category: string) => {
    // API 에서 필터링 처리
  };

  // 검색
  const handleSearch = (query: string) => {
    // API 에서 검색 처리
  };

  // 미리보기 열기
  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  // 미리보기 닫기
  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewTemplate(null);
  };

  // 미리보기용 TemplateData 생성
  const getPreviewData = (template: Template) => {
    const values: Record<string, string> = {};
    
    // Section-based template: sections[].fields[].defaultValue에서 값 읽기
    if (template.sections && template.sections.length > 0) {
      template.sections.forEach((section) => {
        section.fields.forEach((field) => {
          values[field.name] = field.defaultValue ?? '';
        });
      });
    } else {
      // Flat field-based template (backward compatibility)
      template.fields.forEach((field) => {
        values[field.name] = field.defaultValue ?? '';
      });
    }

    return {
      templateId: template.id,
      values,
      validate: () => true,
      getValue: (fieldName: string) => values[fieldName] ?? null,
      setValue: () => {},
      getFieldNames: () => Object.keys(values),
    };
  };

  // 공유 핸들러 — 초대장 생성 후 링크 복사
  const handleShare = async (template: Template) => {
    const token = session.session?.access_token;
    if (!token) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setShareLoading(true);
    try {
      // 섹션 기반에서 데이터 추출
      const values: Record<string, string> = {};
      if (template.sections && template.sections.length > 0) {
        template.sections.forEach((section) => {
          section.fields.forEach((field) => {
            values[field.name] = field.defaultValue ?? '';
          });
        });
      } else {
        template.fields.forEach((field) => {
          values[field.name] = field.defaultValue ?? '';
        });
      }

      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: template.id,
          title: template.name,
          data: values,
          is_published: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '초대장 생성에 실패했습니다');
      }

      const data = await response.json();
      const url = `${window.location.origin}/${data.invitation.slug}`;
      setShareUrl(url);
      setShareOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '공유 링크 생성에 실패했습니다');
    } finally {
      setShareLoading(false);
    }
  };

  // 로딩 상태
  if (session.loading || loading) {
    return (
      <div className="min-h-screen bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">템플릿 라이브러리</h1>
            <Button onClick={() => setDialogOpen(true)}>
              + 새 템플릿 만들기
            </Button>
          </div>
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // 인증되지 않은 사용자
  if (!session.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">템플릿 라이브러리</h1>
          <div className="flex items-center gap-3">
            {/* 정렬 셀렉트 */}
            <Select value={sortBy} onValueChange={(v: 'latest' | 'popular' | 'name') => setSortBy(v)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
                <SelectItem value="name">이름순</SelectItem>
              </SelectContent>
            </Select>
            
            {/* 그리드/리스트 토글 */}
            <div className="flex border rounded-md dark:border-gray-700">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
                aria-label="그리드 보기"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode('list')}
                aria-label="리스트 보기"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button onClick={() => setDialogOpen(true)} size="lg">
              + 새 템플릿 만들기
            </Button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <Button
              onClick={fetchTemplates}
              variant="outline"
              className="mt-2"
            >
              다시 시도
            </Button>
          </div>
        )}

        {/* 템플릿 라이브러리 */}
        <TemplateLibrary
          templates={templates}
          mode="edit"
          onSelect={handleSelect}
          onPreview={handlePreview}
          onDelete={handleDelete}
          onCreate={() => setDialogOpen(true)}
          onShare={handleShare}
          onFilter={handleFilter}
          onSearch={handleSearch}
          loading={loading}
          viewMode={viewMode}
          sortBy={sortBy}
        />
      </div>

      {/* 템플릿 생성 다이얼로그 */}
      <TemplateUploadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />

      {/* 템플릿 미리보기 모달 */}
      {previewTemplate && (
       <TemplatePreviewModal
            template={previewTemplate}
            data={getPreviewData(previewTemplate)}
            open={previewOpen}
            onClose={handlePreviewClose}
          />
        )}

        {/* 공유 다이얼로그 */}
        <ShareDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          shareUrl={shareUrl}
          title="초대장 공유"
        />
    </div>
  );
}
