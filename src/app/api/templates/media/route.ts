/**
 * Template Media API
 * 
 * 템플릿 미디어 파일 (배경 음악, 동영상) 업로드/삭제 API
 * - POST /api/templates/media - 음악/동영상 파일 업로드 또는 URL 저장
 * - DELETE /api/templates/media?url=xxx - 미디어 파일 삭제
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
    const mediaUrl = formData.get('mediaUrl') as string;
    const mediaType = formData.get('mediaType') as 'audio' | 'video' | null;
    const file = formData.get('file') as File | null;

    // URL이 제공된 경우 (YouTube, Bilibili 등 외부 서비스)
    if (mediaUrl) {
      return NextResponse.json({
        success: true,
        mediaUrl: mediaUrl,
        isExternal: true,
        type: mediaType || 'audio',
      });
    }

    // 파일 업로드
    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }

    const isVideo = mediaType === 'video';

    // 파일 타입 검증
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'image/gif'];
    const allowedTypes = isVideo ? allowedVideoTypes : allowedAudioTypes;
    
    if (!allowedTypes.includes(file.type)) {
      const typeLabel = isVideo ? 'MP4, WebM, MOV, GIF' : 'MP3, WAV, OGG';
      return NextResponse.json(
        { error: `${typeLabel} 파일만 지원됩니다.` },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const sizeLabel = isVideo ? '50MB' : '10MB';
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `최대 ${sizeLabel}까지 업로드 가능합니다.` },
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
        fileSizeLimit: 52428800, // 50MB (video max)
      });
    }

    // 파일 확장자 추출
    let extension = file.name.split('.').pop() || (isVideo ? 'mp4' : 'mp3');
    if (extension === 'mp3') extension = 'mpeg';

    // 파일 경로 생성
    const subDir = isVideo ? 'video' : 'audio';
    const fileName = `${templateId}/${subDir}/${Date.now()}.${extension}`;
    
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
        { error: '파일 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 공개 URL获取
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      mediaUrl: urlData.publicUrl,
      isExternal: false,
      type: mediaType || (isVideo ? 'video' : 'audio'),
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
  * 미디어 파일 (음악/동영상) 삭제
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

    // 파일 경로 추출 (audio 또는 video 하위 디렉토리 지원)
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