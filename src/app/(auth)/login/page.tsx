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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todayis
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              회원가입
            </Link>
          </p>
        </div>

        {showForgotPassword ? (
          <div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mb-4 text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              ← 로그인으로 돌아가기
            </button>
            <ForgotPasswordForm
              onSuccess={() => {
                // Success handled by component
              }}
              onError={(error) => {
                console.error('Forgot password error:', error);
              }}
            />
          </div>
        ) : (
          <>
            <LoginForm
              onSuccess={() => {
                // Success handled by component
              }}
              onError={(error) => {
                console.error('Login error:', error);
              }}
            />

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    또는 소셜 계정으로 로그인
                  </span>
                </div>
              </div>

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
