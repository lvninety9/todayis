# Phase 14: 버그 수정 + 템플릿 UX 개선 - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 13 디자인 시스템 구축 후 발견된 UX 버그 수정 + 템플릿 UX 개선 + 디자인 퀄리티 대폭 향상.
2026년 최신 프론트엔드 트렌드와 웨딩 초대장 특화 디자인을 적용하여 "트렌디하고 인기 있는" 디자인으로 탈바꿈시킨다.
</domain>

<decisions>
## Implementation Decisions

### 로고 리다이렉트 (BUG-01)
- **D-01:** 로고 클릭 시 `/landing`으로 통일 (모든 사용자)
- **D-02:** Root page `/` → `/landing`으로 redirect 변경 (기존 `/login` → 제거)

### 템플릿 카드 클릭 동작 (UX-01)
- **D-03:** TemplateCard 클릭 시 미리보기 페이지(`/templates/[id]`)로 이동
- **D-04:** Edit/Delete 버튼은 별도로 표시 (카드 하단 버튼 영역)
- **D-05:** 미리보기 페이지에서 '이 템플릿으로 초대장 만들기' 버튼 제공
- **D-06:** Edit 버튼은 템플릿 관리자만 표시

### 디자인 시스템 적용 (UX-02)
- **D-07:** dashboard, login, TemplatePreview의 indigo/purple hard-coded 색상을 CSS variables로 교체
- **D-08:** globals.css에 정의된 `--primary` (terracotta), `--secondary` (sage), `--accent` (blush) 사용

### 템플릿 미리보기 빈 상태 (UX-03)
- **D-09:** fields가 비어있어도 빈 상태 안내 메시지/placeholder 표시

### 템플릿 필드 확장 (UX-04)
- **D-10:** Phase 15로 미루기 (별도 phase로 план 수립 필요)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 13 (완료)
- `.planning/phases/13-design-system/CONTEXT.md` — Warm palette, typography system, animation strategy
- `.planning/phases/13-design-system/PLAN.md` — Plan 01~05 상태 및 검증 기준

### 코드베이스
- `src/app/(main)/layout.tsx` — 로고 링크 위치 (line 39: href="/")
- `src/app/page.tsx` — root redirect (line 4: redirect("/login"))
- `src/app/(main)/landing/page.tsx` — landing page
- `src/components/templates/library/TemplateCard.tsx` — 카드 클릭/버튼 이벤트 (lines 52, 114-137)
- `src/components/templates/library/TemplateLibrary.tsx` — mode prop (line 34)
- `src/components/templates/preview/TemplatePreview.tsx` — indigo hard-coded (lines 72, 83, 94)
- `src/app/(main)/dashboard/page.tsx` — indigo hard-coded (lines 101, 115, 129, 147)
- `src/app/(auth)/login/page.tsx` — indigo hard-coded (lines 26, 36, 59)
- `src/components/templates/engine/TemplateEngine.tsx` — 빈 상태 처리 (lines 24-33)
- `src/components/templates/editor/TemplateEditor.tsx` — 편집기 컴포넌트

### Web Research (2026 Design Trends)
- Figma Web Design Trends 2026: https://www.figma.com/resource-library/web-design-trends/
- Midrocket UI Design Trends 2026: https://midrocket.com/en/guides/ui-design-trends-2026/
- FreeFrontend Micro-interactions: https://freefrontend.com/ui-micro-interaction/
- WebPerfClinic CSS Scroll-Driven Animations: https://webperfclinic.com/article/css-scroll-driven-animations-performance-guide
- DevToolbox View Transitions: https://devtoolbox.dedyn.io/blog/css-view-transitions-complete-guide
- shadcn.io Bento Grid Blocks: https://www.shadcn.io/blocks/hero-bento-grid
- Zola Wedding Trends 2026: https://www.zola.com/expert-advice/the-first-look-report-2026
- Invitatis Digital Wedding Trends 2026: https://invitatis.com/en/blog/weddings/digital-wedding-invitation-trends-2026/
- Quiet Luxury Web Design: https://dmletterstudio.com/quiet-luxury-branding-in-2026/
- Medium CSS Micro-Animations 2026: https://medium.com/@alexdev82/css-micro-animations-in-2026
</canonical_refs>

<research>
## 2026 Design Trends Research ( Synthesized)

### Frontend/Web Design Trends 2026

