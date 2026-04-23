'use client';

import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  lastSignIn: string | null;
  role: string;
}

interface AdminTemplate {
  id: string;
  userId: string;
  name: string;
  category: string;
  thumbnail: string;
  isPublished: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const session = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'users' | 'templates'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [page, setPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);

  const fetchUsers = useCallback(async () => {
    if (!session.session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('사용자 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [session.session?.access_token, router]);

  const fetchTemplates = useCallback(async () => {
    if (!session.session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/templates?page=${templatePage}&limit=20`, {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('템플릿 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      setTemplates(data.templates || []);
      setTotalTemplates(data.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [session.session?.access_token, templatePage, router]);

  const isAdmin = (session.user?.user_metadata as Record<string, unknown>)?.role === 'admin';

  useEffect(() => {
    if (session.loading) {
      return;
    }

    if (!session.user) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      return;
    }

    setLoading(true);
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchTemplates();
    }
  }, [session.loading, session.user, activeTab, fetchUsers, fetchTemplates, router, isAdmin]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!session.session?.access_token) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('역할 업데이트에 실패했습니다');
      }

      toast.success('사용자 역할이 업데이트되었습니다');
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '역할 업데이트에 실패했습니다');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!session.session?.access_token) return;
    if (!confirm('정말 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('사용자 삭제에 실패했습니다');
      }

      toast.success('사용자가 삭제되었습니다');
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '사용자 삭제에 실패했습니다');
    }
  };

  const handleTogglePublish = async (templateId: string, isPublished: boolean) => {
    if (!session.session?.access_token) return;

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({ isPublished }),
      });

      if (!response.ok) {
        throw new Error('템플릿 업데이트에 실패했습니다');
      }

      toast.success(isPublished ? '템플릿이 공개되었습니다' : '템플릿이 비공개되었습니다');
      fetchTemplates();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '템플릿 업데이트에 실패했습니다');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!session.session?.access_token) return;
    if (!confirm('정말 이 템플릿을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('템플릿 삭제에 실패했습니다');
      }

      toast.success('템플릿이 삭제되었습니다');
      fetchTemplates();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '템플릿 삭제에 실패했습니다');
    }
  };

  if (session.loading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session.user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 거부</h1>
          <p className="text-gray-600 mb-4">관리자 권한이 필요한 페이지입니다.</p>
          <Link href="/dashboard">
            <Button>대시보드로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
            ← 대시보드로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
          <p className="mt-2 text-gray-600">회원 및 템플릿을 관리하세요</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            회원 관리 ({totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            템플릿 관리 ({totalTemplates})
          </button>
        </div>

        {/* 회원 관리 */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">회원 목록</h2>
              <p className="text-sm text-gray-500 mt-1">총 {totalUsers}명</p>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">회원이 없습니다</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마지막 로그인</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nickname || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString('ko-KR') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant="destructive"
                            size="sm"
                          >
                            삭제
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 템플릿 관리 */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">템플릿 목록</h2>
              <p className="text-sm text-gray-500 mt-1">총 {totalTemplates}개</p>
            </div>

            {templates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">템플릿이 없습니다</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">다운로드</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {templates.map((template) => (
                      <tr key={template.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={template.isPublished ? 'default' : 'outline'}>
                            {template.isPublished ? '공개' : '비공개'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.downloadCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(template.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex gap-2 justify-end">
                          <Button
                            onClick={() => handleTogglePublish(template.id, !template.isPublished)}
                            variant="outline"
                            size="sm"
                          >
                            {template.isPublished ? '비공개' : '공개'}
                          </Button>
                          <Button
                            onClick={() => handleDeleteTemplate(template.id)}
                            variant="destructive"
                            size="sm"
                          >
                            삭제
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalTemplates > 20 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <Button
                  onClick={() => setTemplatePage((p) => Math.max(1, p - 1))}
                  disabled={templatePage <= 1}
                  variant="outline"
                  size="sm"
                >
                  이전
                </Button>
                <span className="text-sm text-gray-600">
                  페이지 {templatePage}
                </span>
                <Button
                  onClick={() => setTemplatePage((p) => p + 1)}
                  disabled={templatePage * 20 >= totalTemplates}
                  variant="outline"
                  size="sm"
                >
                  다음
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
