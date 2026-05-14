# wiki/codebase.md — 코드 구조

## 프레임워크

- Next.js 14 (App Router), TS strict · Tailwind CSS v4, shadcn/ui · Supabase (PostgreSQL/Storage/Auth) · Vercel (subpath routing)

## 디렉토리 구조

```
src/
├── app/  (auth)/(main)/api/ layout.tsx
├── components/  ui/ auth/ forms/ templates/ payment/ publish/ layout/
├── hooks/  use-auth, use-payment, use-session, use-template-editor
├── lib/  supabase/ payment/ utils/
├── data/templates/ sample.ts
├── types/  auth, payment, publish, template
└── test/  e2e (Playwright), setup.ts
```

## 핵심 아키텍처

### Section 기반 템플릿 (Phase 17)
- 3 템플릿 (ROMANTIC/CLASSIC/MODERN), 각 5 섹션 (image→announcement→invitation→map→accounts)
- `SECTION_BASED_TEMPLATES` 배열 + `findSectionBasedTemplate()` 헬퍼
- API: GET/POST/PATCH `/api/templates`, `/api/templates/[id]`

### FieldType (11개): text, date, image, location, account, audio, video, gallery, message, dresscode, parents

### 공개 초대장: `/api/invitations/[slug]` 조회 · `/(main)/[username]` subpath 뷰어

### 결제: Toss Payments (`/api/payment/*`) · Naver Pay (lib/payment/naver.ts, 2차)

## 테스트: Vitest 120개 (11파일, 통과) · Playwright 40개 E2E

## Phase 26: 맞춤 초대장 (JANG_DING_TEMPLATE)
- `src/data/templates/sample.ts` — JANG_DING_TEMPLATE (히어로+축하메시지 2섹션), SECTION_BASED_TEMPLATES에 추가
- `src/components/publish/InvitationViewer.tsx` — Guestbook 통합, 이미지 CSS 애니메이션(fadeIn/scaleIn/slideUp/gentleZoom), image 필드 타입 감지/렌더링
- `src/app/api/guestbooks/route.ts` — GET/POST 방명록 API
- `src/components/publish/Guestbook.tsx` — 방명록 UI (메시지 작성/목록/상대시간)
- `supabase-guestbook-setup.sql` — guestbooks 테이블 + RLS 정책

---
*최신 업데이트: 2026-05-09 (Phase 26 완료 — 맞춤 웨딩 초대장 + 방명록 + CSS 애니메이션)*
