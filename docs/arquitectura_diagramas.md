# Diagramas de Arquitectura — Escuela Sabática CL v2.1

## 1. Arquitectura General

```mermaid
graph TB
    subgraph FUENTES["Fuentes de Datos"]
        ADVENTECH_ES["Adventech GitHub\nsrc/es/2026-03/\n(español oficial)"]
        ADVENTECH_EN["Adventech GitHub\nsrc/en/2026-03/\n(inglés referencia)"]
        AUDIO_SITE["audioescuelasabatica.com\nMP3 diarios"]
        BIBLE_API["Biblia RVA2015\nAPI remota"]
        CBA_API["Comentario CBA\nAPI remota"]
    end

    subgraph SCRIPTS["Scripts de Procesamiento"]
        FETCH["adventech_to_json.py\nFetch + parseo inicial"]
        AUDIT["audit_content.py\nAuditoría EN vs ES"]
        POLISH["polish & parse\nAbreviaturas, referencias"]
    end

    subgraph DATA["Capa de Datos"]
        JSON["2026-q3.json\n13 lecciones × 7 días\n+ recursos + EGW + Reavivados"]
        TYPES["TypeScript Types\nLesson, BibleReference,\nResource, AudioResource"]
    end

    subgraph ADAPTERS["Adaptadores (lib/)"]
        LESSON_AD["lessonAdapter.ts\nAcceso al JSON"]
        BIBLE_AD["bibleAdapter.ts\nFetch RVA2015 + alias"]
        CBA_AD["commentaryAdapter.ts\nFetch comentario CBA"]
    end

    subgraph BUILD["Build & Render"]
        ASTRO["Astro 6\nSSG estático"]
        REACT["React 19\nIslands interactivas"]
        CSS["CSS vanilla\nTokens + globals.css"]
    end

    subgraph OUTPUT["Salida (dist/)"]
        STATIC["106 páginas HTML\n+ assets (CSS, JS, imágenes)"]
    end

    ADVENTECH_ES -->|"raw .md"| FETCH
    ADVENTECH_EN -->|"reference"| AUDIT
    FETCH --> JSON
    AUDIT --> JSON
    JSON --> POLISH
    POLISH --> JSON
    JSON --> LESSON_AD
    AUDIO_SITE -->|"URLs MP3"| JSON
    TYPES --> LESSON_AD
    TYPES --> BIBLE_AD
    TYPES --> CBA_AD
    LESSON_AD --> ASTRO
    BIBLE_AD --> REACT
    CBA_AD --> REACT
    ASTRO --> STATIC
    REACT --> STATIC
    CSS --> STATIC
```

## 2. Pipeline de Contenido

```mermaid
flowchart LR
    subgraph STEP1["1. Obtención"]
        GH_EN["GitHub Adventech\nsrc/en/2026-03/"]
        GH_ES["GitHub Adventech\nsrc/es/2026-03/"]
    end

    subgraph STEP2["2. Parseo"]
        INFO["info.yml\n(título, fechas)"]
        DAYS["01.md - 07.md\n7 días × 13 lecciones"]
        FM["Frontmatter\n(title, date)"]
        BODY["Body markdown\n(contentMarkdown)"]
        REFS["Read for Study\n(studyReferences)"]
        MV["Memory Verse\n(keyVerse)"]
        EGW["Ellen G. White\n(egwNotes)"]
    end

    subgraph STEP3["3. Estructura"]
        QUARTER["Quarter JSON\n91 días\n13 lessons\nresources\nreavivados"]
    end

    subgraph STEP4["4. Pulido"]
        ABBR["Expandir abreviaturas\nCor. → Corintios"]
        SPACE["Normalizar espaciado\n1: 18 → 1:18"]
        PARSEREF["Parsear referencias\nbook, chapter, verse"]
        AUDIO_INJ["Inyectar audios L1\naudioescuelasabatica.com"]
    end

    GH_ES --> INFO
    GH_ES --> DAYS
    DAYS --> FM
    DAYS --> BODY
    BODY --> REFS
    BODY --> MV
    BODY --> EGW
    INFO --> QUARTER
    FM --> QUARTER
    BODY --> QUARTER
    REFS --> QUARTER
    MV --> QUARTER
    EGW --> QUARTER
    GH_EN -->|"auditoría"| QUARTER
    QUARTER --> ABBR
    ABBR --> SPACE
    SPACE --> PARSEREF
    PARSEREF --> AUDIO_INJ
    AUDIO_INJ -->|"2026-q3.json"| OUTPUT[("JSON final\nproducción")]
```

