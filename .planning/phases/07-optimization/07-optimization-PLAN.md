# Phase 7-03: 성능 최적화

**Goal**: 번들 분석, 코드 스플리팅, API 캐싱, 이미지 최적화 적용

**Dependencies**: 없음

---

## Task 1: 번들 분석

### 1.1 의존성 설치

```bash
npm install -D next-bundle-analyzer
```

### 1.2 next-bundle-analyzer 설정

`next.config.mjs`에 플러그인 추가:
```js
const withBundleAnalyzer = require('next-bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = { /* 기존 설정 */ };

module.exports = withBundleAnalyzer(nextConfig);
```

### 1.3 분석 스크립트 추가

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

### 1.4 번들 크기 목표

- `client` 번들: 200KB 이하 (gzip)
- `server` 번들: 300KB 이하 (gzip)
- 주요 번들 크기 확인: next.js, react, supabase-js, toss-payment-sdk

---

## Task 2: 코드 스플리팅

### 2.1 동적 import — 무거운 컴포넌트

**EasyCheckout 컴포넌트** (`src/components/payment/EasyCheckout.tsx`):
- `@tosspayments/payment-widget`는 번들 크기가 큼
- `next/dynamic`으로 lazy loading 적용
- `ssr: false` 설정 (클라이언트 전용)

```tsx
import dynamic from 'next/dynamic';

export const EasyCheckout = dynamic(
  () => import('@/components/payment/EasyCheckout').then(m => m.EasyCheckout),
  { ssr: false, loading: () => <Spinner /> }
);
```

### 2.2 동적 import — SDK

**Supabase 클라이언트** (`src/lib/supabase/client.ts`):
- 이미 `'use client'`로 분리됨 — 확인
- 서버 컴포넌트에서 직접 import하지 않도록 확인

**Toss Payment SDK** (`@tosspayments/payment-sdk`):
- EasyCheckout 내에서만 사용 → 이미 동적 import 대상
- `next/dynamic` 적용 시 `ssr: false` 필수

### 2.3 페이지 레벨 코드 스플리팅

**Admin 페이지** (`src/app/(main)/admin/page.tsx`):
- admin role가 아닌 사용자는 admin 페이지 번들 로드 불필요
- `next/dynamic`으로 admin 컴포넌트 lazy loading

```tsx
const AdminPage = dynamic(() => import('@/app/(main)/admin/page').then(m => m.default), {
  ssr: false,
  loading: () => <p>관리자 페이지 로딩 중...</p>,
});
```

### 2.4 라우트 레벨 코드 스플리팅

**Auth 페이지** (`src/app/(auth)/`):
- login, signup, reset-password 페이지는 별도 chunk로 분리
- Next.js App Router는 기본적으로 라우트별 코드 스플리팅 적용
- `next.config.mjs`에서 `experimental.clientDepthLimit` 확인

---

## Task 3: 이미지 최적화

### 3.1 Next.js Image 컴포넌트 적용

**템플릿 썸네일** (`src/components/templates/library/TemplateCard.tsx`):
- `<img>` → `<Image />` 컴포넌트로 변경
- `placeholder="blur"` — 썸네일 로딩 시 블러 효과
- `fill` 또는 `sizes` 속성으로 반응형 이미지 최적화

```tsx
import Image from 'next/image';

<Image
  src={template.thumbnail}
  alt={template.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={placeholder}
  className="rounded-lg"
/>
```

### 3.2 Supabase Storage 이미지 최적화

**아바타 이미지** (`src/app/api/profile/avatar/route.ts`):
- Supabase Storage URL에 `width` 및 `quality` 파라미터 추가
- 이미지 리사이즈 API 활용

```
https://xxx.supabase.co/storage/v1/render/image/public/avatar.png?width=200&quality=80
```

### 3.3 외부 이미지 도메인 설정

`next.config.mjs`에 외부 도메인 추가:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'xxx.supabase.co' },
    { protocol: 'https', hostname: 'pexels.com' },
    { protocol: 'https', hostname: 'maps.google.com' },
  ],
}
```

---

## Task 4: API 응답 캐싱

### 4.1 정적 렌더링 — 템플릿 목록

**템플릿 API** (`src/app/api/templates/route.ts`):
- 템플릿 목록은 자주 변경되지 않음
- `next.config.mjs`에서 revalidate 설정 또는 API 내에서 `Cache-Control` 헤더 추가

```ts
return NextResponse.json(templates, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
});
```

### 4.2 ISR — 공개 초대장 페이지

**공개 초대장** (`src/app/(main)/[username]/page.tsx`):
- `generateStaticParams`로 모든 공개 초대장 미리 생성
- `revalidate: 60` 설정 (1분마다 재검증)

```tsx
export async function generateStaticParams() {
  const { data: invitations } = await supabase
    .from('invitations')
    .select('slug')
    .eq('is_published', true);
  
  return invitations?.map(inv => ({ username: inv.slug })) || [];
}

export const dynamicParams = true;
```

### 4.3 데이터 페칭 최적화

**useSession hook** (`src/hooks/use-session.ts`):
- Supabase auth state change 리스너 — 이미 최적화됨
- 불필요한 리렌더링 방지 위해 `useRef` 비교 로직 확인 (이미 있음)

---

## Task 5: 폰트 최적화

### 5.1 Next.js Font Optimization

프로젝트에서 Google Fonts 사용 시:
- `next/font`로 폰트 서빙
- `display: 'swap'` 적용
- subsets 최소화 (`latin`만)

```tsx
import { Noto_Serif_KR } from 'next/font/google';

const noto = Noto_Serif_KR({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});
```

### 5.2 CSS 최적화

- Tailwind CSS v3에서 v4 마이그레이션 시 CSS 번들 크기 확인
- `purge` 설정으로 미사용 CSS 제거 (Tailwind v3 기준)
- Tailwind v4는 자동으로 tree-shaking 적용

---

## Task 6: Supabase 쿼리 최적화

### 6.1 인덱스 확인

**invitations 테이블**:
- `slug` 컬럼에 UNIQUE 인덱스 확인
- `is_published` 컬럼에 인덱스 추가

**templates 테이블**:
- `is_published` 컬럼에 인덱스 추가
- `user_id` 컬럼에 인덱스 확인

**payments 테이블**:
- `user_id` 컬럼에 인덱스 추가
- `payment_key` 컬럼에 UNIQUE 인덱스 확인

### 6.2 쿼리 최적화

- N+1 쿼리 패턴 확인 및 배치 쿼리로 변경
- `select(*)` → 필요한 컬럼만 선택
- 페이지네이션 적용 (admin/users, admin/templates)

---

## Verification Criteria

1. `npm run analyze` — 번들 분석 실행 및 주요 패키지 크기 확인
2. `npm run build` — 빌드 성공, 코드 스플리팅 적용 확인
3. Lighthouse 점수 목표:
   - Performance: 90+
   - Best Practices: 95+
   - SEO: 95+
4. API 응답 시간:
   - 템플릿 목록: 200ms 이하 (캐싱 적용 후)
   - 공개 초대장 조회: 300ms 이하
5. 번들 크기:
   - client (gzip): 200KB 이하
   - server (gzip): 300KB 이하
