import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/users
 * 전체 사용자 목록 조회 (admin 권한 필요)
 */
export async function GET(request: NextRequest) {
  const { response: authResponse, user } = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: users, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    
    if (error) {
      return NextResponse.json(
        { error: '사용자 목록 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    const formattedUsers = (users?.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      nickname: u.user_metadata?.nickname || '',
      createdAt: u.created_at,
      updatedAt: u.updated_at,
      lastSignIn: u.last_sign_in_at,
      role: (u.user_metadata as Record<string, unknown>)?.role || 'user',
    }));
    
    return NextResponse.json({
      users: formattedUsers,
      total: users?.total || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]
 * 사용자 역할 업데이트 (admin/user) — admin 권한 필요
 */
export async function PATCH(request: NextRequest) {
  const { response: authResponse, user } = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    
    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
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
    
    const { role } = body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: '역할은 user 또는 admin 이어야 합니다.' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: { user: updatedUser }, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { ...(user.user_metadata || {}), role },
    });
    
    if (error) {
      return NextResponse.json(
        { error: '사용자 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      id: updatedUser?.id,
      email: updatedUser?.email,
      role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * 사용자 삭제 — admin 권한 필요
 */
export async function DELETE(request: NextRequest) {
  const { response: authResponse } = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    
    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error } = await supabase.auth.admin.deleteUser(userId, true);
    
    if (error) {
      return NextResponse.json(
        { error: '사용자 삭제 중 오류가 발생했습니다.' },
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
