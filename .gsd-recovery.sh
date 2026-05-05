#!/bin/bash
# GSD Recovery Script
# 토큰 한도 초과 후 컨텍스트 복원

PROJECT_ROOT="${1:-/media/jay/D/cursor/todayis}"
PHASE_DIR=".planning/phases"

echo "=== GSD Recovery ==="

# 1. 마지막으로 진행하던 Phase 찾기
if [ -f "$PROJECT_ROOT/.planning/STATE.md" ]; then
    CURRENT=$(grep "Phase:" "$PROJECT_ROOT/.planning/STATE.md" | tail -1 | sed 's/.*Phase: //' | sed 's/ .*//')
    echo "Last phase: $CURRENT"
fi

# 2. 마지막 체크포인트 찾기
LATEST_CHECKPOINT=$(find "$PROJECT_ROOT/$PHASE_DIR" -name "*-DISCUSS-CHECKPOINT.json" -type f 2>/dev/null | sort -r | head -1)
if [ -n "$LATEST_CHECKPOINT" ]; then
    echo "Found checkpoint: $LATEST_CHECKPOINT"
    cat "$LATEST_CHECKPOINT"
fi

# 3. 마지막 plan/incomplete 찾기
LATEST_INCOMPLETE=$(find "$PROJECT_ROOT/$PHASE_DIR" -name "*.md" -newer "$PROJECT_ROOT/.planning/STATE.md" -type f 2>/dev/null | head -5)
if [ -n "$LATEST_INCOMPLETE" ]; then
    echo "--- Recent files ---"
    ls -la $LATEST_INCOMPLETE
fi

echo "=== Recovery Info Ready ==="
echo "이 정보를 기반으로 작업을 이어받을 수 있습니다."