#!/usr/bin/env node
/**
 * Supabase Storage Bucket Setup
 * profile-images 버킷과 RLS 정책을 생성합니다.
 * 
 * 사용법:
 *   node setup-storage-bucket.js
 * 
 * 또는 Supabase Dashboard > SQL Editor에서 supabase-profile-storage.sql을 실행하세요.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ 환경 변수가 필요합니다: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function createBucket() {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
    },
    body: JSON.stringify({
      name: 'profile-images',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    }),
  });

  if (response.ok) {
    console.log('✅ profile-images 버킷 생성 완료');
    return true;
  }

  if (response.status === 409) {
    console.log('ℹ️  profile-images 버킷이 이미 존재합니다');
    return true;
  }

  const error = await response.json();
  console.error('❌ 버킷 생성 실패:', error);
  return false;
}

async function main() {
  console.log('📦 profile-images 버킷 설정 중...\n');
  const success = await createBucket();
  if (success) {
    console.log('\n✅ 설정 완료! supabase-profile-storage.sql도 실행하여 RLS 정책을 적용하세요.');
  } else {
    process.exit(1);
  }
}

main();
