# 02 — Prompt maestro para Figma

Usar este prompt en Figma AI, Magician, Galileo, Uizard, Relume, v0 visual o cualquier herramienta de generación de interfaz. También sirve como brief para un diseñador humano.

---

## Prompt

Diseña una interfaz web moderna, elegante, responsiva y fácil de mantener para un sitio de lectura y estudio bíblico orientado a la Escuela Sabática Adventista.

El sitio ya existe, pero actualmente tiene una apariencia antigua, poco adaptativa y con una experiencia de usuario limitada. El objetivo es rediseñarlo con una estética contemporánea, limpia, cálida, espiritual y profesional, manteniendo una estructura simple que pueda implementarse fácilmente como sitio web responsivo. El diseño debe considerar que en el futuro podría transformarse en PWA, pero la prioridad inicial es una web moderna, rápida, clara y fácil de mantener.

## Contexto general

El sitio contiene material de estudio trimestral de la Escuela Sabática Adventista. Cada trimestre incluye 13 lecciones, una por semana. Cada lección tiene un tema central y se divide en lecturas diarias desde sábado hasta viernes. El viernes funciona como resumen semanal para preparar el estudio del sábado por la mañana.

## Objetivo visual

Crear una experiencia de lectura agradable, espiritual, moderna y ordenada. El diseño debe transmitir calma, claridad, reflexión, estudio bíblico, confianza y profundidad. Debe verse actual, elegante y muy atractivo visualmente, pero sin sentirse sobrecargado ni difícil de implementar.

El sitio debe sentirse como una plataforma de lectura bíblica moderna, no como un blog antiguo ni como un dashboard administrativo.

## Estilo visual

- Moderno, editorial y premium.
- Cálido, espiritual y sobrio.
- Interfaz clara, con mucho espacio en blanco.
- Tarjetas elegantes, bordes redondeados y sombras suaves.
- Paleta basada en azul profundo, blanco cálido, arena, dorado suave y verde oliva.
- Evitar colores chillones, estética infantil o exceso de iconografía religiosa.

## Pantallas a diseñar

### 1. Página de inicio

Debe incluir:

- Header fijo.
- Sidebar izquierda en escritorio.
- Hero visual del trimestre.
- Título del trimestre.
- Subtítulo breve.
- Resumen del tema del trimestre.
- Versículo del trimestre.
- Barra de búsqueda.
- Grilla de 13 lecciones.
- Tarjetas de recursos: PDF, audio, presentaciones, material para maestros.
- Footer simple.

### 2. Página de lección semanal

Debe incluir:

- Encabezado de lección con imagen.
- Número de lección.
- Título.
- Rango de fechas.
- Botones: Continuar lección, Escuchar audio.
- Selector de días: Sábado, Domingo, Lunes, Martes, Miércoles, Jueves, Viernes.
- Resumen del día seleccionado.
- Referencias bíblicas como chips o enlaces clicables.
- Widgets laterales: versículo clave, progreso semanal, notas rápidas, recursos.

### 3. Página de lectura diaria

Debe incluir:

- Título del día.
- Imagen de encabezado.
- Selector de días compacto.
- Reproductor de audio.
- Cuerpo de lectura con tipografía cómoda.
- Bloque de versículo clave.
- Referencias bíblicas interactivas dentro del texto.
- Navegación entre día anterior y día siguiente.
- Panel lateral con progreso, notas, marcadores y acciones.

### 4. Modal bíblico

Cuando el usuario haga clic o toque una referencia bíblica, debe abrirse un modal con:

- Referencia seleccionada.
- Pestañas: Biblia y Comentario.
- Texto bíblico completo.
- Selector de versión bíblica si aplica.
- Botones: Copiar, Compartir, Marcar, Destacar, Abrir en Biblia.
- Cierre claro.

En escritorio puede ser modal centrado o panel lateral elegante.
En móvil debe ser bottom sheet.

### 5. Recursos

Debe incluir:

- Filtros por tipo: PDF, audio, PPT, material complementario, maestros.
- Tarjetas o filas claras.
- Botones de descarga.
- Íconos reconocibles.

## Componentes reutilizables

Diseñar los siguientes componentes:

- Header fijo.
- Sidebar.
- Menú móvil.
- Hero.
- Card de lección.
- Card de recurso.
- Selector de días desktop.
- Selector de días móvil.
- Chip de referencia bíblica.
- Link bíblico inline.
- Bloque de versículo.
- Modal de Biblia.
- Tab Biblia / Comentario.
- Reproductor de audio.
- Buscador global.
- Botón primario.
- Botón secundario.
- Estado hover.
- Estado activo.
- Estado disabled.
- Footer.

## Paleta sugerida

- Azul profundo: `#0B1D33`
- Azul suave: `#316395`
- Marfil cálido: `#FAF7F1`
- Arena: `#E7DCC2`
- Oro suave: `#D4AF37`
- Gris pizarra: `#334155`
- Oliva suave: `#6B7F5E`

## Tipografías sugeridas

- Interfaz: Manrope, Inter o Source Sans 3.
- Lectura larga: Literata, Lora, Merriweather o Source Serif 4.

Recomendación principal:

- UI: Manrope.
- Lectura: Literata.

## Requisitos responsive

- Desktop: layout con header superior, sidebar izquierda y contenido principal.
- Tablet: sidebar colapsable, tarjetas reorganizadas.
- Móvil: navegación inferior, menú compacto, selector de días horizontal o dropdown, modal bíblico como bottom sheet.

## Resultado esperado

Generar un diseño completo en Figma, con componentes reutilizables y pantallas principales listas para handoff a desarrollo. El diseño debe comunicar claramente la experiencia de estudio bíblico integrada con Biblia y Comentario.
