  import { useEffect, useRef, useState } from "react";
  import type { CSSProperties, ReactNode } from "react";
  import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
  import type { IconType } from "react-icons";
  import { SiReact, SiTailwindcss, SiAngular, SiTypescript, SiPostgresql, SiMongodb, SiFlutter, SiGit, SiVercel, SiDocker, SiGithub } from "react-icons/si";
  import { FaNodeJs, FaBullseye, FaBuilding, FaLightbulb, FaQuoteLeft, FaWhatsapp, FaExpand, FaTimes, FaCheck } from "react-icons/fa";
  import Navbar from "../components/Navbar";
  import prova1 from '../assets/prints/prova1.png'; import prova2 from '../assets/prints/prova2.png'; import prova3 from '../assets/prints/prova3.png'; import prova4 from '../assets/prints/prova4.png'
  // Configurações globais e dados
  const WHATSAPP_NUMERO = "5581998714983";
  const DIRECAO_CARROSSEL = "esquerda" as const;
  const SEGUNDOS_POR_CARD = 6;
  const RESPEITAR_MOVIMENTO_REDUZIDO = false;
  const MOSTRAR_PLACEHOLDER_PRINT = true;

  const waLink = (servico: string) =>
    WHATSAPP_NUMERO
      ? `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Olá João! Vi o serviço de ${servico} no seu portfólio e gostaria de conversar.`)}`
      : "#";

  const SERVICO_INCLUSO: Record<string, string[]> = {
    "Landing Pages": ["Página de uma tela só, focada em gerar contato", "Layout responsivo: celular, tablet e computador", "Botão direto para o seu WhatsApp", "Carregamento rápido e publicação online"],
    "Sites Institucionais": ["Várias páginas: início, sobre, serviços e contato", "Identidade visual aplicada ao seu negócio", "Layout responsivo e otimizado para buscadores", "Publicação online com seu domínio"],
    "Software sob medida": ["Conversa para entender e delimitar a sua ideia", "Sistema web ou aplicativo mobile, conforme a necessidade", "Banco de dados, login de usuários e regras do seu negócio", "Código organizado para o projeto crescer depois"],
  };

  const SERVICO_TECHS: Record<string, string[]> = {
    "Landing Pages": ["React", "Tailwind CSS", "TypeScript", "Vercel", "GitHub"],
    "Sites Institucionais": ["React", "Tailwind CSS", "TypeScript", "Node.js", "Vercel", "Git"],
    "Software sob medida": ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Flutter", "Docker", "GitHub"],
  };

  const CTA_FECHAMENTO = { titulo: "Tem uma ideia? Vamos tirar do papel.", subtitulo: "Me chama no WhatsApp e conversamos sobre o seu projeto." };

  type Tech = { nome: string; Icone: IconType; cor: string };
  const STACK: { titulo: string; techs: Tech[] }[] = [
    { titulo: "Frontend", techs: [{ nome: "React", Icone: SiReact, cor: "#61DAFB" }, { nome: "Tailwind CSS", Icone: SiTailwindcss, cor: "#38BDF8" }, { nome: "Angular", Icone: SiAngular, cor: "#D946EF" }] },
    { titulo: "Backend", techs: [{ nome: "Node.js", Icone: FaNodeJs, cor: "#68A063" }, { nome: "TypeScript", Icone: SiTypescript, cor: "#3178C6" }] },
    { titulo: "Database", techs: [{ nome: "PostgreSQL", Icone: SiPostgresql, cor: "#6B9BD2" }, { nome: "MongoDB", Icone: SiMongodb, cor: "#22C55E" }] },
    { titulo: "Mobile", techs: [{ nome: "Flutter", Icone: SiFlutter, cor: "#54C5F8" }] },
    { titulo: "DevOps", techs: [{ nome: "Git", Icone: SiGit, cor: "#F05032" }, { nome: "Vercel", Icone: SiVercel, cor: "#FFFFFF" }, { nome: "Docker", Icone: SiDocker, cor: "#2496ED" }, { nome: "GitHub", Icone: SiGithub, cor: "#FFFFFF" }] },
  ];

  type Servico = { titulo: string; descricao: string; Icone: IconType; tag: string; imagem?: string };
  const SERVICOS: Servico[] = [
    { titulo: "Landing Pages", descricao: "Páginas objetivas para divulgar um produto, serviço ou campanha e transformar visitas em conversas no WhatsApp.", Icone: FaBullseye, tag: "Conversão" },
    { titulo: "Sites Institucionais", descricao: "O site da sua empresa ou profissão: organizado, com cara de marca e pronto para passar confiança a quem pesquisa por você.", Icone: FaBuilding, tag: "Presença online" },
    { titulo: "Software sob medida", descricao: "Você tem a ideia, eu transformo em sistema: do rascunho ao produto no ar, em web ou mobile.", Icone: FaLightbulb, tag: "Da ideia ao código" },
  ];

  type Depoimento = { nome: string; empresa?: string; projeto?: string; servico?: string; texto?: string; print?: string };
  const DEPOIMENTOS: Depoimento[] = [
    { nome: "Nome do Cliente", empresa: "Empresa", projeto: "Projeto X", servico: "Landing Pages", texto: "Adicione aqui o depoimento real, pode ser um trecho do WhatsApp ou e-mail do cliente.", print: prova1},
    { nome: "Nome do Cliente", empresa: "Empresa", projeto: "Projeto Y", servico: "Sites Institucionais", texto: "Adicione aqui o depoimento real, pode ser um trecho do WhatsApp ou e-mail do cliente.", print: prova2 },
    { nome: "Nome do Cliente", empresa: "Empresa", projeto: "Projeto Z", servico: "Software sob medida", texto: "Adicione aqui o depoimento real, pode ser um trecho do WhatsApp ou e-mail do cliente.", print: prova3},
    { nome: "Nome do Cliente", empresa: "Empresa", projeto: "Projeto W", servico: "Landing Pages", texto: "Adicione aqui o depoimento real, pode ser um trecho do WhatsApp ou e-mail do cliente.", print: prova4 },
  ];

  // Hook utilitário para checar largura mobile
  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches);
    useEffect(() => {
      const mq = window.matchMedia("(max-width: 1023px)");
      const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);
    return isMobile;
  }

  const EASE = [0.22, 1, 0.36, 1] as const;

  // Componente de animação ao entrar na tela (Fade + Slide)
  function Reveal({ children, delay = 0, className, shouldReduce }: { children: ReactNode; delay?: number; className?: string; shouldReduce: boolean }) {
    return (
      <motion.div className={className} initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: shouldReduce ? 0 : 0.8, delay: shouldReduce ? 0 : delay, ease: EASE }}>
        {children}
      </motion.div>
    );
  }

  // Título animado com máscara
  function MaskTitle({ children, shouldReduce, start, className = "text-4xl font-light tracking-wide lg:text-5xl" }: { children: string; shouldReduce: boolean; start?: boolean; className?: string }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const inView = useInView(ref, { once: true, amount: "some" });
    const show = shouldReduce || (start === undefined ? inView : start);
    return (
      <h2 ref={ref} className={`overflow-hidden pb-2 ${className}`}>
        <motion.span className="block" initial={{ y: shouldReduce ? "0%" : "110%" }} animate={{ y: show ? "0%" : "110%" }} transition={{ duration: shouldReduce ? 0 : 0.9, ease: EASE }}>
          {children}
        </motion.span>
      </h2>
    );
  }

  // Botão padrão para disparar conversas no WhatsApp
  function WaButton({ servico, label, tone = "green", full = false }: { servico: string; label: string; tone?: "green" | "dark"; full?: boolean }) {
    const base = `inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${full ? "w-full justify-center" : ""}`;
    if (!WHATSAPP_NUMERO) {
      return (
        <span title="TODO: configurar WHATSAPP_NUMERO" aria-disabled="true" className={`${base} cursor-not-allowed border ${tone === "dark" ? "border-black/20 bg-black/5 text-black/40" : "border-white/10 bg-white/5 text-white/40"}`}>
          <FaWhatsapp className="h-4 w-4" /> Configurar WhatsApp
        </span>
      );
    }
    return (
      <a href={waLink(servico)} target="_blank" rel="noreferrer" className={`${base} hover:scale-[1.03] ${tone === "dark" ? "bg-[#1B1D1F] text-white focus-visible:ring-black focus-visible:ring-offset-[var(--green)]" : "bg-[var(--green)] text-black focus-visible:ring-[var(--green)] focus-visible:ring-offset-[#1B1D1F]"}`}>
        <FaWhatsapp className="h-4 w-4" /> {label}
      </a>
    );
  }

  // Componente Principal
  export default function Servicos({ start = true }: { start?: boolean }) {
    const prefereReduzir = useReducedMotion() ?? false;
    const shouldReduce = RESPEITAR_MOVIMENTO_REDUZIDO && prefereReduzir;
    const isMobile = useIsMobile();
    const [activeService, setActiveService] = useState(0);

    return (
      <section style={{ "--green": "#A3E635" } as CSSProperties} className="relative flex flex-col bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,rgba(47,49,52,0.5)_85%,#2F3134_100%)] font-['Inter'] text-white">
        <Navbar />
        <ServicesList activeService={activeService} onSelect={setActiveService} shouldReduce={shouldReduce} start={start} />
        <StackSection activeService={activeService} isMobile={isMobile} shouldReduce={shouldReduce} />
        {DEPOIMENTOS.length > 0 && <Testimonials shouldReduce={shouldReduce} />}
        <ClosingCTA activeService={activeService} onSelect={setActiveService} shouldReduce={shouldReduce} />
      </section>
    );
  }

  // Seção 1: Lista e detalhes dos Serviços oferecidos
  function ServicesList({ activeService, onSelect, shouldReduce, start }: { activeService: number; onSelect: (i: number) => void; shouldReduce: boolean; start: boolean }) {
    const active = SERVICOS[activeService];
    const incluso = SERVICO_INCLUSO[active.titulo] ?? [];
    const techs = SERVICO_TECHS[active.titulo] ?? [];

    const load = (delay: number) => {
      const hidden = { opacity: 0, y: shouldReduce ? 0 : 28 };
      return { initial: hidden, animate: start ? { opacity: 1, y: 0 } : hidden, transition: { duration: shouldReduce ? 0 : 0.8, delay: shouldReduce ? 0 : delay, ease: EASE } };
    };

    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
        <header>
          <div className="flex items-end gap-6 ">
          <MaskTitle shouldReduce={shouldReduce} start={start} className="text-4xl font-light tracking-wide text-[var(--green)] lg:text-5xl">
    SERVIÇOS
  </MaskTitle>
            <motion.span className="mb-4 hidden h-px w-[36%]  origin-left bg-[linear-gradient(to_right,var(--green),transparent)] opacity-60 sm:block" initial={{ scaleX: shouldReduce ? 1 : 0 }} animate={{ scaleX: start || shouldReduce ? 1 : 0 }} transition={{ duration: shouldReduce ? 0 : 1.1, delay: shouldReduce ? 0 : 0.35, ease: EASE }} />
          </div>
          <motion.p {...load(0.4)} className="mt-1 max-w-xl text-sm text-white/50 md:text-base">Do site simples ao sistema completo, o que posso construir para você.</motion.p>
        </header>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-10">
          <div className="flex h-full flex-col justify-center md:col-span-5 lg:col-span-4">
            <ul className="flex flex-col gap-2">
              {SERVICOS.map((s, i) => {
                const isActive = i === activeService;
                return (
                  <motion.li key={s.titulo} {...load(0.5 + i * 0.1)}>
                    <button type="button" onClick={() => onSelect(i)} aria-pressed={isActive} className={`group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1D1F] md:px-5 md:py-5 ${isActive ? "border-white/10 bg-white/[0.06]" : "border-transparent hover:border-white/10 hover:bg-white/[0.02]"}`}>
                      {isActive && <motion.span layoutId="service-active-indicator" className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[var(--green)]" transition={{ type: "spring", stiffness: 380, damping: 30 }} aria-hidden />}
                      <span className={`font-mono text-xs tabular-nums transition-colors ${isActive ? "text-[var(--green)]" : "text-white/30"}`}>0{i + 1}</span>
                      <span className={`flex-1 text-lg font-light transition-colors md:text-xl ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>{s.titulo}</span>
                      <s.Icone className={`h-5 w-5 transition-colors ${isActive ? "text-[var(--green)]" : "text-white/20 group-hover:text-white/50"}`} />
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <motion.div {...load(0.8)} className="md:col-span-7 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeService} initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: shouldReduce ? 0 : -12 }} transition={{ duration: shouldReduce ? 0 : 0.35, ease: EASE }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-[#A3E635]/30 bg-[#A3E635]/10 px-3 py-1 text-xs text-[var(--green)]">{active.tag}</span>
                    <span className="font-mono text-xs tabular-nums text-white/30">0{activeService + 1} / 0{SERVICOS.length}</span>
                  </div>
                  {active.imagem && <img src={active.imagem} alt={active.titulo} className="mt-5 aspect-[16/9] w-full rounded-2xl object-cover" />}
                  <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">{active.descricao}</p>
                  {incluso.length > 0 && (
                    <>
                      <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.15em] text-white/40">O que está incluso</h3>
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
                      <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.15em] text-white/40">Tecnologias usadas</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {techs.map((t) => <li key={t} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/65">{t}</li>)}
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

  // Seção 2: Stack de Tecnologias com destaque interativo
  function StackSection({ activeService, isMobile, shouldReduce }: { activeService: number; isMobile: boolean; shouldReduce: boolean }) {
    const [focusedTech, setFocusedTech] = useState<string | null>(null);
    const activeServico = SERVICOS[activeService];
    const relatedTechs = SERVICO_TECHS[activeServico.titulo] ?? [];
    const isHighlighted = (nome: string) => (focusedTech ? focusedTech === nome : relatedTechs.includes(nome));
    const isDimmed = (nome: string) => {
      if (focusedTech) return focusedTech !== nome;
      if (relatedTechs.length === 0) return false;
      return !relatedTechs.includes(nome);
    };
    const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: shouldReduce ? 0 : 0.08 } } };
    const item = { hidden: { opacity: 0, y: shouldReduce ? 0 : 20 }, show: { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.5 } } };

    return (
      <section className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-20">
        <header className="text-center">
          <div className="flex items-end justify-center gap-6"><h2 className="text-4xl font-light tracking-wide lg:text-5xl">STACK</h2></div>
          <p className="mt-3 text-sm text-white/50">Ferramentas do dia a dia — destacando o que uso em <span className="text-[var(--green)]">{activeServico.titulo}</span>.</p>
        </header>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-10 md:mt-14 md:gap-x-8">
          {STACK.map(({ titulo, techs }) => (
            <motion.div key={titulo} variants={item} className="flex flex-col items-center">
              <div className="group flex h-72 w-28 flex-col items-center justify-around rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_40px_rgba(0,0,0,0.5)] sm:w-32 lg:h-80 lg:w-36">
                {techs.map(({ nome, Icone, cor }) => {
                  const highlighted = isHighlighted(nome);
                  const dimmed = isDimmed(nome);
                  return (
                    <button key={nome} type="button" onClick={() => setFocusedTech(focusedTech === nome ? null : nome)} aria-label={nome} aria-pressed={focusedTech === nome} title={nome} className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1D1F] ${dimmed ? "opacity-30 hover:opacity-60" : "opacity-100"} ${highlighted ? "scale-110" : "hover:scale-110"}`}>
                      {highlighted && !shouldReduce && <span className="pointer-events-none absolute inset-0 rounded-full opacity-40 blur-md" style={{ background: cor }} aria-hidden />}
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
            Filtrando por <button onClick={() => setFocusedTech(null)} className="text-[var(--green)] underline underline-offset-4">{focusedTech} · limpar</button>
          </p>
        )}
      </section>
    );
  }

  // Seção 3: Carrossel infinito de Depoimentos e Lightbox
  function Testimonials({ shouldReduce }: { shouldReduce: boolean }) {
    const [zoom, setZoom] = useState<Depoimento | null>(null);
    const repeticoes = Math.max(1, Math.ceil(4 / DEPOIMENTOS.length));
    const base = Array.from({ length: repeticoes }).flatMap(() => DEPOIMENTOS);
    const looped = [...base, ...base];
    const duration = Math.max(20, base.length * SEGUNDOS_POR_CARD);
    const direction = DIRECAO_CARROSSEL === "esquerda" ? "normal" : "reverse";

    return (
      <section className="relative w-full py-16 md:py-20" aria-roledescription="carousel" aria-label="Depoimentos de clientes">
        <style>{`@keyframes testimonial-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}.testimonial-track{animation:testimonial-marquee ${duration}s linear infinite;animation-direction:${direction};will-change:transform}`}</style>
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <MaskTitle shouldReduce={shouldReduce}>CLIENTES</MaskTitle>
          <Reveal shouldReduce={shouldReduce} delay={0.15}><p className="mt-1 text-sm text-white/50">Conversas e feedbacks reais. Clique no print para ampliar.</p></Reveal>
        </div>
        <Reveal shouldReduce={shouldReduce} delay={0.25} className="mt-10 md:mt-12">
          {shouldReduce ? (
            <ul className="flex gap-5 overflow-x-auto px-6 pb-4 md:px-10">
              {DEPOIMENTOS.map((dep, i) => (<li key={i} className="w-[320px] shrink-0 sm:w-[380px]"><TestimonialCard dep={dep} onZoom={setZoom} /></li>))}
            </ul>
          ) : (
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
              <ul className="testimonial-track flex w-max">
                {looped.map((dep, i) => {
                  const clone = i >= base.length;
                  return (<li key={i} className="w-[360px] shrink-0 pr-5 sm:w-[380px]" aria-hidden={clone}><TestimonialCard dep={dep} onZoom={setZoom} focusable={!clone} /></li>);
                })}
              </ul>
            </div>
          )}
        </Reveal>
        <AnimatePresence>{zoom && <PrintLightbox dep={zoom} onClose={() => setZoom(null)} shouldReduce={shouldReduce} />}</AnimatePresence>
      </section>
    );
  }

  function TestimonialCard({ dep, onZoom, focusable = true }: { dep: Depoimento; onZoom: (d: Depoimento) => void; focusable?: boolean }) {
    const temPrint = Boolean(dep.print);
    const mostrarFrame = temPrint || MOSTRAR_PLACEHOLDER_PRINT;

    return (
      <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
        {mostrarFrame && (temPrint ? (
          <button type="button" tabIndex={focusable ? 0 : -1} onClick={() => onZoom(dep)} aria-label={`Ampliar print do depoimento de ${dep.nome}`} className="group relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--green)]">
            <img src={dep.print} alt={`Print do depoimento de ${dep.nome}`} draggable={false} className="h-full w-full select-none object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
            <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs text-white/90"><FaExpand className="h-2.5 w-2.5" /> Ampliar</span>
          </button>
        ) : (
          <div className="flex aspect-[4/5] w-full shrink-0 flex-col items-center justify-center gap-2 border-b border-dashed border-white/15 text-white/25"><FaQuoteLeft className="h-6 w-6" /><span className="text-xs">Print da conversa</span></div>
        ))}
        <div className="flex flex-1 flex-col p-5">
          {dep.texto && <p className="flex-1 text-sm leading-relaxed text-white/75">{dep.texto}</p>}
          <div className={dep.texto ? "mt-5 border-t border-white/10 pt-4" : ""}>
            <p className="text-sm font-medium">{dep.nome}</p>
            {(dep.empresa || dep.projeto) && <p className="mt-0.5 text-xs text-white/45">{[dep.empresa, dep.projeto].filter(Boolean).join(", ")}</p>}
            {dep.servico && <span className="mt-3 inline-block rounded-full border border-[#A3E635]/30 px-2.5 py-0.5 text-xs text-[var(--green)]">{dep.servico}</span>}
          </div>
        </div>
      </article>
    );
  }

  function PrintLightbox({ dep, onClose, shouldReduce }: { dep: Depoimento; onClose: () => void; shouldReduce: boolean }) {
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
    }, [onClose]);

    return (
      <motion.div role="dialog" aria-modal="true" aria-label={`Print do depoimento de ${dep.nome}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: shouldReduce ? 0 : 0.2 }} onClick={onClose} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4">
        <button type="button" autoFocus onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"><FaTimes className="h-4 w-4" /></button>
        <img src={dep.print} alt={`Print do depoimento de ${dep.nome}`} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-full rounded-xl object-contain" />
      </motion.div>
    );
  }

  // Seção 4: CTA de Fechamento final
  function ClosingCTA({ activeService, onSelect, shouldReduce }: { activeService: number; onSelect: (i: number) => void; shouldReduce: boolean }) {
    const servico = SERVICOS[activeService];
    return (
      <section className="relative mx-auto w-full max-w-[1280px] px-6 pb-20 pt-8 md:px-10 md:pb-28">
        <motion.div initial={{ opacity: shouldReduce ? 1 : 0, clipPath: shouldReduce ? "inset(0% 0% 0% 0% round 2rem)" : "inset(14% 10% 14% 10% round 2rem)" }} whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 2rem)" }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: shouldReduce ? 0 : 1, ease: EASE }} className="relative overflow-hidden rounded-[2rem] bg-[var(--green)] p-6 text-black sm:p-8 md:p-12 lg:p-16">
          <div className="relative grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col justify-between lg:col-span-7">
              <MaskTitle shouldReduce={shouldReduce} className="text-xl font-light leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">{CTA_FECHAMENTO.titulo}</MaskTitle>
              <Reveal shouldReduce={shouldReduce} delay={0.3}><p className="mt-4 max-w-md text-lg leading-snug text-black/70">{CTA_FECHAMENTO.subtitulo}</p></Reveal>
            </div>
            <Reveal shouldReduce={shouldReduce} delay={0.2} className="lg:col-span-5">
              <div className="rounded-3xl bg-[#1B1D1F] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.25)] md:p-6">
                <p id="cta-label" className="text-sm text-white/60">Qual projeto você tem em mente?</p>
                <div role="group" aria-labelledby="cta-label" className="mt-4 flex flex-col gap-2">
                  {SERVICOS.map((s, i) => {
                    const on = i === activeService;
                    return (
                      <button key={s.titulo} type="button" aria-pressed={on} onClick={() => onSelect(i)} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] ${on ? "border-white/20 bg-white/[0.08] text-white font-medium" : "border-white/5 bg-white/[0.02] text-white/60 hover:bg-white/[0.04]"}`}>
                        <span>{s.titulo}</span>
                        <span className={`h-2 w-2 rounded-full transition-colors ${on ? "bg-[var(--green)] shadow-[0_0_8px_var(--green)]" : "bg-white/20"}`} />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6"><WaButton servico={servico.titulo} label={`Iniciar ${servico.titulo}`} tone="dark" full /></div>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>
    );
  }