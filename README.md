# Escuela Sabática CL v2.0

Plataforma web de estudio bíblico para la Escuela Sabática Adventista. Lectura diaria, audio, comentarios de Elena G. White y Biblia integrada.

**Trimestre actual**: 3er trimestre 2026 — 1° y 2° Corintios

## Tecnología

Astro 6 · React 19 · TypeScript · CSS vanilla con tokens

## Comandos

```bash
npm install        # Instalar dependencias
npm run dev        # Desarrollo en http://localhost:4321
npm run build      # Build estático → dist/
npm test           # TypeScript validation
npm run clean      # Limpiar build
```

## Estructura

```
src/
├── components/     # Astro + React islands
├── data/           # JSON de contenido
├── lib/            # Adaptadores (Biblia, lecciones, comentario)
├── pages/          # Rutas del sitio
├── styles/         # CSS global + tokens
└── types/          # TypeScript types
```

## Documentación técnica

- [Arquitectura](docs/01_arquitectura.md)
- [Pipeline de contenido](docs/02_pipeline_contenido.md)
- [Sistema de referencias bíblicas](docs/03_sistema_referencias.md)
- [Diseño](docs/04_diseno.md)
- [Integración bíblica](docs/05_biblia.md)
- [UX/UI](docs/06_ux_ui.md)

## Créditos

Desarrollado por Raúl Medina & Julio Silva.  
Contenido de [Adventech](https://sabbath-school.adventech.io).  
Audios de Adult Bible Study Guides.
