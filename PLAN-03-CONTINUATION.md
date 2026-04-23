# Plan 03: Email Login & Session Management - Continuation

## Current Status

**Phase 02: Auth System** - Plan 03 of 3

### Completed (Plan 01 & 02)
- ✅ Supabase Auth setup (client.ts, server.ts, types/auth.ts)
- ✅ AuthProvider.tsx & use-auth.ts hook
- ✅ GoogleLoginButton.tsx & GitHubLoginButton.tsx
- ✅ Login page & OAuth callback handler

### In Progress (Plan 03)
- ✅ `components/forms/LoginForm.tsx` - Created (18:48)
- ❌ `components/forms/SignupForm.tsx` - **MISSING**
- ❌ `app/(auth)/signup/page.tsx` - **MISSING**
- ❌ `hooks/use-session.ts` - **MISSING**
- ❌ `app/api/auth/logout/route.ts` - **MISSING**
- ❌ `app/(auth)/reset-password/page.tsx` - **MISSING**

**Progress: 1/6 (16%)**

## Plan Objectives

Implement email/password authentication, signup, session management, logout, and password reset.

## Tasks to Complete

### 1. SignupForm Component
**File**: `components/forms/SignupForm.tsx`

Create signup form with:
- Email field
- Password field (min 8 chars)
- Confirm password field
- Validation (email format, password match, min length)
- Submit handler calling Supabase signUp()

**Dependencies**:
- `components/ui/input.tsx` (shadcn)
- `components/ui/button.tsx` (shadcn)
- `components/ui/card.tsx` (shadcn)
- `lib/supabase/client.ts`

### 2. Signup Page
**File**: `app/(auth)/signup/page.tsx`

Create signup page with:
- SignupForm component
- Link to login page
- Redirect authenticated users to dashboard

**Dependencies**:
- `hooks/use-auth.ts`
- `@/components/forms/SignupForm.tsx`

### 3. useSession Hook
**File**: `hooks/use-session.ts`

Create session management hook:
- Subscribe to Supabase auth changes
- Return current session and user
- Handle session expiration
- Auto-refresh token

**Dependencies**:
- `lib/supabase/client.ts`
- `types/auth.ts`

### 4. Logout API
**File**: `app/api/auth/logout/route.ts`

Create logout endpoint:
- Call Supabase signOut()
- Clear cookies/sessions
- Return success response

**Dependencies**:
- `lib/supabase/server.ts`
- `@supabase/supabase-js`

### 5. Reset Password Page
**File**: `app/(auth)/reset-password/page.tsx`

Create password reset page with:
- Email input field
- Submit handler calling Supabase resetPasswordForEmail()
- Success/error messages
- Link to login page

**Dependencies**:
- `components/ui/input.tsx`
- `components/ui/button.tsx`
- `lib/supabase/client.ts`

## Implementation Order

1. **SignupForm.tsx** - Base component for signup
2. **signup/page.tsx** - Signup page using the form
3. **use-session.ts** - Session management hook
4. **logout/route.ts** - Logout API endpoint
5. **reset-password/page.tsx** - Password reset page

## Key Code Patterns

### Supabase SignUp
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
})
```

### Supabase SignOut
```typescript
const { error } = await supabase.auth.signOut()
```

### Supabase Reset Password
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'http://localhost:3000/reset-password-confirm',
})
```

### Session Subscription
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  setSession(session)
})
```

## Verification Checklist

- [ ] Email signup works
- [ ] Password validation works (min 8 chars, match)
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Password reset email sends
- [ ] Redirects work correctly

## Files to Create

```
components/forms/SignupForm.tsx
app/(auth)/signup/page.tsx
hooks/use-session.ts
app/api/auth/logout/route.ts
app/(auth)/reset-password/page.tsx
```

## Notes

- Use same form validation patterns as LoginForm.tsx
- Follow existing code style (TypeScript, shadcn/ui)
- Handle errors gracefully with user-friendly messages
- Test all flows before marking complete
