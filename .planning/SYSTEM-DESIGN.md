# SYSTEM-DESIGN.md — LLM Wiki + GSD 통합 자동화 설계

> **작성일**: 2026-05-07
> **목표**: CLAUDE.md + LLM Wiki + GSD가 결합된 범용 자기최대화 개발 시스템
> **상태**: 설계 단계

---

## 1. 핵심 문제 정의

### 1.1 현재 시스템의 한계

```
현재 구조:
  AGENTS.md (정적 스키마)
  wiki/ (정적 지식베이스 — 수동 업데이트)
  .planning/ (GSD 실행 아티팩트)
  GSD 스킬 (실행 엔진)

문제:
  ❌ 실행 결과 → wiki 자동 반영 없음
  ❌ wiki → AGENTS.md 자동 진화 없음
  ❌ 프로젝트 종속적 (todayis 전용 데이터가 스키마에 혼재)
  ❌ 컨텍스트 최적화 수동 (slim화 매 세션 시작 시 수동)
```

### 1.2 이상적인 시스템

```
이상적 구조:
  AGENTS.md (동적 스키마 — 실행 결과로 진화)
  wiki/ (압축 지식 — LLM이 자동 유지)
  .planning/ (GSD 실행 아티팩트 — 페이즈 완료 시 정리)
  GSD 스킬 (실행 엔진)
  wiki/ops/ (운영 스크립트 — 자동화 루틴)

피드백 루프:
  GSD 실행 → 결과 분석 → wiki 자동 업데이트 → AGENTS.md 진화 → 다음 실행 개선
```

---

## 2. 아키텍처 설계

### 2.1 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Schema (AGENTS.md + wiki/index.md)                │
│ - LLM 행동 원칙 (CLAUDE.md 4원칙)                          │
│ - wiki 구조 정의                                           │
│ - 토큰 최적화 규칙                                         │
│ - 진화: 실패 패턴 → 원칙 추가                              │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Wiki (LLM-compiled knowledge)                     │
│ - index.md (인덱스 — 자동 유지)                            │
│ - codebase.md (코드 구조 — 자동 업데이트)                   │
│ - status.md (진행 상태 — GSD 연동)                         │
│ - decisions.md (결정사항 — 자동 기록)                       │
│ - log.md (시간순 기록 — 자동 append)                        │
│ - ops/ (운영 스크립트)                                     │
│ - lessons.md (학습 기록 — NEW)                              │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Raw Sources (immutable)                           │
│ - src/ (소스 코드)                                         │
│ - .planning/ROADMAP.md                                     │
│ - .planning/REQUIREMENTS.md                                │
│ - 외부 문서 (research papers, docs)                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Execution (GSD)                                   │
│ - /gsd-discuss-phase                                       │
│ - /gsd-plan-phase                                          │
│ - /gsd-execute-phase                                       │
│ - /gsd-verify-work                                         │
│ - /gsd-ship                                                │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         └──── 피드백 루프 ───┘                    │
                    │                             │
              wiki 자동 업데이트 ←─────────────────┘
              AGENTS.md 진화 ←─────────────────────┘
```

### 2.2 피드백 루프 상세

```
Phase 실행 완료 시:
  1. /gsd-verify-work 결과 파싱
  2. 성공/실패 패턴 추출
  3. wiki/lessons.md에 기록
  4. wiki/status.md 업데이트
  5. wiki/decisions.md에 결정사항 추가
  6. (선택) AGENTS.md에 새 원칙 추가

새 세션 시작 시:
  1. AGENTS.md 로드 (~400토큰)
  2. wiki/index.md 로드 (~200토큰)
  3. wiki/codebase.md 로드 (~300토큰)
  4. wiki/status.md 로드 (~200토큰)
  5. wiki/lessons.md 로드 (~200토큰) ← NEW
  6. 합계: ~1,300토큰 (2.0%)
```

---

## 3. wiki 구조 설계

### 3.1 현재 wiki/ vs 설계 wiki/

```
현재 wiki/:
  index.md (38줄)
  codebase.md (36줄)
  status.md (45줄)
  decisions.md (40줄)
  log.md (25줄)
  gsd-commands.md (67줄)
  CONTEXT-OPTIMIZATION-LOG.md (266줄) ← 분리 필요
  decisions.md (40줄)

설계 wiki/:
  index.md (인덱스 — 자동 유지)
  codebase.md (코드 구조 — 자동 업데이트)
  status.md (진행 상태 — GSD 연동)
  decisions.md (결정사항 — 자동 기록)
  log.md (시간순 기록 — 자동 append)
  lessons.md (학습 기록 — NEW) ← 핵심
  ops/
    sync.sh (GSD → wiki 동기화)
    lint.sh (wiki 건강 검사)
    compress.sh (컨텍스트 압축 감지)
```

### 3.2 lessons.md 설계 (핵심)

```markdown
# wiki/lessons.md — 학습 기록

