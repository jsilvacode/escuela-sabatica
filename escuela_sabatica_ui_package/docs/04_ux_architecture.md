# 04 — Arquitectura UX

## Mapa general del sitio

```txt
Inicio
├─ Hero del trimestre
├─ Resumen del trimestre
├─ Versículo del trimestre
├─ Lecciones destacadas / grilla de 13
└─ Recursos principales

Lecciones
├─ Listado de 13 lecciones
└─ Detalle de lección semanal
   ├─ Introducción de la semana
   ├─ Selector de días
   ├─ Lectura diaria
   ├─ Audio
   ├─ Referencias bíblicas
   └─ Recursos relacionados

Biblia
├─ Buscador bíblico
├─ Selector libro/capítulo/versículo
├─ Lectura bíblica
└─ Comentario bíblico

Recursos
├─ PDF
├─ PPT
├─ Audios
├─ Material para maestros
└─ Complementarios

Marcadores
├─ Versículos guardados
├─ Lecciones guardadas
└─ Destacados

Notas
└─ Notas personales por día/lección
```

## Flujo principal de usuario

1. Usuario entra al inicio.
2. Lee el resumen del trimestre.
3. Selecciona una lección.
4. Entra a la vista semanal.
5. Selecciona el día correspondiente.
6. Lee la lección diaria.
7. Toca una referencia bíblica.
8. Se abre modal con Biblia.
9. Puede cambiar a Comentario.
10. Puede copiar, compartir, marcar, destacar o abrir en Biblia completa.

## Patrones de navegación

### Escritorio

- Header superior fijo.
- Sidebar izquierda persistente.
- Contenido principal centrado.
- Panel derecho contextual en vistas de estudio.

### Tablet

- Sidebar colapsable.
- Contenido principal a dos columnas cuando el ancho lo permite.
- Panel derecho puede bajar bajo el contenido o transformarse en acordeón.

### Móvil

- Header compacto.
- Bottom navigation.
- Selector de días horizontal.
- Modal bíblico como bottom sheet.
- Menos widgets laterales visibles de forma simultánea.

## Pantallas principales

### Home

Objetivo: introducir el trimestre y llevar rápidamente a las lecciones.

Componentes:

- Header.
- Sidebar / navegación.
- Hero.
- Versículo del trimestre.
- Resumen.
- Buscador.
- Grilla de lecciones.
- Recursos.

### Lección semanal

Objetivo: presentar la semana completa y permitir elegir día.

Componentes:

- Hero de lección.
- Selector de días.
- Resumen del día activo.
- Referencias de estudio.
- Progreso semanal.
- Recursos de la semana.

### Lectura diaria

Objetivo: leer con concentración.

Componentes:

- Título del día.
- Imagen.
- Audio.
- Texto largo.
- Referencias bíblicas interactivas.
- Bloque de versículo clave.
- Modal bíblico.
- Notas y marcadores.

### Recursos

Objetivo: acceder a materiales complementarios.

Componentes:

- Filtros.
- Tarjetas.
- Descargas.
- Categorías.

## Jerarquía de información

1. Título del trimestre o lección.
2. Día o semana activa.
3. Texto principal.
4. Referencias bíblicas.
5. Audio.
6. Recursos.
7. Notas, marcadores y acciones secundarias.

## Estados importantes

- Lección completada.
- Día activo.
- Referencia bíblica hover.
- Referencia bíblica activa.
- Modal abierto.
- Biblia activa.
- Comentario activo.
- Marcador guardado.
- Destacado aplicado.
- Audio reproduciendo.
- Búsqueda sin resultados.
