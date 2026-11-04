import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiGithub } from "react-icons/si";
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";

// DADOS
type Projeto = {
  titulo: string;
  descricao: string;
  problema?: string;
  solucao?: string;
  techs: string[];
  github: string; // "Código" — oculto se "#" ou vazio
  demo?: string; // "Ver online" — oculto se "#" ou ausente
  imagem?: string; // URL/import — exibida no topo do card se presente
  destaque?: boolean;
  categoria?: string;
};

const PROJETOS: Projeto[] = [
  {
    titulo: "Projeto Principal",
    descricao: "Descreva aqui o seu projeto mais importante: o problema que ele resolve, o que você construiu e o resultado alcançado.",
    problema: "Descreva o problema que motivou o projeto.",
    solucao: "Descreva a solução que você construiu.",
    techs: ["React", "Node", "TypeScript", "PostgreSQL"],
    github: "#", demo: "#", destaque: true, categoria: "Fullstack",
  },
  {
    titulo: "Projeto Dois",
    descricao: "Breve descrição do que o projeto faz e qual foi o seu papel.",
    problema: "Descreva o problema que motivou o projeto.",
    solucao: "Descreva a solução que você construiu.",
    techs: ["React", "Tailwind"],
    github: "#", demo: "#", categoria: "Frontend",
  },
  {
    titulo: "App Mobile",
    descricao: "Breve descrição do app, com o diferencial principal.",
    problema: "Descreva o problema que motivou o app.",
    solucao: "Descreva a solução que você construiu.",
    techs: ["Flutter", "Firebase"],
    github: "#", categoria: "Mobile",
  },
  {
    titulo: "API REST",
    descricao: "Breve descrição da API, com foco em segurança e escala.",
    problema: "Descreva o problema que motivou a API.",
    solucao: "Descreva a solução que você construiu.",
    techs: ["Node", "Docker", "MongoDB"],
    github: "#", categoria: "Backend",
  },
];

const GREEN = "var(--green, #7ED957)";
const YELLOW = "#F5C518";
const CAT_PADRAO = "Projetos";

