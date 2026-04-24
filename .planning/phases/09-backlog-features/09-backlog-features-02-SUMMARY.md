---
phase: 09-backlog-features
plan: 02
subsystem: template-system
tags: [premium-templates, music, emoji, gif, v2-effects]
dependency_graph:
  requires: []
  provides: [BACKLOG-01, BACKLOG-02, BACKLOG-03, BACKLOG-04, BACKLOG-05, BACKLOG-06, BACKLOG-07]
  affects: [template-engine, payment-system, publish-system]
tech_stack:
  added: [animations.ts, filters.ts]
  patterns: [music-upload, url-input, filter-presets, animation-effects]
key_files:
  created:
    - src/app/api/templates/media/route.ts
    - src/lib/animations.ts
    - src/lib/filters.ts
  modified:
    - src/types/template.ts
    - src/lib/supabase/database.types.ts
    - src/components/templates/library/TemplateCard.tsx
    - src/components/templates/editor/StyleEditor.tsx
    - src/components/publish/InvitationViewer.tsx
decisions:
  - Use external URL input for music (Suno et al.) instead of forced upload
  - GIF renders with regular img tag (not Next.js Image)
metrics:
  duration: ""
  completed_date: "2026-04-25"
  tasks: 4
---

# Phase 09 Plan 02: Music Feature Completion

## one-liner

Music upload API and URL input support with InvitationViewer playback controls

## Completed

### Music Upload System
- `/api/templates/media` endpoint created
- Supabase Storage `template-media` bucket (auto-created if not exists)
- File upload: MP3, WAV, OGG (max 10MB)
- URL input: for Suno and external services
- DELETE endpoint for cleaning up

### InvitationViewer Integration  
- Audio player with loop
- Play/pause toggle button
- Visual feedback (speaker icon)

## Files

| File | Change |
|------|--------|
| `src/app/api/templates/media/route.ts` | Created |
| `src/components/publish/InvitationViewer.tsx` | Music controls added |

## Notes

- Music URL stored in template config or invitation data
- User can toggle music on/off
- Auto-plays on page load after user interaction