**1. Bento Grid Layout** (가장 중요)
- Apple product pages에서 시작, 2026년 SaaS landing page의 67%가 사용
- asymmetric card groups with varied sizes
- dashboard, landing page, feature showcase에 최적
- shadcn.io에서 React/Next.js용 bento grid block 제공

**2. Subtle Glassmorphism (Liquid Glass)**
- 2019-2020년 heavy blur → 2026년은 subtle translucent layers
- overlays, modals, navigation bars에만 전략적으로 사용
- dark interface에서 특히 효과적
- heavy blur 제거, depth without visual noise

**3. CSS Scroll-Driven Animations** (신규, Zero JS)
- `animation-timeline: scroll()` / `animation-timeline: view()`
- Chrome 115+, Safari 18+, Firefox 133+ 지원
- IntersectionObserver 없이 scroll-triggered reveals
- performance-first: compositor thread에서 실행, INP 영향 없음
- progressive enhancement: 미지원 브라우저에서 graceful degradation

**4. CSS View Transitions API** (신규)
- `document.startViewTransition()` — SPA에서 smooth page transitions
- `@view-transition { navigation: auto }` — MPA에서 full-page transitions
- Chrome 126+, Safari 18.2+, Firefox 지원 예정
- GPU-accelerated, zero bundle size
- `view-transition-name`으로 개별 요소 애니메이션 가능

**5. Micro-interactions (Purposeful Motion)**
- button state changes, loading indicators, entrance animations
- `@starting-style` — entry animations without JS timeouts
- `:has()` pseudo-class — hover-triggered staggered sequences
- spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- motion tokens: duration (fast: 150ms, normal: 250ms, slow: 400ms)

**6. Expressive Typography**
- kinetic typography — text animates, morphs, responds to interaction
- hero sections, editorial experiences에서 사용
- oversized serif (제목) + geometric sans (본문) 페어링
- letter-by-letter reveals, text stretching

**7. Warm, Vibrant Color Palette**
- 2026년: Y2K nostalgia, "dopamine design", bright saturated palettes
- 하지만 wedding 플랫폼에서는 quiet luxury + warm neutrals 접근
- terracotta, sage, blush (Phase 13決定값)依然是 2026 트렌드와 일치
- neon gradients 보다는 warm, earthy, breathing gradients

**8. Quiet Luxury / Editorial Minimalism**
- clean, calm, refined — premium feel but practical
- warm neutrals + texture (paper grain, linen feel)
- strong typography hierarchy
- generous whitespace
- fewer sections, more breathing room
- Every element earns its place

### Wedding Invitation Design Trends 2026

**공식 레퍼런스 (Zola, TheKnot, Invitatis 분석):**

1. **Color Palettes**
   - soft, grounded, quietly romantic
   - sage, terracotta, beige, cream + copper accents
   - muted jewel tones ( brides accepting bold )
   - High contrast for outdoor reading

2. **Typography**
   - Serif (editorial headlines) + Geometric Sans (body)
   - typography-forward layouts — font becomes design element
   - generous whitespace, editorial composition

3. **Layout / UX**
   - Mobile-first scrolling experience
   - Scrollytelling (scroll-triggered reveals)
   - Single-page with sections: Cover Photo → Story → Date/Time → Location → RSVP
   - Progress indicators (scroll position)
   - gallery (4-6 compressed photos)

4. **Motion**
   - Subtle entrance animations on buttons/headlines
   - Soft hover effects on links
   - progress markers for multi-section invitations
   - NO heavy video backgrounds, prioritize micro-interactions

5. **Texture & Depth**
   - Layered designs with vellum wraps, envelope-inspired elements
   - Hand-drawn illustrations (venue maps, botanicals)
   - Custom venue paintings for keepsake quality

6. **Information Architecture**
   - Digital invitations: complete one-link experience
   - key info + map + reminders + RSVP in one page
   - 계좌번호, dress code 등 supplementary 정보
   - Fast loading: WebP images, compressed galleries

### CSS Animation Techniques 2026