export default function Projetos({ start = true }: { start?: boolean }) {
  const [selected, setSelected] = useState<number>(() => {
    const idx = PROJETOS.findIndex((p) => p.destaque);
    return idx >= 0 ? idx : 0;
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [treeReady, setTreeReady] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [revealedEdges, setRevealedEdges] = useState<Set<string>>(new Set());

  // Layout da árvore
  const tree = useMemo(() => {
    const groups = new Map<string, { projeto: Projeto; index: number }[]>();
    PROJETOS.forEach((p, i) => {
      const cat = p.categoria ?? CAT_PADRAO;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push({ projeto: p, index: i });
    });
    const entries = Array.from(groups.entries());
    const N = entries.length;
    const xPad = N === 1 ? 0.5 : 0.15;
    const usable = 1 - xPad * 2;
    const categories = entries.map(([name, items], i) => ({
      name, items,
      x: N === 1 ? 0.5 : xPad + (i / Math.max(N - 1, 1)) * usable,
      y: 0.30,
    }));
    const maxItems = Math.max(...categories.map((c) => c.items.length));
    const yLeafBase = 0.58;
    const yLeafEnd = 0.86;
    const yStep = maxItems > 1 ? (yLeafEnd - yLeafBase) / (maxItems - 1) : 0;
    const leaves: { x: number; y: number; categoriaIdx: number; leafIdx: number; item: { projeto: Projeto; index: number } }[] = [];
    categories.forEach((c, ci) => {
      c.items.forEach((item, j) => {
        leaves.push({ x: c.x, y: yLeafBase + j * yStep, categoriaIdx: ci, leafIdx: j, item });
      });
    });
    return { categories, leaves };
  }, []);

  // Timings
  const timings = useMemo(() => {
    let t = 0.9;
    const categories = tree.categories.map((c) => {
      const catStart = t;
      const leafStarts = c.items.map((_, j) => catStart + 0.4 + j * 0.22);
      t = catStart + 0.4 + c.items.length * 0.22 + 0.35;
      return { catStart, leafStarts };
    });
    return { categories, completeAt: t + 0.5 };
  }, [tree]);

  // Reveal + auto-advance
  useEffect(() => {
    if (!start) return;
    setRevealing(true);
    setRevealedEdges(new Set());
    const emit = (name: string, detail?: unknown) => window.dispatchEvent(new CustomEvent(name, detail ? { detail } : undefined));
    const timers: number[] = [];
    const addEdge = (key: string) => setRevealedEdges((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    timers.push(window.setTimeout(() => emit("TreeReveal"), 300));
    timers.push(window.setTimeout(() => emit("BranchReveal"), 900));
    const firstLeaf = timings.categories[0]?.leafStarts[0] ?? 1.3;
    timers.push(window.setTimeout(() => emit("NodeReveal"), firstLeaf * 1000));
    tree.categories.forEach((c, ci) => {
      const rcKey = `rc-${c.name}`;
      timers.push(window.setTimeout(() => addEdge(rcKey), timings.categories[ci].catStart * 1000));
      c.items.forEach((item, j) => {
        const clKey = `cl-${item.index}`;
        timers.push(window.setTimeout(() => addEdge(clKey), timings.categories[ci].leafStarts[j] * 1000));
        const tSec = timings.categories[ci].leafStarts[j] + 0.18;
        timers.push(window.setTimeout(() => {
          setSelected(item.index);
          emit("NodeChange", { index: item.index, titulo: item.projeto.titulo, auto: true });
          emit("ProjectFocus", { index: item.index, titulo: item.projeto.titulo, auto: true });
        }, tSec * 1000));
      });
    });
    timers.push(window.setTimeout(() => {
      emit("TreeComplete");
      setTreeReady(true);
      setRevealing(false);
    }, timings.completeAt * 1000));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [start, timings, tree]);

  // Interações
  const handleSelect = (index: number) => {
    setSelected(index);
    const detail = { index, titulo: PROJETOS[index].titulo };
    window.dispatchEvent(new CustomEvent("NodeClick", { detail }));
    window.dispatchEvent(new CustomEvent("ProjectFocus", { detail }));
  };
  const changeSelection = (dir: number) => {
    const next = (selected + dir + PROJETOS.length) % PROJETOS.length;
    setSelected(next);
    const detail = { index: next, titulo: PROJETOS[next].titulo };
    window.dispatchEvent(new CustomEvent("NodeChange", { detail }));
    window.dispatchEvent(new CustomEvent("ProjectFocus", { detail }));
  };
  const handleHover = (id: string | null) => {
    setHoveredNode(id);
    if (id) window.dispatchEvent(new CustomEvent("NodeHover", { detail: { id } }));
  };

  // Derivados
  const selectedCatIdx = tree.leaves.find((l) => l.item.index === selected)?.categoriaIdx;
  const edgeRootGlow = (i: number) =>
    hoveredNode === "root" || hoveredNode === `cat-${i}` ||
    tree.leaves.some((l) => l.categoriaIdx === i && hoveredNode === `leaf-${l.item.index}`) ||
    selectedCatIdx === i;
  const edgeLeafGlow = (leafIdx: number, catIdx: number) =>
    hoveredNode === `cat-${catIdx}` || hoveredNode === `leaf-${leafIdx}` || selected === leafIdx;

  // SVG paths
  const svgRoot = { x: 500, y: 0 };
  const edgeRC = (cx: number, cy: number) => {
    const my = (svgRoot.y + cy) / 2;
    return `M ${svgRoot.x} ${svgRoot.y} C ${svgRoot.x} ${my}, ${cx} ${my}, ${cx} ${cy}`;
  };
  const edgeCL = (cx: number, cy: number, lx: number, ly: number) => {
    if (Math.abs(cx - lx) < 2) return `M ${cx} ${cy} L ${cx} ${ly}`;
    const my = (cy + ly) / 2;
    return `M ${cx} ${cy} C ${cx} ${my}, ${lx} ${my}, ${lx} ${ly}`;
  };

  const projetoSelecionado = PROJETOS[selected];

  return (
    <section className="relative flex h-screen flex-col overflow-hidden font-['Inter'] text-white" style={{ backgroundColor: "#1B1D1F" }}>
      <Navbar />
      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-[1280px] shrink-0 px-10 pt-4 pb-2 md:pt-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="flex items-end gap-6">
            <h2 className="text-4xl font-light tracking-wide lg:text-5xl">PROJETOS</h2>
            <span className="mb-2 hidden h-px w-[36%] bg-[linear-gradient(to_right,var(--green),transparent)] opacity-60 sm:block" />
          </div>
          <p className="mt-2 text-sm text-white/50">Alguns dos meus principais trabalhos.</p>
        </motion.div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1280px] min-h-0 flex-1 flex-col gap-4 px-4 pb-4 md:flex-row md:gap-6 md:px-10 md:pb-6">
        {/* COLUNA DA ÁRVORE */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-[1.4]">
          {/* Root hero — TOPO, destacado */}
          <motion.div
            className="flex shrink-0 flex-col items-center pb-2"
            initial={{ opacity: 0, y: -8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-0 -m-3 rounded-full bg-[var(--green)]/25 blur-2xl"
                aria-hidden
              />
              <motion.button
                onMouseEnter={() => handleHover("root")}
                onMouseLeave={() => handleHover(null)}
                className={`relative rounded-full border px-6 py-2.5 text-base font-medium transition-all duration-300 lg:text-lg ${
                  hoveredNode === "root"
                    ? "border-[var(--green)] text-[var(--green)] shadow-[0_0_32px_rgba(126,217,87,0.55)]"
                    : "border-white/30 text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                } bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))] backdrop-blur-sm`}
              >
                João Daniel
              </motion.button>
            </div>
            <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-white/40">Fullstack Developer</p>
          </motion.div>

          {/* Área do SVG */}
          <div className="relative min-h-0 flex-1 px-2" style={{ pointerEvents: treeReady ? "auto" : "none" }} aria-label="Árvore de projetos">
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
              {/* Anéis orbitais discretos*/}
              <motion.circle
                cx={svgRoot.x} cy={22} r={30} fill="none" stroke={GREEN} strokeOpacity={0.2} strokeDasharray="2 5" strokeWidth={1}
                animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: `${svgRoot.x}px 22px` }}
              />
              <motion.circle
                cx={svgRoot.x} cy={22} r={50} fill="none" stroke={YELLOW} strokeOpacity={0.12} strokeDasharray="2 7" strokeWidth={1}
                animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: `${svgRoot.x}px 22px` }}
              />
              {/* Partículas orbitais */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i / 6) * Math.PI * 2;
                const r = 40 + (i % 2) * 14;
                const px = svgRoot.x + Math.cos(angle) * r;
                const py = 22 + Math.sin(angle) * r;
                return (
                  <motion.circle
                    key={i} cx={px} cy={py} r={1.4} fill={i % 2 ? YELLOW : GREEN}
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: 1 + i * 0.3 }}
                  />
                );
              })}
              {/* Root → categorias */}
              {tree.categories.map((c, i) => {
                const key = `rc-${c.name}`;
                return <TreeEdge key={key} d={edgeRC(c.x * 1000, c.y * 600)} delay={timings.categories[i].catStart} duration={0.5} green={revealedEdges.has(key)} glow={edgeRootGlow(i)} />;
              })}
              {/* Categoria → folhas */}
              {tree.leaves.map((leaf) => {
                const cat = tree.categories[leaf.categoriaIdx];
                const key = `cl-${leaf.item.index}`;
                return (
                  <TreeEdge
                    key={key}
                    d={edgeCL(cat.x * 1000, cat.y * 600, leaf.x * 1000, leaf.y * 600)}
                    delay={timings.categories[leaf.categoriaIdx].leafStarts[leaf.leafIdx]}
                    duration={0.45}
                    green={revealedEdges.has(key)}
                    glow={edgeLeafGlow(leaf.item.index, leaf.categoriaIdx)}
                  />
                );
              })}
            </svg>

            {/* Nós de categoria */}
            {tree.categories.map((c, i) => (
              <TreeNode
                key={c.name} x={c.x} y={c.y} delay={timings.categories[i].catStart + 0.22} duration={0.5} label={c.name} variant="category"
                hovered={hoveredNode === `cat-${i}`} onHover={() => handleHover(`cat-${i}`)} onLeave={() => handleHover(null)}
              />
            ))}

            {/* Nós-folha */}
            {tree.leaves.map((leaf) => (
              <TreeNode
                key={leaf.item.index} x={leaf.x} y={leaf.y}
                delay={timings.categories[leaf.categoriaIdx].leafStarts[leaf.leafIdx] + 0.15}
                duration={0.5} label={leaf.item.projeto.titulo} variant="leaf"
                hovered={hoveredNode === `leaf-${leaf.item.index}`} selected={selected === leaf.item.index}
                onClick={() => handleSelect(leaf.item.index)}
                onHover={() => handleHover(`leaf-${leaf.item.index}`)} onLeave={() => handleHover(null)}
              />
            ))}

            {/* Indicador de reveal */}
            <AnimatePresence>
              {revealing && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.4 }}
                  className="pointer-events-none absolute inset-x-0 bottom-1 z-20 flex items-center justify-center gap-2"
                >
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: YELLOW }}
                  />
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/40">Revelando</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CARD */}
        <div className="flex min-h-0 flex-1 flex-col">
          <ProjectDetail
            projeto={projetoSelecionado} total={PROJETOS.length} index={selected} revealing={revealing}
            onPrev={() => changeSelection(-1)} onNext={() => changeSelection(1)}
          />
        </div>
      </main>
    </section>
  );
}

