# ROADMAP.md

## Project Overview

Todayis - 웨딩 초대장 제작 플랫폼

## Phase Roadmap

### Phase 1: Setup (완료)
- [x] 프로젝트 초기화
- [x] shadcn/ui 컴포넌트 설치
- [x] Supabase 설정
- [x] 데이터베이스 스키마 생성
- [x] Storage 버킷 설정

### Phase 2: Auth (인증 시스템)
**Goal:** 사용자 인증 시스템 구현
**Requirements:** AUTH-01, AUTH-02, AUTH-03
**Completed:** 2026-04-04

**Plans:**
- [x] 02-auth-01-PLAN.md — Supabase Auth 연동 및 타입 정의
- [x] 02-auth-02-PLAN.md — 로그인/회원가입 페이지 구현
- [x] 02-auth-03-PLAN.md — 인증 보호 라우트 및 미들웨어 설정

### Phase 3: Template (템플릿 엔진)
**Goal:** 템플릿 목록 및 상세 페이지 구현
**Requirements:** TEMP-01, TEMP-02

**Plans:**
- [ ] 03-template-01-PLAN.md — 템플릿 데이터 모델 및 API
- [ ] 03-template-02-PLAN.md — 템플릿 목록 UI 구현

### Phase 4: Editor (편집기)
**Goal:** 초대장 편집기 구현
**Requirements:** EDIT-01, EDIT-02, EDIT-03

**Plans:**
- [ ] 04-editor-01-PLAN.md — 편집기 기본 구조
- [ ] 04-editor-02-PLAN.md — 텍스트/이미지 편집 기능
- [ ] 04-editor-03-PLAN.md — 실시간 미리보기

### Phase 5: Payment (결제 시스템)
**Goal:** Toss Payments 연동
**Requirements:** PAY-01, PAY-02

**Plans:**
- [ ] 05-payment-01-PLAN.md — Toss Payments API 연동
- [ ] 05-payment-02-PLAN.md — 결제 페이지 UI

### Phase 6: Publish (공개 기능)
**Goal:** 초대장 공개 및 공유 기능
**Requirements:** PUBL-01, PUBL-02

**Plans:**
- [ ] 06-publish-01-PLAN.md — 공개 초대장 라우트
- [ ] 06-publish-02-PLAN.md — 공유 기능 (URL, SNS)

---

## Requirements

### AUTH-01: 사용자 등록
- [x] Email/Password 인증
- [x] Google OAuth 인증
- [x] GitHub OAuth 인증

### AUTH-02: 사용자 세션 관리
- [ ] 자동 로그인 (refresh token)
- [ ] 세션 만료 처리
- [ ] 로그아웃 기능

### TEMP-01: 템플릿 조회
- [ ] 템플릿 목록 API
- [ ] 템플릿 상세 API

### TEMP-02: 템플릿 필터링
- [ ] 카테고리별 필터링
- [ ] 인기 템플릿 표시

### EDIT-01: 초대장 생성
- [ ] 템플릿 기반 초대장 제작
- [ ] 기본 정보 입력 (이름, 날짜, 장소)

### EDIT-02: 콘텐츠 편집
- [ ] 텍스트 수정
- [ ] 이미지 업로드
- [ ] 레이아웃 조정

### EDIT-03: 미리보기
- [ ] 실시간 미리보기
- [ ] 모바일/데스크톱 전환

### PAY-01: 결제 요청
- [ ] Toss Payments API 연동
- [ ] 결제 수단 선택

### PAY-02: 결제 완료 처리
- [ ] 웹훅 핸들러
- [ ] 유료 템플릿 활성화

### PUBL-01: 공개 초대장
- [ ] 고유 URL 생성
- [ ] 비공개/공개 설정

### PUBL-02: 공유 기능
- [ ] URL 복사
- [ ] SNS 공유
