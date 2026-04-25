# Phase 8: Frontend Design Modernization - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Frontend 전체 개편 - UI 현대화, 텍스트 렌더링 효과, 템플릿 편집기 고급화, 애니메이션/모션 효과 통합

This phase delivers:
- shadcn/ui 기반 최신 UI 컴포넌트 redesign
- 텍스트 렌더링 효과 (Pretext는 제외 - 기존 DOM 사용)
- 템플릿 편집기 고급 기능 (animation, music, font styles)
- 트렌디한 애니메이션/모션 효과 통합
- Glassmorphism + Gradients 디자인 적용

</domain>

<decisions>
## Implementation Decisions

### UI-01: UI 라이브러리 선택
- **D-01:** shadcn/ui + Motion 기반으로 현대화
- Motion: animated cards, glassmorphism, entrance/hover/layout animations에 사용

### UI-02: 텍스트 렌더링 기술
- **D-02:** 기존 DOM 사용 (Pretext 제외)
-理由: 현재 프로젝트에 DOM reflow 문제가 없음
- 장점: 기존 코드 그대로, dependencies 불필요

### UI-03: 템플릿 편집기 고급 기능
- **D-03:**高级 편집 기능 추가
- animation:Entrance/ exit animations
- music: 배경 음악 업로드/선택
- font style: 커스텀 폰트, 크기, 색상, 배경색
- 글자 효과: 밑줄, 굵기, italic 등

### UI-04: 애니메이션/모션 효과
- **D-04:** Motion (formerly Framer Motion) 통합
- 적용: entrance animations, hover effects, layout transitions
-LazyMotion으로 필요한 페이지만 code-split

### UI-05: 디자인 트렌드
- **D-05:** Glassmorphism + Gradients 적용
- Glass cards: frosted glass effect
- Gradient backgrounds: modern color transitions
- Micro-interactions: button hovers, card flips

### Canonical Refs
- @chenglou/pretext — Future reference (현재 미적용)
- motion.dev — Animation library docs
- ui.shadcn.com — shadcn/ui docs
- tailwindcss.com — TailwindCSS docs

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Libraries
- `motion.dev` — Animation library (formerly Framer Motion)
- `ui.shadcn.com` — UI component library
- `tailwindcss.com` — Styling framework

### Design References
- `https://ui.shadcn.com/themes` — shadcn/ui themes
- `https://motion.dev/examples` — Animation examples
- `https://glassmorphism.com` — Glassmorphism design

### Codebase Context
- `src/components/ui/` — Existing shadcn/ui components
- `src/app/(main)/` — Main app pages
- `src/components/templates/` — Template components
- `src/lib/supabase/client.ts` — Supabase client

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Card.tsx` — Card component (redesign candidate)
- `src/components/ui/button.tsx` — Button with variants
- `src/components/templates/preview/TemplatePreview.tsx` — Template preview

### Established Patterns
- shadcn/ui + TailwindCSS (keep)
- TypeScript strict mode (keep)
- Component variants pattern (extend)

### Integration Points
- Template editor pages — add style fields
- Dashboard — add animations
- Login/signup — redesign with glassmorphism

</code_context>

<specifics>
## Specific Ideas

### 템플릿 편집기 확장
사용자가 요청한 기능:
- 애니메이션 효과 (entrance/exit)
- 배경 음악 업로드/선택
- 폰트 선택 (Google Fonts, 커스텀)
- 글자 크기, 색상, 밑줄, 배경색

### Glassmorphism 적용 페이지
- Login/signup: frosted glass card
- Dashboard: gradient background
- Template cards: glass effect

### Motion 적용
- Page entrance: stagger fade-in
- Card hover: scale + shadow
- Button click: spring animation

</specifics>

<deferred>
## Deferred Ideas

- Pretext 텍스트 렌더링 — future phase에서 재논의
- typeui 라이브러리 — 현재shadcn/ui 충분함

</deferred>

---

*Phase: 08-frontend-redesign*
*Context gathered: 2026-04-25*