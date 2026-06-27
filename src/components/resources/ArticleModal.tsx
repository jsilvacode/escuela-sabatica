import { useEffect, useState, useCallback, useRef } from "react";

type Props = {};

export function ArticleModal(_props: Props) {
  const [article, setArticle] = useState<{ url: string; title: string } | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const downloadPDF = async () => {
    if (!contentRef.current || !article) return;
    const { default: html2pdf } = await import("html2pdf.js");
    const el = contentRef.current;
    await html2pdf().set({
      margin: 10,
      filename: `${article.title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(el).save();
  };

  if (!article) return null;

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
            <div className="article-content" ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={downloadPDF}>
            Descargar PDF
          </button>
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
