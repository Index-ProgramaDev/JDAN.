import { useState, useRef, useEffect } from 'react';
import type { Project, ProjectCategory } from './tree.types';

type Props = { categories: ProjectCategory[]; onSelectProject: (id: string) => void };
type Result = { project: Project; categoryLabel: string; matchType: 'title' | 'tech' | 'description' };

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export function TreeSearch({ categories, onSelectProject }: Props) {
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [idx, setIdx]       = useState(0);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const found: Result[] = [];
    categories.forEach(cat => {
      cat.projects.forEach(p => {
        if (p.title.toLowerCase().includes(q))
          return found.push({ project: p, categoryLabel: cat.label, matchType: 'title' });
        if (p.stack.some(t => t.toLowerCase().includes(q)))
          return found.push({ project: p, categoryLabel: cat.label, matchType: 'tech' });
        if (p.description.toLowerCase().includes(q))
          found.push({ project: p, categoryLabel: cat.label, matchType: 'description' });
      });
    });
    setResults(found);
    setIdx(0);
  }, [query, categories]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(true); inputRef.current?.focus(); }
      if (e.key === 'Escape' && open) { setOpen(false); setQuery(''); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[idx]) { e.preventDefault(); select(results[idx]); }
  };

  const select = (r: Result) => { onSelectProject(r.project.id); setOpen(false); setQuery(''); };
  const close  = () => { setOpen(false); setQuery(''); };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Buscar projetos"
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#1b1d1f] border-2 border-[#35f0a0] hover:bg-[#35f0a0]/10 backdrop-blur-xl transition-all hover:shadow-xl hover:shadow-[#35f0a0]/30 hover:scale-105"
        style={{ zIndex: 9999 }}>
        <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#35f0a0] shrink-0" />
        <span className="text-sm sm:text-base font-medium text-white">Buscar</span>
        <kbd className="hidden sm:block px-2 py-1 text-xs text-[#35f0a0] bg-[#35f0a0]/10 rounded border border-[#35f0a0]/30 font-mono">Ctrl+K</kbd>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]" onClick={close} />
          <div className="fixed z-[201] w-full px-3 sm:top-[20%] sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl sm:px-4 max-sm:bottom-0 max-sm:left-0 max-sm:right-0">
            <div className="bg-gradient-to-br from-[#252729] to-[#1a1c1e] border border-[#35f0a0]/30 shadow-2xl shadow-[#35f0a0]/20 overflow-hidden animate-search-in sm:rounded-2xl max-sm:rounded-t-2xl">
              <div className="p-3 sm:p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#35f0a0] shrink-0" />
                  <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown} placeholder="Buscar projeto, tecnologia..."
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm" autoFocus />
                  <kbd className="hidden sm:block px-2 py-1 text-xs text-white/40 bg-white/5 rounded border border-white/10">ESC</kbd>
                  <button className="sm:hidden text-white/40 text-xs px-2 py-1 rounded bg-white/5" onClick={close}>✕</button>
                </div>
              </div>
              <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                {query && !results.length && (
                  <div className="p-6 sm:p-8 text-center">
                    <p className="text-white/40 text-sm">Nenhum projeto encontrado</p>
                    <p className="text-white/30 text-xs mt-1">Tente outro termo</p>
                  </div>
                )}
                {results.map((r, i) => (
                  <button key={r.project.id} onClick={() => select(r)}
                    className={`w-full px-4 py-3 text-left transition-all ${i === idx ? 'bg-[#35f0a0]/10 border-l-2 border-[#35f0a0]' : 'hover:bg-white/5'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${i === idx ? 'bg-[#35f0a0]' : 'bg-white/30'}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white mb-1 truncate">{r.project.title}</h4>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-[#f5c453]">{r.categoryLabel}</span>
                          {r.matchType === 'tech' && <span className="text-xs text-white/40 hidden sm:inline">· via tecnologia</span>}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {r.project.stack.slice(0, 3).map(t => (
                            <span key={t} className="px-1.5 py-0.5 text-[0.65rem] text-white/50 bg-white/5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
