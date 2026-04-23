---
phase: 04-payment-system
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: [PAYMENT-01]
must_haves:
  truths:
    - "Toss Payments SDK가 서버 사이드에서 설정됨"
    - "결제 요청 API가 Toss API와 연동되어 결제 UI URL 반환"
    - "결제 관련 데이터베이스 스키마가 정의됨"
  artifacts:
    - path: "src/types/payment.ts"
      provides: "결제 관련 타입 정의"
      exports: ["Payment", "PaymentMethod", "PaymentStatus", "Purchase"]
    - path: "src/lib/payment/toss.ts"
      provides: "Toss Payments 클라이언트"
      min_lines: 40
    - path: "prisma/schema.prisma"
      provides: "Payment, Purchase 모델 추가"
      updates: ["model Payment", "model Purchase"]
    - path: "src/lib/supabase/database.types.ts"
      provides: "Payment, Purchase 타입 추가"
      updates: ["Payment", "PaymentInsert", "PaymentUpdate", "Purchase", "PurchaseInsert"]
  key_links:
    - from: "src/app/api/payment/request/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient import"
      pattern: "import.*TossPaymentsClient"
    - from: "src/app/api/payment/request/route.ts"
      to: "src/types/payment.ts"
      via: "Type import"
      pattern: "import.*PaymentMethod|PaymentStatus"
    - from: "src/lib/payment/toss.ts"
      to: "src/types/payment.ts"
      via: "Type usage"
      pattern: "PaymentMethod|PaymentStatus"

---

# Phase 4: 결제 시스템 - PLAN 01

## Objective
Toss Payments SDK 설정, 결제 관련 데이터베이스 스키마 정의, 타입 정의 생성

Purpose: 결제 시스템의 기반을 마련하고, Toss Payments 연동 구조 설계
Output: Prisma 스키마 업데이트, 타입 정의, Toss Payments 클라이언트

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Phase Goal**: Toss Payments 연동을 통한 유료 템플릿 구매
- **Payment Provider**: Toss Payments (primary)

### Discovery Level: Level 0 (Internal Patterns Only)
- Next.js 14 App Router 패턴 사용
- Prisma ORM으로 데이터베이스 관리
- Supabase Auth로 인증
- 서버 사이드에서만 API 키 사용 (보안)

### User Decisions (Locked)
- Next.js 14 App Router 사용
- Toss Payments 사용 (Naver Pay는 V2+)
- Supabase Auth로 인증된 사용자만 결제 가능
- 결제 상태는 데이터베이스에 영구 저장

### User Setup Required
- `TOSS_PAYMENTS_SECRET_KEY` 환경 변수 설정 (서버용 API 키)
- `TOSS_PAYMENTS_CLIENT_KEY` 환경 변수 설정 (클라이언트용 고객 키)
- Toss Payments 대시보드에서 API 키 발급 필요

## Must Haves

### Truths
1. Toss Payments SDK가 서버 사이드에서 설정됨
2. 결제 요청 API가 Toss API와 연동되어 결제 UI URL 반환
3. 결제 관련 데이터베이스 스키마가 정의됨

### Artifacts
- path: `src/types/payment.ts`
  provides: "결제 관련 타입 정의"
  exports: ["Payment", "PaymentMethod", "PaymentStatus", "Purchase"]
- path: `src/lib/payment/toss.ts`
  provides: "Toss Payments 클라이언트"
  min_lines: 40
- path: `prisma/schema.prisma`
  provides: "Payment, Purchase 모델 추가"
  updates: ["model Payment", "model Purchase"]
- path: `src/lib/supabase/database.types.ts`
  provides: "Payment, Purchase 타입 추가"
  updates: ["Payment", "PaymentInsert", "PaymentUpdate", "Purchase", "PurchaseInsert"]

