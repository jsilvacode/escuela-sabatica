import entries from "@data/commentary/adventist.sample.json";
import type { BibleReference, CommentaryEntry } from "@app-types/bible";

const sameReference = (a: BibleReference, b: BibleReference) =>
  a.book === b.book &&
  a.chapter === b.chapter &&
  a.verseStart === b.verseStart &&
  (a.verseEnd ?? a.verseStart) === (b.verseEnd ?? b.verseStart);

export async function getCommentary(reference: BibleReference): Promise<CommentaryEntry[]> {
  return entries.filter((entry) => sameReference(entry.reference, reference));
}
