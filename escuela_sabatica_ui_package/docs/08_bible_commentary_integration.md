# 08 — Integración Biblia + Comentario Bíblico

## Objetivo

Permitir que cada referencia bíblica mencionada en una lección se comporte como enlace interactivo.

Al hacer clic o tocar la referencia, debe abrirse un modal con:

- texto bíblico completo;
- pestaña de comentario bíblico;
- acciones de estudio.

## Decisión recomendada

No duplicar la Biblia y el comentario como copias aisladas dentro del sitio de Escuela Sabática, salvo que se requiera offline total desde el inicio.

La mejor opción es crear una **capa compartida de datos**:

```txt
Escuela Sabática ─┐
                  ├─ bibleAdapter / shared Bible JSON / API
Santa Biblia ─────┘
```

## Opciones técnicas

### Opción A — JSON local dentro del sitio

Ventajas:

- Muy rápido.
- Funciona sin backend.
- Puede convertirse en PWA offline.

Desventajas:

- Duplica datos si Santa Biblia ya tiene lo mismo.
- El bundle puede crecer.
- Mantención separada.

### Opción B — API o endpoint desde Santa Biblia

Ventajas:

- Una sola fuente de verdad.
- Menor duplicación.
- Actualizaciones centralizadas.

Desventajas:

- Depende de conectividad.
- Requiere exponer endpoints estables.
- Requiere manejar errores y latencia.

### Opción C — Paquete compartido de datos

Ventajas:

- Reutilizable en ambos sitios.
- Mantención ordenada.
- Puede usarse local o remoto.
- Ideal si ambos proyectos están bajo tu control.

Desventajas:

- Requiere organizar el repositorio o crear un paquete independiente.

## Recomendación para V1

Implementar un adaptador que permita cambiar la fuente sin tocar la UI.

```ts
interface BibleAdapter {
  getPassage(reference: BibleReference, version?: string): Promise<BiblePassage>;
  search(query: string): Promise<BibleSearchResult[]>;
}

interface CommentaryAdapter {
  getCommentary(reference: BibleReference): Promise<CommentaryEntry[]>;
}
```

La UI solo llama:

```ts
const passage = await bibleAdapter.getPassage(reference, 'RVR1960');
const commentary = await commentaryAdapter.getCommentary(reference);
```

No importa si por dentro los datos vienen desde:

- JSON local;
- API;
- archivo estático;
- módulo compartido;
- `santabiblia.cloud`.

## Comportamiento del modal

### Estado inicial

- Se abre en pestaña Biblia.
- Muestra loader si el texto todavía no se cargó.
- Muestra referencia como título.

### Pestaña Biblia

Debe mostrar:

- referencia;
- versión;
- texto;
- selector de versión si existe;
- acciones: copiar, compartir, marcar, destacar, abrir en Biblia.

### Pestaña Comentario

Debe mostrar:

- referencia;
- comentario relacionado;
- posible fuente o tomo;
- navegación si hay múltiples entradas.

### Errores

Si no existe comentario:

```txt
No encontramos comentario disponible para esta referencia.
```

Si falla la Biblia:

```txt
No fue posible cargar el texto bíblico. Intenta nuevamente.
```

## Interacción móvil

En móvil, el modal debe funcionar como bottom sheet:

- aparece desde abajo;
- tiene handle superior;
- puede cerrarse con X o arrastre;
- no debe tapar permanentemente la navegación inferior;
- debe permitir scroll interno.

## Acciones de estudio

- Copiar texto.
- Compartir referencia.
- Guardar marcador.
- Destacar con color.
- Abrir en Biblia completa.
- Comparar versiones en una fase posterior.

## Consideración legal

Antes de publicar textos bíblicos o comentario completo en un sitio público, verificar licencias y permisos de uso de la versión bíblica y del comentario correspondiente. Si el uso es privado o interno, el riesgo operativo es distinto, pero para publicación abierta conviene revisar derechos de distribución.
