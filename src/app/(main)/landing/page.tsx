'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';

export default function LandingPage() {
  const features = [
    {
      icon: '💒',
      title: '예쁘고 특별한 초대장',
      description: '디자이너가 만든 다양한 템플릿으로 사랑스러운 초대장을 만드세요.',
    },
    {
      icon: '📱',
      title: '모바일 지원',
      description: '어떤 기기에서나 완벽하게 표시되는 Responsive Design',
    },
    {
      icon: '🎵',
      title: '음악과 애니메이션',
      description: '감성적인 배경 음악과 부드러운 애니메이션 효과',
    },
    {
      icon: '🔗',
      title: '편리한 공유',
      description: '링크 하나로 친구들에게 쉽게 초대장을 전달하세요.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-pink-300 to-rose-300 opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            소중한 순간,
            <br />
            특별한 초대장
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            나만의 특별한 웨딩 초대장을 만들고,
            <br className="hidden sm:inline" />
            사랑하는 사람들과 나누세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/templates">
              <Button variant="gradient" size="lg" className="text-lg px-8">
                템플릿 보기
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Todayis만의 특별함
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <GlassCard className="max-w-3xl mx-auto px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            무료 템플릿으로 나만의 초대장을 만들어보세요.
          </p>
          <Link href="/signup">
            <Button variant="gradient" size="lg">
              무료로 시작하기
            </Button>
          </Link>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Todayis. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}