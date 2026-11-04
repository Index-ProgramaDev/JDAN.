import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import type { IconType } from "react-icons";
import { SiReact, SiTailwindcss, SiAngular, SiTypescript, SiPostgresql, SiMongodb, SiFlutter, SiGit, SiVercel, SiDocker, SiGithub } from "react-icons/si";
import { FaNodeJs, FaLaptopCode, FaMobileAlt, FaRocket } from "react-icons/fa";
import Navbar from "../components/Navbar";

// STACK
type Tech = { nome: string; Icone: IconType; cor: string };
const STACK: { titulo: string; techs: Tech[] }[] = [
  { titulo: "Frontend", techs: [
    { nome: "React", Icone: SiReact, cor: "#61DAFB" },
    { nome: "Tailwind CSS", Icone: SiTailwindcss, cor: "#38BDF8" },
    { nome: "Angular", Icone: SiAngular, cor: "#D946EF" },
  ] },
  { titulo: "Backend", techs: [
    { nome: "Node.js", Icone: FaNodeJs, cor: "#68A063" },
    { nome: "TypeScript", Icone: SiTypescript, cor: "#3178C6" },
  ] },
  { titulo: "Database", techs: [
    { nome: "PostgreSQL", Icone: SiPostgresql, cor: "#6B9BD2" },
    { nome: "MongoDB", Icone: SiMongodb, cor: "#22C55E" },
  ] },
  { titulo: "Mobile", techs: [{ nome: "Flutter", Icone: SiFlutter, cor: "#54C5F8" }] },
  { titulo: "DevOps", techs: [
    { nome: "Git", Icone: SiGit, cor: "#F05032" },
    { nome: "Vercel", Icone: SiVercel, cor: "#FFFFFF" },
    { nome: "Docker", Icone: SiDocker, cor: "#2496ED" },
    { nome: "GitHub", Icone: SiGithub, cor: "#FFFFFF" },
  ] },
];

// SERVIÇOS
type Servico = { titulo: string; descricao: string; Icone: IconType };
const SERVICOS: Servico[] = [
  { titulo: "Web Fullstack", descricao: "Aplicações seguras, rápidas e escaláveis com Node, React e TypeScript.", Icone: FaLaptopCode },
  { titulo: "Apps Mobile", descricao: "Construção de APPs com Flutter e boas práticas de código.", Icone: FaMobileAlt },
  { titulo: "Freelance", descricao: "Atuação no mercado freelance, entregando soluções sob medida.", Icone: FaRocket },
];

