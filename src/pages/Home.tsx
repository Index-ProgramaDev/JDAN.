  import { useEffect, useState } from "react";
  import { motion } from "motion/react";

  import Navbar from "../components/Navbar";

  import MinhaFoto1 from "../assets/Eu.png";
  import MinhaFoto2 from "../assets/Eu2.png";
  import MinhaFoto3 from "../assets/Eu3.png";

  import InstagramIcon from "../assets/instagram.svg";
  import LinkedinIcon from "../assets/linkedin.svg";
  import GithubIcon from "../assets/github.svg";
  import WhatsappIcon from "../assets/whatsapp.svg";

  const fotos = [MinhaFoto1, MinhaFoto2, MinhaFoto3];

  export default function Home({ start = true }: { start?: boolean }) {
    const [fotoAtual, setFotoAtual] = useState(0);
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
      let trocarFoto: number;
      let encerrarGlitch: number;

      const interval = window.setInterval(() => {
        setGlitch(true);
        trocarFoto = window.setTimeout(() => setFotoAtual((atual) => (atual + 1) % fotos.length), 140);
        encerrarGlitch = window.setTimeout(() => setGlitch(false), 380);
      }, 3000);

      return () => {
        window.clearInterval(interval);
        window.clearTimeout(trocarFoto);
        window.clearTimeout(encerrarGlitch);
      };
    }, []);

    return (
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#1B1D1F] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,rgba(47,49,52,0.5)_80%,#2F3134_100%)] font-['Inter'] text-white">
        <Navbar />

        {/* DECORAÇÃO DIREITA */}
  <div aria-hidden="true" className="absolute -right-16 top-[45%] h-full w-[200px] rounded-full bg-[linear-gradient(to_bottom,#2c2c2c,#232425)]" />
        {/* HERO */}
        <motion.div id="principal" initial={{ opacity: 0, y: 24 }} animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.8, delay: 0.2 }} className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-10 px-10 py-16 lg:grid-cols-3">

          {/* ESQUERDA */}
          <div className="-translate-x-[40%] translate-y-[8pc] self-start">
            <p className="text-[2.6rem]">Olá! Eu sou</p>
            <p className="ml-5 whitespace-nowrap text-[3.6rem] font-medium text-[#F472B6]">João Daniel.</p>
          </div>

          {/* FOTO E SETA */}
          <div className="relative mx-auto">
          <svg aria-hidden="true" className="pointer-events-none absolute top-[40%] -left-[10rem] z-10 w-[25rem] -translate-x-1/2 overflow-visible" viewBox="0 0 320 110" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round">
    {/* Ponta da seta */}
    <path d="M20 12 L29 5 L38 12" strokeLinejoin="round" />

    {/* Trajeto tracejado */}
    <path d="M30 20 C15 48 38 76 66 83 C96 91 117 68 143 48 C169 28 193 12 219 9 C245 6 265 19 282 32 C296 43 307 37 60 " strokeDasharray="10 11" />
  </svg>

       <div className={`photo-glitch relative scale-90 -translate-x-[20%] aspect-square h-60 w-60 shrink-0 overflow-hidden rounded-full sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-[420px] lg:w-[420px] xl:h-[500px] xl:w-[500px] ${glitch ? "is-glitching" : ""}`}>
              <img key={fotoAtual} src={fotos[fotoAtual]} alt="João Daniel" className="photo-base" />
              <img src={fotos[fotoAtual]} alt="" aria-hidden="true" className="photo-layer photo-red" />
              <img src={fotos[fotoAtual]} alt="" aria-hidden="true" className="photo-layer photo-green" />
              <img src={fotos[fotoAtual]} alt="" aria-hidden="true" className="photo-layer photo-blue" />
            </div>
          </div>

          {/* DIREITA */}
          <div className="max-w-sm translate-y-[2.5pc] self-start lg:justify-self-end">
            <p className="text-[2.5rem]">Dev</p>
            <p className="ml-6 inline-block border-b border-[#7ED957] px-2 pb-2 text-[3rem] font-medium text-[#F5C518]">FULLSTACK</p>
            <p className="mt-12 text-[22px] leading-snug">
              Eu sou João - Dev Fullstack. atuante no mercado freelance. Faço aplicações seguras, rápidas e escaláveis com Node, React e Typescript. Construo APPS com Flutter e boas práticas de código ;)
            </p>
          </div>
        </motion.div>

        {/* REDES SOCIAIS */}
        <div className="absolute bottom-16 left-[5%] flex items-center gap-8">
          <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110"><img src={InstagramIcon} alt="Instagram" className="h-12 w-12" /></a>
          <a href="#" aria-label="LinkedIn" className="transition-transform hover:scale-110"><img src={LinkedinIcon} alt="LinkedIn" className="h-12 w-12" /></a>
          <a href="#" aria-label="GitHub" className="transition-transform hover:scale-110"><img src={GithubIcon} alt="GitHub" className="h-12 w-12" /></a>
          <a href="#" aria-label="WhatsApp" className="transition-transform hover:scale-110"><img src={WhatsappIcon} alt="WhatsApp" className="h-12 w-12" /></a>
        </div>

        {/* CRÉDITO */}
        <p className="absolute bottom-[12%] right-[20%] text-right font-['Leckerli_One'] text-[1.7rem] text-white/30">
          Design e código por:
          <br />
          @Bernardo.devcode
        </p>
      </section>
    );
  }