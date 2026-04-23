/**
 * POST /api/invitations
 *
 * 초대장 생성 API
 *
 * - 인증 필요 (Authorization header)
 * - 템플릿 소유자 검증
 * - slug 자동 생성
 * - invitations 테이블에 INSERT
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { InvitationInsert } from '@/types/publish';

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
    const { templateId, title, data, layout, is_published } = body as {
      templateId?: string;
      title?: string;
      data?: Record<string, string>;
      layout?: Record<string, unknown>;
      is_published?: boolean;
    };

    if (!templateId || !title || !data) {
      return NextResponse.json(
        { error: 'templateId, title, data는 필수입니다.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // 템플릿 조회 및 소유자 검증
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('id, user_id')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const templateUserId = (template as Record<string, unknown>).user_id as string;
    if (templateUserId !== user.id) {
      return NextResponse.json(
        { error: '이 템플릿으로 초대장을 만들 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // slug 자동 생성
    const slug = generateSlug(user.id, templateId);

    // invitations 테이블에 INSERT
    const invitationData: InvitationInsert = {
      user_id: user.id,
      template_id: templateId,
      slug,
      title: title.trim(),
      data,
      layout: layout || {},
      is_published: is_published ?? false,
    };

    const { data: invitation, error: insertError } = await supabase
      .from('invitations')
      .insert(invitationData)
      .select()
      .single();

    if (insertError) {
      console.error('Invitation insert error:', insertError);
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'slug 중복이 발생했습니다. 다시 시도해주세요.' },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: '초대장 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      invitation,
      slug,
      message: '초대장이 생성되었습니다.',
    });
  } catch (error) {
    console.error('Invitation creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

function generateSlug(userId: string, templateId: string): string {
  const timestamp = Date.now().toString(36);
  const templatePrefix = templateId.slice(0, 8).replace(/-/g, '');
  const userPrefix = userId.slice(0, 6).replace(/-/g, '');
  return `${userPrefix}-${templatePrefix}-${timestamp}`;
}
