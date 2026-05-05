# Phase 16: UI/UX 전면 리디자인 - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

전체 페이지의 UI/UX 전면 리디자인. 2026 최신 디자인 트렌드를 적용하여 일관된 디자인 시스템 구축, 접근성 개선, 모바일 최적화.

**범위:** 12개 UI 요구사항 (UI-01 ~ UI-12)
**포함:** Landing, Dashboard, Template Library, Template Detail, Editor, Auth, Public Invitation, Navigation, Settings/Admin, Design System, Micro-interactions, Accessibility
**제외:**新功能 추가 (배경 음악, 이모지 등) — 이는 별도 V2 페이즈에서 처리
</domain>

<decisions>
## Implementation Decisions

### Design Direction
- 2026 웨딩 디자인 트렌드: Editorial Minimalism, Quiet Luxury, Warm Romance
- 기존 warm palette (terracotta #E07A5F, sage #81B29A, blush #F4A0B5) 유지 및 확장
- Glassmorphism 2.0 — 기존 glassmorphism을 더 세련된 방식으로 재해석
- Bento Grid 레이아웃 — 대시보드 및 랜딩 페이지에 적용 (이미 Phase 14에서 일부 구현됨)
- CSS Scroll-Driven Animations — 이미 globals.css에 적용됨 (Phase 14)

### Current UI State (Baseline)
- **Landing**: 기본 hero + features + CTA 구조. Bento grid 일부 적용됨.
- **Dashboard**: Bento grid stats, quick actions, recent templates. 데이터 시각화 부족.
- **Template Library**: Card grid with filtering. 미리보기/토글 기능 부족.
- **Editor**: Split-view preview. 드래그 앤 드롭 미구현.
- **Auth Pages**: Glassmorphism 적용됨. 소셜 로그인 가독성 개선 필요.
- **Public Invitation**: Wedding romantic design. 애니메이션 개선 필요.
- **Navigation**: Glassmorphism + mobile bottom tab. breadcrumbs 없음.
- **Settings/Admin**: 기본 테이블 UI. 데이터 표현 개선 필요.

### Design System
- CSS variables: --primary, --terracotta-light, --accent, --blush-light, --secondary, --sage-light
- Typography: Noto Serif KR + Playfair Display (Google Fonts)
- Animation: CSS scroll-driven animations (animation-timeline: view())
- Dark mode: hsl() 기반 dark variant 적용 중이나 완성도 부족

### Technical Constraints
- Next.js 14 App Router 사용 중
- Tailwind CSS v4 사용
- shadcn/ui 컴포넌트 재사용 가능
- Supabase Storage (MVP), AWS S3 (V2+)
- 반응형 디자인 필수 (mobile-first)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `src/app/globals.css` — CSS variables, design tokens, animations
- `src/components/ui/` — shadcn/ui 컴포넌트 (Button, Card, Input 등 15개)
- `src/app/(main)/layout.tsx` — 글로벌 레이아웃, 네비게이션, 푸터

### Pages (Source of Truth)
- `src/app/(main)/landing/page.tsx` — 랜딩 페이지
- `src/app/(main)/dashboard/page.tsx` — 대시보드
- `src/app/(main)/templates/page.tsx` — 템플릿 라이브러리
- `src/app/(main)/templates/[id]/page.tsx` — 템플릿 상세
- `src/app/(main)/templates/[id]/edit/page.tsx` — 편집기
- `src/app/(auth)/login/page.tsx` — 로그인
- `src/app/(auth)/signup/page.tsx` — 회원가입
- `src/app/(main)/[username]/page.tsx` — 공개 초대장
- `src/app/(main)/settings/page.tsx` — 설정
- `src/app/(main)/admin/page.tsx` — 관리자

### Types & Hooks
- `src/types/template.ts` — 템플릿 타입 정의
- `src/hooks/use-session.ts` — 세션 훅
</canonical_refs>

<specifics>
## Specific Ideas

### Landing Page
- Hero 섹션: Larger typography, gradient text, animated background shapes
- Social proof: "XX명의 신부가 사용", 별점 리뷰 섹션 추가
- 스토리텔링: "3단계로 완성" 프로세스 시각화
- CTA: Multiple CTAs throughout page (not just bottom)

### Dashboard
- 데이터 시각화: Chart.js 또는 Recharts로 통계 시각화
- 액션 중심: 자주 사용하는 액상을 상단에 배치
- Recent templates: Thumbnail preview + quick actions (edit, share, publish)

### Template Library
- 그리드/리스트 토글: 사용자 선호도 반영
- 필터/정렬: 카테고리, 가격, 인기순, 최신순
- 미리보기: Hover 시 preview modal 또는 slide-in

### Editor
- 드래그 앤 드롭: @dnd-kit/core 또는 react-beautiful-dnd
- 툴바 재설계: Floating toolbar, context-aware tools
- 반응형: 모바일에서도 편집 가능한 레이아웃

### Design System
- CSS variables 확장: --surface, --border, --shadow, --radius tokens
- Dark mode: 모든 컴포넌트에 dark variant 적용
- Token 시스템: design-tokens.json 또는 Tailwind config에서 관리

### Accessibility
- Contrast ratio: WCAG AA 기준 준수 (4.5:1 minimum)
- Keyboard navigation: Tab order, focus indicators
- ARIA labels: 모든 인터랙티브 요소에 label 추가
</specifics>

<deferred>
## Deferred Ideas

- 배경 음악 기능 — Phase 12 (V2)에서 별도 처리
- 이모지/GIF 지원 — Phase 15 (V2)에서 별도 처리
- 동영상 초대장 — V3에서 처리
- Kakao 로그인 — V3에서 처리
- AI 추천 템플릿 — V3에서 처리
</deferred>

---

*Phase: 16-ui-redesign*
*Context gathered: 2026-04-27*
