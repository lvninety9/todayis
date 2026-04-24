# Todayis - Wedding Invitation Platform

## Phase 1: 템플릿 엔진 개발

**Goal**: 기본 템플릿 렌더링 시스템, 실시간 미리보기, 데이터 바인딩 구현

**Requirements**: 
- TEMPLATE-01: 템플릿 타입 정의 및 구조 설계
- TEMPLATE-02: 템플릿 렌더링 엔진 구현
- TEMPLATE-03: 실시간 미리보기 기능 구현
- TEMPLATE-04: 데이터 바인딩 시스템 구현

**Status**: Complete

Plans:
- [x] 01-template-engine-01-PLAN.md — 템플릿 타입 정의 및 컴포넌트 skeleton 생성
- [x] 01-template-engine-02-PLAN.md — 템플릿 유틸리티, 샘플 데이터, 렌더링 엔진 구현
- [x] 01-template-engine-03-PLAN.md — 실시간 편집기 및 미리보기 연동 구현

---

## Phase 2: 인증 시스템

**Goal**: Supabase Auth 를 통한 사용자 인증 구현

**Requirements**: 
- AUTH-01: Supabase Auth 설정
- AUTH-02: Google/GitHub 로그인 구현
- AUTH-03: Email/비밀번호 로그인 구현
- AUTH-04: 세션 관리 구현

**Status**: Complete

Plans:
- [x] 02-auth-system-01-PLAN.md — Supabase Auth 설정 및 기본 구조
- [x] 02-auth-system-02-PLAN.md — 소셜 로그인 구현
- [x] 02-auth-system-03-PLAN.md — 이메일 로그인 및 세션 관리
- [x] 02-auth-system-gap-closure-PLAN.md — Auth system gap closure (OAuth wiring, root layout, session hook)

---

## Phase 3: 템플릿 관리

**Goal**: 템플릿 CRUD 및 라이브러리 관리

**Requirements**: 
- TEMPLATE-MANAGE-01: 템플릿 CRUD API 구현
- TEMPLATE-MANAGE-02: 템플릿 라이브러리 UI 구현
- TEMPLATE-MANAGE-03: 템플릿 업로드 기능 구현

**Status**: Complete

Plans:
- [x] 03-template-management-01-PLAN.md — 템플릿 타입 정의 및 데이터베이스 스키마
- [x] 03-template-management-02-PLAN.md — 템플릿 CRUD API 구현
- [x] 03-template-management-03-PLAN.md — 템플릿 라이브러리 UI 구현
- [x] 03-template-management-04-PLAN.md — 템플릿 업로드 기능 구현

---

## Phase 4: 프로필 및 설정

**Goal**: 사용자 프로필 관리 및 설정 페이지 구현

**Requirements**: 
- PROFILE-01: 프로필 API (닉네임, 소개)
- PROFILE-02: /settings 설정 페이지
- PROFILE-03: /admin 어드민 페이지 (회원/템플릿 관리)
- PROFILE-04: admin role 기반 권한 검증

**Status**: Complete

Implementation:
- [x] src/app/api/profile/route.ts — 프로필 CRUD API
- [x] src/app/(main)/settings/page.tsx — 설정 페이지 (닉네임, 소개 관리)
- [x] src/app/(main)/admin/page.tsx — 어드민 페이지 (회원/템플릿 관리)
- [x] src/app/api/admin/users/route.ts — 회원 관리 API (role 검증 포함)
- [x] src/app/api/admin/templates/route.ts — 템플릿 관리 API (role 검증 포함)
- [x] src/lib/auth.ts — 공용 auth 헬퍼 (getUserFromRequest, requireAdmin)

---

## Phase 5: 결제 시스템

**Goal**: Toss Payments Easy Checkout 연동을 통한 유료 템플릿 구매

**Requirements**: 
- PAYMENT-01: payments 테이블 생성, templates 가격 컬럼 추가, Toss Payments SDK 설정
- PAYMENT-02: 결제 요청 API, 구매 상태 확인 API, Easy Checkout 모달 구현
- PAYMENT-03: 웹훅 핸들러, 취소 API, 템플릿 상세 페이지 통합

**Status**: Complete

Implementation:
- [x] supabase-payment-setup.sql — payments 테이블 생성 + templates 확장 + 인덱스 + RLS
- [x] src/types/payment.ts — PaymentStatus, Payment, PaymentInsert, PaymentUpdate 정의
- [x] src/lib/payment/toss.ts — TossPaymentsClient 구현 (confirmPayment, cancelPayment, getPayment)
- [x] src/app/api/payment/request/route.ts — 결제 요청 API
- [x] src/app/api/payment/verify/route.ts — 결제 검증 API
- [x] src/app/api/payment/webhook/route.ts — Toss 웹훅 핸들러
- [x] src/app/api/payment/[paymentId]/cancel/route.ts — 결제 취소 API
- [x] src/components/payment/EasyCheckout.tsx — Easy Checkout 모달 컴포넌트
- [x] src/hooks/use-payment.ts — 결제 훅
- [x] src/app/(main)/templates/[id]/page.tsx — 템플릿 상세 페이지 (구매 버튼 통합)

---

## Phase 6: 초대장 공개 (Next)

**Goal**: 생성된 초대장을 공개하고 공유할 수 있도록 구현

**Requirements**: 
- PUBLISH-01: 초대장 공개 API 구현
- PUBLISH-02: Subpath routing 구현
- PUBLISH-03: 공유 기능 구현

**Status**: Complete

