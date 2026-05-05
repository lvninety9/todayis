# Phase 17 - Session Continuation

## 완료 / 미완료

| Plan | 상태 | 비고 |
|------|------|------|
| 17-01 (wave 1) | ✅ 완료 — 템플릿 비주얼 디자인 시스템 | Section/SectionStyle 타입, 3개 템플릿 스타일 |
| 17-02 (wave 2) | ✅ 완료 — 템플릿 미리보기 모달 | TemplatePreviewModal |
| 17-03 (wave 3) | ✅ 완료 — Section 애니메이션/글꼴/색상 | StyleEditor, fonts.ts |
| **17-04 (wave 4)** | **✅ 완료 — 모바일 Section 구조 재설계** | Section 기반 편집기, split-view preview |
| **17-05 (추가)** | **⏳ 진행 중 — 템플릿 현실화** | 실제 이미지, 긴 메시지, 계좌, 갤러리 |

## 17-04 완료 내용

### ✅ Wave 1: Section 기반 템플릿 정의
- `src/data/templates/sample.ts`에 3종 추가:
  - `ROMANTIC_TEMPLATE` — terracotta/pink palette, Noto Serif KR font
  - `CLASSIC_TEMPLATE` — warm brown palette, Playfair Display font
  - `MODERN_TEMPLATE` — dark blue/red palette, Pretendard font
- 각 템플릿: `sections` 배열 5개 (image → announcement → invitation → map → accounts)
- 기존 `WEDDING_TEMPLATE`, `BIRTHDAY_TEMPLATE` 유지 (하위 호환)
- `SECTION_BASED_TEMPLATES` 배열 + `findSectionBasedTemplate()` 헬퍼 추가

### ✅ Wave 2: Section 편집 UI
- `src/components/templates/editor/TemplateEditor.tsx`를 Section 기반 편집기로 전환
- 왼쪽 패널: Section 목록 (Up/Down 버튼으로 순서 조정)
- 오른쪽 패널: 선택된 Section의 필드 편집기 + StyleEditor
- Section 아이콘 (type별 emoji) + 색상 코딩

### ✅ Wave 3: 실시간 미리보기
- Preview toggle 버튼 (Eye icon) — 모바일 preview 패널 표시/숨김
- Preview: sections 순서대로 렌더링, per-section styles 적용

### ✅ Wave 4: 통합 검증
- `src/app/(main)/templates/[id]/edit/page.tsx` 리팩토링
- TypeScript build pass 확인
- Lint pass 확인

### ✅ 추가 개선 사항
- `TemplateEngine.tsx`: animationDelay + animationDuration 적용, GallerySection/StorySection 추가
- `FieldEditor.tsx`: SectionEditor 컴포넌트 추가
- `use-template-editor.ts`: Section 헬퍼 함수 전체 구현
- `landing/page.tsx`: JSX entities 수정
- `toss.test.ts`: reserved word 오류 수정
- `next.config.js`: example.com remotePatterns 추가
- `template.e2e.ts`: mock 구조 업데이트
- `profile.e2e.ts`: response structure 수정

## ⚠️ 17-05: 템플릿 현실화 (진행 중)

### 문제점

사용자가 템플릿이 너무 단순하고 비현실적이라고 불만:
1. **실제 이미지 없음**: heroImage defaultValue가 null
2. **메시지 너무 짧음**: 한 줄 수준
3. **부모님 성함 없음**: groomParents/brideParents 필드 없음
4. **축의금 계좌 없음**: groomAccount/groomBank/groomHolder 필드 없음
5. **갤러리 섹션 없음**: 5개 섹션만 (gallery 누락)

### 작업 목록

#### Task 1: ROMANTIC_TEMPLATE 업데이트

변경할 파일: `src/data/templates/sample.ts`

1. Section 1 (image): heroImage에 Unsplash URL 설정
2. Section 3 (invitation): groomParents, brideParents, 긴 message 추가
3. Section 5 (accounts): groomAccount, groomBank, groomHolder, brideAccount, brideBank, brideHolder 추가
4. Section 6 (gallery): 새 섹션 추가 (image1-6 with Unsplash URLs)

#### Task 2: CLASSIC_TEMPLATE 업데이트

ROMANTIC_TEMPLATE과 동일하게 적용 (다른 Unsplash 이미지 URL)

#### Task 3: MODERN_TEMPLATE 업데이트

ROMANTIC_TEMPLATE과 동일하게 적용 (다른 Unsplash 이미지 URL)

#### Task 4: 빌드 테스트

```bash
npx tsc --noEmit
npm run build
```

