/**
 * POST /api/invitations/[slug]/publish
 * 
 * 공개/비공개 토글 API
 * 
 * - 인증 필요 (Authorization header)
 * - 소유자 검증 (auth.uid() = invitation.user_id)
 * - body: { is_published: boolean }
 * - 토글된 invitation 데이터 반환
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { InvitationPublishToggle } from '@/types/publish';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug || slug.trim() === '') {
      return NextResponse.json(
        { error: 'slug가 필요합니다.' },
        { status: 400 }
      );
    }

    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = body as InvitationPublishToggle;

    if (typeof parsed.is_published !== 'boolean') {
      return NextResponse.json(
        { error: 'is_published는 boolean이어야 합니다.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // 초대장 조회
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: '초대장을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 소유자 검증
    const userId = (invitation as Record<string, unknown>).user_id as string;
    if (userId !== user.id) {
      return NextResponse.json(
        { error: '이 초대장을 수정할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // is_published 업데이트
    const { data: updated, error: updateError } = await supabase
      .from('invitations')
      .update({ is_published: parsed.is_published })
      .eq('slug', slug)
      .select()
      .single();

    if (updateError) {
      console.error('Invitation publish toggle error:', updateError);
      return NextResponse.json(
        { error: '초대장 상태 변경 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const message = parsed.is_published
      ? '초대장이 공개되었습니다.'
      : '초대장이 비공개로 전환되었습니다.';

    return NextResponse.json({
      invitation: updated,
      message,
    });
  } catch (error) {
    console.error('Publish toggle error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
