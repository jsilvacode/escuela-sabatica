# 06 — Especificación de componentes

## 1. AppLayout

Contenedor general.

Incluye:

- Header.
- Sidebar desktop.
- Main.
- Footer.
- MobileBottomNav.

Props sugeridas:

```ts
type AppLayoutProps = {
  children: React.ReactNode;
  activeSection?: 'home' | 'lessons' | 'resources' | 'bible' | 'bookmarks' | 'notes';
};
```

## 2. Header

Debe ser fijo o sticky.

Elementos:

- Logo.
- Navegación principal.
- Buscador.
- Notificaciones opcionales.
- Perfil opcional.
- CTA "Comenzar estudio".

Estados:

- normal;
- sticky con sombra ligera;
- menú móvil abierto.

## 3. Sidebar

Solo escritorio y tablet grande.

Items:

- Inicio.
- Lecciones.
- Recursos.
- Santa Biblia.
- Marcadores.
- Notas.
- Ajustes.

Debe incluir una tarjeta inferior de integración con Santa Biblia.

## 4. MobileBottomNav

Visible en móvil.

Items:

- Inicio.
- Lecciones.
- Biblia.
- Recursos.
- Perfil.

## 5. QuarterHero

Hero de inicio.

Contenido:

- Tema del trimestre.
- Rango de fechas.
- Subtítulo.
- Imagen.
- CTA primario.
- CTA secundario.

## 6. LessonCard

Tarjeta para cada una de las 13 lecciones.

Campos:

```ts
type LessonCardProps = {
  number: number;
  title: string;
  dateRange: string;
  summary?: string;
  image?: string;
  progress?: number;
  isCompleted?: boolean;
  href: string;
};
```

Estados:

- default;
- hover;
- activa;
- completada;
- bloqueada opcional.

## 7. WeekLessonHeader

Encabezado de lección semanal.

Contenido:

- Número de lección.
- Título.
- Rango de fechas.
- Imagen.
- Introducción.
- Botones: continuar, escuchar audio.

## 8. DaySelector

Desktop:

```txt
[Sábado] [Domingo] [Lunes] [Martes] [Miércoles] [Jueves] [Viernes]
```

Móvil:

- chips horizontales;
- dropdown;
- carrusel compacto.

Props:

```ts
type DaySelectorProps = {
  days: LessonDay[];
  activeDayId: string;
  onChange: (dayId: string) => void;
};
```

## 9. DailyReading

Componente de lectura diaria.

Incluye:

- título;
- imagen;
- audio;
- versículo clave;
- contenido renderizado desde Markdown/JSON;
- referencias bíblicas interactivas;
- navegación anterior/siguiente.

## 10. BibleReferenceLink

Representa una referencia bíblica clicable dentro del texto.

Ejemplo visual:

```txt
(Génesis 1:1)
```

Comportamiento:

- hover: subrayado o fondo sutil;
- click/tap: abre `BibleModal`;
- debe enviar libro, capítulo y versículos al adaptador bíblico.

Props:

```ts
type BibleReferenceLinkProps = {
  reference: string;
  children?: React.ReactNode;
};
```

## 11. BibleModal

Modal principal para referencia bíblica.

Contenido:

- título de referencia;
- tabs: Biblia / Comentario;
- texto bíblico;
- selector de versión;
- acciones: copiar, compartir, guardar, destacar, abrir en Biblia.

Desktop:

- modal centrado o panel lateral.

Móvil:

- bottom sheet.

Props:

```ts
type BibleModalProps = {
  reference: BibleReference;
  isOpen: boolean;
  onClose: () => void;
};
```

## 12. AudioPlayer

Reproductor de audio embebido.

Elementos:

- play/pause;
- barra de progreso;
- duración;
- velocidad;
- título;
- opcional: 15 segundos atrás/adelante.

## 13. ResourceCard

Tarjeta para recursos descargables.

Tipos:

- PDF.
- PPT.
- Audio.
- Video.
- Guía.
- Comentario.

## 14. SearchOverlay

Buscador global.

Debe buscar:

- lecciones;
- días;
- referencias;
- temas;
- recursos.

Primera versión puede ser búsqueda local sobre JSON.

## 15. VerseBlock

Bloque destacado para versículos.

Contenido:

- referencia;
- texto;
- ícono;
- acción opcional para abrir modal.

## Reglas de implementación

- Los componentes de UI no deben conocer el origen exacto del dato.
- Los adaptadores (`lessonAdapter`, `bibleAdapter`, `commentaryAdapter`) deben resolver la data.
- El modal bíblico debe ser reutilizable desde cualquier pantalla.
- Los componentes deben funcionar con contenido real y no depender de copy fijo.
