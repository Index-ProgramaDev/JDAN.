import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { DIRECAO_CARROSSEL, SEGUNDOS_POR_CARD } from "../../data/servicos.config";
import { DEPOIMENTOS } from "../../data/depoimentos.data";
import type { Depoimento } from "../../data/depoimentos.data";
import MaskTitle from "../MaskTitle";
import Reveal from "../Reveal";
import TestimonialCard from "../TestimonialCard";
import PrintLightbox from "../PrintLightbox";

export default function Testimonials({ shouldReduce }: { shouldReduce: boolean }) {
  const [zoom, setZoom] = useState<Depoimento | null>(null);

  // Duplica o array para criar o efeito de carrossel infinito
  const repeticoes = Math.max(1, Math.ceil(4 / DEPOIMENTOS.length));
  const base = Array.from({ length: repeticoes }).flatMap(() => DEPOIMENTOS);
  const looped = [...base, ...base];
  const duration = Math.max(20, base.length * SEGUNDOS_POR_CARD);
  const direction = DIRECAO_CARROSSEL === "esquerda" ? "normal" : "reverse";

  return (
    <section className="relative w-full py-16 md:py-20" aria-roledescription="carousel" aria-label="Depoimentos de clientes">
      <style>{`@keyframes testimonial-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}.testimonial-track{animation:testimonial-marquee ${duration}s linear infinite;animation-direction:${direction};will-change:transform}`}</style>

      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <MaskTitle className="text-4xl font-light tracking-wide !text-[var(--pink)] lg:text-5xl" shouldReduce={shouldReduce}>CLIENTES</MaskTitle>
        <Reveal shouldReduce={shouldReduce} delay={0.15}>
          <p className="mt-1 text-sm text-white/50">Conversas e feedbacks reais. Clique no print para ampliar.</p>
        </Reveal>
      </div>

      <Reveal shouldReduce={shouldReduce} delay={0.25} className="mt-10 md:mt-12">
        {shouldReduce ? (
          <ul className="flex gap-5 overflow-x-auto px-6 pb-4 md:px-10">
            {DEPOIMENTOS.map((dep, i) => (
              <li key={i} className="w-[320px] shrink-0 sm:w-[380px]">
                <TestimonialCard dep={dep} onZoom={setZoom} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
            <ul className="testimonial-track flex w-max">
              {looped.map((dep, i) => {
                const clone = i >= base.length;
                return (
                  <li key={i} className="w-[360px] shrink-0 pr-5 sm:w-[380px]" aria-hidden={clone}>
                    <TestimonialCard dep={dep} onZoom={setZoom} focusable={!clone} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Reveal>

      <AnimatePresence>
        {zoom && <PrintLightbox dep={zoom} onClose={() => setZoom(null)} shouldReduce={shouldReduce} />}
      </AnimatePresence>
    </section>
  );
}
