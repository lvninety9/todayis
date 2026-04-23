# Phase 6: 초대장 공개 시스템 - PLAN 01 SUMMARY

## Objective
invitations 테이블 생성, 공개 초대장 조회 API, 공개/비공개 토글 API 구현

## Completed Tasks

### Task 1: Supabase SQL Migration 생성
- **File**: `supabase-publish-setup.sql` (52 lines)
- **Contents**:
  - invitations 테이블 생성 (id, user_id, template_id, slug, title, data JSONB, layout JSONB, is_published, created_at, updated_at)
  - 인덱스 생성 (slug, user_id, template_id, is_published)
  - RLS 활성화 및 정책 설정 (소유자 전체 접근, 공개 초대장 조회 허용)
  - updated_at 자동 업데이트 트리거

### Task 2: 공개 초대장 타입 정의 생성
- **File**: `src/types/publish.ts` (74 lines)
- **Exports**:
  - `Invitation` — 공개된 초대장 인터페이스
  - `InvitationInsert` — DB 삽입용 인터페이스
  - `InvitationPublishToggle` — 토글 요청/응답 인터페이스
  - `PublicInvitationResponse` — 공개 조회 API 응답 인터페이스
  - `SlugGenerate` — slug 생성 요청 인터페이스

### Task 3: 공개 초대장 조회 API 구현
- **File**: `src/app/api/invitations/[slug]/route.ts` (80 lines)
- **Endpoint**: `GET /api/invitations/[slug]`
- **Features**:
  - slug로 공개된 초대장 조회 (is_published = true)
  - 인증 불필요 (공개 API)
  - invitation + template 정보 함께 반환
  - 404 반환 (slug 없음 또는 비공개)

### Task 4: 공개/비공개 토글 API 구현
- **File**: `src/app/api/invitations/[slug]/publish/route.ts` (106 lines)
- **Endpoint**: `POST /api/invitations/[slug]/publish`
- **Features**:
  - 인증 필요 (Authorization header)
  - 소유자 검증 (auth.uid() = invitation.user_id)
  - is_published boolean 토글
  - 401 (인증 없음), 403 (소유자 아님), 404 (초대장 없음)

## Verification Results

### Automated Checks
- SQL 체크: All checks passed
- TypeScript 타입 체크: 통과
- 파일 존재 확인: All files exist
- 최소 줄 수 충족:
  - supabase-publish-setup.sql: 52 lines (>= 40)
  - src/types/publish.ts: 74 lines
  - src/app/api/invitations/[slug]/route.ts: 80 lines (>= 50)
  - src/app/api/invitations/[slug]/publish/route.ts: 106 lines (>= 40)

## Files Created
1. `supabase-publish-setup.sql` — DB 마이그레이션
2. `src/types/publish.ts` — 타입 정의
3. `src/app/api/invitations/[slug]/route.ts` — 공개 조회 API
4. `src/app/api/invitations/[slug]/publish/route.ts` — 토글 API

## Next Steps
- Phase 6 Plan 02: Subpath routing (`/[username]`) 공개 초대장 페이지, 공유 컴포넌트
- Phase 6 Plan 03: Editor에 공개 토글 통합, 초대장 생성 API
