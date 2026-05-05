# 새 세션 시작 프롬프트 — Bug 2: TemplateEditor 상태 동기화

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
- Phase 17 (템플릿 시스템 전면 개편): 4개 plan 완료, **Bug 1 수정 완료** (커밋 `6834d8d`)
- **Bug 2~4 아직 수정 필요**
- 빌드: tsc ✅, npm run build ✅

## 🚨 현재 작업: Bug 2 — TemplateEditor 상태 동기화

Bug 1은 수정 완료. 이번 세션에서는 **Bug 2만** 수정합니다.

---

## Bug 2: TemplateEditor 내부 상태와 페이지 상태 동기화 안됨

**파일:** `src/app/(main)/templates/[id]/edit/page.tsx` + `src/components/templates/editor/TemplateEditor.tsx`

**문제:**
- 페이지 컴포넌트가 `sectionFieldValues` 관리
- TemplateEditor가 내부 state를 가짐
- `initialData`로 값 전달은 되지만, 에디터 변경사항이 페이지 state로 안 돌아옴
- `onUpdate`는 저장 시에만 호출 (실시간 동기화 아님)

**해결책:**
- `TemplateEditor`에 `onFieldChange` callback prop 추가
- TemplateEditor 내부에서 필드 변경 시 `onFieldChange` 호출
- 페이지 컴포넌트에서 `onFieldChange` → `setSectionFieldValues`로 연결

---

## 수정해야 할 파일 (2개만 읽음)

| 파일 | 줄 수 | 비고 |
|------|-------|------|
| `src/components/templates/editor/TemplateEditor.tsx` | ~300줄 | onFieldChange prop 추가 |
| `src/app/(main)/templates/[id]/edit/page.tsx` | ~620줄 | 이미 Bug 1 수정됨, onFieldChange 전달만 추가 |

---

## 핵심 참고: use-template-editor.ts 헬퍼 함수

`src/hooks/use-template-editor.ts`에 이미 유용한 헬퍼가 있음:

```typescript
export function sectionFields(template: Template): TemplateField[]
export function getSectionData(template: Template, fieldValues: Record<string, string>): Record<string, string>
export function findSectionForField(template: Template, fieldName: string): Section | undefined
```

---

## 테스트 방법

1. 템플릿 편집기에서 필드 수정
2. split-view 미리보기가 **실시간으로** 업데이트되는지 확인 (저장 버튼 안 누르고)

---

## 빌드 테스트

모든 수정 후:
```bash
npx tsc --noEmit && npm run build
```

---

## STATE.md 참고

`.planning/STATE.md`의 "Phase 17 치명적 버그" 섹션 참조
Bug 1은 ✅ 고정됨 — Bug 2만 이번 세션에서 수정

---

## 중요 주의사항

1. **Focus: 상태 동기화** — TemplateEditor 내부 변경사항이 page state로 전달되어야 함
2. **실시간 미리보기가 핵심** — 저장 버튼 누르지 않아도 필드 변경 즉시 preview에 반영
3. **onFieldChange callback 패턴** — controlled component 방식으로 구현
4. **토큰 효율:** 파일 2개만 읽음, Bug 2만 수정 (Bug 3, 4는 다음 세션)

```

---

## 파일 구조 참고

```
src/
├── app/(main)/templates/[id]/edit/
│   └── page.tsx                    # Bug 2: onFieldChange prop 전달 추가
├── components/templates/editor/
│   └── TemplateEditor.tsx          # Bug 2: onFieldChange prop + callback
├── hooks/
│   └── use-template-editor.ts      # 참고용
└── types/
    └── template.ts                 # 변경 없음
```
