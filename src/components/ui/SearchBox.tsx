import { useMemo, useState } from "react";
import { searchSite } from "@lib/search";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSite(query), [query]);

  return (
    <div className="search-panel">
      <label className="search-box">
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">Buscar lecciones, temas o referencias</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder="Buscar lecciones o versículos (ej. Génesis 1:1, creación, promesas)..."
        />
      </label>
      {query.trim() && (
        <div className="search-results" role="listbox" aria-label="Resultados de búsqueda">
          {results.length > 0 ? (
            results.map((result) => (
              <a className="search-result" href={result.href} key={`${result.type}-${result.href}-${result.title}`}>
                <small>{result.type}</small>
                <strong>{result.title}</strong>
                <span className="muted">{result.description}</span>
              </a>
            ))
          ) : (
            <div className="search-result">
              <strong>Sin resultados</strong>
              <span className="muted">Prueba con una referencia, un tema o el título de una lección.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
