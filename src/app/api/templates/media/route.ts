/**
 * Template Media API
 * 
 * 템플릿 미디어 파일 (배경 음악) 업로드/삭제 API
 * - POST /api/templates/media - 음악 파일 업로드 또는 URL 저장
 * - DELETE /api/templates/media?url=xxx - 음악 파일 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/templates/media
 * 
 * 음악 파일 업로드 또는 URL 저장
 * - file: MP3/WAV/OGG 파일 (FormData)
 * - templateId: 템플릿 ID
 * - musicUrl: 외부 URL (선택, file 대신 사용 가능)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      // Dev 모드 허용
      const isDev = new URL(request.url).searchParams.get('dev') === 'true';
      if (!isDev) {
        return NextResponse.json(
          { error: '인증이 필요합니다.' },
          { status: 401 }
        );
      }
    }

    const formData = await request.formData();
    const templateId = formData.get('templateId') as string;
    const musicUrl = formData.get('musicUrl') as string;
    const file = formData.get('file') as File | null;

    // URL이 제공된 경우 (Suno 등 외부 서비스)
    if (musicUrl) {
      return NextResponse.json({
        success: true,
        musicUrl: musicUrl,
        isExternal: true,
      });
    }

    // 파일 업로드
    if (!file) {
      return NextResponse.json(
        { error: '음악 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'MP3, WAV, OGG 파일만 지원됩니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '최대 10MB까지 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // bucket이 없으면 생성
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketName = 'template-media';
    
    if (!buckets?.find(b => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
    }

    // 파일 확장자 추출
    let extension = file.name.split('.').pop() || 'mp3';
    if (extension === 'mp3') extension = 'mpeg';

    // 파일 경로 생성
    const fileName = `${templateId}/${Date.now()}.${extension}`;
    
    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 업로드
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json(
        { error: '음악 파일 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 공개 URL获取
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      musicUrl: urlData.publicUrl,
      isExternal: false,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/media
 * 
 * 음악 파일 삭제
 * - url: 삭제할 파일 URL
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      const isDev = new URL(request.url).searchParams.get('dev') === 'true';
      if (!isDev) {
        return NextResponse.json(
          { error: '인증이 필요합니다.' },
          { status: 401 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'url 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 외부 URL은 삭제 불필요
    if (url.startsWith('http') && !url.includes('supabase')) {
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 파일 경로 추출
    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length < 2) {
      return NextResponse.json({ success: true });
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('template-media')
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return NextResponse.json(
        { error: '파일 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}