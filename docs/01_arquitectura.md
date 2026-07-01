# 01 — Arquitectura

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 (SSG con partial hydration) |
| UI Interactiva | React 19 (islands architecture) |
| Lenguaje | TypeScript 6 |
| CSS | Vanilla con CSS custom properties |
| Contenido | JSON estático generado desde Adventech |
| Build | Vite (vía Astro) |

## Principios

- **Zero JS por defecto**: solo los componentes interactivos se hidratan (React islands)
- **Contenido desacoplado**: el JSON del trimestre se genera desde una fuente externa
- **CSS global con tokens**: variables CSS para consistencia, sin Tailwind
- **Tipado estricto**: TypeScript en todo el proyecto

## Flujo de datos

```
Adventech GitHub (stage branch)
  ↓  scripts/adventech_to_json.py (fetch + parse + traducción)
  ↓
src/data/quarters/2026-q3.json (13 lecciones, 91 días)
  ↓  lessonAdapter.ts
  ↓
Astro pages (index.astro, [lessonId]/[dayId].astro)
  ↓
React islands (DailyReading, ManuscriptReader, BibleStudyModal)
  ↓
santabiblia.cloud (Biblia RVA2015 + CBA commentary, vía fetch)
```

## Rutas del sitio

| Ruta | Página | Tipo |
|------|--------|------|
| `/` | Landing: hero, introducción, lecciones, enlaces | Astro + React islands |
| `/lecciones/[id]/[día]` | Lectura diaria | Astro + React islands |
| `/lecciones/[id]` | Redirect → Sábado | Astro |
| `/recursos` | Galería con filtros | Astro |

## Componentes clave

| Componente | Tipo | Responsabilidad |
|-----------|------|----------------|
| `AppLayout.astro` | Astro | Shell: header + sidebar + main |
| `BaseLayout.astro` | Astro | HTML shell + CSS global |
| `Header.astro` | Astro | Barra superior navy |
| `Sidebar.astro` | Astro | Menú lateral con covers |
| `PageHero.astro` | Astro | Hero unificado |
| `StudySidebar.astro` | Astro | Widgets: EGW, Reavivados, PPT |
| `DailyReading.tsx` | React | Visor de contenido + detección de refs |
| `ManuscriptReader.tsx` | React | Referencias en la introducción |
| `BibleStudyModal.tsx` | React | Modal bíblico + CBA |
| `AudioPlayer.tsx` | React | Reproductor minimalista |

## Caché y rendimiento

- **Biblia**: fetch desde `santabiblia.cloud/data/rva2015/` con caché en memoria por sesión
- **Comentario**: fetch desde `santabiblia.cloud/data/cba/` con caché por capítulo
- **Manifiesto**: `books.json` se carga una vez y se cachea
- **Lecciones**: JSON estático importado en build time (0KB de fetch en runtime)
