# Phase 17: 템플릿 시스템 전면 개편 - Context

**Gathered:** 2026-04-28
**Last Updated:** 2026-05-01 (17-04 완료)
**Status:** In Progress (17-01 ✅, 17-02 ✅, 17-03 ✅, 17-04 ✅)

<domain>
## Phase Boundary

Wedding 초대장としてふさわしい專業적인 템플릿 디자인 시스템 구축.
모바일 최적화, section 기반 구조, 실시간 편집 미리보기를 제공.

**Scope:**
- 템플릿 Visual Design (Wedding 카드 스타일)
- 템플릿 클릭 → 화면 가득 미리보기
- 에디터: 애니메이션/글꼴/색상 추가 + 실시간 preview
- 모바일 Section 구조 (image → 멘트 → 초대문 → 지도 → 계좌)
- 템플릿 커스터마이징 시스템 (폰트, 색상, 레이아웃 밀도, 장식 요소)

**제외:**
- 배경 음악 (Phase 12에서 V2로 처리)
- 이모지/GIF (Phase 15에서 V2로 처리)
- 동영상 초대장 (V3)

</domain>

<decisions>
## Implementation Decisions

### Template Design System

| Gray Area | 선택지 | 비고 |
|----------|--------|------|
| Wedding 스타일 | romantic, classic, modern — 3 가지 기본 스타일 (시작점) | 사용자가 자유롭게 커스터마이징 가능 |
| 템플릿 구조 | section 기반 (긴 스크롤) — image → announcement → invitation → map → accounts | |
| 미리보기 | 템플릿 카드 클릭 시 fullscreen modal — 배경 blurry, × 버튼으로 종료 | 읽기 전용 |
| 템플릿 수 | 3개 (MVP) — romantic, classic, modern 각 1개 | variation은 커스터마이징으로 대체 |

### Section 데이터 모델 (NEW - 2026-04-29)

| Gray Area | 선택지 | 비고 |
|----------|--------|------|
| Section 모델 | Section → fields 계층 구조 | 기존 TemplateField 확장 아님 |
| Section 레벨 | 템플릿 레벨 | 템플릿 정의에 섹션 구조 포함 |
| Section 타입 | 고정 5가지 (image, announcement, invitation, map, accounts) | 사용자 추가 불가 |
| Section 필드 | 유동 필드 | 사용자가 필드 추가/제거/재배치 가능 |

### Editor UX (NEW - 2026-04-29)

| Gray Area | 선택지 | 비고 |
|----------|--------|------|
| 편집 UI | Drawer (오른쪽 패널) | 전체 미리보기 + 오른쪽 slide-in 에디터 |
| 모바일 Drawer | 전체 화면 overlay | 상단 섹션 탭 + Up/Down 버튼 |
| 섹션 순서 재배치 | Up/Down 버튼 | dnd-kit drag 아님, 모바일 친화적 |
| 섹션 선택 | 상단 탭 | Drawer 상단에 Section 탭 |
| Drawer 초기 상태 | 자동 닫기 | "편집하기" 버튼으로 열기 |
| Drawer 애니메이션 | fade + slide-in | 부드러운 전환 |

### Preview-Edit Mode (NEW - 2026-04-29)

| Gray Area | 선택지 | 비고 |
|----------|--------|------|
| 템플릿 카드 클릭 | 읽기 전용 fullscreen preview modal | 편집 불가 |
| "편집하기" 버튼 | fullscreen preview-edit 모드 진입 | Drawer 포함, 자동 닫기 |
| 이동 경로 | 새 fullscreen preview-edit 모드 | 기존 [id]/edit 페이지 아님 |

### Editor Enhancements

| Gray Area | 선택지 | 비고 |
|----------|--------|------|
| 애니메이션 추가 | fade-in, slide-up, slide-left/right, bounce, scale-up | CSS animation class |
| 애니메이션 범위 | 섹션별 설정 | 타입 + 속도 + delay 개별 설정 |
| 애니메이션 구현 | CSS 클래스 기반 | `.animate-fade-in` 등 |
| scroll-reveal 통합 | 통합 | Phase 14 scroll-reveal + 새 애니메이션 조합 |
| 글꼴 선택 | Noto Serif KR, Playfair Display, Pretendard, Gmarket Sans, Lato | Google Fonts CDN (display=swap) |
| 폰트 적용 | 섹션별 폰트 설정 | 제목/본문 폰트 개별 설정 |
| 색상 테마 | terracotta, sage, blush + 커스텀 HEX | Predefined palette + 컬러피커 |
| 색상 적용 | 섹션별 색상 설정 | 배경 + 텍스트 + accent + border |