**Pure CSS Micro-Animations (No JS):**
1. `@starting-style` — entry animations without JS timeouts
2. `:has()` pseudo-class — hover-triggered staggered sequences
3. `animation-delay` stagger — list item reveals
4. `animation-timeline: view()` — scroll-triggered reveals (no IntersectionObserver)
5. `animation-timeline: scroll()` — scroll position-linked effects
6. View Transitions API — native page transitions
7. Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`

**Recommended Animation Stack:**
- CSS native: scroll-driven animations, view transitions, micro-interactions
- No new libraries needed (tailwindcss-animate already installed)
- motion/react optional for entrance animations (Framer-style)

### shadcn.io / SaaS Design Patterns

**Bento Grid Block Structure:**
- Asymmetric grid: `lg:col-span-2` (hero) + `lg:col-span-1` (supporting)
- Varied col-span + row-span for visual hierarchy
- Interactive hover effects per card
- Responsive collapse to single column on mobile
- Dark mode compatibility built-in

**Hero Block Patterns:**
- Headline tile (2-col span) + stat tile + avatar proof tile + sparkline chart tile
- Announcement pill (badge)
- Dual CTA buttons
- NumberFlow for animated metrics
- motion/react staggered entrance animations

</research>

<code_context>
## Existing Code Insights

### Reusable Assets
- `globals.css` — `--primary`, `--secondary`, `--accent`, `--background` CSS variables (Phase 13)
- `src/components/ui/card.tsx` — `Card`, `GlassCard` 컴포넌트 (subtle glassmorphism 적용 가능)
- `src/components/ui/button.tsx` — `buttonVariants` (gradient variant ��재)
- `src/components/ui/badge.tsx` — terracotta/sage/blush variants (Plan 03 완료)
- `src/components/ui/input.tsx` — terracotta focus ring (Plan 03 완료)
- `tailwind.config.js` — keyframes: fade-in, slide-up, scale-in (tailwindcss-animate)
- `src/hooks/use-session.ts` — 인증 상태 관리

### Established Patterns
- Button variants: default, destructive, outline, secondary, ghost, link, gradient, gradient-glow
- Font system: Noto Serif KR (headings), Noto Sans KR (body), Playfair Display (English), Inter (sans)
- Animation timing: 150ms (fast), 250ms (normal), 400ms (slow)

### Integration Points
- 로고: `(main)/layout.tsx:39` → href 변경
- Root redirect: `app/page.tsx:4` → redirect target 변경
- TemplateCard: 클릭 → router.push(`/templates/${template.id}`)
- TemplatePreview: indigo-600 → hsl(var(--primary)) 교체
- dashboard: indigo gradient → CSS variables 교체
- Landing page: bento grid pattern 도입 가능
</code_context>

<specifics>
## Design Direction (Phase 14)

**핵심 방향성: "Editorial Quiet Luxury Wedding"**

Phase 13에서 결정한 warm palette (terracotta/sage/blush)을 기반으로 2026 ��렌드를 적용.

### 적용할 트렌드 (优先级순)

1. **Bento Grid Layout** — dashboard stat cards, feature sections, landing page
2. **CSS Scroll-Driven Animations** — scroll-triggered reveals (zero JS)
3. **Subtle Glassmorphism** — nav overlays, modals만 (모든 카드 glass 제거)
4. **Micro-interactions** — button hover, card hover, form feedback
5. **Expressive Typography** — kinetic headings on scroll
6. **View Transitions** — page navigation smooth transitions

### 적용하지 않을 것 (Phase 14 범위 아님)
- 3D elements (WebGL)
- Heavy animations
- Bold/maximalist palettes (wedding 플랫폼에 부적합)
- Complex GSAP choreography

### Phase 13 CONTEXT.md의 기존 결정 유지
- Warm palette: terracotta (#E07A5F), sage (#81B29A), blush (#F4A0B5)
- 타이포그래피: Noto Serif KR + Noto Sans KR + Inter
- 애니메이션: CSS transitions only (tailwindcss-animate)
- Tailwind v3 유지
- Solid cards + subtle glass (hero/landing에만)

### 적용 우선순위
1. Bug fixes (로고, 템플릿 미리보기)
2. Warm palette 실제 적용 (hard-coded indigo 제거)
3. Bento grid로 dashboard redesign
4. Scroll-driven animations
5. Micro-interactions refinement
</specifics>

<deferred>
## Deferred Ideas

### 템플릿 필드 타입 확장
- Phase 15: account (계좌번호), audio (배경음악), video, gallery, message (축의도)
- 현재 field types: text, date, image, location (4개)

### 전체 디자인 리뉴얼 (대규모)
- Phase 15+: Landing page 전체 bento grid redesign
- Phase 15+: InvitationViewer에 scrollytelling, scroll-driven animations 적용
- Phase 15+: View Transitions page navigation
- Phase 15+: Quiet luxury editorial typography refinements

### Edit 미리보기 완전한 UX
- Phase 15+: TemplateEngine 빈 상태 완전한 placeholder
- Phase 15+: motion/react로 entrance animations
</deferred>