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

---
*최신 업데이트: 2026-05-09 (Phase 24 완료 — Bilibili/Upload 지원 + Animation Preview)*
