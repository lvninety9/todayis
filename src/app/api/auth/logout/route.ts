import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: '로그아웃이 완료되었습니다.' },
      { status: 200 }
    );

    // Clear all Supabase session cookies
    response.cookies.set('sb-auth-token', '', {
      path: '/',
      maxAge: 0,
    });
    response.cookies.set('sb-auth-refresh-token', '', {
      path: '/',
      maxAge: 0,
    });
    response.cookies.set('sb-auth-access-token', '', {
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
