/**
 * GET /api/invitations/[slug]
 * 
 * 공개 초대장 조회 API
 * 
 * - slug로 공개된 초대장 조회
 * - is_published = true 조건만 허용
 * - 인증 불필요 (공개 API)
 * - invitation + template 정보 함께 반환
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Invitation, PublicInvitationResponse } from '@/types/publish';

export async function GET(
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

    const supabase = createSupabaseServerClient();

    // 공개된 초대장 조회 (is_published = true)
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: '초대장을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 템플릿 정보 조회
    const templateId = (invitation as Record<string, unknown>).template_id as string;
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('id, name, category')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: '템플릿 정보를 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    const response: PublicInvitationResponse = {
      invitation: invitation as Invitation,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Invitation lookup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
