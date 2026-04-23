'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { Template } from '@/types/template';
import { InvitationFormData, InvitationEditor } from '@/components/publish/InvitationEditor';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import Link from 'next/link';

interface TemplateInfo {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  is_premium: boolean;
  category: string;
  layout: string;
  fields: Array<{
    name: string;
    type: string;
    label: string;
    required: boolean;
    defaultValue: string | null;
  }>;
}

interface CreateResponse {
  invitation: Record<string, unknown>;
  slug: string;
  message: string;
}

export default function CreateInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();

  const templateId = params?.templateId as string;

  const [template, setTemplate] = useState<TemplateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const data: TemplateInfo = await response.json();
      setTemplate(data);
      setError(null);
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

  const handleSave = useCallback(async (formData: InvitationFormData) => {
    setCreating(true);
    setError(null);

    try {
      const token = session.session?.access_token;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          templateId,
          title: formData.title,
          data: formData.data,
          is_published: formData.is_published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '초대장 생성에 실패했습니다');
      }

      const data: CreateResponse = await response.json();
      toast.success(data.message || '초대장이 생성되었습니다');

      const redirectPath = `/${data.slug}`;
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : '초대장 생성에 실패했습니다';
      setError(message);
      toast.error(message);
    } finally {
      setCreating(false);
    }
  }, [templateId, session.session, router]);

  const handleCancel = useCallback(() => {
    router.push(`/templates/${templateId}`);
  }, [router, templateId]);

  if (session.loading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-6">
          <Link
            href={`/templates/${templateId}`}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            &larr; 템플릿 상세로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            초대장 만들기: {template.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            초대장 정보를 입력하고 공개 여부를 설정하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 편집기 */}
        <InvitationEditor
          template={template as unknown as Template}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={creating}
        />
      </div>
    </div>
  );
}
