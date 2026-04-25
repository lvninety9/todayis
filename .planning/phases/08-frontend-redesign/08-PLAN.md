# Phase 8: Frontend Design Modernization - Plan

**Phase:** 08-frontend-redesign
**Goal:** Frontend 전체 개편 - UI 현대화, 템플릿 편집기 고급화, 애니메이션/모션 효과 통합
**Status:** In progress

## Research (Completed via discuss-phase)

### Libraries
- **Motion** (formerly Framer Motion): React animation library, 120fps, production-ready
- **shadcn/ui**: Already in use, modern component library
- **TailwindCSS**: Already in use

### Key Decisions (from CONTEXT.md)
1. UI 라이브러리: shadcn/ui + Motion
2. 텍스트 렌더링: 기존 DOM 유지 (Pretext 제외)
3. 템플릿 편집기: 고급 편집 기능 추가
4. 애니메이션: Motion 통합
5. 디자인: Glassmorphism + Gradients

---

## Tasks

### Task 8-01: Motion Library 설치 및 설정

**Goal:** Motion library 설치 및 기본 설정

**Steps:**
1. `npm install motion` — Motion library 설치
2. `src/lib/motion.ts` — Animation utilities 생성
3. `MotionConfig` — LazyMotion으로 code-split 설정
4. `useReducedMotion` — 접근성 준수

**Verification:**
- `npm install motion` 성공
- Import test: `import { motion } from 'motion'` 가능

---

### Task 8-02: shadcn/ui 컴포넌트 Redesign

**Goal:** 기존 shadcn/ui 컴포넌트를 modern glassmorphism으로 redesign

**Steps:**
1. `Card` — Glass card with backdrop-blur
2. `Button` — hover animation 추가
3. `Input` — focus animation 추가
4. `Dialog` — slide-up animation

**Files to modify:**
- `src/components/ui/card.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`

**Verification:**
- Glassmorphism effect 적용 확인
- Motion animation 동작 확인

---

### Task 8-03: Login/Signup 페이지 Redesign

**Goal:** Login/signup 페이지 glassmorphism 적용

**Steps:**
1. Login page background: gradient
2. Login card: frosted glass effect
3. Field animations: stagger entrance
4. Social buttons: hover effects

**Files to modify:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`

**Verification:**
- Glass effect 동작
- Entrance animation 동작

---

### Task 8-04: Dashboard 페이지 Redesign

**Goal:** Dashboard 페이지 gradient + animation 적용

**Steps:**
1. Background: animated gradient
2. Cards: hover scale + shadow
3. Quick actions: stagger entrance
4. Template cards: glass effect

**Files to modify:**
- `src/app/(main)/dashboard/page.tsx`

**Verification:**
- Gradient background 적용
- Card hover animation 동작
- Stagger entrance animation 동작

---

### Task 8-05: 템플릿 라이브러리 페이지 Redesign

**Goal:** 템플릿 카드 glassmorphism + animation

**Steps:**
1. Template cards: glass effect
2. Card hover: scale animation
3. Grid entrance: stagger fade-in
4. Create button: pulse animation

**Files to modify:**
- `src/app/(main)/templates/page.tsx`

**Verification:**
- Grid animation 동작
- Card hover effect 동작

---

### Task 8-06: 템플릿 편집기 고급 기능

**Goal:** 템플릿 편집기에 고급 스타일 기능 추가

**Steps:**
1. Style fields 추가:
   - animation: entrance/exit animation type
   - music: 배경 음악 URL 선택
   - fontFamily: 커스텀 폰트
   - fontSize: 글자 크기
   - textColor: 글자 색상
   - backgroundColor: 배경 색상
   - textDecoration: 밑줄, 굵기 등

2. Backend:
   - `/api/templates` — style fields 저장
   - `templates` table — config JSONB 필드 확장

3. Frontend:
   - `StyleEditor` component
   - Preview에 style 적용

**Files to create:**
- `src/components/templates/editor/StyleEditor.tsx`

**Files to modify:**
- `src/app/api/templates/route.ts`
- `src/app/(main)/templates/[id]/edit/page.tsx`

**Verification:**
- Style editor 렌더링
- 데이터 저장/조회 가능
- Preview에 적용 확인

---

### Task 8-07: 템플릿 미리보기动画 적용

**Goal:** Template preview에 animation 적용

**Steps:**
1. TemplatePreview component에 animation 적용
2. Entrance animation: fade-in + slide
3. Field animations: stagger
4. Exit animation: fade-out

**Files to modify:**
- `src/components/templates/preview/TemplatePreview.tsx`

**Verification:**
- Preview animation 동작
- Style 적용 확인

---

### Task 8-08: 테스트 및 검증

**Goal:** 모든 변경사항 테스트

**Steps:**
1. TypeScript check
2. ESLint check
3. Build test
4. E2E 테스트 실행

**Commands:**
```bash
npm run type-check
npm run lint
npm run build
npx playwright test
```

**Verification:**
- All checks pass
- 40+ E2E tests pass

---

## Dependencies

- Task 8-01 → Task 8-02 (Motion 설치 후 component 수정)
- Task 8-02 → Task 8-03, 8-04, 8-05 (공통 component 수정 후 page 적용)
- Task 8-02 → Task 8-07 (Component 수정 후 preview 적용)
- Task 8-06, 8-07 → Task 8-08 (모두 완료 후 테스트)

---

## Success Criteria

- [ ] Motion library 설치 및 설정 완료
- [ ] shadcn/ui 컴포넌트 glassmorphism 적용
- [ ] Login/signup 페이지 redesign
- [ ] Dashboard 페이지 redesign  
- [ ] 템플릿 라이브러리 페이지 redesign
- [ ] 템플릿 편집기 고급 기능 추가
- [ ] Template preview animation 적용
- [ ] 모든 테스트 통과

---

## Estimated Time

- Task 8-01: 30분
- Task 8-02: 1시간
- Task 8-03: 30분
- Task 8-04: 30분
- Task 8-05: 30분
- Task 8-06: 1시간
- Task 8-07: 30분
- Task 8-08: 30분

**Total:** ~5시간