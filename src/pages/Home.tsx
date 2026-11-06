import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Navbar from "../components/Navbar";
import MinhaFoto1 from "../assets/Eu.png";
import MinhaFoto2 from "../assets/Eu2.png";
import MinhaFoto3 from "../assets/Eu3.png";
import InstagramIcon from "../assets/icons/instagram.svg";
import LinkedinIcon from "../assets/icons/Linkedin.svg";
import GithubIcon from "../assets/icons/github.svg";
import WhatsappIcon from "../assets/icons/whatsapp.svg";

const fotos = [MinhaFoto1, MinhaFoto2, MinhaFoto3];

const redes = [
  { label: "Instagram", href: "https://www.instagram.com/bernardo.devcode?utm_source=ig_web_button_share_sheet&dlrf=ZDNlZDc0MzIxNw==", icon: InstagramIcon },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/daniel-bernardo-15b974359", icon: LinkedinIcon },
  { label: "GitHub",    href: "https://github.com/index-programadev", icon: GithubIcon },
  { label: "WhatsApp",  href: "https://wa.me/5581998714983", target: "_blank", icon: WhatsappIcon },
];

type Milestone = { year: string; title: string; description: string };

const journey: Milestone[] = [
  { year: "2025",        title: "Primeiros passos",   description: "Início dos estudos em desenvolvimento web, HTML, CSS e JavaScript pelo Senac PE." },
  { year: "11/12/2025",  title: "Projetos freelance", description: "Primeiras entregas como desenvolvedor autônomo, construindo aplicações para clientes." },
  { year: "2026",        title: "Fullstack",           description: "Consolidação de arquitetura, Frameworks e Mobile" },
  { year: "Hoje",        title: "Mobile",              description: "Em constante aprendizado, lado a lado com o erro - mas na mira do sucesso>)" },
];

const CONTACT_URL = "https://wa.me/";

