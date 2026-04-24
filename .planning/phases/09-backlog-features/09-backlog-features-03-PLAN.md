---
phase: 09-backlog-features
plan: 03
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/templates/editor/FieldEditor.tsx
  - src/components/templates/engine/TemplateEngine.tsx
  - src/components/publish/InvitationViewer.tsx
  - src/app/api/templates/fields/route.ts
autonomous: true
requirements:
  - BACKLOG-05: 이모지 지원 (텍스트 필드에 직접 입력)
  - BACKLOG-06: GIF 지원 (이미지 업로드 방식으로)

must_haves:
  truths:
    - "텍스트 필드에 이모지를 직접 입력할 수 있음"
    - "이미지 필드에서 GIF 파일을 업로드할 수 있음"
    - "초대장에 GIF가 애니메이션으로 표시됨"
  artifacts:
    - path: "src/components/templates/editor/FieldEditor.tsx"
      contains: "emoji"
    - path: "src/components/templates/engine/TemplateEngine.tsx"
      contains: "GIF\|gif"

key_links:
  - from: "FieldEditor"
    to: "template fields"
    via: "render emoji input"
  - from: "TemplateEngine"
    to: "image field"
    via: "render GIF with img tag"
---

<objective>
Implement Emoji and GIF Support - 템플릿 필드에 이모지 입력과 GIF 이미지 업로드를 지원합니다.

Purpose: Wedding invitation에 이모지와 GIF로 더 풍부한 표현 가능
Output: 텍스트 필드 이모지 지원, 이미지 필드 GIF 지원
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/09-backlog-features/09-CONTEXT.md
@src/components/templates/editor/FieldEditor.tsx
@src/components/templates/engine/TemplateEngine.tsx

<!-- Emoji: Native support in modern browsers -->
<!-- GIF: Upload via existing image upload pattern -->
</context>

<tasks>

<task type="auto">
<name>Task 1: Enable Emoji Input in Text Fields</name>
<files>src/components/templates/editor/FieldEditor.tsx</files>
  <action>
Enable emoji support in text field editor:
1. Ensure text fields accept emoji input (native browser support)
2. Add emoji picker button next to text input
3. Use @emoji-mart/react or native OS emoji picker
4. Show preview with emoji rendered
5. No special code needed - just ensure field accepts emoji characters

Text fields already support unicode, just ensure no validation blocks emoji.
  </action>
  <verify>
    <automated>grep -n "type.*text" src/components/templates/editor/FieldEditor.tsx</automated>
  </verify>
  <done>Text fields accept emoji input</done>
</task>

<task type="auto">
<name>Task 2: Enable GIF Upload in Image Fields</name>
<files>src/components/templates/editor/FieldEditor.tsx</files>
  <action>
Enable GIF file upload in image field editor:
1. Update image upload to accept image/gif MIME type
2. Allow .gif file extension in addition to image formats
3. Show GIF preview in editor
4. Store GIF URL (same as regular image)

Use existing image upload storage pattern.
  </action>
  <verify>
    <automated>grep -n "gif\|GIF" src/components/templates/editor/FieldEditor.tsx</automated>
  </verify>
  <done>Image fields accept GIF upload</done>
</task>

<task type="auto">
<name>Task 3: Render GIF with Animation in Template Engine</name>
<files>src/components/templates/engine/TemplateEngine.tsx</files>
  <action>
Update template engine to render GIF with animation:
1. Detect if image URL ends with .gif
2. If GIF, use img tag without optimization
3. Disable Next.js image optimization for GIFs (animated)
4. Ensure GIF loops properly in invitation

Next.js Image component breaks GIF animation, use regular img tag for GIFs.
  </action>
  <verify>
  <automated>grep -n "\\.gif" src/components/templates/engine/TemplateEngine.tsx</automated>
  </verify>
  <done>Template engine renders animated GIF</done>
</task>

</tasks>

<verification>
- [ ] Text fields accept emoji input
- [ ] Image fields accept GIF file upload
- [ ] GIFs render with animation (not as static)
</verification>

<success_criteria>
- User can type emoji in text fields
- User can upload GIF files in image fields
- GIFs render with animation in invitation
</success_criteria>

<output>
After completion, create `.planning/phases/09-backlog-features/09-backlog-features-03-SUMMARY.md`
</output>