# Phase 31: Bug 8 — Sample 템플릿 수정/공유 시 404 해결

## 목표

Sample 템플릿(wedding-001, romantic-001, classic-001, modern-001 등)에 대해 PATCH, DELETE, 초대장 생성이 DB upsert 후 정상 동작하도록 수정.

## 배경

- `sample.ts`의 템플릿은 DB에 저장되지 않고 코드에 하드코딩됨
- GET `/api/templates/[id]`은 DB 미찾을 시 `sample.ts`에서 fallback → 성공
- PATCH/DELETE `/api/templates/[id]`는 DB에서만 조회 → sample 템플릿 404
- POST `/api/invitations`도 DB에서만 템플릿 소유자 확인 → sample 템플릿 404
- 영향: 템플릿 이름/카테고리/레이아웃/섹션 변경 불가, 초대장 공유 불가

## 수정할 파일

### 1. `src/app/api/templates/[id]/route.ts` (PATCH, DELETE)

**PATCH 수정 내용:**
- Line 174~185: DB 조회 실패 시 `findSectionBasedTemplate(id)` fallback 추가
- sample 템플릿 발견 시: 현재 로그인 사용자의 `user_id`로 DB에 INSERT (id는 sample.ts의 id 유지)
- INSERT 후 UPDATE (upsert 패턴)
- `is_sample: true` flag를 config에 저장하여 sample 템플릿 식별

**DELETE 수정 내용:**
- Line 281~292: DB 조회 실패 시 `findSectionBasedTemplate(id)` fallback 추가
- sample 템플릿 발견 시: DB에서 해당 user_id로 DELETE
- DB에 없으면 404 반환 (다른 사용자가 삭제한 경우)

### 2. `src/app/api/invitations/route.ts`

**POST 수정 내용:**
- Line 46~57: 템플릿 조회 시 DB 미찾을 시 `findSectionBasedTemplate(id)` fallback 추가
- sample 템플릿 발견 시: 현재 로그인 사용자의 `user_id`로 DB에 INSERT (upsert)
- INSERT 후 소유자 검증 통과 → 초대장 생성 계속

### 3. `src/data/templates/sample.ts` (선택적 — is_sample 식별용)

- `SECTION_BASED_TEMPLATES` 배열에 sample template IDs의 Set을 추가하여 runtime에서 빠르게 식별
- 또는 기존 `findSectionBasedTemplate` 결과에 `isSample: true` flag 추가

## 구현 상세

### 3-1. `src/data/templates/sample.ts` 수정

```typescript
// Template 인터페이스 확장 (isSample flag 추가)
export interface Template {
  // ... 기존 필드
  isSample?: boolean;  // sample.ts에서 온 템플릿인지
}

// findSectionBasedTemplate 수정
export function findSectionBasedTemplate(id: string): Template | undefined {
  const template = SECTION_BASED_TEMPLATES.find((t) => t.id === id);
  if (template) {
    return { ...template, isSample: true };
  }
  return undefined;
}

// sample template ID 목록 (빠른 식별용)
export const SAMPLE_TEMPLATE_IDS = new Set([
  'wedding-001', 'birthday-001',
  'romantic-001', 'classic-001', 'modern-001',
  'premium-romantic-001', 'premium-classic-001',
  'premium-modern-001', 'jang-ding-001',
]);
```

### 3-2. `src/app/api/templates/[id]/route.ts` — PATCH 수정

```typescript
// Line 174~185 변경: DB 조회 + sample fallback + upsert
const { data: existingTemplate, error: fetchError } = await supabase
  .from('templates')
  .select('*')
  .eq('id', id)
  .single();

if (fetchError || !existingTemplate) {
  // sample.ts에서 fallback 조회
  const sampleTemplate = findSectionBasedTemplate(id);
  if (sampleTemplate) {
    // DB에 user의 템플릿으로 INSERT (upsert)
    const insertData = {
      id,
      user_id: user.id,
      name: sampleTemplate.name,
      category: sampleTemplate.category,
      thumbnail: sampleTemplate.thumbnail,
      fields: sampleTemplate.fields || [],
      layout: sampleTemplate.layout || 'simple',
      config: { sections: sampleTemplate.sections || [], is_sample: true },
      is_published: false,
      download_count: 0,
      price: sampleTemplate.price || 0,
      is_premium: sampleTemplate.isPremium || false,
    };
    
    const { data: insertedTemplate, error: insertError } = await supabase
      .from('templates')
      .upsert(insertData, { onConflict: 'id' })
      .select()
      .single();
    
    if (insertError) {
      console.error('Sample template upsert error:', insertError);
      return NextResponse.json(
        { error: '템플릿 초기화 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    // insertedTemplate로 계속 진행 (아래 updateData 로직과 연결)
    // existingTemplate을 insertedTemplate로 교체
  } else {
    return NextResponse.json(
      { error: '템플릿을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
}
```

### 3-3. `src/app/api/templates/[id]/route.ts` — DELETE 수정

