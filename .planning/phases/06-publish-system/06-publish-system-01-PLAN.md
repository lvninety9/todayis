---
phase: 06-publish-system
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: [PUBLISH-01]
must_haves:
  truths:
    - "invitations 테이블이 Supabase에 생성됨"
    - "invitations 테이블에 slug UNIQUE 인덱스가 설정됨"
    - "공개 초대장 조회 API가 구현됨"
    - "초대장 공개/비공개 토글 API가 구현됨"
  artifacts:
    - path: "supabase-publish-setup.sql"
      provides: "invitations 테이블 생성 + 인덱스 + RLS 정책"
      min_lines: 40
    - path: "src/types/publish.ts"
      provides: "초대장 공개 관련 타입 정의"
      exports: ["Invitation", "InvitationData"]
    - path: "src/app/api/invitations/[slug]/route.ts"
      provides: "공개 초대장 조회 API"
      min_lines: 50
    - path: "src/app/api/invitations/[slug]/publish/route.ts"
      provides: "초대장 공개/비공개 토글 API"
      min_lines: 40
  key_links:
    - from: "src/app/api/invitations/[slug]/route.ts"
      to: "src/types/publish.ts"
      via: "Type import"
      pattern: "import.*Invitation"
    - from: "src/app/api/invitations/[slug]/publish/route.ts"
      to: "src/lib/auth.ts"
      via: "Auth helper import"
      pattern: "import.*getUserFromRequest"

---

# Phase 6: 초대장 공개 시스템 - PLAN 01

## Objective
invitations 테이블 생성, 공개 초대장 조회 API, 공개/비공개 토글 API 구현

Purpose: 초대장 공개 시스템의 데이터베이스 기반과 API 구조 마련

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL) — Prisma NOT used
- **Auth**: Supabase Auth (JWT via Authorization header)
- **Phase Goal**: 생성된 초대장을 공개하고 공유할 수 있도록 구현
- **Routing**: subpath routing (`/[username]`) — Phase 6 Plan 02에서 구현

### Existing Patterns
- API routes: `src/app/api/*/route.ts` (Next.js 14 App Router)
- Auth helper: `src/lib/auth.ts` — `getUserFromRequest(request)` 패턴
- Types: `src/types/*.ts` — interface + export 패턴
- SQL migrations: root directory `supabase-*.sql` 파일들
- RLS 정책: templates 테이블과 동일한 패턴 사용

### User Decisions (Locked) — CONTEXT 참조
- **초대장 데이터 모델**: `invitations` 테이블 (id, user_id, template_id, slug UNIQUE, title, data JSONB, layout JSONB, is_published BOOLEAN, created_at, updated_at)
- **slug 생성**: user_id + template_id 기반 URL-safe 문자열 (예: `jay-wedding-2024`)
- **공개 여부**: `is_published = true`일 때만 공개 조회 가능
- **데이터 분리**: template 정의(고정)와 invitation 데이터(사용자 맞춤) 분리 저장
- **RLS**: 소유자만 수정, 공개 초대장은 누구나 조회 가능

### User Setup Required
- `supabase-publish-setup.sql`을 Supabase SQL 에디터에서 실행

## Must Haves

### Truths
1. invitations 테이블이 Supabase에 생성됨 (user_id, template_id, slug UNIQUE, title, data JSONB, layout JSONB, is_published, created_at, updated_at)
2. slug에 UNIQUE 인덱스가 설정됨
3. invitations 테이블에 RLS 활성화 (소유자만 수정, 공개 초대장은 누구나 조회)
4. 초대장 관련 타입 정의가 생성됨
5. 공개 초대장 조회 API (`GET /api/invitations/[slug]`)가 구현됨
6. 공개/비공개 토글 API (`POST /api/invitations/[slug]/publish`)가 구현됨

### Artifacts
- path: `supabase-publish-setup.sql`
  provides: "invitations 테이블 생성 + 인덱스 + RLS 정책"
  min_lines: 40
- path: `src/types/publish.ts`
  provides: "초대장 공개 관련 타입 정의"
  exports: ["Invitation", "InvitationData"]
- path: `src/app/api/invitations/[slug]/route.ts`
  provides: "공개 초대장 조회 API"
  min_lines: 50
- path: `src/app/api/invitations/[slug]/publish/route.ts`
  provides: "초대장 공개/비공개 토글 API"
  min_lines: 40

### Key Links
- from: `src/app/api/invitations/[slug]/route.ts`
  to: `src/types/publish.ts`
  via: "Type import"
  pattern: "import.*Invitation"
- from: `src/app/api/invitations/[slug]/publish/route.ts`
  to: `src/lib/auth.ts`
  via: "Auth helper import"
  pattern: "import.*getUserFromRequest"
- from: `src/app/api/invitations/[slug]/route.ts`
  to: `src/lib/supabase/server.ts`
  via: "Supabase client import"
  pattern: "import.*createClient"

## Tasks

