# Todayis - 세션 연속성 문서

## 프로젝트 개요
웹 기반 웨딩 초대장 제작 플랫폼
- 사용자가 템플릿을 커스터마이징하고 초대장을 생성
- Vercel 서브패스 라우팅 (todayismy.vercel.app/jay)
- Freemium 비즈니스 모델 (무료 3 개 템플릿 + 유료 프리미엄)

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (MVP) → AWS S3 (V2+)
- **Auth**: Supabase Auth (Google, GitHub, Email)
- **Payment**: Toss Payments (primary), Naver Pay (secondary)
- **Deployment**: Vercel

## 최종 목표 (MVP v1.0)
1. **템플릿 시스템**: 3 개 무료 템플릿, shadcn + Pretext 하이브리드 엔진
2. **커스터마이징**: 이름, 날짜, 장소, 사진 변경
3. **인증 시스템**: Google, GitHub, Email 로그인
4. **결제 시스템**: Toss Payments 연동 (유료 템플릿 구매)
5. **초대장 공유**: 서브패스 라우팅으로 공개 초대장 제공

## 완료된 작업
- ✅ 프로젝트 요구사항 문서화 (AGENTS.md, OPENCODE.md)
- ✅ 기술 아키텍처 결정
- ✅ Payment 전략 수립 (Toss + Naver)
- ✅ Feature 로드맵 (MVP, V2, V3)
- ✅ Next.js 14 프로젝트 초기화
- ✅ shadcn/ui 9 개 컴포넌트 설치 (button, input, label, select, textarea, dialog, dropdown-menu, card, form)
- ✅ Supabase 클라이언트 라이브러리 설치
- ✅ Supabase 설정 (client.ts, server.ts, middleware.ts)
- ✅ .env.example 생성
- ✅ GSD.md 생성
- ✅ Phase 01: 템플릿 엔진 개발 (3/3 plan 완료)
- ✅ Phase 02: 인증 시스템 (4/4 plan 완료)
- ✅ OAuth 세션 버그 수정
- ✅ /settings 프로필 설정 페이지
- ✅ /admin 어드민 페이지 (회원/템플릿 관리)
- ✅ 빌드 테스트 — 17 페이지 성공

## 진행 중인 작업
- ⚠️ 모든 변경사항 git commit되지 않음 (uncommitted)
- ⚠️ ROADMAP.md가 실제 구현 상태와 불일치

## 남은 작업
- ❌ git commit & push
- ❌ 어드민 페이지 권한 검증 추가 (보안상 중요)
- ❌ ROADMAP.md 업데이트
- ❌ 프로필 이미지 업로드
- ❌ 회원 목록 페이지네이션
- ❌ 비밀번호 변경 기능
- ❌ 계정 삭제 기능
- ❌ Toss Payments 연동
- ❌ Vercel 배포 설정

## GSD 프레임워크 사용법
```bash
# 1. 현재 단계 논의
/gsd-discuss-phase

# 2. 계획 수립
/gsd-plan-phase

# 3. 계획 실행
/gsd-execute-phase

# 4. 목표 검증
/gsd-verify
```

## 주요 결정사항
1. **라우팅**: 서브도메인 대신 서브패스 라우팅 (Vercel 제한)
2. **저장소**: MVP 는 Supabase Storage (무료 1GB), V2+ 에서 AWS S3 마이그레이션
3. **결제**: Toss Payments (1.8-2.5% 수수료, 연회비 없음) + Naver Pay
4. **인증**: Kakao 로그인 제외 (복잡한 OAuth 구현 필요)
5. **UI**: shadcn/ui + Tailwind CSS + Pretext (프리미엄 템플릿용)
6. **개발 접근**: MVP 핵심 기능 먼저, 점진적 확장

## 다음 단계
1. git commit & push
2. /gsd-discuss-phase로 다음 작업 논의
3. 어드민 권한 검증 추가
4. ROADMAP.md 업데이트
5. 프로필 이미지 업로드

## 참고
- GSD 프레임워크: `/home/jay/.config/opencode/get-shit-done/`
- Next.js 14 agent rules: `node_modules/next/dist/docs/`
- 모든 입력값 검증, 보안 최우선
- TypeScript strict 모드 준수
- **상세 기록**: `SESSION-HANDOFF.md` 파일 참조
