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

**Goal**: Naver Selling Page (네이버 판매 페이지) 연동을 통한 유료 템플릿 구매

**Requirements**: 
- PAYMENT-01: Naver Selling Page 연동 설정, payments 테이블 확장
- PAYMENT-02: 템플릿 상세 페이지에서 "구매하기" 클릭 시 네이버 판매 페이지로 리다이렉트
- PAYMENT-03: 구매 완료 후 복귀 처리, 구매 상태 확인

**Status**: Pending

---

## Phase 10: UI/UX 전면 개편 + 네이버 연동

**Goal**: 2026 트렌드 디자인 시스템 적용 + Naver Selling Page 연동 + 신규 페이지

**Requirements**:
- NP-01: Naver Selling Page API 연동 설정
- NP-02: 템플릿 상세 페이지 구매 버튼 → 네이버 리다이렉트
- NP-03: 랜딩 페이지 (메인) 구현
- NP-04: 상세 페이지 (템플릿 소개) 구현
- NP-05: 회원관리 페이지 구현
- NP-06: 주문제작 안내 페이지 구현
- NP-07: 가격 안내 페이지 구현
- UI-01: 로그인/회원가입 페이지 glassmorphism + 소셜 가독성
- UI-02: 대시보드 카드 그리드 + 통계
- UI-03: 템플릿 라이브러리 modern design
- UI-04: 공개 초대장 wedding romantic design
- UI-05: 네비게이션 glassmorphism + mobile bottom tab
- EDITOR-01: 편집기 드래그 앤 드롭
- EDITOR-02: 편집기 실시간 프리뷰

**Status**: In Progress (Wave 1 완료, 편집기 재설계 미실행)

Plans:
- [x] 10-01-PLAN.md — UI 컴포넌트 현대화 (Button, Card, Input)
- [x] 10-02-PLAN.md — 로그인/회원가입 Glassmorphism
- [x] 10-03-PLAN.md — 대시보드 카드 그리드 + 통계
- [x] 10-04-PLAN.md — 템플릿 라이브러리 modern design
- [x] 10-05-PLAN.md — 템플릿 상세 + 구매버튼 (Naver)
- [x] 10-06-PLAN.md — 편집기 재설계 (드래그 앤 드롭)
- [x] 10-07-PLAN.md — 공개 초대장 wedding romantic
- [x] 10-08-PLAN.md — Naver Selling Page 연동
- [x] 10-09-PLAN.md — 네비게이션 glassmorphism
- [x] 10-10-PLAN.md — 신규 페이지 5개 + 버그 수정
- [x] 10-11-PLAN.md — 신규 의존성 설치

---

## Phase 6: 초대장 공개

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

## Phase 7: 테스트 및 최적화

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
- [x] src/lib/template-utils.test.tsx — 13 tests
- [x] src/types/payment.test.ts — 6 tests
- [x] src/lib/payment/toss.test.ts — 6 tests
- [x] src/lib/auth.test.ts — 7 tests
- [x] src/components/ui/button.test.tsx — 8 tests
- [x] src/types/template-data.test.ts — 9 tests
- [x] src/components/ui/badge.test.tsx — 6 tests
- [x] src/components/ui/card.test.tsx — 18 tests
- [x] src/components/ui/skeleton.test.tsx — 3 tests
- [x] src/hooks/use-template-editor.test.tsx — 19 tests
- [x] src/hooks/use-payment.test.tsx — 16 tests

**Test Summary**: 120 tests across 11 test files — all passing

Plans:
- [x] 07-tests-unit-PLAN.md — Vitest + RTL 설정 (7/7 tasks)
- [x] 07-tests-e2e-PLAN.md — Playwright 설정 (40 tests passed)
- [x] 07-optimization-PLAN.md — 번들 분석, 코드 스플리팅, API 캐싱, 이미지 최적화

---

## Phase 8: Frontend Design Modernization

**Goal**: Frontend 전체 개편 - UI 현대화, 텍스트 렌더링 효과, 템플릿 편집기 고급화

**Requirements**: 
- UI-01: shadcn/ui 기반 최신 UI 컴포넌트 redesign
- UI-02: 텍스트 렌더링 효과
- UI-03: 템플릿 편집기 고급 기능
- UI-04: 애니메이션/모션 효과 통합

**Status**: Complete (8-01~8-07 완료)

---

## Phase 9: Backlog Features Selection

**Goal**: V2/V3 기능 - 프리미엄 템플릿, 배경 음악, 이모지/GIF, V2 Enhanced Features

