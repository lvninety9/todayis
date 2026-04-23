---
phase: 04-payment-system
plan: 02
type: execute
wave: 2
depends_on: ["04-payment-system-01-PLAN.md"]
files_modified: []
autonomous: true
requirements: [PAYMENT-02]
must_haves:
  truths:
    - "결제 요청 API가 Toss Payments와 연동되어 결제 UI URL 반환"
    - "결제 확인 API가 Toss Payments에서 결제 결과를 확인하고 DB 업데이트"
    - "결제 UI 컴포넌트가 결제 프로세스를 안내"
  artifacts:
    - path: "src/app/api/payment/request/route.ts"
      provides: "결제 요청 API"
      min_lines: 80
    - path: "src/app/api/payment/confirm/route.ts"
      provides: "결제 확인 API"
      min_lines: 80
    - path: "src/components/payment/PaymentDialog.tsx"
      provides: "결제 다이얼로그 컴포넌트"
      min_lines: 60
    - path: "src/hooks/use-payment.ts"
      provides: "결제 상태 관리 훅"
      min_lines: 40
  key_links:
    - from: "src/app/api/payment/request/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient.createPayment"
      pattern: "tossClient.createPayment"
    - from: "src/app/api/payment/confirm/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient.confirmPayment"
      pattern: "tossClient.confirmPayment"
    - from: "src/components/payment/PaymentDialog.tsx"
      to: "src/hooks/use-payment.ts"
      via: "usePayment hook import"
      pattern: "import.*usePayment"
    - from: "src/hooks/use-payment.ts"
      to: "src/types/payment.ts"
      via: "Type import"
      pattern: "import.*PaymentStatus"

---

# Phase 4: 결제 시스템 - PLAN 02

## Objective
결제 요청/확인 API 구현, 결제 UI 컴포넌트 및 훅 생성

Purpose: Toss Payments 연동 결제 프로세스 전체 구현
Output: 결제 요청 API, 결제 확인 API, 결제 다이얼로그, 결제 훅

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Phase Goal**: Toss Payments 연동을 통한 유료 템플릿 구매
- **Payment Provider**: Toss Payments

### Discovery Level: Level 0 (Internal Patterns Only)
- Next.js 14 App Router 패턴 사용
- 기존 API 라우트 패턴과 동일 (인증, 에러 처리, 응답 포맷팅)
- shadcn/ui 컴포넌트 재사용 (Dialog, Button, Card 등)
- TypeScript strict 모드

### User Decisions (Locked)
- Next.js 14 App Router 사용
- Toss Payments 사용
- 결제 UI는 임베디드 프레임 방식 (Toss Payments 제공)
- 결제 상태는 데이터베이스에 영구 저장

### User Setup Required
- Plan 01 완료됨 (Toss Payments SDK 설정, 스키마 정의)

## Must Haves

### Truths
1. 결제 요청 API가 Toss Payments와 연동되어 결제 UI URL 반환
2. 결제 확인 API가 Toss Payments에서 결제 결과를 확인하고 DB 업데이트
3. 결제 UI 컴포넌트가 결제 프로세스를 안내

### Artifacts
- path: `src/app/api/payment/request/route.ts`
  provides: "결제 요청 API"
  min_lines: 80
- path: `src/app/api/payment/confirm/route.ts`
  provides: "결제 확인 API"
  min_lines: 80
- path: `src/components/payment/PaymentDialog.tsx`
  provides: "결제 다이얼로그 컴포넌트"
  min_lines: 60
- path: `src/hooks/use-payment.ts`
  provides: "결제 상태 관리 훅"
  min_lines: 40

### Key Links
- from: `src/app/api/payment/request/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient.createPayment"
  pattern: "tossClient.createPayment"
- from: `src/app/api/payment/confirm/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient.confirmPayment"
  pattern: "tossClient.confirmPayment"
