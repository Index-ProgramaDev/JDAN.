import type { IconType } from "react-icons";
import { SiReact, SiTailwindcss, SiAngular, SiTypescript, SiPostgresql, SiMongodb, SiFlutter, SiGit, SiVercel, SiDocker, SiGithub } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";

export type Tech = { nome: string; Icone: IconType; cor: string };

export const STACK: { titulo: string; techs: Tech[] }[] = [
  { titulo: "Frontend", techs: [
    { nome: "React", Icone: SiReact, cor: "#61DAFB" },
    { nome: "Tailwind CSS", Icone: SiTailwindcss, cor: "#38BDF8" },
    { nome: "Angular", Icone: SiAngular, cor: "#D946EF" },
  ]},
  { titulo: "Backend", techs: [
    { nome: "Node.js", Icone: FaNodeJs, cor: "#68A063" },
    { nome: "TypeScript", Icone: SiTypescript, cor: "#3178C6" },
  ]},
  { titulo: "Database", techs: [
    { nome: "PostgreSQL", Icone: SiPostgresql, cor: "#6B9BD2" },
    { nome: "MongoDB", Icone: SiMongodb, cor: "#22C55E" },
  ]},
  { titulo: "Mobile", techs: [
    { nome: "Flutter", Icone: SiFlutter, cor: "#54C5F8" },
  ]},
  { titulo: "DevOps", techs: [
    { nome: "Git", Icone: SiGit, cor: "#F05032" },
    { nome: "Vercel", Icone: SiVercel, cor: "#FFFFFF" },
    { nome: "Docker", Icone: SiDocker, cor: "#2496ED" },
    { nome: "GitHub", Icone: SiGithub, cor: "#FFFFFF" },
  ]},
];
