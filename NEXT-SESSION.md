# Next Session Guide — E2E 테스트 수정

## Session Start Checklist

```bash
# 1. 현재 상태 확인
npx playwright test 2>&1 | tail -5
# Expected: 40 failed

# 2. 서버 실행
lsof -i :3000 | head -3
```

---

## 현재 상태

### 완료된 작업
- ✅ Playwright 설정 (`playwright.config.ts`)
- ✅ `helpers.ts` — `setMockSession()` 함수 (page.evaluate 사용)
- ✅ 4개 테스트 파일 — login, template, profile, publish

### 실패 원인
```
SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
  at setMockSession (helpers.ts:46)
```

**원인**: `page.evaluate()`는 빈 페이지에서 localStorage 접근 불가

---

## 해결 방안

### 수정: `helpers.ts`

`page.evaluate()` → `page.addInitScript()` 변경:

```typescript
// src/test/e2e/helpers.ts
export async function setMockSession(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'sb-jiesomglvobttxujsakz-auth-token',
      JSON.stringify({
        access_token: 'test-jwt-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'test-user-123',
          email: 'test@test.com',
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: { provider: 'email' },
          user_metadata: { nickname: '테스트사용자' },
          identities: [{ id: 'test-user-123', identity_data: { email: 'test@test.com' } }]
        }
      })
    );
  });
}
```

### 검증
```bash
npx playwright test
# Expected: 40 passed, 0 failed
```

---

## 다음 세션 프롬프트

```
/media/jay/D/cursor/todayis 프로젝트 E2E 테스트 수정.

현재 상태:
- helpers.ts, 4개 테스트 파일 작성 완료
- 40 tests failed — SecurityError: localStorage 접근 차단

수정:
- src/test/e2e/helpers.ts: page.evaluate() → page.addInitScript()

검증:
- npx playwright test
- Expected: 40 passed, 0 failed
```