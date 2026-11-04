import { motion } from "motion/react";
import { SiGithub } from "react-icons/si";
import { FaExternalLinkAlt } from "react-icons/fa";

import Navbar from "../components/Navbar";

type Projeto = {
  titulo: string;
  descricao: string;
  techs: string[];
  github: string;
  demo?: string;
  imagem?: string; // opcional: import da imagem do projeto
  destaque?: boolean;
};

// TROQUE pelos seus projetos reais (o primeiro aparece em destaque)
const PROJETOS: Projeto[] = [
  {
    titulo: "Projeto Principal",
    descricao:
      "Descreva aqui o seu projeto mais importante: o problema que ele resolve, o que você construiu e o resultado alcançado.",
    techs: ["React", "Node", "TypeScript", "PostgreSQL"],
    github: "#",
    demo: "#",
    destaque: true,
  },
  {
    titulo: "Projeto Dois",
    descricao: "Breve descrição do que o projeto faz e qual foi o seu papel.",
    techs: ["React", "Tailwind"],
    github: "#",
    demo: "#",
  },
  {
    titulo: "App Mobile",
    descricao: "Breve descrição do app, com o diferencial principal.",
    techs: ["Flutter", "Firebase"],
    github: "#",
  },
  {
    titulo: "API REST",
    descricao: "Breve descrição da API, com foco em segurança e escala.",
    techs: ["Node", "Docker", "MongoDB"],
    github: "#",
  },
];

export default function Projetos({ start = true }: { start?: boolean }) {
  return (
    <section className="relative flex min-h-screen flex-col bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,rgba(47,49,52,0.5)_85%,#2F3134_100%)] font-['Inter'] text-white">
      <Navbar />

      <div className="mx-auto w-full max-w-[1280px] flex-1 px-10 pb-20 pt-12 md:pt-16">
        {/* Título + linha */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-end gap-6">
            <h2 className="text-5xl font-light tracking-wide lg:text-6xl">
              PROJETOS
            </h2>

            <span className="mb-3 hidden h-px w-[36%] bg-[linear-gradient(to_right,var(--green),transparent)] opacity-60 sm:block" />
          </div>

          <p className="mt-4 text-white/50">
            Alguns dos meus principais trabalhos.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJETOS.map((p, i) => (
            <motion.article
              key={p.titulo}
              initial={{ opacity: 0, y: 32 }}
              animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
              className={`group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/25 ${
                p.destaque
                  ? "md:col-span-2 lg:col-span-3 lg:flex-row"
                  : ""
              }`}
            >
              {/* Preview */}
              <div
                className={`relative flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))] ${
                  p.destaque ? "h-56 lg:h-auto lg:w-1/2" : "h-40"
                }`}
              >
                {p.imagem ? (
                  <img
                    src={p.imagem}
                    alt={p.titulo}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-5xl font-light text-white/20">
                    {p.titulo.slice(0, 2).toUpperCase()}
                  </span>
                )}

                {p.destaque && (
                  <span className="absolute left-4 top-4 rounded-full bg-[var(--green)] px-3 py-1 text-xs font-medium tracking-wider text-black">
                    Destaque
                  </span>
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <h3
                  className={`font-medium ${
                    p.destaque ? "text-2xl lg:text-3xl" : "text-xl"
                  }`}
                >
                  {p.titulo}
                </h3>

                <p className="mt-3 text-sm leading-snug text-white/60 lg:text-base">
                  {p.descricao}
                </p>

                {/* Tecnologias */}
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.techs.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {/* Links */}
                <div className="mt-auto flex items-center gap-5 pt-6">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`GitHub de ${p.titulo}`}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--green)]"
                  >
                    <SiGithub className="h-5 w-5" /> Código
                  </a>

                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Ver ${p.titulo} online`}
                      className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--green)]"
                    >
                      <FaExternalLinkAlt className="h-4 w-4" /> Ver online
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}