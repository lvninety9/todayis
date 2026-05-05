# Phase 14: 버그 수정 + 템플릿 UX 개선 — Plan

**Phase Goal**: Phase 13 디자인 시스템 적용 후 발견된 버그 수정 및 템플릿 UX 개선
**Verification Method**: Code review + build check + manual testing
**Context**: `.planning/phases/14-ux/14-CONTEXT.md`

## Requirements Mapping

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| BUG-01: 로고 클릭 → /landing | Plan | `layout.tsx` href 변경 |
| BUG-02: Root redirect → /landing | Plan | `page.tsx` redirect 변경 |
| BUG-03: TemplateEngine 빈 상태 처리 | Plan | placeholder 추가 |
| UX-02: indigo → warm palette | Plan | CSS variables 교체 |
| UX-03: TemplateCard 클릭 → 미리보기 | Plan | router.push 추가 |

## Plans

### Plan 01: Bug Fixes (로고 + Root redirect)
**Goal**: 로고 클릭 → /landing, root → /landing redirect

**Files**:
- `src/app/(main)/layout.tsx` — line 39
- `src/app/page.tsx` — line 4

**Tasks**:
1. `src/app/(main)/layout.tsx:39` — `href="/"` → `href="/landing"`
2. `src/app/page.tsx:4` — `redirect('/login')` → `redirect('/landing')`

**Verification**:
- [ ] layout.tsx line 39: `href="/landing"`
- [ ] page.tsx line 4: `redirect('/landing')`

---

### Plan 02: Template Card Click → Preview
**Goal**: TemplateCard 클릭 시 `/templates/[id]` 미리보기 페이지 이동

**Files**:
- `src/components/templates/library/TemplateCard.tsx`

**Tasks**:
1. `TemplateCard`에 `Router` import 추가
2. Card 전체를 `<Link>`로 감싸거나 `onClick` 핸들러 추가
3. `mode="view"`일 때만 클릭 활성화
4. Edit/Delete 버튼은 `stopPropagation()` 유지

**Before**:
```tsx
<Card className="group rounded-xl ... cursor-pointer ...">
```
클릭 이벤트 없음 — 카드가 cursor-pointer이지만 navigation 없음

**After**:
```tsx
'use client';
import { useRouter } from 'next/navigation';

export function TemplateCard({ template, mode = 'view', onSelect, onDelete }) {
  const router = useRouter();
  
  return (
    <div onClick={() => mode === 'view' && router.push(`/templates/${template.id}`)}>
      <Card className="group rounded-xl ...">
        {/* ... content ... */}
        {mode === 'edit' && (
          <div className="flex gap-2 mt-3">
            {onSelect && (
              <Button onClick={(e) => { e.stopPropagation(); onSelect(template); }}>
                ✏️ Edit
              </Button>
            )}
            {onDelete && (
              <Button onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                🗑️ Delete
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
```

**Verification**:
- [ ] TemplateCard 클릭 → `/templates/[id]`로 이동
- [ ] Edit 모드에서 Edit/Delete 버튼 클릭 시 navigation 방지 (stopPropagation)

---

### Plan 03: Warm Palette Application
**Goal**: Hard-coded indigo/purple/pink → CSS variables (terracotta/sage/blush)

**Files**:
- `src/app/(main)/dashboard/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/components/templates/preview/TemplatePreview.tsx`

**Changes**:

#### dashboard/page.tsx
| Line | Before | After |
|------|--------|-------|
| 101 | `from-indigo-500 to-purple-500` | `from-[hsl(var(--primary))] to-[hsl(var(--terracotta-light))]` |
| 115 | `from-pink-500 to-rose-500` | `from-[hsl(var(--accent))] to-[hsl(var(--blush-light))]` |
| 129 | `from-green-500 to-emerald-500` | `from-[hsl(var(--secondary))] to-[hsl(var(--sage-light))]` |
| 147 | `bg-indigo-100 dark:bg-indigo-900/50` | `bg-[hsl(var(--primary))/0.1] dark:bg-[hsl(var(--primary))/0.2]` |
| 148 | `text-indigo-600 dark:text-indigo-400` | `text-[hsl(var(--primary))] dark:text-[hsl(var(--primary))]` |