## 3. Arquitectura Front-end

```mermaid
graph TB
    subgraph LAYOUT["Layout Shell"]
        BASE["BaseLayout.astro\nHTML + CSS global + SEO"]
        APP["AppLayout.astro\nHeader + Sidebar + Main + Footer"]
    end

    subgraph HEADER["Header"]
        BRAND["Brand.astro\nÍcono + Título"]
        HAMB["Hamburguesa\n(mobile)"]
    end

    subgraph NAV["Navegación"]
        SIDEBAR["Sidebar.astro\n4 nav items\n+ covers (Diálogo Bíblico, Santa Biblia)"]
        BOTTOM_NAV["MobileBottomNav.astro\n4 tabs (mobile)"]
    end

    subgraph PAGES["Páginas (Rutas)"]
        HOME["index.astro\n/"]
        RECURSOS["recursos.astro\n/recursos"]
        LESSON_REDIR["[lessonId].astro\nRedirect al Sábado"]
        DAY_PAGE["[lessonId]/[dayId].astro\nLectura diaria"]
    end

    subgraph HERO["Hero Section"]
        PAGE_HERO["PageHero.astro\nHero unificado\n(home/lección/página)"]
    end

    subgraph READING["Lectura Diaria"]
        DAY_TABS["DayTabs.astro\nTabs + dropdown móvil"]
        AUDIO_PLAYER["AudioPlayer.tsx\nReact island"]
        DAILY_READING["DailyReading.tsx\nReact island\nMarkdown + refs"]
        BIBLE_MODAL["BibleStudyModal.tsx\nReact island\nBiblia + CBA"]
    end

    subgraph SIDEBAR_W["Sidebar Widgets"]
        STUDY_SB["StudySidebar.astro\nEGW + PPT + PDF + Reavivados"]
    end

    subgraph HOME_COMP["Componentes Home"]
        MANUSCRIPT["ManuscriptReader.tsx\nReact island\nIntro + refs"]
        LESSON_CARD["LessonCard.astro\nTarjeta 'Lección N'\nentera clicable"]
        VIDEO["Video introductorio\nAutor del trimestre"]
    end

    subgraph RESOURCE_COMP["Componentes Recursos"]
        RESOURCE_CARD["ResourceCard.astro\nCover SVG por tipo\nFiltros dinámicos"]
    end

    subgraph FOOTER["Footer"]
        FOOTER_COMP["Footer.astro\nEnlaces destacados\n+ UnACh, Radio, ADRA, etc."]
    end

    BASE --> APP
    APP --> HEADER
    APP --> NAV
    APP --> PAGES
    APP --> FOOTER
    PAGES --> HERO
    HOME --> MANUSCRIPT
    HOME --> VIDEO
    HOME --> LESSON_CARD
    DAY_PAGE --> DAY_TABS
    DAY_PAGE --> AUDIO_PLAYER
    DAY_PAGE --> DAILY_READING
    DAY_PAGE --> STUDY_SB
    DAILY_READING --> BIBLE_MODAL
    RECURSOS --> RESOURCE_CARD
```

## 4. Flujo de Detección de Referencias Bíblicas

```mermaid
flowchart TD
    TEXT["contentMarkdown\n(raw markdown)"]

    subgraph STEPS["findReferences() en DailyReading.tsx"]
        S1["Step 1: knownRefs\nBuscar studyReferences\nexactos en el texto\n(ej: '2 Corintios 13:11')"]
        S2["Step 2: REF_REGEX\nDetectar Book Ch:Vs\ncon rangos opcionales\n(ej: 'Juan 3:16')\nSi es más largo que\nun knownRef, lo reemplaza"]
        S3["Step 3: CHAPTER_REGEX\nDetectar Book Ch\n(sin versículo)\n(ej: '1 Corintios 8')"]
        S4["Step 4: CONT_REGEX\nContinuaciones\n'; 10:5-22' hereda libro\n'; 22-28' hereda libro+cap\nRangos cruzados\n'10:31-11:1'"]
    end

    subgraph PARSING["parseRefDisplay()"]
        P1["Limpiar paréntesis"]
        P2["Regex: Book Ch:Vs(-Ve)?"]
        P3["Regex: Book Ch (solo cap)"]
        P4["Validar contra VALID_BOOKS\n(66 libros, español)"]
    end

    subgraph DEDUP["Dedup & Render"]
        D1["Ordenar por posición\n+ longitud descendente"]
        D2["Filtrar solapados\n(preferir más largos)"]
        D3["Renderizar spans\n.bible-inline clickables"]
    end

    TEXT --> S1
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> DEDUP
    S1 --> PARSING
    S2 --> PARSING
    S3 --> PARSING
    S4 --> PARSING
    PARSING --> DEDUP
    DEDUP --> MODAL["BibleStudyModal\nFetch RVA2015 + CBA"]
```