<task type="auto">
  <name>Task 1: Supabase SQL Migration 생성</name>
  <files>supabase-publish-setup.sql</files>
  <action>
    Supabase SQL 마이그레이션 스크립트 생성:

    1. invitations 테이블 생성:
       - id UUID PRIMARY KEY DEFAULT gen_random_uuid()
       - user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
       - template_id UUID REFERENCES templates(id) ON DELETE CASCADE
       - slug TEXT UNIQUE NOT NULL
       - title TEXT NOT NULL DEFAULT '웨딩 초대장'
       - data JSONB NOT NULL DEFAULT '{}'::jsonb (템플릿 데이터: field name -> value 매핑)
       - layout JSONB NOT NULL DEFAULT '{}'::jsonb (레이아웃 설정)
       - is_published BOOLEAN NOT NULL DEFAULT false
       - created_at TIMESTAMPTZ NOT NULL DEFAULT now()
       - updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

    2. 인덱스 생성:
       - CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug)
       - CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id)
       - CREATE INDEX IF NOT EXISTS idx_invitations_template_id ON public.invitations(template_id)
       - CREATE INDEX IF NOT EXISTS idx_invitations_is_published ON public.invitations(is_published)

    3. RLS 활성화:
       - ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY

    4. RLS 정책 설정:
       - 소유자만 관리: auth.uid() = user_id
       - 공개 초대장 조회: is_published = true 인 경우 누구나 SELECT 가능
       - 소유자만 업데이트/삭제: auth.uid() = user_id

    5. updated_at 자동 업데이트 트리거:
       - 기존 update_updated_at_column() 함수 재사용

    Reference: supabase-setup.sql 패턴과 동일하게 작성
  </action>
  <verify>
    <automated>
node -e "
  const fs = require('fs');
  const sql = fs.readFileSync('supabase-publish-setup.sql', 'utf8');
  const checks = [
    ['invitations 테이블 CREATE', /CREATE TABLE.*invitations/i],
    ['user_id 컬럼', /user_id.*UUID/],
    ['template_id 컬럼', /template_id.*UUID/],
    ['slug 컬럼 UNIQUE', /slug.*TEXT.*UNIQUE/],
    ['title 컬럼', /title.*TEXT/],
    ['data JSONB 컬럼', /data.*JSONB/],
    ['layout JSONB 컬럼', /layout.*JSONB/],
    ['is_published 컬럼', /is_published.*BOOLEAN/],
    ['created_at 컬럼', /created_at.*TIMESTAMPTZ/],
    ['updated_at 컬럼', /updated_at.*TIMESTAMPTZ/],
    ['slug 인덱스', /idx_invitations_slug/],
    ['RLS 활성화', /ENABLE ROW LEVEL SECURITY/],
    ['소유자 정책', /auth\.uid\(\) = user_id/],
    ['공개 조회 정책', /is_published = true/]
  ];
  let allPass = true;
  for (const [name, pattern] of checks) {
    if (!pattern.test(sql)) {
      console.log('FAIL: ' + name);
      allPass = false;
    }
  }
  if (allPass) console.log('All SQL checks passed');
