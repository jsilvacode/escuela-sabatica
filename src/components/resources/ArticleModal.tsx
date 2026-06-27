import { useEffect, useState, useCallback } from "react";

type Props = {};

export function ArticleModal(_props: Props) {
  const [article, setArticle] = useState<{ url: string; title: string } | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const openArticle = useCallback((e: CustomEvent<{ url: string; title: string }>) => {
    const { url, title } = e.detail;
    setArticle({ url, title });
    setLoading(true);
    const fullUrl = url.startsWith("http") ? url : `${location.origin}${url}`;
    fetch(fullUrl)
      .then((r) => r.text())
      .then((html) => {
        const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
        setContent(body.replace(/<style[\s\S]*?<\/style>/gi, ""));
        setLoading(false);
      })
      .catch(() => {
        setContent("<p>Error al cargar el contenido.</p>");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = (e: Event) => openArticle(e as CustomEvent);
    window.addEventListener("open-article", handler);
    return () => window.removeEventListener("open-article", handler);
  }, [openArticle]);

  const onClose = () => setArticle(null);

  if (!article) return null;

  const fullUrl = article.url.startsWith("http") ? article.url : `${location.origin}${article.url}`;

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bible-modal" style={{ maxWidth: "min(94vw, 900px)" }}>
        <div className="modal-header">
          <h2>{article.title}</h2>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <p className="muted">Cargando...</p>
          ) : (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
        <div className="modal-actions">
          <a href={fullUrl} download className="ghost-button" style={{ display: "grid", placeItems: "center", textDecoration: "none" }}>
            Descargar HTML ↓
          </a>
          <button type="button" className="ghost-button" onClick={() => window.print()}>
            Imprimir
          </button>
          <button type="button" className="ghost-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
