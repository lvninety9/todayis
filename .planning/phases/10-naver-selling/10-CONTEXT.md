# Phase 10: 네이버 판매 페이지 연동 - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Toss Payments에서 Naver Selling Page로 결제 시스템 변경 + 신규 웹사이트 페이지들 추가

**변경 사항:**
1. Phase 5 결제 시스템을 Toss Payments에서 네이버 판매 페이지로 변경
2. 템플릿 상세 페이지 "구매하기" 버튼 → 네이버 판매 페이지 리다이렉트
3. 신규 페이지: 랜딩 페이지, 상세 페이지, 회원관리, 주문제작 안내, 가격 안내

</domain>

<decisions>
## Implementation Decisions

### NP-01: 결제 연동 방식
- **D-01:** Naver Selling Page API 연동 — redirect 방식으로 네이버 판매 페이지로直接 이동
- 기존 Toss Payments 코드는 유지하되 결제 수단으로 네이버 우선 사용

### NP-02: 구매하기 버튼 동작
- **D-02:** 템플릿 상세 페이지에서 "구매하기" 클릭 시 네이버 판매 페이지로 redirect
- popup이 아닌 새 탭 또는 현재 탭에서 이동

### NP-03: 신규 페이지 구조
- **D-03:** (main) 그룹下에 새路由 추가:
  - `/landing` — 랜딩 페이지 (메인)
  - `/templates/detail/[id]` — 상세 페이지 (템플릿 소개)
  - `/member` — 회원관리 페이지
  - `/order-guide` — 주문제작 안내 페이지
  - `/pricing` — 가격 안내 페이지

### NP-04: 구매 완료 복귀 처리
- **D-04:** callback URL 방식 — 구매 완료 후 지정된 복귀 URL로 이동
- 복구 URL: `/templates/[id]?purchased=true`

</decisions>

<canonical_refs>
## Canonical References

### 기존 Payment 코드
- `src/lib/payment/toss.ts` — TossPaymentsClient (參考作爲 연동 패턴)
- `src/components/payment/EasyCheckout.tsx` — Easy Checkout 컴포넌트
- `src/hooks/use-payment.ts` — 결제 훅
- `src/types/payment.ts` — Payment 타입 정의

### 기존 페이지 구조
- `src/app/(main)/templates/[id]/page.tsx` — 템플릿 상세 페이지
- `src/app/(main)/page.tsx` — 메인 대시보드

### 데이터베이스
- `supabase-payment-setup.sql` — payments 테이블 스키마

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- TossPaymentsClient: `src/lib/payment/toss.ts` — API 클라이언트 패턴 참고
- Payment 타입: `src/types/payment.ts` — 타입 정의 재사용 가능
- usePayment hook: `src/hooks/use-payment.ts` — 훅 패턴 참고

### Established Patterns
- Next.js App Router: `(main)` 그룹下的路由 구조
- shadcn/ui: Button, Card 등의 컴포넌트 사용

### Integration Points
- `/templates/[id]` 페이지: 구매 버튼 위치
- payment API routes: `/api/payment/` 下

</code_context>

<specifics>
## Specific Ideas

- 네이버 판매 페이지 연동 가이드参照하여 redirect URL 구성
- 신규 페이지는 기존 디자인 시스템 (shadcn/ui + Tailwind CSS) 유지
- 모바일/데스크톱 모두 지원

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-naver-selling*
*Context gathered: 2026-04-25*