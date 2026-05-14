# Compact Wiki — Todayis

## 프로젝트

- **이름**: todayis (웨딩 초대장 플랫폼)
- **프레임워크**: Next.js 14 (App Router)
- **백엔드**: Supabase (Auth, DB, Storage)
- **결제**: Toss Payments

## 현재 상태

- **페이즈 17 완료**: 기본 프로젝트 구조 및 핵심 기능
- **페이즈 18~22 계획**: 템플릿, 에디터, 결제, 공개, 테스트

## 모듈 인덱스

| 모듈 | 상태 | 파일 |
|------|------|------|
| auth | 계획됨 | `.planning/auth/AGENTS.md` |
| template | 계획됨 | `.planning/template/AGENTS.md` |
| editor | 계획됨 | `.planning/editor/AGENTS.md` |
| payment | 계획됨 | `.planning/payment/AGENTS.md` |
| publish | 계획됨 | `.planning/publish/AGENTS.md` |

## 워크플로우 최적화

- **대상**: opencode GSD 워크플로우 (69파일, 26,074줄)
- **목표**: 50% 이하 줄이기
- **방법**: `.opencode/slim.sh` 자동 압축
- **상태**: 시작 전

## 최근 결정

- Compact Wiki 아키텍처 채택 (2026-05-07)
- 수동 문서화 중단, 자동화 중심
- 토큰 예산 관리 도입
