# wiki/decisions.md — 주요 결정사항

## 기술 결정

| 결정 | 배경 | 결과 | 상태 |
|------|------|------|------|
| Section 기반 템플릿 구조 | 모바일 초대장 UX에 최적화 (긴 스크롤) | ROMANTIC/CLASSIC/MODERN 각 5 섹션 | 고정 |
| FieldType 11개로 확장 | 웨딩 특화 필드 지원 | account, gallery, dresscode, parents 등 | 고정 |
| Supabase Storage (MVP) | 빠른 개발, S3 마이그레이션 가능 | 현재 MVP 단계 | V2+에서 S3로 변경 예정 |
| audio를 musicUrl prop으로 별도 처리 | 템플릿 필드와 분리된 전역 설정 | ⚠️ FieldType과 미연동 | Phase 19에서 통합 예정 |
| Naver Selling Page 리다이렉트 | 직접 연동 리스크 회피 | 외부 링크 방식으로 대체 | 고정 |

## 아키텍처 결정

| 결정 | 배경 | 결과 | 상태 |
|------|------|------|------|
| App Router (Next.js 14) | 최신 라우팅, 서버 컴포넌트 | (auth)/(main) route groups | 고정 |
| subpath routing | `todayismy.vercel.app/[username]` | 공개 초대장 URL 구조 | 고정 |
| shadcn/ui 재사용 | 일관된 UI, 커스터마이징 용이 | button, card, dialog 등 10+ 컴포넌트 | 고정 |
| Vitest + RTL | React Testing Library 패턴 | 120개 단위 테스트 | 고정 |

## 환경 최적화 (2026-05-07)

| 결정 | 배경 | 결과 | 상태 |
|------|------|------|------|
| 블로그 자동화 스킬 22개 제거 | todayis 프로젝트 무관, 컨텍스트 낭비 | 87→65개 (GSD 전용) | 완료 |
| AGENTS.md GSD 명령어 분리 | 새 세션에서 67줄 불필요 로드 | wiki/gsd-commands.md로 분리 | 완료 |
| .planning/ 20개 파일 정리 | wiki/status.md가 단일 출처 | phases/ + 핵심 5파일만 유지 | 완료 |
| 루트 중복 문서 10개 제거 | SESSION-HANDOFF, OPENCODE.md 등 | wiki 기반 단일 출처로 통합 | 완료 |
| 완료 페이즈 디렉토리 삭제 | 19개 완료 페이즈, 16,000줄 | 백업 후 삭제 예정 | 다음 세션 |
| 대형 GSD 워크플로우 slim화 | TOP 5가 804줄, ~3,850토큰 | -50% 목표 | 다음 세션 |

## Phase 19: Audio 필드 통합 — gray areas 결정 (2026-05-08)

| 결정 | 선택지 A | 선택지 B | 선택 | 근거 |
|------|----------|----------|------|------|
| Audio section 배치 | image-hero 직후 (order 1.5) | announcement 직후 (order 3.5) | image-hero 직후 | 배경음악은 초대장 로드 시점부터 재생되어야 함 |
| Audio 필드 구조 | 단일 `audioUrl` 필드 (text type) | 다중 필드 (url, autoPlay, volume) | 단일 `audioUrl` 필드 | MVP에서는 URL 입력만 필요. 고급 설정은 Phase 12에서 |
| InvitationViewer 연동 | `invitation.data.audioUrl` 읽기 | section 기반 조회 | `invitation.data.audioUrl` 읽기 | 기존 musicUrl 패턴과 동일. layout.musicUrl → data.audioUrl로 이동 |
| musicUrl prop 유지 | 유지 (fallback) | 완전 제거 | 유지 (fallback) | 기존 초대장 호환성. audioUrl 우선, musicUrl 폴백 |
| 볼륨 컨트롤 | 버튼에 슬라이더 추가 | 새 컴포넌트 분리 | 버튼에 슬라이더 추가 | 성공기준 "볼륨 컨트롤 가능" 충족. 단순 구현으로 토큰 절약 |

---

## Phase 5: 결제 시스템 — gray areas 결정 (2026-05-08)

| 결정 | 선택지 A | 선택지 B | 선택 | 근거 |
|------|----------|----------|------|------|
| 결제 방식 | Toss Payments 직접 연동 | Naver Selling Page 리다이렉트 | Naver Selling Page 리다이렉트 (MVP) | 외부 링크 방식으로 리스크 회피. Toss Payments는 백엔드 검증 인프라로 유지 |
| payments 테이블 | user_id + template_id 조합 | orderId만 | user_id + template_id | 구매 상태 확인(체크)에 필요. template_id별 구매 이력 추적 |
| 구매 확인 방식 | 웹훅 수신 대기 | 클라이언트 side check | 클라이언트 side check (`/api/payment/check`) | Naver Selling Page는 웹훅 지원 안함. 템플릿 페이지 마운트 시 check API 호출 |

---

## Phase 23: 프리미엄 템플릿 — gray areas 결정 (2026-05-08) ✅ 완료

