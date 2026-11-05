import type { IconType } from "react-icons";
import { FaBullseye, FaBuilding, FaLightbulb } from "react-icons/fa";

export const SERVICO_INCLUSO: Record<string, string[]> = {
  "Landing Pages": [
    "Página de uma tela só, focada em gerar contato",
    "Layout responsivo: celular, tablet e computador",
    "Botão direto para o seu WhatsApp",
    "Carregamento rápido e publicação online",
  ],
  "Sites Institucionais": [
    "Várias páginas: início, sobre, serviços e contato",
    "Identidade visual aplicada ao seu negócio",
    "Layout responsivo e otimizado para buscadores",
    "Publicação online com seu domínio",
  ],
  "Software sob medida": [
    "Conversa para entender e delimitar a sua ideia",
    "Sistema web ou aplicativo mobile, conforme a necessidade",
    "Banco de dados, login de usuários e regras do seu negócio",
    "Código organizado para o projeto crescer depois",
  ],
};

export const SERVICO_TECHS: Record<string, string[]> = {
  "Landing Pages": ["React", "Tailwind CSS", "Vercel", "Git", "GitHub"],
  "Sites Institucionais": ["React", "Tailwind CSS", "TypeScript", "Node.js", "PostgreSQL", "GitHub", "Docker", "Git"],
  "Software sob medida": ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Flutter", "Docker", "GitHub", "Git", "Tailwind CSS"],
};

export type Servico = { titulo: string; descricao: string; Icone: IconType; tag: string; imagem?: string };

export const SERVICOS: Servico[] = [
  { titulo: "Landing Pages", descricao: "Páginas objetivas para divulgar um produto, serviço ou campanha e transformar visitas em conversas no WhatsApp.", Icone: FaBullseye, tag: "Conversão" },
  { titulo: "Sites Institucionais", descricao: "O site da sua empresa ou profissão: organizado, com cara de marca e pronto para passar confiança a quem pesquisa por você.", Icone: FaBuilding, tag: "Presença online" },
  { titulo: "Software sob medida", descricao: "Você tem a ideia, eu transformo em sistema: do rascunho ao produto no ar, em web ou mobile.", Icone: FaLightbulb, tag: "Da ideia ao código" },
];
