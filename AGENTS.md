# AGENTS.md — Escuela Sabática CL v2.1

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 |
| UI interactiva | React 19 (islands) |
| Lenguaje | TypeScript |
| CSS | Vanilla con CSS custom properties (tokens) |
| Contenido | JSON estático desde Adventech (español oficial) |
| Markdown | Parser inline en DailyReading (sin dependencias) |
| Paquetería | npm |

## Estructura del proyecto

```
src/
├── components/
│   ├── audio/AudioPlayer.tsx          ← Reproductor + estado "Próximamente" + disclaimer
│   ├── bible/BibleStudyModal.tsx      ← Modal bíblico + comentario CBA
│   ├── layout/
│   │   ├── AppLayout.astro            ← Shell (header + sidebar + main + footer)
│   │   ├── BaseLayout.astro           ← HTML shell + CSS global
│   │   ├── Brand.astro                ← Ícono + título + divider dorado
│   │   ├── Footer.astro               ← Enlaces destacados + copy
│   │   ├── Header.astro               ← Barra superior navy + hamburguesa
│   │   ├── MobileBottomNav.astro      ← Navegación inferior móvil
│   │   ├── PageHero.astro             ← Hero unificado (home/lección/página)
│   │   ├── Sidebar.astro              ← Menú lateral navy + covers + "Complementos"
│   │   └── StudySidebar.astro         ← Widgets: EGW, PPT, PDF, Reavivados
│   ├── lesson/
│   │   ├── DailyReading.tsx           ← Visor con markdown + detección de referencias
│   │   ├── DayTabs.astro              ← Tabs de días + dropdown móvil
│   │   ├── LessonCard.astro           ← Tarjeta entera clicable con "Lección N"
│   │   └── ManuscriptReader.tsx       ← React island para referencias en la intro
│   └── resources/
│       └── ResourceCard.astro         ← Tarjeta con cover SVG por tipo (sin thumbnails)
├── data/
│   ├── navigation.ts                  ← Nav items (single source of truth)
│   └── quarters/
│       └── 2026-q3.json               ← 13 lecciones, 91 días, ES oficial
├── lib/
│   ├── lessonAdapter.ts               ← Acceso a datos del trimestre
│   ├── bibleAdapter.ts                ← Fetch remoto de Biblia RVA2015 + alias
│   └── commentaryAdapter.ts           ← Fetch remoto de comentario CBA
├── pages/
│   ├── index.astro                    ← Landing: hero + intro + video + lecciones
│   ├── recursos.astro                 ← Galería con filtros dinámicos
│   └── lecciones/
│       ├── [lessonId].astro           ← Redirect al primer día (Sábado)
│       └── [lessonId]/[dayId].astro   ← Lectura diaria completa
├── styles/
│   ├── globals.css                    ← ~2440 líneas, todo el CSS del sitio
│   └── tokens.css                     ← Variables CSS (colores, fuentes, espaciado)
└── types/
    ├── lesson.ts                      ← Tipos Quarter, Lesson, LessonDay
    ├── bible.ts                       ← Tipos BibleReference, BiblePassage
    └── resource.ts                    ← Tipos Resource, AudioResource
```

## Pipeline de contenido

```
Adventech GitHub (stage branch, español oficial)
  └── scripts/audit_content.py         ← Auditoría: compara ES vs fuente EN
  └── scripts/adventech_to_json.py     ← Fetch + parseo del contenido español
       └── src/data/quarters/2026-q3.json  ← 13 lecciones, 91 días, EGW, Reavivados
```

**Fuente español**: `https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/es/2026-03/`

**Fuente inglés** (referencia): `https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/en/2026-03/`

**Para actualizar a otro trimestre**: cambiar `2026-03` en las URLs de los scripts.

### Scripts disponibles

| Script | Propósito |
|--------|-----------|
| `scripts/adventech_to_json.py` | Generar JSON desde Adventech (fetch + parseo) |
| `scripts/audit_content.py` | Auditar contenido comparando ES vs fuente EN |

## Audio

- **Fuente**: `audioescuelasabatica.com`
- **Lección 1**: 7 audios diarios (Sábado a Viernes) con enlaces MP3 directos
- **Lecciones 2-13**: sin audio aún → reproductor muestra "Próximamente" + disclaimer "Audio gentileza de audioescuelasabatica.com"
- **Reproductor**: siempre visible, botones disabled cuando no hay audio

## Recursos descargables

- **PDF por lección**: 13 enlaces a Adventech (descarga externa)
- **Folleto completo**: enlace a Adventech
- **PPT**: lecciones 1-3 con archivos `.pptx` locales; 4-13 ocultos (sin placeholder)
- **Filtros dinámicos**: solo se muestran los tipos con recursos reales disponibles
- **Covers visuales**: SVG por tipo (audio-cover, ppt-cover, pdf-cover) en `public/images/covers/`

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing: hero + introducción + video del autor + lecciones + separadores |
| `/lecciones/[id]/[día]` | Lectura diaria con markdown renderizado, audio, EGW, Reavivados, PPT, PDF |
| `/lecciones/[id]` | Redirect al Sábado |
| `/recursos` | Galería con filtros dinámicos (PDF, Audio, PPT) |

## Navegación

- **Desktop**: Sidebar navy a la izquierda con íconos + nombres + covers al fondo
- **Sidebar covers**: "Complementos para tu estudio diario" — Diálogo Bíblico (YouTube) + Santa Biblia (santabiblia.cloud)
- **Mobile**: Hamburguesa → sidebar overlay. Bottom nav con 4 tabs. Covers en fila horizontal.
- **Enlaces**: Inicio (`/`), Lecciones (`/#lessons-heading`), Recursos (`/recursos`), Biblia (`santabiblia.cloud`, externo)

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

## Tipografía

- **UI**: Manrope / Inter / system-ui
- **Lectura**: Literata / Lora / Georgia (serif)
- **Header**: Cormorant Garamond (título + subtítulo)

## Breakpoints responsive

| Breakpoint | Comportamiento |
|------------|---------------|
| Default | Sidebar visible, grid 4-5 cols |
| ≤1280px | Grids 3 cols, daily-layout 1 col |
| ≤1024px | Sidebar overlay, hamburguesa, bottom nav, 2 cols |
| ≤720px | 1 col, dropdown días, texto justificado 1.08rem |

## Mejoras de legibilidad

- **Referencias bíblicas**: azul más intenso (`#1a5cc7`) con subrayado sutil siempre visible. Color diferenciado para `:visited` (`#7c4d9e`). Detección mejorada: REF_REGEX reemplaza knownRefs más cortos (evita pérdida de rangos).
- **Markdown**: parseo inline en DailyReading (### → h4, #### → h5, > → blockquote, `` ` `` → prompt)
- **Tipografía**: lectura 1.22rem desktop / 1.08rem mobile, line-height 1.82 / 1.75
- **Espaciado**: `.main-content` 28px 36px 56px desktop, tarjetas 16px padding mobile
- **Header**: 80px desktop / 88px mobile

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
