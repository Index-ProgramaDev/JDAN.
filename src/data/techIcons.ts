import type { IconType } from "react-icons";
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiPostgresql,
  SiTailwindcss,
  SiFlutter,
  SiFirebase,
  SiDocker,
  SiMongodb,
  SiNextdotjs,
  SiExpress,
  SiPython,
  SiMysql,
  SiPrisma,
  SiGit,
  SiDjango,
  SiRedis,
  SiSocketdotio,
  SiOpencv,
  SiOpenaigym,
  SiBootstrap,
  SiCss,
  SiDart,
  SiHtml5,
  SiJsonwebtokens,
  SiMediapipe,
  SiReactrouter,
  SiVuedotjs,
} from "react-icons/si";
import { FaCode, FaLock } from "react-icons/fa";

export const TECH_ICONS: Record<string, { Icon: IconType; color: string }> = {
  react: { Icon: SiReact, color: "#61DAFB" },
  reactnative: { Icon: SiReact, color: "#61DAFB" },
  node: { Icon: SiNodedotjs, color: "#5FA04E" },
  nodejs: { Icon: SiNodedotjs, color: "#5FA04E" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  tailwindcss: { Icon: SiTailwindcss, color: "#06B6D4" },
  nativewind: { Icon: SiTailwindcss, color: "#06B6D4" },
  flutter: { Icon: SiFlutter, color: "#54C5F8" },
  firebase: { Icon: SiFirebase, color: "#FFCA28" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  next: { Icon: SiNextdotjs, color: "#FFFFFF" },
  express: { Icon: SiExpress, color: "#FFFFFF" },
  python: { Icon: SiPython, color: "#3776AB" },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  prisma: { Icon: SiPrisma, color: "#5A67D8" },
  prismaorm: { Icon: SiPrisma, color: "#5A67D8" },
  django: { Icon: SiDjango, color: "#092E20" },
  redis: { Icon: SiRedis, color: "#DC382D" },
  socketio: { Icon: SiSocketdotio, color: "#010101" },
  socketdotio: { Icon: SiSocketdotio, color: "#010101" },
  opencv: { Icon: SiOpencv, color: "#5C3EE8" },
  ai: { Icon: SiOpenaigym, color: "#74AA9C" },
  ia: { Icon: SiOpenaigym, color: "#74AA9C" },
  git: { Icon: SiGit, color: "#F05032" },
  vue: { Icon: SiVuedotjs, color: "#4FC08D" },
  reactrouter: { Icon: SiReactrouter, color: "#F44250" },
  reactrouterdom: { Icon: SiReactrouter, color: "#F44250" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  bootstrap: { Icon: SiBootstrap, color: "#7952B3" },
  css: { Icon: SiCss, color: "#1572B6" },
  css3: { Icon: SiCss, color: "#1572B6" },
  dart: { Icon: SiDart, color: "#0175C2" },
  mediapipe: { Icon: SiMediapipe, color: "#0097A7" },
  jwt: { Icon: SiJsonwebtokens, color: "#FFFFFF" },
  bcrypt: { Icon: FaLock, color: "#F0A94B" },
  pgvector: { Icon: SiPostgresql, color: "#4169E1" },
};

const norm = (s: string) => s.toLowerCase().replace(/[\s.\-_]/g, "");

const NORMALIZED = Object.fromEntries(
  Object.entries(TECH_ICONS).map(([k, v]) => [norm(k), v]),
);

export function getTechIcon(name: string) {
  const key = norm(name);
  return (
    NORMALIZED[key] ??
    NORMALIZED[key.replace(/(js|css|orm)$/, "")] ??
    NORMALIZED[key.replace(/native$/, "")] ??
    NORMALIZED[key.replace(/socket$/, "socketio")]
  );
}

export const DEFAULT_TECH_ICON = FaCode;
