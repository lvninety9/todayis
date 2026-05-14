# Phase 27: Critical Bug Fixes & Sharing Feature

**Goal**: Vercel 배포 후 발견된 5개 critical bug 수정 + 초대장 공유 기능 구현

**Depends on**: Phase 1~26 (모든 기능 구현 완료 상태)

---

## 발견된 Bug 목록 (Vercel 배포 후)

### Bug 1: Double Login Issue
**증상**: 로그인 성공 후 다시 로그인 페이지로 리다이렉트됨. 정상적으로 대시보드로 가려면 2번 로그인해야 함.
**영향**: 인증 세션 유지 실패
**추정 원인**: 
- `middleware.ts`의 세션 검증 로직과 클라이언트 세션 동기화 문제
- Supabase SSR cookies 설정 문제
- 로그인 후 리다이렉트 루프

**관련 파일**:
- `src/middleware.ts` — Supabase SSR cookie 처리
- `src/hooks/use-session.ts` — 클라이언트 세션 상태 관리
- `src/lib/supabase/client.ts` — Supabase 클라이언트 설정
- `src/app/(auth)/login/page.tsx` — 로그인 페이지

**검증 방법**: 로그인 → 리다이렉트 없이 대시보드 직접 접근 확인

---

### Bug 2: Dashboard Buttons Non-functional
**증상**: 대시보드에서 "최근 템플릿" 카드에 보이는 버튼(전체 보기, 편집, 공유, 발행)이 클릭해도 아무 동작 없음
**영향**: 템플릿 관리 불가
**추정 원인**: 
- 버튼의 `onClick` 핸들러가 비어있거나 `e.preventDefault()`만 호출
- `href` 또는 `router.push`가 누락됨

**관련 파일**:
- `src/app/(main)/dashboard/page.tsx` — 대시보드 페이지

**검증 방법**: 각 버튼 클릭 시 올바른 페이지로 이동 확인

---

### Bug 3: Template Preview Data Mismatch
**증상**: 템플릿 라이브러리에서 템플릿 클릭 시 미리보기가 뜨지만, 편집한 내용(이름, 지도, 계좌번호 등)이 모두 기본 텍스트("결혼사진을 추가하세요", "결혼합니다" 등)로 표시됨
**영향**: 사용자가 만든 초대장 내용을 확인할 수 없음
**추정 원인**:
- `getPreviewData()` 함수가 template의 actual data를 제대로 읽지 못함
- `template.sections` 또는 `template.fields` 데이터 구조 불일치
- PreviewModal에 data prop이 제대로 전달되지 않음

**관련 파일**:
- `src/app/(main)/templates/page.tsx` — 템플릿 라이브러리 + 미리보기 모달 트리거
- `src/components/templates/preview/TemplatePreviewModal.tsx` — 미리보기 모달
- `src/components/templates/engine/TemplateEngine.tsx` — 템플릿 렌더링 엔진
- `src/lib/templates/sample.ts` — 템플릿 정의 (defaultValue 확인)

**검증 방법**: 편집한 템플릿의 실제 데이터가 미리보기에 정확히 표시되는지 확인

---

### Bug 4: Logout on Edit
**증상**: 템플릿 편집 페이지로 이동하면 세션이 사라져 로그아웃됨
**영향**: 템플릿 편집 불가
**추정 원인**:
- Bug 1 (세션 유지 실패)과 연관됨
- 편집 페이지의 API 호출이 auth header 없이 되어 실패
- `edit/page.tsx`에서 `session.user` 체크 후 `/login` 리다이렉트

**관련 파일**:
- `src/app/(main)/templates/[id]/edit/page.tsx` — 편집 페이지
- `src/app/api/templates/[id]/route.ts` — 템플릿 API

**검증 방법**: 편집 페이지 접근 시 세션 유지 확인

---

### Bug 5: Missing Sharing Feature
**증상**: 생성한 초대장을 지인에게 공유할 수 있는 기능이 없음. 링크 생성/공유 버튼 없음.
**영향**: 초대장 배포 불가 (핵심 기능 누락)
**추정 원인**:
- 공개 초대장 시스템(Public Invitation)은 존재하지만 (`/[username]` subpath)
- 템플릿 상세/편집 UI에서 공유 링크 생성/복사 기능이 구현되지 않음
- `ShareButton` 컴포넌트는 있지만 템플릿 관리 UI에 통합되지 않음

**관련 파일**:
- `src/app/(main)/templates/page.tsx` — 템플릿 라이브러리 (공유 버튼 추가 필요)
- `src/app/(main)/templates/[id]/edit/page.tsx` — 편집 페이지 (공유 버튼 추가 필요)
- `src/components/publish/ShareButton.tsx` — 기존 공유 버튼 컴포넌트 (재사용 가능)
- `src/components/publish/ShareDialog.tsx` — 기존 공유 다이얼로그 (재사용 가능)
- `src/app/api/invitations/[slug]/publish/route.ts` — 공개 토글 API (기존 존재)

