# 07 — Modelo de datos JSON

## Objetivo

Definir una estructura clara para que el contenido de Escuela Sabática pueda mantenerse desde JSON generado a partir de PDF → OCR → Markdown → JSON.

## Entidad Quarter

Representa un trimestre.

```ts
type Quarter = {
  id: string;
  title: string;
  subtitle?: string;
  dateRange: string;
  year: number;
  quarterNumber: 1 | 2 | 3 | 4;
  description: string;
  coverImage?: string;
  keyVerse?: BibleRefContent;
  lessons: Lesson[];
  resources?: Resource[];
};
```

## Entidad Lesson

Representa una de las 13 lecciones.

```ts
type Lesson = {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  image?: string;
  keyVerse?: BibleRefContent;
  days: LessonDay[];
  resources?: Resource[];
};
```

## Entidad LessonDay

Representa una lectura diaria.

```ts
type LessonDay = {
  id: string;
  dayName: 'Sábado' | 'Domingo' | 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  date?: string;
  title: string;
  subtitle?: string;
  image?: string;
  audio?: AudioResource;
  keyVerse?: BibleRefContent;
  studyReferences?: BibleReference[];
  contentMarkdown?: string;
  contentBlocks?: ContentBlock[];
  resources?: Resource[];
};
```

## Entidad BibleReference

```ts
type BibleReference = {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  display: string;
  osis?: string;
};
```

Ejemplo:

```json
{
  "book": "Génesis",
  "chapter": 1,
  "verseStart": 1,
  "display": "Génesis 1:1",
  "osis": "Gen.1.1"
}
```

## Entidad BibleRefContent

```ts
type BibleRefContent = {
  reference: BibleReference;
  text?: string;
};
```

## Entidad ContentBlock

Permite representar contenido ya estructurado.

```ts
type ContentBlock =
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; reference?: BibleReference }
  | { type: 'bible-reference'; reference: BibleReference }
  | { type: 'callout'; variant: 'verse' | 'note' | 'question'; text: string; reference?: BibleReference }
  | { type: 'question'; text: string }
  | { type: 'image'; src: string; alt: string };
```

## Entidad Resource

```ts
type Resource = {
  id: string;
  type: 'pdf' | 'ppt' | 'audio' | 'video' | 'article' | 'commentary' | 'guide';
  title: string;
  description?: string;
  url: string;
  duration?: string;
  fileSize?: string;
  thumbnail?: string;
};
```

## Entidad AudioResource

```ts
type AudioResource = {
  title: string;
  url: string;
  duration?: string;
  narrator?: string;
};
```

## Modelo para Biblia

Si se usa Biblia local en JSON:

```ts
type BibleBook = {
  id: string;
  name: string;
  abbreviation: string;
  chapters: BibleChapter[];
};

type BibleChapter = {
  number: number;
  verses: BibleVerse[];
};

type BibleVerse = {
  number: number;
  text: string;
};
```

## Modelo para Comentario Bíblico

```ts
type CommentaryEntry = {
  reference: BibleReference;
  title?: string;
  content: string;
  source?: string;
};
```

## Recomendación

La lección no debería guardar el texto bíblico completo en cada referencia. Debe guardar solo la referencia estructurada y resolver el texto desde `bibleAdapter`.

Esto evita duplicación y facilita mantener una Biblia compartida entre `santabiblia.cloud` y `escuelasabatica.cl`.
