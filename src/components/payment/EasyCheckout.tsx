/**
 * EasyCheckout Component
 * 
 * Toss Easy Checkout 모달 컴포넌트
 * 
 * Easy Checkout 흐름:
 * 1. 모달 열림 → SDK 초기화 (loadTossPayments)
 * 2. "결제하기" 버튼 클릭 → tossPayments.requestPayment({ orderId, amount })
 * 3. Toss 결제창 팝업 표시 (별도 모달)
 * 4. 결제 성공 → onSuccess(paymentKey) 콜백
 * 5. 결제 취소/실패 → 에러 처리
 * 
 * Note: Easy Checkout은 Toss가 제공하는 결제 모달을 사용
 * dialog 내부에 임베드되지 않고 별도 팝업으로 표시됨
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface EasyCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  amount: number;
  clientKey: string;
  orderId: string;
  onSuccess: (paymentKey: string) => void;
}

type PaymentStatus = 'idle' | 'loading' | 'success' | 'failed' | 'canceled';

export function EasyCheckout({
  isOpen,
  onClose,
  templateName,
  amount,
  clientKey,
  orderId,
  onSuccess,
}: EasyCheckoutProps) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // SDK 로드 (한 번만)
  useEffect(() => {
    if (!isOpen || !clientKey || loadedRef.current) return;

    const loadSDK = async () => {
      try {
        const mod = await import('@tosspayments/payment-sdk');
        await mod.loadTossPayments(clientKey);
        loadedRef.current = true;
      } catch (error) {
        console.error('SDK 로드 실패:', error);
        setErrorMessage('결제 SDK를 로드할 수 없습니다.');
      }
    };

    loadSDK();
  }, [isOpen, clientKey]);

  const handlePayment = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const mod = await import('@tosspayments/payment-sdk');
      const tossPayments = await mod.loadTossPayments(clientKey);

       const result = (await tossPayments.requestPayment({
        orderId,
        amount,
        orderName: `${templateName} 구매`,
      })) as unknown as { paymentKey?: string } | void;

      if (result?.paymentKey) {
        setStatus('success');
        onSuccess(result.paymentKey);
      } else {
        setStatus('canceled');
        onClose();
      }
    } catch (error) {
      console.error('결제 실패:', error);
      setStatus('failed');
      setErrorMessage(
        error instanceof Error ? error.message : '결제에 실패했습니다.'
      );
    }
  }, [clientKey, orderId, amount, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
    onClose();
  }, [onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>결제하기</DialogTitle>
          <DialogDescription>
            {templateName} — {formatPrice(amount)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {status === 'idle' && (
            <>
              <p className="text-sm text-muted-foreground">
                아래 버튼을 클릭하여 결제를 진행해주세요.
              </p>
              <Button onClick={handlePayment} className="w-full">
                결제하기 ({formatPrice(amount)})
              </Button>
            </>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">결제를 진행해주세요</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <p className="text-sm font-medium">결제가 완료되었습니다</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex flex-col items-center gap-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <p className="text-sm font-medium text-red-500">결제에 실패했습니다</p>
              {errorMessage && (
                <p className="text-xs text-muted-foreground">{errorMessage}</p>
              )}
              <Button variant="outline" onClick={handleClose} className="mt-2">
                닫기
              </Button>
            </div>
          )}

          {status === 'canceled' && (
            <div className="flex flex-col items-center gap-2">
              <XCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm">결제가 취소되었습니다</p>
              <Button variant="outline" onClick={handleClose} className="mt-2">
                닫기
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          {status === 'idle' && (
            <Button variant="ghost" onClick={handleClose}>
              취소
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