**Requirements**: 
- BACKLOG-01: 프리미엄 템플릿
- BACKLOG-02: 구매 기록 관리
- BACKLOG-03: 배경 음악
- BACKLOG-04: 음악 재생 컨트롤
- BACKLOG-05: 이모지 지원
- BACKLOG-06: GIF 지원
- BACKLOG-07: V2 Enhanced Features

**Status**: Complete

Plans:
- [x] 09-backlog-features-01-PLAN.md — 프리미엄 템플릿 구매 시스템
- [x] 09-backlog-features-02-PLAN.md — 배경 음악
- [x] 09-backlog-features-03-PLAN.md — 이모지/GIF 지원
- [x] 09-backlog-features-04-PLAN.md — V2 Enhanced Features

---

## Phase 11: 커스텀 폰트 업로드

**Goal**: 사용자가 .ttf/.otf/.woff/.woff2 폰트 파일을 업로드하고 템플릿에 적용

**Requirements**:
- FONT-01: 폰트 유틸리티 (fonts.ts) — getFontFamily, getFontCSSVar, loadGoogleFont
- FONT-02: InvitationViewer에서 fontFamily 적용
- FONT-03: 커스텀 폰트 업로드 API + StyleEditor 연동

**Status**: Complete

Implementation:
- [x] src/lib/fonts.ts — 폰트 유틸리티 라이브러리 (getFontFamily, getFontCSSVar, loadGoogleFont)
- [x] src/app/layout.tsx — HeadFonts 컴포넌트 (Google Fonts 동적 로드)
- [x] src/app/api/fonts/route.ts — 커스텀 폰트 업로드/삭제 API (POST/DELETE)
- [x] src/components/templates/editor/StyleEditor.tsx — 커스텀 폰트 업로드 UI (5개 제한)
- [x] src/components/publish/InvitationViewer.tsx — @font-face CSS 주입, effectiveFontFamily 적용

Plans:
- [x] 11-01-PLAN.md — 폰트 유틸리티, layout.tsx 연동, InvitationViewer 폰트 적용
- [x] 11-02-PLAN.md — 커스텀 폰트 업로드 API + StyleEditor 연동 + InvitationViewer 커스텀 폰트 적용

---

## Phase 12: 배경 음악 (V2)

**Goal**: 사용자가 배경 음악을 업로드하고 초대장에서 재생

**Requirements**:
- MUSIC-01: 음악 파일 업로드 API (mp3, wav, ogg)
- MUSIC-02: 음악 플레이어 컴포넌트 (재생/일시정지/볼륨)
- MUSIC-03: StyleEditor 연동 — 음악 선택/미리보기
- MUSIC-04: InvitationViewer 연동 — 자동 재생 옵션

**Status**: Pending (계획 단계)

**Next Steps**:
1. /gsd-discuss-phase --auto — 배경 음악 구현 방식 논의
2. /gsd-plan-phase — 상세 계획 수립
3. /gsd-execute-phase — 구현

---

## Phase 12: 배경 음악 (V2)

**Goal**: 사용자가 배경 음악을 업로드하고 초대장에서 재생

**Requirements**:
- MUSIC-01: 음악 파일 업로드 API (mp3, wav, ogg)
- MUSIC-02: 음악 플레이어 컴포넌트
- MUSIC-03: StyleEditor 연동
- MUSIC-04: InvitationViewer 연동

**Status**: Pending

**의사결정 사항**:
- 음악 파일 저장소: Supabase Storage vs AWS S3
- 음악 재생 방식: HTML5 Audio vs Web Audio API
- 편집기 미리보기: 실시간 음악 재생 여부

---

## Phase 13: 디자인 시스템 구축

**Goal**: 웹 페이지 전체 디자인 최신 트렌드 반영 (웨딩 초대장 + 프론트엔드)

**Requirements**:
- DESIGN-01: 디자인 트렌드 학습/탐색 (TypeUI, Pretext, Zola, TheKnot, shadcn/ui, Tailwind, Motion, Stripe, Linear, Airbnb) ✅ 완료
- DESIGN-02: 디자인 시스템 수립 (CSS variables, Tailwind tokens, typography) ✅ 완료
- DESIGN-03: 페이지별 리디자인 (로그인, 대시보드, 템플릿 라이브러리, 편집기, 공개 초대장) ✅ 완료
- DESIGN-04: Component Updates (input, badge) ✅ 완료
- DESIGN-05: Micro-interactions + Animation ✅ 완료

