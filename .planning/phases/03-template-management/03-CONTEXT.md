# Phase 03: 템플릿 관리 - Context

**Gathered:** 2026-04-17
**Status:** Ready for discussion

<domain>
## Phase Boundary

템플릿 CRUD API 구현, 템플릿 라이브러리 UI 구현, 템플릿 업로드 기능 구현

사용자가 템플릿을 생성, 수정, 삭제하고 라이브러리에서 관리할 수 있는 기능

</domain>

<decisions>
## Implementation Decisions

### Discussion Pending
- **D-01:** Storage Strategy — Supabase Storage vs File System vs Database JSON
- **D-02:** Template CRUD API — REST endpoints vs custom patterns
- **D-03:** Template Library UI — Grid layout vs list view, search/filter needs
- **D-04:** Template Upload — JSON file upload vs manual form vs URL import

### the agent's Discretion
- API response format structure
- Error handling patterns (consistent with Phase 2 auth system)
- UI component library choices (reuse shadcn/ui)

</decisions>

<canonical_refs>
## Canonical References

### Phase Requirements
- `.planning/ROADMAP.md` — Phase 3 scope and requirements (TEMPLATE-MANAGE-01/02/03)

### Existing Code
- `src/components/templates/engine/TemplateEngine.tsx` — Template rendering engine
- `src/components/templates/preview/TemplatePreview.tsx` — Preview component
- `src/components/templates/editor/TemplateEditor.tsx` — Editor component
- `src/lib/template-utils.ts` — Validation and rendering utilities
- `src/types/template.ts` — Template type definitions

### Prior Phase Decisions
- `.planning/STATE.md` — Phase 1 & 2 decisions (date format, Google Maps link, AuthProvider)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **TemplateEngine**: 렌더링 엔진 — 템플릿 관리 UI 에서 미리보기용으로 재사용 가능
- **TemplatePreview**: 미리보기 컴포넌트 — 라이브러리에서 템플릿 썸네일용으로 활용
- **template-utils.ts**: 유효성 검사, 날짜 포맷팅, 위치 렌더링 — 공통 유틸로 사용
- **Template types**: Template, TemplateField, TemplateData 타입 — 일관된 타입 정의

### Established Patterns
- **Supabase Auth**: Phase 2 에서 구현된 인증 시스템 — 템플릿 소유권 관리에 활용
- **Korean date format**: 'YYYY 년 MM 월 DD 일' — 템플릿 메타데이터에도 적용
- **Google Maps link**: 위치 필드에 지도 링크 — 템플릿 관리 UI 에서도 일관되게 사용

### Integration Points
- **API routes**: `src/app/api/` — 템플릿 CRUD 엔드포인트 추가
- **Dashboard**: Phase 2 에서 구현된 대시보드 — 템플릿 라이브러리 페이지로 확장
- **AuthProvider**: 글로벌 인증 컨텍스트 — 템플릿 소유권 검증에 사용

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

Discussion needed for:
1. Storage strategy decision
2. API design pattern
3. UI layout preference
4. Upload method

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

---

*Phase: 03-template-management*
*Context gathered: 2026-04-17*

</deferred>
