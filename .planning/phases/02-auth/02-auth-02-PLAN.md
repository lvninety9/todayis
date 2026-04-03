---
phase: 02-auth
plan: 02
type: execute
wave: 2
depends_on: ["02-auth-01"]
files_modified: ["src/app/(auth)/login/page.tsx", "src/components/auth/AuthForm.tsx", "src/components/auth/SocialLogin.tsx"]
autonomous: true
requirements: ["AUTH-01"]
---

<objective>
로그인/회원가입 페이지 및 컴포넌트 구현
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/PHASE-02-AUTH.md
@.planning/phases/02-auth/02-auth-01-SUMMARY.md
@src/types/auth.ts
@src/hooks/use-auth.ts
@src/components/ui/button.tsx
@src/components/ui/input.tsx
@src/components/ui/card.tsx
@src/components/ui/label.tsx
</context>

<interfaces>
<!-- Key types and contracts the executor needs. Extracted from codebase. -->
<!-- Executor should use these directly — no codebase exploration needed. -->

From src/types/auth.ts:
```typescript
export interface User {
  id: string
  email: string
  user_metadata: {
    name?: string
    avatar_url?: string
  }
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
}
```

From src/hooks/use-auth.ts:
```typescript
export function useAuth() {
  const user = useShallowSelector(state => state.user)
  const isLoading = useShallowSelector(state => state.isLoading)
  const signIn = useShallowSelector(state => state.signIn)
  const signUp = useShallowSelector(state => state.signUp)
  const signOut = useShallowSelector(state => state.signOut)
  const signInWithProvider = useShallowSelector(state => state.signInWithProvider)
  
  return { user, isLoading, signIn, signUp, signOut, signInWithProvider }
}
```

From src/components/ui/button.tsx:
```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}
```

From src/components/ui/input.tsx:
```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: AuthForm 컴포넌트 생성</name>
  <files>src/components/auth/AuthForm.tsx</files>
  <action>
    재사용 가능한 인증 폼 컴포넌트 생성:
    
    1. AuthForm 컴포넌트 Props:
       - mode: 'login' | 'signup'
       - defaultValues?: { email?: string, password?: string, name?: string }
       - onSubmit: (data: LoginCredentials | SignupCredentials) => Promise<void>
       - isLoading: boolean
    
    2. Form Fields:
       - Email input (required, email validation)
       - Password input (required, min 6 chars)
       - Name input (signup mode only, required, 2-50 chars)
    
    3. UI Components (D-02):
       - shadcn/ui Card, CardHeader, CardTitle, CardDescription
       - shadcn/ui Form, FormField, FormItem, FormLabel, FormControl, FormMessage
       - shadcn/ui Input, shadcn/ui Button
    
    4. Validation:
       - React Hook Form 사용
       - Zod 스키마: email (email), password (min 6), name (min 2, max 50)
    
    5. Styling (D-03):
       - Tailwind CSS v4
       - Centered card layout
       - Responsive design
    
    Reference: shadcn/ui docs, React Hook Form docs, Zod docs
  </action>
  <verify>
    <automated>npm run lint && npm run type-check</automated>
  </verify>
  <done>
    src/components/auth/AuthForm.tsx 파일이 다음을 포함:
    - AuthForm 컴포넌트 (mode, defaultValues, onSubmit, isLoading props)
    - Email, Password, Name (conditional) fields
    - React Hook Form + Zod validation
    - shadcn/ui 컴포넌트 사용
    - Tailwind CSS 스타일링
    - lint 및 type-check 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: SocialLogin 컴포넌트 생성</name>
  <files>src/components/auth/SocialLogin.tsx</files>
  <action>
    소셜 로그인 버튼 컴포넌트 생성:
    
    1. SocialLogin 컴포넌트:
       - Google OAuth 버튼
       - GitHub OAuth 버튼
    
    2. UI Components (D-02):
       - shadcn/ui Button (variant: outline)
       - Icons (lucide-react: Google, Github)
    
    3. Integration:
       - onGoogleClick: () => void
       - onGitHubClick: () => void
    
    4. Styling (D-03):
       - Tailwind CSS v4
       - Full width buttons
       - Icon + text layout
    
    Reference: shadcn/ui docs, lucide-react docs, Supabase OAuth docs
    
    D-01: Google, GitHub OAuth per user decision (AUTH-01)
  </action>
  <verify>
    <automated>npm run lint && npm run type-check</automated>
  </verify>
  <done>
    src/components/auth/SocialLogin.tsx 파일이 다음을 포함:
    - Google OAuth 버튼
    - GitHub OAuth 버튼
    - shadcn/ui Button + lucide-react icons
    - Tailwind CSS 스타일링
    - lint 및 type-check 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 로그인 페이지 구현</name>
  <files>src/app/(auth)/login/page.tsx</files>
  <action>
    로그인 페이지 컴포넌트 생성:
    
    1. LoginPage 컴포넌트:
       - AuthForm 컴포넌트 (mode: 'login')
       - SocialLogin 컴포넌트
       - Sign up link (이메일/비밀번호로 가입하지 않은 사용자용)
    
    2. Form Handling:
       - useAuth 훅 사용
       - onSubmit: signIn(credentials)
       - 성공 시: / (메인 대시보드로 리디렉션)
       - 실패 시: 에러 메시지 표시
    
    3. Social Login Handling:
       - onGoogleClick: signInWithProvider('google')
       - onGitHubClick: signInWithProvider('github')
    
    4. UI Layout:
       - Centered card layout
       - "또는" divider between form and social login
       - Responsive design
    
    Reference: src/components/auth/AuthForm.tsx, src/components/auth/SocialLogin.tsx, src/hooks/use-auth.ts
    
    D-01: Supabase Auth 사용 per user decision
  </action>
  <verify>
    <automated>npm run lint && npm run type-check</automated>
  </verify>
  <done>
    src/app/(auth)/login/page.tsx 파일이 다음을 포함:
    - AuthForm (mode: 'login')
    - SocialLogin 컴포넌트
    - Sign up link
    - useAuth 훅 연동 (signIn, signInWithProvider)
    - 리디렉션 로직 (/로)
    - lint 및 type-check 통과
  </done>
</task>

</tasks>

<verification>
- AuthForm 컴포넌트가 로그인/회원가입 모드 모두에서 정상 작동
- SocialLogin 컴포넌트가 Google/GitHub 버튼 표시
- 로그인 페이지가 AuthForm + SocialLogin 조합
- 폼 유효성 검사 통과
- 에러 처리 정상 작동
</verification>

<success_criteria>
- src/components/auth/AuthForm.tsx: 재사용 가능한 인증 폼 컴포넌트 완료
- src/components/auth/SocialLogin.tsx: 소셜 로그인 버튼 컴포넌트 완료
- src/app/(auth)/login/page.tsx: 로그인 페이지 완료
- lint 및 type-check 통과
- AuthForm 이 login/signup 모드 모두에서 작동
</success_criteria>

<output>
After completion, create `.planning/phases/02-auth/02-auth-02-SUMMARY.md`
</output>
