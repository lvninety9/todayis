# Phase 9: Backlog Features Selection - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Select and implement V2/V3 features from backlog after MVP completion.

This phase delivers:
- Premium template purchase system (templates with price > 0 require purchase)
- Background music for templates
- Custom emoji/GIF support

The scope combines: premium templates, background music, and rich media (emoji/GIF) - all natural extensions of the existing template system.

</domain>

<decisions>
## Implementation Decisions

### Feature Selection (Backlog)
- **D-01:** 프리미엄 템플릿 (Premium Templates) — 템플릿에 가격 추가, 유료 템플릿은 구매后才使用 가능
  - Reason: Payment system already exists (Phase 5), just need to add price field and purchase check
  
- **D-02:** 배경 음악 (Background Music) — 템플릿에 음악 파일 업로드/선택 기능
  - Reason: Natural template extension, editor already has music field from Phase 8
  
- **D-03:** 이모지/GIF 지원 — 템플릿에 이모지, GIF 삽입 기능
  - Reason: Rich media makes invitations more engaging

### Implementation Approach
- **D-04:** 프리미엄 템플릿: templates 테이블에 price 컬럼 추가, is_purchased 필드 관리
- **D-05:** 배경 음악: Supabase Storage에 music 파일 업로드, template_data에 music_url 저장
- **D-06:** 이모지/GIF: 텍스트 필드에서 emoji 직접 입력, GIF는 image 업로드 방식으로

### Features Deferred to Future Phases
- 동영상 초대장 — 복잡한 구현, 별도 phase 필요
- Kakao 로그인 — Auth phase 확장
- Naver Pay — Payment phase 확장
- AI 추천 템플릿 — AI 통합 필요
- 회원 목록 페이지네이션 — Admin page 개선

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Files
- `src/types/template-data.ts` — Template data types
- `src/types/payment.ts` — Payment types
- `src/lib/payment/toss.ts` — Toss payment integration
- `src/app/api/invitations/[slug]/route.ts` — Published invitation API
- `supabase-payment-setup.sql` — Payment database schema

### Phase 8 Context (Reference)
- `src/components/templates/editor/TemplateEditor.tsx` — Template editor with style fields
- Phase 8 already added: animation, music, font style fields to editor

### External References
- `supabase.com/docs` — Storage for music files
- `tosspayments.com/docs` — Payment webhook handling

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/template-data.ts` — TemplateData, TemplateField interfaces
- `src/lib/supabase/storage.ts` — Storage client for file uploads
- `src/components/publish/InvitationEditor.tsx` — Editor with publish toggle
- `src/components/templates/editor/StyleEditor.tsx` — Style editor from Phase 8

### Established Patterns
- shadcn/ui + TailwindCSS (keep)
- TypeScript strict mode (keep)
- Supabase Storage pattern for file uploads (extend for music)
- Payment pattern from Phase 5 (extend for premium check)

### Integration Points
- Template editor — add music field, emoji support
- Template detail page — add price display, purchase flow
- Invitation viewer — render music, emoji/GIF

</code_context>

<specifics>
## Specific Ideas

### Premium Templates
- templates.price: number (default 0 for free)
- Create payments record when user purchases
- Check is_purchased before allowing template use
- Display price on template card

### Background Music
- Support: MP3, WAV, OGG formats
- Storage: Supabase Storage 'template-media' bucket
- Play: Auto-play on invitation open, user can mute
- Editor: File upload or URL input

### Emoji/GIF
- Emoji: Native support, no extra code needed
- GIF: Upload to template-media, render in template
- User input field supports emoji text entry

### V2 Enhanced Features (New!)
1. **동적 배경** — 움직이는 배경 (gradient animation, particle effects, falling flowers)
2. **애니메이션 효과** — 텍스트Appear, 페이드인, 슬라이드, 스케일
3. **페이지 넘기기** — 우에서 좌/좌에서 우 넘김 효과
4. **줌인/줌아웃** — 사진에 핀치 줌, 더블탭 줌
5. **필터 효과** — Sepia, Vintage, B&W, Warm, Cool, Vivid
6. **실시간 프리뷰** — 편집 시 클릭하면 즉시 적용 미리보기
7. **포토샵 기능** — 밝기, 대비, 채도, 명도 조절
8. **花朵 효과** — 꽃 petals falling animation

</specifics>

<deferred>
## Deferred Ideas

### Future Phases
- 동영상 초대장 — Video template support (complex implementation)
- Kakao 로그인 — Add Kakao OAuth provider
- Naver Pay — Add Naver Pay integration
- AI 추천 템플릿 — AI-powered template recommendation
- 회원 목록 페이지네이션 — Admin user list pagination

</deferred>

---

*Phase: 09-backlog-features*
*Context gathered: 2026-04-25*