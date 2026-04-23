---
phase: 05-payment-system
plan: 02
type: summary
wave: 2
status: completed
depends_on: ["05-payment-system-01-PLAN.md"]
files_modified:
  - "src/app/api/payment/request/route.ts"
  - "src/app/api/payment/check/route.ts"
  - "src/components/payment/EasyCheckout.tsx"
  - "src/hooks/use-payment.ts"
  - "src/lib/supabase/server.ts"
  - "src/lib/supabase/database.types.ts"
autonomous: true
requirements: [PAYMENT-02]
must_haves:
  truths:
    - "결제 요청 API가 Toss Payments와 연동되어 Easy Checkout URL 반환"
    - "Easy Checkout 컴포넌트가 결제 모달을 표시"
    - "템플릿 상세 페이지에서 '구매하기' 버튼 클릭 시 결제 흐름 시작"
    - "결제 완료 후 /templates로 리다이렉트되어 구매 상태 반영"
  artifacts:
    - path: "src/app/api/payment/request/route.ts"
      provides: "결제 요청 API"
      min_lines: 80
    - path: "src/app/api/payment/check/route.ts"
      provides: "구매 상태 확인 API"
      min_lines: 40
    - path: "src/components/payment/EasyCheckout.tsx"
      provides: "Toss Easy Checkout 모달 컴포넌트"
      min_lines: 60
    - path: "src/hooks/use-payment.ts"
      provides: "결제 상태 관리 훅"
      min_lines: 40
  key_links:
    - from: "src/app/api/payment/request/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient.verifyPayment"
      pattern: "tossClient.verifyPayment"
    - from: "src/components/payment/EasyCheckout.tsx"
      to: "src/hooks/use-payment.ts"
      via: "usePayment hook import"
      pattern: "import.*usePayment"
    - from: "src/hooks/use-payment.ts"
      to: "src/types/payment.ts"
      via: "Type import"
      pattern: "import.*PaymentStatus"

---

# Phase 5: 결제 시스템 - PLAN 02

## Objective
결제 요청 API, 구매 상태 확인 API, Easy Checkout 모달 컴포넌트, 결제 훅 구현

Purpose: Toss Easy Checkout 연동 결제 프로세스 전체 구현

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL) — Supabase client 직접 사용
- **Auth**: Supabase Auth (JWT via Authorization header)
- **Phase Goal**: Toss Payments Easy Checkout 연동

### Existing Patterns
- API routes: `src/app/api/*/route.ts` — getUserFromRequest 패턴
- Client components: 'use client' directive
- shadcn/ui: Dialog, Button, Card 컴포넌트 이미 설치됨
- Toast: sonner 사용 (이미 import됨)
- Router: next/navigation — useRouter 패턴

### User Decisions (Locked) — CONTEXT.md 참조
- **UI 흐름**: 템플릿 상세 → "구매하기" → Easy Checkout 모달 → 결제 완료 후 `/templates` 리다이렉트
- **Easy Checkout**: `@tosspayments/payment-sdk` 사용, client_key + amount + orderId로 결제 요청
- **구매 확인**: `/templates` 목록에서 purchased 템플릿은 "편집하기" 버튼 표시
- **구매 상태 추적**: payments 테이블에서 user_id + template_id로 조회 (1 템플릿당 1 구매)
- **가격**: 템플릿 상세 페이지에서 templates.price 사용

### User Setup Required
- Plan 01 완료됨 (DB 스키마, 타입, Toss 클라이언트)
- `@tosspayments/payment-sdk` 설치 필요: `npm install @tosspayments/payment-sdk`
- Toss 테스트용 client_key 필요 (테스트 모드용)

## Must Haves

### Truths
1. 결제 요청 API가 Toss Payments와 연동되어 Easy Checkout URL 반환
2. Easy Checkout 컴포넌트가 결제 모달을 표시
3. 템플릿 상세 페이지에서 '구매하기' 버튼 클릭 시 결제 흐름 시작
4. 결제 완료 후 /templates로 리다이렉트되어 구매 상태 반영

### Artifacts
- path: `src/app/api/payment/request/route.ts`
  provides: "결제 요청 API"
  min_lines: 80
- path: `src/app/api/payment/check/route.ts`
  provides: "구매 상태 확인 API"
  min_lines: 40
- path: `src/components/payment/EasyCheckout.tsx`
  provides: "Toss Easy Checkout 모달 컴포넌트"
  min_lines: 60
- path: `src/hooks/use-payment.ts`
  provides: "결제 상태 관리 훅"
  min_lines: 40

