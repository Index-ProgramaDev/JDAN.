import certificadoFlutter from "../assets/certificados/CertificadoFlutter.png";
import certificadoReact from "../assets/certificados/CertificadoReact.jpg";

export type CategoriaProjeto = "Fullstack" | "Frontend" | "Mobile" | "Backend";

export type Projeto = {
  id: string;
  titulo: string;
  descricao: string;
  techs: string[];
  github?: string;
  demo?: string;
  demoDisabled?: boolean;
  imagem?: string;
  destaque?: boolean;
  categoria?: CategoriaProjeto;
};

export type CategoriaCertificado =
  | "Cibersegurança"
  | "Segurança Digital"
  | "Desenvolvimento Mobile"
  | "Software";

export type Certificado = {
  id: string;
  titulo: string;
  instituicao: string;
  arquivo: string;
  formato: "imagem" | "pdf";
  emitidoEm: string;
  credencialUrl: string;
  categoria: CategoriaCertificado;
};

export const CATEGORIAS_CERTIFICADOS: ReadonlyArray<{
  id: CategoriaCertificado;
  label: string;
}> = [
  { id: "Cibersegurança", label: "Cibersegurança" },
  { id: "Segurança Digital", label: "Segurança Digital" },
  { id: "Desenvolvimento Mobile", label: "Desenvolvimento Mobile" },
  { id: "Software", label: "Software" },
];

export const CERTIFICADOS: Certificado[] = [
  {
    id: "introducao-ciberseguranca",
    titulo: "Introdução à Cibersegurança",
    instituicao:
      "Cisco Networking Academy · Senac-PE-Centro de Inovação e Tecnologia",
    arquivo:
      "https://media.licdn.com/dms/image/v2/D4E2DAQEG9AHgsu6reA/profile-treasury-document-cover-images_480/B4EaDWgyYtHoA0-/0/1790305315233?e=1794538800&v=beta&t=eU7EbV7ch4hG-MWFvoPRpj5OcCez9YrWH4H7TZk_R1E",
    formato: "imagem",
    emitidoEm: "Março de 2026",
    credencialUrl:
      "https://www.linkedin.com/in/daniel-bernardo-15b974359/overlay/Certifications/1451461353/treasury/?profileId=ACoAAFlPTtcB5az5DqEGyRyxPz9ohsPQX0pq-tA",
    categoria: "Cibersegurança",
  },
  {
    id: "gerenciamento-ameacas-ciberneticas",
    titulo: "Gerenciamento de ameaças cibernéticas",
    instituicao: "Cisco Networking Academy · ICT SENAC/PE",
    arquivo:
      "https://media.licdn.com/dms/image/v2/D4E2DAQGzUCDfqujXXg/profile-treasury-document-cover-images_480/B4EaDWgaeZH4A0-/0/1790305217334?e=1794538800&v=beta&t=S1f5Mzn16BD7kETvmUqIeBo7vkBrusjxup2I0P5atTk",
    formato: "imagem",
    emitidoEm: "Setembro de 2025",
    credencialUrl:
      "https://www.linkedin.com/in/daniel-bernardo-15b974359/overlay/Certifications/1451357042/treasury/?profileId=ACoAAFlPTtcB5az5DqEGyRyxPz9ohsPQX0pq-tA",
    categoria: "Cibersegurança",
  },
  {
    id: "defesa-de-rede",
    titulo: "Defesa de rede",
    instituicao: "Cisco Networking Academy · ICT SENAC/PE",
    arquivo:
      "https://media.licdn.com/dms/image/v2/D4E2DAQE6NPFAYqchng/profile-treasury-document-cover-images_480/B4EaDWgGspKQA0-/0/1790305136569?e=1794538800&v=beta&t=urrd2tY8Q6ITHx9kFX4x3v_8C9liDvhgNZjq8b-WmH8",
    formato: "imagem",
    emitidoEm: "Março de 2025",
    credencialUrl:
      "https://www.linkedin.com/in/daniel-bernardo-15b974359/overlay/Certifications/1451283184/treasury/?profileId=ACoAAFlPTtcB5az5DqEGyRyxPz9ohsPQX0pq-tA",
    categoria: "Cibersegurança",
  },
  {
    id: "sensibilizacao-seguranca-digital",
    titulo: "Sensibilização para a Segurança Digital",
    instituicao:
      "Cisco Networking Academy · Senac-PE-Centro de Inovação e Tecnologia",
    arquivo:
      "https://media.licdn.com/dms/image/v2/D4E2DAQGEJw63mrpWbA/profile-treasury-document-cover-images_480/B4EaDWhKdXHcA8-/0/1790305414620?e=1794538800&v=beta&t=MYJpVsH3WD95qF38e1Luw9VmU2ufVjj2mq8uEf5cJZI",
    formato: "imagem",
    emitidoEm: "Setembro de 2026",
    credencialUrl:
      "https://www.netacad.com/recognitions/verify/a1899661-2528-4656-9a48-96431fa9b5ac",
    categoria: "Segurança Digital",
  },
  {
    id: "flutter-experience-r5-academy",
    titulo: "Flutter Experience",
    instituicao: "R5 Academy · Academia do Flutter",
    arquivo: certificadoFlutter,
    formato: "imagem",
    emitidoEm: "4 de outubro de 2026",
    credencialUrl: certificadoFlutter,
    categoria: "Software",
  },
  {
    id: "curso-react-js-19-next-js-15",
    titulo: "Curso de React JS 19 e Next.js 15",
    instituicao: "Udemy · Luiz Otávio Miranda e Tales Calogi Malaquias",
    arquivo: certificadoReact,
    formato: "imagem",
    emitidoEm: "6 de novembro de 2026",
    credencialUrl:
      "https://ude.my/UC-723b0bae-b23b-4fcb-a422-692592164b23",
    categoria: "Software",
  },
];

