---
phase: 04-payment-system
plan: 03
type: execute
wave: 3
depends_on: ["04-payment-system-02-PLAN.md"]
files_modified: []
autonomous: true
requirements: [PAYMENT-03]
must_haves:
  truths:
    - "웹훅 핸들러가 Toss Payments 웹훅을 수신하여 결제 상태를 동기화"
    - "웹훅 검증 서명 또는 orderId 매칭으로 신뢰성 보장"
    - "결제 취소 API가 구현됨"
  artifacts:
    - path: "src/app/api/payment/webhook/route.ts"
      provides: "Toss Payments 웹훅 핸들러"
      min_lines: 80
    - path: "src/app/api/payment/cancel/route.ts"
      provides: "결제 취소 API"
      min_lines: 60
    - path: "src/app/api/payment/history/route.ts"
      provides: "결제 내역 조회 API"
      min_lines: 50
    - path: "src/components/payment/PaymentHistory.tsx"
      provides: "결제 내역 컴포넌트"
      min_lines: 50
  key_links:
    - from: "src/app/api/payment/webhook/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient.getPayment"
      pattern: "tossClient.getPayment"
    - from: "src/app/api/payment/cancel/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient.cancelPayment"
      pattern: "tossClient.cancelPayment"
    - from: "src/components/payment/PaymentHistory.tsx"
      to: "src/app/api/payment/history/route.ts"
      via: "API call"
      pattern: "/api/payment/history"

---

# Phase 4: 결제 시스템 - PLAN 03

## Objective
Toss Payments 웹훅 핸들러 구현, 결제 취소 API, 결제 내역 조회 API, 결제 내역 UI 구현

Purpose: 결제 시스템의 완성도 높이기 — 웹훅 동기화, 취소, 내역 조회
Output: 웹훅 핸들러, 결제 취소 API, 결제 내역 API, 결제 내역 컴포넌트

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Phase Goal**: Toss Payments 연동을 통한 유료 템플릿 구매
- **Payment Provider**: Toss Payments

### Discovery Level: Level 0 (Internal Patterns Only)
- Next.js 14 App Router 패턴 사용
- 기존 API 라우트 패턴과 동일
- shadcn/ui 컴포넌트 재사용

### User Decisions (Locked)
- Next.js 14 App Router 사용
- Toss Payments 웹훅 사용 (결제 상태 동기화)
- 결제 취소는 전액 취소만 지원 (MVP)
- 결제 내역은 로그인한 사용자만 조회 가능

### User Setup Required
- Plan 01, 02 완료됨 (SDK 설정, 결제 요청/확인 API, UI 컴포넌트)

## Must Haves

### Truths
1. 웹훅 핸들러가 Toss Payments 웹훅을 수신하여 결제 상태를 동기화
2. 웹훅 검증으로 신뢰성 보장
3. 결제 취소 API가 구현됨

### Artifacts
- path: `src/app/api/payment/webhook/route.ts`
  provides: "Toss Payments 웹훅 핸들러"
  min_lines: 80
- path: `src/app/api/payment/cancel/route.ts`
  provides: "결제 취소 API"
  min_lines: 60
- path: `src/app/api/payment/history/route.ts`
  provides: "결제 내역 조회 API"
  min_lines: 50
- path: `src/components/payment/PaymentHistory.tsx`
  provides: "결제 내역 컴포넌트"
  min_lines: 50

### Key Links
- from: `src/app/api/payment/webhook/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient.getPayment"
  pattern: "tossClient.getPayment"
- from: `src/app/api/payment/cancel/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient.cancelPayment"
  pattern: "tossClient.cancelPayment"
- from: `src/components/payment/PaymentHistory.tsx`
  to: `src/app/api/payment/history/route.ts`
  via: "API call"
  pattern: "/api/payment/history"

## Tasks

