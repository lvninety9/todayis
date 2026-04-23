/**
 * usePayment Hook
 * 
 * 결제 상태 관리 훅
 * - requestPayment: 결제 요청 (서버 API 호출)
 * - checkPurchase: 구매 상태 확인
 * - verifyPayment: 결제 검증 (paymentKey 전송)
 * - reset: 상태 초기화
 */

import { useState, useCallback } from 'react';

export interface PaymentState {
  paymentKey: string | null;
  orderId: string | null;
  amount: number | null;
  loading: boolean;
  error: string | null;
  completed: boolean;
}

interface UsePaymentReturn {
  state: PaymentState;
  requestPayment: (templateId: string, amount: number) => Promise<void>;
  checkPurchase: (templateId: string) => Promise<boolean>;
  verifyPayment: (paymentKey: string) => Promise<void>;
  reset: () => void;
}

const initialState: PaymentState = {
  paymentKey: null,
  orderId: null,
  amount: null,
  loading: false,
  error: null,
  completed: false,
};

export function usePayment(): UsePaymentReturn {
  const [state, setState] = useState<PaymentState>(initialState);

  const requestPayment = useCallback(async (templateId: string, amount: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/payment/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('sb-auth-token') || ''}`,
        },
        body: JSON.stringify({ templateId, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '결제 요청에 실패했습니다.');
      }

      setState({
        paymentKey: null,
        orderId: data.orderId,
        amount: data.amount,
        loading: false,
        error: null,
        completed: false,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      }));
      throw error;
    }
  }, []);

  const checkPurchase = useCallback(async (templateId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/payment/check?templateId=${templateId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sb-auth-token') || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return false;
      }

      return data.is_purchased;
    } catch {
      return false;
    }
  }, []);

  const verifyPayment = useCallback(async (paymentKey: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('sb-auth-token') || ''}`,
        },
        body: JSON.stringify({ paymentKey, orderId: state.orderId, amount: state.amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '결제 검증에 실패했습니다.');
      }

      setState({
        paymentKey,
        orderId: state.orderId,
        amount: state.amount,
        loading: false,
        error: null,
        completed: true,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      }));
      throw error;
    }
  }, [state.orderId, state.amount]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    requestPayment,
    checkPurchase,
    verifyPayment,
    reset,
  };
}