// Edge
function TreeEdge({ d, delay, duration, green, glow }: { d: string; delay: number; duration: number; green: boolean; glow: boolean }) {
  return (
    <g>
      {/* Glow — SEMPRE renderizado, só anima opacity */}
      <motion.path
        d={d} fill="none" stroke={GREEN} strokeWidth={8} strokeLinecap="round" strokeOpacity={0.25} vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: glow ? 1 : 0 }}
        transition={{ pathLength: { delay, duration, ease: "easeInOut" }, opacity: { duration: 0.35, ease: "easeOut" } }}
      />
      {/* Main — cor sólida, sempre visível quando revelada */}
      <motion.path
        d={d} fill="none" stroke={green ? GREEN : "rgba(255,255,255,0.18)"} strokeWidth={1.5} strokeLinecap="round" vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration, ease: "easeInOut" }}
      />
    </g>
  );
}

type TreeNodeProps = {
  x: number; y: number; delay: number; duration: number; label: string; variant: "category" | "leaf";
  hovered?: boolean; selected?: boolean; onClick?: () => void; onHover?: () => void; onLeave?: () => void;
};

function TreeNode({ x, y, delay, duration, label, variant, hovered, selected, onClick, onHover, onLeave }: TreeNodeProps) {
  const isActive = hovered || selected;
  const base = "rounded-full border text-xs tracking-wide transition-all duration-300";
  const styles =
    variant === "category"
      ? `inline-flex items-center gap-1.5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] whitespace-nowrap ${
          isActive ? "border-[var(--green)] text-[var(--green)]" : "border-white/15 text-white/45"
        } bg-white/[0.03] backdrop-blur-sm`
      : `inline-flex items-center gap-2 px-3 py-1.5 max-w-[150px] ${
          isActive
            ? "border-[var(--green)] text-white bg-[var(--green)]/10 shadow-[0_0_22px_rgba(126,217,87,0.3)]"
            : "border-white/15 text-white/75 bg-white/[0.04]"
        } backdrop-blur-sm`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <button
        type="button" onClick={onClick} onMouseEnter={onHover} onMouseLeave={onLeave} onFocus={onHover} onBlur={onLeave}
        disabled={!onClick} aria-label={label}
        className={`${base} ${styles} ${onClick ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
      >
        {variant === "category" && <span className={`h-1 w-1 shrink-0 rounded-full transition-colors ${isActive ? "bg-[var(--green)]" : "bg-white/40"}`} aria-hidden="true" />}
        {variant === "leaf" && (
          <span
            className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${isActive ? "bg-[var(--green)] shadow-[0_0_10px_rgba(126,217,87,0.9)]" : "bg-white/40"}`}
            aria-hidden="true"
          />
        )}
        <span className="min-w-0 truncate">{label}</span>
      </button>
    </motion.div>
  );
}

