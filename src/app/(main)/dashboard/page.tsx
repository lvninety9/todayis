'use client';

import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Template } from '@/types/template';
import { Spinner } from '@/components/ui/spinner';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DashboardStats {
  totalTemplates: number;
  totalInvitations: number;
  totalPurchases: number;
  totalViews: number;
  monthlyGrowth: number;
}

interface TemplateWithViews extends Template {
  viewCount?: number;
}

export default function DashboardPage() {
  const session = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTemplate, setShareTemplate] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalTemplates: 0,
    totalInvitations: 0,
    totalPurchases: 0,
    totalViews: 0,
    monthlyGrowth: 15,
  });

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
      const templatesList = data.templates || [];
      setTemplates(templatesList);
      
      // Calculate stats from templates
      setStats({
        totalTemplates: templatesList.length,
        totalInvitations: templatesList.reduce((sum: number, t: TemplateWithViews) => sum + (t.downloadCount || 0), 0),
        totalPurchases: templatesList.filter((t: TemplateWithViews) => t.isPurchased).length,
        totalViews: templatesList.reduce((sum: number, t: TemplateWithViews) => sum + (t.viewCount || 0), 0),
        monthlyGrowth: 15,
      });
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] dark:bg-[var(--color-surface)]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session.user) {
    return null;
  }

  const recentTemplates = templates.slice(0, 3);

  const handleShare = (template: Template) => {
    setShareTemplate(template);
    setShareOpen(true);
    setCopied(false);
  };

  const handleCopyShareLink = async () => {
    if (!shareTemplate) return;
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/templates/${shareTemplate.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('복사에 실패했습니다. 수동으로 복사해주세요.');
    }
  };

  const handlePublish = (template: Template) => {
    router.push(`/templates/${template.id}/edit`);
  };

  const statCards = [
    {
      title: '템플릿',
      value: stats.totalTemplates,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      gradient: 'from-[hsl(var(--primary))] to-[hsl(var(--terracotta-light))]',
      growth: '+12%',
    },
    {
      title: '초대장',
      value: stats.totalInvitations,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9-5.5v12a2 2 0 002 2h8a2 2 0 002-2V10.5a2 2 0 00-.5-1.28l-3.5-3.5A2 2 0 0013.5 4H7a2 2 0 00-2 2z" />
        </svg>
      ),
      gradient: 'from-[hsl(var(--accent))] to-[hsl(var(--blush-light))]',
      growth: '+8%',
    },
    {
      title: '구매',
      value: stats.totalPurchases,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.337 2.88.9M12 8V6m0 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
      gradient: 'from-[hsl(var(--secondary))] to-[hsl(var(--sage-light))]',
      growth: '+23%',
    },
    {
      title: '조회수',
      value: stats.totalViews,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: 'from-[hsl(var(--terracotta-light))] to-[hsl(var(--primary))]',
      growth: '+15%',
    },
  ];

  const quickActions = [
    {
      href: '/templates',
      title: '템플릿 라이브러리',
      description: '템플릿 관리 및 제작',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      color: 'from-[hsl(var(--primary))/10] to-[hsl(var(--primary))/5]',
      iconColor: 'text-[hsl(var(--primary))]',
    },
    {
      href: '/templates?create=true',
      title: '새 초대장 만들기',
      description: '새로운 템플릿 생성',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'from-[hsl(var(--accent))/15] to-[hsl(var(--accent))/5]',
      iconColor: 'text-[hsl(var(--accent))]',
    },
    {
      href: '/settings',
      title: '설정',
      description: '계정 및 프로필 설정',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-[hsl(var(--secondary))/15] to-[hsl(var(--secondary))/5]',
      iconColor: 'text-[hsl(var(--secondary))]',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 scroll-reveal">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
            대시보드
          </h1>
          <p className="mt-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
            환영합니다, {session.user.email}님!
          </p>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 scroll-reveal-stagger">
          {statCards.map((stat, index) => (
            <GlassCard key={index} className={`p-6 ${index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">{stat.title}</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-xs text-green-500 font-medium">{stat.growth}</span>
                    <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] ml-1">전월 대비</span>
                  </div>
                </div>
                <div className={`flex-shrink-0 bg-gradient-to-br ${stat.gradient} rounded-xl p-3 shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
              {/* Mini bar chart visualization */}
              <div className="mt-4 flex items-end gap-1 h-8">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-[hsl(var(--primary))/30] to-[hsl(var(--primary))/60] transition-all duration-300 hover:from-[hsl(var(--primary))/50] hover:to-[hsl(var(--primary))/80]"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 scroll-reveal-stagger">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className="block scroll-reveal-up">
              <GlassCard className="p-6 hover:-translate-y-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 bg-gradient-to-br ${action.color} rounded-lg p-3`}>
                    <div className={action.iconColor}>
                      {action.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                      {action.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">
                      {action.description}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Recent Templates with Quick Actions */}
        <GlassCard className="scroll-reveal">
          <div className="px-6 py-4 border-b border-[var(--color-border)] dark:border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              최근 템플릿
            </h2>
            <Link href="/templates" className="text-sm text-[hsl(var(--primary))] hover:underline">
              전체 보기 →
            </Link>
          </div>

          {recentTemplates.length > 0 ? (
            <div className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border)]">
              {recentTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group px-6 py-4 hover:bg-[var(--color-surface-raised)] dark:hover:bg-[var(--color-surface-raised)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--primary))/10] to-[hsl(var(--accent))/10] rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)] truncate">
                          {template.name}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">
                          {template.category || '미분류'}
                          {template.isPurchased && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[hsl(var(--primary))/10] to-[hsl(var(--accent))/10] text-[hsl(var(--primary))]">
                              Premium
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="ghost" className="text-sm" onClick={() => router.push(`/templates/${template.id}/edit`)}>
                        편집
                      </Button>
                      <Button size="sm" variant="ghost" className="text-sm" onClick={() => handleShare(template)}>
                        공유
                      </Button>
                      <Button size="sm" variant="ghost" className="text-sm" onClick={() => handlePublish(template)}>
                        발행
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                아직 템플릿이 없습니다
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">
                첫 번째 초대장을 만들어보세요!
              </p>
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

        {/* Share Dialog */}
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>초대장 공유</DialogTitle>
              <DialogDescription>
                {shareTemplate?.name} 초대장 링크를 공유하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareTemplate ? `${typeof window !== 'undefined' ? window.location.origin : ''}/templates/${shareTemplate.id}` : ''}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
                <Button
                  onClick={handleCopyShareLink}
                  variant={copied ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {copied ? '복사 완료!' : '링크 복사'}
                </Button>
              </div>

              {copied && (
                <p className="text-sm text-green-600">
                  링크가 클립보드에 복사되었습니다.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShareOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
