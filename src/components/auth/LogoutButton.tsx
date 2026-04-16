'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      {loading ? '로그아웃 중...' : children || '로그아웃'}
    </button>
  );
}
