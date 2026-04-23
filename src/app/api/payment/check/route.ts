/**
 * GET /api/payment/check?templateId=xxx
 * 
 * 템플릿 구매 상태 확인 API
 * 
 * payments 테이블에서 user_id + template_id + status='DONE'로 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PaymentStatus } from '@/types/payment';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { data: payment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .eq('status', PaymentStatus.DONE)
      .single();

    const isPurchased = !!payment;

    return NextResponse.json({
      templateId,
      is_purchased: isPurchased,
    });
  } catch (error) {
    console.error('Payment check error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
