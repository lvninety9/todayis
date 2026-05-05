# 새 세션 시작 프롬프트 — 템플릿 현실화 (Phase 17 추가 작업)

---

## 프롬프트 복사 후 새 세션에 붙여넣기

```
## 프로젝트 개요

Todayis — 웨딩 초대장 제작 플랫폼 (Next.js 14, App Router, shadcn/ui, Supabase)
- Framework: Next.js 14 (App Router)
- UI: shadcn/ui + Tailwind CSS v4
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth (Google, GitHub, Email)
- Payment: Toss Payments

## 현재 상태

- Phase 01~17 완료 (템플릿 엔진 → 인증 → 템플릿관리 → 프로필 → 결제 → 공개 → 테스트 → 리디자인 → 템플릿시스템 전면개편)
- GSD Workflow Slimming: Wave 1~8 모두 완료
- 빌드: 통과 ✅
- 컨텍스트 여유: 45%

## ⚠️ 긴급 작업: 템플릿 현실화 (Phase 17 추가 작업)

사용자가 템플릿이 너무 단순하고 비현실적이라고 불만. mcard.fromtoday.co.kr 수준의 현실적인 한국 결혼 초대장이 필요.

### 현재 템플릿 문제점

1. **실제 이미지 없음**: heroImage defaultValue가 null → 플레이스홀더 이모지만 표시
2. **메시지 너무 짧음**: "소중한 분들에게 이 기쁨을 나누고 싶습니다.\n바쁘시더라도 꼭 참석해 주시길 바랍니다." → 한 줄
3. **부모님 성함 없음**: groomParents/brideParents 필드가 sample.ts에 없음
4. **축의금 계좌 없음**: groomAccount/groomBank/groomHolder 필드가 sample.ts에 없음 (현재 groomPhone/bridePhone만 있음)
5. **갤러리 섹션 없음**: image → announcement → invitation → map → accounts (5개) / gallery 섹션 누락

### ✅ 이미 구현된 렌더러 (TemplateEngine.tsx)

TemplateEngine.tsx에는 이미 모든 Section 렌더러가 구현되어 있음 — 수정 불필요:

- **GallerySection** (line 467~513): image1~image6 필드 읽어서 2x3 그리드 렌더링
- **StorySection** (line 515~545): story1~3 필드 읽어서 타임라인 렌더링
- **MapSection** (line 293~379): Google Maps iframe 임베드 + 네이버 지도 + 네비게이션 링크
- **AccountsSection** (line 384~465): groomAccount/groomBank/groomHolder + brideAccount/brideBank/brideHolder 렌더링
- **InvitationSection** (line 203~291): groomParents/brideParents 필드 읽어서 부모님 성함 표시

### ✅ 이미 구현된 필드 에디터 (FieldEditor.tsx)

FieldEditor.tsx에 이미 모든 필드 타입 에디터가 구현되어 있음 — 수정 불필요:

- **account 타입** (line 140~189): `bank|accountNumber|holder` 형식 (은행 드롭다운 + 계좌번호 + 예금주)
- **parents 타입** (line 297~350): `father|mother` 형식 (신랑父 + 신랑母 + 신부父 + 신부母)

### 🎯 필요한 템플릿 구조 (6섹션)

1. **image** — 헤드라인 이미지 (Unsplash 실제 결혼 사진), 타이틀
2. **announcement** — "결혼합니다", 신랑&신부, 날짜 (한국어 포맷), 시간, 장소
3. **invitation** — 부모님 성함, 긴 초대 메시지, 드레스코드
4. **map** — 오시는 길 (Google Maps 임베드, 네이버 지도 링크, 네비게이션)
5. **gallery** — 우리 이야기 (커플 사진 6장, 2x3 그리드)
6. **accounts** — 축의금 계좌 (신랑측/신부측) + 문의 연락처 (신랑/신부/플래너)

---

## 작업 목록

### 1. sample.ts 수정 (ROMANTIC_TEMPLATE, CLASSIC_TEMPLATE, MODERN_TEMPLATE)

**수정 대상 파일**: `src/data/templates/sample.ts` (900 lines)

각 템플릿에 다음 4가지 변경사항 적용:

#### 변경 1: heroImage에 Unsplash 실제 결혼 사진 URL 설정

```typescript
// BEFORE
{ name: 'heroImage', type: 'image', label: '헤드라인 이미지', defaultValue: null }

