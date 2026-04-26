/**
 * Custom Font API
 * 
 * 커스텀 폰트 업로드/삭제 API
 * - POST /api/fonts — 폰트 파일 업로드 (Supabase Storage)
 * - DELETE /api/fonts?url=xxx — 폰트 파일 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const ALLOWED_EXTENSIONS = ['ttf', 'otf', 'woff', 'woff2'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = 'custom-fonts';

/**
 * 파일명에서 확장자 제거, -/_를 공백으로 치환, Title Case 적용
 * 예: 'my-wedding-font.ttf' → 'My Wedding Font'
 */
function sanitizeFileName(filename: string): string {
  const name = filename.replace(/\.[^/.]+$/, '');
  const spaced = name.replace(/[-_]/g, ' ');
  return spaced
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * POST /api/fonts
 * 
 * 커스텀 폰트 파일 업로드
 * - file: 폰트 파일 (.ttf, .otf, .woff, .woff2)
 * - templateId: 템플릿 ID
 * - fontName: 폰트 이름 (선택사항, 미입력 시 파일명에서 자동 파생)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check (MANDATORY — no dev fallback per D-07)
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const templateId = formData.get('templateId') as string;
    const fontName = formData.get('fontName') as string | null;

    // 3. Validate file exists
    if (!file) {
      return NextResponse.json({ error: '폰트 파일이 필요합니다.' }, { status: 400 });
    }

    // 4. Validate file type (D-08) — check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: '.ttf, .otf, .woff, .woff2 파일만 지원됩니다.' },
        { status: 400 }
      );
    }

    // 5. Validate file size (D-02) — 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '최대 5MB까지 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 6. Determine fontFamily (D-04) — use fontName override or derive from filename
    const family = fontName || sanitizeFileName(file.name);

    // 7. Upload to Supabase Storage bucket 'custom-fonts' (D-02)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Auto-create bucket if missing
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET_NAME)) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE,
      });
    }

    // Generate unique filename
    const fileId = crypto.randomUUID();
    const fileName = `${user.id}/${templateId}/${fileId}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('Font upload error:', uploadError);
      return NextResponse.json(
        { error: '폰트 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 8. Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    // 9. Return response
    return NextResponse.json({
      success: true,
      fontUrl: urlData?.publicUrl,
      fontFamily: family,
      fontId: fileId,
    });
  } catch (error) {
    console.error('Font upload error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/fonts
 * 
 * 커스텀 폰트 파일 삭제
 * - url: 삭제할 파일의 공개 URL
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Auth check (MANDATORY)
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 2. Get url from query params
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url) {
      return NextResponse.json(
        { error: 'url 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 3. Extract file path from URL
    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length < 2) {
      return NextResponse.json(
        { error: '잘못된 URL 형식입니다.' },
        { status: 400 }
      );
    }
    const filePath = urlParts[1];

    // 4. Delete from storage
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      console.error('Font delete error:', error);
      return NextResponse.json(
        { error: '파일 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Font delete error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
