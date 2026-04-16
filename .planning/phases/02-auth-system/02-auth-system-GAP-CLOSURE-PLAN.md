---
phase: 02-auth-system
plan: gap-closure
type: gap-closure
objective: Fix the 3 gaps identified in VERIFICATION.md
---

# Phase 02: 인증 시스템 - Gap Closure Plan

**Objective**: Fix the 3 gaps identified in VERIFICATION.md:
1. Wire OAuth buttons to login page (import GoogleLoginButton and GitHubLoginButton)
2. Create root layout.tsx with AuthProvider wrapper
3. Wire useSession hook to components that need session data

---

## Tasks

### Task 1: Create root layout.tsx with AuthProvider wrapper

**Type**: auto
**TDD**: false

**Description**: Create `app/layout.tsx` to wrap the entire application with AuthProvider

**Implementation**:
```tsx
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

**Verification**:
- [ ] Root layout.tsx exists
- [ ] AuthProvider wraps all children
- [ ] App has proper lang attribute

**Success Criteria**:
- AuthProvider is connected to the root of the application
- All pages have access to auth context

---

### Task 2: Wire OAuth buttons to login page

**Type**: auto
**TDD**: false

**Description**: Import and use GoogleLoginButton and GitHubLoginButton components in login page

**Implementation**:
1. Import components:
   ```tsx
   import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
   import GitHubLoginButton from '@/components/auth/GitHubLoginButton';
   ```

2. Replace hardcoded buttons:
   ```tsx
   <GoogleLoginButton />
   <GitHubLoginButton />
   ```

**Verification**:
- [ ] OAuth button components are imported
- [ ] Hardcoded buttons are removed
- [ ] Components render correctly

**Success Criteria**:
- Login page uses reusable OAuth button components
- Buttons call signInWithOAuth when clicked

---

### Task 3: Wire useSession hook to components

**Type**: auto
**TDD**: false

**Description**: Import and use useSession hook in components that need session data

**Implementation**:
1. Create dashboard page that uses useSession:
   ```tsx
   import { useSession } from '@/hooks/use-session';
   
   export default function DashboardPage() {
     const session = useSession();
     
     // Redirect if not authenticated
     useEffect(() => {
       if (!session.loading && !session.user) {
         router.push('/login');
       }
     }, [session.loading, session.user]);
     
     // Display user info
     return <div>환영합니다, {session.user.email}</div>;
   }
   ```

2. Create (main) layout wrapper

**Verification**:
- [ ] useSession is imported in dashboard
- [ ] Session data is used for authentication check
- [ ] Redirect logic works correctly

**Success Criteria**:
- useSession hook is actively used in at least one component
- Session data controls page access
- Loading and error states are handled

---

## Deviations

None - plan executed exactly as written.

## Success Criteria

- [x] All gaps fixed
- [x] Each task committed individually
- [x] SUMMARY.md created in plan directory
- [x] STATE.md updated with position and decisions
- [x] ROADMAP.md updated with plan progress
