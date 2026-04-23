---
phase: 05-payment-system
plan: 03
type: execute
wave: 3
depends_on: ["05-payment-system-02-PLAN.md"]
files_modified: []
autonomous: true
requirements: [PAYMENT-03]
must_haves:
  truths:
    - "웹훅 핸들러가 Toss Payments 웹훅을 수신하여 결제 상태를 동기화"
    - "웹훅 처리 시 payment_key UNIQUE 인덱스로 중복 처리 방지"
    - "결제 취소 API가 구현됨 (UI는 비활성화, MVP)"
    - "템플릿 상세 페이지에 '구매하기' 버튼이 가격 정보와 함께 표시됨"
    - "/templates 목록에서 구매한 템플릿은 '편집하기' 버튼으로 표시됨"
  artifacts:
    - path: "src/app/api/payment/webhook/route.ts"
      provides: "Toss Payments 웹훅 핸들러"
      min_lines: 80
    - path: "src/app/api/payment/[paymentId]/cancel/route.ts"
      provides: "결제 취소 API"
      min_lines: 60
    - path: "src/app/(main)/templates/[id]/page.tsx"
      provides: "템플릿 상세 페이지 (구매하기 버튼 통합)"
      min_lines: 40
  key_links:
    - from: "src/app/api/payment/webhook/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient.getPayment"
      pattern: "tossClient.getPayment"
    - from: "src/app/api/payment/[paymentId]/cancel/route.ts"
      to: "src/lib/payment/toss.ts"
      via: "TossPaymentsClient.cancelPayment"
      pattern: "tossClient.cancelPayment"
    - from: "src/app/(main)/templates/[id]/page.tsx"
      to: "src/components/payment/EasyCheckout.tsx"
      via: "EasyCheckout 컴포넌트 import"
      pattern: "import.*EasyCheckout"

---

# Phase 5: 결제 시스템 - PLAN 03

## Objective
Toss Payments 웹훅 핸들러, 결제 취소 API, 템플릿 상세 페이지 구매 버튼 통합

Purpose: 결제 시스템 완성 — 웹훅 동기화, 취소 API, UI 통합

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Phase Goal**: Toss Payments Easy Checkout 연동 완성

### Existing Patterns
- API routes: `src/app/api/*/route.ts`
- Webhook routes: Next.js App Router에서 `route.ts` 파일
- Supabase client: `src/lib/supabase/client.ts` (client-side), server-side는 직접 createClient
- Templates: `src/app/(main)/templates/[id]/edit/page.tsx`가 이미 존재
- shadcn/ui: Dialog, Button, Card, Badge 컴포넌트 사용 가능

### User Decisions (Locked) — CONTEXT.md 참조
- **웹훅**: `/api/payment/webhook`, 서명 검증 (SHA-256 HMAC), payment_key 조회로 상태 확인
- **중복 처리**: payment_key UNIQUE 인덱스, INSERT ... ON CONFLICT IGNORE
- **허용 상태**: DONE만 구매 처리, CANCELED/EXPIRED은 취소 처리
- **환불**: API만 구현, UI 비활성화 (MVP)
- **UI 흐름**: 템플릿 상세 → "구매하기" → Easy Checkout 모달 → `/templates` 리다이렉트
- **구매 확인**: /templates 목록에서 purchased 템플릿은 "편집하기" 버튼 표시

### User Setup Required
- Plan 01, 02 완료됨 (DB 스키마, 타입, Toss 클라이언트, 결제 요청 API, Easy Checkout)

## Must Haves

### Truths
1. 웹훅 핸들러가 Toss Payments 웹훅을 수신하여 결제 상태를 동기화
2. 웹훅 처리 시 payment_key UNIQUE 인덱스로 중복 처리 방지
3. 결제 취소 API가 구현됨 (UI는 비활성화, MVP)
4. 템플릿 상세 페이지에 '구매하기' 버튼이 가격 정보와 함께 표시됨
5. /templates 목록에서 구매한 템플릿은 '편집하기' 버튼으로 표시됨

### Artifacts
- path: `src/app/api/payment/webhook/route.ts`
  provides: "Toss Payments 웹훅 핸들러"
  min_lines: 80
- path: `src/app/api/payment/[paymentId]/cancel/route.ts`
  provides: "결제 취소 API"
  min_lines: 60
- path: `src/app/(main)/templates/[id]/page.tsx`
  provides: "템플릿 상세 페이지 (구매하기 버튼 통합)"
  min_lines: 40

