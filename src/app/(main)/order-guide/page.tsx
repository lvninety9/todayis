'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrderGuidePage() {
  const steps = [
    {
      number: 1,
      title: '템플릿 선택',
      description: '원하는 템플릿을 선택하세요. 무료와 유료 템플릿이 있습니다.',
    },
    {
      number: 2,
      title: '정보 입력',
      description: '예식 날짜, 시간, 장소,축사 내용을 입력하세요.',
    },
    {
      number: 3,
      title: '사진 추가',
      description: '사랑스러운 사진을 추가하고 싶은分 추가하세요.',
    },
    {
      number: 4,
      title: '초대장 공유',
      description: '완성된 초대장 링크를 친구, 지인들에게 공유하세요.',
    },
  ];

  const faqs = [
    {
      question: '어떻게 시작하나요?',
      answer: '템플릿 페이지에서免费的 템플릿을 선택하여 시작할 수 있습니다. 로그인 후 바로 제작 가능합니다.',
    },
    {
      question: '사진은 어떻게 추가하나요?',
      answer: '템플릿 편집 화면에서 사진을 업로드할 수 있습니다. JPG, PNG 형식을 지원합니다.',
    },
    {
      question: '수정은 어떻게 하나요?',
      answer: '내가 만든 초대장은 anytime 수정 가능합니다. 대시보드에서 편집할 수 있습니다.',
    },
    {
      question: '공유는 어떻게 하나요?',
      answer: '완성된 초대장의 링크를 복사하여 문자, 카카오톡 등으로 친구들에게 공유하면 됩니다.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            주문 제작 안내
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            초대장 제작 절차를 안내해드립니다
          </p>
        </div>

        {/* Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            제작 절차
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <GlassCard key={step.number} className="p-6 flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <GlassCard key={index} className="p-0 overflow-hidden">
                <button
                  className="w-full p-6 text-left flex items-centerjustify-between"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}