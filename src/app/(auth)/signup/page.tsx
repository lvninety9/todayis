'use client';

import { useState } from 'react';
import Link from 'next/link';
import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todayis
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              로그인
            </Link>
          </p>
        </div>

        {showSuccess && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">
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
