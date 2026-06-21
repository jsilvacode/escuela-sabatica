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

  // Get commentary for the verse range
  const verseEnd = reference.verseEnd ?? reference.verseStart;
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

  return entries;
}
