# PROMPT MAESTRO — Escuela Sabática CL v2.2

## Qué es este proyecto

**Escuela Sabática CL** es una plataforma web de estudio bíblico para la Iglesia Adventista del Séptimo Día, desplegada en `escuelasabatica.cl` (Vercel). Ofrece lectura diaria de las 13 lecciones trimestrales con audio, referencias bíblicas interactivas, comentarios, recursos descargables y material complementario.

## Cómo trabajar en este proyecto

### Setup inicial

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # TypeScript check + build a dist/
npm run check     # Solo TypeScript check
npm run clean     # Limpiar dist/ y .astro/
```

### Flujo de trabajo

1. **Hacé cambios en local** y probá en `http://localhost:4321`
2. **`npm run check`** para validar TypeScript (0 errores requerido)
3. **`npm run build`** para verificar build completo (106 páginas)
4. **Commiteá y pusheá** a `main` cuando esté listo
5. **Siempre esperá confirmación del usuario** antes de commitear cambios importantes

### Dónde está cada cosa

| Archivo | Propósito |
|---------|-----------|
| `AGENTS.md` | Documentación técnica completa (leer primero) |
| `docs/arquitectura_diagramas.md` | Diagramas Mermaid de arquitectura, pipeline, frontend, referencias, datos, rutas |
| `docs/01_arquitectura.md` | Arquitectura general del proyecto |
| `docs/02_pipeline_contenido.md` | Cómo se obtiene y procesa el contenido |
| `docs/03_sistema_referencias.md` | Sistema de detección de referencias bíblicas |
| `docs/04_diseno.md` | Sistema de diseño (tokens, breakpoints) |
| `README.md` | Readme público (escueto) |
| `scripts/adventech_to_json.py` | Fetch desde Adventech y generar JSON |
| `scripts/audit_content.py` | Auditar JSON vs fuente oficial |

## Stack técnico

- **Framework**: Astro 6 (SSG estático, 106 páginas HTML)
- **Islas interactivas**: React 19 (`client:load`) para DailyReading, AudioPlayer, BibleStudyModal, ArticleModal, ManuscriptReader
- **CSS**: Vanilla con custom properties en `tokens.css`, todo el CSS en `globals.css` (~2550 líneas)
- **Contenido**: JSON estático `src/data/quarters/2026-q3.json`
- **Markdown**: Parser inline en DailyReading.tsx (sin dependencias externas)
- **PDF**: `html2pdf.js` (dynamic import, solo en cliente)

## Arquitectura de contenido

### Fuente principal: Adventech (español oficial)

El contenido de las 13 lecciones viene de:
```
https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/es/2026-03/
```

Cada lección tiene:
- `info.yml` → título, fechas
- `01.md` → Sábado (con `Lee para el estudio de esta semana`, versículo de memoria)
- `02.md` a `07.md` → Domingo a Viernes

### Pipeline de regeneración

El `2026-q3.json` se regenera desde cero cuando el contenido de Adventech cambia:

1. **`adventech_to_json.py`** → fetch de los 91 `.md` españoles, parsea frontmatter, estructura el JSON
2. **Pulido manual** → expandir abreviaturas (Cor.→Corintios), normalizar espacios, parsear referencias con campos estructurados
3. **`audit_content.py`** → comparar contra fuente inglesa, detectar discrepancias

### Formato de referencias bíblicas

Las referencias en `studyReferences` usan campos estructurados:
```json
{
  "book": "1 Corintios",
  "chapter": 6,
  "verseStart": 19,
  "verseEnd": null,
  "toEnd": true,
  "crossChapter": { "chapter": 7, "verseEnd": 9 },
  "display": "1 Corintios 6:19-7:9"
}
```

Casos especiales:
- `verseStart: 0` → capítulo completo (sin versículo)
- `toEnd: true` → desde verseStart hasta fin del capítulo
- `crossChapter` → rango entre capítulos (6:19-7:9)
- Continuaciones: `10:5-22` hereda libro del anterior, `22-28` hereda libro + capítulo

### Audio

- Fuente: `audioescuelasabatica.com`
- Lecciones 1 y 2: 7 MP3 cada una (Sábado a Viernes)
- Lecciones 3-13: sin audio → muestra "Próximamente" + disclaimer
- URLs: `https://www.audioescuelasabatica.com/wp-content/uploads/2026/06/LECCION-{N}-{DAY}.mp3`
- Las URLs están en el JSON (`day.audio` y `lesson.resources`)

### Material complementario

Archivos HTML en `public/material/`:
- `cb_intro_1cor.html` — Introducción a 1 Corintios  
- `res_cap5.html` a `res_cap14.html` — Resúmenes por capítulo
- `viernes1.html`, `viernes2.html` — Complementos de Viernes (Lec 1-2)
- Se visualizan en el `ArticleModal` con descarga PDF vía `html2pdf.js`

## Estructura clave del código

### Páginas

