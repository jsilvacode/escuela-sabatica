# 10 — Responsive y accesibilidad

## Breakpoints sugeridos

```css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1440px;
```

## Desktop

- Header fijo.
- Sidebar izquierda visible.
- Contenido principal amplio.
- Panel derecho para widgets.
- Modal bíblico centrado o panel lateral.

## Tablet

- Sidebar colapsable.
- Panel derecho baja bajo contenido si falta espacio.
- Grilla de lecciones de 2 o 3 columnas.
- Selector de días puede seguir como tabs.

## Móvil

- Header compacto.
- Bottom navigation.
- Hero full width.
- Lecciones en lista vertical.
- Selector de días horizontal scrolleable.
- Modal bíblico como bottom sheet.
- Recursos en una columna.

## Accesibilidad mínima

- Contraste suficiente entre texto y fondo.
- Botones con tamaño táctil mínimo de 44px.
- Estados `focus-visible` claros.
- Navegación usable con teclado.
- Modal con foco atrapado mientras está abierto.
- Cierre de modal con `Esc` en desktop.
- Imágenes con texto alternativo.
- No depender solo del color para indicar estados.

## Semántica HTML

Usar:

```html
<header>
<nav>
<main>
<article>
<aside>
<section>
<footer>
```

Para la lectura diaria usar `article`.

Para referencias bíblicas interactivas usar `button` o `a` según comportamiento:

- Si abre modal sin navegación: `button` estilizado como enlace.
- Si navega a Biblia completa: `a`.

## Modal accesible

Debe incluir:

- `role="dialog"`.
- `aria-modal="true"`.
- título asociado con `aria-labelledby`.
- foco inicial dentro del modal.
- retorno de foco al elemento que abrió el modal.

## Texto de lectura

- Tamaño recomendado: 17px–19px en desktop.
- Interlineado: 1.65–1.8.
- Ancho máximo: 720px–820px.
- No justificar texto.
- Espaciado generoso entre párrafos.

## Modo lectura futuro

Puede agregarse después:

- aumentar/disminuir tamaño de letra;
- modo sepia;
- modo oscuro;
- ocultar sidebar;
- lectura sin distracciones.
