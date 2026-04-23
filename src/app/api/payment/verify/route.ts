/**
 * POST /api/payment/verify
 * 
 * 결제 검증 API (Easy Checkout)
 * 
 * Easy Checkout 흐름:
 * 1. 서버: orderId 생성 + DB 저장 (PENDING) → clientKey + orderId + amount 반환
 * 2. 클라이언트: requestPayment(clientKey, { orderId, amount }) → Toss 결제창
 * 3. 클라이언트: 결제 성공 시 paymentKey 수신 → 서버로 전송
 * 4. 서버: verifyPayment(paymentKey) → Toss API로 결제 검증 + DB 업데이트 (DONE)
 * 
 * Note: 웹훅(PAYMENT_COMPLETED)이 먼저 도착하면 이 API는 이미 DONE 상태
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTossClient } from '@/lib/payment/toss';
import { PaymentStatus } from '@/types/payment';
import { z } from 'zod';

const verifySchema = z.object({
  paymentKey: z.string().min(1, 'paymentKey는 필수입니다.'),
  orderId: z.string().min(1, 'orderId는 필수입니다.'),
  amount: z.number().positive('amount는 양수여야 합니다.'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0] },
        { status: 400 }
      );
    }

    const { paymentKey, orderId, amount } = parsed.data;
    const supabase = createSupabaseServerClient();

    // 이미 구매했는지 확인 (웹훅이 먼저 도착했을 수 있음)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_key', paymentKey)
      .single();

    if (existingPayment && (existingPayment as Record<string, unknown>).status === PaymentStatus.DONE) {
      return NextResponse.json({
        paymentKey,
        status: 'already_completed',
        message: '이미 완료된 결제입니다.',
      });
    }

    // template_id로 결제 조회 (payment_key가 아직 없는 경우)
    const { data: paymentRecord, error: paymentFetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', PaymentStatus.PENDING)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (paymentFetchError || !paymentRecord) {
      return NextResponse.json(
        { error: '결제 요청 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Toss Payments에서 결제 정보 조회 및 검증
    const tossClient = getTossClient();
    const paymentInfo = await tossClient.getPayment(paymentKey, { orderId, amount });

    // 결제 상태 확인
    if (paymentInfo.status !== 'DONE') {
      return NextResponse.json(
        { error: `결제 상태가 아닙니다: ${paymentInfo.status}` },
        { status: 400 }
      );
    }

    // DB 업데이트: 결제 정보 저장 + 상태 DONE
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: PaymentStatus.DONE,
        payment_key: paymentKey,
      })
      .eq('id', (paymentRecord as Record<string, string>).id);

    if (updateError) {
      console.error('Payment update error:', updateError);
      return NextResponse.json(
        { error: '결제 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentKey,
      status: 'completed',
      amount: paymentInfo.amount,
      method: paymentInfo.method,
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
