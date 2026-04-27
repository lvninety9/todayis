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
    <div className="min-h-screen bg-gradient-to-br from-[hsl(30,20%,98%)] via-[hsl(30,20%,95%)] to-[hsl(12,80%,90%)] dark:from-[hsl(30,15%,10%)] dark:via-[hsl(30,12%,14%)] dark:to-[hsl(30,15%,10%)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-[hsl(12,75%,70%)] to-[hsl(350,70%,70%)] opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-[hsl(160,35%,60%)] to-[hsl(12,75%,65%)] opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[hsl(12,75%,55%)] via-[hsl(350,70%,60%)] to-[hsl(12,75%,50%)] bg-clip-text text-transparent mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <GlassCard key={index} className={`p-6 text-center hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <div className={`text-4xl mb-4 ${index === 0 ? 'lg:text-5xl' : ''}`}>{feature.icon}</div>
                <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 ${index === 0 ? 'lg:text-xl' : 'text-lg'}`}>
                  {feature.title}
                </h3>
                <p className={`text-gray-600 dark:text-gray-400 ${index === 0 ? 'lg:text-base' : 'text-sm'}`}>
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