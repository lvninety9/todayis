import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TemplateUpdate, TemplateField } from '@/lib/supabase/database.types';
import { Template } from '@/types/template';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * 인증 헤더에서 사용자 정보 추출
 */
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

/**
 * GET /api/templates/[id]
 * 
 * 특정 템플릿 조회
 * - ?increment=true: 다운로드 카운트 증가
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const increment = searchParams.get('increment') === 'true';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 템플릿 조회
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 소유자 검증
    if (template.user_id !== user.id) {
      return NextResponse.json(
        { error: '이 템플릿에 접근할 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // 다운로드 카운트 증가
    if (increment) {
      await supabase
        .from('templates')
        .update({ download_count: template.download_count + 1 })
        .eq('id', id);
    }
    
    // Database snake_case to JS camelCase conversion
    const formattedTemplate: Template = {
      id: template.id,
      userId: template.user_id,
      name: template.name,
      category: template.category,
      thumbnail: template.thumbnail,
      fields: template.fields as TemplateField[],
      layout: template.layout,
      isPublished: template.is_published,
      downloadCount: template.download_count,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    };
    
    return NextResponse.json(
      formattedTemplate,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/templates/[id]
 * 
 * 템플릿 수정
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 먼저 템플릿이 존재하고 소유자인지 확인
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !existingTemplate) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 소유자 검증
    if (existingTemplate.user_id !== user.id) {
      return NextResponse.json(
        { error: '이 템플릿을 수정할 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // 업데이트할 필드만 포함
    const updateData: Partial<TemplateUpdate> = {};
    if ('name' in body) updateData.name = body.name;
    if ('category' in body) updateData.category = body.category;
    if ('thumbnail' in body) updateData.thumbnail = body.thumbnail;
    if ('fields' in body) updateData.fields = body.fields;
    if ('layout' in body) updateData.layout = body.layout;
    if ('is_published' in body) updateData.is_published = body.is_published;
    if ('download_count' in body) updateData.download_count = body.download_count;
    
    // updated_at 자동 업데이트
    updateData.updated_at = new Date().toISOString();
    
    const { data: updatedTemplate, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: '템플릿 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    // Database snake_case to JS camelCase conversion
    const formattedTemplate: Template = {
      id: updatedTemplate.id,
      userId: updatedTemplate.user_id,
      name: updatedTemplate.name,
      category: updatedTemplate.category,
      thumbnail: updatedTemplate.thumbnail,
      fields: updatedTemplate.fields as TemplateField[],
      layout: updatedTemplate.layout,
      isPublished: updatedTemplate.is_published,
      downloadCount: updatedTemplate.download_count,
      createdAt: updatedTemplate.created_at,
      updatedAt: updatedTemplate.updated_at,
    };
    
    return NextResponse.json(
      formattedTemplate,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/[id]
 * 
 * 템플릿 삭제
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    
    // 먼저 템플릿이 존재하고 소유자인지 확인
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !existingTemplate) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 소유자 검증
    if (existingTemplate.user_id !== user.id) {
      return NextResponse.json(
        { error: '이 템플릿을 삭제할 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: '템플릿 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: '삭제되었습니다.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
