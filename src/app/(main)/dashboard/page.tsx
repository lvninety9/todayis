'use client';

import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.loading && !session.user) {
      router.push('/login');
    }
  }, [session.loading, session.user, router]);

  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session.user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="mt-2 text-gray-600">환영합니다, {session.user.email}</p>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">내 초대장</h2>
            <p className="mt-1 text-sm text-gray-500">아직 만든 초대장이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
