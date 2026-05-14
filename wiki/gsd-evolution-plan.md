# GSD Evolution Plan — /gsd 단일 명령어 자동화

## 배경

- `/gsd [N]` 한 번으로 상태 진단 → 다음 단계 실행 → wiki 업데이트
- 컨텍스트 자동 관리 (65K 토큰 내 유지)
- wiki 자동 동기화

---

## 구현 단계

### Phase A: /gsd orchestrator 구현 ✅ 완료

- [x] `.opencode/skills/gsd/SKILL.md` — orchestrator 스킬 (토큰 버젯 포함)
- [x] `AGENTS.md` — /gsd 사용법 추가
- [x] `wiki/gsd-commands.md` — /gsd 명령어 문서화
- [x] wiki 구조 slim화 (status.md, next-session.md, status-checkpoints.md)

### Phase B: LLM Wiki 통합 ✅ 완료

- [x] AGENTS.md — Karpathy 4원칙 포함
- [x] wiki/codebase.md — GSD 실행 패턴 문서화

### Phase C: 컨텍스트 자동 최적화 ✅ 완료

- [x] status.md slim화 (174줄 → 24줄)
- [x] status-checkpoints.md 생성 (체크포인트 분리)
- [x] next-session.md 생성 (세션 간 전달 표준화)
- [x] /gsd 토큰 버젯 추가 (200토큰 이내)
- [x] CONTEXT-OPTIMIZATION-LOG.md slim화 (320줄 → 50줄)

### Phase D: 검증 및 개선

- [ ] `/gsd [N]` 실제 테스트 (Phase 23 execute)
- [ ] 컨텍스트 65K 토큰 내 유지 확인
- [ ] wiki 동기화 정확도 검증

---

## 성공 기준

1. `/gsd [N]` 한 번으로 상태 진단 + 다음 단계 실행
2. 컨텍스트 65K 토큰 내 유지 (자동 압축 없음)
3. wiki 자동 동기화 정확도
4. 빌드/린트 100% 통과

---
*생성일: 2026-05-08 | Phase A/B/C 완료, Phase D 검증 대기*
