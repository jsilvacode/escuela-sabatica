# 09 — Flujo de contenido: PDF → OCR → Markdown → JSON

## Objetivo

Convertir las lecciones trimestrales desde PDF a un formato estructurado, limpio y mantenible para la web.

## Flujo recomendado

```txt
PDF original
   ↓
OCR / extracción de texto
   ↓
Markdown limpio
   ↓
Normalización de referencias bíblicas
   ↓
JSON estructurado
   ↓
Validación
   ↓
Publicación web
```

## Etapa 1 — PDF original

Guardar el PDF original en una carpeta de origen:

```txt
content/source-pdf/2025-q2.pdf
```

## Etapa 2 — OCR / extracción

Usar una herramienta OCR o IA para extraer el texto.

Resultado esperado:

```txt
content/raw-markdown/2025-q2.raw.md
```

## Etapa 3 — Limpieza Markdown

Corregir:

- saltos de línea rotos;
- caracteres extraños;
- títulos mal detectados;
- referencias bíblicas separadas;
- notas al pie innecesarias;
- encabezados repetidos;
- numeración corrupta.

Resultado:

```txt
content/markdown/2025-q2.clean.md
```

## Etapa 4 — Segmentación

Separar por:

- trimestre;
- lección;
- día;
- secciones;
- referencias bíblicas;
- preguntas;
- recursos.

## Etapa 5 — Normalización de referencias bíblicas

Toda referencia debe convertirse a objeto estructurado.

Ejemplo detectado:

```txt
Génesis 1:1
```

Debe transformarse a:

```json
{
  "book": "Génesis",
  "chapter": 1,
  "verseStart": 1,
  "display": "Génesis 1:1"
}
```

Rangos:

```txt
Juan 1:1-5
```

```json
{
  "book": "Juan",
  "chapter": 1,
  "verseStart": 1,
  "verseEnd": 5,
  "display": "Juan 1:1-5"
}
```

## Etapa 6 — JSON final

Guardar como:

```txt
src/data/quarters/2025-q2.json
```

## Etapa 7 — Validación

Antes de publicar, validar:

- existen 13 lecciones;
- cada lección tiene 7 días;
- cada día tiene título;
- las referencias bíblicas están estructuradas;
- los audios tienen URL válida;
- las imágenes tienen `alt`;
- no hay caracteres corruptos;
- el JSON es válido.

## Script sugerido

Crear un script futuro:

```txt
scripts/convert-quarter.ts
```

Funciones:

- leer markdown;
- detectar lecciones;
- detectar días;
- detectar referencias bíblicas;
- generar JSON;
- emitir reporte de errores.

## Reglas de calidad de contenido

- No publicar contenido OCR sin revisión.
- No confiar en que la IA segmentó correctamente todas las referencias.
- Revisar manualmente títulos, fechas y versículos principales.
- Mantener imágenes separadas del texto.
- No mezclar contenido visual con contenido estructurado.