### Key Links
- from: `src/app/api/payment/webhook/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient.getPayment"
  pattern: "tossClient.getPayment"
- from: `src/app/api/payment/[paymentId]/cancel/route.ts`
  to: `src/lib/payment/toss.ts`
  via: "TossPaymentsClient.cancelPayment"
  pattern: "tossClient.cancelPayment"
- from: `src/app/(main)/templates/[id]/page.tsx`
  to: `src/components/payment/EasyCheckout.tsx`
  via: "EasyCheckout 컴포넌트 import"
  pattern: "import.*EasyCheckout"

## Tasks

<task type="auto">
  <name>Task 1: Toss Payments 웹훅 핸들러 구현</name>
  <files>src/app/api/payment/webhook/route.ts</files>
  <action>
    POST /api/payment/webhook — Toss Payments 웹훅 핸들러 구현:

    1. 웹훅 수신:
       - Toss Payments에서 POST 요청 수신
       - body에서 paymentKey, eventType, orderId 추출
       - Toss 웹훅 이벤트: PAYMENT_COMPLETED, PAYMENT_CANCELED

    2. 웹훅 검증:
       - 시그니처 검증 (SHA-256 HMAC):
         - headers에서 X-Signature 추출
         - body를 시크릿 키로 해시하여 비교
       - 서명이 다르면 401 응답

    3. 이벤트 처리:
       - PAYMENT_COMPLETED:
         - tossClient.getPayment(paymentKey)로 결제 상세 조회
         - payments 테이블에서 paymentKey로 조회
         - status를 "DONE"로 업데이트
         - amount, method, paidAt 정보 반영
       - PAYMENT_CANCELED:
         - payments 테이블에서 paymentKey로 조회
         - status를 "CANCELED"로 업데이트
         - cancelReason이 있으면 기록

    4. 중복 처리:
       - payment_key에 UNIQUE 인덱스가 있으므로
       - INSERT 시 ON CONFLICT DO NOTHING (Supabase 직접 쿼리)
       - 이미 DONE 상태면 무시 (중복 안전)

    5. 응답:
       - 성공: { status: "ok" } (200 OK)
       - 실패: { status: "error" } (200 OK — Toss는 200만 응답 요구)

    6. 에러 처리:
       - 서명 검증 실패 → 401 Unauthorized
       - 잘못된 요청 → 400 Bad Request
       - 그 외 모든 에러 → 200 OK (웹훅 재시도 허용, 로깅만)

    Note: Toss Payments 웹훅은 반드시 200 OK 응답을 요구
    에러가 발생해도 200을 반환하여 웹훅 재시도 유도
    실제 에러는 console.error로만 로깅
  </action>
  <verify>
    <automated>cd src/app/api/payment/webhook && npx tsc --noEmit route.ts 2>&1</automated>
  </verify>
  <done>
    - POST /api/payment/webhook 핸들러 구현 완료
    - 서명 검증, 이벤트 처리, DB 업데이트 구현됨
    - 중복 안전 보장 (payment_key UNIQUE + ON CONFLICT DO NOTHING)
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 결제 취소 API 구현</name>
  <files>src/app/api/payment/[paymentId]/cancel/route.ts</files>
  <action>
    POST /api/payment/[paymentId]/cancel — 결제 취소 API 구현:

    1. 인증:
       - Authorization 헤더에서 Bearer 토큰 추출
       - getUserFromRequest(request)로 사용자 검증

    2. 요청 본문 검증 (zod):
       - reason: string? (취소 사유, 선택)

    3. 비즈니스 로직:
        - params.paymentId (paymentKey)로 payments 테이블에서 결제 정보 조회
       - 소유자 검증: payments.user_id가 인증된 사용자 ID와 일치하는지 확인
       - 결제 상태가 "DONE"인 경우에만 취소 가능
       - 이미 취소된 결제는 400 응답

    4. Toss Payments 연동:
       - tossClient.cancelPayment(paymentKey) 호출
       - Toss API 응답에서 취소 금액 확인

    5. 데이터베이스 업데이트:
       - payments 테이블 업데이트:
         - status: "CANCELED"

    6. 응답:
       - 성공: { paymentKey, status: "CANCELED" }
       - 실패: { error: "에러 메시지" }

    7. 에러 처리:
       - Toss API 에러 → 502 Bad Gateway
       - DB 에러 → 500 Internal Server Error
       - paymentKey 없음 → 404 Not Found
       - 소유자 불일치 → 403 Forbidden
       - 이미 취소됨 → 400 Bad Request
       - 결제 안됨 → 400 Bad Request

    Note: MVP에서는 UI 버튼을 비활성화 (관리자만 사용 가능)
  </action>
  <verify>
    <automated>cd src/app/api/payment/[paymentId] && npx tsc --noEmit cancel/route.ts 2>&1</automated>
  </verify>
  <done>
    - POST /api/payment/[paymentId]/cancel API 구현 완료
    - 인증, 소유자 검증, Toss 연동, DB 업데이트 구현됨
    - 에러 처리 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 템플릿 상세 페이지에 구매 버튼 통합</name>
  <files>src/app/(main)/templates/[id]/page.tsx</files>
  <action>
    템플릿 상세 페이지에 구매 흐름 통합:

    1. 기존 파일 확인:
       - src/app/(main)/templates/[id]/edit/page.tsx가 이미 존재
       - 템플릿 상세 페이지가 필요하므로 새 page.tsx 생성 또는 edit 페이지 수정

    2. 페이지 구조:
       - 서버 컴포넌트: 템플릿 정보 조회 (name, thumbnail, price, is_premium)
       - 클라이언트 컴포넌트: 구매 상태 확인 + Easy Checkout 모달

    3. 구매 상태 확인:
       - useEffect에서 GET /api/payment/check?templateId={id} 호출
       - is_purchased=true이면 "편집하기" 버튼 표시
       - is_purchased=false이면 "구매하기" 버튼 표시 (price가 > 0인 경우)
       - 무료 템플릿(is_premium=false 또는 price=0)이면 바로 "편집하기" 버튼

    4. Easy Checkout 모달:
       - "구매하기" 버튼 클릭 시 EasyCheckout 모달 열기
       - templateName, amount (templates.price) 전달
       - onSuccess 콜백: 모달 닫기 → toast.success → router.push('/templates')

    5. UI 구성:
       - 템플릿 정보 (이름, 썸네일, 가격)
       - 구매 상태에 따른 버튼 ("구매하기" 또는 "편집하기")
       - EasyCheckout 모달 (isOpen 상태 관리)

    6. 가격 표시:
       - 유료: `₩${amount.toLocaleString()}`
       - 무료: "무료"

    Note: 템플릿 상세 페이지가 아직 없으므로 새로 생성
    기존 edit 페이지는 템플릿 제작 페이지로 유지
  </action>
  <verify>
    <automated>cd src/app/\(main\)/templates/\[id\] && npx tsc --noEmit page.tsx 2>&1</automated>
  </verify>
  <done>
    - 템플릿 상세 페이지 생성됨
    - 템플릿 정보 조회 (서버 컴포넌트)
    - 구매 상태 확인 (클라이언트 컴포넌트)
    - EasyCheckout 모달 통합
    - "구매하기" / "편집하기" 버튼 조건부 표시
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
    'src/app/api/payment/[paymentId]/cancel/route.ts',
    'src/app/(main)/templates/[id]/page.tsx'
  ];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing: ' + f);
  });
  console.log('All files exist');
"
```

### Manual Verification
1. 웹훅 핸들러가 Toss Payments 웹훅을 올바르게 수신하고 서명 검증하는지 확인
2. 결제 취소 API가 소유자 검증 후 취소 처리하는지 확인
3. 템플릿 상세 페이지에서 구매 상태에 따라 올바른 버튼이 표시되는지 확인
4. Easy Checkout 모달이 템플릿 상세 페이지에서 올바르게 열리는지 확인

## Success Criteria

- [ ] src/app/api/payment/webhook/route.ts에 웹훅 핸들러 구현 완료 (80줄 이상)
- [ ] src/app/api/payment/[paymentId]/cancel/route.ts에 결제 취소 API 구현 완료 (60줄 이상)
- [ ] src/app/(main)/templates/[id]/page.tsx에 템플릿 상세 페이지 구현 완료 (40줄 이상)
- [ ] 웹훅 핸들러가 서명 검증 + 중복 처리 완료
- [ ] 결제 취소 API가 소유자 검증 완료
- [ ] 템플릿 상세 페이지에서 구매/편집 버튼 조건부 표시
- [ ] TypeScript 타입 체크 통과

## Output
After completion, create `.planning/phases/05-payment-system/05-payment-system-03-SUMMARY.md`