| 결정 | 선택지 A | 선택지 B | 선택 | 근거 |
|------|----------|----------|------|------|
| 프리미엄 템플릿 구조 | user 템플릿 라이브러리에 추가 | 별도 premium_templates 테이블 | user 템플릿 라이브러리에 추가 | payments 테이블과 연동. 구매 이력 추적 가능 |
| 구매 플로우 | 기존 Naver Selling Page 리다이렉트 재사용 | Toss Payments 직접 연동 | Naver Selling Page 리다이렉트 재사용 | Phase 5에서 이미 구현됨. 가장 빠른 구현 |
| 접근 권한 | 구매 시점 즉시 사용 가능 | 관리자 승인 후 사용 가능 | 구매 시점 즉시 사용 | UX 최적화. MVP에서는 신뢰 기반 |

---

## 프로젝트 MVP 완료 (2026-05-09)

| 결정 | 내용 | 상태 |
|------|------|------|
| MVP 범위 확정 | Phase 1~24 완료 — 템플릿 엔진, 인증, 템플릿 관리, 초대장 공개, 테스트, UI 리디자인, 필드 확장, 결제, 프리미엄 템플릿, Video/Audio/Dress Code, Animation | 고정 |
| Out of Scope 유지 | Kakao 로그인, AI 추천 템플릿, 동영상 초대장 전체 — V3 마일스톤에서 별도 검토 | 고정 |
| 백로그 정리 | 프리미엄 템플릿/이모지-GIF는 이미 Phase 9/23에서 완료. 중복 항목 제거 | 완료 |
| 다음 마일스톤 | V2: 회원 목록 페이지네이션. V3: Kakao 로그인, AI 추천, 동영상 초대장 | 미정 |

## Phase 25: 회원 목록 페이지네이션 — gray areas 결정 (2026-05-09) ✅ 완료

| 결정 | 선택지 A | 선택지 B | 선택 | 근거 |
|------|----------|----------|------|------|
| 페이지네이션 단위 | 10명/페이지 | 20명/페이지 | 10명/페이지 | 템플릿 페이지네이션(limit=20)과 동일 패턴, admin 목록은 10명이 적정 |
| Supabase admin API 사용 | `listUsers({page, perPage})` | SQL 직접 쿼리 | `listUsers()` | Supabase Auth API가 page/perPage 지원. admin API 사용이 안전 |
| tab 전환 시 페이지 리셋 | users tab 전환 시 page=1 | 유지 | page=1 | UX 기본. 다른 탭으로 전환 시 첫 페이지로 리셋 |

---

## Phase 26: 맞춤 웨딩 초대장 — gray areas 결정 (2026-05-09) ✅ 완료

| 결정 | 선택지 A | 선택지 B | 선택 | 근거 |
|------|----------|----------|------|------|
| 초대장 구조 | 기존 5섹션 유지 | 3섹션으로 단순화(히어로, 축하메시지, 방명록) | 3섹션 단순화 | 날짜/장소/지도/계좌 불필요. 축하 목적의 간소화 초대장 |
| 방명록 데이터베이스 | Supabase `guestbooks` 테이블 | 로컬 스토리지 | Supabase | 실시간 동시 작성 지원. 서버 사이드 저장 필요 |
| 방명록 필드 | author + message + timestamp | author + message + timestamp + createdAt | author + message + timestamp | Supabase 기본 `updated_at` 활용. createdAt은 `created_at`으로 명시 |
| 이미지 효과 | CSS 애니메이션 | GIF/프레젠테이션 | CSS 애니메이션 + 전환 | 서버 리소스 불필요. 클라이언트 side에서轻량 구현 |
| 템플릿 커스터마이징 | 새 템플릿 생성 | 기존 템플릿 수정 | 기존 템플릿 수정 | ROMANTIC/CLASSIC/MODERN 중 하나 선택 후 section 구조 변경 |

## Phase 27: Bug 3 (Preview Data Mismatch) — gray areas (2026-05-10) ✅ 완료

| 결정 | 선택지 A | 선택지 B | 선택 | 근거 |
|------|----------|----------|------|------|
| Preview 데이터 소스 | template.fields만 읽기 | template.sections 우선 읽기 | sections 우선 | section 기반 템플릿은 sections[].fields[].defaultValue에 실제 값 저장. flat fields는 빈 배열일 수 있음 |

## Phase 27: Critical Bug Fixes & Sharing Feature — gray areas (2026-05-10) ✅ 완료

| 결정 | 선택지 A | 선택지 B | 선택 | 근거 |
|------|----------|----------|------|------|
| 공유 URL 구조 | `todayismy.vercel.app/[username]` 재사용 | `/invite/${templateId}` 새 라우트 | 기존 재사용 | 이미 subpath routing 시스템 존재. 중복 유지 비용 회피 |
| 공유 버튼 위치 | 템플릿 카드에만 | 카드 + 편집 페이지 + 템플릿 상세 | 둘 다 | 어디서든 공유 가능해야 UX 최적 |
| 공개 토글 자동 | 공유 시 자동 공개 | 수동 공개 토글 후 공유 | 수동 공개 토글 | 사용자가 공개 여부 직접 결정 |
| 세션 디버깅 우선 | Vercel 로그 확인 | 로컬 production build 재현 | 둘 다 | Vercel 로그 먼저 확인, 필요시 로컬 재현 |

## 미결/논의 중

- (Phase 12 항목 2개는 Phase 19에서 Supabase Storage + HTML5 Audio로 결정됨 — stale 제거 예정)

---

*최신 업데이트: 2026-05-10 (Phase 27 Wave 4 완료 — Bug 5 fix, build/lint 통과, Vercel 재배포 대기)*