#### login/page.tsx
| Line | Before | After |
|------|--------|-------|
| 26 | `text-indigo-600 hover:text-indigo-500` | `text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]` |
| 36 | `text-indigo-600 hover:text-indigo-500` | `text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]` |
| 59 | `text-indigo-600 hover:text-indigo-500` | `text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]` |

#### TemplatePreview.tsx
| Line | Before | After |
|------|--------|-------|
| 72 | `bg-indigo-600 text-white` | `bg-[hsl(var(--primary))] text-white` |
| 82 | `bg-indigo-600 text-white` | `bg-[hsl(var(--primary))] text-white` |
| 94 | `bg-indigo-600` | `bg-[hsl(var(--primary))]` |
| 94 | `hover:bg-indigo-700` | `hover:bg-[hsl(var(--terracotta-dark))]` |

**Verification**:
- [ ] dashboard: indigo/purple/pink/green hard-coded 0개
- [ ] login: indigo hard-coded 0개
- [ ] TemplatePreview: indigo-600 hard-coded 0개
- [ ] `grep -r "indigo" src/app/(main)/dashboard/ src/app/(auth)/login/ src/components/templates/preview/` → 0 matches (Tailwind class 기준)

---

### Plan 04: Empty State Handling
**Goal**: TemplateEngine에서 fields가 비어있을 때 placeholder 표시

**Files**:
- `src/components/templates/engine/TemplateEngine.tsx`

**Tasks**:
1. `template.fields.length === 0` 또는 모든 field value가 null일 때 placeholder 표시
2. placeholder 디자인: warm palette 배경 + 아이콘 + 안내 메시지

**Before**:
```tsx
if (!isValid) {
  return (
    <div className="template-engine error">
      <div className="error-message">
        <h3>Invalid Template Data</h3>
        <p>Some required fields are missing or invalid.</p>
      </div>
    </div>
  );
}
```

**After**:
```tsx
// 빈 필드 체크
const hasAnyValue = template.fields.some(f => {
  const val = data.getValue(f.name);
  return val && val !== '';
});

if (!isValid) {
  return (
    <div className="template-engine error min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--primary))/0.1] flex items-center justify-center">
          <svg className="w-8 h-8 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          데이터를 입력해주세요
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          편집기에서 이름, 날짜, 장소 등을 입력하면 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
```

**Verification**:
- [ ] fields가 비어있을 때 placeholder 표시
- [ ] placeholder에 indigo/purple hard-coded 없음
- [ ] Korean 메시지 사용

---

## Verification

### Code Verification
- [ ] BUG-01: `layout.tsx` line 39 `href="/landing"`
- [ ] BUG-02: `page.tsx` line 4 `redirect('/landing')`
- [ ] UX-01: `TemplateCard.tsx` 클릭 → `router.push(\`/templates/${template.id}\`)`
- [ ] UX-02: `dashboard/page.tsx` indigo/purple hard-coded 0개
- [ ] UX-02: `login/page.tsx` indigo hard-coded 0개
- [ ] UX-02: `TemplatePreview.tsx` indigo-600 hard-coded 0개
- [ ] UX-03: `TemplateEngine.tsx` 빈 상태 placeholder 표시

### Build Verification
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes

### Manual Testing
- [ ] 로고 클릭 → /landing 페이지로 이동
- [ ] Root (/) 접속 → /landing으로 redirect
- [ ] 템플릿 카드 클릭 → 미리보기 페이지로 이동
- [ ] Edit 모드에서 Edit/Delete 버튼 정상 동작
- [ ] TemplatePreview에서 indigo 색상 없음
- [ ] TemplateEngine 빈 상태 placeholder 표시
