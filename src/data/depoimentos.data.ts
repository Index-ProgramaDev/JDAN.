import prova1 from '../assets/prints/prova1.png';
import prova2 from '../assets/prints/prova2.png';
import prova3 from '../assets/prints/prova3.png';
import prova4 from '../assets/prints/prova4.png';

export type Depoimento = {
  nome: string;
  empresa?: string;
  projeto?: string;
  servico?: string;
  texto?: string;
  print?: string;
};

export const DEPOIMENTOS: Depoimento[] = [
  { nome: "Açai Boa Vista", empresa: "Empresa de Açai", projeto: "Menu completo de pedidos online", servico: "Site institucional", texto: "O Ifood roubava quase todo o faturamento dele, até eu resolver isso.", print: prova1 },
  { nome: "Gustavo", empresa: "Depoimento", projeto: "em Agradecimento", servico: "Landing Page", texto: "Fiz uma landing Page pros negócios do amigo dele, Gustavo veio querendo garantir o seu", print: prova2 },
  { nome: "Refrigeração do Roberto", empresa: "Empresa de eletrônicos", projeto: "Site de pedidos online", servico: "Site institucional", texto: "O Roberto é dono de uma Refrigeração em MG. Veio a minha procura através o Instagram e garantiu seu site. O resultado o deixou surpreso", print: prova3 },
  { nome: "Rick ADS | MKT", empresa: "Vendedor de infoprodutos", projeto: "Landing Page pra funil de vendas", servico: "Landing Page", texto: "O depoimento do Rick Mostra resultados reais de alto faturamento na UTMIFY ao rodar ofertas com o fu", print: prova4 },
];
