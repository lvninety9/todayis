---
phase: 05-payment-system
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: [PAYMENT-01]
must_haves:
  truths:
    - "payments 테이블이 Supabase에 생성됨"
    - "templates 테이블에 price, is_premium 컬럼 추가됨"
    - "payment_key에 UNIQUE 인덱스가 설정됨"
    - "결제 관련 타입 정의가 생성됨"
    - "Toss Payments 서버 클라이언트가 설정됨"
  artifacts:
    - path: "src/types/payment.ts"
      provides: "결제 관련 타입 정의"
      exports: ["Payment", "PaymentStatus"]
    - path: "src/lib/payment/toss.ts"
      provides: "Toss Payments 서버 클라이언트"
      min_lines: 40
    - path: "supabase-payment-setup.sql"
      provides: "payments 테이블 생성 + templates 컬럼 추가 + 인덱스"
      min_lines: 30
  key_links:
    - from: "src/app/api/payment/request/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient import"
      pattern: "import.*TossPaymentsClient"
    - from: "src/app/api/payment/request/route.ts"
      to: "src/types/payment.ts"
      via: "Type import"
      pattern: "import.*PaymentStatus"
    - from: "src/lib/payment/toss.ts"
      to: "src/types/payment.ts"
      via: "Type usage"
      pattern: "PaymentStatus"

---

# Phase 5: 결제 시스템 - PLAN 01

## Objective
payments 테이블 생성, templates 가격 컬럼 추가, 결제 타입 정의, Toss Payments 서버 클라이언트 설정

Purpose: 결제 시스템의 데이터베이스 기반과 Toss 연동 구조 마련

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL) — Prisma NOT used
- **Auth**: Supabase Auth (JWT via Authorization header)
- **Phase Goal**: Toss Payments 연동을 통한 유료 템플릿 구매
- **Payment Provider**: Toss Payments (Easy Checkout)

### Existing Patterns
- API routes: `src/app/api/*/route.ts` (Next.js 14 App Router)
- Auth helper: `src/lib/auth.ts` — `getUserFromRequest(request)` 패턴
- Types: `src/types/*.ts` — interface + export 패턴
- SQL migrations: root directory `supabase-*.sql` 파일들
- Client-side auth: `useSession()` hook from `@/hooks/use-session`

### User Decisions (Locked) — CONTEXT.md 참조
- **결제 모델**: `payments` 테이블 (id, user_id, template_id, amount, status, payment_key UNIQUE, created_at)
- **상태 enum**: PENDING, DONE, CANCELED, EXPIRED
- **Toss 모드**: Easy Checkout (토스 결제창)
- **SDK**: `@tosspayments/payment-sdk` (클라이언트), 서버는 직접 HTTP 요청
- **가격 정책**: templates에 price(integer), is_premium(boolean) 추가, 기본 ₩9,900
- **웹훅**: `/api/payment/webhook`, 서명 검증, payment_key UNIQUE
- **환불**: API만 구현, UI 비활성화 (MVP)
- **UI 흐름**: 템플릿 상세 → "구매하기" → Easy Checkout 모달 → `/templates` 리다이렉트

### User Setup Required
- `TOSS_PAYMENTS_SECRET_KEY` 환경 변수 (서버용 API 키)
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경 변수 (클라이언트용)
- `supabase-payment-setup.sql`을 Supabase SQL 에디터에서 실행

## Must Haves

### Truths
1. payments 테이블이 Supabase에 생성됨 (user_id, template_id, amount, status, payment_key UNIQUE, created_at)
2. templates 테이블에 price(integer), is_premium(boolean) 컬럼 추가됨
3. payment_key에 UNIQUE 인덱스가 설정됨
4. 결제 관련 타입 정의가 생성됨
5. Toss Payments 서버 클라이언트가 설정됨

### Artifacts
- path: `src/types/payment.ts`
  provides: "결제 관련 타입 정의"
  exports: ["Payment", "PaymentStatus"]
- path: `src/lib/payment/toss.ts`
  provides: "Toss Payments 서버 클라이언트"
  min_lines: 40
- path: `supabase-payment-setup.sql`
  provides: "payments 테이블 생성 + templates 컬럼 추가 + 인덱스"
  min_lines: 30

