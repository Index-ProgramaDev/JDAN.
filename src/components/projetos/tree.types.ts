export type Project = {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  stack: string[];
  image: string;
  links?: { label: string; href: string }[];
};

export type ProjectCategory = {
  id: string;
  label: string;
  projects: Project[];
};

export type RootNode     = { kind: 'root';     id: 'root'; x: number; y: number };
export type CategoryNode = { kind: 'category'; id: string; label: string; categoryId: string; x: number; y: number };
export type ProjectNode  = { kind: 'project';  id: string; label: string; categoryId: string; project: Project; x: number; y: number };

export type LayoutNode = RootNode | CategoryNode | ProjectNode;
export type LayoutEdge = { id: string; from: LayoutNode; to: LayoutNode };
export type TreeBounds = { minX: number; minY: number; maxX: number; maxY: number };
