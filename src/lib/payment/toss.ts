/**
 * Toss Payments Client
 * 
 * Toss Easy Checkout 연동용 클라이언트
 * - 서버: 결제 검증 (verifyPayment), 취소 (cancelPayment), 조회 (getPayment)
 * - 클라이언트: requestPayment()로 Toss 결제창 렌더링
 * 
 * Easy Checkout 흐름:
 * 1. 서버: 주문 생성 (로컬 DB) → orderId 반환
 * 2. 클라이언트: requestPayment(clientKey, { orderId, amount }) → Toss 결제창
 * 3. 클라이언트: 결제 성공 시 paymentKey 수신 → 서버로 전송
 * 4. 서버: verifyPayment(paymentKey) → 결제 검증 및 상태 업데이트
 */

const TOSS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY;
const TOSS_API_BASE = 'https://api.tosspayments.com';

/**
 * 결제 검증 응답
 */
export interface VerifyPaymentResponse {
  paymentKey: string;
  status: string;
  amount: number;
  method: string;
  paidAt: string;
  orderId: string;
}

/**
 * 결제 취소 응답
 */
export interface CancelPaymentResponse {
  paymentKey: string;
  cancelAmount: number;
  balanceAmount: number;
  totalCancelAmount: number;
  cancelReason?: string;
}

/**
 * 결제 상세 응답
 */
export interface GetPaymentResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
  requestedAt: string;
  country: string;
  card?: {
    issuerCode: string;
    code: string;
    name: string;
    isFlexible: boolean;
  };
  discount?: {
    amount: number;
  };
}

/**
 * Toss API 에러
 */
export interface TossApiError {
  code: string;
  message: string;
}

/**
 * Easy Checkout 주문 정보 (클라이언트용)
 */
export interface CheckoutOrder {
  orderId: string;
  amount: number;
}

/**
 * Toss Payments 클라이언트
 * 
 * 서버 사이드에서만 사용 (API 검증용)
 * 클라이언트 결제창은 @tosspayments/payment-widget 사용
 */
export class TossPaymentsClient {
  private secretKey: string;

  constructor(secretKey?: string) {
    this.secretKey = secretKey || TOSS_SECRET_KEY || '';
    
    if (!this.secretKey) {
      throw new Error('TOSS_PAYMENTS_SECRET_KEY 환경 변수가 설정되지 않았습니다.');
    }
  }

  /**
   * Base64 인코딩 Basic 인증 헤더 생성
   * Toss API는 Secret Key를 비밀번호로 사용하는 Basic Auth 방식
   */
  private getAuthHeader(): Record<string, string> {
    const encoded = Buffer.from(this.secretKey + ':').toString('base64');
    return {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * 결제 검증 (Easy Checkout)
   * 
   * 클라이언트에서 requestPayment() 성공 후 paymentKey를 받아
   * 서버에서 결제를 검증합니다.
   * 
   * POST /v1/payments/{paymentKey}
   */
  async verifyPayment(paymentKey: string): Promise<VerifyPaymentResponse> {
    const url = `${TOSS_API_BASE}/v1/payments/${paymentKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error: TossApiError = await response.json().catch(() => ({
        code: 'UNKNOWN',
        message: response.statusText,
      }));
      throw new Error(`Toss API 에러 (${error.code}): ${error.message}`);
    }

    return response.json() as Promise<VerifyPaymentResponse>;
  }

  /**
   * 결제 취소
   * 
   * POST /v1/payments/{paymentKey}/cancel
   */
  async cancelPayment(
    paymentKey: string,
    cancelAmount?: number,
    cancelReason?: string
  ): Promise<CancelPaymentResponse> {
    const url = `${TOSS_API_BASE}/v1/payments/${paymentKey}/cancel`;

    const body: Record<string, unknown> = {
      cancelAmount: cancelAmount || 0,
      cancelReason: cancelReason || '고객 요청',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error: TossApiError = await response.json().catch(() => ({
        code: 'UNKNOWN',
        message: response.statusText,
      }));
      throw new Error(`Toss API 에러 (${error.code}): ${error.message}`);
    }

    return response.json() as Promise<CancelPaymentResponse>;
  }

  /**
   * 결제 상세 정보 조회
   * 
   * GET /v1/payments/{paymentKey}?orderId={orderId}&amount={amount}
   */
  async getPayment(
    paymentKey: string,
    options?: { orderId?: string; amount?: number }
  ): Promise<GetPaymentResponse> {
    const url = new URL(`${TOSS_API_BASE}/v1/payments/${paymentKey}`);
    
    if (options?.orderId) {
      url.searchParams.set('orderId', options.orderId);
    }
    if (options?.amount) {
      url.searchParams.set('amount', String(options.amount));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error: TossApiError = await response.json().catch(() => ({
        code: 'UNKNOWN',
        message: response.statusText,
      }));
      throw new Error(`Toss API 에러 (${error.code}): ${error.message}`);
    }

    return response.json() as Promise<GetPaymentResponse>;
  }

  /**
   * Easy Checkout 주문 정보 생성 (서버 로컬용)
   * 
   * Toss API 호출 없이, 클라이언트 requestPayment()에 필요한
   * orderId와 amount를 생성합니다.
   * 
   * 실제 Toss API 호출은 클라이언트에서 requestPayment()가 담당합니다.
   */
  createCheckoutOrder(): CheckoutOrder {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return { orderId, amount: 0 }; // amount는 호출 시 지정
  }
}

/**
 * Toss Payments 인스턴스 생성 (전역 싱글톤)
 */
let _client: TossPaymentsClient | null = null;

export function getTossClient(): TossPaymentsClient {
  if (!_client) {
    _client = new TossPaymentsClient();
  }
  return _client;
}
