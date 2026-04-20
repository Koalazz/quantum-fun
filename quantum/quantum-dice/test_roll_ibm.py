#!/usr/bin/env python3
"""
End-to-end test for roll_ibm.py against real IBM Quantum hardware.
Validates: no stderr, correct event sequence, valid face result (1-6).
"""
import json
import os
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
# Honour QUANTUM_DICE_PYTHON so the test works on the server (venv outside project)
PYTHON = os.environ.get("QUANTUM_DICE_PYTHON") or str(SCRIPT_DIR / ".venv" / "bin" / "python")
ROLL_SCRIPT = str(SCRIPT_DIR / "roll_ibm.py")
MAX_ATTEMPTS = 3
TIMEOUT_SECS = 1320  # 22 minutes


def run_once() -> tuple[bool, str, list[dict]]:
    """Run roll_ibm.py once. Returns (success, reason, events_list)."""
    api_key = os.environ.get("IBM_QUANTUM_API_KEY", "")
    if not api_key:
        return False, "IBM_QUANTUM_API_KEY not set", []

    env = {**os.environ, "IBM_QUANTUM_API_KEY": api_key}

    try:
        proc = subprocess.run(
            [PYTHON, ROLL_SCRIPT],
            capture_output=True,
            text=True,
            env=env,
            timeout=TIMEOUT_SECS,
        )
    except subprocess.TimeoutExpired:
        return False, f"Timed out after {TIMEOUT_SECS // 60} minutes", []

    # ── Parse stdout events ────────────────────────────────────────────────
    events: list[dict] = []
    for line in proc.stdout.strip().splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        try:
            events.append(json.loads(stripped))
        except json.JSONDecodeError:
            return False, f"Non-JSON stdout line: {stripped[:120]!r}", events

    # ── No stderr allowed ──────────────────────────────────────────────────
    if proc.stderr.strip():
        return False, f"Unexpected stderr:\n{proc.stderr.strip()[:400]}", events

    # ── Must have events ───────────────────────────────────────────────────
    if not events:
        return False, "Script produced no output", events

    # ── Last event must be 'result' ────────────────────────────────────────
    last = events[-1]
    if last.get("status") == "error":
        return False, f"Script emitted error: {last.get('message', '?')}", events
    if last.get("status") != "result":
        return False, f"Last event status was {last.get('status')!r}, expected 'result'", events

    # ── Face must be 1–6 ──────────────────────────────────────────────────
    face = last.get("face")
    if not isinstance(face, int) or not (1 <= face <= 6):
        return False, f"Invalid face value: {face!r}", events

    backend = last.get("backend", "unknown")
    return True, f"Rolled face {face} on {backend}", events


def print_events(events: list[dict]) -> None:
    for ev in events:
        status = ev.get("status", "?")
        msg = ev.get("message", "")[:90]
        print(f"  [{status:12s}] {msg}")


def main() -> None:
    # Resolve API key from .env.local if not already in environment
    if not os.environ.get("IBM_QUANTUM_API_KEY"):
        env_file = SCRIPT_DIR.parent.parent / ".env.local"
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                if line.startswith("IBM_QUANTUM_API_KEY="):
                    os.environ["IBM_QUANTUM_API_KEY"] = line.split("=", 1)[1].strip()
                    break

    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n{'='*55}")
        print(f"  Attempt {attempt}/{MAX_ATTEMPTS}")
        print("="*55)

        ok, reason, events = run_once()

        print(f"  Events received: {len(events)}")
        print_events(events)

        if ok:
            print(f"\n✓ PASS — {reason}")
            sys.exit(0)
        else:
            print(f"\n✗ FAIL — {reason}")
            if attempt < MAX_ATTEMPTS:
                print("  Retrying…\n")

    print(f"\nAll {MAX_ATTEMPTS} attempts failed.")
    sys.exit(1)


if __name__ == "__main__":
    main()
