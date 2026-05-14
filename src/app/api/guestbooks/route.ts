import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('guestbooks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { error: '방명록을 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (message.length > 200) {
      return NextResponse.json(
        { error: '메시지는 200자 이내로 입력해주세요.' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('guestbooks')
      .insert({
        author: author && author.trim() ? author.trim() : '손님',
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: '방명록 작성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