- from: `src/components/payment/PaymentDialog.tsx`
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
       - Supabase Auth로 사용자 검증 (기존 getUserFromRequest 패턴 재사용)
       - 미인증 사용자는 401 응답

    2. 요청 본문 검증:
       - orderId: string (고유 주문 번호, UUID 또는 접두사+timestamp)
       - amount: number (결제 금액, 양수 정수)
       - templateId: string (구매할 템플릿 ID, 필수)
       - customerEmail: string? (고객 이메일, 선택)
       - customerName: string? (고객 이름, 선택)

    3. 비즈니스 로직:
       - orderId 중복 체크 (payments 테이블에서 확인)
       - templateId로 템플릿 존재 여부 확인
       - 템플릿이 이미 구매되었는지 확인 (purchases 테이블)
       - 이미 결제된 주문인지 확인 (payments 테이블에서 orderId로 조회)

    4. Toss Payments 연동:
       - tossClient.createPayment(orderId, amount, customerEmail, customerName) 호출
       - Toss API 응답에서 paymentUrl 추출

    5. 데이터베이스 저장:
       - payments 테이블에 결제 요청 기록 저장
         - paymentKey: null (결제 전이므로)
         - orderId: 요청받은 orderId
         - amount: 요청받은 amount
         - status: "ready"
         - templateId: 요청받은 templateId
         - customerId: 인증된 사용자 ID

    6. 응답:
       - 성공: { paymentKey, paymentUrl, orderId, amount, status: "ready" }
       - 실패: { error: "에러 메시지" }

    7. 에러 처리:
       - Toss API 에러 → 502 Bad Gateway
       - DB 에러 → 500 Internal Server Error
       - 검증 실패 → 400 Bad Request
       - 중복 주문 → 409 Conflict
       - 템플릿 없음 → 404 Not Found

    Reference: 기존 API 라우트 패턴과 동일하게 인증, 검증, 에러 처리 구현
  </action>
  <verify>
    <automated>cd src/app/api/payment/request && npx tsc --noEmit route.ts</automated>
  </verify>
  <done>
    - POST /api/payment/request API 구현 완료
    - 인증, 검증, Toss 연동, DB 저장, 응답 처리 구현됨
    - 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 결제 확인 API 구현</name>
  <files>src/app/api/payment/confirm/route.ts</files>
  <action>
    POST /api/payment/confirm — 결제 확인 API 구현:

    1. 인증:
       - 서버 사이드 API이므로 인증 불필요 (웹훅/클라이언트에서 호출)
       - 대신 paymentKey 검증으로 무결성 보장

    2. 요청 본문 검증:
       - paymentKey: string (Toss Payments 고유 결제 키, 필수)
       - amount: number (결제 금액, 검증용)

    3. 비즈니스 로직:
       - paymentKey로 payments 테이블에서 결제 정보 조회
       - 이미 결제 완료된 상태면 중복 확인 스킵
       - 상태가 "pending" 또는 "ready"인 경우에만 확인 진행

    4. Toss Payments 연동:
       - tossClient.confirmPayment(paymentKey, amount) 호출
       - Toss API 응답에서 결제 상태, 방법, 취소가능금액 등 확인

    5. 데이터베이스 업데이트:
       - payments 테이블 업데이트:
         - paymentKey: 확인된 paymentKey
         - status: "paid"
         - method: Toss 응답에서 결제 방법
         - paidAt: 현재 시간
       - purchases 테이블에 구매 기록 생성:
         - userId: payments.customerId
         - paymentKey: paymentKey
         - templateId: payments.templateId
         - status: "active"

    6. 응답:
       - 성공: { paymentKey, status: "paid", amount, method, paidAt }
       - 실패: { error: "에러 메시지" }

    7. 에러 처리:
       - Toss API 에러 → 502 Bad Gateway
       - DB 에러 → 500 Internal Server Error
       - paymentKey 없음 → 404 Not Found
       - 이미 결제 완료 → 200 AlreadyPaid (중복 안전)

    Note: 이 API는 클라이언트에서 직접 호출하거나 Toss 웹훅에서 호출 가능
    중복 안전(deduplication) 보장 — 같은 paymentKey로 여러 번 호출해도 안전
  </action>
  <verify>
    <automated>cd src/app/api/payment/confirm && npx tsc --noEmit route.ts</automated>
  </verify>
  <done>
    - POST /api/payment/confirm API 구현 완료
    - Toss 결제 확인, DB 업데이트, 구매 기록 생성 구현됨
    - 중복 안전 보장
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 결제 상태 관리 훅 구현</name>
  <files>src/hooks/use-payment.ts</files>
  <action>
    결제 상태 관리 훅 생성:

    1. usePayment hook 인터페이스:
       - interface PaymentState {
           paymentKey: string | null;
           paymentUrl: string | null;
           status: PaymentStatus;
           amount: number | null;
           loading: boolean;
           error: string | null;
         }

    2. 주요 메서드:
       - requestPayment(orderId, amount, templateId, customerInfo?): Promise<void>
         - POST /api/payment/request 호출
         - paymentUrl과 status 업데이트
       - confirmPayment(paymentKey, amount): Promise<void>
         - POST /api/payment/confirm 호출
         - status를 "paid"로 업데이트
       - cancelPayment(paymentKey): Promise<void>
         - POST /api/payment/cancel 호출 (Task 4에서 구현)
         - status를 "cancelled"로 업데이트
       - reset(): void
         - 상태 초기화

    3. 상태 관리:
       - useState로 paymentState 관리
       - async/await로 비동기 처리
       - try/catch로 에러 처리

    4. 반환값:
       - { state, requestPayment, confirmPayment, cancelPayment, reset }

    Reference: 기존 useSession.ts 패턴과 유사한 구조
  </action>
  <verify>
    <automated>cd src/hooks && npx tsc --noEmit use-payment.ts</automated>
  </verify>
  <done>
    - usePayment hook 생성됨
    - requestPayment, confirmPayment, cancelPayment, reset 메서드 구현됨
    - 상태 관리 및 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 4: 결제 다이얼로그 컴포넌트 구현</name>
  <files>src/components/payment/PaymentDialog.tsx</files>
  <action>
    결제 다이얼로그 컴포넌트 생성:

    1. PaymentDialog 컴포넌트 Props:
       - isOpen: boolean (다이얼로그 표시 여부)
       - onClose: () => void (닫기 콜백)
       - template: Template (구매할 템플릿 정보)
       - onPaymentComplete?: (paymentKey: string) => void (결제 완료 콜백)

    2. UI 구조:
       - shadcn/ui Dialog 컴포넌트 사용
       - 템플릿 정보 표시 (이름, 가격)
       - 결제 요청 버튼
       - 결제 UI 임베디드 (paymentUrl이 있을 때 iframe으로 표시)
       - 결제 상태 표시 (대기, 완료, 실패)
       - 에러 메시지 표시

    3. 동작 흐름:
       1. "결제하기" 버튼 클릭 → requestPayment 호출
       2. paymentUrl 반환 → iframe에 Toss Payments UI 표시
       3. 사용자가 결제 완료 → confirmPayment 호출 (polling 또는 callback)
       4. 결제 완료 → onPaymentComplete 콜백 실행
       5. 다이얼로그 닫힘

    4. 상태 표시:
       - pending: "결제를 진행해주세요"
       - ready: Toss Payments iframe 표시
       - paid: "결제가 완료되었습니다" + 확인 메시지
       - failed: "결제에 실패했습니다" + 재시도 버튼

    5. 로딩 상태:
       - 결제 요청 중 로딩 스피너 표시
       - 버튼 비활성화

    Reference: shadcn/ui Dialog, Button, Card 컴포넌트 패턴 준수
  </action>
  <verify>
    <automated>cd src/components/payment && npx tsc --noEmit PaymentDialog.tsx</automated>
  </verify>
  <done>
    - PaymentDialog 컴포넌트 생성됨
    - shadcn/ui Dialog 컴포넌트 사용
    - 결제 요청, 확인, 완료 흐름 구현됨
    - 상태 표시 및 에러 처리 구현됨
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
    'src/app/api/payment/confirm/route.ts',
    'src/components/payment/PaymentDialog.tsx',
    'src/hooks/use-payment.ts'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"
