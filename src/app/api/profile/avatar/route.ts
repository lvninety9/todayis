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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const contentType = request.headers.get('content-type') || '';
    let imageData: Buffer;
    let fileName: string;
    let uploadMimeType: string;
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        return NextResponse.json(
          { error: '파일이 필요합니다.' },
          { status: 400 }
        );
      }
      
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: '지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF)' },
          { status: 400 }
        );
      }
      
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: '파일 크기는 5MB 이하여야 합니다.' },
          { status: 400 }
        );
      }
      
      imageData = Buffer.from(await file.arrayBuffer());
      uploadMimeType = file.type;
      const ext = file.name.split('.').pop() || 'jpg';
      fileName = `${user.id}/avatar.${ext}`;
    } else {
      const body = await request.json();
      const base64Data = body.base64 as string | undefined;
      const mimeType = body.mimeType as string | undefined;
      
      if (!base64Data) {
        return NextResponse.json(
          { error: 'base64 데이터가 필요합니다.' },
          { status: 400 }
        );
      }
      
      if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { error: '지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF)' },
          { status: 400 }
        );
      }
      
      const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
      imageData = Buffer.from(base64String, 'base64');
      uploadMimeType = mimeType;
      
      const extMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      };
      const ext = extMap[mimeType] || 'jpg';
      fileName = `${user.id}/avatar.${ext}`;
    }
    
    if (imageData.length === 0) {
      return NextResponse.json(
        { error: '빈 파일입니다.' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const existingFiles = await supabase.storage
      .from('profile-images')
      .list(user.id);
    
    const toDelete = (existingFiles.data || []).map((f: { name: string }) => `${user.id}/${f.name}`);
    if (toDelete.length > 0) {
      await supabase.storage.from('profile-images').remove(toDelete);
    }
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, imageData, {
        cacheControl: '3600',
        upsert: true,
        contentType: uploadMimeType,
      });
    
    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { error: '이미지 업로드 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);
    
    const avatarUrl = publicUrlData?.publicUrl || '';
    
    const existingMetadata = user.user_metadata || {};
    const newMetadata: Record<string, string> = { ...existingMetadata, avatar: avatarUrl };
    
    const { data: { user: updatedUser }, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: newMetadata,
    });
    
    if (updateError) {
      console.error('Supabase auth update error:', updateError);
      return NextResponse.json(
        { error: '프로필 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      avatar: updatedUser?.user_metadata?.avatar || avatarUrl,
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: existingFiles } = await supabase.storage
      .from('profile-images')
      .list(user.id);
    
    if (existingFiles && existingFiles.length > 0) {
      const toDelete = existingFiles.map((f: { name: string }) => `${user.id}/${f.name}`);
      await supabase.storage.from('profile-images').remove(toDelete);
    }
    
    const existingMetadata = user.user_metadata || {};
    const newMetadata: Record<string, string> = { ...existingMetadata };
    delete newMetadata.avatar;
    
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: newMetadata,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
