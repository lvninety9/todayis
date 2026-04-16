---
phase: 01-template-engine
plan: 02
type: execute
wave: 2
depends_on: [01-template-engine-01]
files_modified: []
autonomous: false
requirements: [TEMPLATE-02, TEMPLATE-03]
must_haves:
  truths:
    - "템플릿이 실제 데이터로 렌더링됨"
    - "텍스트, 날짜, 이미지, 위치 필드가 올바르게 표시됨"
    - "빈 값이 있을 경우 기본값이 표시됨"
  artifacts:
    - path: "src/lib/template-utils.ts"
      provides: "템플릿 유틸리티 함수"
      exports: ["validateTemplateData", "getDefaultValue", "renderField"]
    - path: "src/data/templates/sample.ts"
      provides: "샘플 템플릿 데이터"
      exports: ["WEDDING_TEMPLATE", "BIRTHDAY_TEMPLATE"]
    - path: "src/components/templates/engine/TemplateEngine.tsx"
      provides: "실제 렌더링 로직"
      changes: "skeleton → 구현"
  key_links:
    - from: "src/components/templates/engine/TemplateEngine.tsx"
      to: "src/lib/template-utils.ts"
      via: "Utility functions"
      pattern: "import.*template-utils"
    - from: "src/components/templates/engine/TemplateEngine.tsx"
      to: "src/data/templates/sample.ts"
      via: "Sample template usage"
      pattern: "import.*sample"
---

# Phase 1: 템플릿 엔진 개발 - PLAN 02

## Objective
실제 템플릿 렌더링 로직 구현 및 기본 템플릿 데이터 생성

Purpose: skeleton 을 실제 작동하는 렌더링 시스템으로 구현
Output: 작동하는 템플릿 엔진, 샘플 템플릿 데이터

## Execution Context

### Dependencies
- Plan 01 에서 정의된 타입 (src/types/template.ts)
- Plan 01 에서 생성된 컴포넌트 skeleton

### Interface Context
From src/types/template.ts (Plan 01 output):
```typescript
export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  fields: TemplateField[];
  layout: string;
}

export interface TemplateField {
  name: string;
  type: 'text' | 'date' | 'image' | 'location';
  label: string;
  required: boolean;
  defaultValue: string | null;
}

export interface TemplateData {
  templateId: string;
  values: Record<string, string>;
  validate(): boolean;
}
```

## Must Haves

### Truths
1. 템플릿이 실제 데이터로 렌더링됨
2. 텍스트, 날짜, 이미지, 위치 필드가 올바르게 표시됨
3. 빈 값이 있을 경우 기본값이 표시됨

### Artifacts
- path: `src/components/templates/engine/TemplateEngine.tsx`
  provides: "실제 렌더링 로직"
  changes: "skeleton → 구현"
- path: `src/data/templates/sample.ts`
  provides: "샘플 템플릿 데이터"
  exports: ["WEDDING_TEMPLATE", "BIRTHDAY_TEMPLATE"]
- path: `src/lib/template-utils.ts`
  provides: "템플릿 유틸리티 함수"
  exports: ["validateTemplateData", "getDefaultValue"]

### Key Links
- from: `src/components/templates/engine/TemplateEngine.tsx`
  to: `src/data/templates/sample.ts`
  via: "Sample template usage"
  pattern: "import.*sample"
- from: `src/components/templates/engine/TemplateEngine.tsx`
  to: `src/lib/template-utils.ts`
  via: "Utility functions"
  pattern: "import.*template-utils"

## Tasks

