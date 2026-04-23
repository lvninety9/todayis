# Get Shit Done (GSD) Framework

## 개요

GSD 프레임워크는 복잡한 프로젝트를 체계적으로 진행하기 위한 워크플로우입니다.

## 사용 방법

### 1. 프로젝트 초기화

```bash
/gsd-init
```

### 2. 단계별 개발

```bash
/gsd-plan-phase      # 현재 단계 계획 수립
/gsd-execute-phase   # 계획 실행
/gsd-verify          # 목표 달성 검증
```

### 3. 주요 에이전트

- **build**: 프로젝트 빌드 및 설정
- **plan**: 단계별 계획 수립
- **execute**: 계획 실행
- **verify**: 목표 달성 검증
- **compaction**: 컨텍스트 컴팩션
- **summary**: 진행 상황 요약

## 워크플로우

1. **Phase Planning**: `/gsd-plan-phase` 로 현재 단계 계획
2. **Execution**: `/gsd-execute-phase` 로 계획 실행
3. **Verification**: `/gsd-verify` 로 목표 달성 확인
4. **Compaction**: `/compact` 로 컨텍스트 정리

## 주의사항

- 한 번에 하나의 페이즈만 진행
- 각 페이즈 완료 후 반드시 검증
- 불필요한 설정은 최소화

## 세션 관리 규칙

### 페이즈 완료 시 자동화

각 페이즈 완료 시 다음 작업을 자동으로 수행:

1. **새 세션 준비 문서 생성**
   - `.planning/PHASE-{NEXT}.md` 생성
   - 다음 페이즈의 목표, 계획, 준비사항 문서화
   - 현재 세션의 최종 상태 기록

2. **세션 종료 체크리스트**
   - ✅ 완료된 작업 정리
   - ✅ 다음 세션에서 시작할 작업 명시
   - ✅ 필요한 환경 변수/설정 확인
   - ✅ 데이터베이스 상태 확인

3. **자연스러운 이음**
   - 다음 세션에서 `/gsd-execute-phase` 명령만으로 시작 가능
   - 컨텍스트 손실 최소화
   - 문서화된 상태로 다음 개발자/세션이 즉시 작업 시작

### 예시 워크플로우

```
페이즈 A 완료
  ↓
새 세션 준비 문서 생성 (.planning/PHASE-B.md)
  ↓
세션 종료
  ↓
새 세션 시작 → /gsd-execute-phase B → 즉시 작업 시작
```

## 현재 세션에서 GSD 사용

opencode TUI 에서 `/gsd` 명령어를 사용하여 GSD 프레임워크를 활성화할 수 있습니다.

```bash
# opencode TUI 에서
/gsd-workstreams list      # 워크스트림 목록 확인
/gsd-plan-phase           # 현재 단계 계획
/gsd-execute-phase        # 계획 실행
/gsd-verify               # 목표 검증
```

현재 세션에서는 제가 GSD 워크플로우를 따라 진행합니다.
