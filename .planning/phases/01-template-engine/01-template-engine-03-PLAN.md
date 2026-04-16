---
phase: 01-template-engine
plan: 03
type: execute
wave: 3
depends_on: [01-template-engine-02]
files_modified: []
autonomous: false
requirements: [TEMPLATE-03, TEMPLATE-04]
must_haves:
  truths:
    - "사용자가 필드 값을 수정하면 즉시 미리보기에 반영됨"
    - "편집기에서 값 입력 시 실시간으로 표시됨"
    - "유효성 검사 에러가 실시간으로 표시됨"
  artifacts:
    - path: "src/hooks/use-template-editor.ts"
      provides: "템플릿 편집기 hook"
      exports: ["useTemplateEditor"]
    - path: "src/components/templates/editor/FieldEditor.tsx"
      provides: "필드별 편집기 컴포넌트"
      min_lines: 60
    - path: "src/components/templates/editor/TemplateEditor.tsx"
      provides: "템플릿 편집기 컴포넌트"
      min_lines: 100
  key_links:
    - from: "src/components/templates/editor/TemplateEditor.tsx"
      to: "src/hooks/use-template-editor.ts"
      via: "Custom hook"
      pattern: "useTemplateEditor"
    - from: "src/components/templates/editor/TemplateEditor.tsx"
      to: "src/components/templates/editor/FieldEditor.tsx"
      via: "Component composition"
      pattern: "FieldEditor"
    - from: "src/components/templates/preview/TemplatePreview.tsx"
      to: "src/components/templates/editor/TemplateEditor.tsx"
      via: "Shared state"
      pattern: "onUpdate"
---

# Phase 1: 템플릿 엔진 개발 - PLAN 03

## Objective
실시간 미리보기 기능 구현 및 편집기 기본 구조 생성

Purpose: 사용자가 템플릿을 실시간으로 확인하고 수정할 수 있는 인터페이스 제공
Output: 실시간 미리보기 기능, 편집기 컴포넌트 skeleton

## Execution Context

### Dependencies
- Plan 01: 타입 정의, 컴포넌트 skeleton
- Plan 02: 템플릿 유틸리티, 샘플 템플릿, 렌더링 엔진

### Interface Context
From src/components/templates/engine/TemplateEngine.tsx (Plan 02 output):
```typescript
export function TemplateEngine({ template, data }: {
  template: Template;
  data: TemplateData;
}): React.ReactNode;
```

From src/lib/template-utils.ts (Plan 02 output):
```typescript
export function validateTemplateData(data: TemplateData, fields: TemplateField[]): boolean;
export function getDefaultValue(value: string | null, field: TemplateField): string;
export function renderField(value: string, fieldType: string): React.ReactNode;
```

## Must Haves

### Truths
1. 사용자가 필드 값을 수정하면 즉시 미리보기에 반영됨
2. 편집기에서 값 입력 시 실시간으로 표시됨
3. 유효성 검사 에러가 실시간으로 표시됨

### Artifacts
- path: `src/components/templates/editor/TemplateEditor.tsx`
  provides: "템플릿 편집기 컴포넌트"
  min_lines: 100
- path: `src/components/templates/editor/FieldEditor.tsx`
  provides: "필드별 편집기 컴포넌트"
  min_lines: 60
- path: `src/hooks/use-template-editor.ts`
  provides: "템플릿 편집기 hook"
  exports: ["useTemplateEditor"]

### Key Links
- from: `src/components/templates/editor/TemplateEditor.tsx`
  to: `src/components/templates/editor/FieldEditor.tsx`
  via: "Component composition"
  pattern: "FieldEditor"
- from: `src/components/templates/editor/TemplateEditor.tsx`
  to: `src/hooks/use-template-editor.ts`
  via: "Custom hook"
  pattern: "useTemplateEditor"
- from: `src/components/templates/preview/TemplatePreview.tsx`
  to: `src/components/templates/editor/TemplateEditor.tsx`
  via: "Shared state"
  pattern: "onUpdate"

## Tasks

