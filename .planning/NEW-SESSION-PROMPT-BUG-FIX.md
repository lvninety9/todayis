# 새 세션 시작 프롬프트 — Phase 17 치명적 버그 수정

---

## 프롬프트 복사 후 새 세션에 붙여넣기

```
## 프로젝트 개요

Todayis — 웨딩 초대장 제작 플랫폼 (Next.js 14, App Router, shadcn/ui, Supabase)
- Framework: Next.js 14 (App Router)
- UI: shadcn/ui + Tailwind CSS v4
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth (Google, GitHub, Email)
- Payment: Toss Payments

## 현재 상태

- Phase 01~16 완료
- Phase 17 (템플릿 시스템 전면 개편): 4개 plan 모두 완료되었으나 **런타임 버그로 작동 안 함**
- 빌드: tsc ✅, npm run build ✅
- 템플릿 현실화 완료 (sample.ts에 실제 이미지, 부모님 성함, 계좌, 갤러리 추가)

## 🚨 긴급 작업: Phase 17 치명적 버그 수정 (P0)

사용자가 템플릿 편집 시 실시간 미리보기가 작동하지 않는다고 보고. 4개의 치명적 버그가 있음.

---

## Bug 1: 편집기에서 필드 변경 시 미리보기가 실시간으로 업데이트되지 않음

**파일:** `src/app/(main)/templates/[id]/edit/page.tsx` line 127-132

**문제:**
```typescript
const previewKey = `${name}-${category}-${thumbnail}-${layout}`;
```
`sectionFieldValues`가 변경되어도 previewKey가 업데이트되지 않아 React가 preview를 다시 렌더링하지 않음.

**해결책:**
- `previewKey`에 `sectionFieldValues` 변경 감지 추가
- 또는 `key={JSON.stringify(sectionFieldValues)}` 사용
- 또는 `sectionFieldValuesVersion` 별도 관리

---

## Bug 2: TemplateEditor 내부 상태와 페이지 상태 동기화 안됨

**파일:** `src/app/(main)/templates/[id]/edit/page.tsx` + `src/components/templates/editor/TemplateEditor.tsx`

**문제:**
- 페이지가 `sectionFieldValues` 관리, TemplateEditor가 내부 state 가짐
- `initialData`로 값 전달되지만 에디터 변경사항이 페이지 state로 안 돌아옴
- `onUpdate`는 저장 시에만 호출 (실시간 동기화 아님)

**해결책:**
- `TemplateEditor`에 `onFieldChange` callback prop 추가
- 또는 상태 리프팅: `sectionFieldValues`를 TemplateEditor로 올리고 `setSectionFieldValues`를 prop으로 전달
- 또는 `use-template-editor.ts`의 `useTemplateEditor` hook에서 section field 변경 시 즉시 page state 반영

---

## Bug 3: 템플릿 생성 흐름(Create Flow)이 섹션 기반 템플릿을 지원하지 않음

**파일:** `src/components/publish/InvitationEditor.tsx` line 54-61

**문제:**
```typescript
const fields = template.fields || [];
```
섹션 기반 템플릿은 `fields`가 빈 배열이고 `sections` 배열을 가짐 → 필드가 전혀 표시되지 않음.

**해결책:**
- `InvitationEditor`가 섹션 기반 템플릿 감지 후 `sections`에서 필드 추출
- 또는 `use-template-editor.ts`의 `sectionFields()` 헬퍼로 섹션 기반 필드를 flat 배열로 변환
- 또는 섹션 기반 템플릿용 별도 에디터 컴포넌트 생성

---

## Bug 4: TemplatePreview가 섹션 기반 데이터를 제대로 렌더링하지 않음

**파일:** `src/components/templates/preview/TemplatePreview.tsx` line 33-42

**문제:**
```typescript
const editorData = {
  getValue: (name: string) => {
    const field = template.fields?.find(f => f.name === name);
    return field?.defaultValue || ''; // sections 기반 템플릿은 fields가 빈 배열
  },
};
```
섹션 기반 템플릿의 `sections[].fields`를 읽지 않음 → 모든 값이 빈 문자열.

**해결책:**
- `editorData` 생성 시 `template.sections`도 확인
- 또는 `use-template-editor.ts`의 `getSectionData()` 헬퍼 사용
- sections 기반 템플릿용 previewData 추출 로직 추가

---

## 수정해야 할 파일 목록

| 파일 | 버그 | 수정 내용 |
|------|------|-----------|
| `src/app/(main)/templates/[id]/edit/page.tsx` | Bug 1, 2 | previewKey 의존성 추가, 상태 동기화 |
| `src/components/templates/editor/TemplateEditor.tsx` | Bug 2 | onFieldChange callback 또는 상태 리프팅 |
| `src/components/publish/InvitationEditor.tsx` | Bug 3 | sections 기반 필드 추출 로직 추가 |
| `src/components/templates/preview/TemplatePreview.tsx` | Bug 4 | sections 기반 editorData 추출 |

---

## 핵심 참고: use-template-editor.ts 헬퍼 함수

`src/hooks/use-template-editor.ts`에 이미 유용한 헬퍼가 있음:

```typescript
// 섹션 기반 필드를 flat 배열로 변환
export function sectionFields(template: Template): TemplateField[]

