import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import Navbar from "../components/Navbar";
import ServicesList from "../components/services/Servicelist";
import StackSection from "../components/services/Stacksection";
import Testimonials from "../components/services/Testimonials";
import ClosingCTA from "../components/services/ClosingCTA";
import { PALETA, RESPEITAR_MOVIMENTO_REDUZIDO } from "../data/servicos.config";
import { DEPOIMENTOS } from "../data/depoimentos.data";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function Servicos({ start = true }: { start?: boolean }) {
  const prefereReduzir = useReducedMotion() ?? false;
  const shouldReduce = RESPEITAR_MOVIMENTO_REDUZIDO && prefereReduzir;
  const isMobile = useIsMobile();
  const [activeService, setActiveService] = useState(0);

  return (
    <section
      style={{ "--bgcolor": PALETA.bgcolor, "--green": PALETA.green, "--yellow": PALETA.yellow } as CSSProperties}
      className="relative flex flex-col bg-[var(--bgcolor)] bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,rgba(47,49,52,0.5)_85%,#2F3134_100%)] font-['Arial'] font-medium text-white"
    >
      <Navbar />
      <ServicesList activeService={activeService} onSelect={setActiveService} shouldReduce={shouldReduce} start={start} />
      <StackSection activeService={activeService} isMobile={isMobile} shouldReduce={shouldReduce} />
      {DEPOIMENTOS.length > 0 && <Testimonials shouldReduce={shouldReduce} />}
      <ClosingCTA activeService={activeService} onSelect={setActiveService} shouldReduce={shouldReduce} />
    </section>
  );
}
