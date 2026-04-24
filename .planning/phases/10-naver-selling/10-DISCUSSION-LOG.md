# Phase 10: 네이버 판매 페이지 연동 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-25
**Phase:** 10-naver-selling
**Areas discussed:** 결제 연동 방식, 구매하기 버튼 동작, 신규 페이지 구조, 구매 완료 복귀 처리

---

## 결제 연동 방식

| Option | Description | Selected |
|--------|-------------|----------|
| Naver Selling Page API (redirect) | 구매 시 네이버 판매 페이지로 redirect | ✓ |
| Naver API (popup) | popup으로 네이버 결제창 표시 | |
| 기존 Toss + Naver 병행 | Toss는 유지, Naver 우선 | |

**User's choice:** [auto] Naver Selling Page API (redirect) — recommended default

---

## 구매하기 버튼 동작

| Option | Description | Selected |
|--------|-------------|----------|
| 새 탭에서 열기 | 타겟_blank로 네이버 페이지 열기 | |
| 현재 탭 이동 | 현재 페이지에서 redirect | ✓ |
| popup 창 | popup으로 결제창 표시 | |

**User's choice:** [auto] 현재 탭 이동 — recommended default

---

## 신규 페이지 구조

| Option | Description | Selected |
|--------|-------------|----------|
| (main) 그룹下路由 | /landing, /templates/detail, /member, /order-guide, /pricing 추가 | ✓ |
| 독립적 라우트 그룹 | 각 페이지별 독립적 그룹 | |
| 하위 경로 | /main/landing, /main/templates/detail 등 | |

**User's choice:** [auto] (main) 그룹下路由 — recommended default

---

## 구매 완료 복귀 처리

| Option | Description | Selected |
|--------|-------------|----------|
| callback URL | 구매 완료 후 지정된 URL로 이동 | ✓ |
| polling 방식 | 주기적으로 구매 상태 확인 | |
| webhook 연동 | webhook으로 구매 결과 수신 | |

**User's choice:** [auto] callback URL — recommended default

---

## Claude's Discretion

- 디자인 시스템 세부 구현 — shadcn/ui + Tailwind CSS로 표준 적용
- 각 페이지의 구체적인 컨텐츠 — planner에서 결정