// Hook — detecta mobile (para simplificar o horizontal)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function Servicos({ start = true }: { start?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Suaviza o progresso bruto (evita saltos do wheel/touch)
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const isMobile = useIsMobile();

  // Serviços: hold → fade + sobe
  const servicesOpacity = useTransform(smoothProgress, [0.05, 0.22], [1, 0]);
  const servicesY = useTransform(smoothProgress, [0.05, 0.22], [0, -70]);
  const servicesScale = useTransform(smoothProgress, [0.05, 0.22], [1, 0.96]);

  // Stack: fade-in + entrada horizontal
  const stackOpacity = useTransform(smoothProgress, [0.28, 0.42], [0, 1]);
  // Desktop: entra da direita e deriva sutilmente à esquerda no final
  const stackXDesktop = useTransform(smoothProgress, [0.28, 0.55, 0.85], ["100%", "0%", "-4%"]);
  // Mobile: sem deslocamento horizontal (apenas fade)
  const stackXMobile = useTransform(smoothProgress, [0, 1], ["0%", "0%"]);
  const stackX = isMobile ? stackXMobile : stackXDesktop;

  // Pointer-events dinâmicos
  const [servicesActive, setServicesActive] = useState(true);
  const [stackActive, setStackActive] = useState(false);
  useMotionValueEvent(smoothProgress, "change", (v) => {
    setServicesActive((prev) => (prev === v < 0.22 ? prev : v < 0.22));
    setStackActive((prev) => (prev === v > 0.30 ? prev : v > 0.30));
  });

  // Eventos
  useEffect(() => {
    const emit = (name: string, detail?: unknown) => window.dispatchEvent(new CustomEvent(name, detail ? { detail } : undefined));
    const fired = new Set<string>();
    const thresholds: { name: string; at: number }[] = [
      { name: "ServicesEnter", at: 0.0 }, { name: "ServicesHold", at: 0.02 }, { name: "ServicesExit", at: 0.08 },
      { name: "StackEnter", at: 0.28 }, { name: "StackFocus", at: 0.55 }, { name: "ServicesComplete", at: 0.88 },
    ];
    let last = 0;
    const unsub = smoothProgress.on("change", (v) => {
      // Reversão
      if (v < last - 0.03 && v > 0.01) {
        emit("ScrollReverse", { progress: v });
        for (const t of thresholds) if (v < t.at) fired.delete(t.name);
      }
      for (const t of thresholds) if (v >= t.at && !fired.has(t.name)) { fired.add(t.name); emit(t.name); }
  
      if (v >= 0.28 && v <= 0.88 && Math.abs(v - last) > 0.004) emit("StackHorizontalMove", { progress: v });
      last = v;
    });
    return unsub;
  }, [smoothProgress]);

  // Hint inicial de scroll
  const hintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  return (
    <section className="relative flex flex-col bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,rgba(47,49,52,0.5)_85%,#2F3134_100%)] font-['Inter'] text-white">
      <Navbar />
      {/* Container scroll-driven */}
      <div ref={containerRef} className="relative h-[350vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* CAMADA 1 — SERVIÇOS */}
          <motion.div
            style={{ opacity: servicesOpacity, y: servicesY, scale: servicesScale }}
            className={`absolute inset-0 flex flex-col ${servicesActive ? "" : "pointer-events-none"}`}
            aria-hidden={!servicesActive}
          >
            <div className="mx-auto w-full max-w-[1280px] flex-1 px-10 pb-16 pt-12 md:pt-16">
              {/* Cabeçalho — mesmo padrão do STACK */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-end gap-6">
                  <h2 className="text-5xl font-light tracking-wide lg:text-6xl">SERVIÇOS</h2>
                  <span className="mb-3 hidden h-px w-[44%] bg-[linear-gradient(to_right,var(--green),transparent)] opacity-60 sm:block" />
                </div>
                <p className="mt-4 text-white/50">O que posso construir para você.</p>
              </motion.div>
              {/* Cards */}
              <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
                {SERVICOS.map(({ titulo, descricao, Icone }, i) => (
                  <motion.div
                    key={titulo}
                    initial={{ opacity: 0, y: 32 }}
                    animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
                    className="group rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 lg:p-8"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icone className="h-7 w-7 text-[var(--green)] transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mt-6 text-xl font-medium lg:text-2xl">{titulo}</h3>
                    <p className="mt-3 text-sm leading-snug text-white/60 lg:text-base">{descricao}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Hint de scroll */}
            <motion.div style={{ opacity: hintOpacity }} className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-white/50 backdrop-blur-sm">Role para ver a stack</span>
              <motion.svg
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                width="16" height="16" viewBox="0 0 16 16" className="text-[var(--green)]" aria-hidden="true"
              >
                <path d="M4 6L8 10L12 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.div>
          </motion.div>

          {/* CAMADA 2 — STACK (horizontal) */}
          <motion.div
            style={{ opacity: stackOpacity }}
            className={`absolute inset-0 flex flex-col ${stackActive ? "" : "pointer-events-none"}`}
            aria-hidden={!stackActive}
          >
            <motion.div style={{ x: stackX }} className="flex-1">
              <div className="mx-auto w-full max-w-[1280px] flex-1 px-10 pb-16 pt-12 md:pt-16">
                {/* Cabeçalho */}
                <div className="flex items-end gap-6">
                  <h2 className="text-5xl font-light tracking-wide lg:text-6xl">STACK</h2>
                  <span className="mb-3 hidden h-px w-[44%] bg-[linear-gradient(to_right,var(--green),transparent)] opacity-60 sm:block" />
                </div>
                {/* Cards */}
                <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-12 md:mt-16 lg:justify-between">
                  {STACK.map(({ titulo, techs }) => (
                    <div key={titulo} className="flex flex-col items-center">
                      <div className="group flex h-72 w-28 flex-col items-center justify-around rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_40px_rgba(0,0,0,0.5)] sm:w-32 lg:h-80 lg:w-36">
                        {techs.map(({ nome, Icone, cor }) => (
                          <Icone key={nome} title={nome} style={{ fill: cor, color: cor }} className="h-11 w-11 transition-transform duration-300 hover:scale-110 lg:h-14 lg:w-14" />
                        ))}
                      </div>
                      <p className="mt-5 text-xl lg:text-2xl">{titulo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Rail de progresso (direita) */}
          <div className="pointer-events-none absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
            <span style={{ writingMode: "vertical-rl" }} className="text-[0.5rem] uppercase tracking-[0.35em] text-white/30">Progresso</span>
            <div className="relative h-24 w-px overflow-hidden bg-white/10">
              <motion.div style={{ scaleY: smoothProgress }} className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--green)] to-[#F5C518]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}