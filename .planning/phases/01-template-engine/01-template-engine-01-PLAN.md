---
phase: 01-template-engine
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: [TEMPLATE-01]
must_haves:
  truths:
    - "템플릿 파일이 정의된 구조로 저장됨"
    - "템플릿 데이터가 바인딩되어 렌더링됨"
    - "실시간 미리보기가 가능함"
  artifacts:
    - path: "src/types/template.ts"
      provides: "템플릿 타입 정의"
      exports: ["Template", "TemplateData", "TemplateField"]
    - path: "src/components/templates/preview/TemplatePreview.tsx"
      provides: "템플릿 미리보기 컴포넌트"
      min_lines: 50
    - path: "src/components/templates/engine/TemplateEngine.tsx"
      provides: "템플릿 렌더링 엔진"
      min_lines: 80
  key_links:
    - from: "src/components/templates/preview/TemplatePreview.tsx"
      to: "src/types/template.ts"
      via: "Type import"
      pattern: "import.*TemplateData"
    - from: "src/components/templates/engine/TemplateEngine.tsx"
      to: "src/components/templates/preview/TemplatePreview.tsx"
      via: "Component composition"
      pattern: "TemplatePreview"
---

# Phase 1: 템플릿 엔진 개발 - PLAN 01

## Objective
템플릿 엔진의 기본 아키텍처와 프로젝트 구조 설정

Purpose: 템플릿 렌더링 시스템의 기반을 마련하고, 확장 가능한 구조 설계
Output: 프로젝트 구조, 타입 정의, 기본 컴포넌트 skeleton

## Execution Context

### Project Context
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Phase Goal**: 기본 템플릿 렌더링 시스템, 실시간 미리보기, 데이터 바인딩 구현

### Discovery Level: Level 0 (Internal Patterns Only)
- Next.js 14 App Router 패턴 사용
- shadcn/ui 컴포넌트 재사용
- TypeScript strict 모드

### User Decisions (Locked)
- Next.js 14 App Router 사용
- shadcn/ui + Tailwind CSS v4
- Subpath routing for public invitations

### User Setup Required
None - all work is internal development

## Must Haves

### Truths
1. 템플릿 파일이 정의된 구조로 저장됨
2. 템플릿 데이터가 바인딩되어 렌더링됨
3. 실시간 미리보기가 가능함

### Artifacts
- path: `src/types/template.ts`
  provides: "템플릿 타입 정의"
  exports: ["Template", "TemplateData", "TemplateField"]
- path: `src/components/templates/preview/TemplatePreview.tsx`
  provides: "템플릿 미리보기 컴포넌트"
  min_lines: 50
- path: `src/components/templates/engine/TemplateEngine.tsx`
  provides: "템플릿 렌더링 엔진"
  min_lines: 80

### Key Links
- from: `src/components/templates/preview/TemplatePreview.tsx`
  to: `src/types/template.ts`
  via: "Type import"
  pattern: "import.*TemplateData"
- from: `src/components/templates/engine/TemplateEngine.tsx`
  to: `src/components/templates/preview/TemplatePreview.tsx`
  via: "Component composition"
  pattern: "TemplatePreview"

## Tasks

