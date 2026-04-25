# Phase 11 Plans

## Plan 01: 폰트 유틸리티 + InvitationViewer 연동

**Objective**: StyleEditor에서 선택한 폰트가 InvitationViewer에 적용

**Tasks**:
1. Create font utility library (src/lib/fonts.ts)
2. Integrate fonts into layout.tsx
3. Apply fonts in InvitationViewer
4. Human verification checkpoint

**Files Modified**:
- src/components/publish/InvitationViewer.tsx
- src/lib/fonts.ts (new)
- src/app/layout.tsx

## Plan 02: 커스텀 폰트 업로드 + StyleEditor 연동

**Objective**: 사용자가 커스텀 폰트(.ttf, .otf, .woff) 업로드

**Tasks**:
1. Create /api/fonts endpoint for upload
2. Update fonts.ts for custom fonts
3. Add font upload UI to StyleEditor

**Files Modified**:
- src/app/api/fonts/route.ts (new)
- src/components/templates/editor/StyleEditor.tsx
- src/components/publish/InvitationViewer.tsx

---

**Total**: 2 plans, 7 tasks (including checkpoint)