<task type="auto">
  <name>Task 1: 템플릿 편집기 Hook 구현</name>
  <files>src/hooks/use-template-editor.ts</files>
  <action>
    템플릿 편집을 위한 custom hook 구현:
    
    1. `useTemplateEditor(template: Template, initialData?: TemplateData)` hook:
       - State: `data: TemplateData` (현재 데이터)
       - State: `errors: Record<string, string>` (에러 메시지)
       
    2. Methods:
       - `updateField(fieldName: string, value: string): void`
         - 데이터 업데이트
         - 유효성 검사 실행
         - 에러 상태 업데이트
       
       - `validateAll(): boolean`
         - 모든 필드 유효성 검사
         - 에러 상태 반환
       
       - `getErrors(): Record<string, string>`
         - 현재 에러 상태 반환
       
       - `getData(): TemplateData`
         - 현재 데이터 반환
    
    3. Validation logic:
       - required 필드가 빈 값이면 에러
       - date 타입이 유효한 날짜 형식이 아니면 에러
    
    Reference: React hooks pattern 준수, shadcn/ui 의 form hook 패턴 참고
  </action>
  <verify>
    <automated>cd src/hooks && npx tsc --noEmit use-template-editor.ts</automated>
  </verify>
  <done>
    - useTemplateEditor hook 구현 완료
    - updateField, validateAll, getErrors, getData 메서드 구현 완료
    - 유효성 검사 로직 구현 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 필드별 편집기 컴포넌트 구현</name>
  <files>src/components/templates/editor/FieldEditor.tsx</files>
  <action>
    필드 타입별 편집기 컴포넌트 구현:
    
    1. FieldEditor 컴포넌트:
       - Props: { field: TemplateField; value: string; onChange: (value: string) => void; error?: string }
       - fieldType 에 따른 입력 컴포넌트 렌더링:
         - 'text': Input 컴포넌트 (shadcn/ui)
         - 'date': Calendar 컴포넌트 (shadcn/ui)
         - 'image': URL Input 컴포넌트
         - 'location': Input 컴포넌트 (주소) + Map button skeleton
    
    2. Error display:
       - error prop 이 있으면 에러 메시지 표시
       - Red border/text for errors
    
    3. Label display:
       - field.label 표시
       - Required indicator (*) for required fields
    
    4. Export default FieldEditor
    
    Reference: shadcn/ui Input, Calendar 컴포넌트 패턴 준수
  </action>
  <verify>
    <automated>cd src/components/templates/editor && npx tsc --noEmit FieldEditor.tsx</automated>
  </verify>
  <done>
    - FieldEditor 컴포넌트 구현 완료
    - 4 가지 필드 타입별 입력 컴포넌트 구현 완료
    - 에러 표시 로직 구현 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 템플릿 편집기 컴포넌트 구현</name>
  <files>src/components/templates/editor/TemplateEditor.tsx</files>
  <action>
    템플릿 전체 편집기 컴포넌트 구현:
    
    1. TemplateEditor 컴포넌트:
       - Props: { template: Template; initialData?: TemplateData; onUpdate?: (data: TemplateData) => void }
       - useTemplateEditor hook 사용
    
    2. Layout:
       - Left: Field list (필드 목록)
       - Right: FieldEditor per field (필드 편집기)
       - Bottom: Validate button + Save button
    
    3. Features:
       - 필드 순서대로 편집기 표시
       - 각 필드에 FieldEditor 컴포넌트 사용
       - 에러가 있는 필드 표시 (red border)
       - Validate 버튼 클릭 시 validateAll 실행
    
    4. Save functionality:
       - Save 버튼 클릭 시 onUpdate callback 호출
       - 유효성 검사 통과 시에만 호출
    
    5. Export default TemplateEditor
    
    Reference: Plan 01 의 TemplatePreview 와 일관된 디자인
  </action>
  <verify>
    <automated>cd src/components/templates/editor && npx tsc --noEmit TemplateEditor.tsx</automated>
  </verify>
  <done>
    - TemplateEditor 컴포넌트 구현 완료
    - useTemplateEditor hook 사용됨
    - FieldEditor 컴포넌트 composition 됨
    - Validate/Save 버튼 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 4: 실시간 미리보기 컴포넌트 연동</name>
  <files>src/components/templates/preview/TemplatePreview.tsx</files>
  <action>
    TemplatePreview 에 실시간 편집 기능 추가:
    
    1. State management:
       - State: `data: TemplateData` (현재 데이터)
       - onUpdate callback handling
    
    2. Layout update:
       - Split view: Editor (left) + Preview (right)
       - Responsive: Mobile 은 stack, Desktop 은 split
    
    3. Real-time sync:
       - Editor 에서 데이터 변경 시 Preview 즉시 업데이트
       - Preview 에서 직접 수정 skeleton (Task 5 에서 구현)
    
    4. Export default TemplatePreview
    
    Note: Plan 01 의 skeleton 구조 유지, 연동만 추가
  </action>
  <verify>
    <automated>cd src/components/templates/preview && npx tsc --noEmit TemplatePreview.tsx</automated>
  </verify>
  <done>
    - TemplatePreview 에 Editor 연동 구현됨
    - Split view 레이아웃 구현됨
    - 실시간 데이터 동기화 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 5: 실시간 편집기 기능 검증</name>
  <files>src/components/templates/editor/TemplateEditor.tsx, src/components/templates/preview/TemplatePreview.tsx</files>
  <action>
    실시간 편집 및 미리보기 기능이 올바르게 작동하는지 확인
  </action>
  <verify>
    <manual>
      1. 다음 URL 로 이동: http://localhost:3000/templates/editor
      2. 웨딩 템플릿 선택 후 다음 확인:
         - 왼쪽에 필드 편집기 표시
         - 오른쪽에 실시간 미리보기 표시
         - 편집기에서 값 수정 시 오른쪽 미리보기 즉시 반영됨
      3. 필수 필드를 비운 후 Validate 버튼 클릭:
         - 에러 메시지가 표시되는지 확인
         - Red border 가 표시되는지 확인
      4. 모든 필드를 채운 후 Save 버튼 클릭:
         - onUpdate callback 이 호출되는지 확인 (console.log)
      5. Mobile 에서 테스트:
         - Split view 가 stack 으로 변경되는지 확인
    </manual>
  </verify>
  <done>
    - 실시간 편집이 미리보기에 즉시 반영됨
    - 유효성 검사 에러가 올바르게 표시됨
    - Save 버튼이 올바르게 작동함
    - Responsive 레이아웃이 올바르게 작동함
  </done>