### Template Customization System (NEW - 2026-04-29)

| Gray Area | 선택지 | 비고 |
|----------|--------|------|
| 커스터마이징 방향 | 3 기본 스타일 + 자유 조합 | romantic/classic/modern은 시작점일 뿐 |
| 배경색/그라데이션 | 지원 | 템플릿 전체 또는 섹션별 |
| 폰트 (제목/본문) | 지원 | 제목용과 본문용 개별 선택 |
| 텍스트 색상 | 지원 | 제목/본문/부제목 색상 개별 설정 |
| 레이아웃 밀도 | 지원 | 여백 많음 (산뜻) ~ 여백 적음 (풍성) |
| 장식 요소 | 지원 | 플라워, 기하학, 라인, 미니멀 등 |
| 섹션별 스타일 | 지원 | 각 섹션마다 다른 스타일 적용 |

**Reference:** https://mcard.fromtoday.co.kr/w/Hr9Hp3/

</decisions>

<canonical_refs>
## Canonical References

Downstream agents가 반드시 읽어야 할 파일:

### Template System
- `src/types/template.ts` — Template, TemplateField, TemplateData 타입 정의 (Section 타입 추가 필요)
- `src/components/templates/engine/TemplateEngine.tsx` — 템플릿 렌더링 엔진 (Section 기반 재구성 필요)
- `src/components/templates/editor/TemplateEditor.tsx` — 에디터 메인 컴포넌트 (Drawer UX로 변경 필요)
- `src/components/templates/editor/FieldEditor.tsx` — 필드 편집 UI
- `src/components/templates/editor/StyleEditor.tsx` — 스타일 설정 (애니메이션/폰트/색상)
- `src/lib/template-utils.ts` — 템플릿 유틸리티 함수

### Template Library
- `src/components/templates/library/TemplateLibrary.tsx` — 템플릿 목록
- `src/components/templates/library/TemplateCard.tsx` — 템플릿 카드 (click → preview modal)
- `src/app/(main)/templates/page.tsx` — 템플릿 라이브러리 페이지
- `src/app/(main)/templates/[id]/page.tsx` — 템플릿 상세 페이지
- `src/app/(main)/templates/[id]/edit/page.tsx` — 템플릿 편집 페이지

### Preview & Editor Pages
- `src/components/templates/preview/TemplatePreview.tsx` — 미리보기 컴포넌트 (fullscreen modal로 변경 필요)

### Pages (참고)
- `src/app/(main)/[username]/page.tsx` — 공개 초대장 페이지

