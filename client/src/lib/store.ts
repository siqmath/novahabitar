/**
 * Nova Habitar — Global Data Store
 * Manages projects, timeline entries, and contact info via localStorage
 */

export type ProjectStatus = "previsto" | "em-desenvolvimento" | "em-obras" | "entregue";
export type ProjectType = "residencial" | "comercial" | "uso-misto";

export interface ProjectActuation {
  planning: string;
  architecture: string;
  incorporation: string;
  construction: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  description: string;
  longDescription: string; // "Sobre o projeto"
  techniques: string[]; // tags / diferenciais
  images: string[]; // up to 5 URLs
  coverIndex: number;
  status: ProjectStatus;
  type: ProjectType;
  featured: boolean;
  // Technical data
  typology: string;       // ex: "Salas comerciais de 30 a 150 m²"
  builtArea: string;      // ex: "12.000 m²"
  units: string;          // ex: "120 unidades"
  actuation: ProjectActuation;
  createdAt: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  photo?: string; // optional photo URL
  link?: string;
  createdAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  linkedin: string;
}

// ── Default seed data ──────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    slug: "residencial-jardim-das-acacias",
    title: "Residencial Jardim das Acácias",
    location: "São Gonçalo — Alcântara",
    description:
      "Empreendimento residencial entregue com alto padrão de acabamento e conformidade regulatória. Laje protendida, tratamento acústico e regularidade fundiária garantida.",
    longDescription:
      "O Residencial Jardim das Acácias representa o compromisso da Nova Habitar com a entrega de empreendimentos que combinam qualidade técnica, regularidade fundiária e padrão de acabamento superior. Desenvolvido em São Gonçalo, o projeto atende famílias que buscam qualidade de vida com segurança patrimonial.",
    techniques: ["Laje protendida", "Tratamento acústico", "Regularidade fundiária"],
    images: [
      "https://cdn.abacus.ai/images/539308e5-66ea-444f-8ad8-7a2a523b1955.png",
    ],
    coverIndex: 0,
    status: "entregue",
    type: "residencial",
    featured: true,
    typology: "Apartamentos de 2 e 3 quartos",
    builtArea: "8.500 m²",
    units: "96 unidades",
    actuation: {
      planning: "Análise de viabilidade e estruturação do empreendimento com foco no mercado residencial de médio-alto padrão.",
      architecture: "Projeto com fachada contemporânea, áreas de lazer integradas e especificação eficiente de materiais.",
      incorporation: "Regularização fundiária, registro de incorporação e estruturação de SPE.",
      construction: "Execução com laje protendida, tratamento acústico e controle rigoroso de qualidade.",
    },
    createdAt: "2023-06-01",
  },
  {
    id: "proj-2",
    slug: "edificio-corporativo-atlantico",
    title: "Edifício Corporativo Atlântico",
    location: "Niterói — Centro",
    description:
      "Edifício comercial de alto padrão com infraestrutura corporativa completa e gestão integrada. Eficiência energética, automação predial e certificação PBQP-H.",
    longDescription:
      "O Edifício Corporativo Atlântico será um marco na arquitetura comercial de Niterói. Com salas de diversos tamanhos, o empreendimento atende desde profissionais liberais até empresas de médio porte. O projeto conta com infraestrutura de ponta, incluindo auditório, salas de reunião compartilhadas e estacionamento rotativo.",
    techniques: ["Eficiência energética", "Automação predial", "Certificação PBQP-H"],
    images: [
      "https://cdn.abacus.ai/images/980b9b7a-4b2b-4357-a8e8-09248f241036.png",
    ],
    coverIndex: 0,
    status: "em-desenvolvimento",
    type: "comercial",
    featured: true,
    typology: "Salas comerciais de 30 a 150 m²",
    builtArea: "12.000 m²",
    units: "120 unidades",
    actuation: {
      planning: "Análise de viabilidade e estruturação do empreendimento com foco no mercado corporativo.",
      architecture: "Projeto contemporâneo com fachada envidraçada e soluções de eficiência energética.",
      incorporation: "Estruturação de SPE e governança com investidores.",
      construction: "Planejamento de obra com foco em qualidade e certificações.",
    },
    createdAt: "2024-01-15",
  },
  {
    id: "proj-3",
    slug: "residencial-mirante-do-vale",
    title: "Residencial Mirante do Vale",
    location: "São Gonçalo — Centro",
    description:
      "Residencial de médio e alto padrão com foco em eficiência de planta e valorização patrimonial. Planta eficiente, controle de custos e gestão por ERP.",
    longDescription:
      "O Residencial Mirante do Vale foi concebido para maximizar a eficiência de planta e a valorização patrimonial em uma das regiões de maior crescimento de São Gonçalo. O projeto integra soluções construtivas modernas com gestão por ERP para controle rigoroso de custos e prazos.",
    techniques: ["Planta eficiente", "Controle de custos", "Gestão por ERP"],
    images: [
      "https://cdn.abacus.ai/images/6ad4be35-f622-4df6-8549-234a0a4c1f14.png",
    ],
    coverIndex: 0,
    status: "em-obras",
    type: "residencial",
    featured: true,
    typology: "Apartamentos de 2 quartos",
    builtArea: "6.200 m²",
    units: "72 unidades",
    actuation: {
      planning: "Estruturação de cronograma, orçamento e gestão de riscos com PMO dedicado.",
      architecture: "Projeto com foco em eficiência de planta, ventilação natural e aproveitamento de iluminação.",
      incorporation: "Registro de incorporação e estruturação de financiamento junto a agentes bancários.",
      construction: "Execução com controle de custos por ERP e foco em QSMS.",
    },
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

const DEFAULT_CONTACT: ContactInfo = {
  email: "contato@novahabitar.com",
  phone: "+55 21 99999-0000",
  whatsapp: "+5521999990000",
  address: "São Gonçalo, RJ — Brasil",
  instagram: "https://instagram.com/novahabitar",
  linkedin: "https://linkedin.com/company/novahabitar",
};

// ── Storage helpers ────────────────────────────────────────────────────────

const PROJECTS_KEY = "nh_projects_v2";
const TIMELINE_KEY = "nh_timeline_v2";
const CONTACT_KEY = "nh_contact";

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

function loadContact(): ContactInfo {
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    if (raw) return JSON.parse(raw) as ContactInfo;
  } catch {}
  return DEFAULT_CONTACT;
}

function saveContact(info: ContactInfo): void {
  localStorage.setItem(CONTACT_KEY, JSON.stringify(info));
}

// ── Public API ─────────────────────────────────────────────────────────────

export const projectStore = {
  getAll: (): Project[] => loadProjects(),
  getFeatured: (): Project[] => loadProjects().filter((p) => p.featured),
  getById: (id: string): Project | undefined => loadProjects().find((p) => p.id === id),
  getBySlug: (slug: string): Project | undefined => loadProjects().find((p) => p.slug === slug),
  save: (project: Project): void => {
    if (!project.slug) project.slug = slugify(project.title);
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

export const contactStore = {
  get: (): ContactInfo => loadContact(),
  save: (info: ContactInfo): void => saveContact(info),
  reset: (): void => saveContact(DEFAULT_CONTACT),
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateSlug(title: string): string {
  return slugify(title);
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

export const TYPE_LABELS: Record<ProjectType, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  "uso-misto": "Uso Misto",
};

export const TYPE_LABELS_EN: Record<ProjectType, string> = {
  residencial: "Residential",
  comercial: "Commercial",
  "uso-misto": "Mixed Use",
};
