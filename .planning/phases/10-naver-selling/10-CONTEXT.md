# Phase 10: 네이버 판매 페이지 연동 + 버그 수정 + UI 개선 - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

 Toss Payments에서 Naver Selling Page로 결제 시스템 변경 + 신규 웹사이트 페이지들 추가 + 버그 수정 + UI 개선

**변경 사항:**
1. Phase 5 결제 시스템을 Toss Payments에서 네이버 판매 페이지로 변경
2. 템플릿 상세 페이지 "구매하기" 버튼 → 네이버 판매 페이지 리다이렉트
3. 신규 페이지: 랜딩 페이지, 상세 페이지, 회원관리, 주문제작 안내, 가격 안내
4. **버그 수정**: next/image hostname, 뒤로가기 버튼 에러
5. **UI 개선**: 로그인 페이지 가독성, 버튼 스타일 현대화
6. **편집기 재설계**: 자유 배치, 직관적 UI, 섹션별 음악/애니메이션/폰트

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

### BUG-01: next/image hostname 에러
- **D-05:** `next.config.js`에 `images.pexels.com` hostname 추가
- 기존: `jiesomglvobttxujsakz.supabase.co`, `*.supabase.co`
- 추가: `images.pexels.com`

### BUG-02: 뒤로가기 버튼 에러
- **D-06:** 템플릿 페이지 뒤로가기 버튼 클릭 시 에러 해결
- `useRouter` 또는 `Link` 컴포넌트로 적절히 처리

### UI-01: 로그인 페이지 가독성
- **D-07:** "또는 소셜 계정으로 로그인" 텍스트 배경 수정
- 현재: 흰색 배경 (어두운 테마에서 가독성 문제)
- 수정: 투명 또는 어두운 배경으로 변경

### UI-02: 버튼 스타일 현대화
- **D-08:** 취소, 삭제, 저장하기, 데스크탑, 모바일, 편집 모드 버튼 스타일 개선
- 현재: 구식 느낌
- 목표: 모던한 디자인 (rounded, shadow, hover effects)
- shadcn/ui Button 컴포넌트 기준으로 재설계

### EDITOR-01: 편집기 유연성 개선
- **D-09:** 템플릿 편집기自由度 향상
- 섹션별 위치 이동 (드래그 앤 드롭)
- 음악, 애니메이션 효과, 폰트 각 섹션별로 설정 가능
- 직관적인 UI (패널-based rather than form-based)

### EDITOR-02: 편집기 UX 개선
- **D-10:** 편집 모드 intuitiveness 향상
- 실시간 미리보기 강화
- 도구 모음 단순화
- 모바일/데스크톱 프리뷰 통합

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
- `src/app/(auth)/login/page.tsx` — 로그인 페이지

### 编辑器 관련
- `src/components/templates/editor/TemplateEditor.tsx` — 현재 편집기
- `src/components/templates/editor/FieldEditor.tsx` — 필드 편집기
- `src/components/templates/editor/StyleEditor.tsx` — 스타일 편집기

### 설정 파일
- `next.config.js` — next/image hostname 설정

### 데이터베이스
- `supabase-payment-setup.sql` — payments 테이블 스키마

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- TossPaymentsClient: `src/lib/payment/toss.ts` — API 클라이언트 패턴 참고
- Payment 타입: `src/types/payment.ts` — 타입 정의 재사용 가능
- usePayment hook: `src/hooks/use-payment.ts` — 훅 패턴 참고
- shadcn/ui Button: `src/components/ui/button.tsx` — 버튼 컴포넌트

### Established Patterns
- Next.js App Router: `(main)` 그룹下的路由 구조
- shadcn/ui: Button, Card 등의 컴포넌트 사용

### Integration Points
- `/templates/[id]` 페이지: 구매 버튼 위치
- payment API routes: `/api/payment/` 下
- 편집기: `src/components/templates/editor/`

</code_context>

<specifics>
## Specific Ideas

- 네이버 판매 페이지 연동 가이드参照하여 redirect URL 구성
- 신규 페이지는 기존 디자인 시스템 (shadcn/ui + Tailwind CSS) 유지
- 모바일/데스크톱 모두 지원
- 편집기: React DnD 또는 @dnd-kit untuk 드래그 앤 드롭
- 버튼 스타일: modern button variants (ghost, outline, secondary 등)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-naver-selling*
*Context gathered: 2026-04-25*
*Auto-updated with bug fixes, UI improvements, and editor redesign*