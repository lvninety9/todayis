# Phase 10: 네이버 판매 페이지 연동 + 버그 수정 + UI 개선 - Plan

## Goal

 Toss Payments에서 Naver Selling Page로 결제 시스템 변경 + 신규 웹사이트 페이지들 추가 + 버그 수정 + UI 개선 + 편집기 재설계

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

### BUG-01: next/image hostname 에러
- next.config.js에 images.pexels.com hostname 추가

### BUG-02: 뒤로가기 버튼 에러
- 템플릿 페이지 뒤로가기 버튼 클릭 시 에러 해결

### UI-01: 로그인 페이지 가독성
- "또는 소셜 계정으로 로그인" 텍스트 배경 수정 (투명 또는 어두운 배경)

### UI-02: 버튼 스타일 현대화
- 취소, 삭제, 저장하기, 데스크탑, 모바일, 편집 모드 버튼 스타일 개선
- shadcn/ui Button 컴포넌트 기반으로 모던 디자인 적용

### EDITOR-01: 편집기 유연성 개선
- 섹션별 위치 이동 (드래그 앤 드롭)
- 음악, 애니메이션 효과, 폰트 각 섹션별로 설정 가능

### EDITOR-02: 편집기 UX 개선
- 실시간 미리보기 강화
- 도구 모음 단순화
- 모바일/데스크톱 프리뷰 통합

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

### Task 4: 버그 수정
- [ ] next.config.js — images.pexels.com hostname 추가
- [ ] 템플릿 페이지 뒤로가기 버튼 에러 수정

### Task 5: UI 개선
- [ ] src/app/(auth)/login/page.tsx — "또는 소셜 계정으로 로그인" 배경 수정
- [ ] 버튼 컴포넌트 스타일 현대화 (취소, 삭제, 저장하기, 데스크탑, 모바일, 편집 모드)

### Task 6: 편집기 재설계
- [ ] src/components/templates/editor/ — 드래그 앤 드롭 기능 추가
- [ ] 섹션별 음악/애니메이션/폰트 설정 UI 추가
- [ ] 실시간 미리보기 강화
- [ ] 도구 모음 단순화

## Deliverables

1. 결제 시스템 네이버 연동
2. 5개 신규 페이지
3. 구매 버튼 동작 변경
4. 버그 수정 (next/image, 뒤로가기)
5. UI 개선 (로그인 페이지, 버튼 스타일)
6. 편집기 재설계

## Status

Planned: 2026-04-25
Updated: 2026-04-25 (버그 수정, UI 개선, 편집기 재설계 추가)