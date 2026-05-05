# Phase 17-04 세션 종료 — 다음 세션 시작 가이드

## 이 문서를 읽는 세션에게

이 파일은 Phase 17-04 (모바일 Section 구조 재설계)의 세션 강제 압축 전 검토 결과를 담고 있습니다.
이전 세션에서 claimed(표기된 완료)와 actual(실제 완료) 사이에 불일치가 있었습니다.
아래에 정확한 상태를 기록합니다.

---

## 프로젝트 개요

**Todayis** — 웨딩 초대장 제작 플랫폼 (Next.js 14, Supabase, shadcn/ui)
- 프로젝트 루트: `/media/jay/D/cursor/todayis/`
- 모델: Qwen3.6-35B-A3B (context window 65K)
- GSD 프레임워크 사용

## 현재 위치

**Phase 17** (template-system) — In Progress
- 17-01 ✅ 템플릿 비주얼 디자인 시스템
- 17-02 ✅ 템플릿 미리보기 모달
- 17-03 ✅ 에디터 애니메이션/글꼴/색상 추가
- 17-04 ⚠️ 모바일 Section 구조 재설계 — Implementation 일부 완료, E2E 테스트 6건 실패

---

## ✅ 실제로 완료된 작업 (코드 검증 통과)

### 1. Section 기반 템플릿 정의 (`src/data/templates/sample.ts`)

```typescript
// Line 199: ROMANTIC_TEMPLATE
// Line 429: CLASSIC_TEMPLATE
// Line 659: MODERN_TEMPLATE
// Line 889: SECTION_BASED_TEMPLATES (배열)
// Line 898: findSectionBasedTemplate(id) (폴백 조회 함수)
```

각 템플릿은 5개 섹션 포함: `image` → `announcement` → `invitation` → `map` → `accounts`

### 2. API GET 연동 (`src/app/api/templates/route.ts`)

```typescript
// Line 5: import { SECTION_BASED_TEMPLATES } from '@/data/templates/sample';
// Line 77: dev 모드에서 SECTION_BASED_TEMPLATES 병합
// Line 137: 인증 모드에서 SECTION_BASED_TEMPLATES 병합
```

### 3. API GET [id] 폴백 (`src/app/api/templates/[id]/route.ts`)

```typescript
// Line 5: import { findSectionBasedTemplate } from '@/data/templates/sample';
// Line 74: DB에 없으면 sample.ts에서 폴백 조회
```

### 4. API PATCH sections 지원 (`src/app/api/templates/[id]/route.ts`)

```typescript
// Line 202-208: sections 필드 → config JSONB에 저장
```

### 5. TemplateEditor.tsx rules-of-hooks 수정

```
src/components/templates/editor/TemplateEditor.tsx
- useState hooks 순서 정리 (early return 후 호출 문제 해결)
```

### 6. toss.test.ts TypeScript 오류 수정

```
src/lib/payment/toss.test.ts
- `module` 변수명 → `mod`로 변경 (reserved word 오류 해결)
```

### 7. 빌드 검증

```
✅ TypeScript check (tsc --noEmit) — 성공
✅ Next.js build — 성공
```

---

## ❌ Plan에서 "완료"로 표기되었으나 실제로 미완료된 작업

| # | claimed 작업 | 파일 | 실제 상태 |
|---|-------------|------|----------|
| 1 | SECTION_BASED_TEMPLATES 표시 | `templates/page.tsx` | ❌ import/표시 없음 |
| 2 | TemplateEngine animationDelay | `TemplateEngine.tsx` | ❌ 적용 안됨 |
| 3 | use-template-editor.ts Section 헬퍼 | `use-template-editor.ts` | ❌ 미추가 |
| 4 | FieldEditor.tsx Section 필드 편집기 | `FieldEditor.tsx` | ❌ 변경 없음 |

---

## ❌ E2E 테스트 6건 실패 (아직 수정 안됨)

### 실패 테스트 목록

```
[template] template.e2e.ts:259  — 템플릿 상세 페이지 렌더링
[template] template.e2e.ts:269  — 편집 폼 표시
[template] template.e2e.ts:283  — 필드 값 변경
[template] template.e2e.ts:291  — 실시간 미리보기
[template] template.e2e.ts:321  — 대시보드에서 설정 페이지 이동
[profile] profile.e2e.ts:113    — 대시보드에서 설정 페이지 이동
```

### 실패 원인

**템플릿 4건 (mock 구조 불일치)**:
- `src/test/e2e/helpers.ts`의 `mockApiRoutes`가 `{ template: {...} }` 구조로 반환
- `src/app/(main)/templates/[id]/edit/page.tsx:87`은 `response.json()`으로 Template 객체 직접 받음
- `response.json()` → `{ template: {...} }` 반환 → `data.name`은 undefined → 에러

