# Phase 17 - Session Continuation

## 완료 / 미완료

| Plan | 상태 |
|------|------|
| 17-01 (wave 1) | ✅ 완료 — 템플릿 비주얼 디자인 시스템 |
| 17-02 (wave 2) | ✅ 완료 — 템플릿 미리보기 모달 |
| 17-03 (wave 3) | ✅ 완료 — Section 애니메이션/글꼴/색상 |
| **17-04 (wave 4)** | **✅ 완료 — 모바일 Section 구조 재설계** |

## 17-04 완료 내용

### ✅ Wave 1: Section 기반 템플릿 정의
- `src/data/templates/sample.ts`에 3종 추가:
  - `ROMANTIC_TEMPLATE` — terracotta/pink palette, Noto Serif KR font
  - `CLASSIC_TEMPLATE` — warm brown palette, Playfair Display font
  - `MODERN_TEMPLATE` — dark blue/red palette, Pretendard font
- 각 템플릿: `sections` 배열 5개 (image → announcement → invitation → map → accounts)
- 각 섹션은 고유한 `fields` + `style: SectionStyle` 포함
- 기존 `WEDDING_TEMPLATE`, `BIRTHDAY_TEMPLATE` 유지 (하위 호환)
- `SECTION_BASED_TEMPLATES` 배열 + `findSectionBasedTemplate()` 헬퍼 추가

### ✅ Wave 2: Section 편집 UI
- `src/components/templates/editor/TemplateEditor.tsx`를 Section 기반 편집기로 전환
- 왼쪽 패널: Section 목록 (Up/Down 버튼으로 순서 조정)
- 오른쪽 패널: 선택된 Section의 필드 편집기 + StyleEditor
- Section 아이콘 (type별 emoji) + 색상 코딩
- Section별 validation + 에러 하이라이트
- 하위 호환: `sections` 없으면 flat field UI fallback

### ✅ Wave 3: 실시간 미리보기
- Preview toggle 버튼 (Eye icon) — 모바일 preview 패널 표시/숨김
- Preview: sections 순서대로 렌더링, per-section styles 적용
- 모바일 크기 (max-w-sm)로 실시간 확인
- 필드 변경 시 즉시 preview 반영 (debounce 없음)

### ✅ Wave 4: 통합 검증
- `src/app/(main)/templates/[id]/edit/page.tsx` 리팩토링
  - Section 기반 템플릿 감지 → TemplateEditor 사용
  - flat field 템플릿은 기존 UI fallback
  - split-view preview 지원
  - sections + fields 둘 다 저장 (하위 호환)
- TypeScript build pass 확인
- Lint pass 확인

### ✅ 추가 개선 사항
- `TemplateEngine.tsx`: animationDelay + animationDuration 적용
- `FieldEditor.tsx`: SectionEditor 컴포넌트 추가 (collapsible header, style grid)
- `use-template-editor.ts`: Section 헬퍼 함수 전체 구현
- `landing/page.tsx`: JSX entities 수정
- `toss.test.ts`: reserved word 오류 수정 (module → mod)
- `next.config.js`: example.com remotePatterns 추가
- `template.e2e.ts`: mock 구조 업데이트 (section-based 대응)
- `profile.e2e.ts`: response structure 수정

## 핵심 파일

| 파일 | 상태 | 설명 |
|------|------|------|
| `src/types/template.ts` | ✅ 완료 | Section, SectionStyle 타입 정의 (157 lines) |
| `src/components/templates/engine/TemplateEngine.tsx` | ✅ 완료 | Section 기반 렌더링 + animationDelay (346 lines) |
| `src/components/templates/editor/StyleEditor.tsx` | ✅ 완료 | Section 스타일 설정 UI (491 lines) |
| `src/components/templates/editor/TemplateEditor.tsx` | ✅ 완료 | Section 기반 편집기 + 실시간 preview (619 lines) |
| `src/components/templates/editor/FieldEditor.tsx` | ✅ 완료 | SectionEditor 컴포넌트 추가 |
| `src/data/templates/sample.ts` | ✅ 완료 | Section 기반 템플릿 3종 + SECTION_BASED_TEMPLATES (900 lines) |
| `src/app/(main)/templates/[id]/edit/page.tsx` | ✅ 완료 | Section 기반 편집기 통합 (하위 호환 유지) |
| `src/app/api/templates/route.ts` | ✅ 완료 | SECTION_BASED_TEMPLATES 병합 |
| `src/app/api/templates/[id]/route.ts` | ✅ 완료 | findSectionBasedTemplate() 폴백 + PATCH sections |
| `src/hooks/use-template-editor.ts` | ✅ 완료 | Section 헬퍼 함수 전체 구현 |
| `src/lib/fonts.ts` | ✅ 완료 | 5개 Google Fonts (83 lines) |
| `src/lib/template-utils.tsx` | ✅ 완료 | Template utility functions (109 lines) |

## 다음 세션에서 할 일

1. **E2E 테스트 검증** — section-based 템플릿 전체 흐름 테스트 권장
2. **Phase 18 논의** — V2 기능 (배경음악, 이모지/GIF, 동영상 초대장 등)
3. **`/gsd-new-milestone`** 또는 **`/gsd-plan-phase`** 실행

## 시작 프롬프트

```
Phase 17 (템플릿 시스템 전면 개편)이 완료되었습니다.
17-01 ✅, 17-02 ✅, 17-03 ✅, 17-04 ✅ 모두 커밋 완료.

다음 작업을 진행합니다:

1. E2E 테스트 실행 (section-based 템플릿 전체 흐름 검증)
   npx playwright test

2. Phase 18 논의 (V2 기능)
   - 배경음악 (Phase 12에서 V2로 이관)
   - 이모지/GIF 지원
   - 동영상 초대장

3. /gsd-new-milestone 또는 /gsd-plan-phase 실행

시작: npx playwright test
```