**검증 방법**: 템플릿에서 "공유" 클릭 → 링크 생성 → 복사 → 실제 URL 접근 가능 확인

---

## 실행 계획

### Wave 1: 인증/세션 버그 수정 (Bug 1, Bug 4)
**우선순위**: 가장 높음 — 세션 문제가 다른 버그들의 근본 원인일 가능성 큼

1. `middleware.ts` 분석 — 로그인 후 리다이렉트 루프 원인 파악
2. `use-session.ts` 분석 — 클라이언트 세션 동기화 문제 파악
3. Supabase SSR cookie 설정 검증 — `cookie.parse()`, `cookie.set()` 흐름 확인
4. 로그인 성공 후 리다이렉트 로직 수정
5. 편집 페이지에서 API 호출 시 auth header 전달 확인
6. **검증**: 로그인 → 대시보드 접근 → 편집 페이지 접근 (모두 세션 유지)

### Wave 2: 대시보드 버튼 수정 (Bug 2)
1. `dashboard/page.tsx`의 버튼 핸들러 확인
2. 각 버튼에 올바른 네비게이션 로직 추가:
   - "전체 보기" → `/templates`
   - "편집" → `/templates/${id}/edit`
   - "공유" → 공유 다이얼로그 열기
   - "발행" → 공개 토글 또는 `/create/${id}`
3. **검증**: 각 버튼 클릭 시 올바른 동작 수행

### Wave 3: 템플릿 미리보기 데이터 수정 (Bug 3)
1. `templates/page.tsx`의 `getPreviewData()` 함수 추적
2. `template.sections` 구조가 PreviewModal에 제대로 전달되는지 확인
3. `TemplateEngine.tsx`에서 data prop이 올바르게 렌더링되는지 확인
4. defaultValue가 비어있을 때 실제 template data로 fallback
5. **검증**: 편집한 템플릿의 실제 데이터가 미리보기에 정확히 표시

### Wave 4: 공유 기능 구현 (Bug 5)
1. 템플릿 라이브러리 카드에 "공유" 버튼 추가
2. 템플릿 편집 페이지에 "공유" 버튼 추가
3. 기존 `ShareButton`/`ShareDialog` 컴포넌트 재사용 또는 개선
4. 공유 링크 생성 로직:
   - 템플릿이 공개 상태가 아니면 먼저 공개 토글
   - `/[username]` URL 또는 `/invite/${templateId}` URL 생성
   - 클립보드에 URL 복사
5. **검증**: 공유 링크 생성 → 복사 → 다른 탭에서 접근 가능

---

## Success Criteria (모두 TRUE여야 완료)

1. [ ] 로그인 후 1번만 로그인해도 대시보드 접근 가능 (Double Login 해결)
2. [ ] 대시보드에서 모든 버튼(전체 보기, 편집, 공유, 발행)이 정상 동작
3. [ ] 템플릿 라이브러리 미리보기에서 편집한 실제 데이터가 표시됨
4. [ ] 편집 페이지 접근 시 로그아웃되지 않음
5. [ ] 템플릿에서 공유 링크 생성/복사 기능 동작
6. [ ] 공유 링크로 실제 초대장 접근 가능
7. [ ] `npm run build` 및 `npm run lint` 통과

---

## Gray Areas (의사결정 필요)

| 결정사항 | 선택지 A | 선택지 B | 권장 | 근거 |
|----------|----------|----------|------|------|
| 공유 URL 구조 | `todayismy.vercel.app/[username]` 재사용 | `/invite/${templateId}` 새 라우트 | 기존 재사용 | 이미 subpath routing 시스템 존재. 새 라우트는 중복 유지 비용 |
| 공유 버튼 위치 | 템플릿 카드에만 | 카드 + 편집 페이지 + 템플릿 상세 | 둘 다 | 사용자가 어디서든 공유할 수 있어야 함 |
| 공개 토글 자동 | 공유 시 자동 공개 | 수동 공개 토글 후 공유 | 수동 공개 토글 | 사용자가 공개 여부를 직접 결정 |
| 세션 디버깅 | Vercel 로그 확인 | 로컬에서 production build로 재현 | 둘 다 | Vercel 로그로 먼저 확인, 필요시 로컬 재현 |

---

## 참고 사항

- **Vercel 배포 URL**: `https://todayis-lv9.vercel.app`
- **Supabase SSR middleware**는 Phase 26 이전에 설정됨 (`middleware.ts`)
- **공유 컴포넌트**는 이미 존재 (`ShareButton.tsx`, `ShareDialog.tsx`) — 재사용 가능
- **공개 초대장 시스템**은 이미 구현됨 (`/[username]` subpath routing) — UI 통합만 필요

---

*Plan created: 2026-05-10*
*Status: Plan ready for execution*