### Key Links
- from: `src/app/api/payment/request/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient import"
  pattern: "import.*TossPaymentsClient"
- from: `src/app/api/payment/request/route.ts`
  to: `src/types/payment.ts`
  via: "Type import"
  pattern: "import.*PaymentStatus"
- from: `src/lib/payment/toss.ts`
  to: `src/types/payment.ts`
  via: "Type usage"
  pattern: "PaymentStatus"

## Tasks

<task type="auto">
  <name>Task 1: Supabase SQL Migration 생성</name>
  <files>supabase-payment-setup.sql</files>
  <action>
    Supabase SQL 마이그레이션 스크립트 생성:

    1. payments 테이블 생성:
       - id UUID PRIMARY KEY DEFAULT gen_random_uuid()
       - user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
       - template_id UUID REFERENCES templates(id)
       - amount INTEGER NOT NULL
       - status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DONE', 'CANCELED', 'EXPIRED'))
       - payment_key TEXT UNIQUE
       - created_at TIMESTAMPTZ NOT NULL DEFAULT now()

    2. templates 테이블 확장:
       - ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0
       - ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false

    3. 인덱스 생성:
       - CREATE INDEX idx_payments_user_id ON public.payments(user_id)
       - CREATE INDEX idx_payments_template_id ON public.payments(template_id)
       - CREATE INDEX idx_templates_is_premium ON public.templates(is_premium)

    4. RLS 정책:
       - ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY
       - 사용자 자신의 payment만 조회/관리: auth.uid() = user_id
       - 템플릿 구매 확인용: 공개 조회 가능 (status = 'DONE'인 것만)

    5. 기존 템플릿에 기본 가격 설정:
       - UPDATE public.templates SET price = 9900, is_premium = true WHERE is_premium = false

    Reference: 기존 supabase-setup.sql 패턴과 동일하게 작성
  </action>
  <verify>
    <automated>
      node -e "
        const fs = require('fs');
        const sql = fs.readFileSync('supabase-payment-setup.sql', 'utf8');
        const checks = [
          ['payments 테이블 CREATE', /CREATE TABLE.*payments/i],
          ['user_id 컬럼', /user_id.*UUID/],
          ['template_id 컬럼', /template_id.*UUID/],
          ['amount 컬럼', /amount.*INTEGER/],
          ['status 컬럼', /status.*TEXT/],
          ['payment_key UNIQUE', /payment_key.*TEXT.*UNIQUE/],
          ['price 컬럼 추가', /ALTER.*templates.*price/],
          ['is_premium 컬럼 추가', /ALTER.*templates.*is_premium/],
          ['RLS 활성화', /ENABLE ROW LEVEL SECURITY/],
          ['기본 가격 9900', /9900/]
        ];
        let allPass = true;
        for (const [name, pattern] of checks) {
          if (!pattern.test(sql)) {
            console.log('FAIL: ' + name);
            allPass = false;
          }
        }
        if (allPass) console.log('All SQL checks passed');
      "
    </automated>
  </verify>
  <done>
    - supabase-payment-setup.sql 생성됨
    - payments 테이블 생성 SQL 포함
    - templates price, is_premium 컬럼 추가 SQL 포함
    - 인덱스 및 RLS 정책 포함
    - 기존 템플릿 기본 가격 설정 포함
    - 모든 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 결제 타입 정의 생성</name>
  <files>src/types/payment.ts</files>
  <action>
    결제 시스템 타입 정의 생성:

    1. PaymentStatus enum (TypeScript const enum):
       - PENDING = "PENDING"
       - DONE = "DONE"
       - CANCELED = "CANCELED"
       - EXPIRED = "EXPIRED"

    2. Payment 인터페이스:
       - id: string
       - user_id: string
       - template_id: string | null
       - amount: number
       - status: PaymentStatus
       - payment_key: string | null
       - created_at: string

    3. PaymentInsert 인터페이스 (DB 삽입용):
       - user_id: string
       - template_id: string | null
       - amount: number
       - payment_key?: string | null

    4. PaymentUpdate 인터페이스 (DB 업데이트용):
       - status?: PaymentStatus
       - payment_key?: string | null
       - template_id?: string | null

    5. PurchaseCheck 타입 (템플릿 구매 여부 확인용):
       - template_id: string
       - is_purchased: boolean

    Reference: 기존 src/types/template.ts 패턴과 완전히 동일하게 작성
    Prisma 사용 안함 — Supabase 직접 쿼리용 타입
  </action>
  <verify>
    <automated>cd src/types && npx tsc --noEmit payment.ts 2>&1</automated>
  </verify>
  <done>
    - PaymentStatus enum 정의 완료
    - Payment, PaymentInsert, PaymentUpdate 인터페이스 정의 완료
    - PurchaseCheck 타입 정의 완료
    - 모든 타입 export됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: Toss Payments 서버 클라이언트 생성</name>
  <files>src/lib/payment/toss.ts</files>
  <action>
    Toss Payments 서버 사이드 클라이언트 생성:

    1. TossPaymentsClient 클래스:
       - constructor에서 TOSS_PAYMENTS_SECRET_KEY 로드
       - Base64 인코딩 Basic 인증 헤더 생성 메서드
       - Base URL: https://api.tosspayments.com

    2. 주요 메서드:
       - confirmPayment(paymentKey: string, amount: number): Promise<ConfirmPaymentResponse>
         - POST /v1/payments/{paymentKey}
         - 결제 상태 확인 (DONE, CANCELED, EXPIRED 등)
         - Toss API 응답을 인터페이스로 매핑
       - cancelPayment(paymentKey: string, cancelAmount?: number): Promise<CancelPaymentResponse>
         - POST /v1/payments/{paymentKey}/cancel
         - 결제 취소 처리
       - getPayment(paymentKey: string): Promise<GetPaymentResponse>
         - GET /v1/payments/{paymentKey}
         - 결제 상세 정보 조회 (웹훅 처리용)

    3. 응답 인터페이스:
       - ConfirmPaymentResponse: paymentKey, status, amount, method, paidAt 등
       - CancelPaymentResponse: paymentKey, cancelAmount, balanceAmount 등
       - GetPaymentResponse: paymentKey, orderId, amount, method, status, paidAt 등

    4. 환경 변수:
       - TOSS_PAYMENTS_SECRET_KEY (서버용, .env에만)
       - NEXT_PUBLIC_TOSS_CLIENT_KEY (클라이언트용, .env.local에도)

    5. 에러 처리:
       - Toss API 에러 코드 매핑
       - 네트워크 에러 처리
       - 인증 실패 에러 처리

    Note: @tosspayments/payment SDK 대신 직접 fetch 사용
    (Edge Runtime 호환성, 의존성 최소화)
  </action>
  <verify>
    <automated>cd src/lib/payment && npx tsc --noEmit toss.ts 2>&1</automated>
  </verify>
  <done>
    - TossPaymentsClient 클래스 생성됨
    - confirmPayment, cancelPayment, getPayment 메서드 구현됨
    - 환경 변수에서 API 키 로드
    - 응답 인터페이스 정의됨
    - 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

## Verification

### Automated Checks
```bash
# SQL 체크
node -e "
  const fs = require('fs');
  const sql = fs.readFileSync('supabase-payment-setup.sql', 'utf8');
  const checks = [
    'CREATE TABLE.*payments',
    'payment_key.*UNIQUE',
    'ALTER.*templates.*price',
    'ALTER.*templates.*is_premium',
    'ENABLE ROW LEVEL SECURITY'
  ];
  let allPass = true;
  for (const pattern of checks) {
    if (!new RegExp(pattern, 'i').test(sql)) {
      console.log('FAIL: ' + pattern);
      allPass = false;
    }
  }
  if (allPass) console.log('All SQL checks passed');
