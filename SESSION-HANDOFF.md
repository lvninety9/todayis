# Todayis 프로젝트 세션 핸드오프 문서

## 프로젝트 개요

**Todayis**는 웹 기반 웨딩 초대장 제작 플랫폼입니다.

- **기술 스택**: Next.js 14 (App Router), Supabase (Auth + Database), shadcn/ui, Tailwind CSS v4
- **핵심 기능**: 템플릿 생성/편집, 사용자 인증, 초대장 공유 (subpath)
- **현재 상태**: MVP 개발 중 (Phase 02-auth → Phase 03-template-management)

---

## 작업 완료 내역

### 1. 빌드 오류 수정 (최근 작업)

| 파일 | 문제 | 해결 방법 |
|------|------|-----------|
| `src/lib/template-utils.ts` | JSX 포함 but `.ts` 확장자 | `.tsx`로 rename |
| `src/app/api/auth/logout/route.ts` | `signOut()` 인자 오류 | 쿠키 기반 로그아웃으로 재구현 |
| `src/app/api/templates/[id]/route.ts` | Template 타입 불일치 | `database.types` → `types/template` import 수정 |
| `src/app/api/templates/route.ts` | 동일 | 동일하게 수정 |
| `src/data/templates/sample.ts` | Template 필드 누락 | `userId`, `createdAt`, `updatedAt`, `isPublished`, `downloadCount` 추가 |
| `src/types/auth.ts` | User 타입 호환성 오류 | Supabase User 타입 직접 사용으로 변경 |
| `src/app/(auth)/signup/page.tsx` | `useSearchParams()` Suspense 오류 | 불필요한 useEffect 제거 |

### 2. 빌드 및 테스트 결과

```
✓ Compiled successfully
✓ Generating static pages (12/12)

테스트된 페이지:
  /login              - 200 OK
  /signup             - 200 OK
  /dashboard          - 200 OK
  /templates          - 200 OK
  /reset-password     - 200 OK
  /api/templates      - 401 (인증 없음, 정상)
```

---

## 프로젝트 구조

```
todayis/
├── src/
│   ├── app/
│   │   ├── (auth)/           # 인증 페이지 그룹
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (main)/           # 메인 페이지 그룹
│   │   │   ├── dashboard/page.tsx
│   │   │   └── templates/
│   │   │       ├── page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   ├── api/
│   │   │   ├── templates/route.ts
│   │   │   ├── templates/[id]/route.ts
│   │   │   └── auth/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/             # OAuth 로그인 버튼
│   │   ├── forms/            # LoginForm, SignupForm
│   │   ├── templates/        # 템플릿 편집/미리보기
│   │   └── ui/               # shadcn/ui 컴포넌트
│   ├── hooks/
│   │   ├── use-auth.ts       # 인증 (signIn, signUp, signOut)
│   │   └── use-session.ts    # 세션 관리
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts     # 브라우저 클라이언트
│   │   │   └── database.types.ts
│   │   └── utils.ts
│   └── types/
│       ├── auth.ts
│       └── template.ts
├── .env.local                # Supabase credentials
├── prisma/
│   └── schema.prisma         # DB 스키마 (미사용)
└── package.json
```

---

## 진행 중인 상황

### 현재 상태
- ✅ 빌드 오류 모두 수정 완료
- ✅ 모든 페이지 접근 정상 (200 OK)
- ✅ API 인증 처리 정상 (401 반환)

### 확인이 필요한 구간

1. **Supabase 데이터베이스 테이블**
   - `templates` 테이블이 Supabase에 생성되어 있는지 확인 필요
   - 현재 API routes는 직접 Supabase SQL 쿼리 사용

2. **환경 변수 누락**
   - `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`가 없음
   - API routes에서 필요로 함

3. **Prisma 불일치**
   - `prisma/schema.prisma` 파일 존재하지만 실제 사용 안 함
   - Supabase 직접 쿼리 방식 사용 중

4. **실제 인증 흐름 테스트**
   - Supabase에 사용자 등록 후 로그인 → 대시보드 이동 테스트
   - API 호출 시 토큰 전달 확인

---

## 남은 작업

### 우선순위 높음

1. **Supabase 데이터베이스 설정**
   - `templates` 테이블 생성 SQL 실행
   - RLS (Row Level Security) 정책 설정

2. **환경 변수 추가**
   - `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 추가

3. **실제 인증 테스트**
   - Supabase 대시보드에서 이메일 인증 활성화 확인
   - 회원가입 → 로그인 → 대시보드 전체 흐름 테스트

### 우선순위 중간

4. **템플릿 CRUD 완전 구현**
   - 템플릿 생성/편집/삭제 API 연동
   - 템플릿 라이브러리 UI와 연결

5. **템플릿 에디터**
   - 필드 편집 UI 완성
   - 템플릿 저장/미리보기

### 우선순위 낮음

6. **결제 시스템 연동** (MVP 후)
7. **프리미엄 템플릿** (V2)
8. **동영상 초대장** (V3)

---

## 세션 이어서 진행 프롬프트

새 세션에서 다음 명령으로 작업을 시작하세요:

```
/media/jay/D/cursor/todayis 프로젝트에서 작업을 이어서 진행합니다.

현재 상태:
- 빌드 오류 모두 수정 완료 (template-utils.tsx, auth types, template types 등)
- 모든 페이지 접근 정상 (login, signup, dashboard, templates)
- API 인증 처리 정상 (401 반환 확인)

다음 작업:
1. Supabase 데이터베이스에 templates 테이블 생성
2. .env.local에 SUPABASE_SERVICE_ROLE_KEY 추가
3. 실제 인증 흐름 테스트 (회원가입 → 로그인 → 대시보드)

참고 파일:
- src/app/api/templates/route.ts
- src/app/api/templates/[id]/route.ts
- src/lib/supabase/client.ts
- .env.local

먼저 무엇을 진행할까요?
```

---

## 참고 자료

- **AGENTS.md**: 프로젝트 기술 스택, 구조, 환경 변수 정의
- **SUMMARY.md**: 프로젝트 세션 연속성 문서
- **PLAN-03-CONTINUATION.md**: Phase 03 진행 중인 계획
- **GSD.md**: GSD 프레임워크 사용 가이드