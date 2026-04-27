<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:skill-creation-rules -->
# Claude Skills 생성 규칙

스킬을 생성할 때는 반드시 공식 Claude Skills 구조를 따라야 합니다.

## 필수 구조

```
skill-name/              # 디렉토리명 = name (kebab-case)
├── SKILL.md             # 필수: 핵심 지침 파일 (YAML frontmatter + markdown)
├── scripts/             # 선택: 실행 코드
├── references/          # 선택: 참조 문서
└── assets/              # 선택: 템플릿, 이미지
```

## YAML Frontmatter 필수 필드

```yaml
---
name: "skill-name"           # 필수: kebab-case, 디렉토리명과 일치
description: "이 스킬이 무엇을 하는지, 언제 사용하는지"  # 필수: 1024자 이내
---
```

## 선택적 필드

```yaml
---
version: "1.0.0"             # 선택: 버전
enabled: true                # 선택: 활성화 여부
triggers:                    # 선택: 자동 트리거 키워드
  - 키워드1
  - 키워드2
requires:                    # 선택: 환경 요구사항
  env: []
  bins: []
---
```

## description 작성 규칙

description은 반드시 다음을 포함해야 합니다:
1. 이 스킬이 무엇을 하는지
2. 언제 사용하는지 (상황/맥락)
3. 사용자가 말할 법한 구체적 표현

예시:
```
"웨딩 초대장 플랫폼의 UI/UX 디자인 시스템 스킬입니다. (1) 사용자가 디자인 요청 시, (2) 컬러팔레트, 타이포그래피 변경 시, (3) 트렌디한 프론트엔드 요청 시 자동으로 로드됩니다."
```

## 피해야 할 실수

| 실수 | 정정 |
|------|------|
| name에 대문자/공백 | 소문자, 숫자, 하이픈만 (kebab-case) |
| description이 추상적 | 구체적 사용 표현 포함 |
| SKILL.md가 폴더 내부에 없음 | skill-name/SKILL.md 필수 |
| 디렉토리명 != name | 반드시 일치해야 함 |

## 스킬 생성 요청 시

사용자가 "스킬을 만들어줘", "Skill 생성" 요청 시:
1. skill-creator 스킬을 로드
2. 공식 구조 준수 확인
3. name이 kebab-case인지 검증
4. description이 구체적인지 확인

## 스킬 저장 위치

- 프로젝트 스킬: `{project_root}/.claude/skills/`
- 전역 스킬: `~/.claude/skills/`
- 사용자 정의 스킬: `/media/jay/D/cursor/opencode/skills/`

## 참고 자료

- Claude Skills 문서: https://code.claude.com/docs/en/skills.md
- Skill Creator: `/media/jay/D/cursor/opencode/skills/skill-creator/`
<!-- END:skill-creation-rules -->

# Todayis - Wedding Invitation Platform

## 프로젝트 개요

웹 기반 웨딩 초대장 제작 플랫폼으로, 사용자가 템플릿을 커스터마이징하고 초대장을 생성할 수 있습니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (MVP), AWS S3 (V2+)
- **Auth**: Supabase Auth (Google, GitHub, Email)
- **Payment**: Toss Payments (primary), Naver Pay (secondary)
- **Deployment**: Vercel (subpath routing)

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/
│   │   ├── page.tsx              # 메인 대시보드
│   │   ├── templates/
│   │   │   ├── page.tsx          # 템플릿 목록
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 템플릿 상세
│   │   ├── create/
│   │   │   └── page.tsx          # 초대장 제작
│   │   └── [username]/
│   │       └── page.tsx          # 공개 초대장 (subpath)
│   ├── api/
│   │   ├── auth/
│   │   ├── payment/
│   │   └── webhook/
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn/ui 컴포넌트
│   ├── templates/                # 템플릿 엔진
│   │   ├── preview/
│   │   ├── editor/
│   │   └── engine/
│   ├── forms/                    # 폼 컴포넌트
│   └── layout/                   # 레이아웃 컴포넌트
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── utils/
│   └── payment/
│       ├── toss.ts
│       └── naver.ts
├── hooks/
│   ├── use-auth.ts
│   └── use-template.ts
└── types/
    └── index.ts
```

## 핵심 기능

### MVP (v1.0)
- 3 개의 무료 템플릿
- 기본 커스터마이징 (이름, 날짜, 장소, 사진)
- Google/GitHub/Email 로그인
- Toss Payments 연동 (유료 템플릿 구매)
- 초대장 공유 (subpath: todayismy.vercel.app/jay)

### V2 (v2.0)
- 프리미엄 템플릿 (구매)
- 커스텀 폰트
- 이모지, GIF 추가
- 배경 음악

### V3 (v3.0)
- 동영상 초대장
- Kakao 로그인
- Naver Pay 연동
- AI 추천 템플릿

## GSD 프레임워크 사용

### 단계별 개발

```bash
# 1. 현재 단계 계획
/gsd-plan-phase

# 2. 계획 실행
/gsd-execute-phase

# 3. 목표 검증
/gsd-verify
```

### 주요 페이즈

1. **Setup**: 프로젝트 초기화, Supabase 설정
2. **Auth**: 인증 시스템 구현
3. **Template**: 템플릿 엔진 개발
4. **Editor**: 편집기 구현
5. **Payment**: 결제 시스템 연동
6. **Publish**: 초대장 공개 기능

## 규칙

### 코드 스타일

- TypeScript strict 모드
- ESLint + Prettier 자동 적용
- shadcn/ui 컴포넌트 재사용
- 컴포넌트는 작은 단위로 분리

### Git 워크플로우

- Feature 브랜치: `feature/xxx`
- PR 템플릿 필수 사용
- 최소 1 명 리뷰 필수

### 보안

- 환경 변수는 `.env.example` 에 템플릿만 저장
- API 키는 서버 사이드에서만 사용
- 모든 입력값 검증

## 환경 변수

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Toss Payments
TOSS_PAYMENTS_SECRET_KEY=your-toss-secret-key

# Naver Pay
NAVER_PAY_CLIENT_ID=your-naver-client-id
NAVER_PAY_CLIENT_SECRET=your-naver-client-secret
```

## 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

#lint
npm run lint

# 타입 체크
npm run type-check
```

## 배포

```bash
# Vercel 배포
vercel --prod
```

## 참고 자료

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Toss Payments](https://docs.tosspayments.com)
- [GSD Framework](https://github.com/anomalyco/get-shit-done)
