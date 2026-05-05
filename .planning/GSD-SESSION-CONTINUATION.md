# GSD 워크플로우 최적화 — 세션 인수인계

> **작성일**: 2026-05-01
> **대상**: `/home/jay/.config/opencode/get-shit-done/` GSD 워크플로우 파일 최적화

---

## 1. 작업 목적

이 작업은 `todayis` 프로젝트 개발이 **아닙니다**.
GSD 워크플로우 파일 자체를 로컬 모델(Qwen 3.6-35B, 65K 컨텍스트) 환경에 맞게 최적화하는 작업입니다.

---

## 2. 환경

```
모델:        Qwen3.6-35B-A3B-UD-Q3_K_M.gguf
컨텍스트:    ~65,000 tokens
IDE:         OpenCode (CLI TUI)
GSD 경로:    /home/jay/.config/opencode/get-shit-done/
GSD 스킬:    /home/jay/.opencode/skills/
todayis:     /media/jay/D/cursor/todayis (테스트베드, 수정 대상 아님)
```

---

## 3. 현재 상태

| 단계 | 작업 | 상태 |
|------|------|------|
| 1 | `context_window: 65000` 설정 | ✅ 완료 |
| 2 | 체크포인트 템플릿 생성 | ✅ 완료 |
| 3 | 정밀 편집 템플릿 생성 | ✅ 완료 |
| 4 | OpenCode executor 스킬 생성 | ✅ 완료 |
| 5 | `execute-phase.md` slim화 | ✅ 완료 (1603→1177줄, -26.6%) |
| 6 | `scripts/slim-prompt.sh` 생성 | ✅ 완료 |
| 7 | 체크포인트 시스템 검증 | ✅ 완료 (PASS) |
| 8 | `plan-phase.md` slim화 (Wave 1) | ✅ 완료 (1606→745줄, -54%) |
| 9 | `autonomous.md` slim화 (Wave 2) | ✅ 완료 (789→364줄, -54%) |

---

## 4. 검증 결과 요약 (단계 7)

- **slim-prompt.sh**: 65K → slim ACTIVE, 500K → slim INACTIVE (임계값 200K 정상)
- **executor/planner slim prompt**: on-demand 참조 정상 동작
- **execute-phase.md**: slim화 후 체크포인트 로직 35개 참조 모두 intact
- **checkpoint.md 템플릿**: YAML frontmatter + 5개 섹션 완성
- **gsd-oc-executor SKILL.md**: Wave 체크포인트 규칙 문서화 완료

→ 상세: `.planning/VERIFICATION-STEP7-CHECKPOINT.md`

---

## 5. 주요 파일 구조

```
/home/jay/.config/opencode/get-shit-done/
├── workflows/
│   ├── autonomous.md           ← 364줄 (Wave 2 slim화 완료)
│   ├── execute-phase.md        ← 1177줄 (slim화 완료)
│   ├── execute-plan.md
│   └── plan-phase.md           ← 745줄 (Wave 1 slim화 완료)
├── references/
│   ├── executor-examples.md    ← slim on-demand 참조
│   ├── planner-antipatterns.md ← slim on-demand 참조
│   ├── context-budget.md
│   └── gates.md
├── scripts/
│   └── slim-prompt.sh          ← slim/full 분기 스크립트
└── skills/
    └── gsd-oc-executor/
        ├── SKILL.md
        └── templates/
            ├── checkpoint.md
            └── plan-task.md
```

---

## 6. 다음 작업

### 옵션 A: Phase 17-04 실제 체크포인트 검증 (권장)

Phase 17-04 ("모바일 Section 구조 재설계")를 Wave 단위로 분할 실행하여 체크포인트 시스템 실제 검증.

**절차**:
1. `/gsd-plan-phase` — Phase 17-04 PLAN.md 생성
2. `/gsd-execute-phase` — Wave 단위 실행 + 체크포인트 생성
3. 새 세션에서 CHECKPOINT 기반 이어서 작업 테스트

**참고**:
- Phase 디렉토리: `.planning/phases/17-템플릿-시스템-전면-개편/`
- 17-01~17-03 완료, 17-04 pending
- CONTEXT.md: `.planning/phases/17-템플릿-시스템-전면-개편/17-CONTEXT.md`

### 옵션 B: 추가 최적화 (Wave 3+)

- `execute-phase.md` slim화 (1177줄 → 목표 설정 필요)
- `discuss-phase.md` slim화 검토
- `execute-plan.md` slim화 (494줄, 미변경)
- `planner-antipatterns.md` slim화

### 옵션 C: 문서화 완료

모든 최적화 작업 완료. 추가 작업 없음.

---

## 7. 빠른 명령어 참조

```bash
# slim 상태 확인
CONTEXT_WINDOW=65000 /home/jay/.config/opencode/get-shit-done/scripts/slim-prompt.sh check

# executor slim prompt 출력
CONTEXT_WINDOW=65000 /home/jay/.config/opencode/get-shit-done/scripts/slim-prompt.sh executor

# planner slim prompt 출력
CONTEXT_WINDOW=65000 /home/jay/.config/opencode/get-shit-done/scripts/slim-prompt.sh planner

# full prompt 출력 (대용량 컨텍스트)
CONTEXT_WINDOW=500000 /home/jay/.config/opencode/get-shit-done/scripts/slim-prompt.sh executor
```

---

## 8. GSD 명령어 매핑 (OpenCode용)

| GSD 명령어 | OpenCode 실행 방법 |
|------------|-------------------|
| `/gsd-plan-phase` | `Task(description="plan-phase", prompt="/gsd-plan-phase", subagent_type="gsd-planner")` |
| `/gsd-execute-phase` | `Task(description="execute-phase", prompt="/gsd-execute-phase", subagent_type="gsd-executor")` |
| `/gsd-verify` | `Task(description="verify", prompt="/gsd-verify", subagent_type="gsd-verifier")` |
| `/gsd-discuss-phase` | `Task(description="discuss-phase", prompt="/gsd-discuss-phase", subagent_type="gsd-discuss-phase")` |

---

## 9. 참고 문서

- 전체 가이드: `.planning/GSD-LOCAL-OPTIMIZATION.md`
- 세션 인수인계 (이 문서): `.planning/SESSION-CONTINUATION-GSD-OPTIMIZATION.md`
- 단계 7 검증: `.planning/VERIFICATION-STEP7-CHECKPOINT.md`

---

*최종 업데이트: 2026-05-01*
