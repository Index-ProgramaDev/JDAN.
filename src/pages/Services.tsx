    import { motion } from "motion/react";
    import type { IconType } from "react-icons";
    import {
    SiReact,
    SiTailwindcss,
    SiAngular,
    SiTypescript,
    SiPostgresql,
    SiMongodb,
    SiFlutter,
    SiGit,
    SiVercel,
    SiDocker,
    SiGithub,
    } from "react-icons/si";
    import { FaNodeJs } from "react-icons/fa";

    import Navbar from "../components/Navbar";

    type Tech = { nome: string; Icone: IconType; cor: string };

    const STACK: { titulo: string; techs: Tech[] }[] = [
    {
        titulo: "Frontend",
        techs: [
        { nome: "React", Icone: SiReact, cor: "#61DAFB" },
        { nome: "Tailwind CSS", Icone: SiTailwindcss, cor: "#38BDF8" },
        { nome: "Angular", Icone: SiAngular, cor: "#D946EF" },
        ],
    },
    {
        titulo: "Backend",
        techs: [
        { nome: "Node.js", Icone: FaNodeJs, cor: "#68A063" },
        { nome: "TypeScript", Icone: SiTypescript, cor: "#3178C6" },
        ],
    },
    {
        titulo: "Database",
        techs: [
        { nome: "PostgreSQL", Icone: SiPostgresql, cor: "#6B9BD2" },
        { nome: "MongoDB", Icone: SiMongodb, cor: "#22C55E" },
        ],
    },
    {
        titulo: "Mobile",
        techs: [{ nome: "Flutter", Icone: SiFlutter, cor: "#54C5F8" }],
    },
    {
        titulo: "DevOps",
        techs: [
        { nome: "Git", Icone: SiGit, cor: "#F05032" },
        { nome: "Vercel", Icone: SiVercel, cor: "#FFFFFF" },
        { nome: "Docker", Icone: SiDocker, cor: "#2496ED" },
        { nome: "GitHub", Icone: SiGithub, cor: "#FFFFFF" },
        ],
    },
    ];

    export default function Servicos({ start = true }: { start?: boolean }) {
    return (
        <section className="relative flex min-h-screen flex-col bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,rgba(47,49,52,0.5)_85%,#2F3134_100%)] font-['Inter'] text-white">
        <Navbar />

        <div className="mx-auto w-full max-w-[1280px] flex-1 px-10 pb-16 pt-12 md:pt-16">
            {/* Título + linha */}
            <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-end gap-6"
            >
            <h2 className="text-5xl font-light tracking-wide lg:text-6xl">STACK</h2>

            <span className="mb-3 hidden h-px w-[44%] bg-[linear-gradient(to_right,var(--green),transparent)] opacity-60 sm:block" />
            </motion.div>

            {/* Cards */}
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-12 md:mt-16 lg:justify-between">
            {STACK.map(({ titulo, techs }, i) => (
                <motion.div
                key={titulo}
                initial={{ opacity: 0, y: 32 }}
                animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
                className="flex flex-col items-center"
                >
                {/* Card de vidro */}
                <div className="group flex h-72 w-28 flex-col items-center justify-around rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_40px_rgba(0,0,0,0.5)] sm:w-32 lg:h-80 lg:w-36">
                    {techs.map(({ nome, Icone, cor }) => (
                    <Icone key={nome} title={nome} style={{ fill: cor, color: cor }} className="h-11 w-11 transition-transform duration-300 hover:scale-110 lg:h-14 lg:w-14" />
                    ))}
                </div>

                <p className="mt-5 text-xl lg:text-2xl">{titulo}</p>
                </motion.div>
            ))}
            </div>
        </div>
        </section>
    );
    }