export const CERTIFICADOS_POR_CATEGORIA: Record<CategoriaCertificado, Certificado[]> = {
  "Cibersegurança": CERTIFICADOS.filter((certificado) => certificado.categoria === "Cibersegurança"),
  "Segurança Digital": CERTIFICADOS.filter((certificado) => certificado.categoria === "Segurança Digital"),
  "Desenvolvimento Mobile": CERTIFICADOS.filter((certificado) => certificado.categoria === "Desenvolvimento Mobile"),
  "Software": CERTIFICADOS.filter((certificado) => certificado.categoria === "Software"),
};







export const PROJETOS: Projeto[] = [
  {
    // FULLSTACK

    id: "fullstack-workup",
    titulo: "WorkUp",
    descricao:
      "Plataforma de conexão entre profissionais e clientes, projetada para facilitar a descoberta de serviços e oportunidades.",
    techs: ["JavaScript", "Tailwind CSS ", "Node.js", "MongoDB"],
    github: "https://github.com/Index-ProgramaDev/WorkUp",
    demo: "",
    demoDisabled: true,
    imagem: "https://i.ibb.co/GfGWfWwt/clipboard-20261105-234249.png",
    categoria: "Fullstack",
  },
  {
    id: "fullstack-agendalink",
    titulo: "AgendaLink",
    descricao:
      "Plataforma de conexão entre profissionais e clientes, projetada para facilitar a descoberta de serviços e oportunidades.",
    techs: ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "PrismaORM"],
    imagem: "https://i.ibb.co/tMHJVjTh/clipboard-20261105-234144.png",
    categoria: "Fullstack",
  },
  {
    id: "fullstack-arise",
    titulo: "Arise Project",
    descricao:
      "SaaS de desenvolvimento pessoal com inteligência artificial, missões adaptativas e sistema de progressão.",
    techs: ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "PrismaORM"],
    demo: "",
    imagem: "https://i.ibb.co/4ZTCgxsd/clipboard-20261105-232046.png",
    categoria: "Fullstack",
  },

  // Frontend

  {
    id: "portfolio-vitor",
    titulo: "Portfolio do Vitor",
    descricao:
      "Portfólio pessoal do Vitor, exibindo seus projetos e habilidades.",
    techs: ["Vue", "React-Router-dom", "Tailwind CSS"],
    demo: "https://vitorpersonal.com.br",
    imagem: "https://i.ibb.co/6RRzQ4VG/clipboard-20261105-230401.png",
    categoria: "Frontend",
  },
  {
    id: "portfolio-leonardo-tiburcio",
    titulo: "Portfólio Leonardo Tibúrcio",
    descricao:
      "Portfólio desenvolvido para apresentar os projetos e habilidades de Leonardo Tibúrcio.",
    techs: ["React", "Tailwind CSS", "IA"],
    demo: "https://leonardotiburcioadvocacia.com.br",
    imagem: "https://i.ibb.co/Cs2NBpbp/clipboard-20261105-231049.png",
    categoria: "Frontend",
  },
  {
    id: "portfolio-EduardoBastilho",
    titulo: "Portfólio Eduardo Bastilho",
    descricao:
      "Portfólio desenvolvido para apresentar os projetos e habilidades de Eduardo Bastilho.",
    techs: ["HTML", "Bootstrap", "CSS", "React"],
    demo: "https://eduardobastilho.adv.br ",
    imagem: "https://i.ibb.co/XxvVhcZS/clipboard-20261105-230734.png",
    categoria: "Frontend",
  },
  // MOBILE

  {
    id: "mobile-teacolhe",
    titulo: "TEAcolhe",
    descricao:
      "Aplicativo mobile com inteligência artificial integrada para oferecer suporte e interações objetivas a pessoas com TEA.",
    techs: ["React Native", "NativeWind", "Django", "Python", "AI"],
    github: "https://github.com/teacolhe-enfermagem",
    demo: "",
    imagem: "https://avatars.githubusercontent.com/u/284089323?s=200&v=4",
    categoria: "Mobile",
  },
  {
    id: "mobile-productivity",
    titulo: "FocusFlow",
    descricao:
      "Aplicativo de produtividade com tarefas, metas e gerenciamento de foco.",
    techs: ["Flutter", "Dart", "Firebase"],
    demo: "",
    imagem: "",
    categoria: "Mobile",
  },

  // BACKEND

  {
    id: "backend-cam",
    titulo: "Cam-Security",
    descricao:
      "Sistema inteligente de monitoramento com visão computacional e detecção de poses humanas.",
    techs: ["Python", "OpenCV", "MediaPipe", "MySQL", "Prisma ORM", "PGVector"],
    github: "https://github.com/Index-ProgramaDev/Cam-Security",
    demo: "",
    imagem:
      "https://media.licdn.com/dms/image/v2/D4E22AQFcPRNDYS5qFA/feedshare-shrink_800/B4EaDWlng1IoAc-/0/1790306580826?e=1795651200&v=beta&t=OMb2eJxKvBd3MoUSXs85frODINVvYWKiY6S7xEbz6_E",
    categoria: "Backend",
  },
  {
    id: "backend-auth",
    titulo: "Autentificação",
    descricao:
      "Serviço de autenticação com gerenciamento de sessões, tokens e controle de permissões.",
    techs: ["Node.js", "Express", "JWT", "Bcrypt"],
    demo: "",
    github: "https://github.com/Index-ProgramaDev/WorkUp",
    imagem: "https://i.ibb.co/GvcTsbpG/clipboard-20261105-233145.png",
    categoria: "Backend",
  },
  {
    id: "backend-realtime",
    titulo: "Websocket",
    descricao:
      "Sistema de comunicação em tempo real para notificações e atualização de informações.",
    techs: ["Node.js", "Socket.IO", "Redis"],
    demo: "",
    github: "https://github.com/Index-ProgramaDev/WorkUp",
    imagem: "https://i.ibb.co/mFHQhRdL/clipboard-20261105-232319.png",
    categoria: "Backend",
  },
  {
    id: "backend-microservices",
    titulo: "Microserviços",
    descricao:
      "Arquitetura distribuída com serviços independentes e comunicação entre módulos.",
    techs: ["Node.js", "Docker", "Redis", "PostgreSQL"],
    demo: "",
    imagem:
      "https://juliocasal.com/assets/images/2024-07-20/4ghDFAZYvbFtvU3CTR72ZN-tnKwH2NUmyunvE3v5qn4bA.jpeg",
    categoria: "Backend",
  },
];

export const CATEGORIAS_PROJETOS: ReadonlyArray<{
  id: string;
  label: string;
  dataCategory: CategoriaProjeto;
}> = [
  { id: "fullstack", label: "Fullstack", dataCategory: "Fullstack" },
  { id: "frontend", label: "Front-end", dataCategory: "Frontend" },
  { id: "mobile", label: "Mobile", dataCategory: "Mobile" },
  { id: "backend", label: "Back-end", dataCategory: "Backend" },
];

export const PROJETOS_POR_CATEGORIA: Record<CategoriaProjeto, Projeto[]> = {
  Fullstack: PROJETOS.filter((project) => project.categoria === "Fullstack"),
  Frontend: PROJETOS.filter((project) => project.categoria === "Frontend"),
  Mobile: PROJETOS.filter((project) => project.categoria === "Mobile"),
  Backend: PROJETOS.filter((project) => project.categoria === "Backend"),
};
