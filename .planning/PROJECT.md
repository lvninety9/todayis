# Todayis - Wedding Invitation Platform

## What This Is

웹 기반 웨딩 초대장 제작 플랫폼으로, 사용자가 템플릿을 커스터마이징하고 모바일 최적화된 section 기반 초대장을 생성·공유할 수 있습니다.

## Core Value

**모바일 최적化的 아름다운 웨딩 초대장** — 사용자가 쉽게 만들고 공유할 수 있는 section 기반 초대장 시스템

## Requirements

### Validated

- ✓ TEMPLATE-01~04: 템플릿 렌더링 엔진, 실시간 미리보기, 데이터 바인딩 — Phase 1
- ✓ AUTH-01~04: Supabase Auth (Google/GitHub/Email), 세션 관리 — Phase 2
- ✓ TEMPLATE-MANAGE-01~03: 템플릿 CRUD, 라이브러리 UI, 업로드 — Phase 3
- ✓ PROFILE-01~04: 프로필 관리, 설정 페이지, 어드민 페이지 — Phase 4
- ✓ PUBLISH-01~03: 초대장 공개 API, subpath routing, 공유 기능 — Phase 6
- ✓ TEST-01~03: 단위 테스트 120개, E2E 테스트 40개, 성능 최적화 — Phase 7
- ✓ UI-01~04: UI 컴포넌트 현대화, glassmorphism, 디자인 시스템 — Phase 10
- ✓ FONT-01~03: 커스텀 폰트 업로드 (.ttf/.otf/.woff/.woff2) — Phase 11
- ✓ TEMPLATE-DESIGN-01~02: 템플릿 비주얼 디자인, fullscreen preview — Phase 17
- ✓ TEMPLATE-EDIT-01~03: 에디터 애니메이션/글꼴/색상 — Phase 17
- ✓ TEMPLATE-STRUCTURE-01~03: 모바일 section 구조, drag & drop reorder — Phase 17
- ✓ FIELD-01~05: 계좌번호, 배경음악, GIF, 동영상, 갤러리 FieldType — Phase 15
- ✓ FIELD-06~08: 축의도 메시지, Dress Code, 부모님 성함 FieldType — Phase 15
- ✓ VIDEO-01: 3개 템플릿에 video 필드 추가 — Phase 18
- ✓ VIDEO-02: InvitationViewer에서 video 필드 렌더링 — Phase 22
- ✓ AUDIO-01~02: audio 필드 통합 및 InvitationViewer 연동 — Phase 19
- ✓ DRESSCODE-01~02: dresscode 필드 추가 및 렌더링 — Phase 20
- ✓ TEMPLATE-ENGINE-01: TemplateEngine에서 video/audio animation 지원 — Phase 21
- ✓ VIDEO-03: Bilibili iframe, 파일 업로드, VideoFieldEditor 탭 UI — Phase 24
- ✓ ANIM-01: StyleEditor 애니메이션 실시간 미리보기 — Phase 24

### Active

- [ ] 회원 목록 페이지네이션 — admin 페이지의 회원 목록 페이지네이션 구현

### Out of Scope

- Naver Selling Page 직접 연동 (Phase 5) — 외부 링크 리다이렉트 방식으로 대체
- 동영상 초대장 (V3) — mp4 기반 초대장 전체 대신 video 링크만 지원
- Kakao 로그인 (V3) — Google/GitHub/Email만 지원
- AI 추천 템플릿 (V3) — 수동 템플릿 선택만 지원
- (2026-05-09) 프로젝트 MVP 완료 — V2/V3 기능은 별도 마일스톤에서 진행

## Context

### 기술 환경
- Next.js 14 (App Router), TypeScript strict 모드
- Supabase (PostgreSQL, Storage), shadcn/ui + Tailwind CSS v4
- Vercel 배포 (subpath routing: `todayismy.vercel.app/[username]`)

### 기존 아키텍처
- Section 기반 템플릿 시스템 (Phase 17): image, announcement, invitation, map, accounts, gallery, story 타입
- 3개 wedding 템플릿 (ROMANTIC, CLASSIC, MODERN) — 각 5 sections
- FieldType: 11개 타입 (text, date, image, location, account, audio, video, gallery, message, dresscode, parents)
- FieldEditor: switch-case 기반 타입별 에디터
- InvitationViewer: 필드 타입별 렌더링 (account, gallery, dresscode, parents, video, message)

### 알려진 이슈
- Phase 15에서 video/dresscode FieldType은 구현되었으나 템플릿에 사용되지 않음
- InvitationViewer에서 video는 default 텍스트 렌더링 (전용 player 미구현)
- audio는 musicUrl prop으로 별도 처리 (FieldType과 미연동)

## Constraints

- **Tech Stack**: Next.js 14 + Supabase — 변경 시 리스크 높음
- **Mobile-First**: 모바일 초대장 뷰어가 주요 사용 시나리오
- **Performance**: 이미지/미디어 로딩 최적화 필수 (next/image, lazy loading)
- **Browser Compatibility**: 모바일 브라우저별 audio/video 자동 재생 정책 고려

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Section 기반 템플릿 구조 (Phase 17) | 모바일 초대장 UX에 최적화 (긴 스크롤) | ✓ Good |
| FieldType 11개로 확장 (Phase 15) | 웨딩 특화 필드 지원 | ✓ Good |
| audio를 musicUrl prop으로 별도 처리 | 템플릿 필드와 분리된 전역 설정 | ⚠️ Revisit — FieldType과 연동 필요 |
| Supabase Storage (MVP) | 빠른 개발, S3로 마이그레이션 가능 | ✓ Good |

---
*Last updated: 2026-05-07 after v2.0 milestone initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
