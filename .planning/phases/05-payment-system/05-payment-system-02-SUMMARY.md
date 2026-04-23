---
phase: 05-payment-system
plan: 02
type: summary
status: completed
---

# Phase 5: 결제 시스템 - PLAN 02 SUMMARY

## Objective
결제 요청 API, 구매 상태 확인 API, Easy Checkout 모달 컴포넌트, 결제 훅 구현

## Completed Artifacts

### 1. POST /api/payment/request/route.ts (129 lines)
- 인증: Authorization 헤더에서 Bearer 토큰 추출, getUserFromRequest로 검증
- 요청 본문 검증: zod 사용 (templateId 필수, amount 선택)
- 비즈니스 로직:
  - 템플릿 조회 (Supabase)
  - 무료 템플릿 체크 (price === 0 → 400)
  - 중복 구매 체크 (payments 테이블 → 409)
- orderId 생성: `ORD-${Date.now()}-${templateId}`
- DB 저장: payments 테이블에 PENDING 상태로 INSERT
- 응답: `{ orderId, amount, status: "PENDING", clientKey }`
- Easy Checkout 방식: 서버에서 Toss API 호출 없음

### 2. GET /api/payment/check/route.ts (58 lines)
- 인증: Authorization 헤더에서 Bearer 토큰 추출
- 쿼리 파라미터: templateId (필수)
- 비즈니스 로직: payments 테이블에서 user_id + template_id + status='DONE' 조회
- 응답: `{ templateId, is_purchased: boolean }`

### 3. src/hooks/use-payment.ts (148 lines)
- PaymentState 인터페이스: paymentKey, orderId, amount, loading, error, completed
- usePayment hook:
  - `requestPayment(templateId, amount)`: POST /api/payment/request 호출
  - `checkPurchase(templateId)`: GET /api/payment/check 호출
  - `verifyPayment(paymentKey)`: POST /api/payment/verify 호출
  - `reset()`: 상태 초기화

### 4. src/components/payment/EasyCheckout.tsx (188 lines)
- EasyCheckoutProps: isOpen, onClose, templateName, amount, clientKey, orderId, onSuccess
- UI: shadcn/ui Dialog 컴포넌트 사용
- Easy Checkout 연동:
  - `loadTossPayments(clientKey)`로 SDK 초기화
  - `tossPayments.requestPayment({ orderId, amount, orderName })`로 결제 요청
- 상태 흐름: idle → loading → success/failed/canceled
- 테스트 모드: Toss 테스트용 client_key 사용

## Additional Files Created

### 5. src/lib/supabase/server.ts
- 서버 사이드 Supabase 클라이언트 (service_role)
- `createSupabaseServerClient()` 함수 export

### 6. src/lib/supabase/database.types.ts (수정)
- Template, TemplateInsert, TemplateUpdate에 `price: number` 필드 추가

## Verification Results

### Automated Checks
- [x] TypeScript 타입 체크 통과 (`npx tsc --noEmit`)
- [x] 모든 파일 존재 확인
- [x] 최소 줄 수 충족:
  - request/route.ts: 129 lines (min: 80) ✓
  - check/route.ts: 58 lines (min: 40) ✓
  - EasyCheckout.tsx: 188 lines (min: 60) ✓
  - use-payment.ts: 148 lines (min: 40) ✓

### Manual Verification Notes
1. 결제 요청 API가 orderId 생성 + DB 저장 (PENDING 상태) — Toss API 호출 없음 ✓
2. 구매 상태 확인 API가 payments 테이블에서 user_id + template_id로 조회 ✓
3. EasyCheckout 컴포넌트가 Toss SDK를 올바르게 로드하고 결제창을 표시 ✓
4. usePayment 훅이 결제 상태를 올바르게 관리 ✓
5. 결제 완료 후 verifyPayment()로 paymentKey 검증 흐름 (별도 API 필요)

## Dependencies Installed
- `@tosspayments/payment-sdk`: Toss Easy Checkout SDK

## Key Design Decisions

1. **Easy Checkout 방식**: 서버에서 Toss API 호출 없이, 클라이언트에서 `requestPayment()`로 결제창 표시
2. **orderId 생성**: 서버에서 `ORD-${Date.now()}-${templateId}` 형식으로 생성
3. **결제 검증**: 별도 API route (`/api/payment/verify`)에서 `verifyPayment(paymentKey)` 호출
4. **SDK API**: `loadTossPayments(clientKey)` → `tossPayments.requestPayment()` 흐름 사용

## Next Steps
- `/api/payment/verify` API route 구현 (verifyPayment 호출)
- 템플릿 상세 페이지에서 "구매하기" 버튼과 EasyCheckout 컴포넌트 연동
- `/templates` 목록 페이지에서 구매 상태 확인 로직 추가
