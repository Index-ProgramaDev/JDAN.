import { ProjectsTree } from '../components/projetos/ProjectTree';
import { projectCategories } from '../components/projetos/projects.data';
import { getTechIcon } from '../data/techIcons';
import Navbar from '../components/Navbar';

export default function Projetos() {
  return (
    <div className="min-h-screen w-full bg-[#1b1d1f] flex flex-col">
      <Navbar />
      <ProjectsTree
        categories={projectCategories}
        renderDetails={(project, ctx) => {
          const projects = ctx.projects;
          const i = projects.findIndex((p) => p.id === project.id);
          const total = projects.length;

          return (
            <div className="flex flex-col h-full bg-gradient-to-br from-[#252729] to-[#1a1c1e] sm:rounded-2xl rounded-t-2xl border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl">

              {/* Arrasto — só aparece no mobile */}
              <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Foto do projeto */}
              {project.image ? (
                <div className="w-full aspect-[16/7] sm:aspect-[16/6] shrink-0 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full aspect-[16/7] sm:aspect-[16/6] shrink-0 bg-gradient-to-br from-[#f5c453]/10 to-[#35f0a0]/10 flex items-center justify-center">
                  <span className="text-white/15 text-xs uppercase tracking-widest">sem imagem</span>
                </div>
              )}

              {/* Cabeçalho */}
              <div className="relative px-4 py-3 sm:p-5 border-b border-white/10 shrink-0">
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
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
                <p className="text-sm leading-relaxed text-white/70">{project.description}</p>

                {(project.problem || project.solution) && (
                  <div className="grid gap-3">
                    {project.problem && (
                      <div className="rounded-xl bg-[#f5c453]/5 border border-[#f5c453]/15 p-3">
                        <h4 className="text-[0.6rem] uppercase tracking-widest text-[#f5c453] font-semibold mb-1.5">Problema</h4>
                        <p className="text-xs leading-relaxed text-white/60">{project.problem}</p>
                      </div>
                    )}
                    {project.solution && (
                      <div className="rounded-xl bg-[#35f0a0]/5 border border-[#35f0a0]/15 p-3">
                        <h4 className="text-[0.6rem] uppercase tracking-widest text-[#35f0a0] font-semibold mb-1.5">Solução</h4>
                        <p className="text-xs leading-relaxed text-white/60">{project.solution}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Ícones da stack */}
                {project.stack.length > 0 && (
                  <div>
                    <h4 className="text-[0.6rem] uppercase tracking-widest text-white/40 font-semibold mb-3">Tecnologias</h4>
                    <div className="flex flex-wrap gap-3">
                      {project.stack.map((tech) => {
                        const t = getTechIcon(tech);
                        return t ? (
                          <div
                            key={tech}
                            title={tech}
                            style={{ backgroundColor: `${t.color}20`, borderColor: `${t.color}50` }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-transform hover:scale-110"
                          >
                            <t.Icon className="h-5 w-5" style={{ color: t.color }} aria-label={tech} />
                          </div>
                        ) : (
                          <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {project.links && project.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.links.map(({ label, href }) => (
                      <a key={label} href={href} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#35f0a0]/10 border border-[#35f0a0]/30 text-xs text-[#35f0a0] active:bg-[#35f0a0]/20 transition-all">
                        {label} <span>↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Navegação entre projetos */}
              {total > 1 && (
                <div className="flex items-center justify-between px-3 py-2.5 sm:p-4 border-t border-white/10 bg-white/[0.02] shrink-0">
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