<task type="auto">
  <name>Task 1: 템플릿 유틸리티 함수 구현</name>
  <files>src/lib/template-utils.ts</files>
  <action>
    템플릿 처리를 위한 유틸리티 함수 구현:
    
    1. `validateTemplateData(data: TemplateData, fields: TemplateField[]): boolean`
       - 모든 required 필드가 값이 있는지 확인
       - 유효한 날짜 형식 확인 (date 타입)
       - 반환: 유효하면 true, 아니면 false
    
    2. `getDefaultValue(value: string | null, field: TemplateField): string`
       - 값이 null 이면 field.defaultValue 반환
       - 값이 있으면 해당 값 반환
    
    3. `renderField(value: string, fieldType: string): React.ReactNode`
       - fieldType 에 따른 렌더링 로직:
         - 'text': plain text
         - 'date': formatted date (YYYY 년 MM 월 DD 일)
         - 'image': img tag with alt
         - 'location': text + map link skeleton
    
    Reference: AGENTS.md 의 유틸리티 함수 패턴 준수
  </action>
  <verify>
    <automated>cd src/lib && npx tsc --noEmit template-utils.ts</automated>
  </verify>
  <done>
    - validateTemplateData 함수 구현 완료
    - getDefaultValue 함수 구현 완료
    - renderField 함수 구현 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 샘플 템플릿 데이터 생성</name>
  <files>src/data/templates/sample.ts</files>
  <action>
    MVP 에 사용할 샘플 템플릿 2 개 생성:
    
    1. WEDDING_TEMPLATE (웨딩 초대장):
       - fields: [groomName, brideName, date, location, message]
       - 각 필드의 type, label, required 설정
    
    2. BIRTHDAY_TEMPLATE (생일 초대장):
       - fields: [hostName, birthday, date, time, location, message]
       - 각 필드의 type, label, required 설정
    
    3. Sample TemplateData 생성 함수:
       - `getSampleWeddingData(): TemplateData`
       - `getSampleBirthdayData(): TemplateData`
       - 기본값으로 채워진 데이터 반환
    
    Note: 실제 데이터는 사용자가 수정할 것 (sample 은 시작점)
  </action>
  <verify>
    <automated>cd src/data/templates && npx tsc --noEmit sample.ts</automated>
  </verify>
  <done>
    - WEDDING_TEMPLATE 상수 정의 완료
    - BIRTHDAY_TEMPLATE 상수 정의 완료
    - Sample 데이터 생성 함수 구현 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 템플릿 엔진 실제 렌더링 구현</name>
  <files>src/components/templates/engine/TemplateEngine.tsx</files>
  <action>
    skeleton 을 실제 렌더링 로직으로 구현:
    
    1. 데이터 유효성 검사:
       - TemplateEngine mount 시 validateTemplateData 호출
       - 유효하지 않으면 에러 메시지 표시
    
    2. 필드별 렌더링 구현:
       - template.fields.forEach 로 순회
       - 각 필드에 대해:
         - getDefaultValue 로 값 결정
         - renderField 로 타입별 렌더링
         - field.label 표시 (선택적)
    
    3. Layout rendering:
       - template.layout 을 파싱하여 렌더링 (skeleton)
       - 현재는 simple container 로 대체
    
    4. Error boundaries:
       - 렌더링 에러 처리
    
    Reference: Plan 01 의 skeleton 구조 유지, 구현만 추가
  </action>
  <verify>
    <automated>cd src/components/templates/engine && npx tsc --noEmit TemplateEngine.tsx</automated>
  </verify>
  <done>
    - 실제 렌더링 로직 구현 완료
    - 유효성 검사 로직 추가됨
    - 필드별 렌더링 구현 완료
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 4: 템플릿 렌더링 시각 검증</name>
  <files>src/components/templates/preview/TemplatePreview.tsx</files>
  <action>
    템플릿 렌더링이 올바르게 작동하는지 시각적으로 확인
  </action>
  <verify>
    <manual>
      1. 다음 URL 로 이동: http://localhost:3000/templates/preview
      2. 웨딩 템플릿 선택 시 다음 확인:
         - 신랑/신부 이름 표시됨
         - 날짜가 "YYYY 년 MM 월 DD 일" 형식으로 표시됨
         - 장소 정보가 표시됨
      3. 생일 템플릿 선택 시 다음 확인:
         - 주최자 이름 표시됨
         - 생일 날짜, 시간, 장소 표시됨
      4. 빈 필드가 있을 경우 기본값이 표시되는지 확인
    </manual>
  </verify>
  <done>
    - 템플릿이 올바르게 렌더링됨
    - 모든 필드가 표시됨
    - 기본값이 올바르게 적용됨
  </done>
</task>

</tasks>

## Verification

### Automated Checks
```bash
# 타입 체크
npx tsc --noEmit

#lint
npm run lint -- src/lib/template-utils.ts src/data/templates/

# 유틸리티 함수 테스트
node -e "
const { validateTemplateData, getDefaultValue, renderField } = require('./src/lib/template-utils.ts');
const testField = { name: 'test', type: 'text', label: 'Test', required: true, defaultValue: 'Default' };
const testData = { templateId: '1', values: { test: 'Value' } };
console.log('validate:', validateTemplateData(testData, [testField]));
console.log('default:', getDefaultValue(null, testField));
console.log('render:', renderField('Test', 'text'));
"
```

### Manual Verification
1. 템플릿 미리보기 페이지에서 템플릿이 올바르게 표시되는지 확인
2. 모든 필드가 값이 있을 때와 없을 때 (기본값) 확인
3. 날짜 형식이 올바르게 포맷팅되는지 확인

## Success Criteria

- [ ] src/lib/template-utils.ts 에 유틸리티 함수 3 개 구현 완료
- [ ] src/data/templates/sample.ts 에 샘플 템플릿 2 개 정의 완료
- [ ] src/components/templates/engine/TemplateEngine.tsx 에 실제 렌더링 로직 구현 완료
- [ ] 웨딩 템플릿과 생일 템플릿이 모두 올바르게 렌더링됨
- [ ] 빈 필드가 기본값으로 표시됨
- [ ] TypeScript 타입 체크 통과

## Output
After completion, create `.planning/phases/01-template-engine/01-template-engine-02-SUMMARY.md`
