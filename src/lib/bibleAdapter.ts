import type { BiblePassage, BibleReference, BibleVerse } from "@app-types/bible";

type BookMeta = { id: number; name: string; file: string; chapters: number; slug: string };
type BibleBookData = { version: string; book: number; name: string; chapters: { chapter: number; verses: { verse: number; text: string }[] }[] };

const BASE = "https://www.santabiblia.cloud/data";
const normalize = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// ---- Manifest cache ----
let manifestCache: BookMeta[] | null = null;

async function fetchManifest(): Promise<BookMeta[]> {
  if (manifestCache) return manifestCache;
  const res = await fetch(`${BASE}/books.json`);
  manifestCache = await res.json();
  return manifestCache!;
}

function getBookMeta(bookName: string, manifest: BookMeta[]): BookMeta | undefined {
  return manifest.find(b => normalize(b.name) === normalize(bookName));
}

// ---- Bible book cache ----
const bookCache = new Map<string, BibleBookData>();

async function loadBook(file: string): Promise<BibleBookData> {
  if (bookCache.has(file)) return bookCache.get(file)!;
  const res = await fetch(`${BASE}/rva2015/${file}.json`);
  const data: BibleBookData = await res.json();
  bookCache.set(file, data);
  return data;
}

// ---- Public API ----

export async function getPassage(
  reference: BibleReference,
  version = "RVA2015",
): Promise<BiblePassage> {
  const manifest = await fetchManifest();
  const bookMeta = getBookMeta(reference.book, manifest);
  if (!bookMeta) {
    return { reference, version, verses: [{ number: reference.verseStart, text: "Libro no encontrado." }] };
  }

  const book = await loadBook(bookMeta.file);
  const chapter = book.chapters.find(c => c.chapter === reference.chapter);
  const verseEnd = reference.verseEnd ?? reference.verseStart;

  const verses: BibleVerse[] = chapter?.verses
    .filter(v => v.verse >= reference.verseStart && v.verse <= verseEnd)
    .map(v => ({ number: v.verse, text: v.text })) ?? [];

  return {
    reference,
    version,
    verses: verses.length > 0
      ? verses
      : [{ number: reference.verseStart, text: "Versículo no disponible." }],
  };
}

export async function searchBible(query: string) {
  const value = normalize(query.trim());
  if (!value) return [];

  const manifest = await fetchManifest();
  const results: { reference: string; text: string }[] = [];
  for (const bookMeta of manifest.slice(0, 10)) {
    const book = await loadBook(bookMeta.file);
    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        if (normalize(verse.text).includes(value)) {
          results.push({
            reference: `${bookMeta.name} ${chapter.chapter}:${verse.verse}`,
            text: verse.text.slice(0, 200),
          });
          if (results.length >= 20) return results;
        }
      }
    }
  }
  return results;
}
