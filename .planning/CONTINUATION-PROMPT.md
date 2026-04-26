# Todayis - 다음 세션 이어서 작업하기

---

## 🚀 시작 방법

새로운 세션에서 다음 명령어 중 하나를 입력하세요:

```bash
# 방법 1: GSD 워크플로우 자동 실행 (권장)
/gsd-discuss-phase --auto
/gsd-plan-phase
/gsd-execute-phase

# 방법 2: 수동 작업
# .planning/STATE.md와 .planning/ROADMAP.md를 확인하고 다음 작업 선택
```

---

## 📊 현재 프로젝트 상태 (2026-04-25 기준)

### 완료된 페이즈
| Phase | 이름 | 상태 |
|-------|------|------|
| 01 | template-engine | ✅ 완료 |
| 02 | auth-system | ✅ 완료 |
| 03 | template-management | ✅ 완료 |
| 04 | profile-and-settings | ✅ 완료 |
| 05 | payment-system | ✅ 완료 |
| 06 | publish-system | ✅ 완료 |
| 07 | tests-unit | ✅ 완료 (120 tests) |
| 08 | tests-e2e | ✅ 완료 (40 tests) |
| 09 | frontend-redesign | ✅ 완료 |
| 10 | naver-selling | ✅ 완료 |
| 11-01 | custom-fonts (Plan 01) | ✅ 완료 |

### 진행 중 / 대기 중
| Phase | 이름 | 상태 |
|-------|------|------|
| 11-02 | custom-fonts (Plan 02) | ⏳ 대기 중 |

### 다음 작업: Phase 11 Plan 02 — 커스텀 폰트 업로드

**목표**: 사용자가 직접 폰트 파일(.ttf, .otf, .woff, .woff2)을 업로드하여 템플릿에 적용

**필요 파일**:
1. `src/app/api/fonts/route.ts` — 업로드 API (POST/DELETE)
2. `src/lib/fonts.ts` — 커스텀 폰트 로딩 함수 추가
3. `src/components/templates/editor/StyleEditor.tsx` — 업로드 UI 추가

**참고**: `src/app/api/templates/media/route.ts`를 참고하여 구현 (Supabase Storage 사용)

---

## 🎨 디자인 리디자인 계획 (Phase 11 이후)

### 디자인 방향성
- **Soft Minimal**: 여백 중심, 세리프 폰트, 파스텔 톤
- **Design Token**: Tailwind v4 `@theme` 기반 일관된 디자인 시스템
- **Micro-interactions**: hover, focus, transition으로 생동감

### 리디자인 대상
1. 로그인/회원가입 — Soft Minimal 웨딩 느낌
2. 대시보드 — 통계 카드 + 그라데이션
3. 템플릿 라이브러리 — 카드 그리드 + hover 효과
4. StyleEditor — 탭 기반 UI + 프리뷰 통합

---

## 🔧 기술 스택

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (MVP)
- **Animation**: Motion (formerly Framer Motion)
- **Testing**: Vitest + Playwright

---

## 📁 중요 파일 위치

```
.planning/
├── STATE.md              ← 전체 진행 상태
├── ROADMAP.md            ← 페이즈 로드맵
├── SESSION-CONTINUATION.md ← 이 파일
└── phases/
    ├── 11-custom-fonts/
    │   ├── 11-01-PLAN.md  ← Plan 01 (완료)
    │   └── 11-02-PLAN.md  ← Plan 02 (다음 작업)
    └── 08-frontend-redesign/
        └── 08-frontend-redesign-SUMMARY.md ← 디자인 학습 결과

src/
├── lib/fonts.ts          ← 폰트 유틸리티 (Plan 01에서 생성)
├── components/layout/HeadFonts.tsx ← 동적 폰트 로딩
├── components/templates/editor/StyleEditor.tsx ← Plan 02에서 수정
└── components/publish/InvitationViewer.tsx ← Plan 01에서 수정
```

---

## ⚠️ 주의사항

1. **GSD 워크플로우 필수 준수**: discuss → plan → execute 순서
2. **문서 업데이트**: 모든 변경사항은 STATE.md, ROADMAP.md에 반영
3. **빌드 테스트**: 코드 변경 후 반드시 `npm run build` 실행
4. **테스트 실행**: `npm test`로 단위 테스트 통과 확인
5. **커밋 메시지**: Conventional Commits 형식 사용 (feat:, fix:, refactor:, etc.)

---

## 🎯 Phase 11 Plan 02 상세

`.planning/phases/11-custom-fonts/11-02-PLAN.md` 파일에서 전체 계획 확인:

- **Task 1**: `/api/fonts/route.ts` 생성 (POST/DELETE)
- **Task 2**: `src/lib/fonts.ts`에 커스텀 폰트 함수 추가
- **Task 3**: `StyleEditor.tsx`에 업로드 UI 추가

---

## 📞 문제 발생 시

1. `.planning/STATE.md`에서 현재 상태 확인
2. `.planning/ROADMAP.md`에서 페이즈 목표 확인
3. 해당 phase의 `*-PLAN.md`에서 상세 작업 확인

---

*마지막 업데이트: 2026-04-25*
