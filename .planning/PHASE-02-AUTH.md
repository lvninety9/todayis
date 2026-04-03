# Phase 2: Auth - 인증 시스템

## Phase Goal

사용자가 안전하게 로그인하고 세션을 관리할 수 있는 인증 시스템 구현

## Success Criteria

- [x] 로그인 페이지에서 Email/Password 인증 가능
- [x] Google/GitHub OAuth 버튼 클릭 시 인증 플로우 시작
- [x] 인증 후 메인 대시보드로 리디렉션
- [x] 미인증 사용자가 보호된 페이지 접근 시 로그인 페이지로 리디렉션
- [x] 로그아웃 버튼 클릭 시 세션 종료 및 로그인 페이지로 리디렉션

## Plans Created

### Plan 01: Supabase Auth 연동 및 타입 정의
**Wave:** 1  
**Tasks:** 2  
**Files:** src/types/auth.ts, src/hooks/use-auth.ts  
**Requirements:** AUTH-01, AUTH-02

**Tasks:**
1. Auth 타입 정의 (User, AuthResponse, LoginCredentials, SignupCredentials)
2. 인증 훅 구현 (useAuth: signIn, signUp, signOut, signInWithProvider)

### Plan 02: 로그인/회원가입 페이지 구현
**Wave:** 2  
**Tasks:** 3  
**Files:** src/app/(auth)/login/page.tsx, src/components/auth/AuthForm.tsx, src/components/auth/SocialLogin.tsx  
**Requirements:** AUTH-01

**Tasks:**
1. AuthForm 컴포넌트 생성 (재사용 가능한 인증 폼)
2. SocialLogin 컴포넌트 생성 (Google, GitHub 버튼)
3. 로그인 페이지 구현 (AuthForm + SocialLogin)

### Plan 03: 인증 보호 라우트 설정
**Wave:** 2  
**Tasks:** 3  
**Files:** src/app/(auth)/signup/page.tsx, src/app/(main)/page.tsx, src/middleware.ts  
**Requirements:** AUTH-02, AUTH-03

**Tasks:**
1. 회원가입 페이지 구현
2. 메인 대시보드에 인증 상태 표시
3. 미들웨어로 라우트 보호

## Wave Structure

| Wave | Plans | Autonomous | Parallel |
|------|-------|------------|----------|
| 1 | 02-auth-01 | yes | - |
| 2 | 02-auth-02, 02-auth-03 | yes | ✅ parallel |

## User Decisions

### Locked Decisions
- **D-01**: Supabase Auth 사용 (Google, GitHub, Email 인증)
- **D-02**: shadcn/ui 컴포넌트 사용 (Card, Button, Input, Label)
- **D-03**: Tailwind CSS v4 스타일링
- **D-04**: Next.js App Router middleware 사용 (라우트 보호)

### Deferred Ideas
- Social login 추가 (Kakao, Naver) - V3 에서 구현
- 2FA 인증 - V2+ 에서 구현
- 비밀번호 재설정 - V2+ 에서 구현

## Dependencies

- Supabase Auth API (이미 설정 완료)
- shadcn/ui 컴포넌트 (이미 설치 완료)
- Next.js middleware (이미 설정 완료)

## Risks

1. **Supabase OAuth 설정**: Google/GitHub OAuth callback URL 설정 필요
   - Google: https://console.developers.google.com/apis/credentials
   - GitHub: https://github.com/settings/developers
   
2. **RLS 정책**: auth.users 테이블 접근 제어 정책 필요
   - Supabase Dashboard -> Database -> Policies
   
3. **환경 변수**: OAuth client ID/secret 설정 필요
   - NEXT_PUBLIC_SUPABASE_GOOGLE_CLIENT_ID
   - NEXT_PUBLIC_SUPABASE_GITHUB_CLIENT_ID
   - SUPABASE_GOOGLE_CLIENT_SECRET
   - SUPABASE_GITHUB_CLIENT_SECRET

## Timeline

- Estimated: 2-3 hours (the agent execution 시간)
- Tasks: 3 plans, 8 tasks
- Waves: 2 waves (parallel execution 가능)

## Files Modified

### Plan 01
- src/types/auth.ts (new)
- src/hooks/use-auth.ts (new)

### Plan 02
- src/components/auth/AuthForm.tsx (new)
- src/components/auth/SocialLogin.tsx (new)
- src/app/(auth)/login/page.tsx (new)

### Plan 03
- src/app/(auth)/signup/page.tsx (new)
- src/app/(main)/page.tsx (modified)
- src/middleware.ts (modified)

## Next Steps

Execute: `/gsd-execute-phase 02-auth`

<sub>`/clear` first - fresh context window</sub>
