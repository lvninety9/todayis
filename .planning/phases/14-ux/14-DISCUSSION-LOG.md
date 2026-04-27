# Phase 14: 버그 수정 + 템플릿 UX 개선 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-27
**Phase:** 14-ux

---

## 로고 리다이렉트 (BUG-01)

| Option | Description | Selected |
|--------|-------------|----------|
| /landing으로统一 | 모든 사용자가 /landing (회사 소개/랜딩 페이지)으로 이동 | ✓ |
| 로그인 상태에 따라 분기 | 로그인 상태 → /dashboard, 비로그인 → /landing 또는 /login | |
| 로고 제거 | SPA에서는 로고 클릭 시 새로고침 없이 첫 화면으로 | |

**User's choice:** /landing으로统一
**Notes:** 로고 클릭 = 모든 사용자 → /landing. Root page `/`도 `/landing`으로 변경 (/login 제거).

---

## Root Redirect

| Option | Description | Selected |
|--------|-------------|----------|
| /login 제거, /landing으로统一 | root page / → /landing으로 redirect | ✓ |
| 기존 유지 (root=/login) | 로고는 /landing, root는 /login. 두 경로 공존. | |

**User's choice:** /login 제거, /landing으로统一
**Notes:** root page redirect도 /landing으로 변경.

---

## 템플릿 카드 클릭 동작 (UX-01)

| Option | Description | Selected |
|--------|-------------|----------|
| 카드 클릭 = 미리보기, Edit 버튼 별도 | 카드 클릭 → 미리보기 (/templates/[id]). Edit은 별도 버튼. | ✓ |
| mode prop으로 edit/view 전환 | 카드 자체에 Edit과 Preview 모드 토글. | |
| hover 미리보기 + 클릭은 edit | 카드 hover 시 미리보기 오버레이. 클릭은 edit으로. | |

**User's choice:** 카드 클릭 = 미리보기, Edit 버튼 별도
**Notes:** 사용자가 템플릿 내용을 확인한 후 편집 결정. Edit은 관리자만.

---

## 미리보기 페이지 CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Create/사용하기 버튼 | 미리보기 페이지에서 '이 템플릿으로 초대장 만들기' | ✓ |
| Edit 버튼 (템플릿 관리자) | 미리보기 페이지에 Edit 버튼. 템플릿 관리자만 해당. | |
| 둘 다 표시 | Create + Edit 버튼 모두 표시. | |

**User's choice:** Create/사용하기 버튼
**Notes:** 새 초대장 생성 flow 제공.

---

## Claude's Discretion

- dashboard, login, TemplatePreview의 indigo hard-coded 색상 → CSS variables 교체 (D-07)
- TemplateEngine 빈 상태 placeholder (D-09)
- Phase 13 Plan 03~05에서 발견된 hard-coded 색상 자동 수정

## Deferred Ideas

- 템플릿 필드 타입 확장 (audio, video, gallery 등) → Phase 15
- 전체 디자인 퀄리티 개선 → Phase 15 이상
- Edit 미리보기 완전한 UX 개선 → Phase 15