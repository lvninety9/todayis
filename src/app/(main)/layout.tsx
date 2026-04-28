'use client';

import { useSession } from '@/hooks/use-session';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LayoutGrid, Plus, User } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/dashboard', label: '대시보드' },
    { href: '/templates', label: '템플릿' },
    { href: '/pricing', label: '가격' },
    { href: '/order-guide', label: '주문안내' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)]">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/40 border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/landing" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(12,75%,55%)] to-[hsl(350,70%,60%)] bg-clip-text text-transparent">
                Todayis
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-[hsl(12,75%,55%)] dark:hover:text-[hsl(12,75%,60%)] ${
                    pathname === item.href
                      ? 'text-[hsl(12,75%,55%)] dark:text-[hsl(12,75%,60%)]'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link href="/settings">
                    <Button variant="ghost" size="sm">
                      {user.email?.split('@')[0]}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="gradient" size="sm">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        {children}
      </main>

      {/* Footer - Minimal with gradient accent */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 Todayis. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/landing" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                회사 소개
              </Link>
              <Link href="/order-guide" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                이용 안내
              </Link>
              <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                가격
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname.startsWith('/dashboard') || pathname === '/'
                ? 'text-[hsl(12,75%,55%)]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">홈</span>
          </Link>
          <Link
            href="/templates"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname.startsWith('/templates')
                ? 'text-[hsl(12,75%,55%)]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs mt-1">템플릿</span>
          </Link>
          <Link
            href="/create"
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <div className="w-12 h-12 -mt-6 rounded-full bg-gradient-to-r from-[hsl(12,75%,55%)] to-[hsl(350,70%,60%)] flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </Link>
          <Link
            href={user ? '/settings' : '/login'}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname.startsWith('/settings')
                ? 'text-[hsl(12,75%,55%)]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">내정보</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}