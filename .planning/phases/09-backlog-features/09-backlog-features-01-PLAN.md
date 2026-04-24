---
phase: 09-backlog-features
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/supabase/database.types.ts
  - src/types/database.types.ts
  - src/app/api/templates/route.ts
  - src/app/api/templates/[id]/route.ts
  - src/components/templates/library/TemplateCard.tsx
  - src/components/templates/library/TemplateLibrary.tsx
  - src/app/(main)/templates/[id]/page.tsx
autonomous: true
requirements:
  - BACKLOG-01: 프리미엄 템플릿 (templates.price 필드, 구매 시스템)
  - BACKLOG-02: 사용자 구매 기록 관리 (is_purchased 필드)

must_haves:
  truths:
    - "템플릿에 가격이 표시되고 유료 템플릿은 구매后才使用 가능"
    - "사용자가 구매한 템플릿만 사용 가능"
    - "템플릿 상세 페이지에 구매 버튼이 표시됨"
  artifacts:
    - path: "src/lib/supabase/database.types.ts"
      contains: "price: number"
    - path: "src/components/templates/library/TemplateCard.tsx"
      contains: "price"
    - path: "src/app/(main)/templates/[id]/page.tsx"
      contains: "EasyCheckout"

key_links:
  - from: "TemplateCard"
    to: "price"
    via: "display price on card"
  - from: "templates/[id]/page"
    to: "Toss Payments"
    via: "EasyCheckout modal"
---

<objective>
Implement Premium Template Purchase System - templates에 price 필드를 추가하고 유료 템플릿은 구매后才使用 가능하도록 구현합니다.

Purpose: Phase 5 결제 시스템을 기반으로 프리미엄 템플릿 구매 기능 추가
Output: 템플릿 상세 페이지에 가격 표시, 구매 버튼, 구매 검증 로직
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/09-backlog-features/09-CONTEXT.md
@src/types/payment.ts
@src/lib/payment/toss.ts
@src/lib/supabase/database.types.ts
@src/components/templates/library/TemplateCard.tsx
@src/components/payment/EasyCheckout.tsx

<!-- Interface contracts from existing code -->
<!-- DB already has price field: database.types.ts line 45 -->
<!-- Payment system from Phase 5: toss.ts, EasyCheckout.tsx -->
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update Template Types with is_purchased Field</name>
  <files>src/lib/supabase/database.types.ts</files>
  <action>
Update Template, TemplateInsert, TemplateUpdate interfaces in database.types.ts:
1. Add `is_purchased: boolean` to Template interface (default false)
2. Add user_id optional to Template interface for purchase tracking
3. TemplateInsert: add is_purchased?: boolean (default false)
4. TemplateUpdate: add is_purchased?: boolean

The price field already exists in database (line 45), add is_purchased for purchase tracking.
  </action>
  <verify>
    <automated>grep -n "is_purchased" src/lib/supabase/database.types.ts</automated>
  </verify>
  <done>Template interface has is_purchased field</done>
</task>

<task type="auto">
  <name>Task 2: Update Template API Routes with Price and Purchase</name>
  <files>src/app/api/templates/route.ts, src/app/api/templates/[id]/route.ts</files>
  <action>
Update API routes:
1. GET /api/templates - add price field to response (already in DB)
2. POST /api/templates - accept price in request body
3. PATCH /api/templates/[id] - accept price, is_purchased in request body
4. Add user purchase check endpoint: GET /api/templates/check-purchase?templateId=X

Add purchase validation in template fetch - if template.price > 0, check is_purchased for user.
  </action>
  <verify>
    <automated>curl -s http://localhost:3000/api/templates | grep -o '"price":[0-9]*'</automated>
  </verify>
  <done>API routes return price field, purchase check works</done>
</task>

<task type="auto">
  <name>Task 3: Display Price on TemplateCard and TemplateLibrary</name>
  <files>src/components/templates/library/TemplateCard.tsx, src/components/templates/library/TemplateLibrary.tsx</files>
  <action>
Update TemplateCard and TemplateLibrary to display price:
1. TemplateCard - show price badge (e.g., "₩10,000" or "Free" if price=0)
2. TemplateCard - show lock icon for unpurchased paid templates
3. TemplateLibrary - filter/premium badge for paid templates
4. Template type should already have price from database.types.ts

Use Badge component for price display.
  </action>
  <verify>
    <automated>grep -n "price" src/components/templates/library/TemplateCard.tsx</automated>
  </verify>
  <done>TemplateCard displays price with badge</done>
</task>

<task type="auto">
  <name>Task 4: Template Detail Page with Purchase Flow</name>
  <files>src/app/(main)/templates/[id]/page.tsx</files>
  <action>
Update template detail page to integrate purchase flow:
1. If template.price > 0 and not owned by user: show "Buy Now ₩X,XXX" button
2. If template.price > 0 and is_purchased: show "Use Template" button
3. If template.price = 0 or owned by user: show "Use Template" button
4. Use EasyCheckout component for payment flow (from Phase 5)

Check is_purchased status before showing purchase button.
  </action>
  <verify>
    <automated>grep -n "EasyCheckout\|is_purchased" src/app/\(main\)/templates/\[id\]/page.tsx</automated>
  </verify>
  <done>Template detail page shows appropriate button based on purchase status</done>
</task>

</tasks>

<verification>
- [ ] database.types.ts has is_purchased field
- [ ] Template API returns price field
- [ ] TemplateCard displays price badge
- [ ] Template detail page shows buy/use button based on purchase status
</verification>

<success_criteria>
- Templates can have price (0 for free, >0 for premium)
- Users can purchase premium templates via Toss Payments
- Unpurchased premium templates show "Buy Now" button
- Purchased templates show "Use Template" button
- Purchase is tracked in is_purchased field
</success_criteria>

<output>
After completion, create `.planning/phases/09-backlog-features/09-backlog-features-01-SUMMARY.md`
</output>