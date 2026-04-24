# Phase 10: 네이버 판매 페이지 연동 - Plan

## Goal

Toss Payments에서 Naver Selling Page로 결제 시스템 변경 + 신규 웹사이트 페이지들 추가

## Requirements

### NP-01: Naver Selling Page API 연동
- Naver Selling Page_redirect 연동 구현
- 기존 Toss Payments 코드는 유지하되 결제 수단으로 네이버 우선

### NP-02: 템플릿 상세 페이지 구매 버튼
- /templates/[id] 페이지의 "구매하기" 버튼 → 네이버 판매 페이지로 redirect

### NP-03: 신규 페이지 추가
- /landing — 랜딩 페이지 (메인)
- /templates/detail/[id] — 상세 페이지 (템플릿 소개)
- /member — 회원관리 페이지
- /order-guide — 주문제작 안내 페이지
- /pricing — 가격 안내 페이지

## Tasks

### Task 1: Naver Selling Page 연동
- [ ] src/lib/payment/naver.ts — NaverPaymentClient 생성
- [ ] src/app/(main)/templates/[id]/page.tsx — 구매 버튼을 네이버로 redirect하도록 수정

### Task 2: 신규 페이지 생성
- [ ] src/app/(main)/landing/page.tsx — 랜딩 페이지
- [ ] src/app/(main)/templates/detail/[id]/page.tsx — 상세 페이지
- [ ] src/app/(main)/member/page.tsx — 회원관리 페이지
- [ ] src/app/(main)/order-guide/page.tsx — 주문제작 안내 페이지
- [ ] src/app/(main)/pricing/page.tsx — 가격 안내 페이지

### Task 3: 라우팅 및 네비게이션 업데이트
- [ ] 기존 네비게이션 바 업데이트 (필요시)
- [ ] 각 페이지 링크 연결

## Deliverables

1. 결제 시스템 네이버 연동
2. 5개 신규 페이지
3. 구매 버튼 동작 변경

## Status

Planned: 2026-04-25