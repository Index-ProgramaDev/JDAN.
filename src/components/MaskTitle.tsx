import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "../data/servicos.config";

// Título com animação de máscara — o texto sobe de baixo quando entra na tela
export default function MaskTitle({ children, shouldReduce, start, className = "text-4xl font-light tracking-wide lg:text-5xl" }: { children: string; shouldReduce: boolean; start?: boolean; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: "some" });
  const show = shouldReduce || (start === undefined ? inView : start);

  return (
    <h2 ref={ref} className={`overflow-hidden pb-2 ${className}`}>
      <motion.span
        className="block text-inherit"
        initial={{ y: shouldReduce ? "0%" : "110%" }}
        animate={{ y: show ? "0%" : "110%" }}
        transition={{ duration: shouldReduce ? 0 : 0.9, ease: EASE }}
      >
        {children}
      </motion.span>
    </h2>
  );
}