## 5. Datos: Estructura del JSON

```mermaid
classDiagram
    class Quarter {
        +string id
        +string title
        +string description
        +string dateRange
        +Lesson[] lessons
        +Resource[] resources
        +ReavivadosEntry[] reavivados
        +KeyVerse? keyVerse
    }
    class Lesson {
        +number number
        +string id
        +string title
        +string dateRange
        +string startDate
        +string endDate
        +string summary
        +string image
        +LessonDay[] days
        +Resource[] resources
        +KeyVerse? keyVerse
        +string? egwNotes
    }
    class LessonDay {
        +string id
        +string dayName
        +string date
        +string title
        +string contentMarkdown
        +BibleReference[] studyReferences
        +KeyVerse? keyVerse
        +AudioResource? audio
    }
    class BibleReference {
        +string book
        +number chapter
        +number verseStart
        +number? verseEnd
        +string display
        +bool? toEnd
    }
    class Resource {
        +string id
        +string type
        +string title
        +string url
        +bool? external
    }
    class AudioResource {
        +string title
        +string url
        +string? narrator
    }

    Quarter "1" --> "13" Lesson
    Quarter "1" --> "*" Resource
    Lesson "1" --> "7" LessonDay
    Lesson "1" --> "*" Resource
    LessonDay "1" --> "*" BibleReference : studyReferences
    LessonDay "1" --> "0..1" AudioResource : audio
```

## 6. Flujo de Navegación (Rutas)

```mermaid
flowchart LR
    HOME_P["/ (index.astro)\nLanding page"]
    REC_P["/recursos\nGalería de recursos"]
    LEC_REDIR["/lecciones/[id]\nRedirect al Sábado"]
    LEC_DAY["/lecciones/[id]/[día]\nLectura diaria"]

    HOME_P -->|"click Lección N"| LEC_DAY
    HOME_P -->|"click Recursos"| REC_P
    LEC_REDIR -->|"redirect"| LEC_DAY
    LEC_DAY -->|"tabs ← →"| LEC_DAY
    LEC_DAY -->|"breadcrumb Inicio"| HOME_P
    LEC_DAY -->|"sidebar Recursos"| REC_P
    REC_P -->|"sidebar Inicio"| HOME_P
    REC_P -->|"sidebar Lecciones"| HOME_P

    style LEC_DAY fill:#0b1d33,color:#d4af37
    style HOME_P fill:#0b1d33,color:#fff
    style REC_P fill:#0b1d33,color:#fff
```

## 7. Arquitectura simplificada

```mermaid
flowchart TB
    IGLESIA["⛪ La Iglesia Adventista\npublica las lecciones"]
    INTERNET["🌐 Internet\nEl sitio Adventech las sube\na GitHub en español"]
    NOSOTROS["💻 Nuestro programa\nLas descarga y las guarda\nen un archivo JSON"]
    SITIO["📱 El sitio web\nLas muestra bonitas\ncon lectura, audio y Biblia"]
    GENTE["🙏 La gente\nLee, escucha y estudia\nla lección cada día"]

    IGLESIA -->|"escribe las lecciones"| INTERNET
    INTERNET -->|"descargamos automáticamente"| NOSOTROS
    NOSOTROS -->|"alimenta al sitio"| SITIO
    SITIO -->|"sirve a"| GENTE

    style IGLESIA fill:#4a3728,color:#f5e6c8
    style INTERNET fill:#1a365d,color:#fff
    style NOSOTROS fill:#0b1d33,color:#d4af37
    style SITIO fill:#1a4a2a,color:#fff
    style GENTE fill:#6b2060,color:#f5e6c8
```

**En cristiano**: La iglesia escribe el folleto trimestral. Adventech lo publica en internet. Un programita nuestro lo descarga automáticamente cada vez que se actualiza. Con eso, el sitio web muestra las lecturas diarias, los audios, los versículos con comentarios, y todo lo que ves en la página. Vos solo entrás, elegís el día, y estudiás.

