import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaCertificate, FaTimes } from "react-icons/fa";
import {
  CERTIFICADOS,
  CATEGORIAS_CERTIFICADOS,
  CERTIFICADOS_POR_CATEGORIA,
} from "../../data/data";

export function CertificateIslands() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    CATEGORIAS_CERTIFICADOS[0]?.id,
  );

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mounted]);

  useEffect(() => {
    if (open || !mounted) return;

    const timeout = window.setTimeout(() => setMounted(false), 260);
    return () => window.clearTimeout(timeout);
  }, [open, mounted]);

  const showGallery = () => {
    const firstCategory = CATEGORIAS_CERTIFICADOS.find(
      (category) => CERTIFICADOS_POR_CATEGORIA[category.id].length > 0,
    );
    if (firstCategory) setActiveCategory(firstCategory.id);
    setMounted(true);
    setOpen(true);
  };

  const activeCertificates = activeCategory
    ? CERTIFICADOS_POR_CATEGORIA[activeCategory]
    : [];

  return (
    <>
      <aside className="certificates-islands" data-no-pan aria-label="Certificados">
        <button
          type="button"
          className="certificates-trigger"
          onClick={showGallery}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <FaCertificate aria-hidden="true" />
          Certificados
          {CERTIFICADOS.length > 0 && (
            <span className="certificates-trigger__count">{CERTIFICADOS.length}</span>
          )}
        </button>
      </aside>

      {mounted &&
        createPortal(
          <div
            className="certificate-gallery"
            data-state={open ? "open" : "closing"}
            role="presentation"
            onClick={() => setOpen(false)}
          >
            <section
              className="certificate-gallery__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-gallery-title"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="certificate-gallery__header">
                <div>
                  <span className="certificate-gallery__eyebrow">FORMAÇÃO & CONQUISTAS</span>
                  <h2 id="certificate-gallery-title">Meus certificados</h2>
                  <p>Conhecimento construído, projeto por projeto.</p>
                </div>
                <button
                  type="button"
                  className="certificate-gallery__close"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar certificados"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </header>

              {CERTIFICADOS.length > 0 ? (
                <>
                  <nav className="certificate-category-tabs" aria-label="Categorias de certificados">
                    {CATEGORIAS_CERTIFICADOS.filter(
                      (category) => CERTIFICADOS_POR_CATEGORIA[category.id].length > 0,
                    ).map((category) => {
                      const count = CERTIFICADOS_POR_CATEGORIA[category.id].length;
                      const selected = category.id === activeCategory;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          className="certificate-category-tab"
                          data-active={selected}
                          aria-pressed={selected}
                          onClick={() => setActiveCategory(category.id)}
                        >
                          {category.label}
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="certificate-gallery__content">
                    <div className="certificate-gallery__section-title">
                      <h3>{activeCategory}</h3>
                      <span>
                        {activeCertificates.length}{" "}
                        {activeCertificates.length === 1 ? "certificado" : "certificados"}
                      </span>
                    </div>
                    <div className="certificate-card-grid">
                      {activeCertificates.map((certificate, index) => (
                        <article
                          className="certificate-card"
                          key={certificate.id}
                          style={{ animationDelay: `${index * 70}ms` }}
                        >
                          <div className="certificate-card__preview">
                            {certificate.formato === "imagem" ? (
                              <img src={certificate.arquivo} alt={certificate.titulo} />
                            ) : (
                              <iframe
                                src={certificate.arquivo}
                                title={certificate.titulo}
                              />
                            )}
                          </div>
                          <div className="certificate-card__caption">
                            <h4>{certificate.titulo}</h4>
                            <p>{certificate.instituicao}</p>
                            <div className="certificate-card__footer">
                              <span>{certificate.emitidoEm}</span>
                              <a
                                href={certificate.credencialUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Ver credencial <span aria-hidden="true">↗</span>
                              </a>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="certificate-gallery__empty">
                  <FaCertificate aria-hidden="true" />
                  <p>
                    Adicione certificados ao array <code>CERTIFICADOS</code> em{" "}
                    <code>src/data/data.ts</code>.
                  </p>
                </div>
              )}
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
