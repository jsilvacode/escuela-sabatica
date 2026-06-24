#!/usr/bin/env python3
"""Regenerate contentMarkdown from Adventech source, keeping Spanish metadata."""
from __future__ import annotations
import json, re, sys, time, urllib.request

BASE = "https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/en/2026-03"
JSON_PATH = "src/data/quarters/2026-q3.json"

def fetch(url: str) -> str:
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read().decode("utf-8")
        except Exception:
            if attempt < 4:
                time.sleep(2)
                print(f"     retry {attempt+2}/5...", file=sys.stderr)
    raise Exception(f"Failed after 5 retries: {url}")

def parse_fm(text: str) -> tuple[dict, str]:
    if not text.startswith("---"): return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3: return {}, text
    data = {}
    for line in parts[1].strip().split("\n"):
        line = line.strip()
        if ":" in line and not line.startswith("#"):
            k, _, v = line.partition(":")
            data[k.strip()] = v.strip().strip('"').strip("'")
    return data, parts[2].strip()

with open(JSON_PATH, encoding="utf-8") as f:
    q = json.load(f)

updated = 0
errors = 0

# Regenerate contentMarkdown for all 91 days
for n in range(1, 14):
    padded = f"{n:02d}"
    lesson = q["lessons"][n - 1]
    lesson_title = lesson["title"]
    
    # Fetch Saturday (01.md) to get studyReferences + keyVerse
    try:
        print(f"Lesson {n}/13: {lesson_title}")
        sat_text = fetch(f"{BASE}/{padded}/01.md")
        _, sat_body = parse_fm(sat_text)
        
        # Replace Saturday content
        day1 = lesson["days"][0]
        old = len(day1.get("contentMarkdown", ""))
        day1["contentMarkdown"] = sat_body.strip()
        if old != len(sat_body.strip()):
            updated += 1
            print(f"  day 1 updated ({old} → {len(sat_body)})")

        # Re-parse study references
        ref_match = re.search(r"### Read for This Week.+?Study\n+(.+?)(?:\n>|\n\n)", sat_body)
        if ref_match:
            refs = []
            parts = re.split(r"[;,]\s*", ref_match.group(1).strip().rstrip("."))
            for part in parts:
                part = part.strip().rstrip(".")
                if part and len(part) > 2:
                    refs.append(part)
            if refs:
                day1["studyReferences"] = [{"book": r, "chapter": 0, "verseStart": 0, "display": r} for r in refs]

        # Re-parse key verse (memory text)
        mv_match = re.search(
            r">\s*(?:<p>)?\s*Memory Text[:\s]*</?p?>\s*(.+?)\(([^)]+)\)",
            sat_body, re.DOTALL | re.IGNORECASE
        )
        if mv_match:
            verse_text = re.sub(r"<[^>]+>", "", mv_match.group(1)).strip().strip('"').strip("'")
            ref_str = mv_match.group(2).strip().split(",")[0].strip()
            ref_str = re.sub(r",?\s*(NRSV|NIV|NKJV|KJV|ESV|NASB)\s*$", "", ref_str).strip()
            day1["keyVerse"] = {"reference": {"book": "", "chapter": 0, "verseStart": 0, "display": ref_str}, "text": verse_text}
            if lesson.get("keyVerse") is None:
                lesson["keyVerse"] = day1["keyVerse"]
        
        # Days 2-7
        for day_idx in range(2, 8):
            day_es = lesson["days"][day_idx - 1]
            try:
                day_text = fetch(f"{BASE}/{padded}/{day_idx:02d}.md")
                _, body = parse_fm(day_text)
                old = len(day_es.get("contentMarkdown", ""))
                day_es["contentMarkdown"] = body.strip()
                if abs(old - len(body.strip())) > 10:
                    updated += 1
                    print(f"  day {day_idx} updated ({old} → {len(body)})")
            except Exception as e:
                errors += 1
                print(f"  ERROR day {day_idx}: {e}")
        
        # EGW notes from all days
        egw_parts = []
        for day_idx in range(1, 8):
            try:
                day_text = fetch(f"{BASE}/{padded}/{day_idx:02d}.md")
                egw_match = re.search(
                    r"#### Additional Reading: Selected Quotes from Ellen G\. White\s*\n(.*?)(?:\n---|\Z)",
                    day_text, re.DOTALL
                )
                if egw_match:
                    egw = re.sub(r"\\\n", " ", egw_match.group(1).strip())
                    egw_parts.append(egw[:600])
            except:
                pass
        if egw_parts:
            combined = " ".join(egw_parts)
            lesson["egwNotes"] = combined[:600] + "..." if len(combined) > 600 else combined

    except Exception as e:
        errors += 1
        print(f"  ERROR fetching lesson {n}: {e}")

# Save backup
import shutil
shutil.copy(JSON_PATH, JSON_PATH + ".bak")

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(q, f, ensure_ascii=False, indent=2)

print(f"\n{'='*50}")
print(f"Updated: {updated} days")
print(f"Errors:  {errors}")
print(f"Backup:  {JSON_PATH}.bak")
print(f"⚠️  contentMarkdown is now in ENGLISH. Spanish translations need to be restored.")
