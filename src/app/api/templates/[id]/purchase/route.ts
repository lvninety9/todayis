/**
 * POST /api/templates/[id]/purchase
 * 
 * 프리미엄 템플릿 구매 후 사용자 라이브러리에 복사
 * - 템플릿을 user의 라이브러리에 복사 (userId 변경, 이름에 '(내 템플릿)' 추가)
 * - payments 테이블에 기록 (DONE 상태)
 * - 이미 복사된 적 있으면 중복 방지
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findSectionBasedTemplate } from '@/data/templates/sample';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Dev 모드 지원
    const url = new URL(request.url);
    const devUserId = url.searchParams.get('dev');
    const effectiveUser = devUserId 
      ? { id: devUserId } 
      : user;

    // 1. 템플릿 조회 (DB 또는 sample)
    let sourceTemplate: any;
    
    const { data: dbTemplate } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (dbTemplate) {
      sourceTemplate = dbTemplate;
    } else {
      const sampleTemplate = findSectionBasedTemplate(id);
      if (!sampleTemplate) {
        return NextResponse.json(
          { error: '템플릿을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      sourceTemplate = sampleTemplate;
    }

    // 2. 프리미엄 템플릿인지 확인
    const isPremium = sourceTemplate.is_premium || sourceTemplate.price > 0;
    if (!isPremium) {
      return NextResponse.json(
        { error: '무료 템플릿은 구매가 필요합니다.' },
        { status: 400 }
      );
    }

    // 3. 이미 복사되었는지 확인 (중복 방지) - 이름 패턴으로 검색
    const { data: existingCopies } = await supabase
      .from('templates')
      .select('id')
      .eq('user_id', effectiveUser.id)
      .ilike('name', `${sourceTemplate.name} (내 템플릿)%`);

    if (existingCopies && existingCopies.length > 0) {
      return NextResponse.json({
        message: '이미 라이브러리에 추가되어 있습니다.',
        templateId: existingCopies[0].id,
      }, { status: 200 });
    }

    // 4. 템플릿 복사
    const copyName = `${sourceTemplate.name} (내 템플릿)`;
    
    const { data: copiedTemplate, error } = await supabase
      .from('templates')
      .insert({
        user_id: effectiveUser.id,
        name: copyName,
        category: sourceTemplate.category || 'wedding',
        thumbnail: sourceTemplate.thumbnail,
        fields: sourceTemplate.fields || [],
        layout: sourceTemplate.layout || 'simple',
        config: sourceTemplate.config || { sections: sourceTemplate.sections || [] },
        is_published: true,
        download_count: 0,
        price: 0, // 사용자 라이브러리에 복사되면 무료
        original_template_id: id,
      })
      .select()
      .single();

    if (error) {
      console.error('Template copy error:', error);
      return NextResponse.json(
        { error: '템플릿 복사 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 5. payments 테이블에 기록
    await supabase
      .from('payments')
      .insert({
        user_id: effectiveUser.id,
        template_id: id,
        amount: sourceTemplate.price || 10000,
        status: 'DONE',
        payment_method: 'naver_selling_page',
        completed_at: new Date().toISOString(),
      });

    return NextResponse.json({
      message: '템플릿이 라이브러리에 추가되었습니다.',
      templateId: copiedTemplate.id,
      templateName: copyName,
    }, { status: 200 });
  } catch (error) {
    console.error('Purchase copy error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
