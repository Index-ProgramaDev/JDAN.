import { FaQuoteLeft, FaExpand } from "react-icons/fa";
import { MOSTRAR_PLACEHOLDER_PRINT } from "../data/servicos.config";
import type { Depoimento } from "../data/depoimentos.data";

export default function TestimonialCard({ dep, onZoom, focusable = true }: { dep: Depoimento; onZoom: (d: Depoimento) => void; focusable?: boolean }) {
  const temPrint = Boolean(dep.print);
  const mostrarFrame = temPrint || MOSTRAR_PLACEHOLDER_PRINT;

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
      {mostrarFrame && (temPrint ? (
        <button type="button" tabIndex={focusable ? 0 : -1} onClick={() => onZoom(dep)} aria-label={`Ampliar print do depoimento de ${dep.nome}`} className="group relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--green)]">
          <img src={dep.print} alt={`Print do depoimento de ${dep.nome}`} draggable={false} className="h-full w-full select-none object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
          <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs text-white/90">
            <FaExpand className="h-2.5 w-2.5 text-[var(--yellow)]" /> Ampliar
          </span>
        </button>
      ) : (
        <div className="flex aspect-[4/5] w-full shrink-0 flex-col items-center justify-center gap-2 border-b border-dashed border-white/15 text-white/25">
          <FaQuoteLeft className="h-6 w-6" />
          <span className="text-xs">Print da conversa</span>
        </div>
      ))}

      <div className="flex flex-1 flex-col p-5">
        {dep.texto && <p className="flex-1 text-sm leading-relaxed text-white/75">{dep.texto}</p>}
        <div className={dep.texto ? "mt-5 border-t border-white/10 pt-4" : ""}>
          <p className="text-sm font-medium">{dep.nome}</p>
          {(dep.empresa || dep.projeto) && (
            <p className="mt-0.5 text-xs text-white/45">{[dep.empresa, dep.projeto].filter(Boolean).join(", ")}</p>
          )}
          {dep.servico && (
            <span className="mt-3 inline-block rounded-full border border-[#70EA58]/30 px-2.5 py-0.5 text-xs text-[var(--green)]">{dep.servico}</span>
          )}
        </div>
      </div>
    </article>
  );
}