Implementation:
- [x] supabase SQL — invitations 테이블 생성
- [x] src/app/api/invitations/[slug]/route.ts — 공개 조회 API (GET)
- [x] src/app/api/invitations/[slug]/publish/route.ts — 공개 토글 API (POST)
- [x] src/app/(main)/[username]/page.tsx — subpath routing 공개 초대장 페이지
- [x] src/components/publish/InvitationViewer.tsx — 초대장 뷰어 컴포넌트
- [x] src/components/publish/ShareButton.tsx — 공유 버튼 컴포넌트
- [x] src/components/publish/ShareDialog.tsx — 공유 다이얼로그 컴포넌트
- [x] src/app/api/invitations/route.ts — 초대장 생성 API (POST)
- [x] src/app/(main)/create/[templateId]/page.tsx — 초대장 생성 페이지
- [x] src/components/publish/InvitationEditor.tsx — 초대장 편집기 컴포넌트 (공개 토글 포함)

Plans:
- [x] 06-publish-system-01-PLAN.md — invitations 테이블 생성, 공개 조회 API, 토글 API
- [x] 06-publish-system-02-PLAN.md — subpath routing (`/[username]`) 공개 초대장 페이지, 공유 컴포넌트
- [x] 06-publish-system-03-PLAN.md — editor에 공개 토글 통합, 초대장 생성 API

---

## Phase 7: 테스트 및 최적화 (Next)

**Goal**: 전체 시스템 테스트 및 성능 최적화

**Requirements**: 
- TEST-01: 단위 테스트 작성
- TEST-02: E2E 테스트 작성
- TEST-03: 성능 최적화

**Status**: Complete (7-01 단위 테스트 120개, 7-02 E2E 테스트 40개, 7-03 최적화 완료)

Implementation:
- [x] vitest.config.ts — Vitest 설정 (jsdom, coverage, path alias)
- [x] src/test/setup.ts — 테스트 설정 (Supabase mock, next/navigation mock)
- [x] package.json — test, test:run, test:coverage 스크립트
- [x] src/lib/template-utils.test.tsx — 13 tests (validateTemplateData, getDefaultValue, renderField)
- [x] src/types/payment.test.ts — 6 tests (PaymentStatus, PaymentInsert, PaymentUpdate)
- [x] src/lib/payment/toss.test.ts — 6 tests (TossPaymentsClient, getTossClient)
- [x] src/lib/auth.test.ts — 7 tests (getUserFromRequest, requireAdmin)
- [x] src/components/ui/button.test.tsx — 8 tests (buttonVariants)
- [x] src/types/template-data.test.ts — 9 tests (TemplateData, TemplateField, Template interface 구조 검증)
- [x] src/components/ui/badge.test.tsx — 6 tests (badgeVariants)
- [x] src/components/ui/card.test.tsx — 18 tests (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [x] src/components/ui/skeleton.test.tsx — 3 tests (Skeleton)
- [x] src/hooks/use-template-editor.test.tsx — 19 tests (useTemplateEditor hook)
- [x] src/hooks/use-payment.test.tsx — 16 tests (usePayment hook)

**Test Summary**: 120 tests across 11 test files — all passing
**TypeScript**: `npx tsc --noEmit` — pass
**Build**: `npm run build` — pass

Plans:
- [x] 07-tests-unit-PLAN.md — Vitest + RTL 설정, 유틸리티/컴포넌트/훅 단위 테스트 (7/7 tasks)
- [x] 07-tests-e2e-PLAN.md — Playwright 설정, 핵심 사용자 플로우 E2E 테스트 (40 tests passed)
- [ ] 07-optimization-PLAN.md — 번들 분석, 코드 스플리팅, API 캐싱, 이미지 최적화

---

## Phase 8: Frontend Design Modernization

**Goal**: Frontend 전체 개편 - UI 현대화, 텍스트 렌더링 효과, 템플릿 편집기 고급화

**Requirements**: 
- UI-01: shadcn/ui 기반 최신 UI 컴포넌트 redesign
- UI-02: Pretext 기반 텍스트 렌더링 효과
- UI-03: 템플릿 편집기 고급 기능 (animation, music, font styles)
- UI-04: 트렌디한 애니메이션/모션 효과 통합

**Status**: Complete (8-01~8-07 완료, 8-08 테스트 생략)

---

## Phase 9: Backlog Features Selection

**Goal**: Select and implement V2/V3 features from backlog - premium templates, background music, emoji/GIF support, V2 enhanced features

**Requirements**: 
- BACKLOG-01: 프리미엄 템플릿 (templates.price 필드, 구매 시스템)
- BACKLOG-02: 사용자 구매 기록 관리 (is_purchased 필드)
- BACKLOG-03: 배경 음악 (MP3 업로드/재생)
- BACKLOG-04: 음악 재생 컨트롤 (mute, volume)
- BACKLOG-05: 이모지 지원 (텍스트 필드에 직접 입력)
- BACKLOG-06: GIF 지원 (이미지 업로드 방식으로)
- BACKLOG-07: V2 Enhanced Features (동적 배경, 애니메이션, 페이지 넘기기, 줌인/줌아웃, 필터, 실시간 프리뷰, 포토샵 기능, 꽃 효과)

**Status**: In Progress

Plans:
- [ ] 09-backlog-features-01-PLAN.md — 프리미엄 템플릿 구매 시스템
- [ ] 09-backlog-features-02-PLAN.md — 배경 음악 업로드/재생
- [ ] 09-backlog-features-03-PLAN.md — 이모지/GIF 지원
- [ ] 09-backlog-features-04-PLAN.md — V2 Enhanced Features

---

## 미정 (Backlog)

- 회원 목록 페이지네이션
- 커스텀 폰트
