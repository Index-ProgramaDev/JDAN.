import { motion } from "motion/react";
import Navbar from "../components/Navbar";

export default function Blogs({ start = true }: { start?: boolean }) {
  return (
    <section id="blogs" className="relative flex min-h-screen flex-col bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_75%,rgba(47,49,52,0.5)_90%,#2F3134_100%)] font-['Inter'] text-white">
      <Navbar />

      {/* CONTEÚDO */}
 <motion.div initial={{ opacity: 0, y: 24 }} animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.8, delay: 0.2 }} className="mx-auto flex w-full max-w-[1280px] flex-1 -translate-y-12 flex-col items-center justify-center px-10 pt-16 text-center">
  <p className="max-w-[22rem] text-xl leading-tight text-white/40 sm:text-2xl">
    Ops.. parece que não tem blog no momento.. volte mais tarde! ;)
  </p>

  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" className="mt-16 h-14 w-14 text-white md:h-16 md:w-16">
    <polygon points="24,3 44,14 44,34 24,45 4,34 4,14" />
    <polyline points="4,14 24,26 44,14" />
    <line x1="24" y1="26" x2="24" y2="45" />
    <polyline points="4,34 24,22 44,34" />
  </svg>
</motion.div>
    </section>
  );
}