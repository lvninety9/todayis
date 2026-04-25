'use client';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';

export default function PricingPage() {
  const plans = [
    {
      name: '무료',
      price: '₩0',
      description: '기본 템플릿으로 초대장을 만들고 싶다면',
      features: [
        '3개의 기본 템플릿',
        '사진 최대 5장',
        '기본 애니메이션',
        '초대장 공유 (링크)',
      ],
      cta: '무료로 시작하기',
      popular: false,
    },
    {
      name: '베이직',
      price: '₩19,000',
      description: '더 특별한 초대장이 필요하다면',
      features: [
        '모든 기본 템플릿',
        '사진 무제한',
        '음악 추가',
        '모든 애니메이션 효과',
        '우선 지원',
      ],
      cta: '구매하기',
      popular: true,
    },
    {
      name: '프리미엄',
      price: '₩39,000',
      description: '완벽한 초대장을 원한다면',
      features: [
        '모든 베이직 기능',
        '커스텀 폰트',
        '동영상 배경',
        'AI 추천 템플릿',
        '1:1 컨설팅',
      ],
      cta: '구매하기',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            가격 안내
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            나에게 맞는 플랜을 선택하세요
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <GlassCard
              key={index}
              className={`p-8 ${
                plan.popular
                  ? 'border-2 border-indigo-500 ring-2 ring-indigo-500/30'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full">
                    가장 인기
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'gradient' : 'outline'}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </GlassCard>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                결제는 어떻게 하나요?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                네이버 판매 페이지를 통해 결제가 진행됩니다. 카드, 계좌이체, 네이버페이 등 다양한 결제 수단을 지원합니다.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                환불이 가능한가요?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                구매 후 7일 이내에는全额 환불이 가능합니다. 고객센터로 문의해주세요.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}