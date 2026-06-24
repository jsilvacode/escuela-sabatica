#!/usr/bin/env python3
"""Restore Spanish contentMarkdown from backup for days that were correct."""
import json, re, urllib.request, time

BASE = "https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/en/2026-03"
JSON_PATH = "src/data/quarters/2026-q3.json"
BAK_PATH = JSON_PATH + ".bak"

def fetch(url: str) -> str:
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read().decode("utf-8")
        except:
            time.sleep(2)

def parse_fm(text: str):
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
with open(BAK_PATH, encoding="utf-8") as f:
    bak = json.load(f)

restored = 0
kept_en = 0

for n in range(1, 14):
    padded = f"{n:02d}"
    lesson = q["lessons"][n - 1]
    bak_lesson = bak["lessons"][n - 1]
    
    for day_idx in range(1, 8):
        day = lesson["days"][day_idx - 1]
        bak_day = bak_lesson["days"][day_idx - 1]
        
        # Fetch English source for this day
        try:
            en_text = fetch(f"{BASE}/{padded}/{day_idx:02d}.md")
            _, en_body = parse_fm(en_text)
        except:
            kept_en += 1
            continue
        
        # Compare Spanish backup vs English source
        es_body = bak_day.get("contentMarkdown", "")
        en_refs = re.findall(r'\b\d+\s*(?:Corinth(?:ians)?|Thess(?:alonians)?|Tim(?:othy)?|John|Rom(?:ans)?|Gal(?:atians)?|Eph(?:esians)?|Phil(?:ippians)?|Col(?:ossians)?|Heb(?:rews)?|Pet(?:er)?|Acts|Matt(?:hew)?|Mark|Luke|Gen(?:esis)?|Exod(?:us)?|Lev(?:iticus)?|Num(?:bers)?|Deut(?:eronomy)?)', en_body[:300])
        es_refs = re.findall(r'\b\d+\s*(?:Corintios|Tesalonicenses|Timoteo|Juan|Romanos|Gálatas|Efesios|Filipenses|Colosenses|Hebreos|Pedro|Hechos|Mateo|Marcos|Lucas|Génesis)', es_body[:300])
        
        # If first Bible ref matches between EN source and ES backup, content is likely correct
        match_ok = True
        if en_refs and es_refs:
            en_book = en_refs[0].split()[-1].lower().replace("ians","").replace("alonians","")
            es_book = es_refs[0].split()[-1].lower().replace("ios","")
            match_ok = en_book == es_book
        
        if match_ok:
            # Restore Spanish translation from backup
            day["contentMarkdown"] = es_body
            restored += 1
        else:
            day["contentMarkdown"] = en_body.strip()
            kept_en += 1

# Restore Spanish lesson descriptions and summaries
for n in range(1, 14):
    lesson = q["lessons"][n - 1]
    bak_lesson = bak["lessons"][n - 1]
    lesson["description"] = bak_lesson.get("description", "")
    lesson["summary"] = bak_lesson.get("summary", "")
    lesson["title"] = bak_lesson.get("title", lesson["title"])
    # Restore day titles
    for day_idx in range(1, 8):
        q["lessons"][n-1]["days"][day_idx-1]["title"] = bak["lessons"][n-1]["days"][day_idx-1].get("title", "")

# Restore quarter title
q["title"] = bak.get("title", q["title"])
q["description"] = bak.get("description", q.get("description", ""))

# Restore resources (Spanish labels)
q["resources"] = bak.get("resources", q.get("resources", []))

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(q, f, ensure_ascii=False, indent=2)

print(f"Restored (ES): {restored}")
print(f"Kept (EN):    {kept_en}")
print(f"Total days:   {restored + kept_en}")
print(f"\n⚠️  {kept_en} days still in English — content is correct but needs translation.")
