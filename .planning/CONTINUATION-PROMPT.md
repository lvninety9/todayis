# Todayis — 세션 이어서 진행하기

## 현재 상태

**Milestone**: v1.0
**Phase**: 7 (테스트 및 최적화)
**Position**: Phase 7-01 (단위 테스트) — ✅ **모든 7/7 tasks 완료, 120 tests passing**

### 완료된 Phase
| Phase | Name | Status |
|-------|------|--------|
| 01 | template-engine | ✅ 3/3 |
| 02 | auth-system | ✅ 4/4 |
| 03 | template-management | ✅ 4/4 |
| 04 | profile-and-settings | ✅ 4/4 |
| 05 | payment-system | ✅ 3/3 |
| 06 | publish-system | ✅ 3/3 |
| **07** | **tests-unit** | **✅ 7/7 (COMPLETE)** |
| 07-02 | tests-e2e | ⏸️ 미시작 |
| 07-03 | optimization | ⏸️ 미시작 |

### Phase 7-01 완료 요약
- [x] Task 1: 테스트 인프라 (vitest.config.ts, setup.ts, package.json scripts)
- [x] Task 2: template-utils 테스트 (13 tests)
- [x] Task 3 (partial): payment 타입 테스트 (6 tests)
- [x] Task 3 (remaining): template-data 타입 테스트 (9 tests) — interface 구조 검증
- [x] Task 4: toss.test.ts (6 tests)
- [x] Task 5: auth.test.ts (7 tests)
- [x] Task 6 (partial): button.test.tsx (8 tests)
- [x] Task 6 (remaining): badge.test.tsx (6 tests), card.test.tsx (18 tests), skeleton.test.tsx (3 tests)
- [x] Task 7: use-template-editor.test.tsx (19 tests), use-payment.test.tsx (16 tests)

**총 120 tests across 11 test files — all passing**
**TypeScript check: pass | Next.js build: pass**

---

## 이 세션에서 할 일 (권장 순서)

### 1. Phase 7-02: E2E 테스트 (Playwright)

#### 1.1 Playwright 설치 및 설정
```bash
npx playwright install --with-deps
```

`playwright.config.ts` 생성:
- baseURL: `http://localhost:3000`
- testDir: `src/test/e2e/`
- timeout 설정
- 브라우저: Chromium, Firefox, WebKit

#### 1.2 핵심 사용자 플로우 테스트 작성
- `login.spec.ts` — Google/GitHub 로그인 플로우
- `template-list.spec.ts` — 템플릿 목록 조회
- `template-create.spec.ts` — 템플릿 생성
- `invitation-publish.spec.ts` — 초대장 생성 및 공개
- `payment-flow.spec.ts` — 결제 요청 플로우 (mock 사용)

### 2. Phase 7-03: 성능 최적화

#### 2.1 번들 분석
```bash
npm run build -- --analyze
```

#### 2.2 코드 스플리팅
- EasyCheckout 컴포넌트 `next/dynamic` lazy loading
- 무거운 컴포넌트 lazy import

#### 2.3 이미지 최적화
- `<Image>` 컴포넌트 적용
- 적절한 `priority` 설정

#### 2.4 API 응답 캐싱
- `Cache-Control` 헤더 적용
- SWR/React Query 활용 (필요시)

---

## 검증 명령어

```bash
# 단위 테스트 실행
npx vitest run

# TypeScript 타입 체크
npx tsc --noEmit

# Next.js 빌드
npm run build

# (선택) 커버리지
npx vitest run --coverage
```

---

## 중요: 계획 vs 실제 괴리 (해결 완료)

### 1. TemplateData 구현체 없음 → 해결
- **계획**: `TemplateData` 클래스의 메서드 테스트
- **실제**: `src/types/template.ts`에서 `TemplateData`는 **interface**로만 정의됨
- **해결**: `src/types/template-data.test.ts`에서 interface의 타입 구조만 테스트 (9 tests)

### 2. `@types/jest-dom` 불필요 → 해결
- jest-dom v6+부터 타입이 패키지에 번들됨

### 3. `vi.importActual` deprecated → 해결
- `src/test/setup.ts`에서 `vi.importActual('next/navigation')` 사용 중
- 테스트는 통과하지만, 향후 `vi.mock('next/navigation')`으로 변경 권장

---

## 주요 파일

### 테스트 파일 (11 files, 120 tests)
- `vitest.config.ts` — Vitest 설정
- `src/test/setup.ts` — 테스트 설정 (mock)
- `src/lib/template-utils.test.tsx` — 13 tests
- `src/types/payment.test.ts` — 6 tests
- `src/types/template-data.test.ts` — 9 tests
- `src/lib/payment/toss.test.ts` — 6 tests
- `src/lib/auth.test.ts` — 7 tests
- `src/components/ui/button.test.tsx` — 8 tests
- `src/components/ui/badge.test.tsx` — 6 tests
- `src/components/ui/card.test.tsx` — 18 tests
- `src/components/ui/skeleton.test.tsx` — 3 tests
- `src/hooks/use-template-editor.test.tsx` — 19 tests
- `src/hooks/use-payment.test.tsx` — 16 tests

### 계획 파일
- `.planning/phases/07-tests-unit/07-tests-unit-PLAN.md` — 단위 테스트 계획 (✅ 완료)
- `.planning/phases/07-tests-e2e/07-tests-e2e-PLAN.md` — E2E 테스트 계획
- `.planning/phases/07-optimization/07-optimization-PLAN.md` — 최적화 계획

### 상태 파일
- `.planning/STATE.md` — 프로젝트 상태
- `.planning/ROADMAP.md` — 로드맵

---

## 실행 권장

1. Phase 7-02 (E2E 테스트) 시작 — Playwright 설치 및 핵심 플로우 테스트
2. Phase 7-03 (성능 최적화) — 번들 분석, 코드 스플리팅, 이미지 최적화
3. 각 Phase 완료 후 `npx vitest run`, `npx tsc --noEmit`, `npm run build`로 검증
