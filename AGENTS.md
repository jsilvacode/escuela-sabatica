# AGENTS.md — Escuela Sabática CL v2.0

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 |
| UI interactiva | React 19 (islands) |
| Lenguaje | TypeScript |
| CSS | Vanilla con CSS custom properties (tokens) |
| Contenido | JSON estático generado desde Adventech |
| Paquetería | npm |

## Estructura del proyecto

```
src/
├── components/
│   ├── audio/AudioPlayer.tsx          ← Reproductor minimalista con progreso
│   ├── bible/BibleStudyModal.tsx      ← Modal de estudio bíblico
│   ├── layout/
│   │   ├── AppLayout.astro            ← Shell principal (header + sidebar + main + footer)
│   │   ├── BaseLayout.astro           ← HTML shell + CSS global
│   │   ├── Brand.astro                ← Ícono + título + divider dorado
│   │   ├── Footer.astro               ← Enlaces destacados + copy
│   │   ├── Header.astro               ← Barra superior navy con hamburguesa
│   │   ├── MobileBottomNav.astro      ← Navegación inferior móvil
│   │   ├── PageHero.astro             ← Hero unificado (home/lección/página)
│   │   ├── Sidebar.astro              ← Menú lateral navy + covers
│   │   └── StudySidebar.astro         ← Widgets: EGW, Reavivados, PPT, recursos
│   ├── lesson/
│   │   ├── DailyReading.tsx           ← Visor de contenido con referencias bíblicas
│   │   ├── DayTabs.astro              ← Tabs de días + dropdown móvil
│   │   ├── LessonCard.astro           ← Tarjeta con imagen de fondo
│   │   ├── QuarterHero.astro          ← (legado, reemplazado por PageHero)
│   │   └── WeekLessonHeader.astro     ← Metadatos de lección + tabs
│   └── resources/
│       └── ResourceCard.astro         ← Tarjeta tipo galería con thumbnail
├── data/
│   ├── navigation.ts                  ← Nav items (single source of truth)
│   └── quarters/
│       ├── 2026-q3.json               ← Contenido completo en español (13 lecciones)
│       └── 2026-q3-en.json            ← Contenido en inglés (fuente Adventech)
├── lib/
│   ├── lessonAdapter.ts               ← Acceso a datos del trimestre
│   ├── bibleAdapter.ts                ← Búsqueda de pasajes bíblicos
│   ├── commentaryAdapter.ts           ← Comentario bíblico
│   └── search.ts                      ← Búsqueda local (no usado actualmente)
├── pages/
│   ├── index.astro                    ← Landing: hero + intro manuscrita + lecciones
│   ├── recursos.astro                 ← Galería con filtros PDF/Audio/PPT
│   └── lecciones/
│       ├── [lessonId].astro           ← Redirect al primer día (Sábado)
│       └── [lessonId]/[dayId].astro   ← Lectura diaria completa
├── styles/
│   ├── globals.css                    ← ~2100 líneas, todo el CSS del sitio
│   └── tokens.css                     ← Variables CSS (colores, fuentes, espaciado)
└── types/
    ├── lesson.ts                      ← Tipos Quarter, Lesson, LessonDay
    ├── bible.ts                       ← Tipos BibleReference, BiblePassage
    └── resource.ts                    ← Tipos Resource, AudioResource
```

## Pipeline de contenido

```
Adventech GitHub (stage branch)
  └── scripts/adventech_to_json.py     ← Fetch + parseo + traducción
       └── src/data/quarters/2026-q3.json  ← 13 lecciones, 91 días, EGW, Reavivados
```

**Fuente**: `https://raw.githubusercontent.com/Adventech/sabbath-school-lessons/stage/src/en/2026-03/`

**Para actualizar a otro trimestre**: cambiar `2026-03` en `BASE_URL` del script.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing: hero + versículo + introducción + lecciones + enlaces destacados |
| `/lecciones/[id]/[día]` | Lectura diaria con contenido, audio, EGW, Reavivados |
| `/lecciones/[id]` | Redirect al Sábado |
| `/recursos` | Galería de recursos con filtros |

## Navegación

- **Desktop**: Sidebar navy a la izquierda con íconos + nombres + covers al fondo
- **Mobile**: Hamburguesa → sidebar overlay. Bottom nav con 4 tabs
- **Enlaces**: Inicio (`/`), Lecciones (`/#lessons-heading`), Recursos (`/recursos`), Biblia (`santabiblia.cloud`, externo)

## Paleta de diseño

| Uso | Color | Hex |
|-----|-------|-----|
| Navy principal | `--color-navy-900` | `#0b1d33` |
| Gold acento | `--color-gold-500` | `#d4af37` |
| Ivory fondo | `--color-ivory-50` | `#faf7f1` |
| Título header | cream | `#f3ecdd` |
| Subtítulo header | gold | `#c9a96e` |

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
| ≤720px | 1 col, dropdown días, texto justificado 1rem |

## Comandos

```bash
npm run dev        # Servidor desarrollo en :4321
npm run build      # Build estático → dist/
npm run check      # TypeScript check
```

## Créditos

Desarrollado por Raúl Medina & Julio Silva.  
Contenido de Adventech (sabbath-school.adventech.io).  
Audios de Adult Bible Study Guides.