"

# 타입 체크
npx tsc --noEmit

# 파일 존재 확인
node -e "
  const fs = require('fs');
  const files = [
    'src/types/payment.ts',
    'src/lib/payment/toss.ts',
    'supabase-payment-setup.sql'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"
```

### Manual Verification
1. payments 테이블에 모든 필요한 컬럼이 포함되었는지 확인
2. templates 테이블에 price, is_premium 컬럼이 추가되었는지 확인
3. payment_key에 UNIQUE 제약이 설정되었는지 확인
4. TossPaymentsClient가 환경 변수에서 API 키를 올바르게 로드하는지 확인
5. Toss API 호출 메서드들이 올바른 엔드포인트를 사용하는지 확인

## Success Criteria

- [ ] supabase-payment-setup.sql 생성 완료 (payments 테이블 + templates 확장 + 인덱스 + RLS)
- [ ] src/types/payment.ts에 PaymentStatus, Payment, PaymentInsert, PaymentUpdate 정의 완료
- [ ] src/lib/payment/toss.ts에 TossPaymentsClient 구현 완료 (40줄 이상)
- [ ] npx tsc --noEmit 통과
- [ ] 모든 파일 존재 확인 통과

## Output
After completion, create `.planning/phases/05-payment-system/05-payment-system-01-SUMMARY.md`
