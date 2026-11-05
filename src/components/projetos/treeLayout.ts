import type { LayoutEdge, LayoutNode, ProjectCategory, TreeBounds } from './tree.types';

const TRUNK_Y       = 400;
const CAT_RADIUS    = 280;
const PROJ_RADIUS   = 550;
const ANGLE_SPREAD  = Math.PI * 0.85;

export type TreeLayout = { nodes: LayoutNode[]; edges: LayoutEdge[]; bounds: TreeBounds };

export function buildTreeLayout(categories: ProjectCategory[] = []): TreeLayout {
  if (!Array.isArray(categories)) categories = [];

  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const n = categories.length;

  const root: Extract<LayoutNode, { kind: 'root' }> = { kind: 'root', id: 'root', x: 0, y: TRUNK_Y };
  nodes.push(root);

  if (n === 0) {
    return { nodes, edges, bounds: { minX: -200, maxX: 200, minY: TRUNK_Y - 200, maxY: TRUNK_Y + 100 } };
  }

  const totalProjects = categories.reduce((s, c) => s + c.projects.length, 0);
  const density       = Math.min(1 + totalProjects * 0.02, 1.6);
  const catR          = CAT_RADIUS * density;
  const projR         = PROJ_RADIUS * density;
  const step          = n > 1 ? ANGLE_SPREAD / (n - 1) : 0;
  const start         = -ANGLE_SPREAD / 2;

  categories.forEach((cat, ci) => {
    const angle = start + ci * step;
    const r     = catR + Math.sin(ci * 2.3) * 40;
    const catX  = root.x + Math.sin(angle) * r;
    const catY  = root.y - Math.cos(angle) * r;

    const catNode: Extract<LayoutNode, { kind: 'category' }> = {
      kind: 'category', id: cat.id, label: cat.label, categoryId: cat.id, x: catX, y: catY,
    };
    nodes.push(catNode);
    edges.push({ id: `root->${cat.id}`, from: root, to: catNode });

    if (!cat.projects.length) return;

    const maxSpread  = (ANGLE_SPREAD / n) * 0.9;
    const spread     = maxSpread * Math.min(cat.projects.length / 8, 1);
    const projStart  = angle - spread / 2;

    cat.projects.forEach((proj, pi) => {
      const pAngle = cat.projects.length > 1
        ? projStart + (pi / (cat.projects.length - 1)) * spread
        : angle;
      const pR    = projR + Math.sin(pi * 1.7 + ci) * 50;
      const projX = root.x + Math.sin(pAngle) * pR;
      const projY = root.y - Math.cos(pAngle) * pR;

      const projNode: Extract<LayoutNode, { kind: 'project' }> = {
        kind: 'project', id: proj.id, label: proj.title, categoryId: cat.id, project: proj, x: projX, y: projY,
      };
      nodes.push(projNode);
      edges.push({ id: `${cat.id}->${proj.id}`, from: catNode, to: projNode });
    });
  });

  const xs  = nodes.map(n => n.x);
  const ys  = nodes.map(n => n.y);
  const pad = 150 + totalProjects * 3;

  return {
    nodes, edges,
    bounds: {
      minX: Math.min(...xs) - pad,
      maxX: Math.max(...xs) + pad,
      minY: Math.min(...ys) - pad,
      maxY: Math.max(...ys) + pad * 0.7,
    },
  };
}

export function edgePath(from: LayoutNode, to: LayoutNode): string {
  const fx = from.x.toFixed(2), fy = from.y.toFixed(2);
  const tx = to.x.toFixed(2),   ty = to.y.toFixed(2);

  if (from.kind === 'root') {
    const c1y = (from.y - (from.y - to.y) * 0.5).toFixed(2);
    const c2y = (to.y   + (from.y - to.y) * 0.3).toFixed(2);
    return `M${fx},${fy} C${fx},${c1y} ${tx},${c2y} ${tx},${ty}`;
  }

  const dx = to.x - from.x, dy = to.y - from.y;
  const a  = Math.atan2(dy, dx), d = Math.hypot(dx, dy);
  const c1x = (from.x + Math.cos(a) * d * 0.4).toFixed(2);
  const c1y = (from.y + Math.sin(a) * d * 0.4).toFixed(2);
  const c2x = (to.x   - Math.cos(a) * d * 0.1).toFixed(2);
  const c2y = (to.y   - Math.sin(a) * d * 0.1).toFixed(2);
  return `M${fx},${fy} C${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`;
}
