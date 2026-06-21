#!/usr/bin/env python3
"""Convert structured Sabbath School Markdown to Quarter JSON."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from datetime import date

DAY_NAMES_ES = [
    "Sábado", "Domingo", "Lunes", "Martes",
    "Miércoles", "Jueves", "Viernes"
]
DAY_IDS = [
    "sabado", "domingo", "lunes", "martes",
    "miercoles", "jueves", "viernes"
]

MONTHS_ES = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4,
    "mayo": 5, "junio": 6, "julio": 7, "agosto": 8,
    "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12,
}

BIBLE_BOOK_ALIASES = {
    "Hech": "Hechos", "Hechos": "Hechos",
    "Gén": "Génesis", "Gen": "Génesis", "Génesis": "Génesis",
    "Éxodo": "Éxodo", "Exo": "Éxodo",
    "Lev": "Levítico", "Levítico": "Levítico",
    "Núm": "Números", "Números": "Números",
    "Deut": "Deuteronomio", "Deuteronomio": "Deuteronomio",
    "Jos": "Josué", "Josué": "Josué",
    "Juec": "Jueces", "Jueces": "Jueces",
    "Rut": "Rut",
    "1 Sam": "1 Samuel", "2 Sam": "2 Samuel",
    "1 Rey": "1 Reyes", "2 Rey": "2 Reyes",
    "1 Crón": "1 Crónicas", "2 Crón": "2 Crónicas",
    "Esd": "Esdras", "Neh": "Nehemías",
    "Est": "Ester", "Job": "Job",
    "Sal": "Salmos", "Salmos": "Salmos", "Salm": "Salmos",
    "Prov": "Proverbios", "Proverbios": "Proverbios",
    "Ecl": "Eclesiastés", "Eclesiastés": "Eclesiastés",
    "Cant": "Cantares",
    "Isa": "Isaías", "Isaías": "Isaías",
    "Jer": "Jeremías", "Jeremías": "Jeremías",
    "Lam": "Lamentaciones",
    "Eze": "Ezequiel", "Ezequiel": "Ezequiel",
    "Dan": "Daniel", "Daniel": "Daniel",
    "Os": "Oseas", "Oseas": "Oseas",
    "Joel": "Joel", "Amós": "Amós", "Amos": "Amós",
    "Abd": "Abdías", "Jon": "Jonás", "Jonás": "Jonás",
    "Miq": "Miqueas", "Miqueas": "Miqueas",
    "Nah": "Nahúm", "Hab": "Habacuc",
    "Sof": "Sofonías", "Hag": "Hageo",
    "Zac": "Zacarías", "Zacarías": "Zacarías",
    "Mal": "Malaquías", "Malaquías": "Malaquías",
    "Mat": "Mateo", "Mateo": "Mateo",
    "Mar": "Marcos", "Marcos": "Marcos",
    "Luc": "Lucas", "Lucas": "Lucas",
    "Juan": "Juan",
    "Hechos": "Hechos",
    "Rom": "Romanos", "Romanos": "Romanos",
    "1 Cor": "1 Corintios", "1 Corintios": "1 Corintios",
    "2 Cor": "2 Corintios", "2 Corintios": "2 Corintios",
    "Gál": "Gálatas", "Gálatas": "Gálatas",
    "Efe": "Efesios", "Efesios": "Efesios",
    "Fil": "Filipenses", "Filipenses": "Filipenses",
    "Col": "Colosenses", "Colosenses": "Colosenses",
    "1 Tes": "1 Tesalonicenses", "1 Tesalonicenses": "1 Tesalonicenses",
    "2 Tes": "2 Tesalonicenses",
    "1 Tim": "1 Timoteo", "1 Timoteo": "1 Timoteo",
    "2 Tim": "2 Timoteo", "2 Timoteo": "2 Timoteo",
    "Tito": "Tito", "Tit": "Tito",
    "Flm": "Filemón",
    "Heb": "Hebreos", "Hebreos": "Hebreos",
    "Sant": "Santiago", "Santiago": "Santiago",
    "Stg": "Santiago",
    "1 Ped": "1 Pedro", "1 Pedro": "1 Pedro",
    "2 Ped": "2 Pedro", "2 Pedro": "2 Pedro",
    "1 Juan": "1 Juan",
    "2 Juan": "2 Juan",
    "3 Juan": "3 Juan",
    "Jud": "Judas", "Judas": "Judas",
    "Apoc": "Apocalipsis", "Apocalipsis": "Apocalipsis",
    "Isaías": "Isaías",
}


def parse_date(day_name: str, date_str: str, year: int = 2026) -> str:
    """Parse Spanish date like '27 de junio' or '1 de julio' into YYYY-MM-DD."""
    match = re.match(r"(\d{1,2})\s+de\s+(\w+)", date_str.strip())
    if not match:
        return ""
    day = int(match.group(1))
    month_name = match.group(2).lower().rstrip(".")
    month = MONTHS_ES.get(month_name)
    if not month:
        return ""
    return f"{year}-{month:02d}-{day:02d}"


def parse_bible_reference(ref_str: str) -> dict | None:
    """Parse a Bible reference like '1 Corintios 1:1' or 'Hechos 17:16-34' into structured object."""
    ref_str = ref_str.strip().rstrip(".")
    if not ref_str:
        return None

    # Remove periods from book abbreviations (e.g. "1 Cor." -> "1 Cor", "Hech." -> "Hech")
    ref_str = re.sub(r"\b(Hech|Cor|Tes|Tim|Ped|Juan|Sam|Rey|Cr[oó]n|G[áa]l|Efe|Fil|Col|Rom|Apoc|Sant|Stg|Isa[íi]as|Jer|Eze|Dan|Am[oó]s|Miq|Zac|Mal|Mat|Mar|Luc|Tit|Flm|Heb|Jud)\.", r"\1", ref_str)

    pattern = r"^(\d?\s*(?:de\s+)?[A-Za-záéíóúñüÁÉÍÓÚÑÜ]+(?:\s+\d+)?)\s+(\d+):(\d+)(?:-(\d+))?$"
    match = re.match(pattern, ref_str)
    if not match:
        return None

    book_raw = match.group(1).strip()
    chapter = int(match.group(2))
    verse_start = int(match.group(3))
    verse_end = int(match.group(4)) if match.group(4) else None

    book = BIBLE_BOOK_ALIASES.get(book_raw, book_raw)

    if verse_end and verse_end != verse_start:
        display = f"{book} {chapter}:{verse_start}-{verse_end}"
    else:
        display = f"{book} {chapter}:{verse_start}"
        verse_end = None

    osis_parts = [book, f"{chapter}.{verse_start}"]
    if verse_end:
        osis_parts.append(f"{chapter}.{verse_end}")

    return {
        "book": book,
        "chapter": chapter,
        "verseStart": verse_start,
        "verseEnd": verse_end,
        "display": display,
        "osis": display.replace(" ", "."),
    }


def parse_study_references(line: str) -> list[dict]:
    """Parse study references separated by semicolons."""
    refs = []
    # Split by semicolons, but be careful with periods
    parts = re.split(r";\s*", line.strip())
    for part in parts:
        part = part.strip().rstrip(".")
        if not part:
            continue
        ref = parse_bible_reference(part)
        if ref:
            refs.append(ref)
    return refs


def parse_memory_verse(line: str) -> tuple[str, str]:
    """Parse memory verse like '«text» (Hech. 18:9-10).' returning (text, reference_display)."""
    match = re.match(r"^[«\u201c](.+?)[»\u201d]\s*\((.+?)\)", line.strip())
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return line.strip(), ""


def slugify(text: str) -> str:
    """Generate a URL-friendly slug from Spanish text."""
    text = text.lower().strip()
    text = re.sub(r"[áàäâ]", "a", text)
    text = re.sub(r"[éèëê]", "e", text)
    text = re.sub(r"[íìïî]", "i", text)
    text = re.sub(r"[óòöô]", "o", text)
    text = re.sub(r"[úùüû]", "u", text)
    text = re.sub(r"[ñ]", "n", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text


def parse_markdown(md_path: Path) -> dict:
    """Parse the structured Markdown into Quarter JSON."""
    lines = md_path.read_text(encoding="utf-8").splitlines()

    lessons = []
    current_lesson = None
    current_day = None
    current_content_lines = []
    current_section = None

    lesson_title = ""
    quarter_title = ""

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_content_lines is not None:
                current_content_lines.append("")
            continue

        # Lesson header: # Lección N: Para el D de mes de AAAA
        lesson_match = re.match(r"^# Lección (\d+): Para el (.+)$", stripped)
        if lesson_match:
            if current_day and current_lesson:
                _finish_day(current_day, current_content_lines, current_lesson)
                current_day = None
            if current_lesson:
                lessons.append(current_lesson)
            lesson_num = int(lesson_match.group(1))
            current_lesson = {
                "number": lesson_num,
                "title": "",
                "dateRange": "",
                "endDate": lesson_match.group(2).strip(),
                "days": [],
            }
            current_content_lines = []
            lesson_title = ""
            quarter_title = ""
            continue

        # Lesson title: ## TITLE (after # Lección N)
        if re.match(r"^## (.+)", stripped) and current_lesson and not lesson_title:
            lesson_title = re.match(r"^## (.+)", stripped).group(1).strip()
            current_lesson["title"] = lesson_title
            if not quarter_title:
                quarter_title = lesson_title
            continue

        # Day header: ### Sábado/Domingo/etc D de mes
        day_pattern = "|".join(DAY_NAMES_ES)
        day_match = re.match(rf"^### ({day_pattern}) (.+)$", stripped)
        if day_match:
            if current_day and current_lesson:
                _finish_day(current_day, current_content_lines, current_lesson)
            day_name = day_match.group(1)
            day_date_str = day_match.group(2).strip()
            day_date = parse_date(day_name, day_date_str)
            day_idx = DAY_NAMES_ES.index(day_name)
            day_id = DAY_IDS[day_idx]

            # Derive lesson dateRange from Sábado and Viernes
            if day_name == "Sábado" and day_date:
                # The end date is from # Lección header
                end_date = current_lesson.get("endDate", "")
                current_lesson["dateRange"] = f"{_format_date_es(day_date)} - {_format_date_es(end_date)}"

            current_day = {
                "id": day_id,
                "dayName": day_name,
                "date": day_date,
                "title": "",
                "contentMarkdown": "",
                "studyReferences": [],
                "keyVerse": None,
            }
            current_content_lines = []
            current_section = None
            continue

        # Section header: #### Section Title
        section_match = re.match(r"^#### (.+)$", stripped)
        if section_match and current_day:
            section_title = section_match.group(1).strip()
            current_section = section_title

            # First real section title becomes the day title
            if not current_day["title"]:
                # Skip study reference and memory verse headers as day titles
                if not re.match(r"^(Lee para el estudio|Para memorizar|Para estudiar y meditar|Preguntas para dialogar)", section_title):
                    current_day["title"] = section_title

            current_content_lines.append(f"**{section_title}**")
            continue

        # Content line
        if current_day is not None:
            current_content_lines.append(stripped)

    # Finish last day and lesson
    if current_day and current_lesson:
        _finish_day(current_day, current_content_lines, current_lesson)
    if current_lesson:
        lessons.append(current_lesson)

    # Fill in missing lessons 7-13 as stubs
    existing_numbers = {l["number"] for l in lessons}
    for n in range(7, 14):
        if n not in existing_numbers:
            lessons.append({
                "number": n,
                "title": f"Lección {n}",
                "dateRange": "Próximamente",
                "days": [],
            })

    lessons.sort(key=lambda l: l["number"])

    # Assign IDs
    for lesson in lessons:
        title_slug = slugify(lesson["title"])
        lesson["id"] = f"leccion-{lesson['number']:02d}-{title_slug}"
        lesson["image"] = f"/images/lecciones/lecc{lesson['number']}.jpg" if lesson["number"] <= 6 else ""
        if not lesson.get("summary"):
            lesson["summary"] = lesson["title"]

    # Find the quarter memory verse (lesson 1 key verse)
    memory_verse = None
    if lessons and lessons[0].get("days"):
        for day in lessons[0]["days"]:
            if day.get("keyVerse"):
                memory_verse = day["keyVerse"]
                break

    quarter = {
        "id": "2026-q3",
        "title": "1 y 2 Corintios",
        "subtitle": "Estudiemos juntos la Palabra de Dios y crezcamos en gracia y conocimiento.",
        "dateRange": "Julio - Septiembre 2026",
        "year": 2026,
        "quarterNumber": 3,
        "description": "Este trimestre exploramos las cartas de Pablo a los corintios para descubrir cómo el mensaje de la cruz transforma vidas, restaura la unidad en la iglesia y nos llama a una vida de pureza, amor y fidelidad al evangelio.",
        "coverImage": "/images/baner_es.png",
        "keyVerse": memory_verse,
        "lessons": lessons,
        "resources": [],
    }

    return quarter


def _finish_day(day: dict, content_lines: list[str], lesson: dict) -> None:
    """Finalize a day's data from accumulated content."""
    if not content_lines:
        return

    full_text = "\n".join(content_lines).strip()

    # Extract study references (from Sábado's "Lee para el estudio de esta semana")
    study_refs = []
    study_start = None
    for i, line in enumerate(content_lines):
        if re.match(r"\*\*Lee para el estudio de esta semana\*\*", line):
            study_start = i
            break
    if study_start is not None:
        for j in range(study_start + 1, len(content_lines)):
            candidate = content_lines[j].strip()
            if not candidate:
                continue
            if candidate.startswith("**"):
                break
            refs = parse_study_references(candidate)
            if refs:
                study_refs.extend(refs)
                break

    # Extract memory verse (from Sábado's "Para memorizar")
    memory_verse = None
    memory_start = None
    for i, line in enumerate(content_lines):
        if re.match(r"\*\*Para memorizar\*\*", line):
            memory_start = i
            break
    if memory_start is not None:
        for j in range(memory_start + 1, len(content_lines)):
            verse_line = content_lines[j].strip()
            if not verse_line:
                continue
            if verse_line.startswith("**"):
                break
            text, ref_display = parse_memory_verse(verse_line)
            if text:
                ref = parse_bible_reference(ref_display) if ref_display else None
                memory_verse = {
                    "reference": ref if ref else {"book": "", "chapter": 0, "verseStart": 0, "display": ref_display},
                    "text": text,
                }
            break

    # Fallback title for days without a section title
    if not day["title"]:
        day["title"] = day["dayName"]

    day["studyReferences"] = study_refs
    day["keyVerse"] = memory_verse
    day["contentMarkdown"] = full_text

    lesson["days"].append(day)


def _format_date_es(date_str: str) -> str:
    """Format YYYY-MM-DD as 'DD de mes' in Spanish."""
    if not date_str:
        return ""
    try:
        parts = date_str.split("-")
        d = int(parts[2])
        m = int(parts[1])
        es_months = [
            "", "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ]
        return f"{d} de {es_months[m]}"
    except (ValueError, IndexError):
        return date_str


def main() -> int:
    input_path = Path("content/markdown/2026-q3-lecciones-1-6.md")
    output_path = Path("src/data/quarters/2026-q3.json")

    if not input_path.exists():
        print(f"Error: {input_path} not found", file=sys.stderr)
        return 1

    quarter = parse_markdown(input_path)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(quarter, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    print(f"Generated {output_path}")
    print(f"  Lessons: {len(quarter['lessons'])}")
    total_days = sum(len(l["days"]) for l in quarter["lessons"])
    print(f"  Total days: {total_days}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