| Ruta | Archivo | Props clave a BaseLayout |
|------|---------|--------------------------|
| `/` | `index.astro` | `title`, `description`, `image`, `url` |
| `/lecciones/[id]/[día]` | `[lessonId]/[dayId].astro` | `title`, `description`, `image`, `url` |
| `/recursos` | `recursos.astro` | `title`, `description`, `url` |

### Componentes React (islands)

| Componente | Archivo | Qué hace |
|-----------|---------|---------|
| `DailyReading` | `lesson/DailyReading.tsx` | Renderiza lectura con markdown + detección de refs + viernes complement |
| `AudioPlayer` | `audio/AudioPlayer.tsx` | Reproductor con "Próximamente" + disclaimer |
| `BibleStudyModal` | `bible/BibleStudyModal.tsx` | Modal con Biblia RVA2015 + comentario CBA + share/copy |
| `ArticleModal` | `resources/ArticleModal.tsx` | Modal lector de HTML + descarga PDF |
| `ManuscriptReader` | `lesson/ManuscriptReader.tsx` | Detección de refs en la introducción |

### Componentes Astro (server-side)

| Componente | Archivo | Qué hace |
|-----------|---------|---------|
| `BaseLayout` | `layout/BaseLayout.astro` | HTML shell + OG meta tags + scripts de share y nav |
| `StudySidebar` | `layout/StudySidebar.astro` | Widgets: PPT, Reavivados, Viernes complemento |
| `Sidebar` | `layout/Sidebar.astro` | Nav lateral + covers (Diálogo Bíblico, Santa Biblia) |
| `LessonCard` | `lesson/LessonCard.astro` | Tarjeta de lección clicable + data-share |
| `DayTabs` | `lesson/DayTabs.astro` | Tabs de días ancho completo + dropdown móvil |
| `ResourceCard` | `resources/ResourceCard.astro` | Cover SVG por tipo + filtro |

### Adaptadores (lib/)

| Archivo | Qué hace |
|---------|---------|
| `lessonAdapter.ts` | Acceso al JSON: `getQuarter()`, `getLesson(id)`, `getDay(lessonId, dayId)`, `getAllResources()` |
| `bibleAdapter.ts` | Fetch RVA2015 con soporte `toEnd`, `crossChapter` y capítulo completo |
| `commentaryAdapter.ts` | Fetch CBA con soporte `toEnd`, `crossChapter` y capítulo completo |

## Patrones y convenciones

### CSS
- Variables en `tokens.css`: colores, fuentes, espaciado, sombras, radios
- Todo el CSS en `globals.css` (~2550 líneas, un solo archivo)
- Breakpoints: 1280px, 1024px, 720px
- No usar inline styles (excepto valores dinámicos en React)
- Mobile-first no, se usa desktop-first con overrides

### TypeScript
- Tipos en `src/types/`: `lesson.ts`, `bible.ts`, `resource.ts`
- Path aliases: `@components/*`, `@lib/*`, `@data/*`, `@app-types/*`
- `astro check` antes de build, 0 errores requerido

### Web Share API
- Long-press / right-click en tarjetas con `data-share-url`
- Script inline en `BaseLayout.astro` construye URLs absolutas con `location.origin`
- Modal bíblico: botón Compartir con `navigator.share`
- `data-share-text` en tarjetas de lección

### OG / SEO
- `BaseLayout.astro` acepta props: `title`, `description`, `image`, `url`
- `og:image` → `og-cover.svg` (1200×630, navy/dorado)
- `twitter:card` → `summary_large_image`
- `favicon.svg` con "ES"
- `vercel.json` → redirect www → non-www

## Cómo agregar una nueva lección/trimestre

1. Cambiar `BASE_URL` en `scripts/adventech_to_json.py` al nuevo trimestre (ej: `2026-04`)
2. Ejecutar el script: `python3 scripts/adventech_to_json.py`
3. El JSON se genera en `src/data/quarters/`
4. Actualizar referencias en `src/lib/lessonAdapter.ts`
5. Agregar imágenes de lecciones en `public/images/lecciones/`
6. Verificar build: `npm run build` debe generar 106 páginas

## Cómo agregar nuevos audios

1. Verificar URLs en `audioescuelasabatica.com`
2. Agregar entradas en `2026-q3.json` para `lesson.days[i].audio` y `lesson.resources`
3. Patrón de URL: `.../2026/06/LECCION-{N}-{DAY}.mp3`
4. El reproductor detecta automáticamente `day.audio?.url`

## Notas importantes

- **No usar `ssr.noExternal`** con librerías que usen DOM (como html2pdf.js). Usar dynamic `import()`.
- **Los scripts de Python** están en `scripts/` (gitignored anteriormente, ahora en repo). Requieren Python 3.
- **El JSON no se edita a mano** para cambios masivos. Usar scripts o Python one-liners.
- **Siempre probar en local primero** y esperar confirmación antes de commitear a main.
- **La documentación completa** está en `AGENTS.md` y `docs/`.