<task type="auto">
  <name>Task 1: Toss Payments 웹훅 핸들러 구현</name>
  <files>src/app/api/payment/webhook/route.ts</files>
  <action>
    POST /api/payment/webhook — Toss Payments 웹훅 핸들러 구현:

    1. 웹훅 수신:
       - Toss Payments에서 POST 요청 수신
       - body에서 orderId, event 추출
       - Toss 웹훅 이벤트 타입: PAYMENT_BY_METHOD, PAYMENT_CANCELED 등

    2. 웹훅 검증:
       - orderId로 payments 테이블에서 결제 정보 조회
       - orderId가 DB에 없으면 무시 (이미 처리되었거나 잘못된 웹훅)
       - 같은 orderId로 이미 처리된 웹훅이면 중복 처리 스킵 (webhook_processed_at 체크)

    3. 이벤트 처리:
       - PAYMENT_BY_METHOD (결제 성공):
         - tossClient.getPayment(paymentKey)로 결제 상세 정보 조회
         - payments 테이블 업데이트:
           - paymentKey: 결제 키
           - status: "paid"
           - method: 결제 방법
           - paidAt: 현재 시간
         - purchases 테이블에 구매 기록 생성 (아직 없으면)
       - PAYMENT_CANCELED (결제 취소):
         - payments 테이블 업데이트:
           - status: "cancelled"
           - cancelledAt: 현재 시간
         - purchases 테이블 업데이트:
           - status: "refunded"

    4. 데이터베이스 업데이트:
       - payments 테이블에 webhook_processed_at 업데이트
       - 트랜잭션으로 payments + purchases 동시 업데이트 (Atomic)

    5. 응답:
       - 성공: { status: "ok" } (200 OK)
       - 실패: { error: "에러 메시지" } (200 OK — Toss는 200만 응답)

    6. 에러 처리:
       - Toss API 에러 → 200 OK (웹훅 재시도 허용)
       - DB 에러 → 200 OK (웹훅 재시도 허용)
       - 잘못된 요청 → 400 Bad Request

    Note: Toss Payments 웹훅은 반드시 200 OK 응답을 요구함
    에러가 발생해도 200을 반환하여 웹훅 재시도를 유도
    실제 에러는 로깅으로만 처리

    Reference: Toss Payments 웹훅 문서 (docs.tosspayments.com/reference/webhook)
  </action>
  <verify>
    <automated>cd src/app/api/payment/webhook && npx tsc --noEmit route.ts</automated>
  </verify>
  <done>
    - POST /api/payment/webhook 핸들러 구현 완료
    - 웹훅 검증, 이벤트 처리, DB 업데이트 구현됨
    - 중복 안전 보장
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 결제 취소 API 구현</name>
  <files>src/app/api/payment/cancel/route.ts</files>
  <action>
    POST /api/payment/cancel — 결제 취소 API 구현:

    1. 인증:
       - Authorization 헤더에서 Bearer 토큰 추출
       - Supabase Auth로 사용자 검증
       - 미인증 사용자는 401 응답

    2. 요청 본문 검증:
       - paymentKey: string (취소할 결제 키, 필수)
       - cancelAmount: number? (취소 금액, 미지정 시 전액 취소)
       - cancelReason: string? (취소 사유)

    3. 비즈니스 로직:
       - paymentKey로 payments 테이블에서 결제 정보 조회
       - 소유자 검증: payments.customerId가 인증된 사용자 ID와 일치하는지 확인
       - 결제 상태가 "paid"인 경우에만 취소 가능
       - 이미 취소된 결제는 400 응답

    4. Toss Payments 연동:
       - tossClient.cancelPayment(paymentKey, cancelAmount?) 호출
       - Toss API 응답에서 취소 금액, 잔여 취소 가능 금액 확인

    5. 데이터베이스 업데이트:
       - payments 테이블 업데이트:
         - status: "cancelled"
         - cancelledAt: 현재 시간
       - purchases 테이블 업데이트:
         - status: "refunded"

    6. 응답:
       - 성공: { paymentKey, status: "cancelled", cancelAmount, cancelledAt }
       - 실패: { error: "에러 메시지" }

    7. 에러 처리:
       - Toss API 에러 → 502 Bad Gateway
       - DB 에러 → 500 Internal Server Error
       - paymentKey 없음 → 404 Not Found
       - 소유자 불일치 → 403 Forbidden
       - 이미 취소됨 → 400 Bad Request
       - 결제 안됨 → 400 Bad Request

    Note: MVP에서는 전액 취소만 지원 (부분 취소는 V2+)
  </action>
  <verify>
    <automated>cd src/app/api/payment/cancel && npx tsc --noEmit route.ts</automated>
  </verify>
  <done>
    - POST /api/payment/cancel API 구현 완료
    - 인증, 소유자 검증, Toss 연동, DB 업데이트 구현됨
    - 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 결제 내역 조회 API 구현</name>
  <files>src/app/api/payment/history/route.ts</files>
  <action>
    GET /api/payment/history — 결제 내역 조회 API 구현:

    1. 인증:
       - Authorization 헤더에서 Bearer 토큰 추출
       - Supabase Auth로 사용자 검증
       - 미인증 사용자는 401 응답

    2. 쿼리 파라미터:
       - page: number? (페이지 번호, 기본값: 1)
       - limit: number? (페이지 크기, 기본값: 10, 최대: 50)
       - status: string? (상태 필터: paid, cancelled, failed)

    3. 비즈니스 로직:
       - purchases 테이블에서 userId로 구매 기록 조회
       - payments 테이블과 조인하여 결제 정보 포함
       - 상태 필터 적용 (선택사항)
       - 페이지네이션 적용 (created_at 내림차순)

    4. 응답:
       - {
           purchases: [
             {
               id: string,
               paymentKey: string,
               templateId: string,
               templateName: string,
               amount: number,
               status: "paid" | "cancelled" | "failed",
               paidAt: string | null,
               createdAt: string
             }
           ],
           total: number,
           page: number,
           limit: number
         }

    5. 에러 처리:
       - DB 에러 → 500 Internal Server Error

    Reference: 기존 템플릿 목록 API 패턴과 유사 (페이지네이션, 필터링)
  </action>
  <verify>
    <automated>cd src/app/api/payment/history && npx tsc --noEmit route.ts</automated>
  </verify>
  <done>
    - GET /api/payment/history API 구현 완료
    - 인증, 페이지네이션, 필터링, 조인 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 4: 결제 내역 컴포넌트 구현</name>
  <files>src/components/payment/PaymentHistory.tsx</files>
  <action>
    결제 내역 컴포넌트 생성:

    1. PaymentHistory 컴포넌트 Props:
       - userId: string (조회할 사용자 ID)

    2. UI 구조:
       - shadcn/ui Table 컴포넌트 사용
       - 결제 내역 목록 표시:
         - 주문 번호 (orderId)
         - 템플릿 이름
         - 결제 금액
         - 결제 상태 (배지 색상: paid=green, cancelled=red, failed=orange)
         - 결제일
       - 페이지네이션 (이전/다음 버튼)
       - 로딩 상태 (스피너)
       - 빈 상태 (결제 내역 없음 메시지)

    3. 동작 흐름:
       - 컴포넌트 마운트 시 GET /api/payment/history 호출
       - 페이지네이션 변경 시 재조회
       - 상태 필터 변경 시 재조회

    4. 상태 표시:
       - paid: "결제 완료" (초록색 배지)
       - cancelled: "취소됨" (빨간색 배지)
       - failed: "실패" (주황색 배지)

    5. 액션:
       - 결제 완료: 상세 보기 (모달 또는 페이지 이동)
       - 결제 취소: "취소하기" 버튼 (취소 확인 다이얼로그)

    Reference: shadcn/ui Table, Badge, Button 컴포넌트 패턴 준수
  </action>
  <verify>
    <automated>cd src/components/payment && npx tsc --noEmit PaymentHistory.tsx</automated>
  </verify>
  <done>
    - PaymentHistory 컴포넌트 생성됨
    - shadcn/ui Table 컴포넌트 사용
    - 결제 내역 목록, 페이지네이션, 상태 표시 구현됨
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
    'src/app/api/payment/webhook/route.ts',
    'src/app/api/payment/cancel/route.ts',
    'src/app/api/payment/history/route.ts',
    'src/components/payment/PaymentHistory.tsx'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"
