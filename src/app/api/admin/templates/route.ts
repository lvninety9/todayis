import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Template } from '@/types/template';
import { requireAdmin } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/templates
 * 전체 템플릿 목록 조회 (admin 권한 필요)
 */
export async function GET(request: NextRequest) {
  const { response: authResponse } = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: templates, error, count } = await supabase
      .from('templates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      return NextResponse.json(
        { error: '템플릿 목록 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    const formattedTemplates: Template[] = (templates || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      name: t.name,
      category: t.category,
      thumbnail: t.thumbnail,
      fields: t.fields,
      layout: t.layout,
      isPublished: t.is_published,
      downloadCount: t.download_count,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
    
    return NextResponse.json({
      templates: formattedTemplates,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/templates/[id]
 * 템플릿 공개/비공개 설정 (admin 권한 필요)
 */
export async function PATCH(request: NextRequest) {
  const { response: authResponse } = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    const url = new URL(request.url);
    const templateId = url.pathname.split('/').pop();
    
    if (!templateId) {
      return NextResponse.json(
        { error: '템플릿 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }
    
    const { isPublished } = body;
    
    if (typeof isPublished !== 'boolean') {
      return NextResponse.json(
        { error: 'isPublished는 boolean 이어야 합니다.' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('templates')
      .update({ is_published: isPublished })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: '템플릿 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      id: data.id,
      name: data.name,
      isPublished: data.is_published,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/templates/[id]
 * 템플릿 삭제 (admin 권한 필요)
 */
export async function DELETE(request: NextRequest) {
  const { response: authResponse } = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    const url = new URL(request.url);
    const templateId = url.pathname.split('/').pop();
    
    if (!templateId) {
      return NextResponse.json(
        { error: '템플릿 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId);
    
    if (error) {
      return NextResponse.json(
        { error: '템플릿 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
