---
phase: 06-publish-system
plan: 03
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: [PUBLISH-03]
must_haves:
  truths:
    - "POST /api/invitations API가 초대장 생성을 처리함"
    - "/create/[templateId] 페이지가 템플릿 로드 + 필드 편집 + 공개 토글을 제공함"
    - "생성된 초대장이 invitations 테이블에 저장됨"
    - "공개 토글이 is_published 값으로 저장됨"
  artifacts:
    - path: "src/app/api/invitations/route.ts"
      provides: "초대장 생성 API"
      min_lines: 60
    - path: "src/app/(main)/create/[templateId]/page.tsx"
      provides: "초대장 생성 페이지"
      min_lines: 100
    - path: "src/components/publish/InvitationEditor.tsx"
      provides: "초대장 편집기 (필드 값 편집 + 공개 토글)"
      min_lines: 60
  key_links:
    - from: "src/app/(main)/create/[templateId]/page.tsx"
      to: "src/components/publish/InvitationEditor.tsx"
      via: "Component import"
      pattern: "import.*InvitationEditor"
    - from: "src/app/(main)/create/[templateId]/page.tsx"
      to: "@/types/publish"
      via: "Type import"
      pattern: "import.*InvitationInsert"
    - from: "src/app/api/invitations/route.ts"
      to: "@/types/publish"
      via: "Type import"
      pattern: "import.*InvitationInsert"
    - from: "src/app/api/invitations/route.ts"
      to: "@/lib/auth"
      via: "Auth helper import"
      pattern: "import.*getUserFromRequest"

---

# Phase 6: 초대장 공개 시스템 - PLAN 03

## Objective
Editor에 공개 토글 통합, 초대장 생성 API 및 페이지 구현

Purpose: 사용자가 템플릿 기반으로 초대장을 생성하고 공개 여부를 설정할 수 있는 기능 제공

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (JWT via Authorization header)
- **Phase Goal**: 생성된 초대장을 공개하고 공유할 수 있도록 구현
- **API**: `POST /api/invitations` (새로 구현), `GET /api/invitations/[slug]` (Plan 01), `POST /api/invitations/[slug]/publish` (Plan 01)
- **Routing**: `/create/[templateId]` 서브패스 — 템플릿 기반 초대장 생성 페이지

### Existing Patterns
- Client components: `'use client'` directive + `src/components/`
- API calls: `fetch()` with Bearer token (from `useSession`)
- UI components: shadcn/ui (`Button`, `Input`, `Checkbox`, `Card`)
- Hooks: `useSession` for auth, `useTemplateEditor` for field editing
- Dynamic routes: `[param]/page.tsx` pattern in `(main)/` group
- Auth: `getUserFromRequest()` for server-side auth

### User Decisions (Locked)
- **초대장 생성 흐름**: 템플릿 상세 페이지 → "초대장 만들기" 버튼 → `/create/[templateId]` 페이지
- **필드 값 편집**: 템플릿의 `fields` 정의에 따라 동적 폼 생성
- **slug 생성**: 서버 사이드에서 `userId + templateId + timestamp` 기반 URL-safe 문자열 자동 생성
- **공개 여부**: `is_published` 필드, 기본값 `false`
- **데이터 분리**: template 정의(고정)와 invitation 데이터(사용자 맞춤) 분리 저장

## Must Haves

### Truths
1. `POST /api/invitations` API가 생성됨 (인증 필요, ownership 검증)
2. `/create/[templateId]` 페이지가 생성됨
3. 페이지가 템플릿 정보를 API로 조회하여 로드
4. 템플릿 필드 기반 동적 폼으로 데이터 입력
5. 공개 토글 체크박스로 `is_published` 설정
6. slug는 서버 사이드에서 자동 생성
7. 생성된 초대장이 invitations 테이블에 저장됨
8. TypeScript 타입 체크 통과

### Artifacts
- path: `src/app/api/invitations/route.ts`
  provides: "초대장 생성 API"
  min_lines: 60
- path: `src/app/(main)/create/[templateId]/page.tsx`
  provides: "초대장 생성 페이지"
  min_lines: 100
- path: `src/components/publish/InvitationEditor.tsx`
  provides: "초대장 편집기 (필드 값 편집 + 공개 토글)"
  min_lines: 60

### Key Links
- from: `src/app/(main)/create/[templateId]/page.tsx`
  to: `src/components/publish/InvitationEditor.tsx`
  via: "Component import"
  pattern: "import.*InvitationEditor"
