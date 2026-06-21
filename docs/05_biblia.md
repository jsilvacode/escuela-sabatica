# 05 — Integración bíblica

## Fuente de datos

La Biblia y el comentario se obtienen dinámicamente desde `santabiblia.cloud`, sin archivos locales.

```
https://www.santabiblia.cloud/data/books.json       ← Manifiesto de 66 libros
https://www.santabiblia.cloud/data/rva2015/{file}.json  ← Texto bíblico por libro
https://www.santabiblia.cloud/data/cba/{bookId}/{chapter}.json  ← Comentario CBA por capítulo
```

## bibleAdapter.ts

### `getPassage(reference)`

```typescript
async function getPassage(reference: BibleReference): Promise<BiblePassage>
```

1. Carga `books.json` (cacheado en memoria)
2. Resuelve el nombre del libro → `bookId` + `file`
3. Si `verseStart === 0` → devuelve todo el capítulo
4. Si `toEnd === true` → devuelve desde `verseStart` hasta el final del capítulo
5. Caso normal → filtra versos entre `verseStart` y `verseEnd`
6. Cachea cada libro cargado en `Map<string, BibleBookData>`

### Alias de libros

Mapa de 100+ abreviaturas → nombres completos en español:
- `1 Cor` → `1 Corintios`
- `Hech` → `Hechos`
- `Sal` → `Salmos`
- `Apoc` → `Apocalipsis`

## commentaryAdapter.ts

### `getCommentary(reference)`

```typescript
async function getCommentary(reference: BibleReference): Promise<CommentaryEntry[]>
```

1. Resuelve `bookId` desde el manifiesto
2. Si `verseStart === 0` → devuelve comentario de todos los versos del capítulo
3. Caso normal → itera desde `verseStart` hasta `verseEnd`
4. Fetch de `cba/{bookId}/{chapter}.json` (cacheado por capítulo)

## BibleStudyModal

### Tabs
- **Biblia**: muestra el texto RVA2015 con número de versículo
- **Comentario**: muestra el CBA con cabecera de rango (si hay múltiples versos) y número de verso por entrada

### Acciones
- **Copiar**: copia el texto al portapapeles
- **Compartir**: Web Share API (o fallback a portapapeles)
- **Abrir en Biblia**: abre `santabiblia.cloud` en pestaña nueva

## Tipos TypeScript

```typescript
type BibleReference = {
  book: string;          // Nombre del libro en español
  chapter: number;       // Número de capítulo
  verseStart: number;    // Verso inicial (0 = capítulo completo)
  verseEnd?: number;     // Verso final (opcional)
  toEnd?: boolean;       // Leer hasta el final del capítulo
  display: string;       // Texto para mostrar
};

type BiblePassage = {
  reference: BibleReference;
  version: string;       // "RVA2015"
  verses: BibleVerse[];  // Array de versos
};

type CommentaryEntry = {
  reference: BibleReference;
  content: string;       // Texto del comentario
  source?: string;       // "CBA 1 Pedro 4:8"
};
```
