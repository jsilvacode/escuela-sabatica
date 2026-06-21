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

function renderParagraph(text: string, references: BibleReference[], onOpen: (reference: BibleReference) => void) {
  const matches = references
    .map((reference) => ({ reference, index: text.indexOf(`[${reference.display}]`) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (matches.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  matches.forEach(({ reference, index }) => {
    const token = `[${reference.display}]`;
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(
      <button className="bible-inline" type="button" key={`${reference.display}-${index}`} onClick={() => onOpen(reference)}>
        {reference.display}
      </button>,
    );
    cursor = index + token.length;
  });

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
            <p key={paragraph}>{renderParagraph(paragraph, references, setActiveReference)}</p>
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
