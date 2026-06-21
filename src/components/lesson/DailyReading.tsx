import { useMemo, useState } from "react";
import { BibleStudyModal } from "@components/bible/BibleStudyModal";
import type { Lesson, LessonDay } from "@app-types/lesson";
import type { BibleReference } from "@app-types/bible";

type Props = {
  lesson: Lesson;
  day: LessonDay;
  previousDay?: LessonDay;
  nextDay?: LessonDay;
};

// Stricter book pattern: optional digit prefix + capitalized word(s)
const BOOK_STRICT = "(?:(?:\\d+\\s+)?[A-ZÁÉÍÓÚ][a-záéíóúñü]+(?:\\s+[A-ZÁÉÍÓÚ][a-záéíóúñü]+)?)";
// Matches: Book Chapter:Verse or Book Chapter:Verse-VerseEnd
const REF_REGEX = new RegExp(`(?<![a-záéíóúñüA-Z])(\\(?${BOOK_STRICT}\\s+\\d+:\\d+(?:\\s*[-–]\\s*\\d+)?\\)?)`, "g");
// Matches: Book Chapter (no verse). NOT preceded by digit+space. Ch num not followed by : or digit.
const CHAPTER_REGEX = new RegExp(`(?<!\\d\\s)(?<![a-záéíóúñüA-Z])(\\(?${BOOK_STRICT}\\s+\\d{1,3}\\)?)(?![\\s]*[:\\d])`, "g");

function parseRefDisplay(display: string): BibleReference | null {
  const cleaned = display.replace(/[()]/g, "").trim();
  // Try: Book Chapter:Verse(-VerseEnd)?
  let m = cleaned.match(/^(\d?\s*[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+)?)\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?/);
  if (m) {
    return {
      book: m[1].trim(),
      chapter: parseInt(m[2]),
      verseStart: parseInt(m[3]),
      verseEnd: m[4] ? parseInt(m[4]) : undefined,
      display: cleaned,
    };
  }
  // Try: Book Chapter (no verse, like "1 Corintios 12")
  m = cleaned.match(/^(\d?\s*[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+)?)\s+(\d+)$/);
  if (m) {
    return {
      book: m[1].trim(),
      chapter: parseInt(m[2]),
      verseStart: 0,
      display: cleaned,
    };
  }
  return null;
}

function findReferences(text: string, knownRefs: BibleReference[], onOpen: (ref: BibleReference) => void): React.ReactNode[] {
  const allMatches: { index: number; length: number; reference: BibleReference }[] = [];

  // 1. Match known references
  for (const ref of knownRefs) {
    for (const form of [`[${ref.display}]`, `(${ref.display})`, ref.display]) {
      let idx = text.indexOf(form);
      while (idx >= 0) {
        allMatches.push({ index: idx, length: form.length, reference: ref });
        idx = text.indexOf(form, idx + 1);
      }
    }
  }

  // 2. Match generic verse references
  let m: RegExpExecArray | null;
  while ((m = REF_REGEX.exec(text)) !== null) {
    const match = m;
    const display = match[0];
    const overlaps = allMatches.some(am =>
      match.index < am.index + am.length && match.index + display.length > am.index
    );
    if (!overlaps) {
      const parsed = parseRefDisplay(display);
      if (parsed) {
        allMatches.push({ index: match.index, length: display.length, reference: parsed });
      }
    }
  }

  // 3. Match chapter-only references (Book Chapter without verse)
  CHAPTER_REGEX.lastIndex = 0;
  while ((m = CHAPTER_REGEX.exec(text)) !== null) {
    const match = m;
    const display = match[0];
    const overlaps = allMatches.some(am =>
      match.index < am.index + am.length && match.index + display.length > am.index
    );
    if (!overlaps) {
      const parsed = parseRefDisplay(display);
      if (parsed) {
        allMatches.push({ index: match.index, length: display.length, reference: parsed });
      }
    }
  }

  if (allMatches.length === 0) return [text];

  // Dedup overlapping, prefer longer
  allMatches.sort((a, b) => a.index - b.index || b.length - a.length);
  const filtered: typeof allMatches = [];
  for (const m of allMatches) {
    const last = filtered[filtered.length - 1];
    if (filtered.length === 0 || m.index >= last.index + last.length) {
      filtered.push(m);
    }
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const { index, length, reference } of filtered) {
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(
      <span className="bible-inline" key={`${reference.display}-${index}`} onClick={() => onOpen(reference)}>
        {text.slice(index, index + length)}
      </span>,
    );
    cursor = index + length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export function DailyReading({ lesson, day, previousDay, nextDay }: Props) {
  const [activeReference, setActiveReference] = useState<BibleReference | null>(null);
  const references = day.studyReferences ?? [];
  const paragraphs = useMemo(() => (day.contentMarkdown ?? "").split("\n").filter(Boolean), [day.contentMarkdown]);

  return (
    <>
      <article className="reading-card">
        {day.keyVerse && (
          <div className="verse-block">
            <span aria-hidden="true">☼</span>
            <div>
              <strong>Versículo clave</strong>
              <blockquote>“{day.keyVerse.text}”</blockquote>
              <span className="muted">{day.keyVerse.reference.display}</span>
            </div>
          </div>
        )}

        <div className="reading-body">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{findReferences(paragraph, references, setActiveReference)}</p>
          ))}
        </div>

        {references.length > 0 && (
          <div className="reference-row" aria-label="Referencias de estudio">
            {references.map((reference) => (
              <button className="reference-chip" type="button" key={reference.display} onClick={() => setActiveReference(reference)}>
                {reference.display}
              </button>
            ))}
          </div>
        )}

        <nav className="daily-nav" aria-label="Navegación entre días">
          {previousDay ? (
            <a className="ghost-button" href={`/lecciones/${lesson.id}/${previousDay.id}`}>
              ← {previousDay.dayName}
            </a>
          ) : (
            <span />
          )}
          {nextDay ? (
            <a className="primary-button" href={`/lecciones/${lesson.id}/${nextDay.id}`}>
              {nextDay.dayName} →
            </a>
          ) : (
            <a className="primary-button" href={`/lecciones/${lesson.id}`}>Volver a la semana</a>
          )}
        </nav>
      </article>

      <BibleStudyModal reference={activeReference} onClose={() => setActiveReference(null)} />
    </>
  );
}
