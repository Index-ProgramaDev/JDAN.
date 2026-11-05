import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE } from "../data/servicos.config";

// Anima o filho quando ele entra na tela (fade + deslize)
export default function Reveal({ children, delay = 0, className, shouldReduce }: { children: ReactNode; delay?: number; className?: string; shouldReduce: boolean }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduce ? 0 : 0.8, delay: shouldReduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
