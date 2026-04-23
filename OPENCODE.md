# OpenCode Harness Engineering Guidelines

이 문서는 모든 opencode 프로젝트에 적용되는 글로벌 하네스 엔지니어링 가이드라인입니다.

## 🎯 핵심 철학

**"설정은 거대한 아키텍처가 아니라 미세 조정"**

- 필요한 구성요소만 선택적으로 도입
- 에이전트 하네스를 통한 1 인 개발팀 효과
- 지속적 학습과 진화 (Continuous Learning)

## 📁 프로젝트 구조

```
project-root/
├── .opencode/                    # OpenCode 하네스 설정
│   ├── agents/                   # 전문 서브에이전트
│   │   ├── planner.md            # 기획 에이전트
│   │   ├── code-reviewer.md      # 코드 리뷰 에이전트
│   │   └── ...                   # 프로젝트별 에이전트
│   ├── skills/                   # 워크플로우 스킬
│   │   ├── SKILL.md              # 각 스킬의 상세 설명
│   │   └── ...
│   ├── commands/                 # 슬래시 명령어
│   │   ├── /plan
│   │   ├── /code-review
│   │   └── ...
│   ├── hooks/                    # 자동화 훅
│   │   └── hooks.json            # 훅 설정
│   ├── rules/                    # 코딩 규칙
│   │   ├── common/
│   │   │   ├── security.md
│   │   │   ├── coding-style.md
│   │   │   ├── git-workflow.md
│   │   │   └── testing.md
│   │   └── [language]/           # 언어별 규칙
│   │       ├── typescript.md
│   │       └── ...
│   └── contexts/                 # 동적 시스템 프롬프트
│       ├── dev.md
│       ├── review.md
│       └── research.md
├── src/                          # 소스 코드
├── tests/                        # 테스트 코드
├── docs/                         # 문서
├── AGENTS.md                     # 에이전트 설정 (OpenCode)
├── CLAUDE.md                     # Claude Code 설정
├── OPENCODE.md                   # 이 파일
├── GSD.md                        # GSD 프레임워크 가이드
└── package.json
```

## 🤖 에이전트 시스템

### 에이전트 카테고리

1. **기획/설계**: planner, architect
2. **코드 품질**: code-reviewer, refactor-cleaner
3. **보안/테스트**: security-reviewer, tdd-guide
4. **운영/문서**: loop-operator, harness-optimizer, doc-updater

### 에이전트 정의 예시

```markdown
---
name: code-reviewer
description: 코드 품질 리뷰 전문 에이전트
tools: ["Read", "Grep", "Glob"]
model: opus
---

코드 리뷰를 수행합니다:
- 코드 스타일 일관성 확인
- 보안 취약점 스캔
- 성능 최적화 제안
- 테스트 커버리지 검토
```

## 🛠️ 스킬 시스템

### 핵심 워크플로우 스킬

- `search-first`: 코딩 전 리서치 (5 단계 워크플로우)
- `tdd-workflow`: 테스트 주도 개발
- `security-review`: 보안 리뷰
- `verification-loop`: 검증 루프
- `cost-aware-llm-pipeline`: 비용 효율적 LLM 파이프라인

### 스킬 작성 규칙

1. 각 스킬은 `SKILL.md` 파일로 문서화
2. 명확한 입력/출력 정의
3. 단계별 워크플로우 설명
4. 예제 포함

## 🔧 훅 시스템

### 주요 훅 타입

- `PreToolUse`: 도구 호출 전 자동 실행
- `PostToolUse`: 도구 호출 후 자동 실행
- `SessionStart`: 세션 시작 시 실행
- `Stop`: 세션 종료 시 실행
- `PreCompact`: 컴팩션 전 실행

### 훅 예시

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "command": "./scripts/block-no-verify.sh",
      "description": "git commit --no-verify 차단"
    },
    {
      "event": "PostToolUse",
      "command": "./scripts/post-edit-format.sh",
      "description": "JS/TS 파일 자동 포맷"
    }
  ]
}
```

## 📜 규칙 시스템

### 공통 규칙 (rules/common/)

1. **security.md**: 보안 가이드라인
2. **coding-style.md**: 코드 스타일 가이드
3. **git-workflow.md**: Git 워크플로우
4. **testing.md**: 테스트 가이드라인
5. **performance.md**: 성능 가이드
6. **patterns.md**: 디자인 패턴
7. **hooks.md**: 훅 사용 가이드
8. **agents.md**: 에이전트 사용 가이드

### 언어별 규칙

- TypeScript, Python, Go, Rust, Java, Kotlin, C++, Swift 등
- 각 언어의 best practice 반영

## 🔄 지속적 학습 (Continuous Learning)

### Instinct 시스템

1. **관찰**: PreToolUse/PostToolUse 훅이 패턴 캡처
2. **저장**: 신뢰도 점수 (0.3~0.9) 와 도메인 태그와 함께 저장
3. **스코핑**: 프로젝트별로 격리 (git remote URL 해시 기반)
4. **진화**: `/evolve` 명령어로 스킬/커맨드/에이전트로 진화

### 명령어

- `/instinct-status`: 학습된 Instinct 조회
- `/evolve`: Instinct 를 스킬로 진화
- `/instinct-export/import`: 팀 간 공유
- `/promote`: 프로젝트 스코프에서 글로벌로 승격
- `/prune`: 만료된 Instinct 정리

## 🎨 컨텍스트 관리

### 동적 시스템 프롬프트

```bash
# 개발 모드
alias opencode-dev='opencode --system-prompt "$(cat ~/.opencode/contexts/dev.md)"'

