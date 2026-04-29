# Todayis - 다음 세션 이어서 작업하기

---

## 🚀 시작 방법

새 세션에서 다음 명령어 중 하나를 입력하세요:

```bash
# GSD 워크플로우 자동 실행 (권장)
/gsd

# 특정 Phase 실행
/gsd 15
```

---

## 📊 현재 프로젝트 상태 (2026-04-27 기준)

### 완료된 페이즈
| Phase | 이름 | 상태 | Plans |
|-------|------|------|-------|
| 01 | template-engine | ✅ 완료 | 3/3 |
| 02 | auth-system | ✅ 완료 | 4/4 |
| 03 | template-management | ✅ 완료 | 4/4 |
| 04 | profile-and-settings | ✅ 완료 | 4/4 |
| 05 | payment-system | ✅ 완료 | 3/3 |
| 06 | publish-system | ✅ 완료 | 3/3 |
| 07 | tests-unit | ✅ 완료 | 128개 테스트 |
| 08 | tests-e2e | ✅ 완료 | 36개 통과 |
| 09 | frontend-redesign | ✅ 완료 | 8/8 |
| 10 | naver-selling | ✅ 완료 | 11/11 |
| 11 | custom-fonts | ✅ 완료 | 2/2 |
| 12 | background-music | ⏳ 대기 | (V2) |
| 13 | design-system | ✅ 완료 | 5/5 |
| 14 | ux | ✅ 완료 | 4/4 |

### 다음 작업
| Phase | 이름 | 상태 | 비고 |
|-------|------|------|------|
| 15 | field-extension | 🔄 대기 | V2 — 템플릿 필드 타입 확장 |

---

## ✅ Phase 14 완료 내용 (2026-04-27)

### 변경된 파일 (7개)
1. `src/app/(main)/layout.tsx` — 로고 href `/` → `/landing`
2. `src/app/page.tsx` — root redirect `/login` → `/landing`
3. `src/app/(main)/dashboard/page.tsx` — indigo → warm palette
4. `src/app/(auth)/login/page.tsx` — indigo → warm palette
5. `src/app/(auth)/signup/page.tsx` — indigo → warm palette (추가 수정)
6. `src/components/templates/preview/TemplatePreview.tsx` — indigo → warm palette
7. `src/components/templates/library/TemplateCard.tsx` — 클릭 → 미리보기 페이지 이동
8. `src/components/templates/engine/TemplateEngine.tsx` — 빈 상태 placeholder

### 검증 결과
- 빌드: ✅ 성공
- 변경 파일 8개 모두 확인됨

---

## 🎯 Phase 15: 템플릿 필드 확장 (V2)

**Goal**: 템플릿 필드 타입 확장 (계좌번호, 배경음악, GIF, 동영상, 갤러리 등)

**Requirements**:
- FIELD-01: 계좌번호 필드
- FIELD-02: 배경 음악 URL (mp3/ogg/wav)
- FIELD-03: GIF/애니메이션 이미지
- FIELD-04: 동영상 URL (mp4)
- FIELD-05: 갤러리 (여러 이미지)
- FIELD-06: 축의도 메시지
- FIELD-07: Dress Code
- FIELD-08: 부모님 성함

**Status**: Planning 전

---

## 📁 중요 문서 위치

- `.planning/ROADMAP.md` — 전체 로드맵 (Phase 14 완료, Phase 15 추가됨)
- `.planning/STATE.md` — 현재 상태 (Phase 14 완료로 업데이트)
- `.planning/phases/14-ux/PLAN.md` — Phase 14 실행 계획
- `.planning/phases/14-ux/14-CONTEXT.md` — Phase 14 결정사항
- `.planning/phases/15-field-extension/` — Phase 15 문서 (추가 예정)

---

## 🔧 기술 스택

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Animation**: Pure CSS (tailwindcss-animate)

---

*마지막 업데이트: 2026-04-27*