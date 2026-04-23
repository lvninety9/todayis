/**
 * POST /api/payment/request
 * 
 * 결제 요청 API (Easy Checkout)
 * 
 * Easy Checkout 흐름:
 * 1. 서버: orderId 생성 + DB 저장 (PENDING) → clientKey + orderId + amount 반환
 * 2. 클라이언트: requestPayment(clientKey, { orderId, amount }) → Toss 결제창
 * 3. 클라이언트: 결제 성공 시 paymentKey 수신 → 서버로 전송
 * 4. 서버: verifyPayment(paymentKey) → 결제 검증 (별도 API)
 * 
 * Note: 서버에서는 Toss API 호출하지 않음
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTossClient } from '@/lib/payment/toss';
import { PaymentStatus } from '@/types/payment';
import { z } from 'zod';

const requestSchema = z.object({
  templateId: z.string().min(1, 'templateId는 필수입니다.'),
  amount: z.number().positive().optional(),
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

    const body = request.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0] },
        { status: 400 }
      );
    }

    const { templateId, amount: requestedAmount } = parsed.data;
    const supabase = createSupabaseServerClient();

    // 템플릿 조회
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 무료 템플릿 체크
    const price = (template as Record<string, unknown>).price as number;
    if (!price || price === 0) {
      return NextResponse.json(
        { error: '무료 템플릿은 구매 대상이 아닙니다.' },
        { status: 400 }
      );
    }

    const finalAmount = requestedAmount || price;

    // 이미 구매했는지 확인
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .eq('status', PaymentStatus.DONE)
      .single();

    if (existingPayment) {
      return NextResponse.json(
        { error: '이미 구매한 템플릿입니다.' },
        { status: 409 }
      );
    }

    // orderId 생성
    const orderId = `ORD-${Date.now()}-${templateId}`;

    // DB에 결제 요청 기록 저장 (PENDING)
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        template_id: templateId,
        amount: finalAmount,
        status: PaymentStatus.PENDING,
        payment_key: null,
      });

    if (paymentError) {
      console.error('Payment insert error:', paymentError);
      return NextResponse.json(
        { error: '결제 요청 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // clientKey 반환 (Easy Checkout용)
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

    return NextResponse.json({
      orderId,
      amount: finalAmount,
      status: 'PENDING',
      clientKey,
    });
  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
