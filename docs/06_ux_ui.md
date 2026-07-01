# 06 — UX/UI

## Navegación

### Desktop
- **Sidebar izquierda** fija (236px) con:
  - Menú de 4 ítems con íconos
  - Cover del folleto del trimestre (link a Adventech)
  - Cover de la Biblia (link a santabiblia.cloud)
- **Header** superior con ícono + título, hamburguesa solo en mobile
- **Scroll activo**: el indicador del menú se actualiza al hacer scroll entre secciones

### Mobile
- **Hamburguesa** en el header → abre sidebar overlay
- **Dropdown** de días en selector nativo
- **Sin bottom nav** (eliminada en v2.0)

### Enlaces del menú
| Label | Destino |
|-------|---------|
| Inicio | `/` |
| Lecciones | `/#lessons-heading` (scroll a sección) |
| Recursos | `/recursos` |
| Biblia | `https://www.santabiblia.cloud` (nueva pestaña) |

## Layout de lectura diaria

```
┌─ Hero (imagen + título + fecha) ─┐
├─ daily-layout ───────────────────┤
│ ┌─ Breadcrumb ─────────────────┐ │
│ ├─ Daily title ────────────────┤ │
│ ├─ Audio player ───────────────┤ │
│ ├─ Day tabs (dropdown móvil) ──┤ │
│ ├─ Reading card ───────────────┤ │
│ │  ├─ Verse block (memoria) ───┤ │
│ │  ├─ Reading body ────────────┤ │
│ │  ├─ Reference chips ─────────┤ │
│ │  └─ Day nav (← →) ──────────┤ │
│ └──────────────────────────────┘ │
│ ┌─ Right rail ─────────────────┐ │
│ │  ├─ Audio ───────────────────┤ │
│ │  ├─ EGW notes ───────────────┤ │
│ │  ├─ Reavivados ──────────────┤ │
│ │  ├─ PPT descarga ────────────┤ │
│ │  └─ Todos los recursos ──────┤ │
│ └──────────────────────────────┘ │
├─ Footer ─────────────────────────┤
│  ├─ Enlaces destacados (4 cards) │
│  └─ Copy © ──────────────────────┤
└──────────────────────────────────┘
```

## Interacciones

### Referencias bíblicas
- Detectadas automáticamente en el texto
- Resaltadas en azul sin bordes ni fondos
- Click → modal con Biblia + Comentario
- Soporte para: versos simples, rangos, capítulos completos, continuación, cruces

### Compartir (mobile)
- Mantener presionada una tarjeta de lección o recurso → menú nativo de compartir
- Web Share API con fallback a portapapeles

### Audio
- Reproductor minimalista bajo el título
- Barra de progreso dorada de 120px
- Badge "Audio resume by sabbath-school.adventech.io"

## Estados

### Loading
- Modal bíblico: "Cargando texto bíblico..."
- Recursos: skeleton de tarjetas
- Búsqueda: "Sin resultados"

### Empty
- EGW: "Notas complementarias pronto disponibles"
- Comentario: "No encontramos comentario disponible"
- Audio: "Audio pronto disponible"
- Lecciones futuras: "Próximamente"

### Error
- Biblia no encontrada: "Libro no encontrado"
- Versículo no disponible: "Versículo no disponible"
- Red: error silencioso, sin toast (el texto de la lección sigue visible)

## Accesibilidad

- `aria-current="page"` en navegación activa
- `aria-label` en todos los elementos interactivos
- `role="dialog"` + `aria-modal="true"` en el modal
- `:focus-visible` con outline azul de 3px
- Texto justificado con `hyphens: auto` para legibilidad
- Contraste adecuado en textos sobre fondos oscuros
