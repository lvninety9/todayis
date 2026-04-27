# Todayis - 다음 세션 이어서 작업하기

---

## 🚀 시작 방법

새로운 세션에서 다음 명령어 중 하나를 입력하세요:

```bash
# 방법 1: GSD 워크플로우 자동 실행 (권장) - Phase 14 계속 진행
/gsd

# 방법 2: Phase 14만 실행
/gsd 14

# 방법 3: 계획 수립부터
/gsd-plan-phase 14
/gsd-execute-phase 14
```

---

## 📊 현재 프로젝트 상태 (2026-04-27 기준)

### 완료된 페이즈
| Phase | 이름 | 상태 | Plans |
|-------|------|------|-------|
| 01 | template-engine | ✅ 완료 | 3/3 |
| 02 | auth-system | ✅ 완료 | 4/4 |
| 03 | template-management | ✅ 완료 | 4/4 |
| 04 | profile-and-settings | ✅ 완료 | 4/4 |
| 05 | payment-system | ✅ 완료 | 3/3 |
| 06 | publish-system | ✅ 완료 | 3/3 |
| 07 | tests-unit | ✅ 완료 | 128개 테스트 |
| 08 | tests-e2e | ✅ 완료 | 36개 통과 (4개Gap) |
| 09 | frontend-redesign | ✅ 완료 | 8/8 |
| 10 | naver-selling | ✅ 완료 | 11/11 |
| 11 | custom-fonts | ✅ 완료 | 2/2 |
| 12 | background-music | ⏳ 대기 | (V2) |
| 13 | design-system | ✅ 완료 | 5/5 |

### 현재 진행 중
| Phase | 이름 | 상태 | Plans |
|-------|------|------|-------|
| 14 | ux | 🔄 planning 전 |discuss-phase 완료 |

---

## 🎯 Phase 14: 버그 수정 + 템플릿 UX 개선

### Discuss-phase 완료 (결정된 사항)

1. **로고 리다이렉트**: 로고/root 클릭 시 `/landing`으로 이동
2. **템플릿 카드**: 클릭 시 미리보기 페이지로 이동, Edit은 별도 버튼
3. **미리보기 페이지**: '이 템플릿으로 초대장 만들기' 버튼
4. **디자인 시스템**: Indigo hard-coded → warm palette (CSS variables)로 교체

### 2026 디자인 트렌드 (Phase 13 리서치 결과 적용)

- **Style**: Quiet Luxury + Warm Romance
- **Palette**: Terracotta (#E07A5F), Sage (#81B29A), Blush (#F4A0B5)
- **Layout**: Bento Grid (dashboard, landing)
- **Animations**: CSS scroll-driven + micro-interactions
- **Glassmorphism**: nav, modals만 (카드에서 제거)

### Design Skill
- `/media/jay/D/cursor/design-skills/todayis-wedding/SKILL.md` — 공식 Claude Skills 구조 적용

---

## ⚠️ Phase 14에서 수정 필요한 파일

1. `src/app/(main)/layout.tsx` — 로고 링크 (line 39: `href="/"`)
2. `src/app/page.tsx` — root redirect (line 4: `redirect("/login")`)
3. `src/app/(main)/dashboard/page.tsx` — indigo hard-coded
4. `src/app/(auth)/login/page.tsx` — indigo hard-coded
5. `src/components/templates/preview/TemplatePreview.tsx` — indigo hard-coded
6. `src/components/templates/library/TemplateCard.tsx` — 클릭 이벤트
7. `src/components/templates/engine/TemplateEngine.tsx` — 빈 상태 처리

---

## 📋 다음 작업

```bash
# Phase 14 계획 수립
/gsd-plan-phase 14

# 또는 바로 실행
/gsd 14
```

---

## 🎨 디자인 스킬 사용법

디자인 관련 요청 시 자동으로 로드되는 스킬:
- **파일**: `/media/jay/D/cursor/design-skills/todayis-wedding/SKILL.md`
- **트리거**: 디자인, UI, 템플릿, frontend, stylesheet, landing, dashboard, 컬러팔레트, 애니메이션, micro-interactions

---

## 📁 중요 문서 위치

- `.planning/ROADMAP.md` — 전체 로드맵
- `.planning/STATE.md` — 현재 상태
- `.planning/phases/14-ux/14-CONTEXT.md` — Phase 14 결정사항
- `.planning/phases/14-ux/14-DISCUSSION-LOG.md` — 논의 로그
- `/media/jay/D/cursor/design-skills/todayis-wedding/SKILL.md` — 디자인 스킬

---

## 🔧 기술 스택

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Animation**: Pure CSS (no new libraries)

---

*마지막 업데이트: 2026-04-27*