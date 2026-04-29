'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/forms/LoginForm';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import GitHubLoginButton from '@/components/auth/GitHubLoginButton';

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(30,20%,98%)] via-[hsl(30,20%,95%)] to-[hsl(12,80%,90%)] dark:from-[hsl(30,15%,10%)] dark:via-[hsl(30,12%,14%)] dark:to-[hsl(30,15%,10%)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Todayis
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-medium text-[hsl(var(--primary))] hover:text-[hsl(var(--terracotta-light))] transition-colors">
              회원가입
            </Link>
          </p>
        </div>

        {showForgotPassword ? (
          <div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mb-4 text-sm text-[hsl(var(--primary))] hover:text-[hsl(var(--terracotta-light))] transition-colors"
            >
              ← 로그인으로 돌아가기
            </button>
            <ForgotPasswordForm
              onSuccess={() => {}}
              onError={(error) => {
                console.error('Forgot password error:', error);
              }}
            />
          </div>
        ) : (
          <>
            <LoginForm
              onSuccess={() => {}}
              onError={(error) => {
                console.error('Login error:', error);
              }}
            />

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[hsl(var(--primary))] hover:text-[hsl(var(--terracotta-light))] transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                    또는 소셜 계정으로 로그인
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="mt-6 space-y-3">
                <GoogleLoginButton />
                <GitHubLoginButton />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
