# AGENTS.md — Escuela Sabática CL v2.2

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 |
| UI interactiva | React 19 (islands) |
| Lenguaje | TypeScript |
| CSS | Vanilla con CSS custom properties (tokens) |
| Contenido | JSON estático desde Adventech (español oficial) |
| Markdown | Parser inline en DailyReading (sin dependencias) |
| PDF export | html2pdf.js (dynamic import, sin SSR) |
| Paquetería | npm |
| Deploy | Vercel → escuelasabatica.cl |

## Estructura del proyecto

```
src/
├── components/
│   ├── audio/AudioPlayer.tsx          ← Reproductor + "Próximamente" + disclaimer
│   ├── bible/BibleStudyModal.tsx      ← Modal bíblico + comentario CBA + share
│   ├── layout/
│   │   ├── AppLayout.astro            ← Shell (header + sidebar + main + footer)
│   │   ├── BaseLayout.astro           ← HTML shell + CSS global + OG meta tags
│   │   ├── Brand.astro                ← Ícono + "Escuela Sabática / un lugar de estudio"
│   │   ├── Footer.astro               ← Enlaces destacados (6) + copy
│   │   ├── Header.astro               ← Barra superior navy 80/88px + hamburguesa
│   │   ├── MobileBottomNav.astro      ← Navegación inferior móvil
│   │   ├── PageHero.astro             ← Hero unificado (home/lección/página)
│   │   ├── Sidebar.astro              ← Menú lateral + "Complementos para tu estudio"
│   │   └── StudySidebar.astro         ← Widgets: PPT, Reavivados, Viernes complemento
│   ├── lesson/
│   │   ├── DailyReading.tsx           ← Markdown + detección refs + viernes complement
│   │   ├── DayTabs.astro              ← Tabs ancho completo, solo día, dropdown móvil
│   │   ├── LessonCard.astro           ← Tarjeta entera clicable "Lección N" + share
│   │   └── ManuscriptReader.tsx       ← React island para referencias en la intro
│   └── resources/
│       ├── ResourceCard.astro         ← Cover SVG por tipo + filtro dinámico
│       └── ArticleModal.tsx           ← Modal lector HTML + descarga PDF
├── data/
│   ├── navigation.ts                  ← Nav items (single source of truth)
│   └── quarters/
│       └── 2026-q3.json               ← 13 lecciones, 91 días, audios, artículos
├── lib/
│   ├── lessonAdapter.ts               ← Acceso a datos del trimestre
│   ├── bibleAdapter.ts                ← Fetch RVA2015 + cross-chapter support
│   └── commentaryAdapter.ts           ← Fetch CBA + cross-chapter support
├── pages/
│   ├── index.astro                    ← Landing: hero + intro + video + lecciones
│   ├── recursos.astro                 ← "Biblioteca de Recursos" — filtros dinámicos
│   └── lecciones/
│       ├── [lessonId].astro           ← Redirect al Sábado
│       └── [lessonId]/[dayId].astro   ← Lectura diaria + ArticleModal
├── styles/
│   ├── globals.css                    ← ~2550 líneas, CSS + print + article styles
│   └── tokens.css                     ← Variables CSS (colores, fuentes, espaciado)
└── types/
    ├── lesson.ts                      ← Tipos Quarter, Lesson, LessonDay
    ├── bible.ts                       ← BibleReference (con crossChapter)
    └── resource.ts                    ← Tipos Resource (article incluido), AudioResource
```

## Pipeline de contenido

```
Adventech GitHub (stage branch, español oficial)
  └── scripts/adventech_to_json.py     ← Fetch + parseo del contenido español
  └── scripts/audit_content.py         ← Auditoría: compara ES vs fuente EN
       └── src/data/quarters/2026-q3.json  ← 13 lecciones, 91 días, EGW, Reavivados
```

**Fuente español**: `https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/es/2026-03/`
**Fuente inglés** (referencia): `https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/en/2026-03/`

### Scripts

| Script | Propósito |
|--------|-----------|
| `scripts/adventech_to_json.py` | Generar JSON desde Adventech (fetch + parseo) |
| `scripts/audit_content.py` | Auditar contenido comparando ES vs fuente EN |

## Audio

- **Fuente**: `audioescuelasabatica.com`
- **Lección 1**: 7 audios diarios (Sábado a Viernes)
- **Lección 2**: 7 audios diarios (Sábado a Viernes)
- **Lecciones 3-13**: sin audio → "Próximamente" + disclaimer "Audio gentileza de audioescuelasabatica.com"
- **Reproductor**: siempre visible, botones disabled sin audio, disclaimer abajo

## Recursos

### Galería ("Biblioteca de Recursos")

