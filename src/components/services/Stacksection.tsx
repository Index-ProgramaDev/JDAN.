import { useState } from "react";
import { motion } from "motion/react";
import { SERVICOS, SERVICO_TECHS } from "../../data/servicos.data";
import { STACK } from "../../data/stack.data";

export default function StackSection({ activeService, shouldReduce }: { activeService: number; isMobile: boolean; shouldReduce: boolean }) {
  const [focusedTech, setFocusedTech] = useState<string | null>(null);
  const activeServico = SERVICOS[activeService];
  const relatedTechs = SERVICO_TECHS[activeServico.titulo] ?? [];

  // Destaca a tech em foco ou as relacionadas ao serviço ativo
  const isHighlighted = (nome: string) => focusedTech ? focusedTech === nome : relatedTechs.includes(nome);
  const isDimmed = (nome: string) => {
    if (focusedTech) return focusedTech !== nome;
    if (relatedTechs.length === 0) return false;
    return !relatedTechs.includes(nome);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: shouldReduce ? 0 : 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.5 } },
  };

  return (
    <section className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-20">
      <header className="text-center">
        <div className="flex items-end justify-center gap-6">
          <h2 className="text-4xl font-light tracking-wide lg:text-5xl">STACK</h2>
        </div>
        <p className="mt-3 text-sm text-white/50">
          Ferramentas do dia a dia — destacando o que uso em{" "}
          <span className="text-[var(--yellow)]">{activeServico.titulo}</span>.
        </p>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-10 md:mt-14 md:gap-x-8"
      >
        {STACK.map(({ titulo, techs }) => (
          <motion.div key={titulo} variants={item} className="flex flex-col items-center">
            <div className="group flex h-72 w-28 flex-col items-center justify-around rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_40px_rgba(0,0,0,0.5)] sm:w-32 lg:h-80 lg:w-36">
              {techs.map(({ nome, Icone, cor }) => {
                const highlighted = isHighlighted(nome);
                const dimmed = isDimmed(nome);
                return (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => setFocusedTech(focusedTech === nome ? null : nome)}
                    aria-label={nome}
                    aria-pressed={focusedTech === nome}
                    title={nome}
                    className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bgcolor)] ${dimmed ? "opacity-30 hover:opacity-60" : "opacity-100"} ${highlighted ? "scale-110" : "hover:scale-110"}`}
                  >
                    {highlighted && !shouldReduce && (
                      <span className="pointer-events-none absolute inset-0 rounded-full opacity-40 blur-md" style={{ background: cor }} aria-hidden />
                    )}
                    <Icone style={{ fill: cor, color: cor }} className="relative h-11 w-11 lg:h-14 lg:w-14" />
                  </button>
                );
              })}
            </div>
            <p className="mt-5 text-xl lg:text-2xl">{titulo}</p>
          </motion.div>
        ))}
      </motion.div>

      {focusedTech && (
        <p className="mt-8 text-center text-[0.65rem] uppercase tracking-[0.25em] text-white/40">
          Filtrando por{" "}
          <button onClick={() => setFocusedTech(null)} className="text-[var(--green)] underline underline-offset-4">
            {focusedTech} · limpar
          </button>
        </p>
      )}
    </section>
  );
}