# 코드 리뷰 모드
alias opencode-review='opencode --system-prompt "$(cat ~/.opencode/contexts/review.md)"'

# 리서치 모드
alias opencode-research='opencode --system-prompt "$(cat ~/.opencode/contexts/research.md)"'
```

### 전략적 컴팩션

- 자동 컴팩션 비활성화
- 논리적 구간에서 수동 `/compact` 실행
- PreCompact/Stop 훅으로 세션 간 연속성 보장

## 🛡️ 보안 가이드라인

### 최소 보안 기준

1. 에이전트 ID 를 개인 계정과 분리
2. 단기 스코프 자격 증명 사용
3. 비신뢰 작업은 컨테이너/VM 에서 격리
4. 아웃바운드 네트워크 기본 차단
5. 비밀 정보가 담긴 경로 읽기 제한
6. 파일/HTML/스크린샷은 정제 후 전달
7. 도구 호출, 승인, 네트워크 시도를 로깅
8. 프로세스 그룹 킬과 데드맨 스위치 구현

### 보안 철학

> "악의적인 텍스트가 컨텍스트에 들어올 것을 전제하고 만들어라. 도구 설명이 거짓말할 수 있다고 전제하고 만들어라. 저장소가 오염될 수 있다고 전제하고 만들어라."

## 📊 토큰 최적화

### 모델 라우팅 전략

| 작업 유형 | 권장 모델 | 이유 |
|-----------|-----------|------|
| 탐색/검색 | Haiku | 빠르고 저렴 |
| 일반 코딩 (90%) | Sonnet | 비용 대비 성능 최적 |
| 아키텍처/보안 | Opus | 깊은 추론 필요 |
| 문서 작성 | Haiku | 구조가 단순한 작업 |
| 복잡한 디버깅 | Opus | 전체 시스템 맥락 필요 |

### MCP vs CLI

- MCP 대신 CLI 직접 사용으로 토큰 비용 절감
- MCP 동시 활성화 10 개 미만 유지
- 활성 도구 80 개 미만 유지

## 🚀 실전 활용 패턴

### 병렬 작업 패턴

1. **/fork**: 독립 작업 분리
2. **Git Worktrees**: 코드 변경 겹치는 경우 필수
3. **Cascade Method**: 새 작업을 오른쪽 탭에 열고 왼쪽에서 오른쪽으로 스위핑
4. **동시 3~4 개 작업**이 적정 수준

### Two-Instance Kickoff

새 프로젝트 시작 시:

- **인스턴스 1**: 스캐폴딩 에이전트 (프로젝트 구조 생성)
- **인스턴스 2**: 딥 리서치 에이전트 (상세 PRD, 아키텍처)

## ⚠️ 주의사항

1. **과도한 설정 금지**: "설정을 아키텍처가 아닌 미세 조정으로 다뤄라"
2. **컨텍스트 윈도우 관리**: 사용하지 않는 MCP/플러그인 비활성화
3. **서브에이전트 스코핑**: 제한된 도구 = 집중된 실행
4. **보안 인식**: 외부 정보는 반드시 격리/정제 단계 거치기
5. **과도한 병렬화 금지**: 5 개 이상의 인스턴스 무작정 띄우지 않기

## 📈 설치 및 시작 가이드

### 단계별 접근

1. **Core**: 규칙, 에이전트, 명령어, 훅, 플랫폼 설정, 품질 워크플로우
2. **Developer**: Core + 프레임워크/언어, 데이터베이스, 오케스트레이션
3. **Security**: Core + 전용 보안 모듈
4. **Research**: Core + 리서치 API, 비즈니스 콘텐츠
5. **Full**: 전체 모듈 포함

### 권장 접근법

- 처음부터 모든 기능 설치하지 않기
- 주 사용 언어의 에이전트와 스킬만 먼저 선택적 설치
- Shortform Guide 먼저 읽기 (약 15 분)
- `/plan` 명령어로 현재 프로젝트에서 테스트

## 🔗 참고 자료

- [Everything Claude Code GitHub](https://github.com/affaan-m/everything-claude-code)
- [ecc.tools](https://ecc.tools)
- [AgentShield GitHub](https://github.com/affaan-m/agentshield)

---

**마지막으로**: 이 가이드라인은 고정된 것이 아닙니다. 프로젝트의 필요에 따라 유연하게 적용하고, 지속적으로 개선하세요.
