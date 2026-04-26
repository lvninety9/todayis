# Phase 11: custom-fonts - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 11-custom-fonts
**Mode:** Auto (all gray areas auto-selected with recommended defaults)
**Areas discussed:** Font storage strategy, Multiple font policy, Font naming, Upload UI placement

---

## Font Storage Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| In template config | Store font URLs in template.config.customFonts (JSONB) | ✓ |
| Separate user_fonts table | New DB table for reusable fonts across templates | |
| Supabase user metadata | Store in auth.users.raw_user_meta_data | |

**User's choice:** In template config (D-01)
**Notes:** MVP simplicity. Each template carries its own fonts. No new DB migration needed.

## Storage Bucket

| Option | Description | Selected |
|--------|-------------|----------|
| New `custom-fonts` bucket | Separate from `template-media` | ✓ |
| Reuse `template-media` bucket | Share bucket with other template assets | |

**User's choice:** New `custom-fonts` bucket (D-02)
**Notes:** Separation of concerns. Font files are different media type.

## Multiple Font Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Single font per template | Only one custom font allowed | |
| Multiple fonts (up to 5) | Multiple fonts for heading/body separation | ✓ |
| Unlimited | No hard limit | |

**User's choice:** Multiple fonts up to 5 (D-03)
**Notes:** Supports real-world use case (heading font + body font). 5 is generous but prevents abuse.

## Font Naming

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-derive from filename | Sanitize filename → title case | ✓ |
| User-entered name only | Require user to type name | |
| UUID-based | System-generated name | |

**User's choice:** Auto-derive from filename with optional override (D-04, D-05)
**Notes:** Zero friction UX. User can override if needed.

## Upload UI Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Below fontFamily dropdown | Conditional on 'custom' selection | ✓ |
| Separate tab/section | New "Custom Fonts" tab in editor | |
| Modal dialog | Upload in a modal | |

**User's choice:** Below fontFamily dropdown (D-06)
**Notes:** Discoverable, minimal UI disruption.

## API Design

| Option | Description | Selected |
|--------|-------------|----------|
| Auth mandatory | No dev mode fallback | ✓ |
| Dev mode fallback | Allow ?dev=true like media upload | |

**User's choice:** Auth mandatory (D-07)
**Notes:** Custom font upload is a privileged action. No dev bypass.

| Option | Description | Selected |
|--------|-------------|----------|
| Double validation | MIME type + file extension check | ✓ |
| MIME type only | Check file.type only | |
| Extension only | Check file.name extension only | |

**User's choice:** Double validation (D-08)
**Notes:** Security best practice.

## StyleEditor Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Add customFonts state | CustomFont[] in component state | ✓ |
| Use existing style state | Store in style.customFonts | |

**User's choice:** Add customFonts state (D-09)
**Notes:** Separate state for clarity. Custom fonts are distinct from style properties.

---

## the agent's Discretion

- Storage bucket auto-creation logic (follow existing media upload pattern)
- Error message wording (Korean)
- Loading state UI (spinner vs text)
- Font preview mechanism (optional, agent decides)

## Deferred Ideas

- Font preview thumbnail — future phase
- Font management page — future phase
- Font sharing between templates — future phase
