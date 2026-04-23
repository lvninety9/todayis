/**
 * POST /api/payment/webhook
 * 
 * Toss Payments 웹훅 핸들러
 * 
 * Toss Payments에서 결제 상태 변경 시 웹훅 이벤트가 전송됩니다.
 * - PAYMENT_COMPLETED: 결제 완료
 * - PAYMENT_CANCELED: 결제 취소
 * 
 * Note: Toss Payments 웹훅은 반드시 200 OK 응답을 요구합니다.
 * 에러가 발생해도 200을 반환하여 웹훅 재시도를 유도합니다.
 * 실제 에러는 console.error로만 로깅합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTossClient } from '@/lib/payment/toss';
import { PaymentStatus, type PaymentStatusType } from '@/types/payment';

const TOSS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY || '';

/**
 * 웹훅 이벤트 타입
 */
type WebhookEventType = 'PAYMENT_COMPLETED' | 'PAYMENT_CANCELED' | string;

/**
 * 웹훅 본문 인터페이스
 */
interface WebhookBody {
  paymentKey?: string;
  eventType?: WebhookEventType;
  orderId?: string;
  amount?: number;
  [key: string]: unknown;
}

/**
 * 서명 검증
 * 
 * Toss Payments 웹훅은 X-Signature 헤더로 HMAC-SHA256 서명을 전송합니다.
 */
function verifySignature(signature: string | null, body: string): boolean {
  if (!signature) {
    return false;
  }

  try {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', TOSS_SECRET_KEY);
    const expected = hmac.update(body).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * 결제 상태 업데이트
 */
async function updatePaymentStatus(
  paymentKey: string,
  status: PaymentStatusType,
  extra: Record<string, unknown> = {}
): Promise<boolean> {
  const supabase = createSupabaseServerClient();

  const updateData: Record<string, unknown> = {
    status,
    ...extra,
  };

  const { error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('payment_key', paymentKey)
    .eq('status', PaymentStatus.PENDING);

  if (error) {
    console.error(`Webhook update error (${status}):`, error);
    return false;
  }

  return true;
}

/**
 * 결제 상태 업데이트 (ON CONFLICT 처리)
 * 
 * payment_key가 중복되는 경우 (중복 웹훅) 처리
 */
async function updatePaymentWithConflictHandling(
  paymentKey: string,
  status: PaymentStatusType
): Promise<boolean> {
  const supabase = createSupabaseServerClient();

  // 먼저 기존 결제 조회
  const { data: existing } = await supabase
    .from('payments')
    .select('status')
    .eq('payment_key', paymentKey)
    .single();

  // 이미 완료된 결제면 무시
  if (existing && (existing as Record<string, unknown>).status === PaymentStatus.DONE) {
    console.log(`Webhook: Payment already completed (${paymentKey})`);
    return true;
  }

  // 이미 취소된 결제면 무시
  if (existing && (existing as Record<string, unknown>).status === PaymentStatus.CANCELED) {
    console.log(`Webhook: Payment already canceled (${paymentKey})`);
    return true;
  }

  // PENDING 상태면 업데이트
  if (existing && (existing as Record<string, unknown>).status === PaymentStatus.PENDING) {
    return await updatePaymentStatus(paymentKey, status);
  }

  // 결제가 없으면 로깅만 (웹훅만으로는 생성 불가 — 결제 요청 API必须先)
  console.warn(`Webhook: No pending payment found for key (${paymentKey})`);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // body를 먼저 텍스트로 읽기 (서명 검증용)
    const rawBody = await request.text();
    const body: WebhookBody = JSON.parse(rawBody);

    const { paymentKey, eventType } = body;

    // 필수 필드 확인
    if (!paymentKey || !eventType) {
      console.error('Webhook: Missing paymentKey or eventType');
      return NextResponse.json(
        { status: 'ok' },
        { status: 200 }
      );
    }

    // 서명 검증
    const signature = request.headers.get('X-Signature');
    if (!verifySignature(signature, rawBody)) {
      console.error('Webhook: Signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const supabase = createSupabaseServerClient();

    // 이벤트별 처리
    if (eventType === 'PAYMENT_COMPLETED') {
      // Toss에서 결제 상세 정보 조회
      const tossClient = getTossClient();
      let paymentInfo: Awaited<ReturnType<typeof tossClient.getPayment>>;
      
      try {
        paymentInfo = await tossClient.getPayment(paymentKey);
      } catch (error) {
        console.error('Webhook: getPayment error:', error);
        return NextResponse.json(
          { status: 'ok' },
          { status: 200 }
        );
      }

      // 결제 상세 정보로 DB 업데이트
      const { error } = await supabase
        .from('payments')
        .update({
          status: PaymentStatus.DONE,
          payment_key: paymentKey,
        })
        .eq('payment_key', paymentKey)
        .eq('status', PaymentStatus.PENDING);

      if (error) {
        console.error('Webhook: Update payment error:', error);
      } else {
        console.log(`Webhook: Payment completed (${paymentKey})`);
      }
    } else if (eventType === 'PAYMENT_CANCELED') {
      // 결제 취소 처리
      const cancelReason = (body as Record<string, unknown>).cancelReason as string | undefined;

      const { error } = await supabase
        .from('payments')
        .update({
          status: PaymentStatus.CANCELED,
        })
        .eq('payment_key', paymentKey)
        .eq('status', PaymentStatus.PENDING);

      if (error) {
        console.error('Webhook: Cancel payment error:', error);
      } else {
        console.log(`Webhook: Payment canceled (${paymentKey})${cancelReason ? ` - ${cancelReason}` : ''}`);
      }
    } else {
      console.log(`Webhook: Unknown event type (${eventType})`);
    }

    // Toss는 200 OK만 응답으로 받습니다
    return NextResponse.json(
      { status: 'ok' },
      { status: 200 }
    );
  } catch (error) {
    // 모든 에러는 200 OK 응답 + 로깅 (웹훅 재시도 허용)
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { status: 'ok' },
      { status: 200 }
    );
  }
}
