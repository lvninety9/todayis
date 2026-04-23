---
phase: 06-publish-system
plan: 02
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: [PUBLISH-02]
must_haves:
  truths:
    - "`/[username]` 서브패스가 dynamic route로 생성됨"
    - "공개 초대장 페이지가 invitation 데이터를 조회하여 렌더링함"
    - "공유 다이얼로그 컴포넌트가 링크 복사 기능을 제공함"
    - "초대장 뷰어 컴포넌트가 template data를 렌더링함"
  artifacts:
    - path: "src/app/(main)/[username]/page.tsx"
      provides: "서브패싱 공개 초대장 페이지"
      min_lines: 80
    - path: "src/components/publish/ShareDialog.tsx"
      provides: "공유 다이얼로그 (링크 복사)"
      min_lines: 40
    - path: "src/components/publish/ShareButton.tsx"
      provides: "공유 버튼 (트리거)"
      min_lines: 20
    - path: "src/components/publish/InvitationViewer.tsx"
      provides: "초대장 렌더링 뷰어"
      min_lines: 60
  key_links:
    - from: "src/app/(main)/[username]/page.tsx"
      to: "src/components/publish/InvitationViewer.tsx"
      via: "Component import"
      pattern: "import.*InvitationViewer"
    - from: "src/app/(main)/[username]/page.tsx"
      to: "src/components/publish/ShareDialog.tsx"
      via: "Component import"
      pattern: "import.*ShareDialog"
    - from: "src/components/publish/InvitationViewer.tsx"
      to: "@/types/publish"
      via: "Type import"
      pattern: "import.*Invitation"
    - from: "src/components/publish/ShareDialog.tsx"
      to: "src/components/publish/ShareButton.tsx"
      via: "Component import"
      pattern: "import.*ShareButton"

---

# Phase 6: 초대장 공개 시스템 - PLAN 02

## Objective
Subpath routing 공개 페이지 (`/[username]`)와 공유 컴포넌트 (ShareDialog, ShareButton, InvitationViewer) 구현

Purpose: 생성된 초대장을 외부에서 보고 공유할 수 있는 프론트엔드 UI 제공

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (client-side via `@supabase/ssr`)
- **Phase Goal**: 생성된 초대장을 공개하고 공유할 수 있도록 구현
- **Routing**: subpath routing (`/[username]`) — username은 user의 slug 또는 email prefix
- **API**: `GET /api/invitations/[slug]` (Plan 01에서 구현됨)

### Existing Patterns
- Client components: `'use client'` directive + `src/components/`
- API calls: `fetch()` with Bearer token (from `useSession`)
- UI components: shadcn/ui (`Button`, `Dialog`, `Card`, `Badge`)
- Hooks: `useSession` for auth state
- Dynamic routes: `[param]/page.tsx` pattern in `(main)/` group

### User Decisions (Locked)
- **username 매핑**: URL의 `[username]`은 user의 `email` prefix 또는 custom slug
- **공개 페이지**: 인증 불필요 (누구나 접근 가능)
- **공유 기능**: 링크 복사 + 소셜 공유 버튼
- **초대장 렌더링**: `invitation.data` (JSONB 필드 값)를 템플릿 필드 기준으로 렌더링

## Must Haves

### Truths
1. `src/app/(main)/[username]/page.tsx`가 dynamic route로 생성됨
2. 공개 초대장 페이지가 `/api/invitations/[slug]` API를 호출하여 데이터 조회
3. `InvitationViewer` 컴포넌트가 `invitation.data`를 렌더링
4. `ShareDialog` 컴포넌트가 링크 복사 기능 제공
5. `ShareButton` 컴포넌트가 `ShareDialog`를 트리거
6. 모든 컴포넌트가 `'use client'` directive 사용
7. TypeScript 타입 체크 통과

### Artifacts
- path: `src/app/(main)/[username]/page.tsx`
  provides: "서브패싱 공개 초대장 페이지"
  min_lines: 80
- path: `src/components/publish/ShareDialog.tsx`
  provides: "공유 다이얼로그 (링크 복사)"
  min_lines: 40
- path: `src/components/publish/ShareButton.tsx`
  provides: "공유 버튼 (트리거)"
  min_lines: 20
- path: `src/components/publish/InvitationViewer.tsx`
  provides: "초대장 렌더링 뷰어"
  min_lines: 60

### Key Links
- from: `src/app/(main)/[username]/page.tsx`
  to: `src/components/publish/InvitationViewer.tsx`
  via: "Component import"
  pattern: "import.*InvitationViewer"
- from: `src/app/(main)/[username]/page.tsx`
  to: `src/components/publish/ShareDialog.tsx`
  via: "Component import"
  pattern: "import.*ShareDialog"
