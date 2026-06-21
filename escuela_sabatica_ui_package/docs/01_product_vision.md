# 01 — Visión de producto

## Nombre de trabajo

**Escuela Sabática — Estudio de la Palabra**

## Propósito

Rediseñar el sitio de Escuela Sabática como una experiencia moderna de lectura, estudio bíblico y acceso a recursos semanales, manteniendo una arquitectura simple y fácil de administrar.

El sitio debe resolver tres necesidades principales:

1. Leer cómodamente las lecciones trimestrales.
2. Navegar con claridad entre semanas y días.
3. Consultar textos bíblicos y comentario bíblico sin abandonar la lectura.

## Público objetivo

- Miembros de Iglesia Adventista que estudian la lección semanal.
- Maestros de Escuela Sabática.
- Grupos pequeños y líderes de estudio.
- Personas que leen desde celular durante la semana.
- Personas que usan escritorio o tablet para preparar clases y cultos.

## Problema actual

El sitio existente cumple una función informativa, pero su experiencia visual y de navegación se percibe antigua. La lectura no tiene suficiente jerarquía editorial, la adaptación móvil puede mejorar y las referencias bíblicas pueden transformarse en una experiencia interactiva mucho más poderosa.

## Propuesta

Construir una web responsiva con apariencia de aplicación moderna, centrada en lectura, con integración bíblica contextual.

No debe sentirse como un PDF pegado en una página, sino como una plataforma de estudio:

- Inicio con tema del trimestre.
- Listado de 13 lecciones.
- Vista semanal con selector de días.
- Lectura diaria con audio.
- Referencias bíblicas clicables.
- Modal con Biblia y Comentario Bíblico Adventista.
- Recursos descargables.
- Buscador de lecciones, temas y referencias.

## Decisión web vs PWA

La primera versión debe ser una **web app responsiva**.

Esto significa:

- Funciona bien en cualquier navegador.
- Se adapta a escritorio, tablet y móvil.
- Usa datos desde JSON.
- Puede desplegarse fácilmente en Vercel o Netlify.

La PWA debe quedar como evolución natural si se decide agregar:

- Instalación en celular.
- Lectura offline.
- Caché local de lecciones.
- Progreso persistente.
- Marcadores sincronizados.
- Notificaciones.

## Principios de diseño

- Lectura cómoda sobre todo.
- Navegación simple.
- Apariencia elegante y espiritual.
- Sin estética infantil.
- Sin sobrecargar con funciones innecesarias.
- Integración fluida con Biblia y Comentario.
- Fácil mantenimiento de contenido trimestral.

## Frase guía

> Una plataforma moderna para estudiar la Escuela Sabática con la Biblia y el comentario al alcance de un toque.
