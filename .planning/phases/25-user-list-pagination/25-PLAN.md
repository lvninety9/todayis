# Phase 25: 회원 목록 페이지네이션

**Goal**: Admin 페이지의 회원 목록에 페이지네이션 구현 (이전/다음 버튼, 페이지 표시)

**Depends on**: Phase 1~24

**Requirements**:
- USER-PAG-01: `/api/admin/users` GET — `page`/`limit` 쿼리파라미터 지원
- USER-PAG-02: admin 페이지에서 `page` state 연동
- USER-PAG-03: 페이지네이션 UI (이전/다음 버튼, 페이지 번호 표시)

**Success Criteria** (what must be TRUE):
1. `/api/admin/users?page=1&limit=10` — 10명만 반환, `total` 포함
2. admin 페이지에서 페이지네이션 UI 표시 (이전/다음 버튼)
3. 마지막 페이지에서 "다음" 버튼 비활성화, 첫 페이지에서 "이전" 버튼 비활성화

**Plan**:
- Wave 1: API 수정 (`/api/admin/users` — page/limit 쿼리파라미터 지원)
- Wave 2: admin 페이지 — user fetch에 page 연동 + 페이지네이션 UI 추가
