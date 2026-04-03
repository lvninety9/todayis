---
phase: 02-auth
plan: 03
type: execute
wave: 2
depends_on: ["02-auth-01", "02-auth-02"]
files_modified: ["src/app/(auth)/signup/page.tsx", "src/app/(main)/page.tsx", "src/middleware.ts"]
autonomous: true
requirements: ["AUTH-02", "AUTH-03"]
---

<objective>
회원가입 페이지 및 인증 보호 라우트 설정
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/PHASE-02-AUTH.md
@.planning/phases/02-auth/02-auth-01-SUMMARY.md
@.planning/phases/02-auth/02-auth-02-SUMMARY.md
@src/app/(auth)/login/page.tsx
@src/middleware.ts
@src/app/(main)/page.tsx
</context>

<interfaces>
<!-- Key types and contracts the executor needs. Extracted from codebase. -->
<!-- Executor should use these directly — no codebase exploration needed. -->

From src/app/(auth)/login/page.tsx:
```typescript
export default function LoginPage() {
  const { signIn, signInWithProvider, isLoading } = useAuth()
  
  // ... component implementation
}
```

From src/middleware.ts:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Auth logic here
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

From src/hooks/use-auth.ts:
```typescript
export function useAuth() {
  const user = useShallowSelector(state => state.user)
  const isLoading = useShallowSelector(state => state.isLoading)
  const signOut = useShallowSelector(state => state.signOut)
  
  return { user, isLoading, signOut }
}
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: 회원가입 페이지 구현</name>
  <files>src/app/(auth)/signup/page.tsx</files>
  <action>
    회원가입 페이지 컴포넌트 생성:
    
    1. SignupPage 컴포넌트:
       - AuthForm 컴포넌트 (mode: 'signup')
       - SocialLogin 컴포넌트 (선택사항)
       - Login link (이미 계정이 있는 사용자용)
    
    2. Form Handling:
       - useAuth 훅 사용
       - onSubmit: signUp(credentials)
       - 성공 시: / (메인 대시보드로 리디렉션)
       - 실패 시: 에러 메시지 표시
    
    3. UI Layout:
       - 로그인 페이지와 유사한 레이아웃
       - "이미 계정이 있으신가요? 로그인" 링크
    
    Reference: src/app/(auth)/login/page.tsx, src/components/auth/AuthForm.tsx
    
    D-01: Supabase Auth 사용 per user decision (AUTH-01)
  </action>
  <verify>
    <automated>npm run lint && npm run type-check</automated>
  </verify>
  <done>
    src/app/(auth)/signup/page.tsx 파일이 다음을 포함:
    - AuthForm (mode: 'signup')
    - Login link
    - useAuth 훅 연동 (signUp)
    - 리디렉션 로직 (/로)
    - lint 및 type-check 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 메인 대시보드에 인증 상태 표시</name>
  <files>src/app/(main)/page.tsx</files>
  <action>
    메인 대시보드에 인증 상태 표시:
    
    1. Dashboard 컴포넌트:
       - useAuth 훅 사용
       - Loading 상태: "로그인 중..."
       - 미인증 상태: 로그인 페이지로 리디렉션
       - 인증 상태: 사용자 정보 표시 + 로그아웃 버튼
    
    2. User Info Display:
       - 사용자 이메일 (user.email)
       - 사용자 이름 (user.user_metadata?.name)
       - 아바타 (user.user_metadata?.avatar_url)
    
    3. Logout Button:
       - shadcn/ui Button (variant: outline)
       - onClick: signOut()
       - 성공 시: /login 으로 리디렉션
    
    4. UI Layout:
       - Welcome 메시지
       - 템플릿 선택 가이드
       - Responsive design
    
    Reference: src/hooks/use-auth.ts, shadcn/ui docs
    
    D-02: shadcn/ui 컴포넌트 사용 per user decision
  </action>
  <verify>
    <automated>npm run lint && npm run type-check</automated>
  </verify>
  <done>
    src/app/(main)/page.tsx 파일이 다음을 포함:
    - useAuth 훅 연동 (user, isLoading, signOut)
    - Loading 상태 처리
    - 미인증 사용자 리디렉션 (/login)
    - 사용자 정보 표시 (이름, 이메일)
    - 로그아웃 버튼
    - lint 및 type-check 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 미들웨어로 라우트 보호</name>
  <files>src/middleware.ts</files>
  <action>
    Next.js middleware 로 인증 보호 라우트 설정:
    
    1. Authenticated Routes 보호:
       - /(main) 그룹 모든 라우트 보호
       - 미인증 사용자: /login 으로 리디렉션
    
    2. Public Routes 허용:
       - /(auth) 그룹 (login, signup) — 항상 접근 가능
       - /api/* — API 라우트
       - /_next/* — Next.js static files
       - /favicon.ico
    
    3. Session Management:
       - supabase.auth.getSession() 으로 세션 확인
       - 세션이 없으면 로그인 페이지로 리디렉션
    
    4. Redirect Logic:
       - 인증된 사용자가 /login 접근 시: / 로 리디렉션
       - 미인증 사용자가 /(main) 접근 시: /login 으로 리디렉션
    
    Reference: Next.js middleware docs, Supabase Auth docs
    
    D-04: Next.js middleware 사용 per user decision (AUTH-03)
  </action>
  <verify>
    <automated>npm run lint && npm run type-check</automated>
  </verify>
  <done>
    src/middleware.ts 파일이 다음을 포함:
    - authenticated routes 보호 (/(main) 그룹)
    - public routes 허용 (/(auth) 그룹, /api/*, /_next/*)
    - session 관리 (getSession)
    - redirect 로직 (인증/미인증 처리)
    - lint 및 type-check 통과
  </done>
</task>

</tasks>

<verification>
- 회원가입 페이지가 정상 작동 (이메일/비밀번호 + name 입력)
- 메인 대시보드가 인증 상태 표시
- 미인증 사용자가 보호된 페이지 접근 시 로그인 페이지로 리디렉션
- 인증된 사용자가 /login 접근 시 메인 대시보드로 리디렉션
- 로그아웃 버튼이 정상 작동
</verification>

<success_criteria>
- src/app/(auth)/signup/page.tsx: 회원가입 페이지 완료
- src/app/(main)/page.tsx: 메인 대시보드에 인증 상태 표시 완료
- src/middleware.ts: 라우트 보호 설정 완료
- lint 및 type-check 통과
- AUTH-02: 자동 로그인, 세션 만료 처리, 로그아웃 기능 구현
- AUTH-03: 인증 보호 라우트 구현 (미인증 사용자 접근 차단)
</success_criteria>

<output>
After completion, create `.planning/phases/02-auth/02-auth-03-SUMMARY.md`
</output>
