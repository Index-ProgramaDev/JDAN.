import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { label: "Principal", to: "/home" },
  { label: "Serviços", to: "/servicos" },
  { label: "Projetos", to: "/projetos" },
  { label: "Blog", to: "/blogs" },
];

const WHATSAPP = "https://wa.me/5581998714983";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-[8888] flex flex-wrap items-center justify-between gap-y-4 border-b border-white/10 bg-[#1C1E1F] px-6 py-4 md:px-12 lg:h-24 lg:flex-nowrap lg:px-16 lg:py-0 xl:px-[8rem]">
      <h1 className="cursor-pointer text-[2rem] text-[var(--green)] transition-transform duration-300 hover:scale-105 sm:text-[2.4rem] lg:text-[2.8rem]">
        <Link to="/">J<span className="text-white">Dan.</span></Link>
      </h1>

      <ul className="order-3 flex w-full items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:px-6 sm:py-3 lg:order-none lg:w-auto lg:justify-start lg:gap-16 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 xl:gap-[14rem]">
        {LINKS.map(({ label, to }) => {
          const ativo = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={ativo ? "page" : undefined}
                className={`relative block py-1 transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:bg-current after:transition-all after:duration-300 hover:-translate-y-0.5 hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${ativo ? "text-[1.05rem] text-white after:w-full sm:text-[1.3rem] lg:text-[1.4rem]" : "text-[1rem] text-[var(--green)] after:w-0 hover:text-white sm:text-[1.2rem]"}`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        className="flex h-10 items-center rounded-lg bg-[var(--green)] px-4 text-sm font-medium tracking-wider text-black transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_20px_var(--green)] active:scale-95 sm:px-5 sm:text-base lg:-mr-1 lg:h-11 lg:px-8"
      >
        Contate-me
      </a>
    </nav>
  );
}
