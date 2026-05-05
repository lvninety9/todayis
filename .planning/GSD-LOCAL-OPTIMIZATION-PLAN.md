# GSD 로컬 최적화 — 목적, 의도, 검증 계획

> **작성일**: 2026-05-03
> **모델**: Qwen3.6-35B-A3B | **컨텍스트 한계**: 65,000토큰

---

## 1. 문제 정의

### 1.1 근본 문제

로컬 Qwen 3.6-35B 모델은 65,000토큰 컨텍스트 한계가 있다. `/gsd` 명령어 실행 시:

1. GSD 워크플로우 파일들 (`plan-phase.md`, `execute-phase.md` 등)이 컨텍스트 전체를 차지
2. CHECKPOINT, SESSION-INTEGRITY-REVIEW 등 보조 문서들이 추가 토큰 소모
3. **65,000토큰 한계 초과 → 세션 시작 전 자동으로 컨텍스트 압축 발생**
4. 압축된 컨텍스트로 실행된 `/gsd` 명령어는 품질 저하

### 1.2 증상

- `/gsd` 입력 직후 세션 시작 전 컨텍스트 압축 로그 확인
- 압축 후의 컨텍스트로 실행된 워크플로우가 불완전하거나 생략된 단계 포함
- 새 세션에서 이어서 할 때 이전 컨텍스트 손실

---

## 2. 목표

### 2.1 최종 목표

**65,000토큰 한계 내에서 컨텍스트 압축 없이 `/gsd` 명령어가 원래 품질로 실행되도록 최적화**

### 2.2 성공 기준

| 기준 | 현재 | 목표 |
|------|------|------|
| GSD workflow 파일 총 토큰 | 미측정 | < 30,000토큰 |
| CHECKPOINT + 보조 문서 토큰 | 미측정 | < 10,000토큰 |
| `/gsd` 실행 시 컨텍스트 압축 | 발생 | 발생 안 함 |
| `/gsd` 실행 품질 | 저하됨 | slim화 전과 동등 |

### 2.3 제약 조건

- slim화 전 GSD 핵심 로직 유지 (에이전트 스포닝, 체크포인트, 폴백 등)
- cross-AI 호환성 유지 (Claude Code 전용 코드 제거만)
- 빌드/린트 통과 유지

---

## 3. 지금까지 한 일 (Wave 1~5 slim화)

| Wave | 파일 | 줄 수 변경 | 감소율 |
|------|------|-----------|--------|
| 1 | plan-phase.md | 1,606 → 745 | -54% |
| 2 | autonomous.md | 789 → 364 | -54% |
| 3 | execute-phase.md | 1,177 → 332 | -72% |
| 4 | transition.md | 693 → 453 | -35% |
| 5 | verify-phase.md | 542 → 266 | -51% |
| - | discuss-phase.md | 328 (이미 slim) | - |
| **합계** | **6개 파일** | **3,625 → 2,488** | **-31%** |

## 4. Wave 6~8 — 보조 문서 정리 (2026-05-03 완료)

| 작업 | 변경 | 감소율 |
|------|------|--------|
| CHECKPOINT-1~5.md → CHECKPOINT.md 통합 | 270 → 63줄 | -77% |
| SESSION-INTEGRITY-REVIEW.md 제거 | 138줄 제거 | -100% |
| GSD-LOCAL-OPTIMIZATION.md 제거 | 30줄 제거 | -100% |
| next-session-prompt.md 제거 | 76줄 제거 | -100% |
| CONTINUATION-PROMPT.md 제거 | 오래된 파일 | -100% |
| SESSION-CONTINUATION.md 제거 | 오래된 파일 | -100% |
| SESSION-CONTINUATION-GSD-OPTIMIZATION.md 제거 | 오래된 파일 | -100% |
| **계획 문서 총합** | **55KB → 40KB** | **-27%** |

## 5. 최종 토큰 사용량

| 항목 | 크기 | 토큰 추정 | 비율 |
|------|------|-----------|------|
| 6개 workflow 파일 | 102KB | ~25,500 | 39% |
| 계획 문서들 | 40KB | ~10,000 | 15% |
| **합계** | **~143KB** | **~35,500** | **55%** |

**65,000토큰 한계 대비 45% 여유 확보** (slim화 전: ~61% 사용 → 39% 여유)

### slim화 방법

