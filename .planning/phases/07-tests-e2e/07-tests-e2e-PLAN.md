# Phase 7-02: E2E 테스트

**Goal**: Playwright 설정 및 핵심 사용자 플로우 E2E 테스트 작성

**Dependencies**: Phase 7-01 (테스트 인프라)

---

## Task 1: Playwright 설정

### 1.1 의존성 설치

```bash
npx playwright install --with-deps
npm install -D @playwright/test @types/node
```

### 1.2 Playwright 설정

`playwright.config.ts` 생성:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: {
    setup: {
      testMatch: /global\.setup\.ts/,
    },
    login: {
      dependencies: ['setup'],
      testMatch: /login\.e2e\.ts/,
    },
    template: {
      dependencies: ['setup'],
      testMatch: /template\.e2e\.ts/,
    },
    publish: {
      dependencies: ['setup'],
      testMatch: /publish\.e2e\.ts/,
    },
  },
});
```

### 1.3 글로벌 세팅

`src/test/e2e/global.setup.ts` — 테스트용 Supabase 테스트 사용자 생성

---

## Task 2: 로그인/회원가입 플로우 테스트

**테스트 파일**: `src/test/e2e/login.e2e.ts`

### 2.1 회원가입 플로우

- `/login` 페이지 접속
- "회원가입" 링크 클릭 → `/signup` 페이지 이동
- 이메일, 비밀번호, 닉네임 입력
- "회원가입" 버튼 클릭
- 성공 시 `/dashboard` 페이지로 리다이렉트
- 대시보드에 환영 메시지 표시 확인

### 2.2 로그인 플로우

- `/login` 페이지 접속
- 이메일, 비밀번호 입력
- "로그인" 버튼 클릭
- 성공 시 `/dashboard` 페이지로 리다이렉트
- 로그아웃 버튼 표시 확인
- 로그아웃 클릭 → `/login` 페이지로 이동

### 2.3 비밀번호 재설정 플로우

- `/login` 페이지에서 "비밀번호 재설정" 링크 클릭
- 이메일 입력
- 재설정 이메일 수신 (mock)
- 새 비밀번호 설정
- 새 비밀번호로 로그인 성공

---

## Task 3: 템플릿 관리 플로우 테스트

**테스트 파일**: `src/test/e2e/template.e2e.ts`

### 3.1 템플릿 라이브러리 조회

- `/templates` 페이지 접속
- 3개 템플릿 카드 표시 확인
- 템플릿 클릭 → 템플릿 상세 페이지 이동
- 템플릿 이름, 썸네일, 필드 정보 표시 확인

### 3.2 템플릿 편집 및 생성

- 템플릿 상세 페이지에서 "제작하기" 클릭
- `/create/[templateId]` 페이지 이동
- 이름, 날짜, 장소 필드 편집
- 실시간 미리보기에 반영된 값 표시 확인
- "초대장 생성" 버튼 클릭
- `/dashboard`로 리다이렉트
- 생성된 초대장 목록에 표시 확인

### 3.3 템플릿 업로드 (admin)

- admin 계정으로 로그인
- `/admin` 페이지 접속
- "템플릿 업로드" 버튼 클릭
- 템플릿 파일 선택 및 업로드
- 업로드 성공 메시지 표시 확인

---

## Task 4: 결제 플로우 테스트

**테스트 파일**: `src/test/e2e/payment.e2e.ts`

### 4.1 템플릿 구매 플로우

- 템플릿 상세 페이지 접속 (유료 템플릿)
- "구매하기" 버튼 클릭
- Easy Checkout 모달 표시 확인
- 결제 요청 API 호출 확인 (network interception)
- 결제 성공 시 "구매 완료" 상태 확인

### 4.2 결제 취소 플로우

- 결제 내역 페이지 접속
- 취소 버튼 클릭
- 취소 확인 다이얼로그 표시
- 취소 확인 → 취소 API 호출 확인
- 상태가 "취소됨"으로 변경된 것 확인

---

## Task 5: 초대장 공개 플로우 테스트

**테스트 파일**: `src/test/e2e/publish.e2e.ts`

### 5.1 초대장 공개 플로우

- `/create/[templateId]` 페이지에서 편집 중
- "공개하기" 토글 ON
- username 입력
- 공개 토글 확인 → `/api/invitations` POST 호출 확인
- 공개 URL (`/[username]`)으로 접근 테스트
- 공개 초대장 페이지에 템플릿 데이터 표시 확인

### 5.2 공유 기능 테스트

- 공개 초대장 페이지에서 "공유" 버튼 클릭
- 공유 다이얼로그 표시 확인
- "URL 복사" 버튼 클릭 → 클립보드에 URL 복사 확인
- 소셜 미디어 공유 링크 확인 (Twitter, Kakao)

### 5.3 공개/비공개 토글

- 편집 페이지에서 "공개 해제" 토글 OFF
- `/api/invitations/[slug]/publish` POST 호출 (isPublished: false) 확인
- 공개 URL 접근 시 404 또는 "비공개" 메시지 확인

---

## Task 6: 프로필/설정 플로우 테스트

**테스트 파일**: `src/test/e2e/profile.e2e.ts`

### 6.1 프로필 수정

- `/settings` 페이지 접속
- 닉네임 변경
- 소개 변경
- "저장" 버튼 클릭
- `/api/profile` PATCH 호출 확인
- 성공 메시지 표시 확인

### 6.2 아바타 업로드

- `/settings` 페이지에서 아바타 업로드
- 파일 선택 → `/api/profile/avatar` POST 호출 확인
- 업로드된 아바타 표시 확인

---

## Verification Criteria

1. `npx playwright test` — 모든 E2E 테스트 통과 (0 failures)
2. `npx playwright test --project=login` — 로그인 관련 테스트 모두 통과
3. `npx playwright test --project=template` — 템플릿 관련 테스트 모두 통과
4. `npx playwright test --project=publish` — 공개 관련 테스트 모두 통과
5. CI 환경에서 `retries: 2` 적용 시 안정적 통과