- from: `src/app/(main)/create/[templateId]/page.tsx`
  to: `@/types/publish`
  via: "Type import"
  pattern: "import.*InvitationInsert"
- from: `src/app/api/invitations/route.ts`
  to: `@/types/publish`
  via: "Type import"
  pattern: "import.*InvitationInsert"
- from: `src/app/api/invitations/route.ts`
  to: `@/lib/auth`
  via: "Auth helper import"
  pattern: "import.*getUserFromRequest"

## Tasks

<task type="auto">
  <name>Task 1: 초대장 생성 API 구현</name>
  <files>src/app/api/invitations/route.ts</files>
  <action>
    초대장 생성 API (`POST /api/invitations`) 구현:

    1. API 엔드포인트:
       - method: POST
       - auth: 필요 (Authorization header)
       - body: { templateId, title, data, layout, is_published }
       - response: 생성된 invitation 데이터 + slug

    2. 로직:
       - getUserFromRequest()로 사용자 인증
       - body 검증 (templateId, title, data 필수)
       - template_id로 templates 테이블에서 템플릿 조회 (소유자 확인)
       - slug 자동 생성: `${userId}-${templateId.slice(0,8)}-${Date.now().toString(36)}`
       - invitations 테이블에 INSERT
       - 생성된 invitation 반환

    3. slug 생성 규칙:
       - userId + templateId prefix + timestamp base36
       - 예: "abc123-def45678-xyz123"
       - URL-safe 문자열 (alphanumeric + hyphen)

    4. 에러 처리:
       - 인증 없음: 401 Unauthorized
       - 템플릿 없음: 404 Not Found
       - 템플릿 소유자 아님: 403 Forbidden
       - 중복 slug: 500 Internal Server Error (retry logic)
       - 서버 에러: 500 Internal Server Error

    5. 응답 형식:
       {
         "invitation": { ... },
         "slug": "...",
         "message": "초대장이 생성되었습니다"
       }

    Reference: 기존 API routes 패턴과 동일하게 작성
    Supabase server client 사용 (`src/lib/supabase/server.ts`)
    Auth helper 사용 (`src/lib/auth.ts`)
  </action>
  <verify>
    <automated>cd src/app/api/invitations && npx tsc --noEmit route.ts 2>&1</automated>
  </verify>
  <done>
    - POST /api/invitations API 구현됨
    - 인증 및 ownership 검증 포함
    - slug 자동 생성 로직 포함
    - 에러 처리 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 초대장 생성 페이지 (`/create/[templateId]/page.tsx`) 구현</name>
  <files>src/app/(main)/create/[templateId]/page.tsx</files>
  <action>
    초대장 생성 페이지 구현:

    1. 페이지 구조:
       - `'use client'` directive
       - dynamic route param: `templateId` (URL path에서 추출)
       - API 호출: `GET /api/templates/[templateId]` (템플릿 정보 조회)
       - API 호출: `POST /api/invitations` (초대장 생성)
       - loading 상태 표시 (Spinner 사용)
       - 에러 상태 표시

    2. 로직:
       - `templateId` param으로 템플릿 정보 조회
       - 템플릿이 없거나 에러 시: 템플릿 목록으로 리다이렉트
       - 템플릿 로드 시: InvitationEditor 컴포넌트 렌더링
       - 생성 성공 시: 공개 페이지로 리다이렉트 (slug 기반)
       - 생성 실패 시: 에러 메시지 표시

    3. UI 구성:
       - 헤더: "초대장 만들기" + 템플릿 이름
       - 본문: InvitationEditor 컴포넌트
       - 푸터: "생성하기" 버튼 + "취소" 버튼
       - 스타일: 중앙 정렬, 최대 너비 `max-w-2xl`, 여백 `py-8 px-4`

    4. 생성 성공 후 처리:
       - 응답에서 slug 받아서 `/[slug]` 페이지로 리다이렉트
       - toast.success("초대장이 생성되었습니다")
       - 공유 버튼으로 바로 공유 가능

    Reference: `src/app/(main)/templates/[id]/page.tsx` 패턴과 동일하게 작성
    (loading 상태, API 호출, 에러 처리 패턴)
  </action>
  <verify>
    <automated>cd src/app/\(main\)/create/\[templateId\] && npx tsc --noEmit page.tsx 2>&1</automated>
  </verify>
  <done>
    - `src/app/(main)/create/[templateId]/page.tsx` 생성됨
    - dynamic route param `templateId` 처리
    - 템플릿 정보 API 호출
    - InvitationEditor 렌더링
    - 생성 API 호출 + 리다이렉트
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 초대장 편집기 컴포넌트 (`InvitationEditor`) 구현</name>
  <files>src/components/publish/InvitationEditor.tsx</files>
  <action>
    초대장 편집기 컴포넌트 구현:

    1. 컴포넌트 구조:
       - `'use client'` directive
       - props: `{ template: Template; initialData?: Record<string, string>; onSave: (data) => void; onCancel: () => void }`
       - Card 기반 레이아웃

    2. 기능:
       - 템플릿 필드 기반 동적 폼 생성
       - 각 필드에 대한 입력 필드 렌더링 (type에 따라 text/date)
       - 제목 입력 필드
       - 공개 토글 체크박스
       - 유효성 검사
       - onSave 콜백으로 데이터 전달

    3. UI 구성:
       - Card 헤더: "초대장 정보"
       - Card 본문:
         - 제목 입력 (Input)
         - 템플릿 필드 값 입력 (동적 폼)
         - 공개 토글 (Checkbox + Label)
       - Card 푸터:
         - "생성하기" 버튼 (primary)
         - "취소" 버튼 (outline)

    4. 필드 타입별 렌더링:
       - text: Input 필드
       - date: Input type="date"
       - image: Input 필드 (URL 입력)
       - location: Input 필드 (주소 입력)

    5. 유효성 검사:
       - required 필드 체크
       - date 필드 유효성 체크
       - 에러 메시지 표시

    6. 데이터 구조:
       ```typescript
       interface InvitationFormData {
         title: string;
         data: Record<string, string>;
         is_published: boolean;
       }
       ```

    Reference: `src/app/(main)/templates/[id]/edit/page.tsx` 패턴과 동일하게 작성
    (필드 편집, 유효성 검사, 폼 제출 패턴)
  </action>
  <verify>
    <automated>cd src/components/publish && npx tsc --noEmit InvitationEditor.tsx 2>&1</automated>
  </verify>
  <done>
    - `src/components/publish/InvitationEditor.tsx` 생성됨
    - 템플릿 필드 기반 동적 폼
    - 제목 입력 + 공개 토글
    - 유효성 검사 포함
    - TypeScript 타입 체크 통과
  </done>
