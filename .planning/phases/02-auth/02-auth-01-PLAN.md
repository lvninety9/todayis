---
phase: 02-auth
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: ["src/types/auth.ts", "src/hooks/use-auth.ts"]
autonomous: true
requirements: ["AUTH-01", "AUTH-02"]
---

<objective>
Supabase Auth 연동 및 타입 정의
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/PHASE-02-AUTH.md
@.planning/PROJECT.md
@src/lib/supabase/client.ts
@src/lib/supabase/server.ts
</context>

<interfaces>
<!-- Key types and contracts the executor needs. Extracted from codebase. -->
<!-- Executor should use these directly — no codebase exploration needed. -->

From src/lib/supabase/client.ts:
```typescript
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

From src/lib/supabase/server.ts:
```typescript
export async function createServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  )
}
```

From src/middleware.ts:
```typescript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Auth 타입 정의</name>
  <files>src/types/auth.ts</files>
  <action>
    Supabase Auth 와 관련된 타입 정의 생성:
    
    1. User 인터페이스:
       - id: string
       - email: string
       - user_metadata: { name?: string, avatar_url?: string }
       - created_at: string
    
    2. AuthResponse 인터페이스:
       - user: User | null
       - error: string | null
    
    3. LoginCredentials 인터페이스:
       - email: string
       - password: string
    
    4. SignupCredentials 인터페이스:
       - email: string
       - password: string
       - name: string
    
    Reference: Supabase Auth API docs, existing client.ts/server.ts patterns
    
    D-01: Supabase Auth 사용 per user decision
  </action>
  <verify>
    <automated>npx tsc --noEmit src/types/auth.ts</automated>
  </verify>
  <done>
    src/types/auth.ts 파일이 다음을 포함:
    - User 인터페이스 (id, email, user_metadata, created_at)
    - AuthResponse 인터페이스 (user, error)
    - LoginCredentials 인터페이스 (email, password)
    - SignupCredentials 인터페이스 (email, password, name)
    - 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 인증 훅 구현</name>
  <files>src/hooks/use-auth.ts</files>
  <action>
    Supabase Auth 연동 커스텀 훅 생성:
    
    1. useAuth 훅:
       - user: User | null (current user)
       - isLoading: boolean (session loading state)
       - signIn(credentials: LoginCredentials): Promise<AuthResponse>
       - signUp(credentials: SignupCredentials): Promise<AuthResponse>
       - signOut(): Promise<void>
       - signInWithProvider(provider: 'google' | 'github'): void
    
    2. Client-side session management:
       - useEffect 로 session loading
       - supabase.auth.getSession() 사용
       - supabase.auth.onAuthStateChange() 으로 상태 업데이트
    
    3. Error handling:
       - Supabase error codes 처리
       - 사용자 친화적 에러 메시지 반환
    
    Reference: src/lib/supabase/client.ts patterns, Supabase Auth docs
    
    D-01: Supabase Auth 사용 per user decision
  </action>
  <verify>
    <automated>npx tsc --noEmit src/hooks/use-auth.ts</automated>
  </verify>
  <done>
    src/hooks/use-auth.ts 파일이 다음을 포함:
    - useAuth 훅 (user, isLoading, signIn, signUp, signOut, signInWithProvider)
    - Client-side session management (useEffect, getSession, onAuthStateChange)
    - Error handling (Supabase error codes 처리)
    - 타입 체크 통과
  </done>
</task>

</tasks>

<verification>
- 타입 정의 파일이 TypeScript 체크 통과
- 인증 훅이 Supabase Auth API 와 정상 연동
- user, isLoading 상태가 올바르게 관리됨
</verification>

<success_criteria>
- src/types/auth.ts: User, AuthResponse, LoginCredentials, SignupCredentials 타입 정의 완료
- src/hooks/use-auth.ts: useAuth 훅 구현 완료 (signIn, signUp, signOut, signInWithProvider)
- 타입 체크 통과 (npx tsc --noEmit)
- Supabase Auth API 와 연동 테스트 통과
</success_criteria>

<output>
After completion, create `.planning/phases/02-auth/02-auth-01-SUMMARY.md`
</output>
