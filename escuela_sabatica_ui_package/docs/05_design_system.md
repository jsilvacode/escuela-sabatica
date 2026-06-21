# 05 — Sistema de diseño

## Personalidad visual

La interfaz debe verse como una plataforma editorial de lectura bíblica:

- elegante;
- sobria;
- cálida;
- moderna;
- espiritual;
- profesional;
- legible.

Debe evitar parecer:

- blog antiguo;
- dashboard corporativo;
- app infantil;
- landing genérica;
- interfaz demasiado religiosa o recargada.

## Paleta de color

| Uso | Color | Hex |
|---|---:|---:|
| Azul profundo principal | Navy | `#0B1D33` |
| Azul secundario | Blue | `#316395` |
| Fondo cálido | Ivory | `#FAF7F1` |
| Superficie | White warm | `#FFFDF8` |
| Arena | Sand | `#E7DCC2` |
| Oro de acento | Gold | `#D4AF37` |
| Texto principal | Slate | `#334155` |
| Éxito/progreso | Olive | `#6B7F5E` |
| Borde suave | Border | `#E8E2D6` |
| Fondo bloque bíblico | Verse bg | `#FFF8E8` |

## Variables CSS sugeridas

```css
:root {
  --color-navy-900: #0B1D33;
  --color-blue-700: #316395;
  --color-ivory-50: #FAF7F1;
  --color-white-warm: #FFFDF8;
  --color-sand-200: #E7DCC2;
  --color-gold-500: #D4AF37;
  --color-slate-700: #334155;
  --color-olive-500: #6B7F5E;
  --color-border: #E8E2D6;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --shadow-sm: 0 1px 3px rgba(11, 29, 51, 0.08);
  --shadow-md: 0 8px 24px rgba(11, 29, 51, 0.10);
  --shadow-lg: 0 18px 48px rgba(11, 29, 51, 0.16);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
}
```

## Tipografías

### Interfaz

Usar una sans serif moderna:

- Manrope.
- Inter.
- Source Sans 3.

### Lectura

Usar una serif cómoda para textos largos:

- Literata.
- Lora.
- Merriweather.
- Source Serif 4.

### Combinación recomendada

```txt
UI, botones, menús: Manrope
Lectura bíblica, citas y encabezados editoriales: Literata
```

## Escala tipográfica sugerida

| Token | Tamaño | Uso |
|---|---:|---|
| Display | 56px | Hero desktop |
| H1 | 44px | Título principal |
| H2 | 32px | Secciones |
| H3 | 24px | Tarjetas y subtítulos |
| Body lg | 20px | Lectura destacada |
| Body | 17px | Texto lectura |
| UI | 15px | Interfaz |
| Small | 13px | Metadatos |

## Layout

### Desktop

```txt
Header fijo: 72px
Sidebar: 240px
Main max-width: flexible
Panel derecho: 320px–360px
Padding principal: 32px–40px
```

### Móvil

```txt
Header: 64px
Bottom nav: 72px
Padding: 16px–20px
Modal bíblico: bottom sheet
Cards full width
```

## Estilo de componentes

- Bordes redondeados entre 12px y 24px.
- Sombras suaves, no dramáticas.
- Botón principal en dorado.
- Enlaces bíblicos en azul profundo con subrayado sutil.
- Bloques de versículo con fondo cálido y borde suave.
- Imágenes con overlay oscuro si llevan texto encima.

## Imágenes

Usar imágenes sobrias, espirituales y naturales:

- montañas;
- caminos;
- amaneceres;
- Biblia abierta;
- luz cálida;
- naturaleza;
- símbolos discretos.

Evitar:

- imágenes saturadas;
- composición demasiado literal;
- estética de flyer religioso;
- exceso de stock genérico.
