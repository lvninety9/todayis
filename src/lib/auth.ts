import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function getUserFromRequest(request: NextRequest) {
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

export async function requireAdmin(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return {
      response: NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      ),
      user: null,
    };
  }
  
  const role = (user.user_metadata as Record<string, unknown>)?.role as string | undefined;
  
  if (role !== 'admin') {
    return {
      response: NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      ),
      user,
    };
  }
  
  return { response: null, user };
}
