import { useState } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import Notf from './assets/Notf.png';

const NOME = "João";
const RESPEITAR_MOVIMENTO_REDUZIDO = false;
const EASE = [0.22, 1, 0.36, 1] as const;

const FRASES = [
  "Juro que não escondi essa página.",
  "Que? Como assim esse link quebrou???",
  "404! 404! 494!",
  "POXA, Logo na melhor parte..",
];

export default function NotFound() {
  const prefereReduzir = useReducedMotion() ?? false;
  const reduce = RESPEITAR_MOVIMENTO_REDUZIDO && prefereReduzir;
  const [path] = useState(() => (typeof window !== "undefined" ? window.location.pathname : "/"));
  const [frase] = useState(() => FRASES[Math.floor(Math.random() * FRASES.length)]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: EASE },
  });

  const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1D1F] hover:scale-[1.03]";

  return (
    <div style={{ "--green": "#A3E635" } as CSSProperties} className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#1B1D1F] font-['Inter'] text-white md:h-auto md:min-h-screen md:overflow-x-hidden md:overflow-y-auto">
      <main className="mx-auto grid min-h-0 w-full max-w-[1280px] flex-1 items-center gap-3 px-5 py-3 md:gap-12 md:px-10 md:pb-20 md:pt-16 lg:grid-cols-12 lg:gap-8">
        <div className="order-first flex justify-center lg:order-last lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40, rotate: reduce ? 3 : -8 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            whileHover={reduce ? undefined : { rotate: 0 }}
            transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.2, ease: EASE }}
            className="relative flex w-full max-w-[320px] flex-row-reverse items-center gap-3 md:block"
          >
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-[var(--green)]" aria-hidden />
            <div className="relative aspect-[4/5] w-[100px] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#2F3134] md:w-full">
              {Notf ? (
                <img src={Notf} alt={`Foto de ${NOME}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 border-2 border-dashed border-white/15 text-white/30">
                  <span className="text-5xl font-light">{NOME[0]}</span>
                  <span className="text-xs">Sua foto aqui</span>
                </div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: reduce ? 0 : 1 }}
              style={{ originX: 1, originY: 1 }}
              className="relative max-w-[168px] rounded-2xl rounded-br-sm bg-white px-3 py-2 text-xs font-medium leading-snug text-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:absolute md:-left-14 md:top-4 md:max-w-[230px] md:px-4 md:py-3 md:text-sm"
            >
              {frase}
            </motion.div>
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          <h1 aria-label="Erro 404" className="flex select-none text-[clamp(4.5rem,22vw,6rem)] font-light leading-[0.9] tracking-tighter sm:text-[clamp(6rem,24vw,16rem)]">
            {["4", "0", "4"].map((d, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]" aria-hidden>
                <motion.span
                  className="block"
                  initial={{ y: reduce ? "0%" : "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.12, ease: EASE }}
                >
                  {d}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div {...fade(0.5)} className="mt-2 max-w-xl sm:mt-5">
            <p className="text-2xl font-light sm:text-3xl md:text-5xl">Ops, aqui não tem nada.</p>
            <p className="mt-2 text-sm text-white/55 sm:mt-3 sm:text-base md:text-lg">
              A página que você tentou abrir não existe ou mudou de lugar. O resto do portfólio está todo no ar.
            </p>
          </motion.div>

          <motion.p {...fade(0.65)} className="mt-4 w-fit max-w-full overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs text-white/55 sm:mt-7 sm:px-4 sm:py-3 sm:text-sm">
            <span className="text-[var(--green)]">GET</span> {path} <span className="text-white/30">404 Not Found</span>
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[var(--green)]" aria-hidden />
          </motion.p>

          <motion.div {...fade(0.8)} className="mt-4 flex flex-col gap-2 sm:mt-9 sm:flex-row sm:gap-3">
            <a href="/" className={`${btn} px-4 py-2.5 sm:px-6 sm:py-3.5 bg-[var(--green)] text-black`}>
              <FaHome className="h-4 w-4" /> Voltar ao início
            </a>
            <button type="button" onClick={() => window.history.back()} className={`${btn} px-4 py-2.5 sm:px-6 sm:py-3.5 border border-white/15 text-white/80 hover:border-white/40`}>
              <FaArrowLeft className="h-3.5 w-3.5" /> Página anterior
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
