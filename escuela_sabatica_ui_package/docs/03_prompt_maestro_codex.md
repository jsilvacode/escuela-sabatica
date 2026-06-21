# 03 — Prompt maestro para Codex Desktop / OpenCode

Usa este prompt al iniciar el proyecto en Codex Desktop u OpenCode.

---

## Prompt

Quiero que implementes una web moderna, responsiva y fácil de mantener para un sitio de Escuela Sabática Adventista.

Antes de escribir código, lee cuidadosamente:

- `README.md`
- `AGENTS.md`
- todos los archivos dentro de `docs/`
- las imágenes dentro de `mockups/`
- los JSON de ejemplo dentro de `examples/`

## Objetivo

Crear una web app responsiva para lectura de lecciones trimestrales de Escuela Sabática, con integración bíblica interactiva.

Debe incluir:

- Página de inicio.
- Listado de 13 lecciones.
- Vista de lección semanal.
- Vista de lectura diaria.
- Modal para referencias bíblicas.
- Pestañas Biblia / Comentario dentro del modal.
- Buscador básico.
- Reproductor de audio.
- Recursos descargables.
- Layout responsive.

## Stack recomendado

Implementa preferentemente con:

- Astro.
- TypeScript.
- React solo para componentes interactivos.
- CSS variables + Tailwind CSS o CSS Modules.
- JSON local como fuente de datos inicial.

Si el proyecto ya existe con otro stack, respeta la estructura actual y adapta la implementación sin reescribir todo innecesariamente.

## Principios técnicos

- El contenido de lecciones debe venir desde JSON.
- Los textos bíblicos deben resolverse desde un servicio/adaptador de Biblia.
- El Comentario Bíblico Adventista debe resolverse desde un servicio/adaptador separado.
- No duplicar lógica de lectura bíblica dentro de cada componente.
- Crear componentes reutilizables.
- Mantener rendimiento alto.
- Preparar arquitectura para futura PWA, pero no implementarla todavía salvo que se solicite.

## Arquitectura sugerida

```txt
src/
├─ components/
│  ├─ layout/
│  ├─ lesson/
│  ├─ bible/
│  ├─ audio/
│  ├─ resources/
│  └─ ui/
├─ data/
│  ├─ quarters/
│  ├─ bible/
│  └─ commentary/
├─ lib/
│  ├─ bibleAdapter.ts
│  ├─ commentaryAdapter.ts
│  ├─ lessonAdapter.ts
│  └─ search.ts
├─ pages/
│  ├─ index.astro
│  ├─ lecciones/
│  ├─ recursos.astro
│  └─ biblia.astro
├─ styles/
│  ├─ globals.css
│  └─ tokens.css
└─ types/
   ├─ lesson.ts
   ├─ bible.ts
   └─ resource.ts
```

## Implementación por etapas

### Etapa 1 — Base visual

- Configura tokens CSS.
- Crea layout principal.
- Crea Header, Sidebar, Footer.
- Implementa navegación responsive.

### Etapa 2 — Home

- Hero del trimestre.
- Versículo del trimestre.
- Resumen del tema.
- Grilla de 13 lecciones.
- Recursos destacados.

### Etapa 3 — Lecciones

- Vista semanal.
- Selector de días.
- Vista diaria.
- Navegación entre días.

### Etapa 4 — Integración bíblica

- Detecta referencias bíblicas en el contenido.
- Renderiza referencias como links interactivos.
- Al hacer clic, abre modal.
- Modal muestra Biblia y Comentario.

### Etapa 5 — Recursos y audio

- Tarjetas de recursos.
- Reproductor de audio.
- Descargas.

### Etapa 6 — Responsive y calidad

- Ajustar móvil.
- Accesibilidad.
- Estados hover/focus.
- Optimización.

## Resultado esperado

Una primera versión funcional, visualmente cercana a los mockups, con código limpio y modular, preparada para recibir contenido real generado desde PDF → Markdown → JSON.