// Wrapper de animação de balanço suave em loop
function Sway({
  children, className = "", rotate = 1.2, y = 3, duration = 5, delay = 0, origin = "50% 50%",
}: { children: ReactNode; className?: string; rotate?: number; y?: number; duration?: number; delay?: number; origin?: string }) {
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: origin }}
      animate={{ rotate: [0, rotate, 0, -rotate, 0], y: [0, -y, 0, -y, 0] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Home({ start = true, showNav = true }: { start?: boolean; showNav?: boolean }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [ctaActive, setCtaActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Troca de foto com efeito glitch a cada 3 s
  useEffect(() => {
    let trocarFoto: number;
    let encerrarGlitch: number;
    const interval = window.setInterval(() => {
      setGlitch(true);
      trocarFoto = window.setTimeout(() => setFotoAtual((atual) => (atual + 1) % fotos.length), 140);
      encerrarGlitch = window.setTimeout(() => setGlitch(false), 380);
    }, 3000);
    return () => { window.clearInterval(interval); window.clearTimeout(trocarFoto); window.clearTimeout(encerrarGlitch); };
  }, []);

  // Scroll-driven animations mapeadas ao progresso da página
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const heroTextY       = useTransform(scrollYProgress, [0, 0.12], [0, -70]);
  const arrowOpacity    = useTransform(scrollYProgress, [0, 0.1],  [1, 0]);
  const photoScale      = useTransform(scrollYProgress, [0, 0.22, 0.5, 1], [1, 1, 0.75, 0.75]);
  const photoX          = useTransform(scrollYProgress, [0, 0.22, 0.5, 1], [0, 0, 50, 50]);
  const timelineOpacity = useTransform(scrollYProgress, [0.18, 0.32], [0, 1]);
  const lineProgress    = useTransform(scrollYProgress, [0.25, 0.68], [0, 1]);
  const ctaOpacity      = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);
  const ctaY            = useTransform(scrollYProgress, [0.72, 0.9], [50, 0]);

  // Dispara CustomEvents para sincronizar componentes externos com a posição de scroll
  useEffect(() => {
    const thresholds: { name: string; at: number }[] = [
      { name: "HeroExit",       at: 0.12 },
      { name: "JourneyReveal",  at: 0.25 },
      { name: "MilestoneReveal", at: 0.35 },
      { name: "JourneyComplete", at: 0.7  },
      { name: "CTAReveal",      at: 0.85 },
    ];
    let last = 0;
    const fired = new Set<string>();
    const emit = (name: string) => window.dispatchEvent(new CustomEvent(name));
    emit("PhotoStay");
    emit("SocialStay");
    const unsub = scrollYProgress.on("change", (v) => {
      // Ao rolar para cima, limpa os eventos disparados para permitir re-trigger
      if (v < last - 0.03 && v > 0.02) { emit("ScrollReverse"); fired.clear(); }
      for (const t of thresholds) if (v >= t.at && !fired.has(t.name)) { fired.add(t.name); emit(t.name); }
      last = v;
      const active = v > 0.72;
      setCtaActive((prev) => (prev === active ? prev : active));
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative h-[400vh] max-lg:!h-auto">
      <section className="sticky top-0 flex h-screen flex-col overflow-hidden bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,rgba(47,49,52,0.5)_80%,#2F3134_100%)] font-['Inter'] text-white max-lg:!relative max-lg:!top-auto max-lg:!h-auto max-lg:!min-h-[100svh]">
        {showNav && <Navbar />}

        {/* Decoração lateral direita — oculta no mobile */}
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -24, 0] }}
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
          className="absolute -right-16 top-[45%] h-full w-[200px] rounded-full bg-[linear-gradient(to_bottom,#2c2c2c,#232425)] max-lg:!hidden"
        />

        {/* Hero grid: texto esquerdo / foto / texto direito */}
        <motion.div
          id="principal"
          initial={{ opacity: 0, y: 24 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-10 px-10 py-16 lg:grid-cols-3 max-lg:!gap-8 max-lg:!px-6 max-lg:!py-10"
        >
          {/* Coluna esquerda */}
          <motion.div style={{ opacity: heroTextOpacity, y: heroTextY }} className="self-start max-lg:!opacity-100 max-lg:!transform-none max-lg:!text-center">
            <div className="-translate-x-[40%] translate-y-[8pc] max-lg:!translate-x-0 max-lg:!translate-y-0">
              <Sway origin="0% 50%" className="w-fit max-lg:!mx-auto"><p className="text-[2.6rem] max-lg:!text-[1.4rem]">Olá! Eu sou</p></Sway>
              <Sway origin="0% 50%" delay={0.5} rotate={1.6} y={4} className="w-fit max-lg:!mx-auto"><p className="ml-5 w-fit origin-left cursor-default whitespace-nowrap text-[3.6rem] font-medium text-[#F472B6] transition-transform duration-300 hover:-rotate-2 hover:scale-105 max-lg:!ml-0 max-lg:!mx-auto max-lg:!whitespace-normal max-lg:!text-[2rem]">João Daniel.</p></Sway>
            </div>
          </motion.div>

          {/* Coluna central: foto com glitch e seta decorativa */}
          <div className="relative mx-auto max-lg:!mx-0 max-lg:!flex max-lg:!justify-center">
            <motion.svg
              style={{ opacity: arrowOpacity }}
              aria-hidden="true"
              className="pointer-events-none absolute top-[40%] -left-[10rem] z-10 w-[25rem] -translate-x-1/2 overflow-visible max-lg:!hidden"
              viewBox="0 0 320 110" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round"
            >
              <path d="M20 12 L29 5 L38 12" strokeLinejoin="round" />
              <motion.path
                d="M30 20 C15 48 38 76 66 83 C96 91 117 68 143 48 C169 28 193 12 219 9 C245 6 265 19 282 32 C296 43 307 37 60 "
                strokeDasharray="10 11"
                animate={{ strokeDashoffset: [0, -42] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              />
            </motion.svg>

            <motion.div style={{ scale: photoScale, x: photoX }} className="relative max-lg:!transform-none">
              <div className="relative w-fit scale-90 -translate-x-[20%] max-lg:!translate-x-0">
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [-1.5, 1.5, -1.5] }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ y: { duration: 6, ease: "easeInOut", repeat: Infinity }, rotate: { duration: 7, ease: "easeInOut", repeat: Infinity }, scale: { type: "spring", stiffness: 200, damping: 18 } }}
                  className="relative"
                >
                  <div className={`photo-glitch relative aspect-square h-60 w-60 shrink-0 overflow-hidden rounded-full sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-[420px] lg:w-[420px] xl:h-[500px] xl:w-[500px] ${glitch ? "is-glitching" : ""}`}>
                    <img key={fotoAtual} src={fotos[fotoAtual]} alt="João Daniel" className="photo-base" />
                    <img src={fotos[fotoAtual]} alt="" aria-hidden="true" className="photo-layer photo-red" />
                    <img src={fotos[fotoAtual]} alt="" aria-hidden="true" className="photo-layer photo-green" />
                    <img src={fotos[fotoAtual]} alt="" aria-hidden="true" className="photo-layer photo-blue" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Coluna direita */}
          <motion.div style={{ opacity: heroTextOpacity, y: heroTextY }} className="self-start lg:justify-self-end max-lg:!opacity-100 max-lg:!transform-none max-lg:!self-center max-lg:!text-center">
            <div className="max-w-sm translate-y-[2.5pc] max-lg:!translate-y-0 max-lg:!mx-auto">
              <Sway origin="0% 50%" delay={0.3} className="w-fit max-lg:!mx-auto"><p className="text-[2.5rem] max-lg:!text-[1.4rem]">Dev</p></Sway>
              <Sway origin="0% 50%" delay={0.9} rotate={1.6} y={4} className="w-fit max-lg:!mx-auto"><p className="ml-6 inline-block cursor-default border-b border-[#7ED957] px-2 pb-2 text-[3rem] font-medium text-[#F5C518] transition-all duration-300 hover:scale-105 hover:border-[#F5C518] hover:tracking-wider max-lg:!ml-0 max-lg:!text-[1.8rem]">FULLSTACK</p></Sway>
              <Sway rotate={0.5} y={5} duration={7} delay={1.4} className="mt-12 max-lg:!mt-6"><p className="text-[22px] leading-snug max-lg:!text-[15px]">
                Eu sou João - Dev Fullstack. atuante no mercado freelance. Faço aplicações seguras, rápidas e
                escaláveis com Node, React e Typescript. Construo APPS com Flutter e boas práticas de código ;)
              </p></Sway>
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline de trajetória — posicionada absolutamente no desktop */}
        <motion.div style={{ opacity: timelineOpacity }} className="pointer-events-none absolute z-20 left-[5%] top-[16%] bottom-[20%] w-[42%] lg:w-[30%] max-lg:!static max-lg:!left-auto max-lg:!top-auto max-lg:!bottom-auto max-lg:!w-full max-lg:!opacity-100 max-lg:!pointer-events-auto max-lg:!px-6 max-lg:!py-8" aria-hidden={false}>
          <JourneyTimeline lineProgress={lineProgress} scrollYProgress={scrollYProgress} />
        </motion.div>

        {/* CTA de contato — aparece na última seção do scroll */}
        <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className={`absolute z-20 right-[5%] top-1/2 w-[42%] -translate-y-1/2 text-left lg:w-[30%] ${ctaActive ? "" : "pointer-events-none"} max-lg:!static max-lg:!right-auto max-lg:!top-auto max-lg:!translate-y-0 max-lg:!w-full max-lg:!opacity-100 max-lg:!transform-none max-lg:!pointer-events-auto max-lg:!px-6 max-lg:!py-8 max-lg:!text-center`}>
          <Sway rotate={0.8} y={4} delay={0.3}><h2 className="text-[2.2rem] font-medium leading-tight lg:text-[2.6rem] max-lg:!text-[1.6rem]">Tem um projeto em mente?</h2></Sway>
          <Sway rotate={0.5} y={3} delay={0.9}><p className="mt-4 text-[1.05rem] leading-snug text-white/70 lg:text-[1.2rem] max-lg:!text-[0.95rem]">Vamos conversar e transformar sua ideia em realidade.</p></Sway>
          {/* Botão com pulso animado para chamar atenção */}
          <motion.a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            animate={{ boxShadow: ["0 0 0 0 rgba(244,114,182,0.55)", "0 0 0 18px rgba(244,114,182,0)"] }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            transition={{ boxShadow: { duration: 1.8, ease: "easeOut", repeat: Infinity }, scale: { type: "spring", stiffness: 400, damping: 20 } }}
            className="mt-8 inline-block rounded-full bg-[#F472B6] px-8 py-3 font-medium text-white max-lg:!mt-6"
          >
            Vamos conversar
          </motion.a>
        </motion.div>

        {/* Redes sociais com animação de onda escalonada */}
        <div className="absolute bottom-16 left-[5%] flex items-center gap-8 max-lg:!static max-lg:!mt-8 max-lg:!justify-center max-lg:!gap-6 max-lg:!px-6">
          {redes.map((r, i) => (
            <motion.a
              key={r.label}
              href={r.href}
              aria-label={r.label}
              whileHover={{ scale: 1.2, rotate: -8 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <motion.img
                src={r.icon}
                alt={r.label}
                className="h-12 w-12 max-lg:!h-10 max-lg:!w-10"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.2, delay: i * 0.25 }}
              />
            </motion.a>
          ))}
        </div>

        <p className="absolute bottom-[12%] right-[20%] text-right font-['Leckerli_One'] text-[1.7rem] text-white/30 transition-colors duration-300 hover:text-white/60 max-lg:!static max-lg:!mt-6 max-lg:!text-center max-lg:!pb-8 max-lg:!text-[1.1rem]">Design e código por:<br />@Bernardo.devcode</p>
      </section>
    </div>
  );
}

// Timeline minimalista com linha SVG animada por scroll
function JourneyTimeline({ lineProgress, scrollYProgress }: { lineProgress: MotionValue<number>; scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative flex h-full flex-col justify-between py-4 pl-8 max-lg:!h-auto max-lg:!justify-start max-lg:!gap-8 max-lg:!py-6 max-lg:!pl-10">
      <svg className="pointer-events-none absolute left-0 top-0 h-full overflow-visible" width="24" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="12" y1="0" x2="12" y2="100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <motion.line x1="12" y1="0" x2="12" y2="100" stroke="#F472B6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: lineProgress }} className="max-lg:![stroke-dasharray:none!important] max-lg:![stroke-dashoffset:0!important]" />
      </svg>
      {journey.map((m, i) => <MilestoneItem key={i} index={i} total={journey.length} milestone={m} scrollYProgress={scrollYProgress} />)}
    </div>
  );
}

function MilestoneItem({ index, total, milestone, scrollYProgress }: { index: number; total: number; milestone: Milestone; scrollYProgress: MotionValue<number> }) {
  // Cada marco entra conforme a linha SVG o alcança no scroll
  const start   = 0.25 + (index / Math.max(total - 1, 1)) * 0.4;
  const opacity = useTransform(scrollYProgress, [start - 0.04, start + 0.02], [0, 1]);
  const x       = useTransform(scrollYProgress, [start - 0.04, start + 0.02], [-24, 0]);
  const isLast  = index === total - 1;

  return (
    <motion.div style={{ opacity, x }} className="relative max-lg:!opacity-100 max-lg:!transform-none">
      <div className="group pointer-events-auto relative cursor-default transition-transform duration-300 hover:translate-x-2">
        {/* Indicador pulsante no último marco */}
        {isLast && <span className="absolute -left-[26px] top-[6px] h-3 w-3 animate-ping rounded-full bg-[#F472B6]/60" aria-hidden="true" />}
        <span className="absolute -left-[26px] top-[6px] h-3 w-3 rounded-full bg-[#F472B6] shadow-[0_0_0_4px_rgba(244,114,182,0.15)] transition-transform duration-300 group-hover:scale-125" />
        <Sway rotate={0} y={3} duration={4.5} delay={index * 0.7}>
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-white/40">{milestone.year}</p>
          <p className="mt-1 text-[1.05rem] font-medium text-white transition-colors duration-300 group-hover:text-[#F472B6]">{milestone.title}</p>
          <p className="mt-1 text-[0.88rem] leading-snug text-white/60">{milestone.description}</p>
        </Sway>
      </div>
    </motion.div>
  );
}
