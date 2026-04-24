# Phase 10: UI/UX 전면 개편 + 네이버 연동 - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

**전체적인 디자인 Redesign + 네이버 판매 페이지 연동 + 신규 페이지**

사용자의 핵심 피드백: "프로젝트 전체적인 디자인이 너무 구립니다"

### 수정할 범위 (전체)
1. 로그인/회원가입 페이지
2. 대시보드 페이지  
3. 템플릿 라이브러리 페이지
4. 템플릿 상세 페이지
5. 템플릿 편집기 (완전히 재설계)
6. 공개 초대장 페이지
7. 네비게이션/헤더/푸터
8. 버튼, 입력폼, 카드 등 모든 UI 컴포넌트

### 기존 범위 (유지)
- Naver Selling Page 연동
- 신규 페이지 (/landing, /templates/detail, /member, /order-guide, /pricing)
- 버그 수정 (next/image hostname, 뒤로가기 버튼)

</domain>

<decisions>
## Implementation Decisions

### DESIGN-01: 2026 트렌드 디자인 시스템
- **D-01:** Glassmorphism 2.0 (Liquid Glass 스타일) 적용
- **D-02:** Modern gradient backgrounds — 부드러운 그라데이션 배경
- **D-03:** 모던 버튼 스타일 — gradient + glow + animation

### DESIGN-02: 애니메이션/전환
- **D-04:** @formkit/auto-animate 로 부드러운 전환 효과 적용
- 모든 리스트, 카드, 모달, 패널에 적용

### DESIGN-03: 로그인/회원가입 페이지
- **D-05:** 소셜 로그인 텍스트 가독성 개선 — 투명 또는 어두운 배경
- **D-06:** Glassmorphism 카드 적용
- **D-07:** gradient 버튼 + hover glow 효과

### DESIGN-04: 대시보드 페이지
- **D-08:** 구조/짜임새 개선 — 카드 그리드, 통계 대시보드
- **D-09:** modern card 스타일 + subtle animation
- **D-10:** 빠른 작업 버튼에 gradient + glow

### DESIGN-05: 템플릿 라이브러리 페이지
- **D-11:** 템플릿 카드 modern design — rounded corners, shadow, hover lift
- **D-12:** 필터/정렬 UI 개선 — glassmorphism 패널

### DESIGN-06: 템플릿 상세 페이지
- **D-13:** 템플릿 미리보기 — 큰 프리뷰 + smooth zoom
- **D-14:** 구매 버튼 — gradient + glow + pulse animation
- **D-15:** 정보 레이아웃 — 섹션별 glassmorphism 카드

### DESIGN-07: 템플릿 편집기 (완전히 재설계)
- **D-16:** 직관적인 드래그 앤 드롭 — 섹션 위치 자유 배치
- **D-17:** 실시간 미리보기 강화 — split view 또는 toggle
- **D-18:** 섹션별 설정 패널 — 음악, 애니메이션, 폰트 개별 설정
- **D-19:** 도구 모음 단순화 — 필요할 때만 표시
- **D-20:** 모바일/데스크톱 프리뷰 통합 — 한 화면에서 전환

### DESIGN-08: 공개 초대장 페이지
- **D-21:** wedding特有的 romantic design — soft gradients, elegant fonts
- **D-22:** 모바일 최적화 — 터치 인터랙션
- **D-23:** 공유按钮 — modern floating action button

### DESIGN-09: 네비게이션/헤더/푸터
- **D-24:** 헤더 — glassmorphism + sticky
- **D-25:** 모바일 네비게이션 — bottom tab bar
- **D-26:** 푸터 — minimal with gradient accent

### DESIGN-10: UI 컴포넌트 공통
- **D-27:** 버튼 — gradient background, glow on hover, subtle scale animation
- **D-28:** 입력폼 — glassmorphism 배경, focus glow
- **D-29:** 카드 — rounded-xl, subtle shadow, hover lift animation
- **D-30:** 모달/다이얼로그 — glassmorphism + backdrop blur

### PAYMENT-01: 네이버 판매 페이지 연동
- **D-31:** Naver Selling Page redirect 방식으로 연동
- **D-32:** 템플릿 상세 페이지 구매 버튼 → 네이버로 redirect

### PAGES-01: 신규 페이지
- **D-33:** /landing — 메인 랜딩 페이지 (modern gradient + glassmorphism)
- **D-34:** /templates/detail/[id] — 템플릿 상세 소개 페이지
- **D-35:** /member — 회원관리 페이지
- **D-36:** /order-guide — 주문제작 안내 페이지
- **D-37:** /pricing — 가격 안내 페이지

### BUG-01: 버그 수정
- **D-38:** next.config.js — images.pexels.com hostname 추가
- **D-39:** 템플릿 페이지 뒤로가기 버튼 에러 해결

