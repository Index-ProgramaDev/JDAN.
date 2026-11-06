import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Home from "./Home";
// Intro não usa Navbar — ela aparece depois das cortinas abrirem, dentro de Home

export default function Intro() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState(0);

  const message = "E aí! Seja bem-vindo\nao meu mundo.";

  // Sequência assíncrona de fases: typewriter → linha → cortinas → desmonta
  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    async function run() {
      await wait(1600);
      const pauseAfter = message.indexOf("!") + 1;

      for (let i = 1; i <= message.length; i++) {
        if (cancelled) return;
        setText(message.slice(0, i));
        await wait(i === pauseAfter ? 550 : 65);
      }

      await wait(1500);
      if (cancelled) return;
      setPhase(1); // texto some, linha vertical cresce

      await wait(1400);
      if (cancelled) return;
      setPhase(2); // linha expande horizontalmente

      await wait(2000);
      if (cancelled) return;
      setPhase(3); // cortinas abrem, Home entra

      await wait(2000);
      if (cancelled) return;
      setPhase(4); // overlay desmontado
    }

    run();
    return () => { cancelled = true; };
  }, []);

  // Bloqueia scroll durante a sequência de intro
  useEffect(() => {
    document.body.style.overflow = phase < 4 ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  return (
    <main className="min-h-screen bg-[var(--bgcolor)] text-white">
      <div className="min-h-screen">
        <Home start={phase >= 3} showNav={phase >= 4} />
      </div>

      {phase < 4 && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Texto typewriter */}
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: phase === 0 ? 1 : 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="absolute inset-0 z-20 flex items-center justify-center font-['Inter'] font-medium text-4xl text-center">
            <span className="whitespace-pre-line">
              {text}
              {phase === 0 && (
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} className="inline-block ml-1 w-[3px] h-[0.9em] bg-white align-middle" />
              )}
            </span>
          </motion.h1>

          {/* Linha branca: cresce verticalmente na fase 1, expande horizontalmente na fase 2 */}
          <motion.div initial={{ height: "0vh", width: "2px", opacity: 0 }} animate={{ height: phase >= 1 ? "100vh" : "0vh", width: phase >= 2 ? "100vw" : "2px", opacity: phase >= 1 && phase < 3 ? 1 : 0 }} transition={{ height: { duration: 1.4, ease: [0.65, 0, 0.35, 1] }, width: { duration: 2, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.5 } }} className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />

          {/* Cortina superior */}
          <motion.div animate={{ y: phase >= 3 ? "-105vh" : "0vh" }} transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }} className="absolute top-0 left-0 w-full h-[50.5vh] bg-[#0A0A0A] z-10" />

          {/* Cortina inferior */}
          <motion.div animate={{ y: phase >= 3 ? "105vh" : "0vh" }} transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }} className="absolute bottom-0 left-0 w-full h-[50.5vh] bg-[#0A0A0A] z-10" />
        </div>
      )}
    </main>
  );
}
