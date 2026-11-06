import { useState } from 'react';
import { ProjectsTree } from '../components/projetos/ProjectTree';
import { projectCategories } from '../components/projetos/projects.data';
import { DEFAULT_TECH_ICON, getTechIcon } from '../data/techIcons';
import Navbar from '../components/Navbar';

export default function Projetos() {
  const [activeTechTooltip, setActiveTechTooltip] = useState<string | null>(null);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#1b1d1f]">
      <Navbar />
      <ProjectsTree
        categories={projectCategories}
        renderDetails={(project, ctx) => {
          const projects = ctx.projects;
          const i = projects.findIndex((p) => p.id === project.id);
          const total = projects.length;

          return (
            <div className="flex flex-col h-full max-h-full bg-gradient-to-br from-[#252729] to-[#1a1c1e] sm:rounded-2xl rounded-t-2xl border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl">

              {/* Arrasto — só aparece no mobile */}
              <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Foto do projeto */}
              {project.image ? (
                <div className="projects-tree__detail-image w-full h-[clamp(100px,18dvh,190px)] shrink-0 overflow-hidden bg-black/20">
                  <img src={project.image} alt={project.title} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="projects-tree__detail-image flex w-full h-[clamp(100px,18dvh,190px)] shrink-0 items-center justify-center bg-gradient-to-br from-[#f5c453]/10 to-[#35f0a0]/10">
                  <span className="text-white/15 text-xs uppercase tracking-widest">sem imagem</span>
                </div>
              )}

              {/* Cabeçalho */}
              <div className="projects-tree__detail-header relative px-3 py-2 sm:p-5 border-b border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={ctx.onClose}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 transition-all"
                  aria-label="Fechar"
                >
                  <span className="text-white/60 text-base leading-none">✕</span>
                </button>

                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#35f0a0] animate-pulse shrink-0" />
                  <span className="text-[0.6rem] uppercase tracking-widest text-white/40">{i + 1} / {total}</span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white pr-10 leading-snug">{project.title}</h3>
              </div>

              {/* Corpo */}
              <div className="projects-tree__detail-body flex flex-1 min-h-0 flex-col overflow-hidden p-2 sm:p-5">
                <p className="projects-tree__detail-description text-sm leading-relaxed text-white/70 line-clamp-3 sm:line-clamp-none">{project.description}</p>

                {project.stack.length > 0 && (
                  <div className="projects-tree__detail-stack mt-2 sm:mt-4">
                    <h4 className="text-[0.6rem] uppercase tracking-widest text-white/40 font-semibold mb-3">Tecnologias</h4>
                    <div className="flex max-w-full flex-wrap gap-3">
                      {project.stack.map((tech) => {
                        const t = getTechIcon(tech);
                        const techName = tech.trim();
                        const tooltipId = `${project.id}:${techName}`;
                        const tooltipOpen = activeTechTooltip === tooltipId;
                        const tooltipClass = `projects-tree__tech-label${tooltipOpen ? ' is-open' : ''}`;
                        const tooltipStyle = tooltipOpen
                          ? { opacity: 1, visibility: 'visible' as const, transform: 'translate(-50%, 0)', transition: 'none' }
                          : undefined;
                        const tooltipEvents = {
                          onClick: () => setActiveTechTooltip(current => current === tooltipId ? null : tooltipId),
                        };
                        return t ? (
                          <button key={tech} type="button" aria-label={techName} style={{ backgroundColor: `${t.color}20`, borderColor: `${t.color}50` }} className="projects-tree__tech relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border p-0 transition-transform hover:scale-110 sm:h-10 sm:w-10" {...tooltipEvents}>
                            <t.Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: t.color }} aria-hidden="true" />
                            <span className={tooltipClass} style={tooltipStyle} aria-hidden="true">{techName}</span>
                          </button>
                        ) : (
                          <button key={tech} type="button" aria-label={techName} className="projects-tree__tech relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 p-0 transition-transform hover:scale-110 sm:h-10 sm:w-10" {...tooltipEvents}>
                            <DEFAULT_TECH_ICON className="h-4 w-4 text-white/60 sm:h-5 sm:w-5" aria-hidden="true" />
                            <span className={tooltipClass} style={tooltipStyle} aria-hidden="true">{techName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {project.links && project.links.length > 0 && (
                  <div className="projects-tree__detail-actions grid grid-cols-2 gap-2 px-2 pt-2 pb-3 sm:gap-3 sm:px-5 sm:pt-3 sm:pb-4">
                    {project.links.map(({ label, href, disabled }) => {
                      const isGithub = label.toLowerCase().includes('github') || label.toLowerCase().includes('código') || label.toLowerCase().includes('repo');
                      if (href && !disabled) {
                        return (
                        <a key={label} href={href} target="_blank" rel="noreferrer"
                          className={`flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold transition-all active:scale-95 sm:py-3 sm:text-sm ${
                            project.links?.length === 1 ? 'col-span-2' : ''
                          } ${
                            isGithub
                              ? 'bg-white text-black hover:bg-white/90'
                              : 'bg-[#FFD138] text-black hover:bg-[#FFD138]/90'
                          }`}>
                          {isGithub ? (
                            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                          {label}
                        </a>
                        );
                      }

                      if (disabled) {
                        return (
                          <button key={label} type="button" disabled aria-disabled="true"
                            className={`flex min-h-11 min-w-0 cursor-not-allowed items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold opacity-45 sm:py-3 sm:text-sm ${
                              project.links?.length === 1 ? 'col-span-2' : ''
                            } ${
                              isGithub
                                ? 'bg-white text-black'
                                : 'bg-[#FFD138] text-black'
                            }`}>
                            {!isGithub && (
                              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                            {label}
                          </button>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

              {/* Navegação entre projetos */}
              {total > 1 && (
                <div className="projects-tree__detail-navigation flex items-center justify-between px-3 py-2.5 sm:p-4 border-t border-white/10 bg-white/[0.02] shrink-0">
                  <button type="button"
                    onClick={() => ctx.onSelect(projects[(i - 1 + total) % total].id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all">
                    ← <span className="hidden sm:inline">Anterior</span>
                  </button>

                  <div className="flex gap-1.5 items-center">
                    {projects.slice(0, 8).map((_, idx) => (
                      <button key={idx} type="button"
                        onClick={() => ctx.onSelect(projects[idx].id)}
                        className={`h-1.5 rounded-full transition-all ${idx === i ? 'bg-[#35f0a0] w-5' : 'bg-white/20 w-1.5'}`}
                      />
                    ))}
                    {total > 8 && <span className="text-white/30 text-xs ml-1">+{total - 8}</span>}
                  </div>

                  <button type="button"
                    onClick={() => ctx.onSelect(projects[(i + 1) % total].id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all">
                    <span className="hidden sm:inline">Próximo</span> →
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