</decisions>

<canonical_refs>
## Canonical References

### 디자인 시스템
- shadcn/ui 컴포넌트: `src/components/ui/` — Button, Card, Input, Dialog 등
- Tailwind CSS: `tailwind.config.js` — 커스텀 그라데이션, 애니메이션

### 페이지
- `src/app/(auth)/login/page.tsx` — 로그인 페이지
- `src/app/(auth)/signup/page.tsx` — 회원가입 페이지
- `src/app/(main)/page.tsx` — 대시보드 (메인)
- `src/app/(main)/templates/page.tsx` — 템플릿 라이브러리
- `src/app/(main)/templates/[id]/page.tsx` — 템플릿 상세
- `src/app/(main)/templates/[id]/edit/page.tsx` — 편집기
- `src/app/(main)/[username]/page.tsx` — 공개 초대장

### 컴포넌트
- `src/components/templates/editor/TemplateEditor.tsx` — 편집기
- `src/components/templates/editor/FieldEditor.tsx` — 필드 편집기
- `src/components/templates/editor/StyleEditor.tsx` — 스타일 편집기
- `src/components/templates/library/TemplateLibrary.tsx` — 템플릿 라이브러리
- `src/components/templates/library/TemplateCard.tsx` — 템플릿 카드
- `src/components/ui/button.tsx` — 버튼 컴포넌트
- `src/components/ui/card.tsx` — 카드 컴포넌트
- `src/components/ui/input.tsx` — 입력폼 컴포넌트
- `src/components/publish/InvitationViewer.tsx` — 초대장 뷰어

### 라이브러리
- @formkit/auto-animate — 부드러운 전환 효과
- @dnd-kit/core 或 react-beautiful-dnd — 드래그 앤 드롭 (편집기)
- next.config.js — 이미지 hostname 설정

### 결제
- `src/lib/payment/toss.ts` — TossPaymentsClient (참고 패턴)
- `src/components/payment/EasyCheckout.tsx` — 결제 컴포넌트

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- shadcn/ui Button: `src/components/ui/button.tsx` — 버튼 컴포넌트 재사용
- shadcn/ui Card: `src/components/ui/card.tsx` — 카드 컴포넌트 재사용  
- shadcn/ui Input: `src/components/ui/input.tsx` — 입력폼 재사용
- GlassCard 컴포넌트: `src/components/ui/card.tsx` — 기존 glassmorphism 지원

### Established Patterns
- Next.js App Router: `(main)`, `(auth)` 그룹路由 구조
- Tailwind CSS: utility-first 스타일링
- CSS Variables: dark mode 지원 위한 색상 변수

### Integration Points
- `/templates/[id]` 페이지: 구매 버튼 위치
- 编辑器: `src/components/templates/editor/` — 드래그 앤 드롭 통합
- 네비게이션: 레이아웃 공통 컴포넌트

</code_context>

<specifics>
## Specific Ideas

### 2026 트렌드 적용 상세
1. **Glassmorphism 2.0 (Liquid Glass)**
   - backdrop-filter: blur(20px)
   - Semi-transparent backgrounds with subtle white overlay
   - Soft shadows and borders

2. **Modern Gradient Backgrounds**
   - Primary: gradient-to-br from-indigo-50 via-white to-purple-50
   - Dark mode: gradient-to-br from-indigo-950 via-background to-purple-950

3. **모던 버튼**
   - background: linear-gradient with brand colors
   - box-shadow: 0 0 20px rgba(primary, 0.4) on hover
   - transform: scale(1.02) on hover
   - transition: all 0.2s ease

4. **@formkit/auto-animate**
   - 리스트 아이템 추가/제거 시 부드러운 애니메이션
   - 카드 그리드 리플로우 효과
   - 모달/패널 열기/닫기 효과

5. **편집기 드래그 앤 드롭**
   - @dnd-kit/core 사용 (轻盈, 접근성良好)
   - 섹션 드래그로 위치 이동
   - 드롭 zones 시각적 피드백

</specifics>

<deferred>
## Deferred Ideas

### Phase 11 이상으로 연기
- 동영상 초대장 — 별도 Phase
- Kakao 로그인 — 별도 Phase
- Naver Pay 연동 — 별도 Phase (현재: 네이버 판매 페이지 redirect)
- AI 추천 템플릿 — 별도 Phase
- 커스텀 폰트 업로드 — 별도 Phase
- 회원 목록 페이지네이션 — 별도 Phase

</deferred>

---

*Phase: 10-ui-ux-redesign*
*Context gathered: 2026-04-25*
*Full redesign with 2026 trends: Glassmorphism 2.0, modern gradients, drag-drop editor*