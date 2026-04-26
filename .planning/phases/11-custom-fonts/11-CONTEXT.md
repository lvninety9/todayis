# Phase 11: custom-fonts - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Custom font upload API (`/api/fonts`) + StyleEditor 연동을 통해 사용자가 직접 .ttf/.otf/.woff/.woff2 폰트 파일을 업로드하고 템플릿에 적용할 수 있게 함.

Phase 01에서 기본 제공 폰트(Google Fonts)의 렌더링은 완료됨. 이 Phase는 **사용자 업로드 커스텀 폰트**를 다룸.

Scope: POST/DELETE API, Supabase Storage 연동, StyleEditor UI 연동, fonts.ts 확장

</domain>

<decisions>
## Implementation Decisions

### Font Storage Strategy
- **D-01:** Custom font metadata는 template config JSONB에 저장 (`config.customFonts` 배열)
  - MVP simplicity — 별도 테이블 불필요
  - 각 템플릿이 자신의 폰트를 carry
  - Structure: `{ id, name, url, family }[]`
- **D-02:** Supabase Storage bucket: `custom-fonts` (별도 bucket, `template-media`와 분리)
  - fileSizeLimit: 5MB per file
  - public: true (CDN 직접 접근용)

### Multiple Font Policy
- **D-03:** 템플릿당 최대 5개 커스텀 폰트 업로드 허용
  - heading font + body font 등 다중 폰트 사용 시나리오 지원
  - API에서 검증 후 400 에러 반환

### Font Naming
- **D-04:** fontFamily은 업로드 파일명에서 자동 파생 (확장자 제거 → sanitize → title case)
  - 예: `my-wedding-font.ttf` → `My Wedding Font`
  - StyleEditor에서 user override 가능 (text input 추가)
- **D-05:** CSS font-family name은 sanitized version 사용 (공백 포함 가능)

### Upload UI Placement
- **D-06:** StyleEditor에서 fontFamily dropdown 아래에 조건부 렌더링
  - `fontFamily === 'custom'`일 때만 upload 섹션 표시
  - 파일 입력 (.ttf, .otf, .woff, .woff2 accept)
  - 업로드 상태 표시 (loading, success, error)
  - 제거 버튼 (업로드한 폰트 삭제)

### API Design
- **D-07:** `/api/fonts` endpoint — POST (upload) + DELETE (remove)
  - POST: FormData, `font` file + `templateId` + `fontName` (optional override)
  - DELETE: query param `url` 또는 `fontId`
  - 인증 필수 (dev mode fallback 없음 — media upload와 달리 auth mandatory)
- **D-08:** 파일 타입 검증: `.ttf`, `.otf`, `.woff`, `.woff2`만 허용
  - MIME type + extension double validation

### StyleEditor Integration
- **D-09:** StyleEditor에 `customFonts` 상태 추가 (CustomFont[] 타입)
  - fontFamilyOptions에 `'custom'` 옵션 추가 (현재 미포함)
  - handleFontUpload, handleRemoveFont 핸들러 구현
- **D-10:** 업로드한 폰트 URL은 template config에 저장됨
  - onChange 이벤트로 template editor에 반영

### the agent's Discretion
- Storage bucket auto-creation logic (existing media upload pattern 참고)
- Error message wording (Korean)
- Loading state UI (spinner vs text)
- Font preview mechanism (optional, agent decides if worth it)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Plans
- `.planning/phases/11-custom-fonts/11-01-PLAN.md` — Phase 11 Plan 01 (기존 폰트 렌더링, fonts.ts base)
- `.planning/phases/11-custom-fonts/11-02-PLAN.md` — 이 Phase의 실행 계획 (타겟 파일 정의)
- `.planning/phases/11-custom-fonts/11-PLANS.md` — Phase 11 plan 목록

### Reference Implementation (media upload pattern)
- `src/app/api/templates/media/route.ts` — POST/DELETE 패턴, Supabase Storage 연동 참고
- `src/lib/fonts.ts` — Plan 01에서 생성된 폰트 유틸리티 (CustomFont interface, getCustomFontCSS 이미 존재)

### Existing Components
- `src/components/templates/editor/StyleEditor.tsx` — 수정 대상, fontFamily dropdown 존재 (custom 옵션 미포함)
- `src/components/publish/InvitationViewer.tsx` — custom font CSS variable 지원 확인

### Database Types
- `src/lib/supabase/database.types.ts` — Template config JSONB 필드 참고

### Project Context
- `.planning/STATE.md` — Phase 11 Plan 01 완료 상태, Plan 02 대기 중
- `.planning/ROADMAP.md` — 프로젝트 전체 로드맵

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`src/lib/fonts.ts`** — `CustomFont` interface, `getCustomFontCSS()`, `loadCustomFontCSS()` 이미 구현됨. Plan 02에서 확장만 필요.
- **`src/app/api/templates/media/route.ts`** — Supabase Storage upload/delete 패턴의 gold standard. Bucket auto-creation, file validation, size limit, user auth pattern 모두 참고 가능.
- **`src/lib/auth.ts`** — `getUserFromRequest()` 헬퍼. API route 인증에 재사용.

### Established Patterns
- **Storage pattern:** Supabase Storage → `createClient(serviceKey)` → bucket check/create → upload → public URL 반환
- **API pattern:** Next.js Route Handlers (`export async function POST/DELETE`)
- **FormData handling:** `request.formData()` → file extraction → validation → upload
- **Error handling:** try/catch → console.error → NextResponse.json with status code

### Integration Points
- **StyleEditor → API:** `handleFontUpload` → `POST /api/fonts` (FormData)
- **StyleEditor → config:** `onChange({ ...style, customFonts: [...] })` → template save
- **InvitationViewer → fonts:** `loadCustomFontCSS(customFonts)` → inline `<style>` 또는 CSS variable
- **layout.tsx:** `--font-custom` CSS variable (Plan 01에서 정의됨)

</code_context>

<specifics>
## Specific Ideas

- Dev mode에서 auth fallback은 custom font upload에 적용하지 않음 (media upload와 달리 auth mandatory)
- Font preview (업로드 후 미리보기)는 MVP에서 생략 — agent discretion

</specifics>

<deferred>
## Deferred Ideas

- Font preview thumbnail (업로드 후 미리보기) — future phase
- Font management page (전체 업로드 폰트 목록 관리) — future phase
- Font sharing between templates (공유 폰트) — future phase

</deferred>

---

*Phase: 11-custom-fonts*
*Context gathered: 2026-04-26*
