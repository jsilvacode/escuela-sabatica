# AGENTS.md — Instrucciones para Codex Desktop / OpenCode

## Rol del agente

Actúa como diseñador-desarrollador senior especializado en interfaces web de lectura, arquitectura frontend mantenible y experiencia de usuario responsiva.

Tu objetivo es implementar una web moderna para Escuela Sabática basada en los documentos de este paquete y en los mockups visuales entregados.

## Reglas generales

- Lee primero `README.md` y luego todos los archivos dentro de `docs/`.
- Usa los mockups de `mockups/` como referencia visual, no como copia exacta pixel a pixel.
- Prioriza legibilidad, navegación clara, rendimiento y facilidad de mantenimiento.
- No construyas un dashboard complejo. El producto debe sentirse como plataforma de lectura y estudio bíblico.
- No uses dependencias innecesarias.
- No bloquees el avance por detalles menores. Implementa una primera versión sólida y extensible.

## Stack recomendado

- Astro para estructura, rutas y contenido.
- React solo para islas interactivas.
- TypeScript para tipos de datos.
- Tailwind CSS o CSS Modules con variables CSS.
- JSON local para contenido inicial.

## Fases de implementación

1. Crear estructura base del proyecto.
2. Crear tokens visuales globales.
3. Implementar layout principal: header, sidebar, contenido, footer.
4. Implementar home con hero, resumen y 13 tarjetas.
5. Implementar vista de lección semanal.
6. Implementar vista de lectura diaria.
7. Implementar modal de texto bíblico y comentario.
8. Implementar buscador básico.
9. Implementar recursos descargables.
10. Optimizar responsive, accesibilidad y rendimiento.

## Criterios de aceptación

- La web debe funcionar correctamente en escritorio, tablet y móvil.
- Las referencias bíblicas deben verse como enlaces interactivos.
- El modal bíblico debe abrirse sin navegar fuera de la lectura.
- El diseño debe respetar la paleta, tipografía y estructura indicadas.
- El contenido debe venir desde JSON o una capa de datos desacoplada.
- El proyecto debe quedar preparado para futura PWA.

## Restricciones

- No hardcodear contenido extenso dentro de componentes.
- No duplicar lógica de Biblia y Comentario si puede crearse un adaptador compartido.
- No transformar todo en SPA pesada si una web de contenido con islas interactivas resuelve el caso.
- No usar estilos visuales infantiles, recargados o genéricos.
