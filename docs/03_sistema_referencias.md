# 03 — Sistema de referencias bíblicas

## Arquitectura del detector

El sistema detecta referencias bíblicas en el texto de las lecciones y las convierte en enlaces clickeables que abren un modal con el texto bíblico (RVA2015) y el comentario (CBA).

### Componentes involucrados

| Componente | Responsabilidad |
|-----------|----------------|
| `DailyReading.tsx` | Detección en el cuerpo de la lección |
| `ManuscriptReader.tsx` | Detección en la introducción |
| `bibleAdapter.ts` | Fetch del texto bíblico desde `santabiblia.cloud` |
| `commentaryAdapter.ts` | Fetch del comentario CBA |
| `BibleStudyModal.tsx` | Modal de visualización |

## Algoritmo de detección (`findReferences`)

### 1. Referencias conocidas (`studyReferences`)

Cada día tiene un array de referencias de estudio. Se buscan en el texto en 3 formatos:
- Con corchetes: `[1 Corintios 1:1]`
- Con paréntesis: `(1 Corintios 1:1)`
- Forma simple: `1 Corintios 1:1`

### 2. Referencias genéricas (regex)

**Patrón para verso específico**:
```regex
(?<![a-záéíóúñüA-Z])(\(?BOOK_STRICT\s+\d+:\d+(?:\s*[-–]\s*\d+)?\)?)
```

**Patrón para capítulo completo**:
```regex
(?<!\d\s)(?<![a-záéíóúñüA-Z])(\(?BOOK_STRICT\s+\d{1,3}\)?)(?![\s]*[:\d])
```

Donde `BOOK_STRICT` = `(?:(?:\d+\s+)?[A-ZÁÉÍÓÚ][a-záéíóúñü]+(?:\s+[A-ZÁÉÍÓÚ][a-záéíóúñü]+)?)`

### 3. Referencias por continuación

Cuando un libro se menciona una vez y luego se listan múltiples capítulos/versos:
```
1 Corintios 8; 10; Romanos 14; 1 Corintios 9:24-27; 10:31-11:1
```
- `10` hereda "1 Corintios" del contexto anterior → `1 Corintios 10`
- `10:31-11:1` se detecta como cruce de capítulo y se separa en dos referencias

### 4. Cruce de capítulos

`10:31-11:1` se divide en:
- `10:31` → 1 Corintios 10:31 al final del capítulo (`toEnd: true`)
- `11:1` → 1 Corintios 11:1

## Validación de libros

Tras detectar una posible referencia, se valida contra una lista de 66 nombres canónicos normalizados (sin acentos, minúsculas). Esto elimina falsos positivos como "Lee Mateo", "Ver Juan", "sábado 8", etc.

## Resolución de nombres

El `bibleAdapter.ts` mantiene un mapa de 100+ alias para resolver abreviaturas:
- `1 Cor` → `1 Corintios`
- `Hech` → `Hechos`
- `1 Pet` → `1 Pedro`
- `Sal` → `Salmos`

## Casos de uso cubiertos

| Formato | Ejemplo | Detectado |
|---------|---------|-----------|
| Verso único | `1 Corintios 1:1` | ✓ |
| Rango de versos | `1 Corintios 1:17-31` | ✓ |
| Capítulo completo | `1 Corintios 12` | ✓ |
| Continuación simple | `1 Corintios 8; 10` | ✓ |
| Continuación con verso | `1 Corintios 9:24-27; 10:31-11:1` | ✓ |
| Cruce de capítulo | `10:31-11:1` → dos refs separadas | ✓ |
| Paréntesis | `(1 Corintios 2:2)` | ✓ |
| Con prefijo "Lee" | `Lee 1 Corintios 1:1` | Ignorado (no es libro) |
| Fecha "sábado 8" | `sábado 8 de agosto` | Ignorado (no es libro) |
