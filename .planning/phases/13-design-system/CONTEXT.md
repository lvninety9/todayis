# Phase 13: 디자인 시스템 구축 - CONTEXT.md

## 논의 요약

Phase 13은 웹 페이지 전체 디자인을 최신 웨딩 트렌드에 맞게 리디자인하는 것입니다.
Playwright를 통해 Zola.com과 TheKnot.com의 실제 디자인 패턴을 분석했습니다.

---

## 1. 현재 디자인 문제점

### 1.1 색상 시스템
- **현재**: indigo/purple/pink gradient (게이미нг/테크 느낌)
- **문제**: 웨딩 초대장 플랫폼에 어울리지 않는 차가운 색상
- **분석 결과**: Zola와 TheKnot 모두 warm palette 사용
  - Zola: dark navy (#183B54), teal (#005759), coral (#C7305B)
  - TheKnot: warm pink (#FF44CB), peach (#FF9357), soft blue (#A1CDF5)

### 1.2 타이포그래피
- **현재**: system fonts + 일부 serif (제목만)
- **문제**: 폰트 페어링이 일관되지 않음
- **분석 결과**: 경쟁사 모두 serif + sans-serif 페어링 사용
  - Zola: `new-spirit` (serif) + `circular` (sans)
  - TheKnot: `ods-font-primary` (serif) + `ods-font-secondary` (sans)

### 1.3 레이아웃
- **현재**: 모든 페이지에 동일한 indigo→purple gradient 배경
- **문제**: 페이지별 정체성 부족, 웨딩 느낌 부재
- **분석 결과**: Zola/TheKnot 모두 clean white background + accent sections

### 1.4 컴포넌트
- **현재**: shadcn/ui 기본 + GlassCard (backdrop-blur)
- **문제**: glassmorphism이 과도하게 사용됨 (모든 카드에 적용)
- **분석 결과**: 경쟁사는 subtle glass effect만 사용, 주로 clean solid cards

---

## 2. 디자인 방향성 결정

### 2.1 컬러 팔레트 (Warm Wedding Palette)

**Primary**: Terracotta / Rose Gold
- `primary`: `hsl(12, 75%, 55%)` — terracotta (#E07A5F)
- `primary-foreground`: `hsl(12, 75%, 95%)` — warm white

**Secondary**: Sage Green
- `secondary`: `hsl(160, 35%, 45%)` — sage (#81B29A)
- `secondary-foreground`: `hsl(160, 35%, 95%)`

**Accent**: Blush Pink
- `accent`: `hsl(350, 70%, 60%)` — blush (#F4A0B5)

**Neutrals**: Warm grays
- `background`: `hsl(30, 20%, 98%)` — off-white (#F9F6F3)
- `foreground`: `hsl(30, 10%, 15%)` — warm dark (#2D2A26)

**Dark mode**: Deep warm tones
- `background`: `hsl(30, 15%, 12%)`
- `foreground`: `hsl(30, 10%, 95%)`

### 2.2 타이포그래피 시스템

**Headings**: Noto Serif KR (Korean serif)
- weights: 400, 500, 600, 700
- 사용처: h1-h6, 로고, 초대장 제목

**Body**: Noto Sans KR (Korean sans-serif)
- weights: 300, 400, 500, 600
- 사용처: 본문, 버튼, 라벨

**English accents**: Playfair Display (serif) + Inter (sans-serif)
- 사용처: 영문 제목, decorative elements

**Font sizing scale**: 8px base
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### 2.3 컴포넌트 전략

**Card**:
- Primary: Clean solid card (shadow-sm, rounded-xl)
- Glass variant: Subtle glass effect only on hero/landing pages
- Remove excessive backdrop-blur from dashboard/templates pages

**Button**:
- Primary: Terracotta gradient (not indigo/purple)
- Secondary: Sage green outline
- Remove gradient-glow variant (too gaming-like)
- Add wedding-appropriate hover effects (subtle lift + shadow)

**Input/Form**:
- Warm border colors
- Focus ring: terracotta tint
- Rounded-lg (not rounded-md)

**Navigation**:
- Clean white navbar with subtle bottom border
- Mobile: bottom tab bar (glass effect OK here)

### 2.4 애니메이션 전략

**Approach**: CSS animations only (no new library)
- Use `tailwindcss-animate` (already installed)
- Add micro-interactions:
  - Card hover: `translateY(-2px) + shadow-lg`
  - Button hover: `scale-[1.02] + shadow-md`
  - Page transitions: fade + slide
  - Loading: skeleton screens (already have Skeleton component)

**Animation timing**:
- Fast: 150ms (hover states)
- Normal: 250ms (transitions)
- Slow: 400ms (page transitions, modals)

### 2.5 Tailwind 버전 결정

**결정**: Tailwind v3 유지, v4는 미루기

**이유**:
1. v4로 업그레이드하면 breaking changes 많음 (config 방식 완전 변경)
2. 현재 v3에서 @theme 유사 기능은 CSS variables로 충분히 구현 가능
3. v4 업그레이드는 별도 phase로 분리
4. 우선순위: 디자인 리디자인 > 빌드 도구 업그레이드

---

## 3. 페이지별 리디자인 계획

### 3.1 Landing Page
- **변경사항**:
  - Hero: warm gradient (terracotta → blush) + decorative shapes
  - Background: clean white (not indigo gradient)
  - Cards: solid white with shadow (not glass)
  - CTA buttons: terracotta gradient
- **유지사항**:
  - Feature grid layout
  - Footer

### 3.2 Login/Signup Page
- **변경사항**:
  - Background: warm gradient (off-white → blush)
  - Card: solid white with shadow (reduce glass effect)
  - Social buttons: warm accent colors
  - Typography: Noto Serif KR for title
- **유지사항**:
  - Layout structure
  - Form fields

### 3.3 Dashboard
- **변경사항**:
  - Background: clean white (not indigo gradient)
  - Stat cards: solid white, remove glass
  - Icon backgrounds: terracotta/sage/blush tints
  - Typography: Noto Sans KR
- **유지사항**:
  - Grid layout
  - GlassCard component (for consistency)

### 3.4 Templates Page
- **변경사항**:
  - Background: clean white
  - Template cards: clean white with hover shadow
  - Filter/search: warm accent colors
- **유지사항**:
  - TemplateLibrary component
  - Grid layout

### 3.5 Public Invitation Page
- **변경사항**:
  - Background: warm romantic gradient (blush → off-white)
  - Typography: Noto Serif KR for title
  - Keep existing romantic design direction
- **유지사항**:
  - InvitationViewer component
  - Share FAB

### 3.6 Editor Page
- **변경사항**:
  - Sidebar: clean white with warm borders
  - Toolbar: terracotta accent for active states
  - Canvas: off-white background
- **유지사항**:
  - Layout structure
  - Drag-and-drop functionality

---

## 4. 구현 순서

### Wave 1: Design Tokens (CSS Variables)
1. `globals.css` 업데이트 — 새 컬러 팔레트, 폰트
2. `tailwind.config.js` 업데이트 — 새 color tokens
3. 테스트: 모든 페이지 색상 확인

### Wave 2: Typography System
1. Google Fonts 추가 (Noto Serif KR, Noto Sans KR, Playfair Display, Inter)
2. `layout.tsx`에 HeadFonts 컴포넌트 추가
3. CSS typography tokens 업데이트
4. 테스트: 모든 페이지 폰트 확인

### Wave 3: Component Updates
1. `button.tsx` — 새 gradient, hover effects
2. `card.tsx` — glass effect refinement
3. `input.tsx` — warm border/focus colors
4. `badge.tsx` — warm color variants
5. 테스트: 컴포넌트 스냅샷

### Wave 4: Page Redesign
1. Landing page
2. Login/Signup page
3. Dashboard page
4. Templates page
5. Public invitation page
6. Editor page

### Wave 5: Polish & Animation
1. Micro-interactions 추가
2. Page transitions
3. Loading states polish
4. Dark mode adjustment

---

## 5. 그라이어 영역 (Gray Areas)

### 5.1 기존 GlassCard 호환성
- **문제**: GlassCard를 사용하는 기존 컴포넌트 많음
- **해결**: GlassCard는 유지하되, 기본 card는 solid로 변경
- 페이지별로 `glass` prop으로 제어

### 5.2 템플릿 미리보기
- **문제**: 템플릿 미리보기는 사용자 정의 색상/폰트 사용
- **해결**: 디자인 시스템은 앱 UI에만 적용, 템플릿 미리보기는 기존 방식 유지

### 5.3 Dark Mode
- **문제**: warm palette는 dark mode에서 다르게 보일 수 있음
- **해결**: dark mode용 별도 색상 정의 (warm dark tones)

### 5.4 shadcn/ui 재생성
- **문제**: shadcn/ui 컴포넌트 재생성 시 덮어씌워질 수 있음
- **해결**: shadcn/ui는 수동 수정, `--no-update` 옵션으로 재생성 방지

---

## 6. 성공 기준

- [ ] 모든 페이지가 warm wedding palette 적용
- [ ] Noto Serif KR + Noto Sans KR 일관게 적용
- [ ] Landing, Login, Dashboard, Templates 페이지 리디자인 완료
- [ ] Glassmorphism 과도 사용 제거 (hero/landing에만)
- [ ] Dark mode에서도 일관된 색상
- [ ] 기존 기능 broken되지 않음 (테스트 통과)
- [ ] Lighthouse performance score 유지 또는 개선

---

## 7. 참고: 경쟁사 분석 요약

| 항목 | Zola | TheKnot | Todayis (현재) | Todayis (목표) |
|------|------|---------|----------------|----------------|
| Primary Color | Navy (#183B54) | Pink (#FF44CB) | Indigo (#6366F1) | Terracotta (#E07A5F) |
| Accent | Coral (#C7305B) | Peach (#FF9357) | Purple (#A855F7) | Sage (#81B29A) |
| Font (Heading) | new-spirit (serif) | ods-font-primary (serif) | System sans | Noto Serif KR |
| Font (Body) | circular (sans) | ods-font-secondary (sans) | System sans | Noto Sans KR |
| Background | White | White | Indigo gradient | Off-white |
| Card Style | Solid | Solid | Glass (excessive) | Solid + subtle glass |
| Animations | Yes | Minimal | CSS transitions | CSS micro-interactions |

---

## 8. Design System References 분석

### 8.1 TypeUI (bergside/typeui) - AI를 위한 Design Skills

**분석 결과**:
- Fonts: Mona Sans, system fonts, monospace (SF Mono)
- Colors: GitHub-style dark/neutral palette
  - Background: rgb(31, 35, 40) (dark)
  - Accent: rgb(9, 105, 218) (blue)
  - Text: rgb(129, 139, 152) (gray)
- Focus: Agentic tools (Claude, Cursor, etc.)

**참고할 점**:
- Clean, professional UI
- Monospace 폰트 사용 (개발자向け)
- Minimal color palette

### 8.2 Pretext - Text Measurement & Layout

**분석 결과**:
- Same GitHub-style design
- Focus on: Precise text rendering

### 8.3 shadcn/ui - UI Component Library

**분석 결과**:
- Fonts: Geist (new, modern)
- Colors: lab() and oklab() color space (modern CSS)
  - Using oklab for better perceptual color matching
- Clean, minimal design system
- Customizable components

**참고할 점**:
- oklab color space adopted by Tailwind v4
- Component composition over inheritance
- Focus on accessibility

### 8.4 Tailwind CSS - Utility-first Framework

**분석 결과**:
- Fonts: Inter, Plex Mono
- Colors: oklab() color space (Tailwind v4!)
- Dark mode with proper color handling
- Utility-first approach

**참고할 점**:
- Tailwind v4 uses oklab for colors
- CSS-native approach with @theme

---

## 9. Modern UI/UX Trends 분석

### 9.1 Motion (animation library)

**분석 결과**:
- Fonts: Inter, TASA Orbiter, Azeret Mono
- Colors: Dark theme with purple accent (#9E9EFF), mint (#8DF0CC), yellow (#FFF312)
- Smooth CSS animations
- No JS-heavy animations

**참고할 점**:
- Subtle, performant animations
- Use CSS transitions instead of JS

### 9.2 Framer

**분석 결과**:
- Fonts: Inter, GT Walsheim, Mona Sans, Open Runde
- Colors: Black & white, blue accents
- Strong animations and micro-interactions

**참고할 점**:
- Smooth page transitions
- Hover states with scale + shadow

### 9.3 Stripe

**분석 결과**:
- Fonts: Sohne (custom)
- Colors: Purple accent (#5335FD), minimal
- Professional, clean design
- Subtle gradients

**참고할 점**:
- Professional minimal aesthetic
- Clear visual hierarchy

### 9.4 Linear

**분석 결과**:
- Fonts: Inter + Berkeley Mono (for code)
- Colors: Dark theme (#08090A), purple accent (#5E6AD2)
- Smooth animations
- Clean, minimal interface

**참고할 점**:
- Dark theme best practices
- Subtle purple accent works well

### 9.5 Airbnb

**분석 결과**:
- Fonts: Airbnb Cereal (custom)
- Colors: White background, red accent (#FF385C)
- Clear typography hierarchy
- Card-based layout

**참고할 점**:
- Strong visual hierarchy
- Clear button hierarchy (primary vs secondary)

---

## 10. Design System 결론

### 10.1 채택할 트렌드

1. **Colors**: Warm palette (terracotta, sage, blush) + neutral backgrounds
2. **Typography**: Noto Serif KR + Noto Sans KR + Inter (영문)
3. **Components**: Solid cards with subtle shadows, not glass
4. **Animations**: CSS transitions only, subtle micro-interactions
5. **Dark Mode**: Proper dark theme with warm undertones

### 10.2 참고할 패턴

1. Stripe: Professional minimal aesthetic
2. Linear: Dark theme with purple accent
3. Airbnb: Clear visual hierarchy
4. Framer: Smooth hover states

### 10.3 향후 개선 방향

1. Tailwind v4 업그레이드 시 oklab color space 고려
2. 더 많은 animation 추가 (page transitions)
3. 더 많은 component variants 추가
4. Custom font (커스텀 폰트) 시스템 확장