## 구조
각 페이즈 실행 후 자동 기록:
- 페이즈 번호/이름
- 성공/실패 여부
- 핵심 학습사항 (한 줄)
- 재발 방지措施 (해당 시)
- AGENTS.md 반영 여부

## 예시
### Phase 12: 배경음악 (2026-05-07)
- 결과: 성공
- 학습: 배경음악 구현 시 audioContext 자동재생 정책 주의
- AGENTS.md 반영: ❌ (이미 알려진 패턴)

### Phase 5: 결제 (2026-05-06)
- 결과: 실패 (Supabase 연동 오류)
- 학습: Supabase 클라이언트 초기화 순서 중요
- AGENTS.md 반영: ✅ → "Supabase 연동 시 createClient 먼저" 원칙 추가
```

### 3.3 ops/ 스크립트 설계

```bash
# ops/sync.sh — GSD 실행 → wiki 동기화
# 실행 시점: /gsd-execute-phase 완료 후
# 작업:
#   1. .planning/phases/{phase}/VERIFICATION.md 읽기
#   2. 결과 파싱 (성공/실패/학습)
#   3. wiki/lessons.md에 append
#   4. wiki/status.md 업데이트
#   5. wiki/log.md에 기록

# ops/lint.sh — wiki 건강 검사
# 실행 시점: 매 세션 시작 시 (자동)
# 작업:
#   1. index.md의 링크 유효성 검사
#   2. status.md의 페이즈 상태 최신화
#   3. orphan 페이지 탐지
#   4. 모순 탐지 (decisions.md vs status.md)

# ops/compress.sh — 컨텍스트 압축 감지
# 실행 시점: 세션 시작 시 (자동)
# 작업:
#   1. 현재 컨텍스트 크기 추정
#   2. 65K 한계 대비 사용량 계산
#   3. 임계치 초과 시 slim화 권장
#   4. wiki/decisions.md에 기록
```

---

## 4. AGENTS.md 진화 설계

### 4.1 정적 스키마 → 동적 스키마

```
현재 AGENTS.md:
  - Karpathy 4원칙 (정적)
  - 프로젝트 정보 (todayis 종속)
  - GSD 워크플로우 (정적)
  - 환경 변수 (정적)
  - 명령어 (정적)

진화 AGENTS.md:
  - Karpathy 4원칙 (정적 — 변경 안함)
  - 프로젝트 정보 (wiki/codebase.md로 분리)
  - GSD 워크플로우 (wiki/gsd-commands.md로 분리)
  - 환경 변수 (wiki/decisions.md로 분리)
  - 학습 원칙 (wiki/lessons.md에서 자동 추출)
  - 실패 패턴 (wiki/lessons.md에서 자동 추출)
```

### 4.2 AGENTS.md slim화 목표

```
현재: 87줄
목표: 50줄 이하

분리 대상:
  - 프로젝트 정보 → wiki/codebase.md (이미 분리됨)
  - GSD 명령어 → wiki/gsd-commands.md (이미 분리됨)
  - 환경 변수 → .env.template (신규 생성)
  - 학습 원칙 → wiki/lessons.md (NEW)

남을 내용 (50줄):
  - Karpathy 4원칙 (20줄)
  - LLM 작업 원칙 (10줄)
  - wiki 구조 참조 (5줄)
  - 토큰 최적화 규칙 (5줄)
  - GSD 실행 규칙 (10줄)
```

---

## 5. 토큰 최적화 설계

### 5.1 토큰 사용 분석

```
현재 새 세션 (~1,400토큰):
  AGENTS.md: ~400토큰 (87줄)
  wiki/: ~1,000토큰 (256줄)

/gsd 실행 시 (~16,000토큰):
  새 세션: ~1,400토큰
  GSD 스킬: ~11,500토큰 (64개)
  phases/PLAN.md: ~3,000토큰 (새 페이즈)

65,000토큰 한계: 24.6% 사용 — 여유 충분

목표:
  - 새 세션: 1,000토큰 이하 (1.5%)
  - /gsd 실행: 20,000토큰 이하 (30.8%)
  - 컨텍스트 압축: 발생하지 않음
```

### 5.2 컨텍스트 압축 방지 전략

```
1. wiki/ 전체 300줄 이하 유지
2. AGENTS.md 50줄 이하 유지
3. GSD 스킬은 필요시만 로드 (skill tool)
4. phases/는 완료 시 삭제 (이미 실행 중)
5. ops/compress.sh로 자동 감지
```

---

## 6. 프로젝트 독립성 설계

### 6.1 todayis 종속성 제거

```
현재 문제:
  AGENTS.md에 todayis 전용 정보가 혼재
  wiki/codebase.md에 todayis 비즈니스 로직 포함
  .planning/에 todayis 전용 ROADMAP

해결책:
  1. AGENTS.md → 프로젝트 독립적 스키마만 포함
  2. wiki/codebase.md → 프로젝트별 자동 생성
  3. .planning/ → GSD 실행 아티팩트만 포함
  4. wiki/ops/init.sh → 새 프로젝트 초기화 스크립트