// 섹션 기반 데이터 추출
export function getSectionData(template: Template, fieldValues: Record<string, string>): Record<string, string>

// 필드가 속한 섹션 찾기
export function findSectionForField(template: Template, fieldName: string): Section | undefined
```

이 헬퍼들을 Bug 3, Bug 4 해결에 활용 가능.

---

## 핵심 참고: TemplateEngine.tsx 렌더링 로직

`src/components/templates/engine/TemplateEngine.tsx`는 sections 기반 템플릿을 이미 지원:

```typescript
// sections가 있으면 sections 기반으로 렌더링
if (template.sections && template.sections.length > 0) {
  const sorted = [...template.sections].sort((a, b) => a.order - b.order);
  return sorted.map(section => renderSection(section, data));
}
// 아니면 기존 fields 기반으로 렌더링
```

TemplateEngine은 이미 정상 작동 — preview에서 sections 기반 데이터가 전달되기만 하면 됨.

---

## 테스트 방법

1. 템플릿 목록에서 템플릿 클릭 → "편집하기"
2. 필드 수정 → 미리보기가 실시간으로 업데이트되는지 확인
3. 새 템플릿 생성 → 편집기에서 필드 수정 가능 여부 확인
4. TemplatePreview 모달에서 섹션 기반 데이터가 제대로 표시되는지 확인

---

## 빌드 테스트

모든 수정 후:
```bash
npx tsc --noEmit && npm run build
```

---

## 시작 명령어

```bash
# 1. 먼저 현재 상태 확인
cat .planning/STATE.md | head -20

# 2. 버그 파일들 확인
wc -l src/app/\(main\)/templates/\[id\]/edit/page.tsx
wc -l src/components/templates/editor/TemplateEditor.tsx
wc -l src/components/publish/InvitationEditor.tsx
wc -l src/components/templates/preview/TemplatePreview.tsx

# 3. Bug 1~4 순차적 수정
# 4. 빌드 테스트
npx tsc --noEmit && npm run build

# 5. STATE.md 업데이트 (Phase 17 완료로 변경)
```

---

## STATE.md 참고

`.planning/STATE.md`의 "Phase 17 치명적 버그 (BUG-FIX-NOTES)" 섹션에 상세 정보가 있음.

---

## 대안: 직접 /gsd 명령어 입력

```bash
# Phase 17 버그 수정 논의
/gsd-discuss-phase

# 또는 직접 실행
/gsd-execute-phase
```

---

## 중요 주의사항

1. **TemplateEngine.tsx는 수정 불필요** — 이미 sections 기반 렌더링 정상 작동
2. **FieldEditor.tsx는 수정 불필요** — SectionEditor 이미 구현됨
3. **sample.ts는 수정 불필요** — 템플릿 현실화 완료됨
4. **Focus: 상태 동기화 + 데이터 흐름** — 컴포넌트 간 상태 전달 로직 수정이 핵심
5. **실시간 미리보기가 핵심 요구사항** — 저장 버튼 누르지 않아도 필드 변경 즉시 preview에 반영되어야 함

```

---

## 파일 구조 참고

```
src/
├── app/(main)/templates/[id]/edit/
│   └── page.tsx                    # Bug 1, 2 수정 필요
├── components/templates/editor/
│   ├── TemplateEditor.tsx          # Bug 2 수정 필요
│   └── FieldEditor.tsx             # 수정 불필요 (이미 구현됨)
├── components/templates/preview/
│   └── TemplatePreview.tsx         # Bug 4 수정 필요
├── components/publish/
│   └── InvitationEditor.tsx        # Bug 3 수정 필요
├── components/templates/engine/
│   └── TemplateEngine.tsx          # 수정 불필요 (이미 구현됨)
├── hooks/
│   └── use-template-editor.ts      # Bug 3, 4 해결에 활용 가능
├── data/templates/
│   └── sample.ts                   # 수정 불필요 (이미 현실화 완료)
└── types/
    └── template.ts                 # 변경 없음
```
