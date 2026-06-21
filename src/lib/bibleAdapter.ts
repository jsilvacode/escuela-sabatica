import type { BiblePassage, BibleReference, BibleVerse } from "@app-types/bible";

type BookMeta = { id: number; name: string; file: string; chapters: number; slug: string };
type BibleBookData = { version: string; book: number; name: string; chapters: { chapter: number; verses: { verse: number; text: string }[] }[] };

const BASE = "https://www.santabiblia.cloud/data";
const normalize = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Book name aliases: common abbreviations → full Spanish name
const BOOK_ALIASES: Record<string, string> = {
  "gen": "Génesis", "exo": "Éxodo", "exod": "Éxodo",
  "lev": "Levítico", "num": "Números", "deut": "Deuteronomio",
  "jos": "Josué", "josh": "Josué", "jue": "Jueces", "judg": "Jueces",
  "rut": "Rut", "ruth": "Rut",
  "1 sam": "1 Samuel", "2 sam": "2 Samuel",
  "1 rey": "1 Reyes", "2 rey": "2 Reyes", "1 reyes": "1 Reyes", "2 reyes": "2 Reyes",
  "1 kings": "1 Reyes", "2 kings": "2 Reyes",
  "1 cron": "1 Crónicas", "2 cron": "2 Crónicas", "1 cro": "1 Crónicas", "2 cro": "2 Crónicas",
  "esd": "Esdras", "ezra": "Esdras", "neh": "Nehemías", "est": "Ester",
  "job": "Job", "sal": "Salmos", "salm": "Salmos", "ps": "Salmos", "psalms": "Salmos",
  "prov": "Proverbios", "ecl": "Eclesiastés", "eccles": "Eclesiastés",
  "cant": "Cantares", "song": "Cantares",
  "isa": "Isaías", "isaias": "Isaías", "jer": "Jeremías", "jerem": "Jeremías",
  "lam": "Lamentaciones", "eze": "Ezequiel", "ezek": "Ezequiel",
  "dan": "Daniel", "os": "Oseas", "ose": "Oseas", "hos": "Oseas",
  "joel": "Joel", "amós": "Amós", "amos": "Amós",
  "abd": "Abdías", "obad": "Abdías", "jon": "Jonás", "jonas": "Jonás",
  "miq": "Miqueas", "mic": "Miqueas", "nah": "Nahúm", "hab": "Habacuc",
  "sof": "Sofonías", "zeph": "Sofonías", "hag": "Hageo", "zac": "Zacarías",
  "mal": "Malaquías", "malaquias": "Malaquías",
  "mat": "Mateo", "matt": "Mateo", "mar": "Marcos", "mark": "Marcos",
  "luc": "Lucas", "luke": "Lucas", "jua": "Juan", "john": "Juan",
  "hech": "Hechos", "hechos": "Hechos", "acts": "Hechos",
  "rom": "Romanos", "roman": "Romanos",
  "1 cor": "1 Corintios", "2 cor": "2 Corintios",
  "1co": "1 Corintios", "2co": "2 Corintios",
  "gal": "Gálatas", "galatas": "Gálatas", "ef": "Efesios", "eph": "Efesios",
  "fil": "Filipenses", "phil": "Filipenses",
  "col": "Colosenses", "colosenses": "Colosenses",
  "1 tes": "1 Tesalonicenses", "2 tes": "2 Tesalonicenses",
  "1 thes": "1 Tesalonicenses", "2 thes": "2 Tesalonicenses",
  "1 thess": "1 Tesalonicenses", "2 thess": "2 Tesalonicenses",
  "1 tim": "1 Timoteo", "2 tim": "2 Timoteo",
  "1 timoteo": "1 Timoteo", "2 timoteo": "2 Timoteo",
  "tit": "Tito", "tito": "Tito", "titus": "Tito",
  "flm": "Filemón", "filemon": "Filemón", "philem": "Filemón",
  "heb": "Hebreos", "hebreos": "Hebreos",
  "sant": "Santiago", "santiago": "Santiago", "stgo": "Santiago", "jas": "Santiago", "james": "Santiago",
  "1 pe": "1 Pedro", "2 pe": "2 Pedro", "1 pedro": "1 Pedro", "2 pedro": "2 Pedro",
  "1 pet": "1 Pedro", "2 pet": "2 Pedro",
  "1 jua": "1 Juan", "2 jua": "2 Juan", "3 jua": "3 Juan",
  "1 jn": "1 Juan", "2 jn": "2 Juan", "3 jn": "3 Juan",
  "jud": "Judas", "judas": "Judas", "jude": "Judas",
  "apoc": "Apocalipsis", "apocalipsis": "Apocalipsis", "rev": "Apocalipsis",
};

function resolveBookName(bookName: string): string {
  return BOOK_ALIASES[normalize(bookName)] || bookName;
}

// ---- Manifest cache ----
let manifestCache: BookMeta[] | null = null;

async function fetchManifest(): Promise<BookMeta[]> {
  if (manifestCache) return manifestCache;
  const res = await fetch(`${BASE}/books.json`);
  manifestCache = await res.json();
  return manifestCache!;
}

function getBookMeta(bookName: string, manifest: BookMeta[]): BookMeta | undefined {
  const resolved = resolveBookName(bookName);
  return manifest.find(b => normalize(b.name) === normalize(resolved));
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
  // Chapter-only reference: show all verses
  if (!reference.verseStart || reference.verseStart === 0) {
    const verses: BibleVerse[] = chapter?.verses.map(v => ({ number: v.verse, text: v.text })) ?? [];
    return { reference, version, verses: verses.length > 0 ? verses : [{ number: 1, text: "Capítulo no disponible." }] };
  }
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
