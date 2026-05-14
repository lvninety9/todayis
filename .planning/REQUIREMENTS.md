# REQUIREMENTS.md - Todayis Wedding Invitation Platform

## Milestone v2.0: 템플릿 필드 확장 (Video, Audio & Dress Code)

### VIDEO — 웨딩 영상 링크

- [ ] **VIDEO-01**: 3개 템플릿(ROMANTIC, CLASSIC, MODERN)에 video 필드 추가 (웨딩 영상 링크)
- [ ] **VIDEO-02**: InvitationViewer에서 video 필드 렌더링 (video player, controls, animation)

### AUDIO — 배경음악 필드 통합

- [ ] **AUDIO-01**: 3개 템플릿에 audio 필드 추가 (배경음악 URL)
- [ ] **AUDIO-02**: InvitationViewer에서 audio 필드를 musicUrl prop과 연동 (기존 musicUrl 제거, 필드 기반 통합)

### DRESSCODE — 드레스코드

- [ ] **DRESSCODE-01**: 3개 템플릿에 dresscode 필드 추가
- [ ] **DRESSCODE-02**: InvitationViewer에서 dresscode styled badge 렌더링 (sage-100 배경, rounded-full)

### TEMPLATE ENGINE — 애니메이션 지원

- [ ] **TEMPLATE-ENGINE-01**: TemplateEngine에서 video/audio 섹션에 animation 지원 (fade-in, scale-up)

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VIDEO-01 | Phase 18 | Planned |
| VIDEO-02 | Phase 22 | Planned |
| AUDIO-01 | Phase 19 | Planned |
| AUDIO-02 | Phase 19 | Planned |
| DRESSCODE-01 | Phase 20 | Planned |
| DRESSCODE-02 | Phase 20 | Planned |
| TEMPLATE-ENGINE-01 | Phase 21 | Planned |

**Coverage**: 7/7 requirements mapped ✓

---

## Future Requirements (Deferred)

- **CONTRIBUTION-01**: 축의도/축하금 전용 필드 (contribution type) — message와 구분
- **FIELD-09**: 계좌번호 마스킹 처리 옵션
- **FIELD-10**: Gallery 사진 순서 드래그 앤 드롭

## Out of Scope

- **Naver Selling Page 직접 연동** — 외부 링크 리다이렉트 방식으로 대체 (Phase 5 결정)
- **동영상 초대장 전체** — mp4 기반 초대장 대신 video 링크만 지원 (V3로 미루기)
- **Kakao 로그인** — Google/GitHub/Email만 지원 (V3로 미루기)

---

*REQ-ID format: [CATEGORY]-[NUMBER]*
*Milestone: v2.0 — 7 requirements, 0 deferred, 3 out of scope*