```

### Manual Verification
1. 결제 요청 API가 Toss API와 연동되어 paymentUrl을 반환하는지 확인
2. 결제 확인 API가 Toss API에서 결제 결과를 확인하고 DB를 업데이트하는지 확인
3. PaymentDialog가 결제 요청 → Toss UI 표시 → 결제 완료 흐름을 올바르게 구현했는지 확인
4. usePayment 훅이 결제 상태를 올바르게 관리하는지 확인

## Success Criteria

- [ ] src/app/api/payment/request/route.ts에 결제 요청 API 구현 완료 (80줄 이상)
- [ ] src/app/api/payment/confirm/route.ts에 결제 확인 API 구현 완료 (80줄 이상)
- [ ] src/components/payment/PaymentDialog.tsx에 결제 다이얼로그 구현 완료 (60줄 이상)
- [ ] src/hooks/use-payment.ts에 결제 훅 구현 완료 (40줄 이상)
- [ ] 결제 요청 API가 Toss Payments와 연동되어 paymentUrl 반환
- [ ] 결제 확인 API가 Toss Payments에서 결제 결과를 확인하고 DB 업데이트
- [ ] PaymentDialog가 결제 요청 → Toss UI 표시 → 결제 완료 흐름 구현
- [ ] TypeScript 타입 체크 통과

## Output
After completion, create `.planning/phases/04-payment-system/04-payment-system-02-SUMMARY.md`
