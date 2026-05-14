# Phase 23: 프리미엄 템플릿

**Goal**: 프리미엄 템플릿 시스템 구축 — 프리미엄 템플릿 표시, 구매 플로우, 구매 후 템플릿 라이브러리에 자동 추가

**Depends on**: Phase 5 (결제 시스템), Phase 17 (템플릿 시스템 개편)

**Requirements**: 
- PREMIUM-01: 템플릿에 isPremium 플래그 추가, 프리미엄 템플릿 2개 생성
- PREMIUM-02: 템플릿 라이브러리에서 프리미엄 배지 표시, 비구매자 숨김 처리
- PREMIUM-03: 템플릿 상세 페이지에서 구매 버튼 → Naver Selling Page 리다이렉트
- PREMIUM-04: 구매 확인 후 템플릿을 사용자 라이브러리에 자동 추가

**Success Criteria** (what must be TRUE):
1. 템플릿 데이터에 isPremium 필드 추가, ROMANTIC/CLASSIC/MODERN 중 2개 이상 프리미엄으로 표시
2. 템플릿 라이브러리에서 프리미엄 템플릿에 "프리미엄" 배지 표시
3. 비구매자가 프리미엄 템플릿 클릭 시 Naver Selling Page로 리다이렉트
4. 구매 확인 후 템플릿이 사용자 템플릿 라이브러리에 추가됨

---

## Wave 1: 데이터 모델 + 프리미엄 템플릿

### 작업 1.1: Template 타입에 isPremium 추가
- `src/types/template.ts` — Template 인터페이스에 `isPremium: boolean` 추가
- DB snake_case 매핑: `is_premium`

### 작업 1.2: 프리미엄 템플릿 생성
- `src/data/templates/sample.ts` — PREMIUM_ROMANTIC, PREMIUM_CLASSIC 템플릿 생성
- 기존 ROMANTIC/CLASSIC과 다른 디자인 (고급스러운 색상, 추가 섹션)
- `price: 10000` (프리미엄 가격)
- `isPurchased: false`
- `SECTION_BASED_TEMPLATES` 배열에 추가

### 작업 1.3: 템플릿 API에 isPremium 매핑 추가
- `src/app/api/templates/route.ts` — DB 응답에 `is_premium` → `isPremium` 매핑
- `src/app/api/templates/[id]/route.ts` — 동일하게 매핑 추가

---

## Wave 2: 템플릿 라이브러리 UI

### 작업 2.1: 프리미엄 배지 컴포넌트
- `src/components/templates/PremiumBadge.tsx` — "프리미엄" 배지 컴포넌트
- gold/amber 색상, small size
- TemplateCard에 조건부 렌더링

### 작업 2.2: TemplateCard에 프리미엄 배지 통합
- `src/components/templates/TemplateCard.tsx` — `isPremium` prop 추가
- `isPremium && <PremiumBadge />` 렌더링

### 작업 2.3: 템플릿 라이브러리에서 비구매자 숨김
- `src/app/(main)/templates/page.tsx` — 비로그인/비구매자 필터링 로직
- 프리미엄 템플릿은 로그인 시 미리보기 가능하지만, 사용 불가 표시

---

## Wave 3: 구매 플로우

### 작업 3.1: 템플릿 상세 페이지 구매 버튼
- `src/app/(main)/templates/[id]/page.tsx` — 프리미엄 템플릿인 경우 "구매하기" 버튼 표시
- 기존 Phase 5의 Naver Selling Page 리다이렉트 재사용
- `template.isPremium && template.price > 0` 조건

### 작업 3.2: Naver Selling Page 리다이렉트 함수
- `src/lib/payment/naver.ts` — `getNaverSellingUrl(templateId, userId)` 함수 추가/확장
- 템플릿 ID 기반 판매 페이지 URL 생성

### 작업 3.3: 구매 확인 API 확장
- `src/app/api/payment/check/route.ts` — 템플릿 ID 기반 구매 확인 응답에 `templateName` 추가
- 구매 완료 시 템플릿 ID 반환

---

## Wave 4: 구매 후 템플릿 추가

### 작업 4.1: 구매 완료 후 템플릿 복사 API
- `src/app/api/templates/[id]/purchase/route.ts` — 새 API route 생성
- POST /api/templates/[id]/purchase
- 템플릿을 user의 라이브러리에 복사 (userId 변경)
- payments 테이블에 기록 (DONE 상태)

### 작업 4.2: 구매 확인 후 자동 추가 로직
- 템플릿 상세 페이지에서 `/api/payment/check` 호출
- `is_purchased === true`이면 `/api/templates/[id]/purchase` 호출
- 복사된 템플릿으로 에디터로 리다이렉트

### 작업 4.3: 에디터에서 프리미엄 템플릿 사용
- `src/app/(main)/create/[templateId]/page.tsx` — 프리미엄 템플릿 ID로 접근 시 구매 상태 확인
- 미구매 시 구매 페이지로 리다이렉트

---

## 검증 방법

1. `build` — TypeScript strict 모드 통과
2. `lint` — ESLint 에러 없음
3. `test:run` — 기존 128개 테스트 모두 통과
4. 수동 테스트:
   - 템플릿 라이브러리에서 프리미엄 배지 표시 확인
   - 프리미엄 템플릿 클릭 → Naver Selling Page 리다이렉트 확인
   - 구매 확인 → 템플릿 라이브러리에 추가 확인
