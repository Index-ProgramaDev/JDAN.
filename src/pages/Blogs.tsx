import { useState } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";

export default function Blogs({ start = true }: { start?: boolean }) {
  const [email, setEmail] = useState("");
  const [inscrito, setInscrito] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setInscrito(true);
      setEmail("");
    }
  };

  return (
    <section id="blogs" className="relative flex min-h-screen flex-col bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_75%,rgba(47,49,52,0.5)_90%,#2F3134_100%)] font-['Inter'] text-white">
      <Navbar />

      {/* CONTEÚDO */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }} 
        animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} 
        transition={{ duration: 0.8, delay: 0.2 }} 
        className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-6 py-16 text-center"
      >
        {/* Título da Seção */}
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#F472B6]">Conteúdo & Conhecimento</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Artigos & Insights</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#7ED957]" />
        </div>

        {/* Card de Estado Vazio / Em Breve */}
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#25282A]/50 p-8 shadow-2xl backdrop-blur-md sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-[#F5C518]">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" className="h-8 w-8">
              <polygon points="24,3 44,14 44,34 24,45 4,34 4,14" />
              <polyline points="4,14 24,26 44,14" />
              <line x1="24" y1="26" x2="24" y2="45" />
              <polyline points="4,34 24,22 44,34" />
            </svg>
          </div>

          <h3 className="mt-6 text-xl font-semibold text-[var(--yellow)]">Nada por aqui ainda...</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">
            Estou preparando conteúdos incríveis sobre desenvolvimento Fullstack, arquitetura de software e boas práticas. Volte em breve ou cadastre-se para ser avisado! ;)
          </p>

          {/* Formulário de Notificação */}
          <div className="mt-8">
            {inscrito ? (
              <div className="rounded-xl bg-[#7ED957]/10 p-4 text-sm font-medium text-[#7ED957] border border-[#7ED957]/20">
                Obrigado! Você será avisado quando o primeiro artigo for lançado. 🚀
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Seu melhor e-mail" 
                  required 
                  className="flex-1 rounded-xl border border-white/10 bg-[#1B1D1F] px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#7ED957] focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="rounded-xl bg-[#7ED957] px-6 py-3 text-sm font-bold text-[#1B1D1F] transition-transform hover:scale-105 active:scale-95"
                >
                  Avise-me
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}