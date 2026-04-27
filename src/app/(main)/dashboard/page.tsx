'use client';

import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Template } from '@/types/template';
import { Spinner } from '@/components/ui/spinner';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const session = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
    if (!session.session?.access_token && !isDev) {
      setLoading(false);
      return;
    }

    try {
      const headers: Record<string, string> = {};
      let url = '/api/templates';
      
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
        return;
      }

      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('템플릿 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [session.session?.access_token]);

  useEffect(() => {
    const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
    
    if (session.loading) {
      return;
    }

    if (!session.user && !isDev) {
      router.push('/login');
      return;
    }

    fetchTemplates();
  }, [session.loading, session.user, fetchTemplates, router]);

  if (session.loading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session.user) {
    return null;
  }

  const recentTemplates = templates.slice(0, 3);

  return (
    <div className="min-h-screen bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">대시보드</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            환영합니다, {session.user.email}님!
          </p>
        </div>

        {/* 통계 카드 — Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--terracotta-light))] rounded-xl p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">템플릿</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{templates.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--blush-light))] rounded-xl p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9-5.5v12a2 2 0 002 2h8a2 2 0 002-2V10.5a2 2 0 00-.5-1.28l-3.5-3.5A2 2 0 0013.5 4H7a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">초대장</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--sage-light))] rounded-xl p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.337 2.88.9M12 8V6m0 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">구매</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 빠른 액션 — Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/templates" className="block lg:col-span-2">
            <GlassCard className="p-6 hover:-translate-y-1 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-[hsl(var(--primary))/0.1] dark:bg-[hsl(var(--primary))/0.2] rounded-lg p-3">
                  <svg className="w-6 h-6 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">템플릿 라이브러리</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">템플릿 관리 및 제작</p>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link href="/templates?create=true" className="block">
            <GlassCard className="p-6 hover:-translate-y-1 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-[hsl(var(--accent))/0.15] dark:bg-[hsl(var(--accent))/0.2] rounded-lg p-3">
                  <svg className="w-6 h-6 text-[hsl(var(--accent))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">새 초대장 만들기</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">새로운 템플릿 생성</p>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link href="/settings" className="block md:col-span-1">
            <GlassCard className="p-6 hover:-translate-y-1 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-[hsl(var(--secondary))/0.15] dark:bg-[hsl(var(--secondary))/0.2] rounded-lg p-3">
                  <svg className="w-6 h-6 text-[hsl(var(--secondary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">설정</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">계정 및 프로필 설정</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        </div>

        {/* 최근 템플릿 */}
        <GlassCard>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">최근 템플릿</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : recentTemplates.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/templates/${template.id}/edit`}
                  className="block px-6 py-4 hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{template.category || '미분류'}</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">아직 템플릿이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">첫 번째 초대장을 만들어보세요!</p>
              <div className="mt-6">
                <Button asChild variant="gradient">
                  <Link href="/templates">
                    템플릿 라이브러리 가기
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}