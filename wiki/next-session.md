# wiki/next-session.md — 다음 세션 표준 프롬프트

> 이 파일은 새 세션 시작 시 가장 먼저 읽습니다.
> /gsd 실행 후 이 파일만 업데이트하면 됩니다.

## 현재 세션에서 다음 세션으로

Phase 1~26 완료. Vercel 배포 후 5개 critical bug 발견.
Phase 27 실행 중 — Wave 1~4 완료 (모든 bug 수정), 2차 검증 완료, build/lint 통과.

**다음 세션에서 진행할 작업:**
1. `vercel deploy --prod` — Vercel 재배포 (build/lint 이미 통과, 2차 검증 완료)
2. 배포 후 모바일 테스트 (실제 초대장 공유 링크 접근 확인)
3. Phase 27 완료 확인 → 다음 마일스톤 논의

**Wave 1~4 완료 내용:**
- Wave 1: `middleware.ts` cookie 표준화, `getSession()` → `getUser()` 변경
- Wave 2: Dashboard 버튼 e.preventDefault 제거, 공유/발행 버튼 onClick 핸들러 추가
- Wave 3: `getPreviewData`가 sections 기반 템플릿의 `sections[].fields[].defaultValue` 읽도록 수정
- Wave 4: ShareDialog `shareUrl` prop으로 decouple, 템플릿 카드(그리드+리스트)에 공유 버튼 추가, 편집 페이지에 공유 버튼 추가, `/api/invitations` POST로 초대장 생성 → ShareDialog로 복사

**2차 검증 결과 (현재 세션):**
- `ShareDialog.tsx` — `shareUrl` prop으로 decouple 완료
- `templates/page.tsx` — share state, handler, ShareDialog 연동, onShare prop 전달 완료
- `TemplateLibrary.tsx` — onShare prop interface + 컴포넌트 전달 완료
- `TemplateCard.tsx` — grid + list 레이아웃 모두 공유 버튼 추가 완료
- `templates/[id]/edit/page.tsx` — share state, handler, ShareDialog, header 공유 버튼 완료
- build/lint — 새 오류 없음 (30개 페이지 정적/동적 생성)

**참고 파일:**
- `.planning/phases/27-bug-fixes/PLAN.md` — 상세 계획 (5개 bug + 실행 순서)
- `wiki/decisions.md` — gray areas 의사결정 사항

---
*최신 업데이트: 2026-05-10 (Phase 27 Wave 4 완료 — build/lint 통과, 2차 검증 완료, Vercel 재배포 대기)*
