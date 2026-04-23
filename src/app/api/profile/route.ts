import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
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
    
    const { nickname, bio } = body;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const existingMetadata = user.user_metadata || {};
    const newMetadata: Record<string, string> = { ...existingMetadata };
    if (nickname !== undefined) {
      newMetadata.nickname = nickname;
    }
    if (bio !== undefined) {
      newMetadata.bio = bio;
    }
    
    const { data: { user: updatedUser }, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: newMetadata,
    });
    
    if (error) {
      return NextResponse.json(
        { error: '프로필 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      nickname: updatedUser?.user_metadata?.nickname || '',
      bio: updatedUser?.user_metadata?.bio || '',
      email: updatedUser?.email || user.email || '',
    });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user: userData } } = await supabase.auth.admin.getUserById(user.id);
    
    return NextResponse.json({
      nickname: userData?.user_metadata?.nickname || '',
      bio: userData?.user_metadata?.bio || '',
      email: userData?.email || user.email || '',
      createdAt: userData?.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