**프로필 2건 (viewport visibility)**:
- `Element is not visible` — 내비게이션 요소가 뷰포트에서 안 보임
- `click({ force: true })`로도 해결 안됨

---

## 📋 다음 세션에서 진행할 작업 (우선순위 순)

### 1. E2E 테스트 6건 수정 (최우선)

**파일**: `src/test/e2e/template.e2e.ts`, `src/test/e2e/profile.e2e.ts`

**수정 방향**:
- `mockApiRoutes`에서 `/api/templates/tpl-1` 응답을 `{ template: {...} }` → Template 객체 직접 반환으로 변경
- 또는 `edit/page.tsx:87`을 `response.json().then(d => d.template)`으로 수정
- profile 테스트는 viewport 크기 조정 또는 selector 개선

**검증**: `npx playwright test` — 39건 모두 통과

### 2. templates/page.tsx에 SECTION_BASED_TEMPLATES 표시

**파일**: `src/app/(main)/templates/page.tsx`

**수정 방향**:
- `src/data/templates/sample`에서 `SECTION_BASED_TEMPLATES` import
- 템플릿 목록에 추가 (romantic-001, classic-001, modern-001)

### 3. landing/page.tsx:223 JSX entities 수정

**파일**: `src/app/(main)/landing/page.tsx:223`

**현재 코드**:
```tsx
{"\"" + testimonial.quote + "\""}
```

**권장 수정**:
```tsx
<>&quot;{testimonial.quote}&quot;</>
```

### 4. (선택사항) Plan 미이행 항목

- `TemplateEngine.tsx`: animationDelay 적용
- `use-template-editor.ts`: Section 관련 헬퍼 추가
- `FieldEditor.tsx`: Section 필드 편집기 추가

---

## 참고: 핵심 파일 구조

```
src/
├── data/templates/sample.ts          # SECTION_BASED_TEMPLATES 정의
├── app/
│   ├── api/templates/route.ts        # 템플릿 목록 API (SECTION_BASED_TEMPLATES 병합)
│   ├── api/templates/[id]/route.ts   # 템플릿 상세/수정 API (폴백 + sections 지원)
│   └── (main)/
│       ├── templates/page.tsx        # 템플릿 라이브러리 (SECTION_BASED_TEMPLATES 미연동)
│       └── templates/[id]/edit/page.tsx  # 편집 페이지 (mock 구조 불일치)
├── components/templates/
│   ├── editor/TemplateEditor.tsx     # Section 기반 편집기 (rules-of-hooks 수정 완료)
│   ├── editor/FieldEditor.tsx        # 필드 편집기 (Section 미지원)
│   ├── engine/TemplateEngine.tsx     # 렌더링 엔진 (animationDelay 미적용)
│   └── preview/TemplatePreview.tsx   # split-view preview (정상 동작)
├── hooks/use-template-editor.ts      # 편집 hook (Section 미지원)
└── test/e2e/
    ├── template.e2e.ts               # 4건 실패
    ├── profile.e2e.ts                # 1건 실패
    └── helpers.ts                    # mockApiRoutes 구조 불일치 원인
```

---

## 시작 명령어

```bash
# 1. E2E 테스트 실행 (현재 6건 실패)
npx playwright test

# 2. 빌드 검증
npx next build

# 3. 타입 체크
npx tsc --noEmit
```

---

## GSD 상태

- STATE.md: `.planning/STATE.md`
- ROADMAP.md: `.planning/ROADMAP.md`
- Phase Plan: `.planning/phases/17-04-mobile-section-redesign/17-04-PLAN.md`
- 이 파일: `.planning/phases/17-04-mobile-section-redesign/SESSION_HANDOFF.md`

---

## 새 세션 프롬프트

아래 내용을 복사해서 새 세션에 입력하세요:

```
/media/jay/D/cursor/todayis/.planning/phases/17-04-mobile-section-redesign/SESSION_HANDOFF.md 파일을 먼저 읽고, Phase 17-04의 미완료 작업을 우선순위대로 진행하세요.

우선순위:
1. E2E 테스트 6건 수정 (mock 구조 불일치 + viewport visibility)
2. templates/page.tsx에 SECTION_BASED_TEMPLATES 표시
3. landing/page.tsx:223 JSX entities 수정
4. (선택) TemplateEngine.tsx animationDelay, use-template-editor.ts Section 헬퍼, FieldEditor.tsx Section 편집기

작업 후 build/lint 검증하고, STATE.md와 ROADMAP.md를 업데이트하세요.
```
