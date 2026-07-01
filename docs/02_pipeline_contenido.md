# 02 — Pipeline de contenido

## Fuente

El contenido se obtiene del repositorio oficial de Adventech en GitHub:

```
https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/en/2026-03/
```

## Script principal: `scripts/adventech_to_json.py`

### Flujo

```
1. Fetch quarter info.yml → metadatos del trimestre
2. Para cada lección (01-13):
   a. Fetch info.yml → título, fechas
   b. Fetch 01.md (Sábado) → referencias de estudio, versículo memoria, introducción, EGW
   c. Fetch 02.md-06.md (Dom-Jue) → contenido diario, preguntas, EGW
   d. Fetch 07.md (Viernes) → lecturas adicionales, preguntas de discusión
3. Parseo de referencias bíblicas → objetos BibleReference estructurados
4. Traducción LLM de inglés a español
5. Salida: src/data/quarters/2026-q3.json
```

### Estructura del JSON generado

```typescript
type Quarter = {
  id: string;              // "2026-q3"
  title: string;           // "1° y 2° Corintios"
  dateRange: string;       // "Julio - Septiembre 2026"
  description: string;     // Introducción del trimestre
  coverImage: string;      // "/images/cover-2026-q3.png"
  keyVerse: BibleRefContent;
  lessons: Lesson[];       // 13 lecciones
  reavivados: { date: string; reading: string }[];  // 92 días
  resources: Resource[];
}

type Lesson = {
  id: string;              // "leccion-01-el-ministerio-de-pablo-en-corinto"
  number: number;          // 1-13
  title: string;           // "El Ministerio de Pablo en Corinto"
  dateRange: string;       // "27 de junio - 3 de julio"
  summary: string;         // Resumen del primer párrafo
  image: string;           // "/images/lecciones/lecc1.jpg"
  keyVerse: BibleRefContent;
  days: LessonDay[];       // 7 días (Sábado-Viernes)
  resources: Resource[];   // PPTs, PDFs
  egwNotes: string;        // Extracto de citas EGW
}

type LessonDay = {
  id: string;              // "sabado", "domingo", etc.
  dayName: string;         // "Sábado", "Domingo", etc.
  date: string;            // "2026-06-27"
  title: string;           // Título del día
  contentMarkdown: string; // Contenido completo
  studyReferences: BibleReference[];  // Referencias de estudio
  keyVerse: BibleRefContent;          // Versículo de memoria (solo Sábado)
  audio: AudioResource;              // Audio MP3 del día
}
```

## Actualizar para otro trimestre

1. Cambiar `BASE_URL` en `scripts/adventech_to_json.py`:
   ```python
   BASE_URL = "https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/en/2026-04"
   ```
2. Actualizar `lessonAdapter.ts`:
   ```typescript
   import quarterData from "@data/quarters/2026-q4.json";
   ```
3. Ejecutar: `python3 scripts/adventech_to_json.py`
4. Verificar: `npm run build`

## Recursos adicionales extraídos

- **Audio**: URLs de MP3 desde `audio.yml` (91 pistas)
- **PDFs**: URLs desde `pdf.yml`
- **Reavivados**: Lecturas diarias desde `nuevotiempo.org`
- **Cover**: `cover.png` oficial del trimestre
