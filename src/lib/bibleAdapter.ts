import bibleBooks from "@data/bible/rvr1960.sample.json";
import type { BiblePassage, BibleReference } from "@app-types/bible";

type BibleBookData = (typeof bibleBooks)[number];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export async function getPassage(
  reference: BibleReference,
  version = "RVR1960",
): Promise<BiblePassage> {
  const book = (bibleBooks as BibleBookData[]).find(
    (item) => normalize(item.name) === normalize(reference.book),
  );
  const chapter = book?.chapters.find((item) => item.number === reference.chapter);
  const verseEnd = reference.verseEnd ?? reference.verseStart;
  const verses =
    chapter?.verses.filter(
      (verse) => verse.number >= reference.verseStart && verse.number <= verseEnd,
    ) ?? [];

  return {
    reference,
    version,
    verses:
      verses.length > 0
        ? verses
        : [
            {
              number: reference.verseStart,
              text: "Texto bíblico no disponible en la muestra local. Conecta aquí la API o paquete compartido de Biblia.",
            },
          ],
  };
}

export async function searchBible(query: string) {
  const value = normalize(query.trim());
  if (!value) return [];

  return bibleBooks.flatMap((book) =>
    book.chapters.flatMap((chapter) =>
      chapter.verses
        .filter((verse) => normalize(verse.text).includes(value))
        .map((verse) => ({
          reference: `${book.name} ${chapter.number}:${verse.number}`,
          text: verse.text,
        })),
    ),
  );
}
