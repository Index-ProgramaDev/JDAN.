import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_NUMERO, waLink } from "../data/servicos.config";

// Botão de contato via WhatsApp — desabilitado se o número não estiver configurado
export default function WaButton({ servico, label, tone = "green", full = false }: { servico: string; label: string; tone?: "green" | "dark"; full?: boolean }) {
  const base = `inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${full ? "w-full justify-center" : ""}`;

  if (!WHATSAPP_NUMERO) {
    return (
      <span title="Configure WHATSAPP_NUMERO em servicos.config.ts" aria-disabled="true" className={`${base} cursor-not-allowed border ${tone === "dark" ? "border-black/20 bg-black/5 text-black/40" : "border-white/10 bg-white/5 text-white/40"}`}>
        <FaWhatsapp className="h-4 w-4" /> Configurar WhatsApp
      </span>
    );
  }

  return (
    <a href={waLink(servico)} target="_blank" rel="noreferrer" className={`${base} hover:scale-[1.03] ${tone === "dark" ? "bg-[var(--bgcolor)] text-white focus-visible:ring-black focus-visible:ring-offset-[var(--green)]" : "bg-[var(--green)] text-black focus-visible:ring-[var(--green)] focus-visible:ring-offset-[var(--bgcolor)]"}`}>
      <FaWhatsapp className="h-4 w-4" /> {label}
    </a>
  );
}