```typescript
// Line 281~292 변경: DB 조회 + sample fallback
const { data: existingTemplate, error: fetchError } = await supabase
  .from('templates')
  .select('*')
  .eq('id', id)
  .single();

if (fetchError || !existingTemplate) {
  // sample.ts에서 fallback 조회 (소유권 확인용)
  const sampleTemplate = findSectionBasedTemplate(id);
  if (sampleTemplate) {
    // sample 템플릿은 모든 로그인 사용자에게 소유권 부여
    // DB에 해당 user의 row가 없으면 먼저 INSERT
    const insertData = {
      id,
      user_id: user.id,
      name: sampleTemplate.name,
      category: sampleTemplate.category,
      thumbnail: sampleTemplate.thumbnail,
      fields: sampleTemplate.fields || [],
      layout: sampleTemplate.layout || 'simple',
      config: { sections: sampleTemplate.sections || [], is_sample: true },
      is_published: false,
      download_count: 0,
      price: sampleTemplate.price || 0,
      is_premium: sampleTemplate.isPremium || false,
    };
    
    await supabase.from('templates').upsert(insertData, { onConflict: 'id' });
  } else {
    return NextResponse.json(
      { error: '템플릿을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
}

// 그 후 기존 소유자 검증 + DELETE 로직 계속
```

### 3-4. `src/app/api/invitations/route.ts` — POST 수정

```typescript
// Line 46~57 변경: 템플릿 조회 + sample fallback + upsert
const { data: template, error: templateError } = await supabase
  .from('templates')
  .select('id, user_id')
  .eq('id', templateId)
  .single();

if (templateError || !template) {
  // sample.ts에서 fallback 조회
  const sampleTemplate = findSectionBasedTemplate(templateId);
  if (sampleTemplate) {
    // DB에 user의 템플릿으로 upsert
    const insertData = {
      id: templateId,
      user_id: user.id,
      name: sampleTemplate.name,
      category: sampleTemplate.category,
      thumbnail: sampleTemplate.thumbnail,
      fields: sampleTemplate.fields || [],
      layout: sampleTemplate.layout || 'simple',
      config: { sections: sampleTemplate.sections || [], is_sample: true },
      is_published: false,
      download_count: 0,
      price: sampleTemplate.price || 0,
      is_premium: sampleTemplate.isPremium || false,
    };
    
    const { data: insertedTemplate, error: insertError } = await supabase
      .from('templates')
      .upsert(insertData, { onConflict: 'id' })
      .select('id, user_id')
      .single();
    
    if (insertError) {
      console.error('Sample template upsert for invitation error:', insertError);
      return NextResponse.json(
        { error: '템플릿 초기화 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    template = insertedTemplate;
  }
}

if (templateError || !template) {
  return NextResponse.json(
    { error: '템플릿을 찾을 수 없습니다.' },
    { status: 404 }
  );
}
```

## 검증 기준

### 성공 기준 (Acceptance Criteria)

1. **PATCH sample 템플릿**: romantic-001 템플릿의 name을 "내 로맨틱"으로 변경 시 200 반환, DB에 저장됨
2. **DELETE sample 템플릿**: romantic-001 템플릿 삭제 시 200 반환, DB에서 제거됨
3. **초대장 생성 sample 템플릿**: romantic-001로 초대장 생성 시 200 반환, slug 생성됨
4. **GET sample 템플릿**: 기존 동작 유지 (DB에 있으면 DB에서, 없으면 sample.ts에서)
5. **중복 upsert 방지**: 같은 sample 템플릿을 두 번 PATCH해도 DB에 duplicate 없음
6. **기존 DB 템플릿 영향 없음**: DB에 이미 저장된 user 템플릿은 기존 로직 그대로 동작

### 테스트 전략

1. **수동 테스트 (모바일)**:
   - https://todayis-my.vercel.app 로그인
   - 템플릿 목록에서 "로맨틱 웨딩" 선택 → 편집
   - 템플릿 이름 변경 → 저장 → 200 확인
   - 템플릿 삭제 → 200 확인
   - 템플릿 생성 → 공유 → 초대장 생성 200 확인

2. **빌드/린트 검증**:
   - `npm run build` — 에러 없음
   - `npm run lint` — 경고 없음

### 실패 시 rollback

- 변경된 파일 3개만 수정 (route.ts 2개, sample.ts 1개)
- git stash → 원상 복구 가능
- DB upsert은 id 기준 onConflict이므로 데이터 손실 없음

## 의존성

- 기존 sample.ts의 `findSectionBasedTemplate` 함수에 의존
- Supabase `upsert` (onConflict) 기능 사용 — Supabase 기본 지원
- 기존 API 응답 구조 변경 없음 (호환성 유지)

## 예상 영향 범위

| 파일 | 변경 유형 | 영향도 |
|------|-----------|--------|
| `src/app/api/templates/[id]/route.ts` | PATCH/DELETE 로직 확장 | 낮음 (fallback 추가) |
| `src/app/api/invitations/route.ts` | POST 로직 확장 | 낮음 (fallback 추가) |
| `src/data/templates/sample.ts` | isSample flag 추가 | 낮음 (선택적) |

## 타임라인

- PATCH route.ts 수정: ~15분
- DELETE route.ts 수정: ~10분
- invitations route.ts 수정: ~10분
- sample.ts 수정 (선택적): ~5분
- 빌드/린트 검증: ~5분
- 수동 테스트: ~10분
- **총 예상 시간: ~55분**
