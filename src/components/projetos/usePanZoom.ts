import { useCallback, useEffect, useRef } from 'react';

type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
const DRAG_THRESHOLD = 4;

export function usePanZoom({ minScale = 0.3, maxScale = 2.4 } = {}) {
  const svgRef      = useRef<SVGSVGElement | null>(null);
  const viewportRef = useRef<SVGGElement | null>(null);
  const view        = useRef({ x: 0, y: 0, k: 1 });
  const pointers    = useRef(new Map<number, { x: number; y: number }>());
  const downPos     = useRef<{ x: number; y: number } | null>(null);
  const dragState   = useRef({ moved: false });
  const pinch       = useRef<{ dist: number; cx: number; cy: number } | null>(null);

  const clamp = useCallback((k: number) => Math.min(maxScale, Math.max(minScale, k)), [minScale, maxScale]);

  const apply = useCallback(() => {
    const g = viewportRef.current;
    if (!g) return;
    const { x, y, k } = view.current;
    g.setAttribute('transform', `translate(${x} ${y}) scale(${k})`);
  }, []);

  const zoomAt = useCallback((cx: number, cy: number, factor: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r   = svg.getBoundingClientRect();
    const px  = cx - r.left, py = cy - r.top;
    const { x, y, k } = view.current;
    const nk  = clamp(k * factor);
    const ratio = nk / k;
    view.current = { k: nk, x: px - (px - x) * ratio, y: py - (py - y) * ratio };
    apply();
  }, [apply, clamp]);

  const zoomBy = useCallback((factor: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
  }, [zoomAt]);

  const resetView = useCallback((bounds: Bounds) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const bw = Math.max(1, bounds.maxX - bounds.minX);
    const bh = Math.max(1, bounds.maxY - bounds.minY);
    const k  = clamp(Math.min((r.width  - Math.max(100, r.width  * 0.14) * 2) / bw,
                               (r.height - Math.max(100, r.height * 0.16) * 2) / bh));
    const cx = (bounds.minX + bounds.maxX) / 2;
    const cy = (bounds.minY + bounds.maxY) / 2;
    view.current = { k, x: r.width / 2 - cx * k, y: r.height / 2 - cy * k };
    apply();
  }, [apply, clamp]);

  const ensureVisible = useCallback((worldX: number, worldY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r   = svg.getBoundingClientRect();
    const { x, y, k } = view.current;
    const margin = Math.min(160, r.width * 0.2);
    const sx = worldX * k + x, sy = worldY * k + y;
    let nx = x, ny = y;
    if (sx < margin)            nx += margin - sx;
    else if (sx > r.width - margin) nx -= sx - (r.width - margin);
    if (sy < margin)            ny += margin - sy;
    else if (sy > r.height - margin) ny -= sy - (r.height - margin);
    if (nx !== x || ny !== y) { view.current = { ...view.current, x: nx, y: ny }; apply(); }
  }, [apply]);

  const navigateToPoint = useCallback((worldX: number, worldY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    view.current = { k: view.current.k, x: r.width / 2 - worldX * view.current.k, y: r.height / 2 - worldY * view.current.k };
    apply();
  }, [apply]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015)); };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const inside = (cx: number, cy: number) => {
      const r = svg.getBoundingClientRect();
      return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    };

    const onDown = (e: PointerEvent) => {
      if ((e.target as Element)?.closest('[data-no-pan]')) return;
      if (!inside(e.clientX, e.clientY)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 1) { downPos.current = { x: e.clientX, y: e.clientY }; dragState.current.moved = false; }
      if (pointers.current.size >= 2 && !pinch.current) {
        const [a, b] = [...pointers.current.values()];
        pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
        dragState.current.moved = true;
      }
    };

    const onMove = (e: PointerEvent) => {
      const p = pointers.current.get(e.pointerId);
      if (!p) return;
      if (downPos.current && pointers.current.size === 1) {
        if (Math.hypot(e.clientX - downPos.current.x, e.clientY - downPos.current.y) > DRAG_THRESHOLD)
          dragState.current.moved = true;
      }
      const [px, py] = [p.x, p.y];
      p.x = e.clientX; p.y = e.clientY;
      if (pointers.current.size === 1) {
        view.current = { ...view.current, x: view.current.x + (e.clientX - px), y: view.current.y + (e.clientY - py) };
        apply();
      } else if (pointers.current.size >= 2 && pinch.current) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        view.current = { ...view.current, x: view.current.x + (cx - pinch.current.cx), y: view.current.y + (cy - pinch.current.cy) };
        apply();
        zoomAt(cx, cy, dist / (pinch.current.dist || dist));
        pinch.current = { dist, cx, cy };
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) pinch.current = null;
      if (pointers.current.size === 0) downPos.current = null;
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [apply, zoomAt]);

  return { svgRef, viewportRef, zoomBy, resetView, ensureVisible, navigateToPoint, wasDrag: useCallback(() => dragState.current.moved, []) };
}