<task type="auto">
  <name>Task 1: 템플릿 타입 정의 생성</name>
  <files>src/types/template.ts</files>
  <action>
    템플릿 시스템의 핵심 타입 정의 생성:
    
    1. `Template` 인터페이스:
       - id: string (고유 식별자)
       - name: string (템플릿 이름)
       - category: string (카테고리)
       - thumbnail: string (썸네일 URL)
       - fields: TemplateField[] (정의된 필드 목록)
       - layout: string (레이아웃 JSON 또는 경로)
    
    2. `TemplateField` 인터페이스:
       - name: string (필드 이름)
       - type: 'text' | 'date' | 'image' | 'location' (필드 타입)
       - label: string (표시 라벨)
       - required: boolean (필수 여부)
       - defaultValue: string | null (기본값)
    
    3. `TemplateData` 인터페이스:
       - templateId: string
       - values: Record<string, string> (필드 값 매핑)
       - validate(): boolean (유효성 검사)
    
    4. Export all types for reuse
    
    Reference: AGENTS.md의 타입 스타일 가이드 준수
  </action>
  <verify>
    <automated>cd src/types && npx tsc --noEmit template.ts</automated>
  </verify>
  <done>
    - Template, TemplateField, TemplateData 인터페이스 정의 완료
    - 모든 타입 export됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 2: 템플릿 엔진 컴포넌트 skeleton 생성</name>
  <files>src/components/templates/engine/TemplateEngine.tsx</files>
  <action>
    템플릿 렌더링 엔진의 기본 구조 생성:
    
    1. TemplateEngine 컴포넌트 생성:
       - Props: { template: Template; data: TemplateData }
       - TemplateData.validate() 호출하여 유효성 검사
       - 유효하지 않으면 에러 UI 표시
    
    2. 데이터 바인딩 로직:
       - template.fields.forEach 로 각 필드 순회
       - data.values[field.name] 에서 값 가져오기
       - field.type 에 따른 렌더링 로직 skeleton (현재는 placeholder)
    
    3. Error handling:
       - Missing field values 처리
       - Invalid data 처리
    
    4. Export default TemplateEngine
    
    Note: 실제 렌더링 로직은 Task 3 에서 구현 (skeleton 우선)
  </action>
  <verify>
    <automated>cd src/components/templates/engine && npx tsc --noEmit TemplateEngine.tsx</automated>
  </verify>
  <done>
    - TemplateEngine 컴포넌트 생성됨
    - Template 과 TemplateData 타입 import 됨
    - 데이터 바인딩 skeleton 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

<task type="auto">
  <name>Task 3: 미리보기 컴포넌트 skeleton 생성</name>
  <files>src/components/templates/preview/TemplatePreview.tsx</files>
  <action>
    템플릿 미리보기 컴포넌트의 기본 구조 생성:
    
    1. TemplatePreview 컴포넌트 생성:
       - Props: { template: Template; data: TemplateData; onUpdate?: (data: TemplateData) => void }
       - TemplateEngine 을 내부에서 사용
    
    2. 실시간 미리보기 구조:
       - Preview area (렌더링 결과 표시)
       - Edit controls skeleton (Task 4 에서 구현)
    
    3. Responsive layout:
       - Tailwind CSS 사용
       - Desktop/Mobile 미리보기 전환 skeleton
    
    4. Export default TemplatePreview
    
    Reference: shadcn/ui 컴포넌트 패턴 준수
  </action>
  <verify>
    <automated>cd src/components/templates/preview && npx tsc --noEmit TemplatePreview.tsx</automated>
  </verify>
  <done>
    - TemplatePreview 컴포넌트 생성됨
    - TemplateEngine 컴포넌트 import 됨
    - 미리보기 레이아웃 skeleton 구현됨
    - TypeScript 타입 체크 통과
  </done>
</task>

</tasks>

## Verification

### Automated Checks
```bash
# 타입 체크
npx tsc --noEmit

#lint
npm run lint -- src/types/template.ts src/components/templates/

# 컴포넌트 구조 검증
node -e "const fs = require('fs'); const files = ['src/types/template.ts', 'src/components/templates/engine/TemplateEngine.tsx', 'src/components/templates/preview/TemplatePreview.tsx']; files.forEach(f => { if (!fs.existsSync(f)) throw new Error('Missing: ' + f); }); console.log('All files exist');"
```

### Manual Verification
1. 타입 파일이 모든 필요한 인터페이스를 export 하는지 확인
2. 컴포넌트들이 타입을 올바르게 import 하는지 확인
3. TypeScript 컴파일이 에러 없이 완료되는지 확인

## Success Criteria

- [ ] src/types/template.ts 에 Template, TemplateField, TemplateData 타입 정의 완료
- [ ] src/components/templates/engine/TemplateEngine.tsx 에 렌더링 엔진 skeleton 구현
- [ ] src/components/templates/preview/TemplatePreview.tsx 에 미리보기 컴포넌트 skeleton 구현
- [ ] 모든 파일 TypeScript 타입 체크 통과
- [ ] 컴포넌트 간 타입 의존성 올바르게 설정됨

## Output
After completion, create `.planning/phases/01-template-engine/01-template-engine-01-SUMMARY.md`
