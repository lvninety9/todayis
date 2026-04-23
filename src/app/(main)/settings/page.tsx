'use client';

import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface ProfileData {
  nickname: string;
  bio: string;
  email: string;
  createdAt: string;
}

export default function SettingsPage() {
  const session = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData>({
    nickname: '',
    bio: '',
    email: '',
    createdAt: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session.session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('프로필을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [session.session?.access_token, router]);

  useEffect(() => {
    if (session.loading) {
      return;
    }

    if (!session.user) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [session.loading, session.user, fetchProfile, router]);

  const handleSave = async () => {
    if (!session.session?.access_token) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          nickname: profile.nickname,
          bio: profile.bio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '프로필 업데이트에 실패했습니다');
      }

      toast.success('프로필이 업데이트되었습니다');
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      toast.error(message);
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
            ← 대시보드로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          <p className="mt-2 text-gray-600">계정 및 프로필 정보를 관리하세요</p>
        </div>

        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">프로필 정보</h2>

          <div className="space-y-6">
            {/* 이메일 */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="mt-1 bg-gray-100"
              />
              <p className="mt-1 text-sm text-gray-500">이메일은 변경할 수 없습니다</p>
            </div>

            {/* 닉네임 */}
            <div>
              <Label htmlFor="nickname" className="text-gray-700 font-medium">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                value={profile.nickname}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                placeholder="닉네임을 입력하세요"
                className="mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">공개되는 이름입니다 (최대 50자)</p>
            </div>

            {/* 소개 */}
            <div>
              <Label htmlFor="bio" className="text-gray-700 font-medium">소개</Label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="자기소개를 입력하세요 (선택사항)"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              />
              <p className="mt-1 text-sm text-gray-500">최대 500자</p>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {saving ? '저장 중...' : '저장하기'}
              </Button>
            </div>
          </div>
        </div>

        {/* 계정 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">계정 정보</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">가입일</span>
              <span className="text-gray-900 font-medium">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('ko-KR') : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">로그인 방법</span>
              <span className="text-gray-900 font-medium">
                {session.user.app_metadata?.provider === 'google'
                  ? 'Google'
                  : session.user.app_metadata?.provider === 'github'
                  ? 'GitHub'
                  : 'Email'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">사용자 ID</span>
              <span className="text-gray-900 font-mono text-sm">{session.user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
