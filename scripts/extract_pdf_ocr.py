#!/usr/bin/env python3
"""Extract raw Markdown from image-only lesson PDFs using Tesseract OCR."""

from __future__ import annotations

import argparse
import datetime as dt
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import pypdfium2 as pdfium


DEFAULT_PDF = Path("Material Base/Folleto PDF/Folleto 3er Trimestre 2026.pdf")
DEFAULT_OUTPUT = Path("content/raw-markdown/2026-q3.ocr.md")
DEFAULT_REPORT = Path("content/reports/2026-q3.ocr-report.md")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render an image-only PDF and OCR each page into raw Markdown."
    )
    parser.add_argument("pdf", nargs="?", type=Path, default=DEFAULT_PDF)
    parser.add_argument("-o", "--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--lang", default="spa", help="Tesseract language, e.g. spa or spa+eng.")
    parser.add_argument("--psm", default="3", help="Tesseract page segmentation mode.")
    parser.add_argument("--scale", type=float, default=3.0, help="PDF render scale.")
    parser.add_argument("--start-page", type=int, default=1, help="1-based first page to OCR.")
    parser.add_argument("--end-page", type=int, help="1-based last page to OCR.")
    parser.add_argument(
        "--keep-pages",
        type=Path,
        help="Optional directory for rendered page JPEGs, useful for debugging OCR.",
    )
    return parser.parse_args()


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in text.splitlines()]
    text = "\n".join(lines).strip()
    return re.sub(r"\n{3,}", "\n\n", text)


def run_tesseract(image_path: Path, lang: str, psm: str) -> tuple[str, str]:
    command = [
        "tesseract",
        str(image_path),
        "stdout",
        "-l",
        lang,
        "--psm",
        psm,
        "--dpi",
        "300",
    ]
    result = subprocess.run(command, check=False, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Tesseract failed without stderr.")
    return normalize_text(result.stdout), result.stderr.strip()


def page_range(total_pages: int, start_page: int, end_page: int | None) -> range:
    if start_page < 1:
        raise ValueError("--start-page must be >= 1")
    last_page = end_page or total_pages
    if last_page > total_pages:
        raise ValueError(f"--end-page cannot exceed PDF page count ({total_pages})")
    if start_page > last_page:
        raise ValueError("--start-page cannot be greater than --end-page")
    return range(start_page - 1, last_page)


def main() -> int:
    args = parse_args()
    if not args.pdf.exists():
        print(f"PDF not found: {args.pdf}", file=sys.stderr)
        return 1

    pdf = pdfium.PdfDocument(str(args.pdf))
    pages = page_range(len(pdf), args.start_page, args.end_page)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.report.parent.mkdir(parents=True, exist_ok=True)

    generated_at = dt.datetime.now(dt.timezone.utc).isoformat()
    markdown_parts = [
        "---",
        f"source_pdf: {args.pdf.as_posix()}",
        "status: raw_ocr",
        "ocr_engine: tesseract",
        f"ocr_language: {args.lang}",
        f"pdf_pages: {len(pdf)}",
        f"generated_at: {generated_at}",
        "---",
        "",
        "# OCR bruto - Escuela Sabatica 2026 Q3",
        "",
    ]
    report_lines = [
        "# OCR report - 2026 Q3",
        "",
        f"- Source PDF: `{args.pdf.as_posix()}`",
        f"- Pages in PDF: {len(pdf)}",
        f"- Pages OCRed: {args.start_page}-{args.end_page or len(pdf)}",
        f"- Language: `{args.lang}`",
        f"- PSM: `{args.psm}`",
        f"- Render scale: `{args.scale}`",
        "",
        "## Page results",
        "",
        "| Page | Characters | Notes |",
        "| ---: | ---: | --- |",
    ]

    errors = 0
    empty_pages = 0
    temp_context = tempfile.TemporaryDirectory()
    render_dir = args.keep_pages or Path(temp_context.name)
    render_dir.mkdir(parents=True, exist_ok=True)

    try:
        for page_index in pages:
            page_number = page_index + 1
            page = pdf[page_index]
            image_path = render_dir / f"page-{page_number:03d}.jpg"
            bitmap = page.render(scale=args.scale).to_pil().convert("RGB")
            bitmap.save(image_path, quality=95, dpi=(300, 300))

            note = ""
            try:
                text, stderr = run_tesseract(image_path, args.lang, args.psm)
                if not text:
                    empty_pages += 1
                    note = "empty OCR output"
                elif stderr:
                    note = stderr.replace("|", "\\|")
            except Exception as exc:
                errors += 1
                text = ""
                note = f"ERROR: {exc}".replace("|", "\\|")

            markdown_parts.extend(
                [
                    f"<!-- page: {page_number} -->",
                    f"## Pagina {page_number}",
                    "",
                    text,
                    "",
                ]
            )
            report_lines.append(f"| {page_number} | {len(text)} | {note} |")
            print(f"OCR page {page_number}/{len(pdf)}: {len(text)} chars")
    finally:
        if not args.keep_pages:
            temp_context.cleanup()

    args.output.write_text("\n".join(markdown_parts).rstrip() + "\n", encoding="utf-8")
    report_lines.extend(
        [
            "",
            "## Summary",
            "",
            f"- Empty pages: {empty_pages}",
            f"- Errors: {errors}",
            f"- Output: `{args.output.as_posix()}`",
        ]
    )
    args.report.write_text("\n".join(report_lines).rstrip() + "\n", encoding="utf-8")

    if errors:
        print(f"Finished with {errors} OCR errors. See {args.report}", file=sys.stderr)
        return 2
    print(f"Wrote {args.output}")
    print(f"Wrote {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