### Key Links
- from: `src/app/api/payment/request/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient.confirmPayment"
  pattern: "tossClient.confirmPayment"
- from: `src/components/payment/EasyCheckout.tsx`
  to: `src/hooks/use-payment.ts`
  via: "usePayment hook import"
  pattern: "import.*usePayment"
- from: `src/hooks/use-payment.ts`
  to: `src/types/payment.ts`
  via: "Type import"
  pattern: "import.*PaymentStatus"

## Tasks

<task type="auto">
  <name>Task 1: 결제 요청 API 구현</name>
  <files>src/app/api/payment/request/route.ts</files>
  <action>
    POST /api/payment/request — 결제 요청 API 구현:

    1. 인증:
       - Authorization 헤더에서 Bearer 토큰 추출
       - getUserFromRequest(request)로 사용자 검증 (src/lib/auth.ts 패턴 재사용)
       - 미인증 사용자는 401 응답

    2. 요청 본문 검증 (zod 사용):
       - templateId: string (구매할 템플릿 ID, 필수)
       - amount: number? (미지정 시 템플릿 가격 조회)

    3. 비즈니스 로직:
       - templateId로 템플릿 조회 (Supabase client)
       - 템플릿이 무료(is_premium=false 또는 price=0)면 400 응답
       - 이미 구매한 템플릿인지 확인 (payments 테이블에서 user_id + template_id + status='DONE')
       - 이미 구매済み면 409 Conflict 응답

   4. orderId 생성:
        - `ORD-${Date.now()}-${templateId}` 형식

    5. 데이터베이스 저장:
        - payments 테이블에 INSERT:
          - user_id: 인증된 사용자 ID
          - template_id: templateId
          - amount: amount
          - status: "PENDING"
          - payment_key: null (Easy Checkout은 클라이언트에서 결제 후 paymentKey 수신)

    6. 응답:
        - 성공: { orderId, amount, status: "PENDING", clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY }
        - 실패: { error: "에러 메시지" }

    Note: Easy Checkout은 서버에서 Toss API 호출하지 않음
    클라이언트에서 requestPayment(clientKey, { orderId, amount })로 결제창 표시
    결제 완료 후 클라이언트가 paymentKey를 서버로 전송하면 verifyPayment()로 검증

    7. 에러 처리:
       - 템플릿 없음 → 404 Not Found
       - 무료 템플릿 → 400 Bad Request
       - 이미 구매됨 → 409 Conflict
       - Toss API 에러 → 502 Bad Gateway
       - DB 에러 → 500 Internal Server Error

    Note: Easy Checkout은 client_key + orderId + amount로 클라이언트에서 결제창 표시
    서버에서는 orderId 생성 + DB 저장만 수행, paymentKey는 클라이언트 결제 완료 후 수신
  </action>
  <verify>
    <automated>cd src/app/api/payment/request && npx tsc --noEmit route.ts 2>&1</automated>
  </verify>
  <done>
    - POST /api/payment/request API 구현 완료
    - 인증, 검증, Toss 연동, DB 저장, 응답 처리 구현됨
    - 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 구매 상태 확인 API 구현</name>
  <files>src/app/api/payment/check/route.ts</files>
  <action>
    GET /api/payment/check?templateId=xxx — 템플릿 구매 상태 확인 API:

    1. 인증:
       - Authorization 헤더에서 Bearer 토큰 추출
       - getUserFromRequest(request)로 사용자 검증

    2. 쿼리 파라미터:
       - templateId: string (확인할 템플릿 ID, 필수)

    3. 비즈니스 로직:
       - payments 테이블에서 조회:
         SELECT * FROM payments WHERE user_id = ? AND template_id = ? AND status = 'DONE'
       - 결과가 있으면 is_purchased: true
       - 결과가 없으면 is_purchased: false

    4. 응답:
       - { templateId, is_purchased: boolean }

    5. 에러 처리:
       - templateId 없음 → 400 Bad Request
       - DB 에러 → 500 Internal Server Error

    Note: /templates 목록 페이지에서 각 템플릿의 구매 상태를 확인하는 데 사용
  </action>
  <verify>
    <automated>cd src/app/api/payment/check && npx tsc --noEmit route.ts 2>&1</automated>
  </verify>
  <done>
    - GET /api/payment/check API 구현 완료
    - 인증, 구매 상태 조회, 응답 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 결제 상태 관리 훅 구현</name>
  <files>src/hooks/use-payment.ts</files>
  <action>
    결제 상태 관리 훅 생성:

    1. PaymentState 인터페이스:
       - paymentKey: string | null
       - orderId: string | null
       - amount: number | null
       - loading: boolean
       - error: string | null
       - completed: boolean

    2. usePayment hook 반환값:
       - state: PaymentState
       - requestPayment(templateId: string, amount: number): Promise<void>
         - POST /api/payment/request 호출
         - paymentKey, orderId, amount 업데이트
       - checkPurchase(templateId: string): Promise<boolean>
         - GET /api/payment/check 호출
         - is_purchased 반환
       - reset(): void
         - 상태 초기화

    3. 상태 관리:
       - useState로 state 관리
       - async/await로 비동기 처리
       - try/catch로 에러 처리

    Reference: 기존 useSession.ts 패턴과 유사한 구조
  </action>
  <verify>
    <automated>cd src/hooks && npx tsc --noEmit use-payment.ts 2>&1</automated>
  </verify>
  <done>
    - usePayment hook 생성됨
    - requestPayment, checkPurchase, reset 메서드 구현됨
    - 상태 관리 및 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 4: Easy Checkout 모달 컴포넌트 구현</name>
  <files>src/components/payment/EasyCheckout.tsx</files>
  <action>
    Toss Easy Checkout 모달 컴포넌트 생성:

    1. EasyCheckoutProps:
       - isOpen: boolean (모달 표시 여부)
       - onClose: () => void (닫기 콜백)
       - templateName: string (구매할 템플릿 이름)
       - amount: number (결제 금액)
       - onSuccess: (paymentKey: string) => void (결제 완료 콜백)

    2. UI 구조:
       - shadcn/ui Dialog 컴포넌트 사용
       - 템플릿 정보 표시 (이름, 가격)
       - Toss Easy Checkout 결제창 표시
       - 결제 완료/취소/실패 상태 메시지

    3. Easy Checkout 연동:
        - useEffect에서 `loadPaymentSDK(clientKey, 'KR')` 호출
        - `TossPayments(clientKey).requestPayment({ orderId, amount })` 호출
        - Toss 결제창는 별도 모달로 표시됨 (임베드 아님)

    4. 동작 흐름:
        1. 모달 열림 → SDK 초기화
        2. "결제하기" 버튼 클릭 시 requestPayment() 호출 → Toss 결제창 팝업
        3. 결제 성공 → onSuccess(paymentKey) 콜백 → 모달 닫힘 + 상태 업데이트
        4. 결제 취소 → onClose 콜백 → 모달 닫힘
        5. 결제 실패 → 에러 메시지 표시

    5. 상태 표시:
        - 로딩: "결제를 진행해주세요"
        - 성공: "결제가 완료되었습니다"
        - 실패: "결제에 실패했습니다"

    6. SDK 로드:
        - import { loadPaymentSDK } from '@tosspayments/payment-sdk'
        - client_key은 process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY 사용

    7. 테스트 모드:
        - Toss 테스트용 client_key 사용 (실결제=false)
        - test.completePayment(paymentKey)로模拟 결제 완료 가능

    Note: Easy Checkout은 Toss가 제공하는 결제 모달을 임베드
    dialog 내부에 Toss 결제창을 표시하는 방식
  </action>
  <verify>
    <automated>cd src/components/payment && npx tsc --noEmit EasyCheckout.tsx 2>&1</automated>
  </verify>
  <done>
    - EasyCheckout 컴포넌트 생성됨
    - shadcn/ui Dialog 컴포넌트 사용
    - Toss Easy Checkout SDK 연동 구현됨
    - 결제 성공/취소/실패 흐름 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

## Verification

### Automated Checks
```bash
# 타입 체크
npx tsc --noEmit

