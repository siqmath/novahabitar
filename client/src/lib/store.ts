/**
 * Nova Habitar — Global Data Store
 * Manages projects and timeline entries via localStorage
 * Provides typed interfaces and CRUD helpers
 */

export type ProjectStatus = "previsto" | "em-desenvolvimento" | "em-obras" | "entregue";

export interface Project {
  id: string;
  title: string;
  location: string;
  description: string;
  techniques: string[]; // optional tags
  images: string[]; // up to 5 URLs
  coverIndex: number; // which image is the cover
  status: ProjectStatus;
  featured: boolean; // appears on home page
  createdAt: string;
}

export interface TimelineEntry {
  id: string;
  date: string; // e.g. "2024", "Mar 2023"
  title: string;
  description: string;
  link?: string; // optional link to /projetos/:id
  createdAt: string;
}

// ── Default seed data ──────────────────────────────────────────────────────

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Residencial Jardim das Acácias",
    location: "São Gonçalo — Alcântara",
    description:
      "Empreendimento residencial entregue com alto padrão de acabamento e conformidade regulatória. Laje protendida, tratamento acústico e regularidade fundiária garantida.",
    techniques: ["Laje protendida", "Tratamento acústico", "Regularidade fundiária"],
    images: [
      "https://cdn.abacus.ai/images/539308e5-66ea-444f-8ad8-7a2a523b1955.png",
    ],
    coverIndex: 0,
    status: "entregue",
    featured: true,
    createdAt: "2023-06-01",
  },
  {
    id: "proj-2",
    title: "Edifício Corporativo Atlântico",
    location: "Niterói — Centro",
    description:
      "Edifício comercial de alto padrão com infraestrutura corporativa completa e gestão integrada. Eficiência energética, automação predial e certificação PBQP-H.",
    techniques: ["Eficiência energética", "Automação predial", "Certificação PBQP-H"],
    images: [
      "https://cdn.abacus.ai/images/980b9b7a-4b2b-4357-a8e8-09248f241036.png",
    ],
    coverIndex: 0,
    status: "em-desenvolvimento",
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "proj-3",
    title: "Residencial Mirante do Vale",
    location: "São Gonçalo — Centro",
    description:
      "Residencial de médio e alto padrão com foco em eficiência de planta e valorização patrimonial. Planta eficiente, controle de custos e gestão por ERP.",
    techniques: ["Planta eficiente", "Controle de custos", "Gestão por ERP"],
    images: [
      "https://cdn.abacus.ai/images/6ad4be35-f622-4df6-8549-234a0a4c1f14.png",
    ],
    coverIndex: 0,
    status: "em-obras",
    featured: true,
    createdAt: "2024-03-10",
  },
];

const DEFAULT_TIMELINE: TimelineEntry[] = [
  {
    id: "tl-1",
    date: "2012",
    title: "Fundação",
    description:
      "Constituição da Nova Habitar Incorporadora e Construtora Ltda. com foco em empreendimentos residenciais de médio padrão em São Gonçalo, RJ.",
    createdAt: "2012-01-01",
  },
  {
    id: "tl-2",
    date: "2015",
    title: "Expansão para Alto Padrão",
    description:
      "Primeiro empreendimento de alto padrão entregue com certificação de conformidade. Início da estruturação do Sistema de Gestão Integrado.",
    createdAt: "2015-06-01",
  },
  {
    id: "tl-3",
    date: "2018",
    title: "Incorporação Integrada",
    description:
      "Consolidação do modelo de atuação integrada: planejamento, arquitetura, incorporação e construção sob uma única gestão com rastreabilidade total.",
    createdAt: "2018-03-01",
  },
  {
    id: "tl-4",
    date: "2021",
    title: "Governança e Compliance",
    description:
      "Implantação do ERP de gestão de obras e início do processo de certificação PBQP-H, ISO 9001 e ISO 14001.",
    createdAt: "2021-01-01",
  },
  {
    id: "tl-5",
    date: "2024",
    title: "Expansão Regional",
    description:
      "Novos empreendimentos em Niterói e ampliação do portfólio para uso misto. Consolidação como referência em incorporação técnica no Estado do Rio de Janeiro.",
    createdAt: "2024-01-01",
  },
];

// ── Storage helpers ────────────────────────────────────────────────────────

const PROJECTS_KEY = "nh_projects";
const TIMELINE_KEY = "nh_timeline";

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch {}
  return DEFAULT_PROJECTS;
}

function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function loadTimeline(): TimelineEntry[] {
  try {
    const raw = localStorage.getItem(TIMELINE_KEY);
    if (raw) return JSON.parse(raw) as TimelineEntry[];
  } catch {}
  return DEFAULT_TIMELINE;
}

function saveTimeline(entries: TimelineEntry[]): void {
  localStorage.setItem(TIMELINE_KEY, JSON.stringify(entries));
}

// ── Public API ─────────────────────────────────────────────────────────────

export const projectStore = {
  getAll: (): Project[] => loadProjects(),
  getFeatured: (): Project[] => loadProjects().filter((p) => p.featured),
  getById: (id: string): Project | undefined => loadProjects().find((p) => p.id === id),
  save: (project: Project): void => {
    const all = loadProjects();
    const idx = all.findIndex((p) => p.id === project.id);
    if (idx >= 0) all[idx] = project;
    else all.push(project);
    saveProjects(all);
  },
  delete: (id: string): void => {
    saveProjects(loadProjects().filter((p) => p.id !== id));
  },
  reset: (): void => {
    saveProjects(DEFAULT_PROJECTS);
  },
};

export const timelineStore = {
  getAll: (): TimelineEntry[] => loadTimeline(),
  getById: (id: string): TimelineEntry | undefined => loadTimeline().find((e) => e.id === id),
  save: (entry: TimelineEntry): void => {
    const all = loadTimeline();
    const idx = all.findIndex((e) => e.id === entry.id);
    if (idx >= 0) all[idx] = entry;
    else all.push(entry);
    saveTimeline(all);
  },
  delete: (id: string): void => {
    saveTimeline(loadTimeline().filter((e) => e.id !== id));
  },
  reset: (): void => {
    saveTimeline(DEFAULT_TIMELINE);
  },
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  previsto: "Previsto",
  "em-desenvolvimento": "Em desenvolvimento",
  "em-obras": "Em obras",
  entregue: "Entregue",
};

export const STATUS_LABELS_EN: Record<ProjectStatus, string> = {
  previsto: "Planned",
  "em-desenvolvimento": "In Development",
  "em-obras": "Under Construction",
  entregue: "Delivered",
};
