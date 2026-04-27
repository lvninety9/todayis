# Phase 13: 디자인 시스템 구축 - PLAN.md

## Goal

웹 페이지 전체 디자인을 웨딩 초대장 플랫폼에 맞는 최신 트렌드로 리디자인합니다.
Warm palette (terracotta, sage, blush), Noto Serif KR 타이포그래피, clean card 디자인을 적용합니다.

## Requirements

- DESIGN-01: 디자인 트렌드 학습/탐색 (TypeUI, Pretext, 경쟁사 분석) ✅ 완료
  - Zola, TheKnot 분석 (웨딩 플랫폼)
  - TypeUI, Pretext 분석 (AI design tools)
  - shadcn/ui, Tailwind 분석 (Design System)
  - Motion, Framer, Stripe, Linear, Airbnb 분석 (Modern UI trends)
- DESIGN-02: 디자인 시스템 수립 (CSS variables, Tailwind tokens, typography) ✅ 진행 중
- DESIGN-03: 페이지별 리디자인 (로그인, 대시보드, 템플릿 라이브러리, 편집기, 공개 초대장, 랜딩) ✅ 진행 중

---

## Plan 01: Design Tokens (CSS Variables + Tailwind) ✅ 완료

**Goal**: 새 warm wedding palette를 CSS variables와 Tailwind config에 적용

### Tasks

### 13-01-01: globals.css 컬러 팔레트 업데이트
- **파일**: `src/app/globals.css`
- **내용**:
  - `--primary`: `12 75% 55%` (terracotta)
  - `--primary-foreground`: `12 75% 95%`
  - `--secondary`: `160 35% 45%` (sage)
  - `--secondary-foreground`: `160 35% 95%`
  - `--accent`: `350 70% 60%` (blush)
  - `--background`: `30 20% 98%` (off-white)
  - `--foreground`: `30 10% 15%` (warm dark)
  - `--muted`: `30 10% 90%`
  - `--muted-foreground`: `30 5% 45%`
  - `--card`: `30 20% 98%`
  - `--card-foreground`: `30 10% 15%`
  - `--popover`: `30 20% 98%`
  - `--popover-foreground`: `30 10% 15%`
  - `--border`: `30 10% 85%`
  - `--input`: `30 10% 85%`
  - `--ring`: `12 75% 55%`
  - `--destructive`: `0 72% 51%`
  - Dark mode: warm dark tones

### 13-01-02: tailwind.config.js 업데이트
- **파일**: `tailwind.config.js`
- **내용**:
  - 새 animation keyframes 추가 (fade-in, slide-up, scale-in)

**검증 기준**:
- [x] npm run dev 실행 시 모든 페이지가 warm palette로 표시
- [x] Dark mode 토글 시 일관된 색상
- [x] 빌드 성공 (npm run build)
- [x] 단위 테스트 통과 (128 tests)

---

## Plan 02: Typography System ✅ 완료

**Goal**: Noto Serif KR + Noto Sans KR 폰트 시스템 적용

### Tasks

### 13-02-01: Google Fonts 추가
- **파일**: `src/app/layout.tsx`
- **내용**:
  - next/font/google 사용
  - Noto Serif KR (weights: 400, 500, 600, 700)
  - Noto Sans KR (weights: 300, 400, 500, 600)
  - Playfair Display, Inter (영문용)

### 13-02-02: CSS typography tokens
- **파일**: `src/app/globals.css`
- **내용**:
  - --font-heading, --font-body CSS 변수 추가
  - body에 font-family 적용
  - h1-h6에 font-family 적용

**검증 기준**:
- [x] 모든 페이지가 새 폰트로 표시

---

## Plan 03: Component Updates ✅ 완료

**Goal**: shadcn/ui 컴포넌트 새 디자인 시스템에 맞게 업데이트

### Tasks

### 13-03-01: button.tsx 업데이트
- Terracotta gradient 적용
- Hover effects 변경 (subtle lift + shadow)

### 13-03-02: card.tsx 업데이트
- Glass effect를 subtle로 변경
- Primary card는 solid white

### 13-03-03: input.tsx 업데이트
- Warm border colors
- Focus ring: terracotta tint ✅

### 13-03-04: badge.tsx 업데이트
- 새 warm variants: terracotta, sage, blush ✅

**검증 기준**:
- [x] 컴포넌트 스냅샷 테스트 통과

---

## Plan 04: Page Redesign

**Goal**: 주요 페이지 리디자인

### Tasks

### 13-04-01: Landing Page 리디자인
- Background: warm gradient (terracotta → blush)
- Hero section warm palette 적용
- Cards: solid white with shadow

### 13-04-02: Login/Signup Page 리디자인
- Background: warm gradient
- Card: solid white

### 13-04-03: Dashboard Page 리디자인
- Background: clean white
- Stat cards: solid white

### 13-04-04: Templates Page 리디자인
- Background: clean white
- Template cards: solid white

### 13-04-05: Public Invitation Page
- Background: warm romantic gradient
- Typography: Noto Serif KR

**검증 기준**:
- [x] 모든 페이지가 새 디자인으로 표시
- [x] 기존 기능 동작 확인
- [x] 테스트 통과

---

## Plan 05: Polish & Animation

**Goal**: 마이크로 인터랙션 및 애니메이션 추가

### Tasks

### 13-05-01: Micro-interactions 추가 ✅
- Card hover: translateY + shadow
- Button hover: scale + shadow
- card-hover, button-lift utility classes 추가

### 13-05-02: Dark mode adjustment ✅
- Warm dark tones 적용 (globals.css에 정의됨)

### 13-05-03: Animation refinements ✅
- Page transition: fadeSlideIn animation
- Stagger delays for lists
- Selection color themed

**검증 기준**:
- [x] 애니메이션 부드럽게 동작
- [x] Dark mode에서 일관된 디자인