// AFTER — 템플릿별로 다른 Unsplash 이미지
// ROMANTIC: soft romantic wedding photo
{ name: 'heroImage', type: 'image', label: '헤드라인 이미지', defaultValue: 'https://images.unsplash.com/photo-1519741497674-611481862559?w=800&q=80' }

// CLASSIC: elegant wedding couple
{ name: 'heroImage', type: 'image', label: '헤드라인 이미지', defaultValue: 'https://images.unsplash.com/photo-1511285560982-1351c4f88e5d?w=800&q=80' }

// MODERN: modern wedding couple
{ name: 'heroImage', type: 'image', label: '헤드라인 이미지', defaultValue: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?w=800&q=80' }
```

#### 변경 2: invitation 섹션에 parents 필드 + 긴 메시지 추가

```typescript
// BEFORE (invitation 섹션 fields)
fields: [
  { name: 'message', type: 'message', label: '초대 메시지', defaultValue: '소중한 분들에게 이 기쁨을 나누고 싶습니다.\n바쁘시더라도 꼭 참석해 주시길 바랍니다.' },
  { name: 'dressCode', type: 'text', label: '드레스 코드', defaultValue: 'White or Neutral tones' },
]

// AFTER
fields: [
  { name: 'groomParents', type: 'text', label: '신랑측 부모님', defaultValue: '김병수·이정희' },
  { name: 'brideParents', type: 'text', label: '신부측 부모님', defaultValue: '박용석·최영애' },
  { name: 'message', type: 'message', label: '초대 메시지', defaultValue: '장기간에 걸친 교제 끝에 드디어 우리의 사랑이 결실을 맺게 되었습니다.\n\n두 사람이 만나 한 가정이 되는 이 기쁜 순간에, 소중하신 분들의 따뜻한 축하와 격려를 받고 싶습니다.\n\n바쁘시더라도 꼭 참석해 주시길 간곡히 부탁드립니다.\n\n감사합니다.' },
  { name: 'dressCode', type: 'text', label: '드레스 코드', defaultValue: 'White or Neutral tones' },
]
```

> CLASSIC/MODERN도 동일한 구조로, 다른 이름/메시지 사용

#### 변경 3: accounts 섹션에 계좌 정보 추가

```typescript
// BEFORE (accounts 섹션 fields)
fields: [
  { name: 'groomPhone', type: 'account', label: '신랑 연락처', defaultValue: '010-1234-5678' },
  { name: 'bridePhone', type: 'account', label: '신부 연락처', defaultValue: '010-8765-4321' },
  { name: 'plannerName', type: 'text', label: '플래너 이름', defaultValue: '김플래너' },
  { name: 'plannerPhone', type: 'account', label: '플래너 연락처', defaultValue: '02-1234-5678' },
]

// AFTER — 계좌 필드 추가 (account 타입은 bank|accountNumber|holder 형식)
fields: [
  { name: 'groomBank', type: 'text', label: '신랑측 은행', defaultValue: 'KB 국민은행' },
  { name: 'groomAccount', type: 'text', label: '신랑측 계좌번호', defaultValue: '1234567890123' },
  { name: 'groomHolder', type: 'text', label: '신랑측 예금주', defaultValue: '김병수' },
  { name: 'brideBank', type: 'text', label: '신부측 은행', defaultValue: 'SH 신한은행' },
  { name: 'brideAccount', type: 'text', label: '신부측 계좌번호', defaultValue: '9876543210987' },
  { name: 'brideHolder', type: 'text', label: '신부측 예금주', defaultValue: '박용석' },
  { name: 'groomPhone', type: 'text', label: '신랑 연락처', defaultValue: '010-1234-5678' },
  { name: 'bridePhone', type: 'text', label: '신부 연락처', defaultValue: '010-8765-4321' },
  { name: 'plannerName', type: 'text', label: '플래너 이름', defaultValue: '김플래너' },
  { name: 'plannerPhone', type: 'text', label: '플래너 연락처', defaultValue: '02-1234-5678' },
]
```

> ⚠️ 기존 `groomPhone`/`bridePhone`의 type이 `account`였으나, TemplateEngine.tsx는 단순 text로 읽음. type을 `text`로 변경.

#### 변경 4: gallery 섹션 추가 (order 5, accounts는 order 6으로 변경)

```typescript
// accounts 섹션의 order: 5 → 6으로 변경

// accounts 섹션 앞에 gallery 섹션 추가
{
  id: 'gallery-romantic', // 또는 gallery-classic, gallery-modern
  type: 'gallery',
  order: 5,
  label: '우리 이야기',
  fields: [
    { name: 'galleryTitle', type: 'text', label: '갤러리 제목', defaultValue: '우리 이야기' },
    { name: 'image1', type: 'image', label: '사진 1', defaultValue: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
    { name: 'image2', type: 'image', label: '사진 2', defaultValue: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?w=600&q=80' },
    { name: 'image3', type: 'image', label: '사진 3', defaultValue: 'https://images.unsplash.com/photo-1465495976279-936771668826?w=600&q=80' },
    { name: 'image4', type: 'image', label: '사진 4', defaultValue: 'https://images.unsplash.com/photo-1510076277700-a5762a3f7848?w=600&q=80' },
    { name: 'image5', type: 'image', label: '사진 5', defaultValue: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
    { name: 'image6', type: 'image', label: '사진 6', defaultValue: 'https://images.unsplash.com/photo-1515934751675-0a2fc4a48e3?w=600&q=80' },
  ],
  style: {
    animation: 'slide-up',
    animationDuration: 600,
    animationDelay: 900,
    backgroundColor: '#FFFFFF',
    textColor: '#2D2D2D',
    accentColor: '#C48B7F', // 템플릿별 accentColor
    fontFamily: 'Noto Serif KR', // 템플릿별 fontFamily
    fontSize: 'base',
  },
},
```

> CLASSIC/MODERN도 동일한 구조로, 서로 다른 Unsplash 이미지 URL 사용

### 2. TemplateEngine.tsx 검증 (수정 불필요 — 확인만)

이미 구현됨. 확인 후 문제 없으면 무시:
- GallerySection: image1-6 필드 읽어서 2x3 그리드 렌더링 ✅
- AccountsSection: groomAccount/groomBank/groomHolder 렌더링 ✅
- InvitationSection: groomParents/brideParents 렌더링 ✅
- MapSection: Google Maps iframe 임베드 ✅

### 3. 빌드 테스트

```bash
npx tsc --noEmit
npm run build
```

---

## 핵심 파일

| 파일 | 설명 | 작업 |
|------|------|------|
| `src/data/templates/sample.ts` | ROMANTIC/CLASSIC/MODERN 템플릿 (900 lines) | **수정 필요** |
| `src/components/templates/engine/TemplateEngine.tsx` | Section 렌더러 (608 lines) | 검증만 (이미 구현됨) |
| `src/components/templates/editor/FieldEditor.tsx` | 필드 에디터 (589 lines) | 검증만 (이미 구현됨) |
| `src/types/template.ts` | 타입 정의 (157 lines) | 변경 없음 |

---

## 참고: TemplateEngine.tsx 필드 매핑

### InvitationSection이 읽는 필드
```typescript
const message = data.getValue('message') || data.getValue('invitationMessage') || '';
const dressCode = data.getValue('dressCode') || '';
const groomParents = data.getValue('groomParents') || '';
const brideParents = data.getValue('brideParents') || '';
```

### AccountsSection이 읽는 필드
```typescript
const groomAccount = data.getValue('groomAccount') || '';
const groomBank = data.getValue('groomBank') || '';
const groomHolder = data.getValue('groomHolder') || '';
const brideAccount = data.getValue('brideAccount') || '';
const brideBank = data.getValue('brideBank') || '';
const brideHolder = data.getValue('brideHolder') || '';
const groomPhone = data.getValue('groomPhone') || '';
const bridePhone = data.getValue('bridePhone') || '';
```

### GallerySection이 읽는 필드
```typescript
const image1 = data.getValue('image1') || '';
const image2 = data.getValue('image2') || '';
const image3 = data.getValue('image3') || '';
const image4 = data.getValue('image4') || '';
const image5 = data.getValue('image5') || '';
const image6 = data.getValue('image6') || '';
```

---

## 시작 명령어

```bash
# 1. 먼저 현재 상태 확인
wc -l src/data/templates/sample.ts

# 2. ROMANTIC_TEMPLATE 수정 (heroImage + parents + message + gallery + accounts)
# 3. CLASSIC_TEMPLATE 수정
# 4. MODERN_TEMPLATE 수정
# 5. accounts 섹션 order: 5 → 6으로 변경 (3개 템플릿 모두)
# 6. 빌드 테스트
npx tsc --noEmit && npm run build
```

---

## 대안: 직접 /gsd 명령어 입력

```bash
# Phase 18 논의 (V2 기능)
/gsd-discuss-phase

# 또는 템플릿 현실화 작업 직접 시작
```
