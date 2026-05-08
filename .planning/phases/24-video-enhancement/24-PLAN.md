# Phase 24: Video Section Enhancement & Template Editor Animation Preview

**Goal**: Video 섹션에 Bilibili iframe 지원, 파일 업로드 지원 추가 + StyleEditor에서 애니메이션 실시간 미리보기 구현

**Depends on**: Phase 17, Phase 18, Phase 19, Phase 21, Phase 22

**Requirements**:
- VIDEO-01: Bilibili iframe embed 지원 (TemplateEngine + InvitationViewer)
- VIDEO-02: 동영상 파일 업로드 지원 (GIF, MP4, WebM, MOV, 50MB 제한)
- VIDEO-03: Video Field Editor 탭 UI (YouTube / Bilibili / Upload)
- ANIM-01: StyleEditor 애니메이션 실시간 미리보기 (재생 버튼)

**Success Criteria** (what must be TRUE):
1. TemplateEngine에서 Bilibili URL 감지 → iframe embed 렌더링
2. InvitationViewer에서 Bilibili URL 감지 → iframe embed 렌더링
3. /api/templates/media에서 동영상 파일 업로드 지원 (GIF/MP4/WebM/MOV, 50MB)
4. FieldEditor에서 VideoFieldEditor 탭 UI (YouTube/Bilibili/Upload + 미리보기)
5. StyleEditor에서 애니메이션 선택 시 재생 버튼으로 실시간 미리보기 가능

**Status**: In Progress

---

## Implementation Plan

### Wave 1: Bilibili iframe support (TemplateEngine + InvitationViewer)
- [x] TemplateEngine.tsx — VideoSection에 Bilibili iframe 렌더링 추가
- [x] InvitationViewer.tsx — renderVideo에 Bilibili iframe 렌더링 추가

### Wave 2: Video file upload support
- [x] /api/templates/media/route.ts — 동영상 파일 업로드 지원 (videoType, 50MB limit)

### Wave 3: Video Field Editor tabs
- [x] FieldEditor.tsx — VideoFieldEditor 컴포넌트 (YouTube/Bilibili/Upload 탭 + 미리보기)

### Wave 4: Animation preview in StyleEditor
- [x] StyleEditor.tsx — 애니메이션 재생 버튼 + 실시간 미리보기

---

## Verification

- [ ] Build passes
- [ ] Lint passes
- [ ] Manual test: Bilibili URL → iframe embed (TemplateEngine + InvitationViewer)
- [ ] Manual test: Video file upload → Supabase Storage
- [ ] Manual test: Video Field Editor tabs → preview works
- [ ] Manual test: StyleEditor animation preview → plays on button click
