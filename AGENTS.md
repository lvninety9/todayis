<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know — breaking changes exist. Read `node_modules/next/dist/docs/` before coding.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:skill-creation-rules -->
# Claude Skills: kebab-case name, YAML frontmatter, SKILL.md 필수. 디렉토리명=name 일치.
<!-- END:skill-creation-rules -->
<!-- BEGIN:llm-working-principles -->
## LLM 작업 원칙 (Karpathy 4원칙 + opencode 최적화)

### 1. Think Before Coding — 가정 명시, 트레이드오프 표면화, 불확실하면 질문
### 2. Simplicity First — 요청한 것만 구현. 200줄이 50줄 될 수 있으면 다시 쓰십시오.
### 3. Surgical Changes — 인접 코드 "개선" 금지. 죽은 코드는 언급만 — 삭제 금지.
### 4. Goal-Driven Execution — 성공 기준 명시. "잘못된 입력 테스트 작성, then pass".

- 새 세션: `wiki/index.md` → `wiki/codebase.md` → `wiki/status.md` → `wiki/next-session.md` (~80줄)
- `.planning/` 전체 읽지 않음 — `wiki/status.md`가 최신 상태
- 코드 변경 후 `wiki/status.md` 한 줄 업데이트, 결정사항은 `wiki/decisions.md`에 한 줄 기록
- 체크포인트: `wiki/status-checkpoints.md`에 1줄 추가
<!-- END:llm-working-principles -->
# Todayis - Wedding Invitation Platform

## 기술 스택
Next.js 14 (App Router) · TypeScript strict · shadcn/ui + Tailwind CSS v4 · Supabase · Toss Payments · Vercel subpath routing

## 핵심 아키텍처
Section 기반 템플릿: ROMANTIC/CLASSIC/MODERN (각 5 섹션) · FieldType 11개 · 공개 초대장: `todayismy.vercel.app/[username]`
## GSD 워크플로우

> 출처: https://github.com/anomalyco/get-shit-done
> 전체 명령어: [wiki/gsd-commands.md](../wiki/gsd-commands.md)

GSD = 실행 엔진, wiki = 지식베이스. GSD PLAN/SUMMARY → wiki 병기. GSD는 wiki 기반 추천 → 선택 실행.
## 환경 변수
```bash
NEXT_PUBLIC_SUPABASE_URL=... · NEXT_PUBLIC_SUPABASE_ANON_KEY=...
TOSS_PAYMENTS_SECRET_KEY=... · NAVER_PAY_CLIENT_ID=... · NAVER_PAY_CLIENT_SECRET=...
```
<!-- BEGIN:token-rules -->
## 토큰 규칙 (65K 컨텍스트 최적화)

- 새 세션: `wiki/index.md` → `wiki/codebase.md` → `wiki/status.md` → `wiki/next-session.md` (~80줄, ~1,500토큰)
- `.planning/` 전체 읽지 않음 — `wiki/status.md`가 단일 출처
- AGENTS.md = 60줄 (~300토큰) · wiki/ 전체 = ~150줄 (~600토큰)
- 목표: 새 세션 합계 ~1,500토큰 (65K의 2.3%)
- /gsd 응답: 200토큰 이내 (브리핑 30 + wiki업데이트 50 + 체크포인트 50 + 다음세션 20)
<!-- END:token-rules -->

<!-- BEGIN:gsd-rules -->
## GSD 실행 규칙

- 실행 전: `wiki/status.md` 확인 · 실행 중: `wiki/status.md` 한 줄 업데이트
- 결정사항: `wiki/decisions.md` 한 줄 · 시간순: `wiki/log.md`에 `## [YYYY-MM-DD] action | description`
- 체크포인트: `wiki/status-checkpoints.md`에 1줄 추가 (status.md에는 기록 안함)
- 완료 페이즈: `.planning/phases/` 삭제 (백업 후) · sync.sh: `npm run sync`로 VERIFICATION.md → lessons.md 동기화
<!-- END:gsd-rules -->

<!-- BEGIN:gsd-orchestrator -->
## /gsd 단일 명령어 orchestrator

> `.opencode/skills/gsd/SKILL.md` 참조

```
/gsd              → 현재 상태 진단 → 다음 단계 실행 → wiki 업데이트 → 다음 세션 프롬프트
/gsd [phase_num]  → 해당 페이즈 상태 진단 → 다음 단계 실행 → wiki 업데이트 → 다음 세션 프롬프트
```

**원리:** wiki 5파일 로드 (~1,500토큰) → 상태 진단 → 한 단계 실행 → wiki 업데이트 (~1,700토큰 총)
**제약:** 65K 토큰 내 유지. 한 호출당 한 단계만 실행. /gsd 응답 200토큰 이내. 세션 종료로 컨텍스트 초기화.
<!-- END:gsd-orchestrator -->

<!-- BEGIN:next-session-prompt -->
## 다음 세션에서 이어서 할 작업

> `wiki/next-session.md` 참조 — 표준화된 다음 세션 프롬프트 1줄
<!-- END:next-session-prompt -->
