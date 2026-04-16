'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setShowSuccess(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              로그인
            </Link>
          </p>
        </div>

        {showSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">
              회원가입이 완료되었습니다. 로그인해주세요.
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
