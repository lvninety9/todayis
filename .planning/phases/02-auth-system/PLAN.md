# Phase 02: 인증 시스템

**Goal**: Supabase Auth 를 통한 사용자 인증 구현

**Requirements**: 
- AUTH-01: Supabase Auth 설정
- AUTH-02: Google/GitHub 로그인 구현
- AUTH-03: Email/비밀번호 로그인 구현
- AUTH-04: 세션 관리 구현

---

## Plan 01: Supabase Auth 설정 및 기본 구조

**Objective**: Supabase 클라이언트 설정, 인증 관련 타입 정의, 기본 컴포넌트 skeleton 생성

**Tasks**:
1. Supabase Auth 설정 (lib/supabase/client.ts, server.ts)
2. 인증 타입 정의 (types/auth.ts)
3. AuthProvider 컴포넌트 생성
4. 인증 상태 훅 (useAuth) 기본 구조 작성
5. 인증 레이아웃 컴포넌트 생성

**Deliverables**:
- [ ] lib/supabase/client.ts - Supabase 클라이언트 설정
- [ ] lib/supabase/server.ts - 서버용 Supabase 설정
- [ ] types/auth.ts - 인증 관련 타입 정의
- [ ] components/auth/AuthProvider.tsx - 인증 제공자
- [ ] hooks/use-auth.ts - 인증 상태 훅
- [ ] app/(auth)/layout.tsx - 인증 레이아웃

**Verification**:
- [ ] Supabase 연결 테스트
- [ ] 타입 정의 검증
- [ ] AuthProvider 렌더링 테스트

---

## Plan 02: 소셜 로그인 구현

**Objective**: Google 및 GitHub OAuth 로그인 기능 구현

**Tasks**:
1. Google OAuth 설정 (Supabase Dashboard)
2. GitHub OAuth 설정 (Supabase Dashboard)
3. 소셜 로그인 버튼 컴포넌트 생성
4. OAuth 콜백 핸들러 구현
5. 로그인 페이지 UI 구현

**Deliverables**:
- [ ] components/auth/GoogleLoginButton.tsx
- [ ] components/auth/GitHubLoginButton.tsx
- [ ] app/(auth)/login/page.tsx - 로그인 페이지
- [ ] app/api/auth/callback/route.ts - OAuth 콜백 API
- [ ] lib/payment/toss.ts - 소셜 로그인 통합 테스트

**Verification**:
- [ ] Google 로그인 테스트
- [ ] GitHub 로그인 테스트
- [ ] 로그인 후 리디렉션 테스트

---

## Plan 03: 이메일 로그인 및 세션 관리

**Objective**: Email/비밀번호 로그인, 회원가입, 세션 관리 구현

**Tasks**:
1. 이메일 로그인 폼 컴포넌트 생성
2. 회원가입 폼 컴포넌트 생성
3. Supabase Auth signIn/signUp 구현
4. 세션 관리 (useSession)
5. 로그아웃 기능 구현
6. 비밀번호 재설정 기능 구현

**Deliverables**:
- [ ] components/forms/LoginForm.tsx
- [ ] components/forms/SignupForm.tsx
- [ ] app/(auth)/signup/page.tsx - 회원가입 페이지
- [ ] hooks/use-session.ts - 세션 관리 훅
- [ ] app/api/auth/logout/route.ts - 로그아웃 API
- [ ] app/(auth)/reset-password/page.tsx - 비밀번호 재설정

**Verification**:
- [ ] 이메일 로그인 테스트
- [ ] 회원가입 테스트
- [ ] 세션 유지 테스트
- [ ] 로그아웃 테스트
- [ ] 비밀번호 재설정 테스트

---

## Decisions

- [ ] Auth provider: Supabase Auth (Google, GitHub, Email)
- [ ] Session strategy: NextAuth.js 대신 Supabase native session 사용
- [ ] Protected route middleware: Next.js middleware.ts 사용

## Blockers

None.
