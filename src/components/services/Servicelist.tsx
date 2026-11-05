import { AnimatePresence, motion } from "motion/react";
import { FaCheck } from "react-icons/fa";
import { EASE } from "../../data/servicos.config";
import { SERVICOS, SERVICO_INCLUSO, SERVICO_TECHS } from "../../data/servicos.data";
import MaskTitle from "../MaskTitle";
import WaButton from "../WaButton";

export default function ServicesList({ activeService, onSelect, shouldReduce, start }: { activeService: number; onSelect: (i: number) => void; shouldReduce: boolean; start: boolean }) {
  const active = SERVICOS[activeService];
  const incluso = SERVICO_INCLUSO[active.titulo] ?? [];
  const techs = SERVICO_TECHS[active.titulo] ?? [];

  const load = (delay: number) => {
    const hidden = { opacity: 0, y: shouldReduce ? 0 : 28 };
    return {
      initial: hidden,
      animate: start ? { opacity: 1, y: 0 } : hidden,
      transition: { duration: shouldReduce ? 0 : 0.8, delay: shouldReduce ? 0 : delay, ease: EASE },
    };
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
      <header>
        <div className="flex items-end gap-6">
          <MaskTitle shouldReduce={shouldReduce} start={start} className="text-4xl font-light tracking-wide text-[#EC4899] lg:text-5xl">
            SERVIÇOS
          </MaskTitle>
          <motion.span
            className="mb-4 hidden h-px w-[36%] origin-left bg-[linear-gradient(to_right,var(--green),var(--yellow),transparent)] opacity-60 sm:block"
            initial={{ scaleX: shouldReduce ? 1 : 0 }}
            animate={{ scaleX: start || shouldReduce ? 1 : 0 }}
            transition={{ duration: shouldReduce ? 0 : 1.1, delay: shouldReduce ? 0 : 0.35, ease: EASE }}
          />
        </div>
        <motion.p {...load(0.4)} className="mt-1 max-w-xl text-sm text-white/50 md:text-base">
          Do site simples ao sistema completo, o que posso construir para você.
        </motion.p>
      </header>

      <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-10">
        <div className="flex h-full flex-col justify-center md:col-span-5 lg:col-span-4">
          <ul className="flex flex-col gap-2">
            {SERVICOS.map((s, i) => {
              const isActive = i === activeService;
              return (
                <motion.li key={s.titulo} {...load(0.5 + i * 0.1)}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-pressed={isActive}
                    className={`group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bgcolor)] md:px-5 md:py-5 ${isActive ? "border-white/10 bg-white/[0.06]" : "border-transparent hover:border-white/10 hover:bg-white/[0.02]"}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="service-active-indicator"
                        className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[linear-gradient(to_bottom,var(--green),var(--yellow))]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        aria-hidden
                      />
                    )}
                    <span className={`font-mono text-xs tabular-nums transition-colors ${isActive ? "text-[var(--green)]" : "text-white/30"}`}>
                      0{i + 1}
                    </span>
                    <span className={`flex-1 text-lg font-light transition-colors md:text-xl ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                      {s.titulo}
                    </span>
                    <s.Icone className={`h-5 w-5 transition-colors ${isActive ? "text-[var(--yellow)]" : "text-white/20 group-hover:text-white/50"}`} />
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <motion.div {...load(0.8)} className="md:col-span-7 lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduce ? 0 : -12 }}
              transition={{ duration: shouldReduce ? 0 : 0.35, ease: EASE }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-[#FFD138]/30 bg-[#FFD138]/10 px-3 py-1 text-xs text-[var(--yellow)]">
                    {active.tag}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-white/30">
                    0{activeService + 1} / 0{SERVICOS.length}
                  </span>
                </div>

                {active.imagem && (
                  <img src={active.imagem} alt={active.titulo} className="mt-5 aspect-[16/9] w-full rounded-2xl object-cover" />
                )}

                <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
                  {active.descricao}
                </p>

                {incluso.length > 0 && (
                  <>
                    <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.15em] !text-[#FFD138]">
                      O que está incluso
                    </h3>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {incluso.map((item) => (
                        <li key={item} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 text-sm leading-snug text-white/75">
                          <FaCheck className="mt-0.5 h-3 w-3 shrink-0 text-[var(--green)]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {techs.length > 0 && (
                  <>
                    <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                      Tecnologias usadas
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {techs.map((t) => (
                        <li key={t} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/65">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-8">
                  <WaButton servico={active.titulo} label={`Orçar ${active.titulo}`} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
