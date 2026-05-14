# Phase 19: Audio 필드 통합 — PLAN.md

**Goal**: 3개 템플릿에 audio 필드 추가하고 InvitationViewer에서 musicUrl prop과 연동 (기존 musicUrl 제거, 필드 기반 통합)

**Requirements**: AUDIO-01, AUDIO-02

**Success Criteria**:
1. ROMANTIC, CLASSIC, MODERN 템플릿 모두 audio 필드 (배경음악 URL) 포함
2. InvitationViewer에서 audio 필드 값을 musicUrl로 전달
3. 기존 musicUrl prop 제거 — 템플릿 필드 기반 통합
4. InvitationViewer에서 배경음악 재생/일시정지/볼륨 컨트롤 가능

---

## Gray Areas 결정사항 (discuss-phase 완료)

| 결정 | 선택 | 근거 |
|------|--------|------|
| Audio section 배치 | image-hero 직후 (order 1.5) | 배경음악은 초대장 로드 시점부터 재생되어야 함 |
| Audio 필드 구조 | 단일 `audioUrl` 필드 (text type) | MVP에서는 URL 입력만 필요. 고급 설정은 Phase 12에서 |
| InvitationViewer 연동 | `invitation.data.audioUrl` 읽기 | 기존 musicUrl 패턴과 동일. layout.musicUrl → data.audioUrl로 이동 |
| musicUrl prop 유지 | 유지 (fallback) | 기존 초대장 호환성. audioUrl 우선, musicUrl 폴백 |
| 볼륨 컨트롤 | 버튼에 슬라이더 추가 | 성공기준 "볼륨 컨트롤 가능" 충족. 단순 구현으로 토큰 절약 |

---

## 구현 계획

### Wave 1: 템플릿에 audioUrl 필드 추가

**파일**: `.planning/phases/19/templates-audio-field.sql` (또는 직접 TypeScript 수정)

**작업**:
1. ROMANTIC, CLASSIC, MODERN 템플릿 정의에 `audioUrl` 필드 추가
2. 필드 타입: `text`, label: "배경음악 URL", required: false
3. 기존 `musicUrl` 필드가 있으면 제거 (기존 데이터는 migration으로 처리)

**변경 예상 파일**:
- `src/data/templates/*.json` 또는 템플릿 seed 데이터
- Supabase templates 테이블의 기존 템플릿 데이터 (migration)

**검증 방법**:
- 템플릿 API 응답에 `audioUrl` 필드 포함 확인
- InvitationEditor에서 audioUrl 필드 렌더링 확인

### Wave 2: InvitationViewer audioUrl 연동

**파일**: `src/components/publish/InvitationViewer.tsx`

**현재 코드** (line 216):
```ts
const musicUrl = (layout as Record<string, string>).musicUrl || (invitation.data as Record<string, string>).musicUrl;
```

**변경 내용**:
1. `musicUrl` → `audioUrl`로 변경
2. fallback 순서: `invitation.data.audioUrl` → `layout.musicUrl` (기존 호환성)
3. 변수명 변경: `musicUrl` → `audioUrl`

**변경 예상 코드**:
```ts
const audioUrl = (invitation.data as Record<string, string>).audioUrl
  || (layout as Record<string, string>).musicUrl; // fallback for backward compat
```

**검증 방법**:
- audioUrl가 있는 초대장에서 배경음악 재생 확인
- audioUrl 없이 musicUrl만 있는 기존 초대장에서도 재생 확인 (fallback)

### Wave 3: 볼륨 컨트롤 추가

**파일**: `src/components/publish/InvitationViewer.tsx`

**현재 코드** (line 283-295):
```tsx
{musicUrl && (
  <div className="fixed top-4 right-4 z-50">
    <Button variant={isPlaying ? 'default' : 'outline'} size="sm" onClick={toggleMusic} ...>
      {isPlaying ? '🔊' : '🔇'}
    </Button>
  </div>
)}
```

**변경 내용**:
1. 볼륨 상태 (`volume`) 추가: `useState(0.5)`
2. 볼륨 슬라이더 추가: `<input type="range" min="0" max="1" step="0.1" ...>`
3. 오디오 요소에 `volume` 속성 바인딩
4. 재생/일시정지 + 볼륨 컨트롤을 하나의 컴포넌트로 통합

**변경 예상 코드**:
```tsx
const [volume, setVolume] = useState(0.5);

const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newVolume = parseFloat(e.target.value);
  setVolume(newVolume);
  if (audioRef.current) audioRef.current.volume = newVolume;
};

// audio 요소에 volume 속성 추가
<audio ref={audioRef} src={audioUrl} loop onPlay={...} onPause={...} volume={volume} />
```

**검증 방법**:
- 슬라이더로 볼륨 변경 시 실제 오디오 볼륨 변경 확인
- 0 (mute) 시 소리 꺼짐 확인
- 1 (max) 시 최대 볼륨 확인

---

## 변경 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/publish/InvitationViewer.tsx` | audioUrl 연동, 볼륨 컨트롤 추가 |
| `src/components/templates/editor/FieldEditor.tsx` | audioUrl 필드 편집기 (이미 audio type 지원 중) |
| `src/data/templates/*.json` 또는 seed | audioUrl 필드 추가 |
| `src/types/template.ts` | 변경 없음 (audio 타입 이미 정의됨) |

---

## 위험 요소 및 대응

| 위험 | 영향 | 대응 |
|------|------|------|
| 기존 초대장 musicUrl 데이터 | AUDIO-02 실패 | musicUrl을 fallback으로 유지 |
| 브라우저 자동 재생 정책 | AUDIO-04 실패 | 자동 재생 없이 사용자 상호작용 후 재생 (현재 코드와 동일) |
| 오디오 파일 형식 호환성 | 일부 환경에서 재생 실패 | mp3/wav/ogg 지원 (HTML5 audio 기본) |

---

## 검증 체크리스트

- [ ] AUDIO-01: ROMANTIC 템플릿에 audioUrl 필드 포함
- [ ] AUDIO-01: CLASSIC 템플릿에 audioUrl 필드 포함
- [ ] AUDIO-01: MODERN 템플릿에 audioUrl 필드 포함
- [ ] AUDIO-02: InvitationViewer에서 audioUrl 읽음
- [ ] AUDIO-02: musicUrl fallback 동작 확인
- [ ] AUDIO-04: 재생/일시정지 버튼 동작
- [ ] AUDIO-04: 볼륨 슬라이더 동작 (0~1 범위)