</task>

## Verification

### Automated Checks
```bash
# 타입 체크
npx tsc --noEmit

# 파일 존재 확인
node -e "
  const fs = require('fs');
  const files = [
    'src/app/api/invitations/route.ts',
    'src/app/(main)/create/[templateId]/page.tsx',
    'src/components/publish/InvitationEditor.tsx'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"

# 최소 줄 수 체크
node -e "
  const fs = require('fs');
  const checks = [
    ['route.ts >= 60', 'src/app/api/invitations/route.ts', 60],
    ['page.tsx >= 100', 'src/app/(main)/create/[templateId]/page.tsx', 100],
    ['InvitationEditor.tsx >= 60', 'src/components/publish/InvitationEditor.tsx', 60]
  ];
  let allPass = true;
  for (const [name, path, min] of checks) {
    const lines = fs.readFileSync(path, 'utf8').split('\n').length;
    if (lines < min) {
      console.log('FAIL: ' + name + ' (got ' + lines + ' lines)');
      allPass = false;
    }
  }
  if (allPass) console.log('All line count checks passed');
"
```

### Manual Verification
1. POST /api/invitations API가 인증된 사용자만 초대장 생성 가능한지 확인
2. /create/[templateId] 페이지가 템플릿 정보를 올바르게 로드하는지 확인
3. InvitationEditor가 템플릿 필드 기반 동적 폼을 렌더링하는지 확인
4. 공개 토글이 is_published 값으로 저장되는지 확인
5. 생성 성공 시 slug 기반 공개 페이지로 리다이렉트되는지 확인

## Success Criteria

- [ ] `src/app/api/invitations/route.ts` 생성 완료 (60줄 이상)
- [ ] `src/app/(main)/create/[templateId]/page.tsx` 생성 완료 (100줄 이상)
- [ ] `src/components/publish/InvitationEditor.tsx` 생성 완료 (60줄 이상)
- [ ] `npx tsc --noEmit` 통과
- [ ] 모든 파일 존재 확인 통과
- [ ] Key Links 검증 통과 (import 관계 확인)

## Output
After completion, create `.planning/phases/06-publish-system/06-publish-system-03-SUMMARY.md`
