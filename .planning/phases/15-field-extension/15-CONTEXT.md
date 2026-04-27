# Phase 15: 템플릿 필드 확장 (V2) - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

템플릿 필드 타입 확장 - 현재 4개(text, date, image, location)에서 계좌번호, 배경음악, GIF, 동영상, 갤러리, 축의도 메시지, Dress Code, 부모님 성함 등을 추가한다. 편집기와 공개 초대장 뷰어 모두에서 새 필드 타입을 지원한다.

</domain>

<decisions>
## Implementation Decisions

### 새 필드 타입 추가 우선순위
- **D-01:** 계좌번호 (account) — 은행명 + 계좌번호 + 예금주 형태
- **D-02:** 배경 음악 (audio) — MP3/OGG/WAV URL
- **D-03:** 축의도 메시지 (message) — 긴 텍스트 (축하 메시지)
- **D-04:** Dress Code (dresscode) —服装 要求
- **D-05:** 부모님 성함 (parents) — 신랑父/母, 신부父/母 별도 필드
- **D-06:** GIF 지원 (기존 image 타입에서 GIF도 렌더링하도록 확장)
- **D-07:** 동영상 (video) — MP4 URL
- **D-08:** 갤러리 (gallery) — 여러 이미지 URL 배열

### FieldType 정의
- **D-09:** `FieldType` 유니언 타입 확장: `'text' | 'date' | 'image' | 'location' | 'account' | 'audio' | 'video' | 'gallery' | 'message' | 'dresscode' | 'parents'`

### 편집기 구현 방식
- **D-10:** 각 필드 타입별 FieldEditor 컴포넌트 분기 처리 (switch case)
- **D-11:** audio: URL input + Audio player preview
- **D-12:** video: URL input + Video player preview
- **D-13:** gallery: 다중 이미지 URL input (쉼표 구분 또는 배열)
- **D-14:** account: 은행명 선택 + 계좌번호 input + 예금주 input
- **D-15:** parents: 신랑父/母, 신부父/母 별도 입력 필드 그룹
- **D-16:** message: textarea (여러 줄 입력)
- **D-17:** dresscode: text input + DressCodeBadge 컴포넌트 표시

### 공개 초대장 렌더링
- **D-18:** InvitationViewer에서 새 필드 타입 렌더링 로직 추가
- **D-19:** audio: Audio player 컴포넌트 (재생/일시정지/볼륨)
- **D-20:** video: Video player (muted autoplay 옵션)
- **D-21:** gallery: 이미지 그리드 슬라이더
- **D-22:** account: 계좌번호 복사 버튼 포함 카드
- **D-23:** parents: 부모님 성함 별도 섹션
- **D-24:** dresscode: DressCodeBadge 표시

### the agent's Discretion
- Audio player 정확한 디자인 (테마와 일치하는 스타일)
- Gallery 슬라이더 구현 방식 ( Swiper vs custom )
- Video playerコントロール (재생/정지/음소거)
- 계좌번호 표시 포맷 (마스킹 처리 선택)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 기존 타입 정의
- `src/types/template.ts` — FieldType, TemplateField, TemplateData 인터페이스
- `src/components/templates/editor/FieldEditor.tsx` — 필드 에디터 구현 (lines 44-138: switch case로 타입별 렌더링)

### Phase 14 CONTEXT (이전 결정 사항)
- `.planning/phases/14-ux/14-CONTEXT.md` — Phase 14에서 필드 확장을 Phase 15로 미룬 결정 포함
- Warm palette (terracotta/sage/blush) 계속 적용
- 2026 디자인 트렌드 (Bento Grid, Micro-interactions) 참조 가능

### Phase 13 Design System
- `.planning/phases/13-design-system/13-CONTEXT.md` — 디자인 시스템 전체 결정

### 코드베이스
- `src/components/templates/engine/TemplateEngine.tsx` — 템플릿 렌더링 엔진
- `src/components/publish/InvitationViewer.tsx` — 공개 초대장 뷰어 (필드 값 렌더링)
- `src/components/templates/editor/StyleEditor.tsx` — 스타일 편집기 (참고용)
- `src/lib/fonts.ts` — 폰트 유틸리티 (커스텀 업로드 로직 참고)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/template.ts` — `FieldType` 정의 (4개 타입), `TemplateField` 인터페이스
- `src/components/templates/editor/FieldEditor.tsx` — switch-case로 필드 타입별 렌더링 (text, date, image, location)
- `src/components/templates/preview/TemplatePreview.tsx` — 미리보기 컴포넌트
- `src/components/publish/InvitationViewer.tsx` — 공개 초대장 뷰어
- `src/app/api/fonts/route.ts` — 파일 업로드 API ( audio/video/gallery 파일 업로드 시 재사용 가능)
- `src/lib/supabase/storage.ts` — Supabase Storage 유틸리티

### Established Patterns
- FieldEditor: switch (field.type) で	case ごとに異なる input コンポーネントをレンダリング
- TemplateField: { name, type, label, required, defaultValue }
- StyleEditor: 폰트 업로드 + 적용 (Phase 11) — 파일 업로드 패턴 참고

### Integration Points
- `src/types/template.ts` — FieldType 유니언 타입 확장 필요
- `src/components/templates/editor/FieldEditor.tsx` — case 추가
- `src/components/publish/InvitationViewer.tsx` — 새 필드 타입 렌더링
- `src/app/api/` — audio/video/gallery 파일 업로드 API (신규 또는 기존 확장)

</code_context>

<specifics>
## Specific Ideas

**Phase 14에서 미룬 작업 (UX-04):**
- 계좌번호 필드 (무엇을 기준으로 송금?)
- 배경 음악 URL (mp3/ogg/wav)
- GIF/애니메이션 이미지 (GIF)
- 동영상 URL (mp4)
- 갤러리 (여러 이미지)
- 축의도 메시지
- Dress Code
- 부모님 성함 (신랑/신부 父모)

**편집기 UI:**
- audio: URL 입력 + Audio player로 미리보기
- account: 은행명 Select + 계좌번호 Input + 예금주 Input
- parents: "신랑父", "신랑母", "신부父", "신부母" 4개 필드 그룹
- gallery: 쉼표로 구분된 이미지 URL 목록

**공개 초대장:**
- audio: 배경 음악 플레이어 (자동 재생 옵션, 사용자 조작 가능)
- account: "계좌번호 복사" 버튼 포함
- parents: 별도 섹션으로 렌더링

</specifics>

<deferred>
## Deferred Ideas

**Phase 15 범위 밖:**
- 음악 자동 재생 정책 (브라우저 별 차단 정책)
- Video player fullscreen 기능
- Gallery 사진 순서 드래그 앤 드롭
- 초대장 공유 시 미디어 파일 포함 방식

</deferred>

---

*Phase: 15-field-extension*
*Context gathered: 2026-04-27*