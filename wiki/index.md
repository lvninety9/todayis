# wiki/index.md — 전역 인덱스

## 구조

| 파일 | 용도 | 로드 순서 |
|------|------|-----------|
| [codebase.md](codebase.md) | 코드 구조 | 1번 |
| [status.md](status.md) | 진행 상태 | 2번 |
| [next-session.md](next-session.md) | 다음 세션 프롬프트 | 2.5번 |
| [decisions.md](decisions.md) | 결정사항 | 3번 |
| [log.md](log.md) | 시간순 기록 | 4번 (필요시) |
| [status-checkpoints.md](status-checkpoints.md) | 체크포인트 | 5번 (grep) |
| [CONTEXT-OPTIMIZATION-LOG.md](CONTEXT-OPTIMIZATION-LOG.md) | 최적화 기록 | 6번 |

## 사용법

- 새 세션: `index.md` → `codebase.md` → `status.md` → `next-session.md` (~80줄)
- `.planning/` 전체 읽지 않음 — `status.md`가 최신 상태
- 코드 변경 후: `status.md` 한 줄 업데이트
- 결정사항: `decisions.md` 한 줄 기록
- 시스템 원칙: `AGENTS.md`
- GSD 명령어: `gsd-commands.md` (grep "^|" wiki/gsd-commands.md | head -30)
- 시간순 기록: `log.md` (grep "^## \[" wiki/log.md | tail -5)
- 체크포인트: `status-checkpoints.md` (grep "^## Phase" wiki/status-checkpoints.md)

## 토큰 효율

| 항목 | 줄 수 | 토큰 |
|------|-------|-------|
| wiki/ 전체 (9파일) | ~160줄 | ~650 |
| .planning/ 전체 | ~2,300줄 | ~1,000 (미로드) |
| AGENTS.md | 60줄 | ~300 |
| 새 세션 합계 (index+codebase+status+next-session+AGENTS) | — | ~1,500 (2.3%) |

## AGENTS.md vs CLAUDE.md

**결정: `AGENTS.md` 유지** — opencode는 Codex 기반이므로 AGENTS.md 사용. Claude Code 병행 시 CLAUDE.md는 Karpathy 4원칙만 포함.

---
*최신 업데이트: 2026-05-09 (Phase 26 완료, wiki 동기화)*
