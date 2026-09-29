#!/usr/bin/env python3
"""Reads data.json and rewrites only the GENERATED block inside canvas.html.
Run after every edit to data.json:

    python build.py
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
DATA = HERE / "data.json"
CANVAS = HERE / "canvas.html"
BEGIN = "/* ===== BEGIN GENERATED"
END = "/* ===== END GENERATED"

# Every field any card layout reads. Keeping this explicit (rather than
# passing the whole object through) is what lets data.json carry fields a
# future edit might add without silently leaking into the printed page.
CHALLENGE_FIELDS = [
    "id", "level", "type", "start", "start_label", "sequence", "expected",
    "trace", "tolerance_deg", "prompt", "target", "allowed_gates",
    "optimal_length", "optimal_solutions", "template", "options", "valid",
    "tests", "explanation", "answers", "A", "B",
]


def slim(obj, fields):
    return {k: obj[k] for k in fields if k in obj and obj[k] not in ("", [], None)}


def main():
    doc = json.loads(DATA.read_text(encoding="utf-8"))
    meta = doc["meta"]
    challenges = [slim(c, CHALLENGE_FIELDS) for c in doc["challenges"]]
    # team_challenge stays in data.json as reference but isn't rendered onto
    # any sheet (there's no separate team page anymore), so it's left out of
    # the generated block rather than shipped as an unused JS constant.

    block = (
        "    /* ===== BEGIN GENERATED — do not edit by hand. Edit data.json, then run:\n"
        "           python build.py\n"
        "       ===================================================================== */\n"
        "    const META = " + json.dumps(meta, ensure_ascii=False, indent=2) + ";\n"
        "    const CHALLENGES = " + json.dumps(challenges, ensure_ascii=False, indent=2) + ";\n"
        "    /* ===== END GENERATED ===================================================== */"
    )

    html = CANVAS.read_text(encoding="utf-8")
    start = html.index(BEGIN)
    stop = html.index("*/", html.index(END)) + 2
    line_start = html.rfind("\n", 0, start) + 1
    html = html[:line_start] + block + html[stop:]
    CANVAS.write_text(html, encoding="utf-8", newline="\n")

    print(f"Built {len(challenges)} challenge cards from data.json into {CANVAS.name}.")
    levels = {}
    for c in challenges:
        levels[c["level"]] = levels.get(c["level"], 0) + 1
    for lvl in sorted(levels):
        print(f"  Level {lvl}: {levels[lvl]} cards")


if __name__ == "__main__":
    main()
