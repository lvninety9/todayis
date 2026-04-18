'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { Template } from '@/types/template';
import { TemplateLibrary } from '@/components/templates/library/TemplateLibrary';
import { TemplateUploadDialog } from '@/components/templates/library/TemplateUploadDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

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

  // 템플릿 목록 조회
  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/templates');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('템플릿을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTemplates(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 마운트 시 템플릿 조회
  useEffect(() => {
    if (!session.loading && !session.user) {
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
  }) => {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    setSelectedTemplate(template);
    // TODO: Navigate to editor page
    toast.info('편집 기능은 곧 제공됩니다');
  };

  // 템플릿 삭제
  const handleDelete = async (template: Template) => {
    const response = await fetch(`/api/templates/${template.id}`, {
      method: 'DELETE',
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

  // 로딩 상태
  if (session.loading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">템플릿 라이브러리</h1>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">템플릿 라이브러리</h1>
          <Button onClick={() => setDialogOpen(true)} size="lg">
            + 새 템플릿 만들기
          </Button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
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
          onDelete={handleDelete}
          onCreate={() => setDialogOpen(true)}
          onFilter={handleFilter}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>

      {/* 템플릿 생성 다이얼로그 */}
      <TemplateUploadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
}
