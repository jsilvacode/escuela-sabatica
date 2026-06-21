# 11 — Plan de implementación

## Fase 0 — Preparación

- Revisar documentación del paquete.
- Definir stack definitivo.
- Crear repositorio GitHub.
- Configurar deploy inicial en Vercel o Netlify.
- Agregar carpeta `docs/` y `mockups/` al repo.

## Fase 1 — Base del proyecto

Tareas:

- Crear proyecto Astro.
- Configurar TypeScript.
- Configurar Tailwind o CSS Modules.
- Crear variables CSS.
- Crear estructura de carpetas.
- Crear layout base.

Resultado esperado:

- Sitio arranca localmente.
- Header, Sidebar y Footer visibles.
- Estilos base cargados.

## Fase 2 — Sistema visual

Tareas:

- Implementar tokens.
- Implementar botones.
- Implementar cards.
- Implementar tabs.
- Implementar chips.
- Implementar estados hover/focus.

Resultado esperado:

- Biblioteca de componentes UI base.

## Fase 3 — Datos de ejemplo

Tareas:

- Crear `quarter.example.json` realista.
- Crear tipos TypeScript.
- Crear `lessonAdapter`.
- Renderizar 13 lecciones desde JSON.

Resultado esperado:

- Home dinámica desde JSON.

## Fase 4 — Home

Tareas:

- Hero.
- Versículo del trimestre.
- Resumen del tema.
- Buscador visual.
- Grilla de lecciones.
- Recursos destacados.

Resultado esperado:

- Página inicial similar al mockup desktop y móvil.

## Fase 5 — Lección semanal

Tareas:

- Ruta `/lecciones/[lessonId]`.
- Header de lección.
- Selector de días.
- Resumen del día activo.
- Recursos semanales.
- Panel lateral.

Resultado esperado:

- Vista semanal navegable.

## Fase 6 — Lectura diaria

Tareas:

- Ruta `/lecciones/[lessonId]/[dayId]`.
- Artículo de lectura.
- Audio player.
- Bloque de versículo clave.
- Referencias bíblicas interactivas.
- Navegación anterior/siguiente.

Resultado esperado:

- Experiencia de lectura cómoda.

## Fase 7 — Biblia y comentario

Tareas:

- Crear `bibleAdapter`.
- Crear `commentaryAdapter`.
- Crear `BibleReferenceLink`.
- Crear `BibleModal`.
- Implementar tabs Biblia / Comentario.
- Implementar acciones básicas: copiar, compartir, cerrar.

Resultado esperado:

- Clic en referencia abre modal con Biblia y Comentario.

## Fase 8 — Recursos

Tareas:

- Página `/recursos`.
- Filtros.
- Tarjetas.
- Descargas.
- Clasificación por tipo.

## Fase 9 — Responsive

Tareas:

- Ajustar móvil.
- Crear bottom nav.
- Convertir modal a bottom sheet.
- Optimizar grillas.

## Fase 10 — Calidad

Tareas:

- Revisar accesibilidad.
- Probar teclado.
- Probar móvil.
- Optimizar imágenes.
- Revisar performance.
- Documentar cómo cargar nuevo trimestre.

## PWA futura

Agregar solo si se decide:

- `manifest.webmanifest`.
- service worker.
- caché de assets.
- caché de lecciones.
- offline fallback.
- instalación.
