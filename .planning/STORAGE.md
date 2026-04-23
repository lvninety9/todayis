# Storage Regulation — Supabase Storage

**Status**: Active
**Created**: 2026-04-23

---

## Bucket 구조

| Bucket | 용도 | 공개 여부 | 파일 크기 제한 |
|--------|------|-----------|---------------|
| `profile-images` | 사용자 프로필 이미지 | Public (SELECT) | 5MB |

## 허용 형식

- **MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- **확장자**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- **최대 크기**: 5MB (5,242,880 bytes)

## 파일 경로 규칙

```
{user_id}/avatar.{ext}
```

예: `a1b2c3d4-.../avatar.png`

## RLS 정책

| 정책 | 유형 | 조건 |
|------|------|------|
| Users can upload their own profile image | INSERT | `auth.uid() = foldername[1]` AND `bucket_id = 'profile-images'` AND 허용 확장자 |
| Users can view their own profile image | SELECT | `auth.uid() = foldername[1]` AND `bucket_id = 'profile-images'` |
| Users can delete their own profile image | DELETE | `auth.uid() = foldername[1]` AND `bucket_id = 'profile-images'` |
| Anyone can view public profile images | SELECT | `bucket_id = 'profile-images'` (전체 공개) |

## API Routes

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/profile/avatar` | 프로필 이미지 업로드 (form-data 또는 base64) |
| DELETE | `/api/profile/avatar` | 프로필 이미지 삭제 |

## 업로드 흐름

1. 클라이언트에서 이미지 선택 (form-data 또는 canvas base64)
2. `POST /api/profile/avatar` 요청 (Authorization: Bearer <token>)
3. 서버에서:
   - 인증 확인 (JWT 토큰 검증)
   - 파일 형식/크기 검증
   - 기존 이미지 삭제 (동일 user_id 경로)
   - Supabase Storage 업로드
   - public URL 생성
   - `auth.users.user_metadata.avatar` 업데이트
4. 성공 시 `{ avatar: "<public-url>" }` 응답

## 설정 방법

```bash
# 1. 버킷 생성
node setup-storage-bucket.js
```

### RLS 정책 적용 (Supabase Dashboard UI)

SQL 에디터가 권한 문제로 작동하지 않을 경우, Supabase Dashboard에서 수동 생성:

1. **Supabase Dashboard** > **Storage** > **Buckets** > `profile-images` 클릭
2. **Policies** 탭 클릭
3. **New Policy** 버튼 클릭
4. 아래 4개 정책을 하나씩 추가:

| Policy Name | Command | Definition (SQL) |
|-------------|---------|------------------|
| Upload own image | INSERT | `auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'profile-images' AND split_part(name, '.', -1) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')` |
| View own image | SELECT | `auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'profile-images'` |
| Delete own image | DELETE | `auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'profile-images'` |
| View public images | SELECT | `bucket_id = 'profile-images'` |

> **Note**: With check는 위와 동일하게 입력

## 서버 SDK vs 직접 요청

- **모든 Storage API는 직접 fetch 요청 사용**
- `@supabase/storage-js`는 클라이언트용이며 서버에서 service role과 함께 사용할 때만 필요
- 서버에서는 `createClient(url, serviceRoleKey)` 패턴 사용
