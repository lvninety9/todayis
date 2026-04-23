# Phase 5 CONTEXT.md — 결제 시스템

**Phase**: 05-payment-system
**Status**: Ready to execute
**Created**: 2026-04-23

---

## Locked Decisions

### 1. 결제 데이터 모델

- **테이블**: `payments`
- **필드**: `id`, `user_id`, `template_id`, `amount`, `status`, `payment_key`(Toss PaymentKey, unique), `created_at`
- **관계**: 1 템플릿당 1 구매 (장바구니 방식 없음)
- **상태 enum**: `PENDING`, `DONE`, `CANCELED`, `EXPIRED`

### 2. Toss Payments API 모드

- **모드**: Easy Checkout (토스 결제창)
- **SDK**: `@tosspayments/payment-sdk` (클라이언트)
- **서버**: `@tosspayments/payment` SDK 대신 직접 fetch HTTP 요청 사용 (Edge Runtime 호환성, 의존성 최소화)
- **클라이언트**: `@tosspayments/payment-sdk` — `loadPaymentSDK`로 Easy Checkout 위젯 로드

### 3. 템플릿 가격 정책

- **확장**: `templates` 테이블에 `price`(integer, 원화), `is_premium`(boolean) 컬럼 추가
- **MVP 기본 가격**: ₩9,900
- **무료 템플릿**: `is_premium = false` 또는 `price = 0`

### 4. 웹훅 보안 및 처리

- **엔드포인트**: `POST /api/payment/webhook`
- **검증**: Toss 웹훅 시그니처 검증 (SHA-256 HMAC)
- **처리**: `paymentKey`로 Toss API에 결제 상세 조회 → `status` 확인 → payments 테이블 업데이트
- **중복 처리**: `payment_key`에 UNIQUE 인덱스, INSERT ... ON CONFLICT IGNORE
- **허용 상태**: `DONE`만 구매 처리, `CANCELED`/`EXPIRED`은 취소 처리

### 5. 환불 처리

- **API**: `POST /api/payment/[paymentId]/cancel` 구현
- **UI**: MVP에서는 비활성화 (관리자 페이지에 버튼만 있거나 완전히 숨김)
- **상태**: `CANCELED`로 업데이트

### 6. 결제 UI/UX 흐름

- **흐름**: 템플릿 상세 페이지 → "구매하기" 버튼 → Toss Easy Checkout 모달 → 결제 완료 후 `/templates` 리다이렉트
- **구매 확인**: `/templates` 목록에서 `purchased` 템플릿은 "편집하기" 버튼 표시
- **구매 상태 추적**: `payments` 테이블에서 `user_id + template_id`로 조회
- **클라이언트 SDK**: `@tosspayments/payment-sdk` — `loadPaymentSDK`로 Easy Checkout 위젯 로드

---

## Existing Context (from prior phases)

- **Auth**: Supabase Auth 사용, JWT 기반 인증 (`getUserFromRequest` 헬퍼 패턴)
- **DB**: Supabase PostgreSQL, RLS 활성화됨
- **Storage**: Supabase Storage (버킷 생성: `node setup-storage-bucket.js`, RLS 정책: `supabase-profile-storage.sql`을 Supabase SQL 에디터에서 실행 — `extension` 컬럼 대신 `split_part(name, '.', -1)` 사용, INSERT 정책에는 `WITH CHECK`만 사용)
- **Framework**: Next.js 14 App Router
- **유틸리티**: zod 이미 의존성 있음 (API 검증에 활용)
- **프로젝트 구조**: `src/app/api/`, `src/app/(main)/templates/` 등 기존 패턴 준수

---

## Implementation Notes

### API Routes 구조
```
src/app/api/payment/
  ├── request/route.ts      # 결제 요청 (client_key + amount + orderId)
  ├── webhook/route.ts      # Toss 웹훅 핸들러
  └── [paymentId]/cancel/route.ts  # 환불 API
```

### 클라이언트 컴포넌트
```
src/components/payment/
  └── EasyCheckout.tsx      # Toss Easy Checkout 위젯 컴포넌트
```

### DB Migration
- `payments` 테이블 생성 SQL
- `templates` 테이블에 `price`, `is_premium` 컬럼 추가
- `payments.payment_key` UNIQUE 인덱스

### 환경 변수
```
TOSS_PAYMENTS_SECRET_KEY=your-secret-key
TOSS_PAYMENTS_CLIENT_KEY=your-client-key
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-client-key
```

### 보안 고려사항
- `TOSS_PAYMENTS_SECRET_KEY`은 서버 사이드에서만 사용 (`.env`에만, `.env.example`에는 키만)
- 웹훅 서명 검증 필수 (서버 SDK 사용 시 자동)
- RLS 정책: 사용자는 자신의 payment 기록만 조회 가능

---

## Known Issues / Notes

### Storage RLS Policy Conflict (Resolved)
- Supabase Dashboard UI에서 수동 생성된 정책이 SQL로 생성된 정책을 덮어쓸 수 있음
- Dashboard UI의 기존 정책이 `extension` 컬럼을 참조하고 있었으나, Supabase Storage는 `extension` 컬럼을 제공하지 않음
- 해결: Dashboard UI에서 모든 정책 삭제 후 `supabase-profile-storage.sql`의 정책으로 재적용
- 참고: `.planning/STORAGE.md`의 수동 정책 생성 가이드 참조

### Dashboard UI Policy Warning
- Supabase Dashboard > Storage > Policies에서 "This policy will not work as expected" 경고가 표시될 수 있음
- 이는 Dashboard UI의 정책 검증 로직이 Supabase Storage의 실제 스키마를 반영하지 못해 발생하는 가짜 경고
- SQL 에디터에서 실행 시 에러가 없으면 정책은 정상 작동함
