#!/usr/bin/env python3
"""
GSD Phase Validator & Auto-Updater
Phase 완료 후 검증 + 문서 자동 업데이트
"""

import os
import subprocess
import json
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(".")
PLANNING_DIR = PROJECT_ROOT / ".planning"
STATE_FILE = PLANNING_DIR / "STATE.md"
ROADMAP_FILE = PLANNING_DIR / "ROADMAP.md"


def get_phase_dirs():
    """Phase 디렉토리 목록 가져오기"""
    phases = []
    for d in (PLANNING_DIR / "phases").iterdir():
        if d.is_dir() and d.name[0].isdigit():
            phases.append(d)
    return sorted(phases)


def validate_phase_summary(phase_dir):
    """Phase의 SUMMARY.md 파일 검증"""
    phase_name = phase_dir.name
    
    # PLAN 파일들을 직접 찾기 (디렉토리가 아닌 파일)
    # 예: 10-01-PLAN.md, 10-02-PLAN.md 또는 01-template-engine-01-PLAN.md
    phase_prefix = phase_name.split("-")[0]  # "10" 또는 "01"
    plan_files = []
    
    for f in phase_dir.iterdir():
        if not f.is_file() or not f.name.endswith("-PLAN.md"):
            continue
        
        stem = f.stem  # 10-01-PLAN 또는 01-template-engine-01-PLAN
        
        # 1) 10-01-PLAN -> phase_prefix "10"과 일치
        if stem.startswith(phase_prefix + "-") and stem.split("-")[1].isdigit():
            plan_files.append(f)
            continue
        
        # 2) 01-template-engine-01-PLAN -> 첫 부분이 "01"과 일치
        if stem.split("-")[0] == phase_prefix:
            plan_files.append(f)
    
    results = {
        "phase": phase_name,
        "plans": [],
        "total_plans": len(plan_files),
        "completed": 0,
        "missing": []
    }
    
    for plan_file in plan_files:
        # 10-01-PLAN.md -> 10-01
        # 01-template-engine-01-PLAN.md -> 01-template-engine-01
        stem = plan_file.stem
        parts = stem.split("-")
        if len(parts) >= 2:
            # 첫 두 부분이 숫자면 (10-01), 그게.plan number
            if parts[0].isdigit() and parts[1].isdigit():
                plan_num = f"{parts[0]}-{parts[1]}"
            else:
                # 01-template-engine-01-PLAN -> 01-01
                # 첫 번째와 마지막 숫자 조합
                plan_num = f"{parts[0]}-{parts[-1]}"
        else:
            plan_num = stem
        summary_file = phase_dir / f"{plan_num}-SUMMARY.md"
        
        if summary_file.exists():
            results["completed"] += 1
            results["plans"].append({"plan": plan_num, "status": "complete"})
        else:
            results["missing"].append(plan_num)
            results["plans"].append({"plan": plan_num, "status": "missing"})
    
    return results


def check_git_commits(phase_num):
    """Git 커밋 확인"""
    try:
        result = subprocess.run(
            ["git", "log", "--oneline", "-30", "--format=%s"],
            capture_output=True, text=True, check=True
        )
        commits = result.stdout
        phase_commits = [c for c in commits.split('\n') if f"Phase {phase_num}" in c or f"phase{phase_num}" in c]
        return len(phase_commits)
    except:
        return 0


def validate_phase(phase_num):
    """Phase 검증 (단일)"""
    phase_dirs = get_phase_dirs()
    target_dir = None
    
    for d in phase_dirs:
        if f"{phase_num}" in d.name:
            target_dir = d
            break
    
    if not target_dir:
        return None
    
    result = validate_phase_summary(target_dir)
    result["commits"] = check_git_commits(phase_num)
    result["verified"] = result["completed"] > 0 and result["commits"] > 0
    
    return result


def validate_all_phases():
    """전체 Phase 검증"""
    print("=" * 60)
    print("📋 GSD Phase 검증")
    print("=" * 60)
    
    phase_dirs = get_phase_dirs()
    results = []
    
    for phase_dir in phase_dirs:
        phase_num = phase_dir.name.split("-")[0]
        result = validate_phase_summary(phase_dir)
        result["commits"] = check_git_commits(phase_num)
        result["verified"] = result["completed"] > 0 and result["commits"] > 0
        results.append(result)
        
        status = "✅" if result["verified"] else "❌"
        print(f"  {status} Phase {phase_num}: {result['completed']}/{result['total_plans']} plans, {result['commits']} commits")
    
    return results


def update_state_markdown(results):
    """STATE.md 업데이트"""
    if not STATE_FILE.exists():
        print("  ⚠️ STATE.md 없음")
        return
    
    content = STATE_FILE.read_text()
    
    # completed_phases 계산
    verified_count = sum(1 for r in results if r["verified"])
    
    # last_session 업데이트
    if verified_count > 0:
        content = content.replace(
            "last_session:",
            f"last_session: Phase 검증 완료 ({verified_count} phases verified),"
        )
    
    STATE_FILE.write_text(content)
    print(f"  ✓ STATE.md 업데이트 완료")


def update_roadmap_markdown(results):
    """ROADMAP.md 업데이트"""
    if not ROADMAP_FILE.exists():
        print("  ⚠️ ROADMAP.md 없음")
        return
    
    content = ROADMAP_FILE.read_text()
    
    # Phase별 Status 업데이트
    for result in results:
        phase_num = result["phase"].split("-")[0]
        phase_name = result["phase"]
        
        if result["verified"]:
            # Complete로 변경
            old_pattern = f"## Phase {int(phase_num):02d}:"
            new_pattern = f"## Phase {int(phase_num):02d}:"
            
            if f"Status: Complete" not in content:
                content = content.replace(
                    f"**Status**: In Progress",
                    f"**Status**: Complete (검증됨)"
                )
    
    ROADMAP_FILE.write_text(content)
    print(f"  ✓ ROADMAP.md 업데이트 완료")


def generate_report(results):
    """검증 리포트 생성"""
    print("\n" + "=" * 60)
    print("📊 검증 결과 요약")
    print("=" * 60)
    
    verified = [r for r in results if r["verified"]]
    unverified = [r for r in results if not r["verified"]]
    
    print(f"  ✅ 검증 통과: {len(verified)} phases")
    print(f"  ❌ 검증 실패: {len(unverified)} phases")
    
    if unverified:
        print("\n  미완료 Phase:")
        for r in unverified:
            print(f"    - Phase {r['phase']}: {r['missing']}")
    
    return len(verified) > 0


def main():
    """메인 실행"""
    print("\n🔍 GSD Phase Validator & Auto-Updater")
    print("=" * 60)
    
    # 1. 전체 Phase 검증
    results = validate_all_phases()
    
    # 2. 검증 통과 Phase만 문서 업데이트
    if results:
        update_state_markdown(results)
        update_roadmap_markdown(results)
    
    # 3. 리포트 생성
    generate_report(results)
    
    print("\n" + "=" * 60)
    print("✅ 검증 완료")
    print("=" * 60)


if __name__ == "__main__":
    main()