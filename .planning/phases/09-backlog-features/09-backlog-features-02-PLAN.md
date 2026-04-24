---
phase: 09-backlog-features
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/supabase/storage.ts
  - src/components/templates/editor/TemplateEditor.tsx
  - src/app/api/templates/media/route.ts
  - src/types/template-data.ts
  - src/components/templates/preview/TemplatePreview.tsx
  - src/components/publish/InvitationViewer.tsx
autonomous: true
requirements:
  - BACKLOG-03: 배경 음악 (MP3 업로드/재생)
  - BACKLOG-04: 음악 재생 컨트롤 ( mute, volume)

must_haves:
  truths:
    - "템플릿에 음악 파일을 업로드하거나 URL을 입력할 수 있음"
    - "초대장 공개 시 음악이 자동 재생됨"
    - "사용자가 음악을 끌 수 있음"
  artifacts:
    - path: "src/app/api/templates/media/route.ts"
      contains: "music"
    - path: "src/components/publish/InvitationViewer.tsx"
      contains: "audio"

key_links:
  - from: "TemplateEditor"
    to: "Supabase Storage"
    via: "music file upload"
  - from: "InvitationViewer"
    to: "audio element"
    via: "HTML5 audio playback"

---

<objective>
Implement Background Music Feature - 템플릿에 음악 파일을 업로드하고 초대장 공개 시 재생할 수 있도록 구현합니다.

Purpose: Wedding invitation에 배경 음악 추가하여 더 풍성한 경험 제공
Output: 음악 업로드 UI, 저장, 재생 컨트롤
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/09-backlog-features/09-CONTEXT.md
@src/components/templates/editor/TemplateEditor.tsx
@src/components/publish/InvitationViewer.tsx
@src/lib/supabase/storage.ts

<!-- Storage pattern from profile images -->
<!-- Editor already has style fields from Phase 8 -->
</context>

<tasks>

<task type="auto">
<parameter name>Task 1: Create Template Media API for Music Upload</name>
<files>src/app/api/templates/media/route.ts</files>
  <action>
Create API endpoint for template media (music) upload:
1. POST /api/templates/media - accept MP3/WAV/OGG file upload
2. Use Supabase Storage 'template-media' bucket
3. Validate file type: audio/mpeg, audio/wav, audio/ogg
4. Store in storage and return public URL
5. Add DELETE endpoint for removing music

If bucket doesn't exist, create 'template-media' bucket first.
  </action>
  <verify>
    <automated>test -f src/app/api/templates/media/route.ts && echo "exists"</automated>
  </verify>
  <done>Music upload API created</done>
</task>

<task type="auto">
<name>Task 2: Add Music Field to Template Editor</name>
  <files>src/components/templates/editor/TemplateEditor.tsx</files>
  <action>
Add music upload feature to template editor:
1. Add "Musik" section in editor panel
2. File input for MP3/WAV/OGG upload
3. Option to enter music URL directly
4. Preview current music with play button
5. Remove music button
6. Store music_url in template config/music field

Use existing Supabase Storage pattern from profile images.
  </action>
  <verify>
    <automated>grep -n "music\|Musik" src/components/templates/editor/TemplateEditor.tsx</automated>
  </verify>
  <done>Template editor has music upload input</done>
</task>

<task type="auto">
<name>Task 3: Add Music Playback to Invitation Viewer</name>
  <files>src/components/publish/InvitationViewer.tsx</files>
  <action>
Add background music playback to invitation viewer:
1. Check if invitation has music_url
2. Auto-play on page load (muted by default for UX)
3. Show music control button (speaker icon)
4. Toggle mute/unmute on click
5. Volume slider (optional)
6. Use HTML5 <audio> element with loop attribute

Handle audio autoplay restrictions - require user interaction before playing.
  </action>
  <verify>
  <automated>grep -n "audio\|music" src/components/publish/InvitationViewer.tsx</automated>
  </verify>
  <done>InvitationViewer plays background music</done>
</task>

</tasks>

<verification>
- [ ] Template media API creates bucket and handles uploads
- [ ] Template editor has music upload UI
- [ ] Invitation viewer plays music with controls
- [ ] Music loops, can be muted/unmuted
</verification>

<success_criteria>
- Users can upload MP3/WAV/OGG files to templates
- Or enter music URL directly
- Music auto-plays when invitation is opened (with user interaction)
- User can mute/unmute with control button
</success_criteria>

<output>
After completion, create `.planning/phases/09-backlog-features/09-backlog-features-02-SUMMARY.md`
</output>