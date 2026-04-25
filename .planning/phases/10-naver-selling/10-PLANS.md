# Phase 10: UI/UX 전면 개편 + 네이버 연동

## Plans Summary

| Plan | Description | Wave | Status |
|------|------------|------|--------|
| 10-01 | UI 컴포넌트 현대화 (Button, Card, Input) | 1 | Ready |
| 10-02 | 로그인/회원가입 페이지 Glassmorphism | 1 | Ready |
| 10-03 | 대시보드 페이지 카드 그리드 + 통계 | 1 | Ready |
| 10-04 | 템플릿 라이브러리 modern design | 1 | Ready |
| 10-05 | 템플릿 상세 페이지 + 구매버튼 | 1 | Ready |
| 10-06 | 편집기 재설계 (드래그 앤 드롭) | 1 | Ready |
| 10-07 | 공개 초대장 wedding romantic | 1 | Ready |
| 10-08 | Naver Selling Page 연동 | 1 | Ready |
| 10-09 | 네비게이션 glassmorphism | 1 | Ready |
| 10-10 | 신규 페이지 5개 + 버그 수정 | 2 | Ready |
| 10-11 | 신규 의존성 설치 | 1 | Ready |

## Dependency Graph

```
10-11 (dependencies)
   ↓
10-01 (UI components) ──┬──→ 10-02 (login/signup)
   │                    ├──→ 10-03 (dashboard)
   │                    ├──→ 10-04 (templates)
   │                    ├──→ 10-05 (detail)
   │                    ├──→ 10-06 (editor)
   │                    ├──→ 10-07 (public)
   │                    └──→ 10-09 (nav)
   │
   └─────────────────→ 10-08 (Naver)
   │
10-10 (new pages + bug fix) ← depends on 10-01, 10-02, 10-03
```

## Requirements

- NP-01: Naver Selling Page API 연동
- NP-02: 템플릿 상세 페이지 구매 버튼 → 네이버 redirect
- NP-03: 랜딩 페이지
- NP-04: 상세 페이지 (템플릿 소개)
- NP-05: 회원관리 페이지
- NP-06: 주문제작 안내 페이지
- NP-07: 가격 안내 페이지
- UI-01 ~ UI-05: UI 현대화
- EDITOR-01, EDITOR-02: 편집기 재설계

## Execution Order

**Wave 1 (parallel ready):**
1. 10-11 - Install dependencies
2. 10-01 - UI components
3. 10-02 - Login/Signup
4. 10-03 - Dashboard
5. 10-04 - Template Library
6. 10-05 - Template Detail
7. 10-06 - Editor
8. 10-07 - Public Invitation
9. 10-08 - Naver Integration
10. 10-09 - Navigation

**Wave 2 (depends on Wave 1):**
11. 10-10 - New pages + bug fix

---

*Created: 2026-04-25*
*Status: Ready for execution*