### Design System
- `src/app/globals.css` — CSS variables (Phase 16에서 expanded), animation classes (scroll-reveal 등)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TemplateEngine` — 기본 field rendering (label + value) → Section 기반 재구성 필요
- `TemplateCard` — 템플릿 카드 컴포넌트 (click event → preview modal 연결 필요)
- `TemplateEditor` — split view with preview toggle → Drawer UX로 변경 필요
- `globals.css` — CSS variables, animation classes (scroll-reveal 등) → 새 애니메이션 클래스 추가 필요

### Established Patterns
- CSS variables: `--primary`, `--terracotta-light`, `--accent`, `--text-primary` 등
- Tailwind CSS v4
- shadcn/ui 컴포넌트
- Mobile-first responsive
- dnd-kit (drag & drop) — Section 순서 재배치에는 Up/Down 버튼 사용

### Integration Points
- 템플릿 편집: `TemplateEditor.tsx` → `TemplatePreview.tsx` 연결 (Drawer UX로 변경)
- 템플릿 카드: `TemplateCard.tsx` → preview modal 연결
- 공개 초대장: `[username]/page.tsx` — TemplateEngine으로 렌더링 (Section 기반 호환 필요)

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
4. 템플릿 커스터마이징 시스템 (폰트, 색상, 레이아웃 밀도, 장식 요소 자유 조합)

### Section 데이터 구조 (예시)
```typescript
interface Section {
  id: string;
  type: 'image' | 'announcement' | 'invitation' | 'map' | 'accounts';
  order: number;
  fields: TemplateField[];
  style?: {
    animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'bounce' | 'scale-up';
    animationDuration?: number;
    animationDelay?: number;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    borderColor?: string;
    fontFamily?: string;
    fontSize?: string;
  };
}
```

</specifics>

<session-17-03>
## Session 17-03 Completion Summary (2026-04-29)

### Completed Tasks
1. **StyleEditor.tsx** — Section별 스타일 설정 UI 전체 구현
   - 애니메이션: 7종 선택 (fade-in, slide-up, slide-left, slide-right, bounce, scale-up, none)
   - 애니메이션 속도/딜레이 설정
   - 색상 테마: 3개 predefined palette (terracotta, sage, blush)
   - 색상 커스터마이징: 4개 HEX color picker (backgroundColor, textColor, accentColor, borderColor)
   - 폰트: 5개 Google Fonts 선택 UI
   - 폰트 크기: 6단계 (xs ~ 2xl)
   - 커스텀 폰트 업로드 (기존 기능 유지)

2. **fonts.ts** — Google Fonts 5개 추가
   - Noto Serif KR (본문용)
   - Playfair Display (제목용)
   - Pretendard (모던)
   - Gmarket Sans (캐주얼)
   - Lato (미니멀)

3. **TemplateEditor.tsx** — SectionStyle 연동
   - sectionId/sectionLabel prop 전달
   - Section별 스타일 관리 (sectionStyles state)
   - StyleEditor dialog 연동

4. **globals.css** — Animation keyframes 추가
   - animate-fade-in, animate-slide-up, animate-slide-left, animate-slide-right, animate-bounce, animate-scale-up

### Verification
- TypeScript build: ✅ Pass
- ESLint: ✅ 새 에러 없음 (기존 warning만)
- Commit: `feat(17-03): add section-level animation, font, and color theme settings`

### Files Modified
- `src/components/templates/editor/StyleEditor.tsx` — NEW (491 lines)
- `src/components/templates/editor/TemplateEditor.tsx` — modified
- `src/components/templates/engine/TemplateEngine.tsx` — modified (Section 기반 렌더링)
- `src/lib/fonts.ts` — modified (5개 Google Fonts 추가)
- `src/types/template.ts` — modified (Section, SectionStyle 타입)
- `src/app/globals.css` — modified (animation keyframes 추가)


### Completed Tasks
1. **TemplatePreviewModal.tsx** — New fullscreen preview modal component
   - `backdrop-blur-md` 배경 + 반투명 overlay
   - `×` 버튼, backdrop 클릭, Escape 키로 닫기
   - 모바일: 100vw × 100vh, 데스크톱: max-width 600px 중앙 정렬
   - TemplateEngine으로 렌더링 (빈 데이터로 미리보기)
   - 열림/닫힘 애니메이션 (fade-in/scale)

2. **TemplateCard.tsx** — `onPreview` prop 추가
   - 카드 클릭 시 `onPreview(template)` 호출

3. **TemplateLibrary.tsx** — `onPreview` prop 전달
   - TemplateCard에 preview callback 전달

4. **templates/page.tsx** — Preview modal state 관리
   - `previewModalOpen`, `selectedTemplate` state
   - TemplatePreviewModal 렌더링

5. **templates/[id]/page.tsx** — TemplatePreviewModal 통합
   - 기존 로직 유지 + preview modal 사용

### Verification
- TypeScript build: ✅ Pass
- All existing functionality preserved

### Files Modified
- `src/components/templates/preview/TemplatePreviewModal.tsx` — NEW
- `src/components/templates/library/TemplateCard.tsx` — modified
- `src/components/templates/library/TemplateLibrary.tsx` — modified
- `src/app/(main)/templates/page.tsx` — modified
- `src/app/(main)/templates/[id]/page.tsx` — modified

</session-17-02>

<deferred>
## Deferred Ideas

- 배경 음악 — Phase 12 (V2)
- 이모지/GIF — Phase 15 (V2)
- 동영상 초대장 — V3
- Kakao 로그인 — V3
- 템플릿 variation 추가 (6개 이상) — V2+
- AI 추천 템플릿 — V3

</deferred>

---

*Phase: 17-템플릿-시스템-전면-개편*
*Context gathered: 2026-04-28*
*Context updated: 2026-04-29 (discuss-phase 완료)*