```

### 6.2 새 프로젝트 초기화 플로우

```bash
# 새 프로젝트에서:
1. git clone <repo>
2. wiki/ops/init.sh 실행
   → wiki/codebase.md 자동 생성 (코드베이스 분석)
   → wiki/status.md 생성 (초기 상태)
   → wiki/lessons.md 생성 (빈 템플릿)
   → AGENTS.md 프로젝트별 설정만 업데이트
3. /gsd-new-project 실행
   → GSD 아티팩트 생성
4. 피드백 루프 자동 시작
```

---

## 7. 구현 로드맵

### Phase 1: Wiki 자동 업데이트 구조 (기존 wiki/ 개선)

**목표**: wiki 구조를 LLM Wiki 원칙에 맞게 재구성

| 작업 | 파일 | 설명 |
|------|------|------|
| 1.1 | wiki/CONTEXT-OPTIMIZATION-LOG.md → wiki/log.md 병합 | 중복 제거 |
| 1.2 | wiki/lessons.md 생성 | 학습 기록 템플릿 |
| 1.3 | wiki/index.md 업데이트 | 새 구조 반영 |
| 1.4 | wiki/codebase.md slim화 | 프로젝트 독립적 설명 추가 |

### Phase 2: GSD 실행 → Wiki 자동 동기화

**목표**: GSD 실행 결과가 wiki에 자동 반영

| 작업 | 파일 | 설명 |
|------|------|------|
| 2.1 | wiki/ops/sync.sh 생성 | GSD → wiki 동기화 스크립트 |
| 2.2 | wiki/ops/lint.sh 생성 | wiki 건강 검사 스크립트 |
| 2.3 | wiki/ops/compress.sh 생성 | 컨텍스트 압축 감지 스크립트 |
| 2.4 | AGENTS.md에 ops/ 참조 추가 | 실행 규칙 정의 |

### Phase 3: AGENTS.md 진화 구조

**목표**: AGENTS.md를 프로젝트 독립적 스키마로 slim화

| 작업 | 파일 | 설명 |
|------|------|------|
| 3.1 | AGENTS.md slim화 (87→50줄) | 프로젝트 정보 분리 |
| 3.2 | .env.template 생성 | 환경 변수 분리 |
| 3.3 | wiki/decisions.md 업데이트 | 분리된 정보 참조 |

### Phase 4: 전역 템플릿 (프로젝트 독립형)

**목표**: 어떤 프로젝트에서도 바로 사용 가능한 템플릿

| 작업 | 파일 | 설명 |
|------|------|------|
| 4.1 | wiki/ops/init.sh 생성 | 새 프로젝트 초기화 |
| 4.2 | AGENTS.md 템플릿화 | 프로젝트별 설정 주석으로 분리 |
| 4.3 | README.gsd-template | 템플릿 사용 가이드 |

---

## 8. 성공 기준

### 8.1 정량적 기준

| 항목 | 현재 | 목표 |
|------|------|------|
| AGENTS.md 줄 수 | 87 | ≤50 |
| wiki/ 전체 줄 수 | 517 | ≤350 |
| 새 세션 토큰 | ~1,400 | ≤1,000 |
| /gsd 실행 토큰 | ~16,000 | ≤20,000 |
| wiki 자동 업데이트 | ❌ | ✅ |
| lessons.md 존재 | ❌ | ✅ |
| ops/ 스크립트 | ❌ | ✅ (3개) |

### 8.2 정성적 기준

- [ ] 새 세션 시작 시 컨텍스트 압축 없음
- [ ] GSD 실행 결과 → wiki 자동 반영
- [ ] wiki/lessons.md에 학습 기록 축적
- [ ] AGENTS.md 프로젝트 독립적
- [ ] 새 프로젝트에서 3명령어로 초기화 가능

---

## 9. 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|------|------|--------|
| sync.sh 오류로 wiki 손상 | 높 | git commit 전 dry-run |
| lessons.md 과성장 | 중 | 200줄 초과 시 분기 |
| AGENTS.md slim화 후 정보 손실 | 중 | .env.template로 격리 |
| ops/ 스크립트 복잡성 | 중 | 각 스크립트 50줄 이하 유지 |

---

## 10. 설계 원칙

```
1. wiki는 LLM이 작성하고 유지 — 인간이 직접 편집하지 않음
2. AGENTS.md는 스키마만 포함 — 프로젝트 데이터 제외
3. 모든 것은 파일 기반 — 데이터베이스 불필요
4. 피드백 루프는 자동 — 수동 개입 최소화
5. 토큰은 자원 — 매 줄이 비용
6. 단순함이 최고 — 200줄이 50줄 될 수 있으면 다시 쓰라
```

---

*문서 작성: 2026-05-07 | 설계 단계*
*다음: 설계 검토 → 피드백 반영 → Phase 1 구현*
