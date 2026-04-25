---
phase: 10-naver-selling
plan: 10
type: execute
status: complete
completed: "2026-04-25"
tasks: 5
commits:
  - 9c59e7f (wave-level commit)
---

# Plan 10-10: 신규 페이지

## 개요

5개 신규 페이지 생성

## 구현 내용

### 1. Landing Page (`src/app/(main)/landing/page.tsx`)
- 메인 랜딩 페이지
- modern gradient + glassmorphism

### 2. Pricing Page (`src/app/(main)/pricing/page.tsx`)
- 3-tier 가격표
- 유료/무료 템플릿 구분

### 3. Order Guide Page (`src/app/(main)/order-guide/page.tsx`)
- 제작 안내 페이지
- 제작流程 설명

### 4. Template Detail Page (`src/app/(main)/templates/detail/[id]/page.tsx`)
- 템플릿 소개 페이지 (별도 URL)
- 구매 안내 포함

### 5. Member Page (`src/app/(main)/member/page.tsx`)
- 회원 관리 페이지 (admin만 접근)
- 비관리자 접근 시 /dashboard로 리다이렉트
- NOTE: "준비 중" 메시지만 표시, 실제 관리功能 미구현

## Wave 1 Batch Execution

Wave 1의 모든 plan이 단일 커밋(9c59e7f)으로 배치 실행됨