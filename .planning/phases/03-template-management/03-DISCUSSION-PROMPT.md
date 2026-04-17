# Phase 03: 템플릿 관리 - 논의 시작 프롬프트

## 다음 세션에서 논의할 사항

### 1. Storage Strategy
**질문:** 템플릿 파일을 어디에 저장할까요?

**Options:**
- **Supabase Storage** (권장) — 프로젝트 MVP 스펙에 부합, 이미지/파일 저장에 적합
- **File System** — 단순한 MVP 에 적합, 하지만 Vercel 배포시 영구성 문제
- **Database (JSON)** — 간단한 템플릿 구조라면 충분, 확장성 제한적

**고려사항:**
- Phase 1 에서 만든 템플릿 타입 (text, date, image, location)
- 이미지 필드를 포함하는 템플릿은 파일 저장소 필요
- Supabase Storage 는 Phase 2 인증 시스템과 통합 가능

---

### 2. Template CRUD API
**질문:** API 는 어떤 패턴으로 설계할까요?

**Options:**
- **RESTful endpoints** (권장) — `/api/templates` 표준 패턴, 예측 가능
- **Supabase RPC** — 데이터베이스 직접 조작, 실시간 동기화 가능
- **Custom mutations** — 프로젝트 특화 로직, 유연성 높음

**고려사항:**
- Phase 2 Supabase Auth 와 일관된 인증 패턴
- 사용자별 템플릿 소유권 관리 필요
- 실시간 미리보기와의 연동 고려

---

### 3. Template Library UI
**질문:** 템플릿 라이브러리는 어떻게 표시할까요?

**Options:**
- **Grid with thumbnails** (권장) — 시각적 탐색에 적합, 썸네일 미리보기
- **List view** — 정보 밀도 높음, 검색/필터에 유리
- **Hybrid** — 둘 다 지원, 사용자 선택 가능

**고려사항:**
- Phase 1 TemplatePreview 컴포넌트 재사용 가능
- shadcn/ui Card 컴포넌트 활용
- 검색/필터/정렬 기능 필요 여부

---

### 4. Template Upload
**질문:** 사용자가 커스텀 템플릿을 추가하는 방법은?

**Options:**
- **JSON file upload** (권장) — 유연한 템플릿 정의 가능
- **Manual form** — 간단한 템플릿에 적합, UX 직관적
- **Import from URL** — 외부 템플릿 가져오기, 추가 개발 필요

**고려사항:**
- 템플릿 유효성 검사 (Phase 1 template-utils.ts 활용)
- JSON schema 검증 필요
- 보안: 사용자 업로드 템플릿 검증

---

## 논의 순서 권장

1. **Storage Strategy** — 저장소 결정이 API 설계에 영향
2. **Template CRUD API** — 저장소에 따른 엔드포인트 설계
3. **Template Library UI** — API 구조에 따른 UI 컴포넌트
4. **Template Upload** — 최종 기능, 다른 결정들에 의존

---

## 참고 자료

- `.planning/phases/03-template-management/03-CONTEXT.md` — 현재 컨텍스트
- `.planning/ROADMAP.md` — Phase 3 요구사항
- `.planning/STATE.md` — Phase 1 & 2 결정사항
- `src/lib/template-utils.ts` — 유틸리티 함수
- `src/types/template.ts` — 타입 정의

---

## 다음 단계

1. 위 4 가지 영역 순차적으로 논의
2. 각 결정사항 CONTEXT.md 에 기록
3. 논의 완료 후 `/gsd-plan-phase 03` 실행하여 계획 수립
