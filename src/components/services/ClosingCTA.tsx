import { motion } from "motion/react";
import { CTA_FECHAMENTO, EASE } from "../../data/servicos.config";
import { SERVICOS } from "../../data/servicos.data";
import MaskTitle from "../MaskTitle";
import Reveal from "../Reveal";
import WaButton from "../WaButton";

export default function ClosingCTA({ activeService, onSelect, shouldReduce }: { activeService: number; onSelect: (i: number) => void; shouldReduce: boolean }) {
  const servico = SERVICOS[activeService];

  return (
    <section className="relative mx-auto w-full max-w-[1280px] px-6 pb-20 pt-8 md:px-10 md:pb-28">
      <motion.div
        initial={{ opacity: shouldReduce ? 1 : 0, clipPath: shouldReduce ? "inset(0% 0% 0% 0% round 2rem)" : "inset(14% 10% 14% 10% round 2rem)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 2rem)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduce ? 0 : 1, ease: EASE }}
        className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--green)_55%,var(--yellow)_100%)] p-6 text-black sm:p-8 md:p-12 lg:p-16"
      >
        <div className="relative grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col justify-between lg:col-span-7">
            <MaskTitle shouldReduce={shouldReduce} className="text-xl font-light leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
              {CTA_FECHAMENTO.titulo}
            </MaskTitle>
            <Reveal shouldReduce={shouldReduce} delay={0.3}>
              <p className="mt-4 max-w-md text-lg leading-snug text-black/70">{CTA_FECHAMENTO.subtitulo}</p>
            </Reveal>
          </div>

          <Reveal shouldReduce={shouldReduce} delay={0.2} className="lg:col-span-5">
            <div className="rounded-3xl bg-[var(--bgcolor)] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.25)] md:p-6">
              <p id="cta-label" className="text-sm text-white/60">Qual projeto você tem em mente?</p>
              <div role="group" aria-labelledby="cta-label" className="mt-4 flex flex-col gap-2">
                {SERVICOS.map((s, i) => {
                  const on = i === activeService;
                  return (
                    <button
                      key={s.titulo}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onSelect(i)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] ${on ? "border-white/20 bg-white/[0.08] font-medium text-white" : "border-white/5 bg-white/[0.02] text-white/60 hover:bg-white/[0.04]"}`}
                    >
                      <span>{s.titulo}</span>
                      <span className={`h-2 w-2 rounded-full transition-colors ${on ? "bg-[var(--yellow)] shadow-[0_0_8px_var(--yellow)]" : "bg-white/20"}`} />
                    </button>
                  );
                })}
              </div>
              <div className="mt-6">
                <WaButton servico={servico.titulo} label={`Iniciar ${servico.titulo}`} tone="dark" full />
              </div>
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}
