
import type { ProjectCategory } from './tree.types';
import { PROJETOS } from '../../data/data';

const projectCategories: ProjectCategory[] = [
  {
    id: 'fullstack',
    label: 'Fullstack',
    projects: [
      ...PROJETOS.filter(p => p.categoria === 'Fullstack').map((p, idx) => ({
        id: `fullstack-${idx}`, title: p.titulo, description: p.descricao, problem: p.problema || '', solution: p.solucao || '', stack: p.techs, image: p.imagem || '',
        links: [...(p.github && p.github !== '#' ? [{ label: 'GitHub', href: p.github }] : []), ...(p.demo && p.demo !== '#' ? [{ label: 'Demo', href: p.demo }] : [])],
      })),
      {
        id: 'fullstack-store', title: 'E-Commerce Platform', description: 'Plataforma completa de comércio eletrônico com experiência de compra moderna.', problem: 'Dificuldade em gerenciar produtos, pedidos e pagamentos em um único ambiente.', solution: 'Sistema integrado com catálogo, carrinho, autenticação e gerenciamento de pedidos.', stack: ['React', 'Node.js', 'Express', 'PostgreSQL'], image: '', links: [],
      },
      {
        id: 'fullstack-dashboard', title: 'Analytics Dashboard', description: 'Dashboard interativo para visualização e análise de dados.', problem: 'Informações dispersas dificultando a tomada de decisões.', solution: 'Painel centralizado com gráficos, filtros e indicadores em tempo real.', stack: ['React', 'Node.js', 'Chart.js', 'MongoDB'], image: '', links: [],
      },
    ],
  },
  {
    id: 'frontend',
    label: 'Front-end',
    projects: [
      ...PROJETOS.filter(p => p.categoria === 'Frontend').map((p, idx) => ({
        id: `frontend-${idx}`, title: p.titulo, description: p.descricao, problem: p.problema || '', solution: p.solucao || '', stack: p.techs, image: p.imagem || '',
        links: [...(p.github && p.github !== '#' ? [{ label: 'GitHub', href: p.github }] : []), ...(p.demo && p.demo !== '#' ? [{ label: 'Demo', href: p.demo }] : [])],
      })),
      {
        id: 'frontend-portfolio', title: 'Creative Portfolio', description: 'Portfólio interativo com animações, transições e identidade visual personalizada.', problem: 'Apresentar projetos de maneira visualmente impactante.', solution: 'Interface responsiva com animações fluidas e navegação dinâmica.', stack: ['React', 'Tailwind CSS', 'Motion'], image: '', links: [],
      },
      {
        id: 'frontend-weather', title: 'Weather App', description: 'Aplicação meteorológica com previsão do tempo e condições climáticas.', problem: 'Acesso pouco intuitivo às informações meteorológicas.', solution: 'Interface dinâmica consumindo dados de uma API externa.', stack: ['React', 'JavaScript', 'REST API'], image: '', links: [],
      },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    projects: [
      ...PROJETOS.filter(p => p.categoria === 'Mobile').map((p, idx) => ({
        id: `mobile-${idx}`, title: p.titulo, description: p.descricao, problem: p.problema || '', solution: p.solucao || '', stack: p.techs, image: p.imagem || '',
        links: [...(p.github && p.github !== '#' ? [{ label: 'GitHub', href: p.github }] : []), ...(p.demo && p.demo !== '#' ? [{ label: 'Demo', href: p.demo }] : [])],
      })),
      {
        id: 'mobile-fitness', title: 'FitTrack', description: 'Aplicativo de acompanhamento de treinos com metas e evolução pessoal.', problem: 'Dificuldade em acompanhar a consistência e o progresso dos treinos.', solution: 'Sistema de metas, histórico de atividades e estatísticas pessoais.', stack: ['React Native', 'Expo', 'AsyncStorage'], image: '', links: [],
      },
      {
        id: 'mobile-finance', title: 'Pocket Finance', description: 'Aplicativo de controle financeiro pessoal.', problem: 'Falta de organização no controle de gastos cotidianos.', solution: 'Registro de despesas, categorias e relatórios financeiros.', stack: ['React Native', 'TypeScript', 'SQLite'], image: '', links: [],
      },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end',
    projects: [
      ...PROJETOS.filter(p => p.categoria === 'Backend').map((p, idx) => ({
        id: `backend-${idx}`, title: p.titulo, description: p.descricao, problem: p.problema || '', solution: p.solucao || '', stack: p.techs, image: p.imagem || '',
        links: [...(p.github && p.github !== '#' ? [{ label: 'GitHub', href: p.github }] : []), ...(p.demo && p.demo !== '#' ? [{ label: 'Demo', href: p.demo }] : [])],
      })),
      {
        id: 'backend-api', title: 'REST API', description: 'API RESTful para gerenciamento de usuários e recursos.', problem: 'Necessidade de comunicação padronizada entre aplicações.', solution: 'Endpoints organizados, validação de dados e tratamento de erros.', stack: ['Node.js', 'Express', 'PostgreSQL', 'JWT'], image: '', links: [],
      },
      {
        id: 'backend-auth', title: 'Authentication Service', description: 'Serviço de autenticação e gerenciamento de sessões.', problem: 'Necessidade de proteger recursos e controlar o acesso de usuários.', solution: 'Autenticação com tokens, hash de senhas e autorização por permissões.', stack: ['Node.js', 'Express', 'JWT', 'Bcrypt'], image: '', links: [],
      },
    ],
  },
];

export { projectCategories };
