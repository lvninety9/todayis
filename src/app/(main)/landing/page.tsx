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

  const steps = [
    {
      step: '01',
      title: '템플릿 선택',
      description: '감성에 맞는 템플릿을 선택하세요.',
      icon: '🎨',
    },
    {
      step: '02',
      title: '내용 입력',
      description: '이름, 날짜, 장소를 간단히 입력하세요.',
      icon: '✏️',
    },
    {
      step: '03',
      title: '공유하기',
      description: '링크를 복사해서 친구들에게 공유하세요.',
      icon: '🚀',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] dark:bg-[var(--color-surface)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 scroll-reveal">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-[hsl(var(--terracotta-light))] to-[hsl(var(--accent))] opacity-20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-[hsl(var(--sage-light))] to-[hsl(var(--primary))] opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-[hsl(var(--blush-light))] to-[hsl(var(--terracotta-light))] opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4 mb-8 text-sm">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[hsl(var(--terracotta-light))]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">4.9</span> (120+ 리뷰)
            </span>
            <span className="text-[var(--text-muted)] dark:text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">1,200+</span>명이 선택
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--terracotta-dark))] bg-clip-text text-transparent mb-6 leading-tight">
            소중한 순간,
            <br className="sm:hidden" />
            특별한 초대장
          </h1>
          <p className="text-xl text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            나만의 특별한 웨딩 초대장을 만들고,
            <br className="hidden sm:inline" />
            사랑하는 사람들과 나누세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/templates">
              <Button variant="gradient" size="lg" className="text-lg px-8 shadow-lg shadow-[hsl(var(--primary))/0.3]">
                템플릿 보기
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 border-2">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 border-y border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-surface-raised)] dark:bg-[var(--color-surface-raised)] scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">1,200+</div>
              <div className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-1">생성된 초대장</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--sage-light))] bg-clip-text text-transparent">50+</div>
              <div className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-1">디자인 템플릿</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--blush-light))] bg-clip-text text-transparent">4.9</div>
              <div className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-1">평균 평점</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--terracotta-light))] to-[hsl(var(--primary))] bg-clip-text text-transparent">98%</div>
              <div className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-1">재방문율</div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Section - 3 Step Process */}
      <section className="py-20 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
              3단계로 완성하는 나만의 초대장
            </h2>
            <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-xl mx-auto">
              복잡한 과정 없이, 간단하게 완성하세요
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <GlassCard key={index} className={`p-8 text-center relative ${index === 1 ? 'lg:scale-105 lg:shadow-xl' : ''}`}>
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))/50] to-[hsl(var(--accent))/50] z-10" />
                )}
                <div className="text-5xl mb-6">{step.icon}</div>
                <div className="inline-block px-3 py-1 rounded-full bg-[hsl(var(--primary))/10] text-[hsl(var(--primary))] text-sm font-semibold mb-4">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--color-surface-raised)] dark:bg-[var(--color-surface-raised)] scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
            Todayis만의 특별함
          </h2>
          <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-center mb-12 max-w-xl mx-auto">
            결혼 준비의 모든 것을, 하나로
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal-stagger">
            {features.map((feature, index) => (
              <GlassCard key={index} className={`p-6 text-center hover:scale-[1.02] hover:shadow-xl transition-all duration-300`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-12">
            사용자들의 이야기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: '결혼 준비가 정말 즐거웠어요. 템플릿이 너무 예쁘고 사용하기 쉬웠습니다!',
                author: '김서연',
                role: '신부',
              },
              {
                quote: '친구들이 초대장 디자인에 너무 감동했어요. 추천합니다!',
                author: '박지민',
                role: '신랑',
              },
              {
                quote: '간단하게 설정하고 바로 공유할 수 있어서 정말 편리했습니다.',
                author: '이하은',
                role: '신부',
              },
            ].map((testimonial, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[hsl(var(--terracotta-light))]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{testimonial.author}</div>
                    <div className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)]">{testimonial.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-[hsl(var(--terracotta-light))] to-[hsl(var(--accent))] opacity-10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-br from-[hsl(var(--sage-light))] to-[hsl(var(--primary))] opacity-10 blur-2xl" />
            </div>
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                지금 바로 시작해보세요
              </h2>
              <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                무료 템플릿으로 나만의 초대장을 만들어보세요.
                <br />
                신용카드 없이, 무료로 시작할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button variant="gradient" size="lg" className="text-lg px-8 shadow-lg shadow-[hsl(var(--primary))/0.3]">
                    무료로 시작하기
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="text-lg px-8">
                    템플릿 미리보기
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] dark:border-[var(--color-border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">
            © 2026 Todayis. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
