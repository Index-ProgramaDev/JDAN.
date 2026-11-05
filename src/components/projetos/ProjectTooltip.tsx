import { useEffect, useRef, useState } from 'react';
import type { Project } from './tree.types';

type Props = {
  project: Project;
  targetX: number;
  targetY: number;
  containerRect: DOMRect;
  transform: { x: number; y: number; k: number };
};

export function ProjectTooltip({ project, targetX, targetY, containerRect, transform }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const sx = targetX * transform.k + transform.x + containerRect.left;
    const sy = targetY * transform.k + transform.y + containerRect.top;

    let x = sx + 40;
    let y = sy - height / 2;
    if (x + width  > window.innerWidth  - 20) x = sx - width - 40;
    if (y < 20)                                y = 20;
    if (y + height > window.innerHeight - 20)  y = window.innerHeight - height - 20;

    setPos({ x, y });
  }, [targetX, targetY, containerRect, transform]);

  return (
    <div ref={ref} className="fixed z-[100] pointer-events-none" style={{ left: pos.x, top: pos.y }}>
      <div className="bg-gradient-to-br from-[#252729] to-[#1a1c1e] rounded-xl border border-[#35f0a0]/30 shadow-2xl shadow-[#35f0a0]/10 p-4 max-w-xs animate-tooltip-in backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#35f0a0] animate-pulse" />
          <span className="text-[0.65rem] uppercase tracking-widest text-white/40">Preview</span>
        </div>
        <h4 className="text-sm font-semibold text-white mb-2 leading-tight">{project.title}</h4>
        <p className="text-xs text-white/60 leading-relaxed mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map(tech => (
            <span key={tech} className="px-2 py-0.5 rounded-md bg-[#35f0a0]/10 border border-[#35f0a0]/30 text-[0.65rem] text-[#35f0a0]">{tech}</span>
          ))}
          {project.stack.length > 3 && <span className="px-2 py-0.5 text-[0.65rem] text-white/40">+{project.stack.length - 3}</span>}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-[0.6rem] text-white/30 uppercase tracking-wider">Clique para ver detalhes</div>
      </div>
    </div>
  );
}