```

### Manual Verification
1. 웹훅 핸들러가 Toss Payments 웹훅을 올바르게 수신하고 처리하는지 확인
2. 결제 취소 API가 소유자 검증 후 Toss API로 취소 요청하는지 확인
3. 결제 내역 API가 페이지네이션과 필터링을 올바르게 적용하는지 확인
4. PaymentHistory가 결제 내역을 올바르게 표시하는지 확인

## Success Criteria

- [ ] src/app/api/payment/webhook/route.ts에 웹훅 핸들러 구현 완료 (80줄 이상)
- [ ] src/app/api/payment/cancel/route.ts에 결제 취소 API 구현 완료 (60줄 이상)
- [ ] src/app/api/payment/history/route.ts에 결제 내역 조회 API 구현 완료 (50줄 이상)
- [ ] src/components/payment/PaymentHistory.tsx에 결제 내역 컴포넌트 구현 완료 (50줄 이상)
- [ ] 웹훅 핸들러가 Toss Payments 웹훅 이벤트를 올바르게 처리
- [ ] 결제 취소 API가 소유자 검증 후 취소 처리
- [ ] 결제 내역 API가 페이지네이션과 필터링 지원
- [ ] PaymentHistory가 결제 내역을 올바르게 표시
- [ ] TypeScript 타입 체크 통과

## Output
After completion, create `.planning/phases/04-payment-system/04-payment-system-03-SUMMARY.md`
