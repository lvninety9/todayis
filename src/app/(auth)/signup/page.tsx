'use client';

import { useState } from 'react';
import Link from 'next/link';
import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 via-background to-purple-950 dark:via-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Todayis
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              로그인
            </Link>
          </p>
        </div>

        {showSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              ✅ 회원가입이 완료되었습니다. 로그인해주세요.
            </p>
          </div>
        )}

        <SignupForm
          onSuccess={() => {
            setShowSuccess(true);
          }}
          onError={(error) => {
            console.error('Signup error:', error);
          }}
        />
      </div>
    </div>
  );
}