"
    </automated>
  </verify>
  <done>
    - supabase-publish-setup.sql 생성됨
    - invitations 테이블 생성 SQL 포함
    - slug, data, layout, is_published 컬럼 포함
    - 인덱스 및 RLS 정책 포함
    - 모든 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 공개 초대장 타입 정의 생성</name>
  <files>src/types/publish.ts</files>
  <action>
    공개 초대장 시스템 타입 정의 생성:

    1. Invitation 인터페이스:
       - id: string
       - user_id: string
       - template_id: string
       - slug: string
       - title: string
       - data: Record<string, string> (템플릿 필드 값 매핑)
       - layout: Record<string, any> (레이아웃 설정)
       - is_published: boolean
       - created_at: string
       - updated_at: string

    2. InvitationInsert 인터페이스 (DB 삽입용):
       - user_id: string
       - template_id: string
       - slug: string
       - title: string
       - data: Record<string, string>
       - layout: Record<string, any>

    3. InvitationPublishToggle 인터페이스 (토글 요청/응답용):
       - is_published: boolean

    4. PublicInvitationResponse 인터페이스 (공개 조회 API 응답):
       - invitation: Invitation
       - template: { id: string; name: string; category: string }

    5. SlugGenerate 인터페이스 (slug 생성 요청):
       - userId: string
       - templateId: string
       - title: string

    Reference: src/types/template.ts, src/types/payment.ts 패턴과 완전히 동일하게 작성
  </action>
  <verify>
    <automated>cd src/types && npx tsc --noEmit publish.ts 2>&1</automated>
  </verify>
  <done>
    - Invitation, InvitationInsert, InvitationPublishToggle 인터페이스 정의 완료
    - PublicInvitationResponse, SlugGenerate 타입 정의 완료
    - 모든 타입 export됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 공개 초대장 조회 API 구현</name>
  <files>src/app/api/invitations/[slug]/route.ts</files>
  <action>
    공개 초대장 조회 API (`GET /api/invitations/[slug]`) 구현:

    1. API 엔드포인트:
       - method: GET
       - params: slug (dynamic route)
       - auth: 불필요 (공개 조회)
       - response: Invitation + template 정보

    2. 로직:
       - Supabase client로 invitations 테이블에서 slug 조회
       - is_published = true 조건 추가
       - 해당 invitation의 template_id로 templates 테이블에서 템플릿 정보 조인
       - 404 반환 (slug가 없거나 비공개인 경우)
       - 200 + invitation 데이터 반환

    3. 에러 처리:
       - slug 없음: 400 Bad Request
       - 초대장 없음: 404 Not Found
       - 서버 에러: 500 Internal Server Error

    4. 응답 형식:
       {
         "invitation": { ... },
         "template": { "id": "...", "name": "...", "category": "..." }
       }

    Reference: 기존 API routes 패턴 (`src/app/api/payment/webhook/route.ts` 등)과 동일하게 작성
    Supabase server client 사용 (`src/lib/supabase/server.ts`)
  </action>
  <verify>
    <automated>cd src/app/api/invitations/\[slug\] && npx tsc --noEmit route.ts 2>&1</automated>
  </verify>
  <done>
    - GET /api/invitations/[slug] API 구현됨
    - is_published = true 조건으로 공개 초대장만 조회
    - template 정보 조인 포함
    - 에러 처리 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 4: 공개/비공개 토글 API 구현</name>
  <files>src/app/api/invitations/[slug]/publish/route.ts</files>
  <action>
    공개/비공개 토글 API (`POST /api/invitations/[slug]/publish`) 구현:

    1. API 엔드포인트:
       - method: POST
       - params: slug (dynamic route)
       - auth: 필요 (Authorization header)
       - body: { is_published: boolean }
       - response: 업데이트된 invitation 데이터

    2. 로직:
       - getUserFromRequest()로 사용자 인증
       - slug로 invitation 조회
       - ownership 검증 (auth.uid() = invitation.user_id)
       - is_published 값 업데이트
       - 업데이트된 invitation 반환

    3. 에러 처리:
       - 인증 없음: 401 Unauthorized
       - 소유자 아님: 403 Forbidden
       - 초대장 없음: 404 Not Found
       - 서버 에러: 500 Internal Server Error

    4. 응답 형식:
       {
         "invitation": { ... },
         "message": "초대장이 공개되었습니다" / "초대장이 비공개로 전환되었습니다"
       }

    Reference: 기존 인증된 API routes (`src/app/api/payment/verify/route.ts` 등)과 동일하게 작성
  </action>
  <verify>
    <automated>cd src/app/api/invitations/\[slug\]/publish && npx tsc --noEmit route.ts 2>&1</automated>
  </verify>
  <done>
    - POST /api/invitations/[slug]/publish API 구현됨
    - 인증 및 ownership 검증 포함
    - is_published 토글 로직 완료
    - 에러 처리 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

## Verification

### Automated Checks
```bash
# SQL 체크
node -e "
  const fs = require('fs');
  const sql = fs.readFileSync('supabase-publish-setup.sql', 'utf8');
  const checks = [
    'CREATE TABLE.*invitations',
    'slug.*TEXT.*UNIQUE',
    'data.*JSONB',
    'layout.*JSONB',
    'is_published.*BOOLEAN',
    'idx_invitations_slug',
    'ENABLE ROW LEVEL SECURITY',
    'auth\\.uid\\(\\) = user_id',
    'is_published = true'
  ];
  let allPass = true;
  for (const pattern of checks) {
    if (!new RegExp(pattern, 'i').test(sql)) {
      console.log('FAIL: ' + pattern);
      allPass = false;
    }
  }
  if (allPass) console.log('All SQL checks passed');
"

# 타입 체크
npx tsc --noEmit

# 파일 존재 확인
node -e "
  const fs = require('fs');
  const files = [
    'src/types/publish.ts',
    'src/app/api/invitations/[slug]/route.ts',
    'src/app/api/invitations/[slug]/publish/route.ts'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"
```

### Manual Verification
1. invitations 테이블에 모든 필요한 컬럼이 포함되었는지 확인
2. slug에 UNIQUE 제약이 설정되었는지 확인
3. RLS 정책이 올바르게 설정되었는지 확인 (소유자만 수정, 공개 초대장은 누구나 조회)
4. GET /api/invitations/[slug] API가 공개 초대장만 반환하는지 확인
5. POST /api/invitations/[slug]/publish API가 ownership 검증을 수행하는지 확인

## Success Criteria

- [ ] supabase-publish-setup.sql 생성 완료 (invitations 테이블 + 인덱스 + RLS)
- [ ] src/types/publish.ts에 Invitation, InvitationInsert, InvitationPublishToggle 정의 완료
- [ ] src/app/api/invitations/[slug]/route.ts에 공개 조회 API 구현 완료 (50줄 이상)
- [ ] src/app/api/invitations/[slug]/publish/route.ts에 토글 API 구현 완료 (40줄 이상)
- [ ] npx tsc --noEmit 통과
- [ ] 모든 파일 존재 확인 통과

## Output
After completion, create `.planning/phases/06-publish-system/06-publish-system-01-SUMMARY.md`
