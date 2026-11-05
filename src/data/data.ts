export type Projeto = {
  titulo: string; descricao: string; problema?: string; solucao?: string;
  techs: string[]; github: string; demo?: string; imagem?: string;
  destaque?: boolean; categoria?: string;
};
type Item = { projeto: Projeto; index: number };

export const PROJETOS: Projeto[] = [
  { titulo: "Projeto Principal", descricao: "Descreva aqui o seu projeto mais importante: o problema que ele resolve, o que você construiu e o resultado alcançado.", problema: "Descreva o problema que motivou o projeto.", solucao: "Descreva a solução que você construiu.", techs: ["React", "Node", "TypeScript", "PostgreSQL"], github: "#", demo: "#", destaque: true, categoria: "Fullstack" },
  { titulo: "Projeto Dois", descricao: "Breve descrição do que o projeto faz e qual foi o seu papel.", problema: "Descreva o problema que motivou o projeto.", solucao: "Descreva a solução que você construiu.", techs: ["React", "Tailwind"], github: "#", demo: "#", categoria: "Frontend" },
  { titulo: "App Mobile", descricao: "Breve descrição do app, com o diferencial principal.", problema: "Descreva o problema que motivou o app.", solucao: "Descreva a solução que você construiu.", techs: ["Flutter", "Firebase"], github: "#", categoria: "Mobile" },
  { titulo: "API REST", descricao: "Breve descrição da API, com foco em segurança e escala.", problema: "Descreva o problema que motivou a API.", solucao: "Descreva a solução que você construiu.", techs: ["Node", "Docker", "MongoDB"], github: "#", categoria: "Backend" },
];

const groups = new Map<string, Item[]>();
PROJETOS.forEach((projeto, index) => {
  const cat = projeto.categoria ?? "Projetos";
  groups.set(cat, [...(groups.get(cat) ?? []), { projeto, index }]);
});

const N = groups.size;
const xPad = N === 1 ? 0.5 : 0.15;
const categories = Array.from(groups).map(([name, items], i) => ({ name, items, x: xPad + (i / Math.max(N - 1, 1)) * (1 - xPad * 2), y: 0.3 }));
const maxItems = Math.max(...categories.map((c) => c.items.length));
const yStep = maxItems > 1 ? (0.86 - 0.58) / (maxItems - 1) : 0;
const leaves = categories.flatMap((c, categoriaIdx) => c.items.map((item, leafIdx) => ({ x: c.x, y: 0.58 + leafIdx * yStep, categoriaIdx, leafIdx, item })));

export const TREE = { categories, leaves };
export type Category = (typeof categories)[number];

let t = 0.9;
const timedCategories = categories.map((c) => {
  const catStart = t;
  const leafStarts = c.items.map((_, j) => catStart + 0.4 + j * 0.22);
  t = catStart + 0.4 + c.items.length * 0.22 + 0.35;
  return { catStart, leafStarts };
});
export const TIMINGS = { categories: timedCategories, completeAt: t + 0.5 };

export const catIdxOf = (projectIdx: number) => leaves.find((l) => l.item.index === projectIdx)?.categoriaIdx ?? 0;
