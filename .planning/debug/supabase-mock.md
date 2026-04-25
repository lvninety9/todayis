---
status: resolved
trigger: "E2E 테스트에서 Supabase auth를 실제처럼 동작하게 하는 Mock 구현"
created: 2026-04-24T00:00:00Z
updated: 2026-04-24T12:30:00Z
resolution_date: 2026-04-24
---

## Final Status: ✅ RESOLVED

**테스트 결과: 40 passed, 0 failed**

## 해결 과정

### Phase 1: Supabase Mock 구현 (31/40 통과)
- root_cause: ES6 module import는 window 객체에 등록되지 않아 fetch 오버라이드가 작동하지 않음
- fix: client.ts에 `__SUPABASE_MOCK_MODE__` 플래그 기반 mock client 구현
- files: src/lib/supabase/client.ts, src/test/e2e/helpers.ts

### Phase 2: UI 선택자 수정 (40/40 통과)
- Mock API 응답 형식 수정 (/api/profile)
- 테스트 선택자 수정 (ID 선택자 사용)
- 템플릿 테스트: h1.first()로 strict mode 해결
- InvitationViewer: 빈 data 처리 추가

## 검증 명령어
```bash
npx playwright test
```

## 변경된 파일
- src/lib/supabase/client.ts
- src/test/e2e/helpers.ts
- src/test/e2e/profile.e2e.ts
- src/test/e2e/login.e2e.ts
- src/test/e2e/template.e2e.ts
- src/test/e2e/publish.e2e.ts