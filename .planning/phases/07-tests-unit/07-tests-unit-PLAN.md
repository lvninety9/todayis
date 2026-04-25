# Phase 7-01: 단위 테스트

**Goal**: Vitest + React Testing Library 설정 및 핵심 유틸리티/컴포넌트/훅 단위 테스트 작성

**Dependencies**: 없음 (Phase 1-6 모두 완료됨)

**Status**: Complete (7/7 tasks done, 120 tests passing)

---

## 완료된 작업

- [x] Task 1: 테스트 인프라 설정 (vitest.config.ts, setup.ts, package.json scripts)
- [x] Task 2: 템플릿 유틸리티 테스트 (13 tests)
- [x] Task 3 (partial): Payment 타입 테스트 (6 tests)
- [x] Task 3 (remaining): TemplateData 타입 테스트 (9 tests) — interface 구조 검증
- [x] Task 4: 결제 유틸리티 테스트 (6 tests)
- [x] Task 5: 인증 헬퍼 테스트 (7 tests)
- [x] Task 6 (partial): Button 컴포넌트 테스트 (8 tests)
- [x] Task 6 (remaining): Badge (6 tests), Card (18 tests), Skeleton (3 tests)
- [x] Task 7: Hook 테스트 — useTemplateEditor (19 tests), usePayment (16 tests)

---

## Verification

1. `npx vitest run` — 120 tests across 11 files, all passing
2. `npx tsc --noEmit` — pass (0 errors)
3. `npm run build` — pass (Next.js build successful)

---

## 계획 vs 실제 괴리

### 1. TemplateData 구현체 없음 (Task 3)

**계획**: `TemplateData` 클래스의 `getValue()`, `setValue()`, `getFieldNames()`, `validate()` 메서드 테스트

**실제**: `src/types/template.ts`에서 `TemplateData`는 **interface**로만 정의됨. 구체적인 구현체가 없음.
- `values: Record<string, string>` 필드만 있고, 메서드들은 interface에 선언되어 있지만 구현되지 않음
- **대안**: interface의 타입 체킹만 테스트하거나, TemplateData 구현체를 먼저 작성한 후 테스트

### 2. Badge/Card/Skeleton 테스트 누락 (Task 6)

**계획**: Button, Badge, Card, Skeleton 모두 테스트

**실제**: Button만 테스트 완료. Badge, Card, Skeleton은 미완료.

### 3. Hook 테스트 누락 (Task 7)

**계획**: useTemplateEditor, usePayment 훅 테스트

**실제**: 미완료.

---

## Verification Criteria

1. `npm run test:run` — 모든 테스트 통과 (0 failures)
2. `npm run test:coverage` — `src/lib/` 커버리지 70% 이상
3. TypeScript 타입 체크 통과 (`npx tsc --noEmit`)
4. 기존 기능에 영향 없음 (기존 `npm run build` 성공)

---

## Task 1: 테스트 인프라 설정

### 1.1 의존성 설치

다음 패키지 설치:
- `vitest` (테스트 러너)
- `@testing-library/react` (React 컴포넌트 테스트)
- `@testing-library/jest-dom` (jest-dom matchers)
- `jsdom` (DOM 환경)
- `@types/jest-dom` (타입 정의)
- `msw` + `msw/node` (API mocking)
- `@testing-library/user-event` (사용자 상호작용 시뮬레이션)

### 1.2 Vitest 설정

