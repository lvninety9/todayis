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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              회원가입
            </Link>
          </p>
        </div>

        {showForgotPassword ? (
          <div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mb-4 text-sm text-indigo-600 hover:text-indigo-500"
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
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">또는 소셜 계정으로 로그인</span>
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
