import type { IconType } from "react-icons";
import { SiReact, SiNodedotjs, SiTypescript, SiJavascript, SiPostgresql, SiTailwindcss, SiFlutter, SiFirebase, SiDocker, SiMongodb, SiNextdotjs, SiExpress, SiPython, SiMysql, SiPrisma, SiGit } from "react-icons/si";

export const TECH_ICONS: Record<string, { Icon: IconType; color: string }> = {
  react:      { Icon: SiReact,       color: "#61DAFB" },
  node:       { Icon: SiNodedotjs,   color: "#5FA04E" },
  nodejs:     { Icon: SiNodedotjs,   color: "#5FA04E" },
  typescript: { Icon: SiTypescript,  color: "#3178C6" },
  javascript: { Icon: SiJavascript,  color: "#F7DF1E" },
  postgresql: { Icon: SiPostgresql,  color: "#4169E1" },
  tailwind:   { Icon: SiTailwindcss, color: "#06B6D4" },
  flutter:    { Icon: SiFlutter,     color: "#54C5F8" },
  firebase:   { Icon: SiFirebase,    color: "#FFCA28" },
  docker:     { Icon: SiDocker,      color: "#2496ED" },
  mongodb:    { Icon: SiMongodb,     color: "#47A248" },
  next:       { Icon: SiNextdotjs,   color: "#FFFFFF" },
  express:    { Icon: SiExpress,     color: "#FFFFFF" },
  python:     { Icon: SiPython,      color: "#3776AB" },
  mysql:      { Icon: SiMysql,       color: "#4479A1" },
  prisma:     { Icon: SiPrisma,      color: "#5A67D8" },
  git:        { Icon: SiGit,         color: "#F05032" },
};

// Normaliza o nome: minúsculas, sem espaços/pontos/hífens/underlines
const norm = (s: string) => s.toLowerCase().replace(/[\s.\-_]/g, "");

const NORMALIZED = Object.fromEntries(
  Object.entries(TECH_ICONS).map(([k, v]) => [norm(k), v]),
);

// Tenta encontrar o ícone pelo nome exato; como fallback, remove sufixos "js" e "css"
export function getTechIcon(name: string) {
  const key = norm(name);
  return NORMALIZED[key] ?? NORMALIZED[key.replace(/(js|css)$/, "")];
}
