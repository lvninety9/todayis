import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: '이메일 주소가 필요합니다.' },
        { status: 400 }
      );
    }

    // Create server client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      // For security reasons, don't reveal if email exists
      console.error('Password reset error:', error.message);
      return NextResponse.json(
        { message: '이메일이 전송되었습니다. 지침에 따라 비밀번호를 재설정하세요.' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: '이메일이 전송되었습니다. 지침에 따라 비밀번호를 재설정하세요.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: '비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