**Status**: Complete (5/5 Plans 완료)

**분석 완료한 레퍼런스**:
- Wedding: Zola (navy/coral), TheKnot (pink/peach)
- Design System: TypeUI, Pretext, shadcn/ui (oklab), Tailwind v4
- Modern UI: Motion (CSS), Stripe (purple), Linear (dark), Airbnb (red)

**2026 트렌드**:
- 웨딩 초대장: Editorial Minimalism, Quiet Luxury, Warm Palette (terracotta #E07A5F, sage #81B29A, blush #F4A0B5)
- 웹 UI: Micro animations, Solid cards + subtle shadows, Clean typography system

**디자인 스킬 생성**:
- `/media/jay/D/cursor/design-skills/todayis-wedding/SKILL.md` — 2026 트렌드 적용

**다음 작업**: Phase 14 — 버그 수정 + UX 개선

**새 세션에서**: `/gsd` — Phase 14 계속 진행

---

## Phase 14: 버그 수정 + 템플릿 UX 개선

**Goal**: Phase 13 디자인 시스템 적용 후 발견된 버그 수정 및 템플릿 시스템 UX 개선

**Requirements**:
- BUG-01: 로고 클릭 시 로그인 페이지로 redirect되는 버그 수정 → `/landing`으로 변경
- BUG-02: 템플릿 카드 클릭 시 미리보기 없는 문제 해결 → 미리보기 페이지 연결
- BUG-03: Edit 페이지 미리보기 영역 비어있음 문제 → 빈 상태 처리
- UX-01: 템플릿 필드 타입 확장 (계좌번호, 배경음악, GIF 등) → Phase 15로 미루기
- UX-02: dashboard, login, TemplatePreview의 indigo hard-coded 색상을 warm palette로 교체
- UX-03: 전체 디자인 퀄리티 개선 (트렌디한 UX)

**Status**: Pending (discuss-phase 완료, planning 단계)

**결정된 사항** (14-CONTEXT.md):
- 로고/root 클릭 → `/landing`으로 이동
- 템플릿 카드 클릭 → 미리보기 페이지 이동
- Warm palette 실제 적용 (hard-coded indigo → CSS variables)

**2026 디자인 트렌드** (Phase 13 리서치 결과):
- Bento Grid Layout (67% SaaS 사용)
- CSS Scroll-Driven Animations
- Quiet Luxury + Warm Romance
- TypeUI Design Skills 적용

**Design Skill**:
- `/media/jay/D/cursor/design-skills/todayis-wedding/SKILL.md` — 2026 트렌드 적용

**다음 단계**:
1. /gsd-plan-phase 14 — 계획 수립
2. /gsd-execute-phase 14 — 구현

**새 세션에서**: `/gsd 14` 또는 `/gsd-plan-phase 14`

---

## Phase 08: 테스트

**Goal**: 단위 테스트 및 E2E 테스트 작성

**Requirements**: 
- TEST-01: 단위 테스트 작성
- TEST-02: E2E 테스트 작성

**Status**: Complete (단위 테스트 128개 ✅, E2E 테스트 36개 통과, 4개 실패 — Gap Closure 필요)

---

## Phase 15: 템플릿 필드 확장 (V2)

**Goal**: 템플릿 필드 타입 확장 (계좌번호, 배경음악, GIF, 동영상, 갤러리 등)

**Requirements**:
- FIELD-01: 계좌번호 필드 (무엇을 기준으로 송금?)
- FIELD-02: 배경 음악 URL (mp3/ogg/wav)
- FIELD-03: GIF/애니메이션 이미지 (GIF)
- FIELD-04: 동영상 URL (mp4)
- FIELD-05: 갤러리 (여러 이미지)
- FIELD-06: 축의도 메시지
- FIELD-07: Dress Code
- FIELD-08: 부모님 성함 (신랑/신부父모)

**Status**: Pending (Backlog - Phase 14 이후)

**Next Steps:**
1. Phase 14 완료 후 discuss-phase
2. plan-phase
3. execute-phase

---

## 미정 (Backlog)

- 프리미엄 템플릿 (V2)
- 이모지/GIF 지원 (V2)
- 동영상 초대장 (V3)
- Kakao 로그인 (V3)
- AI 추천 템플릿 (V3)
- 회원 목록 페이지네이션
- 프리미엄 템플릿 (V2)
- 이모지/GIF 지원 (V2)
