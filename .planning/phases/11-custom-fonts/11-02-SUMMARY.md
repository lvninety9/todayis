---
phase: 11-custom-fonts
plan: 02
status: completed
completed_at: 2026-04-26
---

# Phase 11-02 Summary — Custom Font Upload

## Objective
사용자가 자신의 커스텀 폰트(.ttf, .otf, .woff, .woff2)를 업로드하고 템플릿에 적용할 수 있도록 구현.

## Implementation

### Task 1: `/api/fonts` 엔드포인트
- **파일**: `src/app/api/fonts/route.ts`
- **POST**: 폰트 파일 업로드 (Supabase Storage, 5MB limit, auth mandatory)
- **DELETE**: 폰트 파일 삭제 (URL 파라미터 기반)
- **특징**:
  - 파일 타입 검증 (.ttf, .otf, .woff, .woff2)
  - 파일명 자동 파생 (sanitize → Title Case)
  - fontName 오버라이드 지원
  - bucket 자동 생성

### Task 2: StyleEditor 연동
- **파일**: `src/components/templates/editor/StyleEditor.tsx`
- **변경 사항**:
  - `fontFamilyOptions`에 `custom` 옵션 추가
  - `customFonts` 상태 관리 (CustomFont[])
  - `handleFontUpload`: 업로드 핸들러 (5개 제한)
  - `handleRemoveFont`: 삭제 핸들러
  - `customFontName` 오버라이드 입력 필드
  - `fontFamily === 'custom'` 조건부 렌더링

### Task 3: InvitationViewer 적용
- **파일**: `src/components/publish/InvitationViewer.tsx`
- **변경 사항**:
  - `customFonts` 추출 (layout에서)
  - `useEffect`로 @font-face CSS document head 주입
  - CSS variable `--font-custom` 설정
  - `effectiveFontFamily` 계산 (custom 폰트 우선 적용)

## Key Decisions Implemented

| Decision | Implementation |
|----------|----------------|
| D-01 | Custom font metadata → `style.customFonts` (JSONB) |
| D-02 | Supabase Storage bucket `custom-fonts`, 5MB limit, public |
| D-03 | 템플릿당 최대 5개 폰트 (UI + API 검증) |
| D-04 | fontFamily 자동 파생 (파일명 → sanitize → title case) + text input override |
| D-05 | CSS font-family name = sanitized version |
| D-06 | StyleEditor에서 `fontFamily === 'custom'`일 때만 upload 섹션 표시 |
| D-07 | POST/DELETE API, auth mandatory (dev fallback 없음) |
| D-08 | 파일 타입 검증: `.ttf`, `.otf`, `.woff`, `.woff2`만 허용 |
| D-09 | StyleEditor에 `customFonts` 상태, `handleFontUpload`, `handleRemoveFont` |
| D-10 | 업로드한 폰트 URL → style config 저장 → onChange로 editor에 반영 |

## Success Criteria

- [x] StyleEditor에서 "커스텀 폰트" 선택 시 파일 업로드 섹션 표시됨
- [x] .ttf 파일 업로드 시 /api/fonts가 200 + { success, fontUrl, fontFamily } 반환
- [x] 업로드한 폰트가 최대 5개까지 저장되고 제거 버튼으로 삭제 가능
- [ ] 공개 초대장 페이지에서 업로드한 커스텀 폰트가 적용됨 (실제 테스트 필요)

## Files Modified

| File | Lines Added | Description |
|------|-------------|-------------|
| `src/app/api/fonts/route.ts` | 183 | POST/DELETE API endpoint |
| `src/components/templates/editor/StyleEditor.tsx` | 132 | Custom font upload UI + state |
| `src/components/publish/InvitationViewer.tsx` | 41 | Custom font CSS injection |

## Next Steps

1. Supabase Dashboard에서 `custom-fonts` bucket 생성 (또는 API auto-create 테스트)
2. 실제 브라우저에서 커스텀 폰트 업로드 → 적용 E2E 테스트
3. Phase 11 검증 (/gsd-verify 11-custom-fonts)

## Git Commit

- `b3b5120` feat(11-02): implement custom font upload API, StyleEditor UI, and InvitationViewer integration
