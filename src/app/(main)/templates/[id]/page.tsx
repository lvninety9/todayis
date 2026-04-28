/**
 * 템플릿 상세 페이지
 * 
 * 템플릿 정보 조회 + 구매 상태 확인 + Naver Selling Page redirect
 * 
 * 흐름:
 * 1. 서버 컴포넌트: 템플릿 정보 조회 (name, thumbnail, price, is_premium)
 * 2. 클라이언트 컴포넌트: 구매 상태 확인
 * 3. is_purchased=true → "편집하기" 버튼
 * 4. is_purchased=false + price>0 → "구매하기" 버튼 → Naver Selling Page redirect
 * 5. 무료 템플릿 → "편집하기" 버튼
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GlassCard } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from '@/hooks/use-session';
import { usePayment } from '@/hooks/use-payment';
import { redirectToNaverSellingPage } from '@/lib/payment/naver';
import { Expand, Check, ShoppingCart, Edit3 } from 'lucide-react';

interface TemplateInfo {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  is_premium: boolean;
  category: string;
  layout: string;
}

/**
 * 템플릿 상세 페이지 (클라이언트 컴포넌트)
 */
export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  const { checkPurchase, verifyPayment } = usePayment();

  const templateId = params?.id as string;

  const [template, setTemplate] = useState<TemplateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // 템플릿 정보 조회
  const fetchTemplate = useCallback(async () => {
    try {
      const token = session.session?.access_token;
      const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
      
      const headers: Record<string, string> = {};
      let url = `/api/templates/${templateId}`;
      
      // 로그인한 사용자는 토큰 사용, 비로그인时만 dev=true
      if (isDev && !token) {
        url += '?dev=true';
      } else if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('템플릿을 찾을 수 없습니다');
          router.push('/templates');
          return;
        }
        throw new Error('템플릿을 불러오는데 실패했습니다');
      }

      const data: TemplateInfo = await response.json();
      setTemplate(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [templateId, session.session, router]);

  // 구매 상태 확인
  const checkIfPurchased = useCallback(async (tid: string) => {
    setCheckingPurchase(true);
    try {
      const purchased = await checkPurchase(tid);
      setIsPurchased(purchased);
    } catch {
      setIsPurchased(false);
    } finally {
      setCheckingPurchase(false);
    }
  }, [checkPurchase]);

  // 마운트 시 템플릿 + 구매 상태 조회
  useEffect(() => {
    const isDev = typeof window !== 'undefined' && localStorage.getItem('__DEV_MODE__') === 'true';
    
    if (!session.loading && !session.user && !isDev) {
      router.push('/login');
      return;
    }

    if (templateId) {
      fetchTemplate();
    }
  }, [session.loading, session.user, templateId, fetchTemplate, router]);

  useEffect(() => {
    if (template && templateId) {
      checkIfPurchased(templateId);
    }
  }, [template, templateId, checkIfPurchased]);

  // 구매하기 - Naver Selling Page로 redirect
  const handleBuy = useCallback(async () => {
    if (!template) return;
    
    try {
      // Naver Selling Page로 redirect
      redirectToNaverSellingPage(
        {
          templateName: template.name,
          price: template.price,
          templateId: template.id,
        },
        `/templates/${template.id}`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '결제 요청에 실패했습니다');
    }
  }, [template]);

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  // 로딩 상태
  if (session.loading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // 템플릿이 없거나 에러
  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">템플릿을 찾을 수 없습니다</p>
            <Link
              href="/templates"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              템플릿 라이브러리로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFree = template.price === 0 || !template.is_premium;

  return (
    <div className="min-h-screen bg-[hsl(30,20%,98%)] dark:bg-[hsl(30,15%,10%)]">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-6">
          <Link
            href="/templates"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            &larr; 템플릿 라이브러리
          </Link>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 템플릿 정보 - Modern GlassCard */}
        <GlassCard className="overflow-hidden">
          {/* 썸네일 - 큰 미리보기 + 확대 버튼 */}
          {template.thumbnail && (
            <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden group">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setPreviewOpen(true)}
              >
                <Expand className="w-4 h-4 mr-1" />
                확대 미리보기
              </Button>
            </div>
          )}

          {/* 정보 */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {template.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                {template.category}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                isFree
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
              }`}>
                {formatPrice(template.price)}
              </span>
            </div>

            {/* 버튼 - Sticky bottom on mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 md:static md:bg-transparent md:dark:bg-transparent md:p-0 md:border-0 md:mt-8">
              <div className="flex gap-3">
                {checkingPurchase ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Spinner size="sm" />
                    <span>구매 상태 확인 중...</span>
                  </div>
                ) : isPurchased ? (
                  <Button
                    onClick={() => router.push(`/templates/${template.id}/edit`)}
                    className="flex-1"
                    size="lg"
                    variant="gradient"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    편집하기
                  </Button>
                ) : isFree ? (
                  <Button
                    onClick={() => router.push(`/templates/${template.id}/edit`)}
                    className="flex-1"
                    size="lg"
                    variant="gradient"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    무료로 시작하기
                  </Button>
                ) : (
                  <Button
                    onClick={handleBuy}
                    className="flex-1"
                    size="lg"
                    variant="gradient"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    구매하기 ({formatPrice(template.price)})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 확대 미리보기 Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>{template.name} - 미리보기</DialogTitle>
              <DialogDescription>
                전체 화면으로 템플릿을 확인하세요
              </DialogDescription>
            </DialogHeader>
            <div className="w-full h-[70vh] bg-gray-100 flex items-center justify-center">
              {template.thumbnail && (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <DialogFooter className="p-4 border-t">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                닫기
              </Button>
              {isPurchased || isFree ? (
                <Button variant="gradient" onClick={() => router.push(`/templates/${template.id}/edit`)}>
                  편집하기
                </Button>
              ) : (
                <Button variant="gradient" onClick={handleBuy}>
                  구매하기 ({formatPrice(template.price)})
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