| Tipo | Cover | Descripción |
|------|-------|-------------|
| Audio | `audio-cover.svg` | MP3 diarios Lec 1-2 (14 audios) |
| PPT | `ppt-cover.svg` | Diapositivas Lec 1-3 (3 PPTs locales) |
| Artículo | `article-cover.svg` | 13 artículos complementarios (HTML) |
| PDF | `pdf-cover.svg` | Sin enlaces externos (eliminados) |

- **Filtros dinámicos**: solo tipos con recursos reales
- **ArticleModal**: click → modal lector con Descargar PDF (html2pdf.js) + Imprimir

### Sidebar diario (StudySidebar)

1. **Material de la semana** — PPT con cover + "Descargar ↓" / "Próximamente"
2. **Reavivados por su Palabra** — lectura del día → santabiblia.cloud
3. **Complemento del Viernes** — artículo complementario (Lec 1-2; resto "Próximamente")
4. **Biblioteca de Recursos →** — link a galería

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing: hero + introducción + video del autor + lecciones + separadores |
| `/lecciones/[id]/[día]` | Lectura diaria: markdown, audio, refs bíblicas, sidebar, viernes complement |
| `/lecciones/[id]` | Redirect al Sábado |
| `/recursos` | Biblioteca de Recursos: galería con filtros + ArticleModal |

## Navegación

- **Desktop**: Sidebar navy sticky a la izquierda, scrollable, covers horizontales
- **Sidebar covers**: "Complementos para tu estudio diario" — Diálogo Bíblico (YouTube) + Santa Biblia
- **Mobile**: Hamburguesa → sidebar overlay. Bottom nav 4 tabs. Covers en fila horizontal.
- **Enlaces**: Inicio, Lecciones, Recursos, Biblia (santabiblia.cloud)

## SEO & Social Sharing

- **Open Graph**: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`
- **Twitter Card**: `summary_large_image` con title, description, image
- **Cover OG**: `public/images/og-cover.svg` (1200×630, navy/dorado)
- **Favicon**: `public/favicon.svg` (ícono "ES")
- **Web Share API**: long-press / right-click en tarjetas, botón Compartir en modal bíblico
- **URLs absolutas**: `location.origin` dinámico (compatible www/non-www)
- **Redirect**: `www.escuelasabatica.cl` → `escuelasabatica.cl` (vercel.json)

## Paleta de diseño

| Uso | Color | Hex |
|-----|-------|-----|
| Navy principal | `--color-navy-900` | `#0b1d33` |
| Gold acento | `--color-gold-500` | `#d4af37` |
| Ivory fondo | `--color-ivory-50` | `#faf7f1` |
| Título header | cream | `#f3ecdd` |
| Subtítulo header | gold | `#c9a96e` |
| Link bíblico | `#1a5cc7` (subrayado sutil siempre) | — |
| Link visitado | `#7c4d9e` | — |
| Badge artículo | `#5b4a9e` | — |

## Tipografía

- **UI**: Manrope / Inter / system-ui
- **Lectura**: Literata / Lora / Georgia (serif)
- **Header**: Cormorant Garamond (título + subtítulo)

## Breakpoints responsive

| Breakpoint | Comportamiento |
|------------|---------------|
| Default | Sidebar sticky, grid 4-5 cols, modal 860px |
| ≤1280px | Grids 3 cols, daily-layout 1 col |
| ≤1024px | Sidebar overlay, hamburguesa, bottom nav, 2 cols |
| ≤720px | 1 col, dropdown días, texto justificado 1.08rem |

## Mejoras de legibilidad

- **Referencias bíblicas**: azul `#1a5cc7` subrayado siempre. `:visited` = `#7c4d9e`. REF_REGEX reemplaza knownRefs más cortos. Cross-chapter (`6:19-7:9`) soportado en bibleAdapter + commentaryAdapter.
- **Markdown**: parseo inline (### → h4, #### → h5, > → blockquote, `` ` `` → prompt)
- **Tipografía**: lectura 1.22rem desktop / 1.08rem mobile, line-height 1.82 / 1.75
- **Espaciado**: `.main-content` 28px 36px 56px; `.content-wrap` 1200px; daily content 960px
- **Header**: 80px desktop / 88px mobile
- **Tabs de días**: ancho completo con `flex: 1`, solo nombre del día
- **Modal bíblico**: 860px ancho, 88vh alto, cross-chapter support

## Comandos

```bash
npm run dev        # Servidor desarrollo en :4321
npm run build      # TypeScript check + build estático → dist/
npm run check      # TypeScript check
npm run clean      # Limpiar dist/ y .astro/
npm test           # TypeScript validation
```

## Créditos

Desarrollado por Raúl Medina & Julio Silva.  
Contenido de Adventech (sabbath-school.adventech.io) — traducción oficial al español.  
Audios de Audio Escuela Sabática (audioescuelasabatica.com).  
Video introductorio por Adenilton T. de Aguiar.  
Material complementario: resúmenes por capítulo y comentarios de viernes.
