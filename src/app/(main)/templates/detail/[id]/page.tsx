'use client';

import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TemplateDetailPage() {
  const params = useParams();
  const templateId = params?.id as string;

  // This would be fetched from API in real implementation
  const template = {
    id: templateId,
    name: ' Wedding Invitation',
    category: ' 웨딩',
    description: '사랑하는 사람과의 특별한 순간을 위한 우아한 웨딩 초대장 템플릿입니다.',
    thumbnail: '',
    features: [
      '자유로운 텍스트 편집',
      '사진 추가',
      '애니메이션 효과',
      '모바일 최적화',
    ],
  };

  return (
    <div className="min-h-screen bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/templates"
          className="inline-block mb-6 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 템플릿 라이브러리
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview */}
          <GlassCard className="p-4">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {template.thumbnail ? (
                <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-6xl">💒</span>
              )}
            </div>
          </GlassCard>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {template.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                {template.category}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {template.description}
            </p>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              주요 기능
            </h2>
            <ul className="space-y-2 mb-8">
              {template.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link href={`/create/${templateId}`}>
              <Button variant="gradient" size="lg" className="w-full">
                이 템플릿으로 만들기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}