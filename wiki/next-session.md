# wiki/next-session.md — 다음 세션 표준 프롬프트

> 이 파일은 새 세션 시작 시 가장 먼저 읽습니다.
> /gsd 실행 후 이 파일만 업데이트하면 됩니다.

## 현재 세션에서 다음 세션으로

Phase 1~29 완료. 29개 페이즈 — 템플릿 엔진, 인증, 템플릿 관리, 초대장 공개, 테스트, UI 리디자인, 폰트, 필드 확장, 템플릿 시스템 개편, Video/Audio/Dress Code 정의 및 적용, 배경음악, 결제 시스템, 프리미엄 템플릿, Video Enhancement & Animation Preview, 회원 목록 페이지네이션, 맞춤 웨딩 초대장, Critical Bug Fixes & Sharing Feature, 로그인 리다이렉트 버그 수정, 대시보드 버튼 비클릭 문제 수정.

**다음 세션에서 진행할 작업:**

### 우선순위 1: Vercel 배포
1. `vercel deploy --prod` — Vercel 배포 (build/lint 통과, 99+ commits 모두 반영)
2. 배포 후 모바일 테스트 (실제 초대장 공유 링크 접근 확인)
3. 다음 마일스톤 논의 (V2/V3 기능 — Kakao 로그인, AI 추천 템플릿, 동영상 초대장 등)

**Phase 28 완료 내용 (Bug 7):**
- `use-session.ts` — Session 인터페이스에 `hasCheckedSession: boolean` 필드 추가
- 초기화 시 `hasCheckedSession: false`, 세션 로드 완료 시 `true`로 변경
- `edit/page.tsx:137` — 리다이렉트 조건을 `session.hasCheckedSession && !session.user`로 변경
- 로딩 스피너에 `session.error` 메시지 표시 추가
- build/lint 통과 (새 오류 없음)

**참고 파일:**
- `.planning/phases/28-login-redirect-fix/PLAN.md` — 상세 계획
- `wiki/decisions.md` — Bug 7 의사결정 사항

---
*최신 업데이트: 2026-05-15 (Phase 29 완료 — Bug 6 대시보드 버튼 비클릭 문제 수정, GlassCard ::before에 pointer-events-none 추가, build/lint 통과. 다음 세션: Vercel 배포 → V2/V3 마일스톤 논의)*