### 참고: TemplateEngine.tsx 검증

이미 구현됨 — 확인만 하면 됨:
- `GallerySection` (line 467-513): image1-6 필드 읽어서 2x3 그리드 렌더링
- `StorySection` (line 515-545): story1-3 필드 읽어서 타임라인 렌더링
- `MapSection` (line 293-381): Google Maps iframe 임베드 + 네이버 지도 + 네비게이션
- `AccountsSection` (line 384-464): groomAccount/brideAccount 렌더링

### 참고: SectionType

`src/types/template.ts` line 19:
```typescript
export type SectionType = 'image' | 'announcement' | 'invitation' | 'map' | 'accounts' | 'gallery' | 'story';
```
gallery와 story가 이미 포함되어 있음.

### 참고: FieldType

`src/types/template.ts` line 14:
```typescript
export type FieldType = 'text' | 'date' | 'image' | 'location' | 'account' | 'audio' | 'video' | 'gallery' | 'message' | 'dresscode' | 'parents';
```
message, dresscode, account, parents가 이미 포함되어 있음.

## 핵심 파일

| 파일 | 상태 | 설명 |
|------|------|------|
| `src/types/template.ts` | ✅ 완료 | Section, SectionStyle 타입 정의 (157 lines) |
| `src/components/templates/engine/TemplateEngine.tsx` | ✅ 완료 | Section 기반 렌더링 + gallery/story/map/accounts (608 lines) |
| `src/components/templates/editor/StyleEditor.tsx` | ✅ 완료 | Section 스타일 설정 UI (491 lines) |
| `src/components/templates/editor/TemplateEditor.tsx` | ✅ 완료 | Section 기반 편집기 + 실시간 preview (619 lines) |
| `src/components/templates/editor/FieldEditor.tsx` | ✅ 완료 | SectionEditor 컴포넌트 추가 |
| `src/data/templates/sample.ts` | ⏳ 수정 필요 | Section 기반 템플릿 3종 — gallery 섹션, 실제 이미지, 긴 메시지, 계좌 정보 추가 필요 |
| `src/app/(main)/templates/[id]/edit/page.tsx` | ✅ 완료 | Section 기반 편집기 통합 |
| `src/app/api/templates/route.ts` | ✅ 완료 | SECTION_BASED_TEMPLATES 병합 |
| `src/app/api/templates/[id]/route.ts` | ✅ 완료 | findSectionBasedTemplate() 폴백 + PATCH sections |
| `src/hooks/use-template-editor.ts` | ✅ 완료 | Section 헬퍼 함수 전체 구현 |
| `src/lib/fonts.ts` | ✅ 완료 | 5개 Google Fonts (83 lines) |
| `src/lib/template-utils.tsx` | ✅ 완료 | Template utility functions (109 lines) |

## 다음 세션에서 할 일

1. **템플릿 현실화** (17-05) — sample.ts 업데이트
   - ROMANTIC_TEMPLATE, CLASSIC_TEMPLATE, MODERN_TEMPLATE에 gallery 섹션 추가
   - heroImage에 Unsplash 실제 결혼 사진 URL 설정
   - invitation 섹션에 groomParents/brideParents/긴 메시지 추가
   - accounts 섹션에 계좌 정보 추가
2. **빌드 테스트** — npx tsc --noEmit && npm run build
3. **E2E 테스트 검증** — section-based 템플릿 전체 흐름 테스트 권장
4. **Phase 18 논의** — V2 기능 (배경음악, 이모지/GIF, 동영상 초대장 등)

## 시작 프롬프트

```
Phase 17 (템플릿 시스템 전면 개편)이 완료되었습니다.
17-01 ✅, 17-02 ✅, 17-03 ✅, 17-04 ✅ 모두 커밋 완료.

다음 작업을 진행합니다:

1. 템플릿 현실화 (17-05) — sample.ts 업데이트
   - ROMANTIC/CLASSIC/MODERN 템플릿에 gallery 섹션 추가
   - heroImage에 Unsplash 실제 결혼 사진 URL 설정
   - invitation 섹션에 groomParents/brideParents/긴 메시지 추가
   - accounts 섹션에 계좌 정보 추가

2. 빌드 테스트
   npx tsc --noEmit && npm run build

3. E2E 테스트 실행 (선택)
   npx playwright test

4. Phase 18 논의 (V2 기능)
   - 배경음악 (Phase 12에서 V2로 이관)
   - 이모지/GIF 지원
   - 동영상 초대장

시작: cat src/data/templates/sample.ts | head -100
```