### Key Links
- from: `src/app/api/payment/request/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient import"
  pattern: "import.*TossPaymentsClient"
- from: `src/app/api/payment/request/route.ts`
  to: `src/types/payment.ts`
  via: "Type import"
  pattern: "import.*PaymentMethod|PaymentStatus"
- from: `src/lib/payment/toss.ts`
  to: `src/types/payment.ts`
  via: "Type usage"
  pattern: "PaymentMethod|PaymentStatus"

## Tasks

<task type="auto">
  <name>Task 1: 결제 관련 타입 정의 생성</name>
  <files>src/types/payment.ts</files>
  <action>
    결제 시스템의 핵심 타입 정의 생성:

    1. `PaymentMethod` enum:
       - "card": 신용카드/체크카드
       - "transfer": 계좌이체
       - "phone": 휴대폰소액결제
       - "vbank": 가상계좌
       - "coupon": 쿠폰

    2. `PaymentStatus` enum:
       - "pending": 결제 대기
       - "ready": 결제 UI 표시 완료 (paymentUrl 발급됨)
       - "paid": 결제 완료
       - "cancelled": 결제 취소
       - "failed": 결제 실패

    3. `Payment` 인터페이스:
       - paymentKey: string (Toss Payments 고유 결제 키, unique)
       - orderId: string (주문 번호, unique)
       - amount: { total: number; currency: string }
       - method: PaymentMethod
       - status: PaymentStatus
       - customerId: string | null (고객 ID, Supabase user_id 매핑)
       - templateId: string | null (구매할 템플릿 ID)
       - paidAt: DateTime | null
       - cancelledAt: DateTime | null
       - createdAt: DateTime
       - updatedAt: DateTime

    4. `Purchase` 인터페이스:
       - id: string (고유 식별자)
       - userId: string (구매자 ID)
       - paymentKey: string (결제 키와 매핑)
       - templateId: string (구매한 템플릿 ID)
       - status: "active" | "refunded"
       - createdAt: DateTime
       - updatedAt: DateTime

    5. Export all types for reuse

    Reference: AGENTS.md의 타입 스타일 가이드 준수, 기존 types 패턴과 일관성 유지
  </action>
  <verify>
    <automated>cd src/types && npx tsc --noEmit payment.ts</automated>
  </verify>
  <done>
    - PaymentMethod, PaymentStatus enum 정의 완료
    - Payment, Purchase 인터페이스 정의 완료
    - 모든 타입 export됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: Toss Payments 클라이언트 생성</name>
  <files>src/lib/payment/toss.ts</files>
  <action>
    Toss Payments 서버 사이드 클라이언트 생성:

    1. TossPaymentsClient 클래스 생성:
       - constructor에서 SECRET_KEY와 CLIENT_KEY 로드
       - base64 인코딩된 Basic 인증 헤더 생성 메서드
       - Base URL: https://api.tosspayments.com (production)

    2. 주요 메서드:
       - createPayment(orderId, amount, customerEmail, customerName):
         Payment 요청 → paymentUrl 반환
         - body: { orderId, amount, currency: "KRW", taxFreeAmount: 0, method: "CARD" }
         - customerInfo 포함
       - confirmPayment(paymentKey, amount):
         결제 확인 → 결제 성공/실패 결과 반환
       - cancelPayment(paymentKey):
         결제 취소 → 취소 결과 반환
       - getPayment(paymentKey):
         결제 정보 조회 → 결제 상세 정보 반환

    3. 에러 처리:
       - Toss API 에러 코드 매핑
       - 네트워크 에러 처리
       - 인증 실패 에러 처리

    4. 환경 변수:
       - TOSS_PAYMENTS_SECRET_KEY (서버용 API 키, 서버 사이드만 접근)
       - TOSS_PAYMENTS_CLIENT_KEY (클라이언트용 고객 키, NEXT_PUBLIC_ 접두사)

    Note: Toss Payments Node SDK 대신 직접 HTTP 요청 사용
    (의존성 최소화 및 Next.js Edge 호환성 고려)

    Reference: Toss Payments API 문서 (docs.tosspayments.com)
  </action>
  <verify>
    <automated>cd src/lib/payment && npx tsc --noEmit toss.ts</automated>
  </verify>
  <done>
    - TossPaymentsClient 클래스 생성됨
    - createPayment, confirmPayment, cancelPayment, getPayment 메서드 구현됨
    - 환경 변수에서 API 키 로드
    - 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: Prisma 스키마에 Payment/Purchase 모델 추가</name>
  <files>prisma/schema.prisma</files>
  <action>
    Prisma 스키마에 결제 관련 모델 추가:

    1. Payment 모델:
       - id: String @id @default(uuid())
       - paymentKey: String @unique @map("payment_key")
       - orderId: String @unique @map("order_id")
       - amount: Int @map("amount")
       - currency: String @default("KRW") @map("currency")
       - method: String @map("method") (card, transfer, phone, vbank, coupon)
       - status: String @default("pending") @map("status") (pending, ready, paid, cancelled, failed)
       - customerId: String? @map("customer_id")
       - templateId: String? @map("template_id")
       - paidAt: DateTime? @map("paid_at")
       - cancelledAt: DateTime? @map("cancelled_at")
       - createdAt: DateTime @default(now()) @map("created_at")
       - updatedAt: DateTime @updatedAt @map("updated_at")
       - @@map("payments")

    2. Purchase 모델:
       - id: String @id @default(uuid())
       - userId: String @map("user_id")
       - paymentKey: String @map("payment_key")
       - templateId: String @map("template_id")
       - status: String @default("active") (active, refunded)
       - createdAt: DateTime @default(now()) @map("created_at")
       - updatedAt: DateTime @updatedAt @map("updated_at")
       - user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
       - @@index([userId])
       - @@index([paymentKey])
       - @@map("purchases")

    3. 기존 User 모델에 purchases 관계 추가:
       - purchases Purchase[]

    4. 기존 Template 모델에 purchases 관계 추가:
       - purchases Purchase[]

    5. Migration 명령어 실행 준비:
       - npx prisma migrate dev --name add_payment_models

    Reference: 기존 schema.prisma 패턴 준수 (매핑, 인덱스, 관계)
  </action>
  <verify>
    <automated>npx prisma validate</automated>
  </verify>
  <done>
    - Payment 모델 추가됨
    - Purchase 모델 추가됨
    - User, Template 모델에 관계 추가됨
    - Prisma validate 통과
  </done>
</task>

<task type="auto">
  <name>Task 4: Supabase database.types.ts에 Payment/Purchase 타입 추가</name>
  <files>src/lib/supabase/database.types.ts</files>
  <action>
    Supabase 데이터베이스 타입에 Payment/Purchase 타입 추가:

    1. Payment 관련 타입:
       - PaymentRow (PostgreSQL 매핑)
       - PaymentInsert (생성 시)
       - PaymentUpdate (수정 시)

    2. Purchase 관련 타입:
       - PurchaseRow (PostgreSQL 매핑)
       - PurchaseInsert (생성 시)
       - PurchaseUpdate (수정 시)

    3. 기존 Template 타입 아래에 추가 (파일 구조 유지)

    4. snake_case ↔ camelCase 매핑 주석 추가

    Reference: 기존 Template 타입 정의 패턴과 완전히 동일하게 준수
  </action>
  <verify>
    <automated>cd src/lib/supabase && npx tsc --noEmit database.types.ts</automated>
  </verify>
  <done>
    - PaymentRow, PaymentInsert, PaymentUpdate 타입 추가됨
    - PurchaseRow, PurchaseInsert, PurchaseUpdate 타입 추가됨
    - 기존 타입과 일관된 스타일
    - TypeScript 타입 체크 통과
  </done>
</task>

## Verification

### Automated Checks
```bash
# Prisma 스키마 검증
npx prisma validate

