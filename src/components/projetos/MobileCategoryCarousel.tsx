import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import type { Category } from "../../data/data";

const CHIP_W = 152;
const STEP = CHIP_W + 12;
const SPRING = { type: "spring", stiffness: 260, damping: 30 } as const;

export function MobileCategoryCarousel({ categories, activeIdx, onSelect }: { categories: Category[]; activeIdx: number; onSelect: (idx: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => containerRef.current && setContainerW(containerRef.current.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => { animate(x, -activeIdx * STEP, SPRING); }, [activeIdx, containerW, x]);

  const pad = Math.max(0, (containerW - CHIP_W) / 2);
  const goTo = (idx: number) => onSelect(Math.max(0, Math.min(categories.length - 1, idx)));

  const onDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const delta = info.offset.x + info.velocity.x * 0.15;
    if (delta < -CHIP_W * 0.25) goTo(activeIdx + 1);
    else if (delta > CHIP_W * 0.25) goTo(activeIdx - 1);
    else animate(x, -activeIdx * STEP, SPRING);
  };

  return (
    <div className="relative -mx-4 px-4">
      <div ref={containerRef} className="overflow-hidden" role="tablist" aria-label="Categorias de projetos">
        <motion.div
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: -Math.max(0, (categories.length - 1) * STEP), right: 0 }}
          dragElastic={0.08}
          onDragEnd={onDragEnd}
          style={{ x }}
          className="flex cursor-grab gap-3 active:cursor-grabbing"
        >
          <div style={{ width: pad, flexShrink: 0 }} aria-hidden />
          {categories.map((cat, i) => {
            const isActive = i === activeIdx;
            return (
              <motion.button
                key={cat.name}
                role="tab"
                aria-selected={isActive}
                onClick={() => goTo(i)}
                whileTap={{ scale: 0.97 }}
                style={{ width: CHIP_W, flexShrink: 0 }}
                className={`relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all ${isActive ? "border-[var(--green)]/60 bg-[linear-gradient(180deg,rgba(126,217,87,0.16),rgba(126,217,87,0.03))] shadow-[0_0_24px_rgba(126,217,87,0.22)]" : "border-white/10 bg-white/[0.03]"}`}
              >
                <p className={`text-[0.5rem] uppercase tracking-[0.25em] ${isActive ? "text-[var(--green)]/80" : "text-white/35"}`}>
                  0{i + 1} · {cat.items.length} {cat.items.length === 1 ? "projeto" : "projetos"}
                </p>
                <p className={`mt-1.5 text-base font-medium ${isActive ? "text-white" : "text-white/65"}`}>{cat.name}</p>
                {isActive && (
                  <motion.span layoutId="cat-underline" className="absolute inset-x-3 bottom-2 h-[2px] rounded-full bg-[var(--green)]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
              </motion.button>
            );
          })}
          <div style={{ width: pad, flexShrink: 0 }} aria-hidden />
        </motion.div>
      </div>

      {/* Indicadores de posição */}
      <div className="mt-3 flex justify-center gap-1.5">
        {categories.map((c, i) => (
          <button key={c.name} onClick={() => goTo(i)} aria-label={`Ir para ${c.name}`} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? "w-6 bg-[var(--green)] shadow-[0_0_8px_rgba(126,217,87,0.6)]" : "w-1.5 bg-white/20"}`} />
        ))}
      </div>
    </div>
  );
}