// detalhe
function ProjectDetail({ projeto, index, total, revealing, onPrev, onNext }: {
  projeto: Projeto; index: number; total: number; revealing: boolean; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          {/* Imagem*/}
          {projeto.imagem && (
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
              <img src={projeto.imagem} alt={projeto.titulo} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          <div className="flex flex-1 flex-col p-5 lg:p-6">
            {/* Header badges */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">Projeto</p>
              <div className="flex items-center gap-2">
                {revealing && (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.2em] text-white/50">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }}
                      className="h-1 w-1 rounded-full" style={{ backgroundColor: YELLOW }}
                    />
                    auto
                  </span>
                )}
                {projeto.destaque && <span className="rounded-full bg-[var(--green)] px-2 py-0.5 text-[0.55rem] font-medium tracking-wider text-black">Destaque</span>}
              </div>
            </div>
            {/* Título */}
            <h3 className="mt-1.5 text-xl font-medium lg:text-2xl">{projeto.titulo}</h3>
            {/* Descrição */}
            <p className="mt-2 text-[0.82rem] leading-snug text-white/60">{projeto.descricao}</p>
            {/* Problema */}
            {projeto.problema && (
              <section className="mt-4">
                <h4 className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">Problema</h4>
                <p className="mt-1 text-[0.8rem] leading-snug text-white/70">{projeto.problema}</p>
              </section>
            )}
            {/* Solução */}
            {projeto.solucao && (
              <section className="mt-3">
                <h4 className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">Solução</h4>
                <p className="mt-1 text-[0.8rem] leading-snug text-white/70">{projeto.solucao}</p>
              </section>
            )}
            {/* Stack */}
            <section className="mt-4">
              <h4 className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">Stack</h4>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {projeto.techs.map((tech) => (
                  <li key={tech} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.68rem] text-white/70">{tech}</li>
                ))}
              </ul>
            </section>
            {/* Links */}
            {(projeto.github && projeto.github !== "#") || (projeto.demo && projeto.demo !== "#") ? (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {projeto.github && projeto.github !== "#" && (
                  <a href={projeto.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.75rem] transition-all hover:border-[var(--green)] hover:text-[var(--green)]">
                    <SiGithub className="h-4 w-4" /> Código
                  </a>
                )}
                {projeto.demo && projeto.demo !== "#" && (
                  <a href={projeto.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.75rem] transition-all hover:border-[var(--green)] hover:text-[var(--green)]">
                    <FaExternalLinkAlt className="h-3.5 w-3.5" /> Ver online
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav entre projetos */}
      {total > 1 && (
        <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-5 py-2.5 lg:px-6">
          <button type="button" onClick={onPrev} aria-label="Projeto anterior" className="flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-[var(--green)]">
            <FaChevronLeft className="h-3 w-3" /> Anterior
          </button>
          <span className="text-[0.65rem] text-white/30">{index + 1} / {total}</span>
          <button type="button" onClick={() => onNext()} aria-label="Próximo projeto" className="flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-[var(--green)]">
            Próximo <FaChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}