# 타입 체크
npx tsc --noEmit

# 파일 존재 확인
node -e "
  const fs = require('fs');
  const files = [
    'src/types/payment.ts',
    'src/lib/payment/toss.ts',
    'prisma/schema.prisma',
    'src/lib/supabase/database.types.ts'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"
```

### Manual Verification
1. Payment 타입에 모든 필요한 필드가 포함되었는지 확인
2. TossPaymentsClient가 환경 변수에서 API 키를 올바르게 로드하는지 확인
3. Prisma 스키마가 유효한지 확인 (npx prisma validate)
4. database.types.ts에 Payment/Purchase 타입이 올바르게 추가되었는지 확인

## Success Criteria

- [ ] src/types/payment.ts에 PaymentMethod, PaymentStatus, Payment, Purchase 타입 정의 완료
- [ ] src/lib/payment/toss.ts에 TossPaymentsClient 구현 완료 (40줄 이상)
- [ ] prisma/schema.prisma에 Payment, Purchase 모델 추가 완료
- [ ] src/lib/supabase/database.types.ts에 Payment, Purchase 타입 추가 완료
- [ ] npx prisma validate 통과
- [ ] TypeScript 타입 체크 통과

## Output
After completion, create `.planning/phases/04-payment-system/04-payment-system-01-SUMMARY.md`
