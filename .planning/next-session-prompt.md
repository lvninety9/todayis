# 다음 세션용 프롬프트

## 현재 상태

**Phase 17 (템플릿 시스템 개편)**: 완료 ✅ (17-01 ~ 17-04 모두 커밋 완료)
**다음 단계**: Phase 18 논의 (V2 기능) 또는 `/gsd-new-milestone`

---

## 완료된 작업 요약

### Phase 17-01: 템플릿 비주얼 디자인 시스템 ✅
- Section 타입 정의 (image, announcement, invitation, map, accounts)
- SectionStyle 타입 (animation, backgroundColor, textColor, accentColor, borderColor, fontFamily, fontSize)
- TemplateEngine: section 기반 렌더링 (sections가 있으면 우선 사용, 없으면 flat field 렌더링)
- 3개 wedding 템플릿 스타일 (romantic, classic, modern)

### Phase 17-02: 템플릿 미리보기 모달 ✅
- TemplatePreviewModal: fullscreen preview modal (backdrop-blur, × 버튼, Escape 키)
- TemplateCard: click → preview callback
- TemplateLibrary: onPreview prop 전달
- templates/page.tsx: preview modal state 관리

### Phase 17-03: 에디터 애니메이션/글꼴/색상 추가 ✅
- StyleEditor: Section별 애니메이션 (7종), 색상 테마 (predefined + custom HEX), 폰트 설정
- fonts.ts: 5개 Google Fonts 추가 (Noto Serif KR, Playfair Display, Pretendard, Gmarket Sans, Lato)
- TemplateEditor: SectionStyle 연동 (sectionId/sectionLabel prop 전달)
- globals.css: animation keyframes (fade-in, slide-up, slide-left, slide-right, bounce, scale-up)
- Build: 성공 ✅, Lint: 새 에러 없음 ✅

### Phase 17-04: 모바일 Section 구조 재설계 ✅
- sample.ts: ROMANTIC_TEMPLATE, CLASSIC_TEMPLATE, MODERN_TEMPLATE (각 5 sections)
- sample.ts: SECTION_BASED_TEMPLATES 배열 + findSectionBasedTemplate() 헬퍼
- api/templates/route.ts: SECTION_BASED_TEMPLATES import 및 병합
- api/templates/[id]/route.ts: findSectionBasedTemplate() 폴백 + PATCH sections 지원
- TemplateEditor.tsx: Section 기반 편집기로 전면 재작성 (Up/Down reorder, split-view preview)
- edit/page.tsx: Section 기반 편집기 통합 (하위 호환 flat field fallback)
- FieldEditor.tsx: SectionEditor 컴포넌트 추가
- use-template-editor.ts: Section 헬퍼 함수 전체 구현
- TemplateEngine.tsx: animationDelay + animationDuration 적용
- Build: 성공 ✅, Lint: 새 에러 없음 ✅

---

## 다음에 할 일

### 옵션 1: E2E 테스트 검증

```bash
# section-based 템플릿 전체 흐름 검증
npx playwright test
```

### 옵션 2: Phase 18 논의 (V2 기능)

V2 기능 목록:
- 배경음악 (Phase 12에서 V2로 이관)
- 이모지/GIF 지원
- 동영상 초대장 (V3)
- Kakao 로그인 (V3)
- Naver Pay 연동 (V3)
- AI 추천 템플릿 (V3)

```bash
# Phase 18 논의 시작
/gsd-discuss-phase
```

### 옵션 3: 새 마일스톤 시작

```bash
/gsd-new-milestone
```

---

## 새 세션 시작 프롬프트

```
안녕하세요. Phase 17 (템플릿 시스템 개편)은 완료되었습니다.
17-01 ✅, 17-02 ✅, 17-03 ✅, 17-04 ✅ 모두 커밋 완료.

다음 세션에서 아래 순서대로 진행해 주세요:

1. .planning/STATE.md 읽기 — 현재 상태 확인 (Phase 17 complete)
2. .planning/phases/17-템플릿-시스템-전면-개편/SESSION-CONTINUATION.md 읽기 — 17-04 완료 내용 확인
3. npx playwright test 실행 — E2E 테스트 검증
4. Phase 18 논의 또는 /gsd-new-milestone 실행

템플릿 시스템 개편 완료 내용:
- Section 기반 템플릿 3종 (romantic, classic, modern)
- 각 템플릿 5 sections (image → announcement → invitation → map → accounts)
- Section 기반 편집기 (Up/Down reorder, split-view preview)
- Section별 애니메이션/글꼴/색상 설정
- 실시간 미리보기
- API: SECTION_BASED_TEMPLATES 병합, PATCH sections 지원

Reference: https://mcard.fromtoday.co.kr/w/Hr9Hp3/

시작해 주세요.
```

---

## 참고 자료

- **Reference**: https://mcard.fromtoday.co.kr/w/Hr9Hp3/ — 모바일 wedding 초대장 예시
- **STATE.md**: `.planning/STATE.md` — 현재 상태 (Phase 17 complete)
- **SESSION-CONTINUATION.md**: `.planning/phases/17-템플릿-시스템-전면-개편/SESSION-CONTINUATION.md` — 17-04 완료 내용
- **기존 템플릿 코드**:
  - `src/types/template.ts` — Section, SectionStyle 타입
  - `src/components/templates/engine/TemplateEngine.tsx` — Section 기반 렌더링 엔진 + animationDelay
  - `src/components/templates/editor/StyleEditor.tsx` — Section 스타일 설정 UI
  - `src/components/templates/editor/TemplateEditor.tsx` — Section 기반 편집기
  - `src/components/templates/editor/FieldEditor.tsx` — SectionEditor 컴포넌트
  - `src/data/templates/sample.ts` — Section 기반 템플릿 3종
  - `src/hooks/use-template-editor.ts` — Section 헬퍼 함수
  - `src/lib/fonts.ts` — Google Fonts
  - `src/app/globals.css` — CSS variables, animation keyframes
