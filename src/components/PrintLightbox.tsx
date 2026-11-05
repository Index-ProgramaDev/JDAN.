import { useEffect } from "react";
import { motion } from "motion/react";
import { FaTimes } from "react-icons/fa";
import type { Depoimento } from "../data/depoimentos.data";

export default function PrintLightbox({ dep, onClose, shouldReduce }: { dep: Depoimento; onClose: () => void; shouldReduce: boolean }) {
  // Fecha com ESC e bloqueia o scroll da página enquanto aberto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Print do depoimento de ${dep.nome}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduce ? 0 : 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
    >
      <button type="button" autoFocus onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]">
        <FaTimes className="h-4 w-4" />
      </button>
      <img src={dep.print} alt={`Print do depoimento de ${dep.nome}`} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-full rounded-xl object-contain" />
    </motion.div>
  );
}
