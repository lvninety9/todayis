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

## Phase 5: 결제 시스템 (Next)

**Goal**: Toss Payments 연동을 통한 유료 템플릿 구매

**Requirements**: 
- PAYMENT-01: Toss Payments SDK 설정
- PAYMENT-02: 결제 프로세스 구현
- PAYMENT-03: 웹훅 핸들러 구현

**Status**: Not Started

Plans:
- [ ] 04-payment-system-01-PLAN.md — Toss Payments SDK 설정 및 기본 구조
- [ ] 04-payment-system-02-PLAN.md — 결제 요청/확인 API 및 UI 구현
- [ ] 04-payment-system-03-PLAN.md — 웹훅 핸들러, 취소 API, 내역 조회 구현

---

## Phase 6: 초대장 공개 (Next)

**Goal**: 생성된 초대장을 공개하고 공유할 수 있도록 구현

**Requirements**: 
- PUBLISH-01: 초대장 공개 API 구현
- PUBLISH-02: Subpath routing 구현
- PUBLISH-03: 공유 기능 구현

**Status**: Not Started

---

## Phase 7: 테스트 및 최적화 (Next)

**Goal**: 전체 시스템 테스트 및 성능 최적화

**Requirements**: 
- TEST-01: 단위 테스트 작성
- TEST-02: E2E 테스트 작성
- TEST-03: 성능 최적화

**Status**: Not Started

---

## 미정 (Backlog)

- 프로필 이미지 업로드
- 회원 목록 페이지네이션
- 프리미엄 템플릿 (구매)
- 커스텀 폰트
- 이모지, GIF 추가
- 배경 음악
- 동영상 초대장
- Kakao 로그인
- Naver Pay 연동
- AI 추천 템플릿
