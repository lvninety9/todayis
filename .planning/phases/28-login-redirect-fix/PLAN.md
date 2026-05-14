# Phase 28: 템플릿 편집 페이지 로그인 리다이렉트 재발 버그 수정

## Goal
이미 로그인한 사용자가 템플릿 편집 페이지 접근 시 잘못된 로그인 리다이렉트 발생 문제 해결

## Root Cause
- `use-session.ts` — `loading: true, user: null`로 초기화 후 비동기 세션 체크
- `edit/page.tsx:137` — `!session.loading && !session.user` 조건으로 세션 체크 중 `user: null` 상태에서 리다이렉트 트리거
- `middleware.ts:48` — `supabase.auth.getUser()` 호출하지만 결과 체크/리다이렉트 로직 없음 (Phase 27에서 제거함)

## Plan

### Wave 1: `use-session.ts` — `hasCheckedSession` flag 추가
- Session 인터페이스에 `hasCheckedSession: boolean` 필드 추가
- 초기화 시 `hasCheckedSession: false`
- 세션 로드 완료 시 `hasCheckedSession: true`로 변경
- 모든 `setSession` 호출에 `hasCheckedSession` 상태 반영

### Wave 2: `edit/page.tsx` — 리다이렉트 조건 수정
- `!session.loading && !session.user` → `session.hasCheckedSession && !session.user`
- 로딩 스피너 영역에 `session.error` 표시 추가 (사용자 피드백)

### Wave 3: 검증
- `npm run build` && `npm run lint` 통과 확인

## Files to Modify
- `src/hooks/use-session.ts`
- `src/app/(main)/templates/[id]/edit/page.tsx`
