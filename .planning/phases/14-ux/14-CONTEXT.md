# Phase 14: 버그 수정 + 템플릿 UX 개선 - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 13 디자인 시스템 구축 후 발견된 UX 버그 및 문제 수정.
Phase 13의 CSS variable/color 변경을 실제로 적용하고, 템플릿 시스템의 기본 UX를 개선한다.
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
- **D-06:** Edit 버튼은 템플릿 관리자만 표시 (템플릿 소유자만)

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

- `.planning/phases/13-design-system/CONTEXT.md` — Warm palette, typography system, animation strategy
- `.planning/phases/13-design-system/PLAN.md` — Plan 01~05 상태 및 검증 기준
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
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `globals.css` — `--primary`, `--secondary`, `--accent`, `--background` CSS variables (Phase 13)
- `src/components/ui/card.tsx` — `Card`, `GlassCard` 컴포넌트
- `src/components/ui/button.tsx` — `buttonVariants` (gradient, gradient-glow variants)
- `src/components/ui/badge.tsx` — terracotta/sage/blush variants (Plan 03 완료)
- `src/components/ui/input.tsx` — terracotta focus ring (Plan 03 완료)
- `src/hooks/use-session.ts` — 인증 상태 관리

### Established Patterns
- Page redesigns use warm gradient backgrounds (Phase 13 Plan 04)
- Button variants: default, destructive, outline, secondary, ghost, link, gradient, gradient-glow
- Badge variants: default, secondary, destructive, outline, terracotta, sage, blush
- Font system: Noto Serif KR (headings), Noto Sans KR (body), Playfair Display (English), Inter (sans)

### Integration Points
- 로고: `(main)/layout.tsx:39` → href 변경
- Root redirect: `app/page.tsx:4` → redirect target 변경
- TemplateCard: 클릭 → router.push(`/templates/${template.id}`), Edit은 별도 버튼
- TemplatePreview: indigo-600 → hsl(var(--primary)) 교체
- dashboard: indigo gradient → hsl(var(--primary)) 교체
</code_context>

<specifics>
## Specific Ideas

**Phase 13 CONTEXT.md에서 결정된 사항:**
- 컬러 팔레트: terracotta (#E07A5F), sage (#81B29A), blush (#F4A0B5)
- 타이포그래피: Noto Serif KR + Noto Sans KR + Inter
- 애니메이션: CSS transitions only (tailwindcss-animate)
- Card: solid white with subtle shadow, glass는 hero/landing에만
- Tailwind v3 유지 (v4는 미루기)

**Phase 13 PLAN.md Plan 01~05 완료 상태:**
- Plan 01: Design Tokens ✅ (globals.css CSS variables)
- Plan 02: Typography System ✅ (Noto Serif/Sans, Playfair, Inter)
- Plan 03: Component Updates ✅ (input, badge 업데이트)
- Plan 04: Page Redesign ✅ (background gradient 변경)
- Plan 05: Polish & Animation ✅ (micro-interactions)

**반면, 실제 페이지에서는 여전히 indigo/purple hard-coded:**
- dashboard/page.tsx: `bg-gradient-to-br from-indigo-500 to-purple-500`
- login/page.tsx: `text-indigo-600`
- TemplatePreview.tsx: `bg-indigo-600`

→ 이 불일치를 Phase 14에서 수정
</specifics>

<deferred>
## Deferred Ideas

### 템플릿 필드 타입 확장 (audio, video, gallery 등)
- Phase 14 범위에서 제외, Phase 15���서 별도 계획
- 현재 field types: text, date, image, location (4개)
- 필요한 새 types: account (계좌번호), audio (배경음악), video (동영상), gallery (여러 이미지), message (축의도)

### 전체 디자인 퀄리티 개선 (트렌디한 UX)
- Phase 13에서 CSS variable 색상 변경만, 실제 디자인 적용 미흡
- 대시보드, 로그인 등 페이지의 indigo gradient 잔존 문제
- Phase 14 Plan 01에서 일부 수정하되, 전체 리뉴얼은 Phase 15 이상에서 별도 계획 권장

### Edit 미리보기 빈 상태
- TemplateEngine.tsx의 validation 실패 시 빈 에러 메시지만 표시
- fields가 없어도 유효한 placeholder/안내 표시 필요
- Phase 14 Plan 02에서 수정하되, 완전한 UX 개선은 Phase 15에서
</deferred>