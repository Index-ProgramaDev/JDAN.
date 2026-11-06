import type { ProjectCategory } from "./tree.types";
import { CATEGORIAS_PROJETOS, PROJETOS_POR_CATEGORIA } from "../../data/data";

const projectCategories: ProjectCategory[] = CATEGORIAS_PROJETOS.map(
  ({ id, label, dataCategory }) => ({
    id,
    label,
    projects: PROJETOS_POR_CATEGORIA[dataCategory].map((project) => ({
      id: project.id,
      title: project.titulo,
      description: project.descricao,
      stack: project.techs,
      image: project.imagem || "",
      links: [
        ...(project.github && project.github !== "#"
          ? [{ label: "GitHub", href: project.github }]
          : []),
        ...(project.demo && project.demo !== "#"
          ? [{ label: "Ver site", href: project.demo }]
          : project.demoDisabled
            ? [{ label: "Ver site", disabled: true }]
            : []),
      ],
    })),
  }),
);

export { projectCategories };