</task>

</tasks>

## Verification

### Automated Checks
```bash
# 타입 체크
npx tsc --noEmit

#lint
npm run lint -- src/hooks/use-template-editor.ts src/components/templates/editor/

# Hook 테스트 (skeleton)
node -e "
// TODO: Implement unit tests for useTemplateEditor
console.log('Hook tests - to be implemented');
"
```

### Manual Verification
1. 편집기에서 값 수정 시 실시간 미리보기 확인
2. 유효성 검사 에러 확인
3. Save 버튼 동작 확인
4. Mobile/Desktop 레이아웃 확인

## Success Criteria

- [ ] src/hooks/use-template-editor.ts 에 custom hook 구현 완료
- [ ] src/components/templates/editor/FieldEditor.tsx 에 필드별 편집기 구현 완료
- [ ] src/components/templates/editor/TemplateEditor.tsx 에 전체 편집기 구현 완료
- [ ] src/components/templates/preview/TemplatePreview.tsx 에 실시간 연동 구현 완료
- [ ] 실시간 편집 시 미리보기가 즉시 반영됨
- [ ] 유효성 검사 에러가 올바르게 표시됨
- [ ] Split view 가 Desktop/Mobile 에서 올바르게 작동함
- [ ] TypeScript 타입 체크 통과

## Output
After completion, create `.planning/phases/01-template-engine/01-template-engine-03-SUMMARY.md`