# 파일 존재 확인
node -e "
  const fs = require('fs');
  const files = [
    'src/app/api/payment/request/route.ts',
    'src/app/api/payment/check/route.ts',
    'src/components/payment/EasyCheckout.tsx',
    'src/hooks/use-payment.ts'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"
```

### Manual Verification
1. 결제 요청 API가 orderId 생성 + DB 저장 (PENDING 상태) — Toss API 호출 없음 확인
2. 구매 상태 확인 API가 payments 테이블에서 user_id + template_id로 조회하는지 확인
3. EasyCheckout 컴포넌트가 Toss SDK를 올바르게 로드하고 결제창을 표시하는지 확인 (테스트 모드)
4. usePayment 훅이 결제 상태를 올바르게 관리하는지 확인
5. 결제 완료 후 verifyPayment()로 paymentKey 검증하는 흐름 확인

## Success Criteria

- [ ] src/app/api/payment/request/route.ts에 결제 요청 API 구현 완료 (80줄 이상)
- [ ] src/app/api/payment/check/route.ts에 구매 상태 확인 API 구현 완료 (40줄 이상)
- [ ] src/components/payment/EasyCheckout.tsx에 Easy Checkout 모달 구현 완료 (60줄 이상)
- [ ] src/hooks/use-payment.ts에 결제 훅 구현 완료 (40줄 이상)
- [ ] 결제 요청 API가 orderId 생성 + DB 저장 (Toss API 호출 없음 — Easy Checkout 방식)
- [ ] 구매 상태 확인 API가 payments 테이블에서 구매 여부 반환
- [ ] EasyCheckout이 Toss SDK 연동 완료 (테스트 모드)
- [ ] TypeScript 타입 체크 통과

## Output
After completion, create `.planning/phases/05-payment-system/05-payment-system-02-SUMMARY.md`
