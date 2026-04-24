---
phase: 09-backlog-features
plan: 04
type: execute
wave: 2
depends_on: [09-backlog-features-01, 09-backlog-features-02, 09-backlog-features-03]
files_modified:
  - src/components/templates/editor/StyleEditor.tsx
  - src/components/templates/engine/TemplateEngine.tsx
  - src/components/templates/preview/TemplatePreview.tsx
  - src/components/publish/InvitationViewer.tsx
  - src/lib/animations.ts
  - src/lib/filters.ts
  - src/app/api/templates/config/route.ts
autonomous: true
requirements:
  - BACKLOG-07: V2 Enhanced Features (동적 배경, 애니메이션, 페이지 넘기기, 줌인/줌아웃, 필터, 실시간 프리뷰, 포토샵 기능, 꽃 효과)

must_haves:
  truths:
    - "템플릿에 동적 배경 효과를 적용할 수 있음"
    - "텍스트와 이미지에 애니메이션 효과를 줄 수 있음"
    - "사진에 필터(sepia, vintage, B&W 등)를 적용할 수 있음"
    - "페이지 넘기기 효과가 작동함"
  artifacts:
    - path: "src/lib/animations.ts"
      contains: "animate\|fade\|slide"
    - path: "src/lib/filters.ts"
      contains: "sepia\|vintage\|grayscale"
    - path: "src/components/templates/editor/StyleEditor.tsx"
      contains: "filter\|animation"

key_links:
  - from: "StyleEditor"
    to: "animations.ts"
    via: "animation effects config"
  - from: "TemplateEngine"
    to: "filters.ts"
    via: "CSS filter"
  - from: "InvitationViewer"
    to: "page transition"
    via: "swipe gesture"
---

<objective>
Implement V2 Enhanced Features - 동적 배경, 애니메이션, 필터, 페이지 넘기기, 줌인/줌아웃, 실시간 프리뷰, 포토샵 기능, 꽃 효과 등을 구현합니다.

Purpose: Wedding invitation에 고급视觉效果 추가
Output: 동적 배경, 애니메이션, 필터, 페이지 넘기기, 줌인/줌아웃, 포토샵 기능
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/09-backlog-features/09-CONTEXT.md
@src/components/templates/editor/StyleEditor.tsx
@src/components/templates/engine/TemplateEngine.tsx
@src/components/publish/InvitationViewer.tsx

<!-- V2 Features: advanced visual effects for premium invitations -->
</context>

<tasks>

<task type="auto">
<parameter name>Task 1: Create Animation and Filter Libraries</name>
  <files>src/lib/animations.ts, src/lib/filters.ts</files>
  <action>
Create animation and filter utility libraries:

**animations.ts:**
1. fadeIn: opacity 0 -> 1 transition
2. slideInLeft: translateX from -100% to 0
3. slideInRight: translateX from 100% to 0
4. scaleIn: scale 0 -> 1 with easing
5. textAppear: character by character reveal
6. gradientAnim: animated gradient background
7. particleEffect: floating particles
8. fallingFlowers: flower petals animation

**filters.ts:**
1. sepia: sepia(50%)
2. vintage: sepia + contrast + brightness
3. grayscale: grayscale(100%)
4. warm: hue-rotate + saturate
5. cool: hue-rotate + saturate
6. vivid: saturate(150%) + contrast(110%)
7. brightness, contrast, saturate adjustments

Use CSS keyframes and transitions.
  </action>
  <verify>
  <automated>test -f src/lib/animations.ts && test -f src/lib/filters.ts</automated>
  </verify>
  <done>Animation and filter utility libraries created</done>
</task>

<task type="auto">
<name>Task 2: Add Visual Effects to Style Editor</name>
  <files>src/components/templates/editor/StyleEditor.tsx</files>
  <action>
Add V2 visual effects controls to StyleEditor:
1. **Background Effects**: gradientAnim, particleEffect, fallingFlowers (dropdown)
2. **Text Animation**: fadeIn, slideIn, scaleIn (dropdown)
3. **Image Filter**: sepia, vintage, grayscale, warm, cool, vivid (dropdown)
4. **Photo Adjustments**: brightness, contrast, saturate sliders
5. **Page Transition**: swipeLeft, swipeRight (dropdown)
6. **Zoom**: pinchZoom, doubleTapZoom toggles

Add controls panel with proper UI using shadcn/ui components.
  </action>
  <verify>
  <automated>grep -n "fallingFlowers\|sepia\|particle" src/components/templates/editor/StyleEditor.tsx</automated>
  </verify>
  <done>Style editor has visual effects controls</done>
</task>

<task type="auto">
<name>Task 3: Apply Visual Effects to Template Engine</name>
  <files>src/components/templates/engine/TemplateEngine.tsx</files>
  <action>
Update template engine to apply visual effects:
1. Import animations.ts and filters.ts
2. Apply background animation based on template config
3. Apply text animations on mount/appear
4. Apply CSS filters to images based on config
5. Support image adjustments (brightness, contrast, saturate)
6. Handle GIFs without filters (animation preserved)

Get effects config from template.data and apply accordingly.
  </action>
  <verify>
  <automated>grep -n "import.*animations\|import.*filters" src/components/templates/engine/TemplateEngine.tsx</automated>
  </verify>
  <done>Template engine applies visual effects</done>
</task>

<task type="auto">
<name>Task 4: Add Page Transitions and Zoom to Invitation Viewer</name>
  <files>src/components/publish/InvitationViewer.tsx</files>
  <action>
Add page transitions and zoom to invitation viewer:
1. **Page Transitions**: swipe left/right gesture navigation
2. **Zoom**: pinch-to-zoom on images, double-tap to zoom
3. **Real-time Preview**: show effects as they're applied (in editor)
4. **Flower Effect**: falling flower petals on invitation load (optional)

Use touch events for gestures, CSS transforms for zoom.
  </action>
  <verify>
  <automated>grep -n "swipe\|zoom\|transition" src/components/publish/InvitationViewer.tsx</automated>
  </verify>
  <done>Invitation viewer has transitions and zoom</done>
</task>

</tasks>

<verification>
- [ ] animations.ts has 8+ animation effects
- [ ] filters.ts has 7+ filter presets
- [ ] StyleEditor has UI controls for all effects
- [ ] TemplateEngine applies effects to invitation
- [ ] InvitationViewer has page transitions and zoom
</verification>

<success_criteria>
- Dynamic backgrounds (gradient, particles, flowers) work
- Text animations (fade, slide, scale) work
- Image filters (sepia, vintage, B&W, warm, cool, vivid) work
- Image adjustments (brightness, contrast, saturate) work
- Page swipe transitions work
- Pinch/double-tap zoom works
</success_criteria>

<output>
After completion, create `.planning/phases/09-backlog-features/09-backlog-features-04-SUMMARY.md`
</output>