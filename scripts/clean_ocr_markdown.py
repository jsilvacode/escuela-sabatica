#!/usr/bin/env python3
"""Conservative cleanup for the raw Sabbath School OCR Markdown."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


DEFAULT_INPUT = Path("content/raw-markdown/2026-q3.ocr.md")
DEFAULT_OUTPUT = Path("content/markdown/2026-q3.clean.md")

DAY_NAMES = "Sábado|Domingo|Lunes|Martes|Miércoles|Jueves|Viernes"
DAY_WITH_LESSON_LEFT = re.compile(rf"^Lección\s+\d+\s+\|\s+({DAY_NAMES})\s+(.+)$")
DAY_WITH_LESSON_RIGHT = re.compile(rf"^({DAY_NAMES})\s+(.+?)\s+\|\s+Lección\s+\d+$")
SATURDAY_HEADER = re.compile(r"^Sábado\s+(.+)$")
LESSON_HEADER = re.compile(r"^Lección\s+(\d+):\s+Para\s+el\s+(.+)$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Clean raw OCR Markdown into editable Markdown.")
    parser.add_argument("input", nargs="?", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("-o", "--output", type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def strip_frontmatter(lines: list[str]) -> list[str]:
    if not lines or lines[0].strip() != "---":
        return lines
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            return lines[index + 1 :]
    return lines


def convert_heading(line: str) -> str | None:
    stripped = line.strip()
    stripped = re.sub(r"\b3o de junio\b", "30 de junio", stripped)
    stripped = re.sub(r"\b1\.\? de julio\b", "1 de julio", stripped)
    stripped = re.sub(r"\b1\.\s+de agosto\b", "1 de agosto", stripped)
    stripped = re.sub(r"\b1\.” de agosto\b", "1 de agosto", stripped)
    stripped = re.sub(
        r"^Lección\s+2:\s+Para\s+el\s+1\s+de julio de 2026$",
        "Lección 2: Para el 11 de julio de 2026",
        stripped,
    )
    if not stripped:
        return ""
    if stripped.startswith("<!-- page:"):
        return None
    if re.match(r"^## Pagina \d+$", stripped):
        return None
    if stripped.startswith("# OCR bruto"):
        return None
    if re.search(r"\bReavivados por su Palabra:", stripped):
        return None

    lesson = LESSON_HEADER.match(stripped)
    if lesson:
        return f"# Lección {lesson.group(1)}: Para el {lesson.group(2)}"

    day_left = DAY_WITH_LESSON_LEFT.match(stripped)
    if day_left:
        return f"## {day_left.group(1)} {day_left.group(2)}"

    day_right = DAY_WITH_LESSON_RIGHT.match(stripped)
    if day_right:
        return f"## {day_right.group(1)} {day_right.group(2)}"

    saturday = SATURDAY_HEADER.match(stripped)
    if saturday:
        return f"## Sábado {saturday.group(1)}"

    if stripped in {"LEE PARA EL ESTUDIO DE ESTA SEMANA:", "PARA MEMORIZAR:"}:
        return f"### {stripped.rstrip(':').title()}"

    if stripped.isupper() and len(stripped) > 8:
        return f"### {stripped}"

    return line.rstrip()


def collapse_blank_lines(lines: list[str]) -> list[str]:
    collapsed: list[str] = []
    blank_count = 0
    for line in lines:
        if line.strip():
            blank_count = 0
            collapsed.append(line.rstrip())
            continue
        blank_count += 1
        if blank_count <= 1:
            collapsed.append("")
    return collapsed


def main() -> int:
    args = parse_args()
    source = args.input.read_text(encoding="utf-8")
    lines = strip_frontmatter(source.splitlines())
    cleaned = []
    for line in lines:
        converted = convert_heading(line)
        if converted is not None:
            cleaned.append(converted)
    cleaned = collapse_blank_lines(cleaned)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(cleaned).strip() + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
