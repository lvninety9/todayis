# E2E 테스트 수정 — 세션 핸드오프

## 현재 상태

### 테스트 결과 (실시간)
```
npx playwright test
→ 40 tests, 0 passed, 40 failed
→ 실패 원인: SecurityError: localStorage 접근 차단
```

### 완료된 작업 (1차 세션)
- ✅ Playwright 설정 (`playwright.config.ts`)
- ✅ `global.setup.ts` — 서버 시작 대기
- ✅ `login.e2e.ts` — setMockSession 사용
- ✅ `template.e2e.ts` — setMockSession 사용
- ✅ `profile.e2e.ts` — setMockSession 사용
- ✅ `publish.e2e.ts` — setMockSession 사용

### 실패 원인
`page.evaluate()`로 localStorage 설정 시:
```
Error: SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
```

**원인**: `page.evaluate()`는 빈 페이지(`about:blank`)에서 실행되어 localStorage 접근 불가

---

## 해결 방안 (다음 세션에서)

### Approach 1: `page.addInitScript()` 사용 (권장)

`page.evaluate()` 대신 `page.addInitScript()` 사용 — 페이지 로드 **이전**에 JavaScript 주입:

```typescript
// helpers.ts 수정
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

### Approach 2: 빈 페이지 먼저 이동

```typescript
export async function setMockSession(page: Page) {
  await page.goto('about:blank');
  await page.evaluate(() => {
    // localStorage 설정
    localStorage.setItem(...);
  });
  // 이제 실제 페이지로 이동
}
```

### Approach 3: auth 의존성 제거

로그인 페이지 테스트는 auth 불필요 — 바로 통과 가능.
auth 필요한 페이지 테스트만 인증 mocking 적용.

---

## 수정 대상 파일

- `src/test/e2e/helpers.ts` — `page.evaluate()` → `page.addInitScript()`

---

## 검증

```bash
npx playwright test
# Expected: 40 passed, 0 failed
```

---

## 다음 세션 프롬프트

```
/media/jay/D/cursor/todayis E2E 테스트 수정을 이어서 진행.

현재 상태:
- ✅ 4개 테스트 파일 작성 완료 (login, template, profile, publish)
- ❌ 40 tests all failed — SecurityError: localStorage 접근 차단

실패 원인:
- page.evaluate()로 localStorage 설정 시 빈 페이지에서 접근 불가
- 해결: page.addInitScript() 사용 (페이지 로드 이전 JavaScript 주입)

수정 사항:
- src/test/e2e/helpers.ts: setMockSession() 함수에서 page.evaluate() → page.addInitScript()로 변경

검증:
- npx playwright test
- Expected: 40 passed, 0 failed
```