# 12 — Checklist de calidad

## Diseño

- [ ] Se ve moderno, elegante y espiritual.
- [ ] No parece blog antiguo.
- [ ] No parece dashboard administrativo.
- [ ] Usa paleta consistente.
- [ ] Usa tipografía cómoda para lectura.
- [ ] Las tarjetas tienen jerarquía clara.
- [ ] Los botones tienen estados visibles.
- [ ] Las referencias bíblicas se reconocen como interactivas.

## UX

- [ ] El usuario puede llegar a una lección en máximo 2 clics desde home.
- [ ] El usuario puede cambiar de día fácilmente.
- [ ] El usuario puede volver a la lista de lecciones.
- [ ] El usuario puede abrir Biblia desde una referencia.
- [ ] El usuario puede abrir Comentario desde el modal.
- [ ] El audio no interrumpe la lectura.
- [ ] Los recursos son fáciles de encontrar.

## Responsive

- [ ] Home funciona en móvil.
- [ ] Vista semanal funciona en móvil.
- [ ] Lectura diaria funciona en móvil.
- [ ] Modal bíblico funciona como bottom sheet.
- [ ] Bottom nav no tapa contenido importante.
- [ ] Los textos no quedan demasiado pequeños.

## Accesibilidad

- [ ] Contraste correcto.
- [ ] Navegable con teclado.
- [ ] Modal accesible.
- [ ] Imágenes con alt.
- [ ] Botones con labels claros.
- [ ] Focus visible.

## Datos

- [ ] JSON válido.
- [ ] 13 lecciones cargadas.
- [ ] 7 días por lección.
- [ ] Referencias bíblicas normalizadas.
- [ ] Audios con URL válida.
- [ ] Recursos con tipo y URL.

## Integración bíblica

- [ ] `BibleReferenceLink` abre modal.
- [ ] Modal muestra referencia correcta.
- [ ] Pestaña Biblia funciona.
- [ ] Pestaña Comentario funciona.
- [ ] Botón copiar funciona.
- [ ] Botón abrir en Biblia funciona o queda preparado.

## Rendimiento

- [ ] Imágenes optimizadas.
- [ ] No cargar Biblia completa en el bundle inicial si no es necesario.
- [ ] Lazy load para comentario y pasajes.
- [ ] CSS sin exceso.
- [ ] Componentes interactivos solo donde se necesitan.

## Mantenimiento

- [ ] Existe guía para cargar nuevo trimestre.
- [ ] El contenido no está hardcodeado en componentes.
- [ ] Los datos están separados de la UI.
- [ ] Los componentes son reutilizables.
- [ ] Hay README actualizado.