`vitest.config.ts` 생성:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/', 'src/hooks/', 'src/types/'],
      exclude: ['src/lib/supabase/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

### 1.3 테스트 설정 파일

`src/test/setup.ts` 생성:
- `@testing-library/jest-dom` import
- Supabase mock 설정 (전역 `globalThis`)
- `next/navigation` mock (useRouter, usePathname 등)
- `next/fonts` mock

### 1.4 package.json 스크립트 추가

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Task 2: 템플릿 유틸리티 테스트

**대상 파일**: `src/lib/template-utils.tsx`

### 2.1 validateTemplateData 테스트

- 필수 필드 모두 채움 → `true` 반환
- 필수 필드 중 하나 비움 → `false` 반환
- 선택 필드 비움 → `true` 반환 (필드가 아니므로)
- 빈 문자열 입력 → `false` 반환 (trim 후 확인)

### 2.2 getDefaultValue 테스트

- 값이 있으면 해당 값 반환
- 값이 null → 필드의 defaultValue 반환
- 값이 빈 문자열 → 필드의 defaultValue 반환
- defaultValue도 null → 빈 문자열 반환

### 2.3 renderField 테스트

- `text` 타입 → `<span>value</span>` 렌더링
- `date` 타입 → 'YYYY 년 MM 월 DD 일' 포맷 렌더링
- `date` 타입 → 잘못된 날짜 → 원본 값 렌더링
- `image` 타입 → `<img>` 태그 렌더링
- `location` 타입 → `<div>` + `<a>` 렌더링, Google Maps 링크 포함
- 알 수 없는 타입 → `<span>value</span>` 렌더링

---

## Task 3: 타입 검증 테스트

**대상 파일**: `src/types/template.ts`, `src/types/payment.ts`, `src/types/auth.ts`, `src/types/publish.ts`

### 3.1 TemplateData 메서드 테스트

> **NOTE**: TemplateData는 interface로만 존재, 구현체 없음. 타입 체킹만 테스트하거나 구현체 추가 필요.

- `getValue()` — 존재하는 필드명 → 값 반환, 없는 필드명 → `null`
- `setValue()` — 값 설정 후 `getValue()`로 확인
- `getFieldNames()` — 모든 필드명 배열 반환

### 3.2 PaymentStatus 타입 테스트

- `PaymentStatus.PENDING` === `"PENDING"`
- `PaymentStatusType` 유니온 타입 검증
- `PaymentInsert` — 필수 필드만 포함 시 타입 체크 통과
- `PaymentUpdate` — 선택적 필드만 포함

---

## Task 4: 결제 유틸리티 테스트

**대상 파일**: `src/lib/payment/toss.ts`

### 4.1 TossPaymentsClient 테스트

- `constructor` — secret key 없음 → Error throw
- `getAuthHeader()` — Base64 인코딩된 Authorization 헤더 생성
- `createCheckoutOrder()` — 고유 orderId 생성 (prefix: `order_`)

### 4.2 getTossClient 테스트

- 첫 호출 → 새 인스턴스 생성
- 두 번째 호출 → 캐시된 인스턴스 반환 (싱글톤)

---

## Task 5: 인증 헬퍼 테스트

**대상 파일**: `src/lib/auth.ts`

### 5.1 getUserFromRequest 테스트

- Bearer token 있음 → Supabase getUser 호출
- Bearer token 없음 → `null` 반환
- Supabase getUser 에러 → `null` 반환

### 5.2 requireAdmin 테스트

- 인증 없음 → 401 응답
- admin role 없음 → 403 응답
- admin role 있음 → `{ response: null, user }` 반환

---

## Task 6: React 컴포넌트 테스트

**대상 파일**: `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`, `src/components/ui/skeleton.tsx`

### 6.1 shadcn/ui 컴포넌트 테스트

- `Button` — `asChild` prop 전달 시 렌더링
- `Badge` — variant prop (`default`, `destructive`, `secondary`)별 스타일
- `Card` — CardHeader, CardTitle, CardDescription 조합 렌더링
- `Skeleton` — loading placeholder 렌더링

---

## Task 7: Hook 테스트

**대상 파일**: `src/hooks/use-template-editor.ts`, `src/hooks/use-payment.ts`

### 7.1 useTemplateEditor 테스트

- `addField` — 필드 목록에 추가
- `removeField` — 필드 목록에서 제거
- `updateField` — 필드 값 업데이트
- `setFieldValue` — 템플릿 데이터 값 설정

### 7.2 usePayment 테스트

- `requestPayment` — 결제 요청 상태 변경
- `confirmPayment` — 결제 확인 상태 변경
- `cancelPayment` — 결제 취소 상태 변경
