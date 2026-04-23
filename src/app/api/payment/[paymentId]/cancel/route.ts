/**
 * POST /api/payment/[paymentId]/cancel
 * 
 * 결제 취소 API
 * 
 * - 인증된 사용자만 자신의 결제 취소 가능
 * - 소유자 검증: payments.user_id가 인증된 사용자 ID와 일치해야 함
 * - DONE 상태 결제만 취소 가능
 * - Toss Payments API로 실제 취소 처리
 * 
 * Note: MVP에서는 UI 버튼을 비활성화 (관리자만 사용 가능)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTossClient } from '@/lib/payment/toss';
import { PaymentStatus, type PaymentStatusType } from '@/types/payment';
import { z } from 'zod';

const cancelSchema = z.object({
  reason: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = cancelSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0] },
        { status: 400 }
      );
    }

    const { reason } = parsed.data;
    const paymentKey = params.paymentId;
    const supabase = createSupabaseServerClient();

    // 결제 정보 조회
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_key', paymentKey)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: '결제를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const paymentRecord = payment as Record<string, unknown>;

    // 소유자 검증
    if ((paymentRecord.user_id as string) !== user.id) {
      return NextResponse.json(
        { error: '이 결제를 취소할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 상태 확인
    const currentStatus = paymentRecord.status as PaymentStatusType;
    if (currentStatus === PaymentStatus.CANCELED) {
      return NextResponse.json(
        { error: '이미 취소된 결제입니다.' },
        { status: 400 }
      );
    }

    if (currentStatus !== PaymentStatus.DONE) {
      return NextResponse.json(
        { error: '취소할 수 없는 결제 상태입니다.' },
        { status: 400 }
      );
    }

    // Toss Payments 취소 API 호출
    const tossClient = getTossClient();
    let cancelResult: Awaited<ReturnType<typeof tossClient.cancelPayment>>;

    try {
      cancelResult = await tossClient.cancelPayment(
        paymentKey,
        undefined,
        reason || '고객 요청'
      );
    } catch (error) {
      console.error('Toss cancel error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Toss 결제 취소에 실패했습니다.' },
        { status: 502 }
      );
    }

    // DB 업데이트: 상태 CANCELED
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: PaymentStatus.CANCELED,
      })
      .eq('payment_key', paymentKey);

    if (updateError) {
      console.error('Cancel DB update error:', updateError);
      return NextResponse.json(
        { error: '취소 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentKey,
      status: 'CANCELED',
      cancelAmount: cancelResult.cancelAmount,
      reason,
    });
  } catch (error) {
    console.error('Cancel payment error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
