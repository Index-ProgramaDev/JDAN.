import { AnimatePresence, motion } from "motion/react";
import { SiGithub } from "react-icons/si";
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaImage } from "react-icons/fa";
import type { Projeto } from "../../data/data";
import { getTechIcon } from "../../data/techIcons";

const H4 = "text-[0.6rem] uppercase tracking-[0.25em] text-white/40";
const NAV_BTN = "flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-[var(--green)]";
const LINK = "flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.8rem] transition-all hover:border-[var(--green)] hover:text-[var(--green)]";

type Props = {
  projeto: Projeto;
  index: number;
  total: number;
  revealing: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function ProjectDetail({ projeto, index, total, revealing, onPrev, onNext }: Props) {
  const links = (
    [
      [projeto.github, SiGithub, "Código", "h-5 w-5", "#7ED957"],
      [projeto.demo, FaExternalLinkAlt, "Ver online", "h-5 w-5", "#F5C518"],
    ] as const
  ).filter(([url]) => url && url !== "#");

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm max-md:!h-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto max-md:!flex-none"
        >
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[linear-gradient(135deg,rgba(126,217,87,0.10),rgba(245,197,24,0.06))] max-md:!aspect-[16/10]">
            {projeto.imagem ? (
              <img src={projeto.imagem} alt={projeto.titulo} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/25">
                <FaImage className="h-10 w-10" />
                <span className="text-[0.6rem] uppercase tracking-[0.3em]">Imagem do projeto</span>
                <span className="text-[0.55rem] text-white/15">defina "imagem" em PROJETOS</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="flex flex-1 flex-col p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">Projeto</p>
              <div className="flex items-center gap-2">
                {revealing && (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.2em] text-white/50">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: "#F5C518" }}
                    />
                    auto
                  </span>
                )}
                {projeto.destaque && (
                  <span className="rounded-full bg-[var(--green)] px-2 py-0.5 text-[0.55rem] font-medium tracking-wider text-black">
                    Destaque
                  </span>
                )}
              </div>
            </div>

            <h3 className="mt-1.5 text-xl font-medium lg:text-2xl">{projeto.titulo}</h3>
            <p className="mt-2 text-[0.82rem] leading-snug text-white/60">{projeto.descricao}</p>

            <section className="mt-4">
              <h4 className={H4}>Stack</h4>
              <ul className="mt-2 flex flex-wrap gap-2.5">
                {projeto.techs.map((tech) => {
                  const t = getTechIcon(tech);
                  return t ? (
                    <li key={tech} title={tech} style={{ backgroundColor: `${t.color}1F`, borderColor: `${t.color}59` }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all hover:scale-110">
                      <t.Icon aria-label={tech} className="h-6 w-6" style={{ color: t.color }} />
                    </li>
                  ) : (
                    <li key={tech} className="max-w-[8rem] rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-center text-[0.68rem] leading-tight text-white/70 break-words">
                      {tech}
                    </li>
                  );
                })}
              </ul>
            </section>

            {links.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {links.map(([url, Icon, label, size, color]) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer" className={LINK}>
                    <Icon className={size} style={{ color }} /> {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {total > 1 && (
        <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-5 py-2.5 lg:px-6">
          <button type="button" onClick={onPrev} aria-label="Projeto anterior" className={NAV_BTN}>
            <FaChevronLeft className="h-3 w-3" /> Anterior
          </button>
          <span className="text-[0.65rem] text-white/30">{index + 1} / {total}</span>
          <button type="button" onClick={onNext} aria-label="Próximo projeto" className={NAV_BTN}>
            Próximo <FaChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
