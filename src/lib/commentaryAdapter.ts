import type { BibleReference, CommentaryEntry } from "@app-types/bible";

type BookMeta = { id: number; name: string; file: string; chapters: number; slug: string };

const normalize = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const BASE = "https://www.santabiblia.cloud/data";

// Shared manifest (same as bibleAdapter - imported lazily to avoid circular dependency)
let manifestCache: BookMeta[] | null = null;
const chapterCache = new Map<string, Record<string, string>>();

async function getManifest(): Promise<BookMeta[]> {
  if (manifestCache) return manifestCache;
  const res = await fetch(`${BASE}/books.json`);
  manifestCache = await res.json();
  return manifestCache!;
}

async function getChapterCommentary(bookId: number, chapter: number): Promise<Record<string, string> | null> {
  const key = `${bookId}_${chapter}`;
  if (chapterCache.has(key)) return chapterCache.get(key)!;
  try {
    const res = await fetch(`${BASE}/cba/${bookId}/${chapter}.json`);
    if (!res.ok) return null;
    const data: Record<string, string> = await res.json();
    chapterCache.set(key, data);
    return data;
  } catch {
    return null;
  }
}

export async function getCommentary(reference: BibleReference): Promise<CommentaryEntry[]> {
  const manifest = await getManifest();
  const bookMeta = manifest.find(b => normalize(b.name) === normalize(reference.book));
  if (!bookMeta) return [];

  const chapterData = await getChapterCommentary(bookMeta.id, reference.chapter);
  if (!chapterData) return [];

  const entries: CommentaryEntry[] = [];

  // Chapter-only reference: load all verses
  if (!reference.verseStart || reference.verseStart === 0) {
    const verseKeys = Object.keys(chapterData)
      .map(Number)
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
    for (const v of verseKeys) {
      entries.push({
        reference,
        content: chapterData[String(v)],
        source: `CBA ${bookMeta.name} ${reference.chapter}:${v}`,
      });
    }
    return entries;
  }

  // Get commentary for the verse range (including toEnd + crossChapter)
  const maxVerse = Object.keys(chapterData)
    .map(Number).filter(n => !isNaN(n))
    .reduce((max, n) => n > max ? n : max, 0);
  const verseEnd = reference.toEnd
    ? maxVerse
    : (reference.verseEnd ?? reference.verseStart);
  for (let v = reference.verseStart; v <= verseEnd; v++) {
    const text = chapterData[String(v)];
    if (text) {
      entries.push({
        reference,
        content: text,
        source: `CBA ${bookMeta.name} ${reference.chapter}:${v}`,
      });
    }
  }

  // Append cross-chapter commentary if present
  if (reference.crossChapter) {
    const nextChapterData = await getChapterCommentary(bookMeta.id, reference.crossChapter.chapter);
    if (nextChapterData) {
      const nextKeys = Object.keys(nextChapterData)
        .map(Number).filter(n => !isNaN(n) && n <= reference.crossChapter!.verseEnd)
        .sort((a, b) => a - b);
      for (const v of nextKeys) {
        const text = nextChapterData[String(v)];
        if (text) {
          entries.push({
            reference,
            content: text,
            source: `CBA ${bookMeta.name} ${reference.crossChapter!.chapter}:${v}`,
          });
        }
      }
    }
  }

  return entries;
}
