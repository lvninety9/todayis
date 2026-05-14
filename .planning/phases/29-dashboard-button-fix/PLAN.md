# Phase 29: 대시보드 최근 템플릿 버튼 비클릭 문제 수정

## Goal
대시보드 하단 최근 템플릿 목록에서 "편집", "공유", "발행" 버튼 클릭 불가능 문제 해결

## Root Cause
- `GlassCard` 컴포넌트 (`card.tsx:92`) — `before:absolute before:inset-0` pseudo-element가 카드 전체를 덮음
- `hover:before:opacity-100` — hover 시 pseudo-element가 투명도 100%가 되어 버튼 위에 오버레이 생성
- 버튼은 pseudo-element 위에 위치하지만 pointer-events가 차단되어 클릭 불가

## Plan

### Wave 1: `card.tsx` — GlassCard pseudo-element pointer-events 차단 제거
- GlassCard의 `before:` 클래스에 `before:pointer-events-none` 추가
- pseudo-element가 시각 효과만 담당하도록 하여 버튼 클릭 차단 제거

### Wave 2: `dashboard/page.tsx` — 버튼 영역 z-index/pointer-events 명시
- 버튼 컨테이너(`flex items-center gap-2 ml-4`)에 `relative z-10` 추가
- 각 Button에 `pointer-events-auto` 명시 추가 (GlassCard hover와 충돌 방지)

### Wave 3: 검증
- `npm run build` && `npm run lint` 통과 확인

## Files to Modify
- `src/components/ui/card.tsx` (GlassCard)
- `src/app/(main)/dashboard/page.tsx` (최근 템플릿 버튼)
