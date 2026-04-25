---
phase: 10-naver-selling
plan: 08
type: execute
status: complete
completed: "2026-04-25"
tasks: 2
commits:
  - 9c59e7f (wave-level commit)
---

# Plan 10-08: Naver 결제 연동

## 개요

Naver Selling Page redirect 방식 결제 시스템 연동

## 구현 내용

### Naver 라이브러리 (`src/lib/payment/naver.ts`)
- `redirectToNaverSellingPage(order, returnUrl)`: 네이버 판매 페이지로 redirect
- `getNaverSellingPageUrl(order, returnUrl)`: URL 생성
- `parsePurchaseStatus(searchParams)`: 구매 상태 파싱

### 변경 사항
- Toss Easy Checkout → Naver redirect 방식으로 변경
- 구매 버튼 클릭 시 네이버 판매 페이지로 이동
- returnUrl 파라미터로 구매 완료 후 복귀 URL 전달

## Wave 1 Batch Execution

Wave 1의 모든 plan이 단일 커밋(9c59e7f)으로 배치 실행됨