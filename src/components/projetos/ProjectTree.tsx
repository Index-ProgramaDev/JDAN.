import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { buildTreeLayout, edgePath } from './treeLayout';
import type { LayoutNode, Project, ProjectCategory } from './tree.types';
import { usePanZoom } from './usePanZoom';
import { TreeBackground } from './TreeBackground';
import { ProjectTooltip } from './ProjectTooltip';
import { TreeSearch } from './TreeSearch';
import './projects-tree.css';

export type DetailsContext = { projects: Project[]; onSelect: (id: string) => void; onClose: () => void };
type Props = { categories: ProjectCategory[]; renderDetails: (p: Project, ctx: DetailsContext) => ReactNode };
type HoverState = { nodeId: string | null; nodeKind: 'root' | 'category' | 'project' | null; categoryId?: string; project?: Project; x?: number; y?: number };

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function ProjectsTree({ categories = [], renderDetails }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hover, setHover]           = useState<HoverState>({ nodeId: null, nodeKind: null });
  const [transform, setTransform]   = useState({ x: 0, y: 0, k: 1 });
  const [ready, setReady]           = useState(false);

  const layout      = useMemo(() => buildTreeLayout(categories), [categories]);
  const allProjects = useMemo(() => categories.flatMap(c => c.projects), [categories]);
  const selected    = useMemo(() => allProjects.find(p => p.id === selectedId) ?? null, [allProjects, selectedId]);

  const { svgRef, viewportRef, zoomBy, resetView, ensureVisible, wasDrag } = usePanZoom();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  const schedule = useMemo(() => {
    const edgeDelays = new Map<string, number>();
    const nodeDelays = new Map<string, number>();
    const ambient    = new Set<string>();

    const cats  = layout.nodes.filter(n => n.kind === 'category');
    const projs = layout.nodes.filter(n => n.kind === 'project');

    cats.forEach((c, i) => {
      const id = `root->${c.id}`, delay = 0.2 + i * 0.1;
      edgeDelays.set(id, delay);
      nodeDelays.set(c.id, delay + 0.6);
    });

    const byCategory = new Map<string, typeof projs>();
    projs.forEach(p => {
      if (!byCategory.has(p.categoryId)) byCategory.set(p.categoryId, []);
      byCategory.get(p.categoryId)!.push(p);
    });

    let d = 1.0;
    cats.forEach(c => {
      byCategory.get(c.id)?.forEach(p => {
        const id = `${c.id}->${p.id}`;
        edgeDelays.set(id, d);
        nodeDelays.set(p.id, d + 0.6);
        if (hash(id) % 10 < 3) ambient.add(id);
        d += 0.1;
      });
    });

    return { edgeDelays, nodeDelays, ambient };
  }, [layout.nodes]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    resetView(layout.bounds);
    const ro = new ResizeObserver(() => resetView(layout.bounds));
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout.bounds, resetView]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const update = () => {
      const t = vp.getAttribute('transform');
      const m = t?.match(/translate\(([-\d.]+)\s+([-\d.]+)\)\s+scale\(([-\d.]+)\)/);
      if (m) setTransform({ x: +m[1], y: +m[2], k: +m[3] });
    };
    const obs = new MutationObserver(update);
    obs.observe(vp, { attributes: true, attributeFilter: ['transform'] });
    update();
    return () => obs.disconnect();
  }, [viewportRef]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelectedId(null); setHover({ nodeId: null, nodeKind: null }); }
      if (!e.ctrlKey && !e.metaKey) {
        if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomBy(1.25); }
        if (e.key === '-') { e.preventDefault(); zoomBy(0.8); }
        if (e.key === '0') { e.preventDefault(); resetView(layout.bounds); setSelectedId(null); }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [layout.bounds, zoomBy, resetView]);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    const node = layout.nodes.find(n => n.id === id);
    if (node) ensureVisible(node.x, node.y);
  }, [layout.nodes, ensureVisible]);

  const close              = useCallback(() => setSelectedId(null), []);
  const onBackdrop         = useCallback(() => { if (!wasDrag()) close(); }, [wasDrag, close]);
  const onRootDoubleClick  = useCallback(() => { resetView(layout.bounds); setSelectedId(null); }, [layout.bounds, resetView]);

  const { activeEdges, hoveredEdges, dimmedNodes } = useMemo(() => {
    const active = new Set<string>(), hovered = new Set<string>(), dimmed = new Set<string>();
    if (selectedId) {
      const n = layout.nodes.find(n => n.id === selectedId);
      if (n?.kind === 'project') { active.add(`root->${n.categoryId}`); active.add(`${n.categoryId}->${n.id}`); }
    }
    if (hover.nodeId) {
      const n = layout.nodes.find(n => n.id === hover.nodeId);
      if (n?.kind === 'category') {
        hovered.add(`root->${n.categoryId}`);
        layout.edges.forEach(e => { if (e.from.kind === 'category' && e.from.id === n.id) hovered.add(e.id); });
      } else if (n?.kind === 'project') {
        hovered.add(`root->${n.categoryId}`);
        hovered.add(`${n.categoryId}->${n.id}`);
        layout.nodes.forEach(x => { if (x.id !== 'root' && x.id !== n.categoryId && x.id !== n.id) dimmed.add(x.id); });
      }
    }
    return { activeEdges: active, hoveredEdges: hovered, dimmedNodes: dimmed };
  }, [selectedId, hover, layout.nodes, layout.edges]);

  const onNodeClick = useCallback((id: string, kind: string) => {
    if (!wasDrag() && kind === 'project') select(id);
  }, [wasDrag, select]);

  const onNodeHover = useCallback((node: LayoutNode | null) => {
    if (!node) return setHover({ nodeId: null, nodeKind: null });
    if (node.kind === 'project')
      setHover({ nodeId: node.id, nodeKind: 'project', categoryId: node.categoryId, project: node.project, x: node.x, y: node.y });
    else
      setHover({ nodeId: node.id, nodeKind: node.kind, categoryId: node.kind === 'category' ? node.categoryId : undefined, x: node.x, y: node.y });
  }, []);

  const ZoomIn  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
  const ZoomOut = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
  const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;

  return (
    <div className={`projects-tree ${ready ? 'is-ready' : ''} ${selectedId ? 'has-selection' : ''}`} ref={containerRef}>
      <TreeBackground />

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <TreeSearch categories={categories} onSelectProject={select} />
      </div>

      <svg ref={svgRef} className="projects-tree__svg" role="application" aria-label="Árvore de projetos">
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f5c453" stopOpacity="0.7" />
            <stop offset="50%"  stopColor="#f5c453" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4a838" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="edgeGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f5c453" stopOpacity="1" />
            <stop offset="50%"  stopColor="#FFD966" stopOpacity="1" />
            <stop offset="100%" stopColor="#f5c453" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="edgeGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#35f0a0" stopOpacity="0.8" />
            <stop offset="50%"  stopColor="#35f0a0" stopOpacity="1" />
            <stop offset="100%" stopColor="#2ac77f" stopOpacity="0.9" />
          </linearGradient>
          <filter id="node-glow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="transparent" onClick={onBackdrop} />

        <g ref={viewportRef}>
          {layout.edges.map(edge => {
            const isActive  = activeEdges.has(edge.id);
            const isHovered = hoveredEdges.has(edge.id);
            const d         = schedule.edgeDelays.get(edge.id) ?? 0;
            return (
              <g key={edge.id}>
                <path d={edgePath(edge.from, edge.to)} pathLength={1}
                  className={`tree-edge${isActive ? ' is-active' : ''}${isHovered ? ' is-hovered' : ''}`}
                  style={{ '--edge-delay': `${d}s` } as CSSProperties} />
                {isActive && (
                  <circle r="3" fill="#35f0a0" className="energy-particle energy-particle--active">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath(edge.from, edge.to)} />
                  </circle>
                )}
                {!isActive && schedule.ambient.has(edge.id) && (
                  <circle r="2" fill="#f5c453" opacity="0.4" className="energy-particle">
                    <animateMotion dur="4s" repeatCount="indefinite" path={edgePath(edge.from, edge.to)} />
                  </circle>
                )}
              </g>
            );
          })}

          {layout.nodes.map(node => {
            const delay = schedule.nodeDelays.get(node.id) ?? 0;
            const style = { '--node-delay': `${delay}s` } as CSSProperties;
            const dimmed = dimmedNodes.has(node.id);
            const hp = { onMouseEnter: () => onNodeHover(node), onMouseLeave: () => onNodeHover(null) };

            if (node.kind === 'root') return (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`} onDoubleClick={onRootDoubleClick} {...hp}>
                <g className={`tree-node tree-node--root${dimmed ? ' is-dimmed' : ''}`} style={{ '--node-delay': '0s' } as CSSProperties}>
                  <circle r={28} className="ring" />
                  <circle r={11} className="core" />
                </g>
              </g>
            );

            if (node.kind === 'category') return (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`} {...hp}>
                <g className={`tree-node tree-node--category${dimmed ? ' is-dimmed' : ''}`} style={style}>
                  <circle r={12} />
                  <text textAnchor="middle" y={-24} className="tree-label tree-label--category">{node.label}</text>
                </g>
              </g>
            );

            const isSel = node.id === selectedId;
            return (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`}
                onClick={() => onNodeClick(node.id, 'project')}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNodeClick(node.id, 'project'); } }}
                role="button" tabIndex={0} aria-pressed={isSel} aria-label={node.label} {...hp}>
                <g className={`tree-node tree-node--project${isSel ? ' is-selected' : ''}${dimmed ? ' is-dimmed' : ''}`} style={style}>
                  <circle r={30} className="hit" />
                  <circle r={isSel ? 8 : 6} className="dot" />
                  <text textAnchor="middle" y={-20} className={`tree-label tree-label--project${isSel ? ' is-highlighted' : ''}`}>
                    {node.label.length > 24 ? node.label.slice(0, 23) + '…' : node.label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="projects-tree__controls" data-no-pan>
        <button onClick={() => zoomBy(1.25)} aria-label="Aproximar"    title="Aproximar (+)"><ZoomIn  /></button>
        <button onClick={() => zoomBy(0.8)}  aria-label="Afastar"      title="Afastar (-)"><ZoomOut /></button>
        <button onClick={() => resetView(layout.bounds)} aria-label="Recentralizar" title="Resetar (0)"><HomeIcon /></button>
      </div>

      {hover.nodeKind === 'project' && hover.project && svgRef.current && containerRef.current && (
        <ProjectTooltip project={hover.project} targetX={hover.x!} targetY={hover.y!}
          containerRect={containerRef.current.getBoundingClientRect()} transform={transform} />
      )}

      {selected && (
        <div className="projects-tree__panel" data-no-pan>
          {renderDetails(selected, { projects: allProjects, onSelect: select, onClose: close })}
        </div>
      )}
    </div>
  );
}
