# wiki/gsd-commands.md — GSD 명령어 참조

> 새 세션에서 일반적으로 로드하지 않음. `/gsd-*` 명령어 사용 시 필요시 grep 또는 read.

## 핵심 명령어 31개

| 명령어 | 용도 | wiki 연동 |
|--------|------|-----------|
| `/gsd [N]` | 상태 진단 → 다음 단계 실행 → wiki 업데이트 | wiki/status.md 자동 업데이트 |
| `/gsd-new-project` | 프로젝트 초기화 | PROJECT.md, ROADMAP.md 생성 |

| 명령어 | 용도 | wiki 연동 |
|--------|------|-----------|
| `/gsd-new-project` | 프로젝트 초기화 | PROJECT.md, ROADMAP.md 생성 |
| `/gsd-plan-phase N` | N번 페이즈 계획 | wiki/status.md 업데이트 |
| `/gsd-execute-phase N` | N번 페이즈 실행 | wiki/ 동기화 |
| `/gsd-verify` | 목표 검증 | wiki/decisions.md 업데이트 |
| `/gsd-progress` | 진행 상태 확인 | wiki/status.md 기반 |
| `/gsd-quick` | 소규모 작업 (계획 생략) | wiki/status.md 업데이트 |
| `/gsd-fast` | trivial 작업 (무계획) | wiki 미연동 |
| `/gsd-do` | 자연어 → GSD 명령어 라우팅 | wiki 기반 추천 |
| `/gsd-resume-work` | 이전 세션 재개 | wiki/status.md 기반 |
| `/gsd-pause-work` | 세션 중단 (handoff) | wiki/status.md 업데이트 |
| `/gsd-debug` | 시스템적 디버깅 | wiki/decisions.md에 기록 |
| `/gsd-add-todo` | 작업 아이템 캡처 | wiki/status.md에 반영 |
| `/gsd-check-todos` | pending todo 목록 | wiki/status.md 기반 |
| `/gsd-verify-work` | UAT 검증 | wiki/decisions.md에 기록 |
| `/gsd-ship` | PR 생성 | wiki/status.md 업데이트 |
| `/gsd-review` | Cross-AI 리뷰 | wiki/decisions.md에 기록 |
| `/gsd-settings` | GSD 설정 | .planning/config.json |
| `/gsd-update` | GSD 버전 업데이트 | — |
| `/gsd-cleanup` | 완료된 페이즈 정리 | wiki/status.md 업데이트 |
| `/gsd-new-milestone` | 새 마일스톤 시작 | wiki/index.md 업데이트 |
| `/gsd-complete-milestone` | 마일스톤 완료 | wiki/index.md 업데이트 |
| `/gsd-audit-uat` | UAT 크로스 페이즈 감사 | wiki/decisions.md에 기록 |
| `/gsd-add-phase` | 새 페이즈 추가 | wiki/status.md 업데이트 |
| `/gsd-insert-phase` | 중간 페이즈 삽입 | wiki/status.md 업데이트 |
| `/gsd-remove-phase` | 페이즈 제거 | wiki/status.md 업데이트 |
| `/gsd-note` | 메모 캡처 | wiki/log.md에 기록 |
| `/gsd-stats` | 프로젝트 통계 | — |
| `/gsd-health` | planning 디렉토리 진단 | — |
| `/gsd-next` | 다음 논리적 단계 자동 진행 | — |
| `/gsd-autonomous` | discuss→plan→execute 자동화 | — |
| `/gsd-workstreams` | 병렬 workstreams 관리 | — |

## GSD 실행 시 wiki 연동 규칙

```
/gsd-plan-phase     → PLAN.md 생성 + wiki/status.md 업데이트
/gsd-execute-phase  → PLAN.md 기반 실행 + wiki/ 동기화
/gsd-verify         → 검증 + wiki/decisions.md 업데이트
/gsd-quick          → wiki/status.md 업데이트
/gsd-debug          → wiki/decisions.md에 결정사항 기록
/gsd-add-todo       → wiki/status.md에 반영
```

## GSD와 wiki의 관계

- **GSD** = "실행 엔진" — 계획, 실행, 검증의 구조화
- **wiki** = "지식베이스" — 축적된 지식의 지속성
- GSD가 생성하는 PLAN/SUMMARY는 wiki에 병기되고, 오래된 PLAN/SUMMARY는 wiki에 정보가 병합된 후 삭제됨

## GSD 자동 발동 조건

| 조건 | 동작 |
|------|------|
| `/gsd-*` 명령어 입력 | GSD 실행 |
| "다음 페이즈", "계획 세워줘" | wiki/status.md 확인 → 다음 작업 제안 |
| wiki/status.md에 "다음 작업" + "시작" | GSD 실행 자동 제안 |
| 새 세션 시작 | wiki/index.md + wiki/status.md 자동 로드 |

> GSD는 강제 실행이 아니라, wiki 기반 추천 → 선택 실행으로 설계됨.
