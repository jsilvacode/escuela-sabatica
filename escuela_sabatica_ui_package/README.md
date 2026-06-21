# Paquete de diseño UI — Escuela Sabática moderna

Este paquete reúne la base conceptual, visual y técnica para rediseñar el sitio de Escuela Sabática como una web moderna, responsiva, elegante y fácil de mantener.

El objetivo es que puedas usar estos archivos directamente con Figma, Codex Desktop, OpenCode o cualquier agente de desarrollo.

## Contenido del paquete

```txt
escuela_sabatica_ui_package/
├─ README.md
├─ AGENTS.md
├─ docs/
│  ├─ 01_product_vision.md
│  ├─ 02_prompt_maestro_figma.md
│  ├─ 03_prompt_maestro_codex.md
│  ├─ 04_ux_architecture.md
│  ├─ 05_design_system.md
│  ├─ 06_component_spec.md
│  ├─ 07_data_model.md
│  ├─ 08_bible_commentary_integration.md
│  ├─ 09_content_pipeline.md
│  ├─ 10_responsive_accessibility.md
│  ├─ 11_implementation_plan.md
│  ├─ 12_quality_checklist.md
│  └─ 13_image_generation_prompts.md
├─ examples/
│  ├─ quarter.example.json
│  ├─ bible_reference.example.json
│  └─ component_inventory.example.json
└─ mockups/
   ├─ 01_design_system_board.png
   ├─ 02_home_desktop.png
   ├─ 03_lesson_week_desktop.png
   ├─ 04_daily_reading_desktop_modal.png
   ├─ 05_home_mobile.png
   └─ 06_daily_reading_mobile_modal.png
```

## Uso recomendado

1. Revisa primero `docs/01_product_vision.md`.
2. Usa `docs/02_prompt_maestro_figma.md` para crear o extender el diseño en Figma.
3. Entrega a Codex Desktop/OpenCode los archivos `AGENTS.md`, `docs/03_prompt_maestro_codex.md` y la carpeta `mockups/`.
4. Implementa primero la versión web responsiva.
5. Deja la conversión a PWA como fase posterior, salvo que desde el inicio quieras lectura offline, instalación móvil y caché local.

## Decisión técnica sugerida

Para esta primera etapa conviene desarrollar una **web app responsiva** con arquitectura preparada para PWA, pero sin agregar complejidad innecesaria.

Stack sugerido:

- Astro como base de sitio de contenido.
- React para componentes interactivos: modal bíblico, buscador, reproductor de audio, selector de días.
- Tailwind CSS o CSS modular con tokens de diseño.
- JSON como fuente de contenido.
- Vercel o Netlify para despliegue.

## Principio central

La Escuela Sabática debe sentirse como una experiencia integrada de estudio bíblico, no como un PDF convertido a HTML.

Cada referencia bíblica debe ser interactiva: al tocarla o hacer clic, debe abrir un modal con el texto bíblico y la opción de consultar el comentario bíblico adventista correspondiente.