- verbose bash 예제 → single-line descriptions
- repetitive step-by-step → inline notes
- tables → compressed lists
- Claude Code/Copilot 전용 코드 제거
- cross-AI 기능 유지 (gsd-sdk 기반)

---

## 4. 아직 안 한 일 — 검증

### 4.1 토큰 측정 (가장 중요)

```bash
# workflow 파일들 토큰 측정
tiktoken estimate --model cl100k_base workflows/*.md

# CHECKPOINT + 보조 문서 토큰 측정
tiktoken estimate --model cl100k_base .planning/CHECKPOINT-*.md .planning/SESSION-INTEGRITY-REVIEW.md
```

**필요한 데이터:**
- slim화 전/후 토큰 수 비교
- 전체 GSD 컨텍스트 (workflows + CHECKPOINT + 보조 문서) 토큰 총합
- 65,000토큰 대비 여유분

### 4.2 실제 `/gsd` 명령어 테스트

```bash
# 테스트 1: 기본 /gsd 실행 — 컨텍스트 압축 여부 확인
/gsd

# 테스트 2: /gsd-discuss-phase 실행 — 컨텍스트 압축 여부 확인
/gsd-discuss-phase

# 테스트 3: /gsd-plan-phase 실행 — 컨텍스트 압축 여부 확인
/gsd-plan-phase
```

**확인 사항:**
- 세션 시작 시 컨텍스트 압축 로그 발생 여부
- 실행된 워크플로우의 단계 생략 여부
- 에이전트 스포닝 정상 동작 여부

### 4.3 보조 문서 정리

CHECKPOINT-1~5.md, SESSION-INTEGRITY-REVIEW.md, GSD-LOCAL-OPTIMIZATION.md 등이 컨텍스트를 차지한다.

**옵션:**
- CHECKPOINT 파일들을 단일 파일로 통합
- SESSION-INTEGRITY-REVIEW.md slim화
- 불필요한 파일 정리 (CONTINUATION-PROMPT.md 등 오래된 파일)

---

## 5. 검증 계획

### Phase 1: 토큰 측정

1. `tiktoken` 또는 `tokenizers`로 workflow 파일들 토큰 측정
2. CHECKPOINT + 보조 문서 토큰 측정
3. slim화 전/후 비교 테이블 작성
4. 65,000토큰 대비 현재 사용량 계산

### Phase 2: 보조 문서 최적화

1. CHECKPOINT 파일 통합 또는 slim화
2. SESSION-INTEGRITY-REVIEW.md slim화
3. 오래된 파일 정리
4. 토큰 재측정

### Phase 3: 실제 `/gsd` 테스트

1. `/gsd` 명령어로 컨텍스트 압축 여부 확인
2. `/gsd-discuss-phase` 테스트
3. `/gsd-plan-phase` 테스트
4. 품질 저하 여부 확인 (단계 생략, 에이전트 스포닝 실패 등)

### Phase 4: 최종 보고

1. 토큰 사용량 보고서 작성
2. 컨텍스트 압축 방지 성공 여부 확인
3. 향후 유지 가이드라인 작성

---

## 6. 새 세션에서 시작하는 방법

```
# 새 세션에서 다음 프롬프트 입력:

GSD 로컬 최적화 작업을 이어서 진행하세요.

## 목적
로컬 Qwen 3.6-35B (65K 컨텍스트 한계)에서 /gsd 명령어가 컨텍스트 압축 없이 실행되도록 최적화

## 현재 상태
- Wave 1~5 slim화 완료 (6개 파일, 3,625→2,488줄, -31%)
- slim화 전/후 토큰 측정 안함
- 실제 /gsd 명령어 테스트 안함
- 보조 문서 정리 안함

## 다음 단계
1. .planning/GSD-LOCAL-OPTIMIZATION-PLAN.md 읽기
2. /gsd-discuss-phase로 검증 계획 논의
3. 토큰 측정 → 보조 문서 정리 → 실제 테스트 순으로 진행

## 참고
- .planning/CHECKPOINT-1~5.md — slim화 완료 기록
- .planning/SESSION-INTEGRITY-REVIEW.md — 무결성 검증
- /home/jay/.config/opencode/get-shit-done/workflows/ — slim화 대상 파일들
```

---

*이 문서는 /gsd-discuss-phase로 시작하여 단계적으로 검증 계획을 수립하고 실행합니다.*