- from: `src/components/publish/InvitationViewer.tsx`
  to: `@/types/publish`
  via: "Type import"
  pattern: "import.*Invitation"
- from: `src/components/publish/ShareDialog.tsx`
  to: `src/components/publish/ShareButton.tsx`
  via: "Component import"
  pattern: "import.*ShareButton"

## Tasks

<task type="auto">
  <name>Task 1: 공개 초대장 페이지 (`/[username]/page.tsx`) 구현</name>
  <files>src/app/(main)/[username]/page.tsx</files>
  <action>
    서브패싱 공개 초대장 페이지 구현:

    1. 페이지 구조:
       - `'use client'` directive
       - dynamic route param: `username` (URL path에서 추출)
       - API 호출: `GET /api/invitations/[slug]`
       - loading 상태 표시 (Spinner 사용)
       - 에러 상태 표시

    2. 로직:
       - `username` param을 `slug`로 사용 (username = slug)
       - `fetch('/api/invitations/' + slug)`로 공개 초대장 데이터 조회
       - 성공 시: `InvitationViewer` + `ShareButton` 렌더링
       - 404 시: "초대장을 찾을 수 없습니다" 메시지
       - 에러 시: 에러 메시지 표시

    3. UI 구성:
       - 헤더: 초대장 제목 (`invitation.title`)
       - 본문: `InvitationViewer` 컴포넌트
       - 액션: `ShareButton` 컴포넌트 (공유 버튼)
       - 스타일: 중앙 정렬, 최대 너비 `max-w-2xl`, 여백 `py-8 px-4`

    4. 응답 형식 처리:
       ```typescript
       interface PublicInvitationResponse {
         invitation: Invitation;
         template: { id: string; name: string; category: string };
       }
       ```

    Reference: `src/app/(main)/dashboard/page.tsx` 패턴과 동일하게 작성
    (loading 상태, API 호출, 에러 처리 패턴)
  </action>
  <verify>
    <automated>cd src/app/\(main\)/\[username\] && npx tsc --noEmit page.tsx 2>&1</automated>
  </verify>
  <done>
    - `src/app/(main)/[username]/page.tsx` 생성됨
    - dynamic route param `username` 처리
    - `/api/invitations/[slug]` API 호출
    - loading, error, success 상태 처리
    - `InvitationViewer` + `ShareButton` 렌더링
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 공유 다이얼로그 컴포넌트 (`ShareDialog`) 구현</name>
  <files>src/components/publish/ShareDialog.tsx</files>
  <action>
    공유 다이얼로그 컴포넌트 구현:

    1. 컴포넌트 구조:
       - `'use client'` directive
       - `Dialog` (shadcn/ui) 기반
       - props: `{ invitation: Invitation }`

    2. 기능:
       - 공유 링크 생성: `${window.location.origin}/${invitation.slug}`
       - "링크 복사" 버튼 (Clipboard API 사용)
       - 복사 성공 시: "링크가 복사되었습니다" 메시지
       - 복사 실패 시: 수동 복사 안내

    3. UI 구성:
       - DialogTrigger: 외부에서 trigger (ShareButton에서 사용)
       - DialogContent:
         - 제목: "초대장 공유"
         - 설명: "아래 링크를 복사하여 초대장을 공유하세요"
         - 링크 표시 영역 (readonly input 또는 text)
         - "링크 복사" 버튼
       - DialogFooter: "닫기" 버튼

    4. Clipboard API 사용:
       ```typescript
       navigator.clipboard.writeText(link)
         .then(() => setShowCopied(true))
         .catch(() => alert('복사에 실패했습니다. 수동으로 복사해주세요.'));
       ```

    Reference: `src/components/ui/dialog.tsx` 패턴과 동일하게 작성
    (shadcn/ui Dialog 컴포넌트 사용)
  </action>
  <verify>
    <automated>cd src/components/publish && npx tsc --noEmit ShareDialog.tsx 2>&1</automated>
  </verify>
  <done>
    - `src/components/publish/ShareDialog.tsx` 생성됨
    - Dialog 기반 공유 다이얼로그
    - 링크 복사 기능 (Clipboard API)
    - 복사 성공/실패 피드백
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 공유 버튼 컴포넌트 (`ShareButton`) 구현</name>
  <files>src/components/publish/ShareButton.tsx</files>
  <action>
    공유 버튼 컴포넌트 구현:

    1. 컴포넌트 구조:
       - `'use client'` directive
       - `Button` (shadcn/ui) 기반
       - `DialogTrigger`로 Dialog 연결
       - props: `{ invitation: Invitation }`

    2. 기능:
       - "공유" 버튼 표시 (share 아이콘 + 텍스트)
       - 클릭 시 `ShareDialog` 열기
       - `DialogTrigger`의 `asChild` prop으로 Button 래핑

    3. UI 구성:
       - 버튼 아이콘: share 아이콘 (SVG)
       - 버튼 텍스트: "공유"
       - variant: `outline`
       - size: `default`

    4. 구현 패턴:
       ```tsx
       <DialogTrigger asChild>
         <Button variant="outline">
           <ShareIcon />
           공유
         </Button>
       </DialogTrigger>
       ```

    Reference: `src/components/ui/button.tsx` 패턴과 동일하게 작성
    (shadcn/ui Button + DialogTrigger asChild 패턴)
  </action>
  <verify>
    <automated>cd src/components/publish && npx tsc --noEmit ShareButton.tsx 2>&1</automated>
  </verify>
  <done>
    - `src/components/publish/ShareButton.tsx` 생성됨
    - Button + DialogTrigger 조합
    - share 아이콘 표시
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 4: 초대장 뷰어 컴포넌트 (`InvitationViewer`) 구현</name>
  <files>src/components/publish/InvitationViewer.tsx</files>
  <action>
    초대장 뷰어 컴포넌트 구현:

    1. 컴포넌트 구조:
       - `'use client'` directive
       - props: `{ invitation: Invitation; template: { id; name; category } }`
       - `Card` (shadcn/ui) 기반 레이아웃

    2. 기능:
       - `invitation.data` (JSONB 필드 값) 렌더링
       - 각 필드를 label + value 형태로 표시
       - 레이아웃 설정 (`invitation.layout`) 적용
       - 템플릿 정보 표시 (제목, 카테고리)

    3. UI 구성:
       - Card 헤더: 초대장 제목 (`invitation.title`)
       - Card 본문:
         - `invitation.data`의 각 key-value 쌍 렌더링
         - 예: "신랑: Jay", "신부: Mina", "날짜: 2024년 6월 1일", "장소: OO호텔"
       - Card 푸터: 템플릿 정보 (선택적)

    4. 데이터 렌더링:
       ```tsx
       {Object.entries(invitation.data).map(([key, value]) => (
         <div key={key}>
           <span className="font-medium">{key}:</span>
           <span className="ml-2">{value}</span>
         </div>
       ))}
       ```

    5. 레이아웃 적용 (선택적):
       - `invitation.layout`에 따라 스타일 변경
       - 기본값: standard 레이아웃

    Reference: `src/components/ui/card.tsx` 패턴과 동일하게 작성
    (shadcn/ui Card 컴포넌트 사용)
  </action>
  <verify>
    <automated>cd src/components/publish && npx tsc --noEmit InvitationViewer.tsx 2>&1</automated>
  </verify>
  <done>
    - `src/components/publish/InvitationViewer.tsx` 생성됨
    - Card 기반 초대장 렌더링
    - `invitation.data` key-value 렌더링
    - 템플릿 정보 표시
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
    'src/app/(main)/[username]/page.tsx',
    'src/components/publish/ShareDialog.tsx',
    'src/components/publish/ShareButton.tsx',
    'src/components/publish/InvitationViewer.tsx'
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
    ['page.tsx >= 80', 'src/app/(main)/[username]/page.tsx', 80],
    ['ShareDialog.tsx >= 40', 'src/components/publish/ShareDialog.tsx', 40],
    ['ShareButton.tsx >= 20', 'src/components/publish/ShareButton.tsx', 20],
    ['InvitationViewer.tsx >= 60', 'src/components/publish/InvitationViewer.tsx', 60]
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
1. `/[username]` 페이지가 dynamic route로 동작하는지 확인
2. 공개 초대장 API 호출 후 데이터가 올바르게 렌더링되는지 확인
3. 공유 버튼 클릭 시 다이얼로그가 열리는지 확인
4. 링크 복사 버튼이 클립보드에 링크를 복사하는지 확인
5. InvitationViewer가 invitation.data의 모든 필드를 표시하는지 확인

## Success Criteria

- [ ] `src/app/(main)/[username]/page.tsx` 생성 완료 (80줄 이상)
- [ ] `src/components/publish/ShareDialog.tsx` 생성 완료 (40줄 이상)
- [ ] `src/components/publish/ShareButton.tsx` 생성 완료 (20줄 이상)
- [ ] `src/components/publish/InvitationViewer.tsx` 생성 완료 (60줄 이상)
- [ ] `npx tsc --noEmit` 통과
- [ ] 모든 파일 존재 확인 통과
- [ ] Key Links 검증 통과 (import 관계 확인)

## Output
After completion, create `.planning/phases/06-publish-system/06-publish-system-02-SUMMARY.md`
