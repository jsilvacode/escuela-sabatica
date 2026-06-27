import { useEffect, useMemo, useRef, useState } from "react";
import { getPassage, getBibleUrl } from "@lib/bibleAdapter";
import { getCommentary } from "@lib/commentaryAdapter";
import type { BiblePassage, BibleReference, CommentaryEntry } from "@app-types/bible";

type Props = {
  reference: BibleReference | null;
  onClose: () => void;
};

export function BibleStudyModal({ reference, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"bible" | "commentary">("bible");
  const [passage, setPassage] = useState<BiblePassage | null>(null);
  const [commentary, setCommentary] = useState<CommentaryEntry[]>([]);
  const [status, setStatus] = useState("Cargando texto bíblico...");
  const [bibleUrl, setBibleUrl] = useState("https://www.santabiblia.cloud");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!reference) return;
    let mounted = true;
    document.body.classList.add("modal-open");
    closeRef.current?.focus();
    setActiveTab("bible");
    setPassage(null);
    setCommentary([]);
    setStatus("Cargando texto bíblico...");
    getBibleUrl(reference.book, reference.chapter).then((url: string) => {
      if (mounted) setBibleUrl(url);
    });

    Promise.all([getPassage(reference), getCommentary(reference)])
      .then(([nextPassage, nextCommentary]) => {
        if (!mounted) return;
        setPassage(nextPassage);
        setCommentary(nextCommentary);
        setStatus("");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("No fue posible cargar el texto bíblico. Intenta nuevamente.");
      });

    return () => {
      mounted = false;
      document.body.classList.remove("modal-open");
    };
  }, [reference]);

  useEffect(() => {
    if (!reference) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, reference]);

  const passageText = useMemo(
    () => passage?.verses.map((verse) => `${verse.number} ${verse.text}`).join("\n") ?? "",
    [passage],
  );

  if (!reference) return null;

  const copyPassage = async () => {
    await navigator.clipboard?.writeText(
      `${reference.display}\n${passageText}\n\n🔗 Escuela Sabática\nhttps://escuelasabatica.cl`
    );
  };

  const sharePassage = async () => {
    const data = {
      title: reference.display,
      text: `${passageText}\n\n📖 Escuela Sabática`,
      url: `https://escuelasabatica.cl`,
    };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard?.writeText(`${data.title}\n${data.text}\n${data.url}`);
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="bible-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bible-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="bible-modal-title">{reference.display}</h2>
          <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </header>

        <div className="modal-tabs" role="tablist" aria-label="Contenido de referencia bíblica">
          <button
            type="button"
            className={activeTab === "bible" ? "active" : undefined}
            onClick={() => setActiveTab("bible")}
            role="tab"
            aria-selected={activeTab === "bible"}
          >
            Biblia
          </button>
          <button
            type="button"
            className={activeTab === "commentary" ? "active" : undefined}
            onClick={() => setActiveTab("commentary")}
            role="tab"
            aria-selected={activeTab === "commentary"}
          >
            Comentario
          </button>
        </div>

        <div className="modal-body">
          {status && <p>{status}</p>}
          {!status && activeTab === "bible" && passage && (
            <>
              <select className="version-select" aria-label="Versión bíblica" defaultValue={passage.version}>
                <option value="rva2015">RVA2015</option>
              </select>
              <div className="passage">
                {passage.verses.map((verse) => (
                  <p key={verse.number}>
                    <span className="verse-number">{verse.number}</span>
                    {verse.text}
                  </p>
                ))}
              </div>
            </>
          )}

          {!status && activeTab === "commentary" && (
            <div className="passage">
              {commentary.length > 0 ? (
                <>
                  {commentary.length > 1 && (
                    <p className="commentary-range-header">{reference.display}</p>
                  )}
                  {commentary.map((entry, i) => (
                    <article key={`${reference.display}-${i}`}>
                      {commentary.length > 1 && (
                        <span className="verse-number">{reference.verseStart ? reference.verseStart + i : i + 1}</span>
                      )}
                      <p>{entry.content}</p>
                      {commentary.length === 1 && entry.source && (
                        <p className="muted">{entry.source}</p>
                      )}
                    </article>
                  ))}
                </>
              ) : (
                <p>No encontramos comentario disponible para esta referencia.</p>
              )}
            </div>
          )}
        </div>

        <footer className="modal-actions">
          <button type="button" onClick={copyPassage}>Copiar</button>
          <button type="button" onClick={sharePassage}>Compartir</button>
          <a href={bibleUrl} target="_blank" rel="noopener noreferrer">Abrir en Biblia</a>
        </footer>
      </section>
    </div>
  );
}
