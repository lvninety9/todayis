# wiki/next-session.md — 다음 세션 표준 프롬프트

> 이 파일은 새 세션 시작 시 가장 먼저 읽습니다.
> /gsd 실행 후 이 파일만 업데이트하면 됩니다.

## 현재 세션에서 다음 세션으로

Phase 1~31 완료. 31개 페이즈 — 템플릿 엔진, 인증, 템플릿 관리, 초대장 공개, 테스트, UI 리디자인, 폰트, 필드 확장, 템플릿 시스템 개편, Video/Audio/Dress Code 정의 및 적용, 배경음악, 결제 시스템, 프리미엄 템플릿, Video Enhancement & Animation Preview, 회원 목록 페이지네이션, 맞춤 웨딩 초대장, Critical Bug Fixes & Sharing Feature, 로그인 리다이렉트 버그 수정(Phase 28), 대시보드 버튼 비클릭 문제 수정(Phase 29), 템플릿 편집 페이지 로그인 리다이렉트 버그 수정(Phase 30), Sample 템플릿 PATCH/DELETE/공유 404 수정(Phase 31).

**다음 세션에서 진행할 작업:**

### 우선순위 1: /gsd progress → 신규 기능 논의 (V2/V3)
1. `/gsd progress` — 현재 상태 진단, 다음 작업 결정
2. 신규 기능 논의 — Kakao 로그인, AI 추천 템플릿, 동영상 초대장 등
3. 필요시 백로그 항목 우선순위 결정

**Bug 8 해결 내용 (Phase 31):**
- sample.ts 템플릿 6개(ROMANTIC/CLASSIC/MODERN/PREMIUM_ROMANTIC/PREMIUM_CLASSIC/JANG_DING) PATCH/DELETE/공유 시 404 문제 해결
- PATCH/DELETE: DB에 없으면 sample.ts에서 조회 → DB upsert 후 작업 진행
- POST /api/invitations: DB에 없으면 sample.ts에서 조회 → DB upsert 후 초대장 생성
- 수정 파일 3개: `src/types/template.ts`, `src/app/api/templates/[id]/route.ts`, `src/app/api/invitations/route.ts`

---
*최신 업데이트: 2026-05-18 (Phase 1~31 전체 완료, Bug 8 해결 완료. 다음 세션: /gsd progress → 신규 기능 논의)*
