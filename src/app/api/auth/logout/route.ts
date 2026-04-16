import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    // Create server client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Sign out the current user
    const { error } = await supabase.auth.admin.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Clear cookies
    const response = NextResponse.json(
      { message: '로그아웃이 완료되었습니다.' },
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.set('sb-auth-refresh-token', '', {
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
