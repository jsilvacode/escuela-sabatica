import { useState } from "react";
import { BibleStudyModal } from "@components/bible/BibleStudyModal";
import type { BibleReference } from "@app-types/bible";

type Props = {
  text: string;
};

const BOOK_STRICT = "(?:(?:\\d+\\s+)?[A-ZÁÉÍÓÚ][a-záéíóúñü]+(?:\\s+[A-ZÁÉÍÓÚ][a-záéíóúñü]+)?)";
const REF_REGEX = new RegExp(`(?<![a-záéíóúñüA-Z])(\\(?${BOOK_STRICT}\\s+\\d+:\\d+(?:\\s*[-–]\\s*\\d+)?\\)?)`, "g");
const CHAPTER_REGEX = new RegExp(`(?<!\\d\\s)(?<![a-záéíóúñüA-Z])(\\(?${BOOK_STRICT}\\s+\\d{1,3}\\)?)(?![\\s]*[:\\d])`, "g");

const VALID_BOOKS = new Set([
  "genesis", "exodo", "levitico", "numeros", "deuteronomio",
  "josue", "jueces", "rut", "1 samuel", "2 samuel",
  "1 reyes", "2 reyes", "1 cronicas", "2 cronicas",
  "esdras", "nehemias", "ester", "job", "salmos", "proverbios",
  "eclesiastes", "cantares", "isaias", "jeremias", "lamentaciones",
  "ezequiel", "daniel", "oseas", "joel", "amos",
  "abdias", "jonas", "miqueas", "nahum", "habacuc",
  "sofonias", "hageo", "zacarias", "malaquias",
  "mateo", "marcos", "lucas", "juan",
  "hechos", "romanos", "1 corintios", "2 corintios",
  "galatas", "efesios", "filipenses", "colosenses",
  "1 tesalonicenses", "2 tesalonicenses", "1 timoteo", "2 timoteo",
  "tito", "filemon", "hebreos", "santiago",
  "1 pedro", "2 pedro", "1 juan", "2 juan", "3 juan",
  "judas", "apocalipsis",
]);

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function isValidBook(book: string): boolean {
  return VALID_BOOKS.has(norm(book));
}

function parseRefDisplay(display: string): BibleReference | null {
  const cleaned = display.replace(/[()]/g, "").trim();
  let m = cleaned.match(/^(\d?\s*[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+)?)\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?/);
  if (m && isValidBook(m[1].trim())) {
    return {
      book: m[1].trim(), chapter: parseInt(m[2]), verseStart: parseInt(m[3]),
      verseEnd: m[4] ? parseInt(m[4]) : undefined, display: cleaned,
    };
  }
  m = cleaned.match(/^(\d?\s*[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+)?)\s+(\d+)$/);
  if (m && isValidBook(m[1].trim())) {
    return { book: m[1].trim(), chapter: parseInt(m[2]), verseStart: 0, display: cleaned };
  }
  return null;
}

function findReferences(text: string, onOpen: (ref: BibleReference) => void): React.ReactNode[] {
  const allMatches: { index: number; length: number; reference: BibleReference }[] = [];

  let m: RegExpExecArray | null;
  while ((m = REF_REGEX.exec(text)) !== null) {
    const match = m;
    const display = match[0];
    const parsed = parseRefDisplay(display);
    if (parsed) allMatches.push({ index: match.index, length: display.length, reference: parsed });
  }
  CHAPTER_REGEX.lastIndex = 0;
  while ((m = CHAPTER_REGEX.exec(text)) !== null) {
    const match = m;
    const display = match[0];
    const overlaps = allMatches.some(am => match.index < am.index + am.length && match.index + display.length > am.index);
    if (!overlaps) {
      const parsed = parseRefDisplay(display);
      if (parsed) allMatches.push({ index: match.index, length: display.length, reference: parsed });
    }
  }

  if (allMatches.length === 0) return [text];

  allMatches.sort((a, b) => a.index - b.index || b.length - a.length);
  const filtered: typeof allMatches = [];
  for (const m of allMatches) {
    const last = filtered[filtered.length - 1];
    if (filtered.length === 0 || m.index >= last.index + last.length) filtered.push(m);
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

export function ManuscriptReader({ text }: Props) {
  const [activeReference, setActiveReference] = useState<BibleReference | null>(null);
  return (
    <>
      <p>{findReferences(text, setActiveReference)}</p>
      <BibleStudyModal reference={activeReference} onClose={() => setActiveReference(null)} />
    </>
  );
}
