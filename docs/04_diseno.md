# 04 — Diseño

## Paleta de colores

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-navy-900` | `#0b1d33` | Fondos oscuros, sidebar, header |
| `--color-navy-800` | `#12345a` | Gradientes |
| `--color-blue-700` | `#316395` | Enlaces, chips de referencia |
| `--color-ivory-50` | `#faf7f1` | Fondo principal |
| `--color-white-warm` | `#fffdf8` | Superficies, tarjetas |
| `--color-sand-200` | `#e7dcc2` | Acentos suaves |
| `--color-gold-500` | `#d4af37` | Acentos dorados, divider |
| `--color-gold-600` | `#b98515` | Hover de botones |
| `--color-slate-700` | `#334155` | Texto principal |
| `--color-slate-500` | `#64748b` | Texto secundario |
| `--color-olive-500` | `#6b7f5e` | Éxito/progreso |
| `--color-border` | `#e8e2d6` | Bordes suaves |
| `--color-verse-bg` | `#fff8e8` | Fondo de versículos destacados |
| `--color-danger` | `#a33b2b` | Errores/alertas |

## Tipografía

### Escala desktop

| Elemento | Fuente | Tamaño | Peso |
|----------|--------|--------|------|
| Hero h1 | Cormorant Garamond | 3.6rem | 700 |
| Daily title | Cormorant Garamond | 2.8rem | 700 |
| Manuscript h2 | Literata | 2.2rem | 700 |
| Modal header | Literata | 1.5rem | 700 |
| Section heading | UI font | 1.35rem | 700 |
| Reading body | Literata | 1.18rem | 400 |
| Manuscript body | Literata | 1.18rem | 400 |
| Modal passage | Literata | 1.2rem | 400 |
| Lesson card title | UI font | 1.05rem | 700 |
| EGW notes | UI font | 0.88rem | 400 |

### Escala mobile (≤720px)

| Elemento | Tamaño |
|----------|--------|
| Hero h1 | 2.2rem |
| Daily title | 1.65rem |
| Manuscript h2 | 1.6rem |
| Reading body | 1rem |
| Modal passage | 1.05rem |

### Fuentes

- **UI**: Manrope, Inter, system-ui — sans-serif
- **Lectura**: Literata, Lora, Georgia — serif
- **Header**: Cormorant Garamond — elegante, mayúsculas

## Espaciado

Escala base de 4px:
```
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 24px  --space-6: 32px  --space-7: 40px  --space-8: 48px
```

## Breakpoints

| Breakpoint | Layout | Grid lecciones | Grid recursos |
|------------|--------|---------------|---------------|
| Default (≥1281px) | Sidebar + contenido | 4 cols | 5 cols |
| ≤1280px | Sidebar + contenido | 3 cols | 3 cols |
| ≤1024px | Sidebar overlay + hamburguesa | 2 cols | 2 cols |
| ≤720px | 1 columna | 1 col | 1 col |

## Sombras

```css
--shadow-sm: 0 1px 3px rgba(11, 29, 51, 0.08);
--shadow-md: 0 8px 24px rgba(11, 29, 51, 0.1);
--shadow-lg: 0 18px 48px rgba(11, 29, 51, 0.16);
```

## Radios

```css
--radius-sm: 8px;    --radius-md: 12px;
--radius-lg: 18px;   --radius-xl: 24px;
--radius-pill: 999px;
```
