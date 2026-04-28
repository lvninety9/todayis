# Phase 17: 템플릿 시스템 전면 개편 - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Wedding 초대장としてふさわしい專業적인 템플릿 디자인 시스템 구축.
모바일 최적화, section 기반 구조, 실시간 편집 미리보기를 제공.

**Scope:**
- 템플릿 Visual Design (Wedding 카드 스타일)
- 템플릿 클릭 → 화면 가득 미리보기
- 에디터: 애니메이션/글꼴/색상 추가 + 실시간 preview
- 모바일 Section 구조 (image → 멘트 → 초대문 → 지도 → 계좌)

**제외:**
- 배경 음악 (Phase 12에서 V2로 처리)
- 이모지/GIF (Phase 15에서 V2로 처리)
- 동영상 초대장 (V3)

</domain>

<decisions>
## Implementation Decisions

### Template Design System

| Gray Area | 선택지 |
|----------|--------|
| Wedding 스타일 | romantic (로맨틱), classic (클래식), modern (모던) — 3 가지 기본 스타일 제공 |
| 템플릿 구조 | section 기반 (긴 스크롤) — image → announcement → invitation → map → accounts |
| 미리보기 | 템플릿 카드 클릭 시 fullscreen modal — 배경 blurry, × 버튼으로 종료 |

### Editor Enhancements

| Gray Area | 선택지 |
|----------|--------|
| 애니메이션 추가 | fade-in, slide-up, bounce — CSS animation class로 적용 |
| 글꼴 선택 | Noto Serif KR (기본), Playfair Display (영문), 적용 즉시 preview 반영 |
| 색상 테마 | terracotta, sage, blush — 템플릿 전체에 적용, 실시간 preview |

### Mobile Invitation Structure

| Gray Area | 선택지 |
|----------|--------|
| Section 순서 | 메인 이미지 → 결혼 안내 → 초대문 → 지도 → 계좌번호 (drag & drop으로 조정) |
| 각 Section 편집 |独立的编辑 UI — 이미지 업로드, 텍스트 입력, 위치 설정 |
| 실시간 preview | 편집 내용手机上 즉시 확인 — 에디터 split view 또는 modal |

**Reference:** https://mcard.fromtoday.co.kr/w/Hr9Hp3/

</decisions>

<canonical_refs>
## Canonical References

Downstream agents가 반드시 읽어야 할 파일:

### Template System
- `src/types/template.ts` — Template, TemplateField, TemplateData 타입 정의
- `src/components/templates/engine/TemplateEngine.tsx` — 템플릿 렌더링 엔진
- `src/components/templates/editor/TemplateEditor.tsx` — 에디터 메인 컴포넌트
- `src/components/templates/editor/FieldEditor.tsx` — 필드 편집 UI
- `src/lib/template-utils.ts` — 템플릿 유틸리티 함수

### Template Library
- `src/components/templates/library/TemplateLibrary.tsx` — 템플릿 목록
- `src/components/templates/library/TemplateCard.tsx` — 템플릿 카드
- `src/app/(main)/templates/page.tsx` — 템플릿 라이브러리 페이지
- `src/app/(main)/templates/[id]/page.tsx` — 템플릿 상세 페이지
- `src/app/(main)/templates/[id]/edit/page.tsx` — 템플릿 편집 페이지

### Pages (참고)
- `src/app/(main)/[username]/page.tsx` — 공개 초대장 페이지

### Design System
- `src/app/globals.css` — CSS variables ( Phase 16에서 expanded)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TemplateEngine` — 기본 field rendering (label + value)
- `TemplateCard` — 템플릿 카드 컴포넌트 (click event 처리 가능)
- `TemplateEditor` — split view with preview toggle
- `globals.css` — CSS variables, animation classes (scroll-reveal 등)

### Established Patterns
- CSS variables: `--primary`, `--terracotta-light`, `--accent`, `--text-primary` 등
- Tailwind CSS v4
- shadcn/ui 컴포넌트
- Mobile-first responsive

### Integration Points
- 템플릿 편집: `TemplateEditor.tsx` → `TemplatePreview.tsx` 연결
- 템플릿 카드: `TemplateCard.tsx` → 상세 페이지 이동
- 공개 초대장: `[username]/page.tsx` — TemplateEngine으로 렌더링

</code_context>

<specifics>
## Specific Ideas

### 참고할 wedding 초대장 예시
- https://mcard.fromtoday.co.kr/w/Hr9Hp3/
- 긴 스크롤 구조: 메인 이미지 → "결혼합니다" 멘트 → 초대 문 → 지도 → 계좌번호
- 모바일 최적화 (100vh 기반)

### 원하는 기능
1. 템플릿 카드 클릭 → 화면 가득 미리보기 (modal)
2. 에디터에서 애니메이션/글꼴 추가 시 실시간 preview
3. 모바일 section 구조 — 각 section 편집 가능, 순서 조정 가능

</specifics>

<deferred>
## Deferred Ideas

- 배경 음악 — Phase 12 (V2)
- 이모지/GIF — Phase 15 (V2)
- 동영상 초대장 — V3
- Kakao 로그인 — V3

</deferred>

---

*Phase: 17-템플릿-시스템-전면-개편*
*Context gathered: 2026-04-28*