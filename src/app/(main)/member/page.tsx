'use client';

import { useSession } from '@/hooks/use-session';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MemberPage() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check for admin role - redirect if not admin
    if (!loading && user) {
      const role = user.user_metadata?.role;
      if (role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          회원 관리
        </h1>

        <GlassCard className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">회원 관리 기능은 준비 중입니다.</p>
            <p className="text-sm text-gray-400 mt-2">관리자 권한이 필요합니다.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}