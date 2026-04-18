import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Template, TemplateInsert, TemplateField } from '@/lib/supabase/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * 인증 헤더에서 사용자 정보 추출
 */
function getUserFromRequest(request: NextRequest) {
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
 * GET /api/templates
 * 
 * 사용자의 템플릿 목록 조회
 * - ?published=true: 공개된 템플릿만 필터링
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let query = supabase
      .from('templates')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (published === 'true') {
      query = query.eq('is_published', true);
    }
    
    const { data: templates, error, count } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: '템플릿 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    // Database snake_case to JS camelCase conversion
    const formattedTemplates: Template[] = (templates || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      name: t.name,
      category: t.category,
      thumbnail: t.thumbnail,
      fields: t.fields as TemplateField[],
      layout: t.layout,
      isPublished: t.is_published,
      downloadCount: t.download_count,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
    
    return NextResponse.json(
      {
        templates: formattedTemplates,
        count: count || 0,
      },
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
 * POST /api/templates
 * 
 * 새 템플릿 생성
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
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
    
    // 필수 필드 검증
    const { name, category, thumbnail, fields, layout } = body;
    
    if (!name || typeof name !== 'string' || name.trim().length < 1 || name.length > 255) {
      return NextResponse.json(
        { error: '템플릿 이름은 1-255 자 사이여야 합니다.' },
        { status: 400 }
      );
    }
    
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return NextResponse.json(
        { error: '카테고리는 빈 문자열일 수 없습니다.' },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(fields)) {
      return NextResponse.json(
        { error: 'fields 는 배열이어야 합니다.' },
        { status: 400 }
      );
    }
    
    // fields 배열 검증
    for (const field of fields) {
      if (!field.name || !field.type || !field.label || typeof field.required !== 'boolean') {
        return NextResponse.json(
          { error: 'fields 배열의 각 항목은 name, type, label, required 필드를 포함해야 합니다.' },
          { status: 400 }
        );
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const templateData: TemplateInsert = {
      user_id: user.id,
      name: name.trim(),
      category: category.trim(),
      thumbnail: thumbnail || '',
      fields: fields as TemplateField[],
      layout: layout || '',
      is_published: false,
      download_count: 0,
    };
    
    const { data, error } = await supabase
      .from('templates')
      .insert(templateData)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: '템플릿 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    // Database snake_case to JS camelCase conversion
    const createdTemplate: Template = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      category: data.category,
      thumbnail: data.thumbnail,
      fields: data.fields as TemplateField[],
      layout: data.layout,
      isPublished: data.is_published,
      downloadCount: data.download_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
    
    return NextResponse.json(
      createdTemplate,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
