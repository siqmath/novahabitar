/**
 * Nova Habitar — i18n translations
 * PT (default) and EN
 */

export type Lang = "pt" | "en";

export const translations = {
  pt: {
    // NAV
    nav: {
      home: "Início",
      projects: "Portfólio",
      actuation: "Atuação",
      differentials: "Diferenciais",
      governance: "Governança",
      sustainability: "Sustentabilidade",
      about: "Quem Somos",
      contact: "Contato",
    },
    langSwitch: "EN",

    // HERO
    hero: {
      prefix: "Consultoria para transformar",
      prefix2: "projetos em ativos imobiliários",
      words: ["sólidos", "previsíveis", "lucrativos"],
      subtitle:
        "Integramos planejamento, arquitetura, incorporação e execução com rigor técnico e governança em cada etapa do empreendimento.",
      cta1: "Ver portfólio",
      cta2: "Agendar conversa técnica",
      badge1: "Desde 2012",
      badge2: "São Gonçalo, RJ",
      badge3: "Atuação integrada",
    },

    // ACTUATION
    actuation: {
      tag: "Atuação",
      title: "Ciclo completo do empreendimento.",
      subtitle:
        "Da análise inicial à entrega, um método estruturado para reduzir risco e assegurar conformidade em cada fase.",
      items: [
        {
          title: "Planejamento",
          desc: "Estruturação de cronogramas, riscos e governança, com suporte jurídico e PMO dedicado.",
        },
        {
          title: "Arquitetura",
          desc: "Diretrizes de alto padrão, compatibilização com normas e especificação eficiente de materiais.",
        },
        {
          title: "Incorporação",
          desc: "Modelagem, stakeholders e conformidade para empreendimentos sólidos e bem estruturados.",
        },
        {
          title: "Construção",
          desc: "Execução com boas práticas de engenharia, controle de custos e foco em QSMS.",
        },
        {
          title: "Pós-Ocupação",
          desc: "Acompanhamento técnico após entrega, avaliação de desempenho e suporte ao usuário final.",
        },
      ],
    },

    // PROJECTS
    projects: {
      tag: "Portfólio",
      title: "Projetos em destaque.",
      subtitle: "Empreendimentos que refletem nosso padrão de entrega previsível.",
      viewAll: "Ver portfólio completo",
      statusLabels: {
        delivered: "Entregue",
        inDevelopment: "Em desenvolvimento",
        underConstruction: "Em obras",
      },
      items: [
        {
          status: "delivered",
          title: "Residencial Jardim das Acácias",
          location: "São Gonçalo — Alcântara",
          desc: "Empreendimento residencial entregue com alto padrão de acabamento e conformidade regulatória.",
          specs: ["Laje protendida", "Tratamento acústico", "Regularidade fundiária"],
        },
        {
          status: "inDevelopment",
          title: "Edifício Corporativo Atlântico",
          location: "Niterói — Centro",
          desc: "Edifício comercial de alto padrão com infraestrutura corporativa completa e gestão integrada.",
          specs: ["Eficiência energética", "Automação predial", "Certificação PBQP-H"],
        },
        {
          status: "underConstruction",
          title: "Residencial Mirante do Vale",
          location: "São Gonçalo — Centro",
          desc: "Residencial de médio e alto padrão com foco em eficiência de planta e valorização patrimonial.",
          specs: ["Planta eficiente", "Controle de custos", "Gestão por ERP"],
        },
      ],
    },

    // DIFFERENTIALS
    differentials: {
      tag: "Diferenciais",
      title: "Vantagens que reduzem risco e geram valor.",
      subtitle:
        "A Nova Habitar combina segurança jurídica, governança operacional e modelo inteligente de incorporação.",
      items: [
        {
          title: "Segurança Jurídica",
          desc: "Atenção rigorosa à regularidade fundiária, urbanística, ambiental e contratual em todos os empreendimentos.",
        },
        {
          title: "Modelo Inteligente de Incorporação",
          desc: "Parcerias estratégicas com participação nos empreendimentos, mitigando imobilização de capital e otimizando retorno.",
        },
        {
          title: "Eficiência Operacional",
          desc: "Gestão integrada por ERP abrangendo engenharia, jurídico, finanças, suprimentos, comercial e pós-ocupação.",
        },
        {
          title: "Conformidade e Compliance",
          desc: "Processos orientados por normas técnicas, código de obras e certificações PBQP-H, ISO 9001 e ISO 14001 em andamento.",
        },
      ],
    },

    // GOVERNANCE
    governance: {
      tag: "Governança",
      title: "Controle, previsibilidade e maturidade institucional.",
      subtitle:
        "Todos os processos são suportados por um Sistema de Gestão Integrado que garante rastreabilidade e redução de riscos.",
      items: [
        "Padronização de processos e segregação de funções",
        "Rastreabilidade completa das informações por projeto",
        "Controle físico-financeiro e orçamentação por empreendimento",
        "Gestão de riscos com planejamento e contingência estruturados",
        "Certificações em andamento: PBQP-H, ISO 9001, ISO 14001",
      ],
      cta: "Conheça nossa estrutura",
    },

    // SUSTAINABILITY
    sustainability: {
      tag: "Sustentabilidade",
      title: "ESG técnico: engenharia e urbanismo.",
      subtitle:
        "Sustentabilidade na Nova Habitar é engenharia aplicada — não marketing. Cada projeto é concebido para reduzir impacto e gerar valor de longo prazo.",
      items: [
        {
          title: "Eficiência Construtiva",
          desc: "Sistemas construtivos modernos e materiais de alto desempenho com menor impacto ambiental.",
        },
        {
          title: "Mobilidade Urbana",
          desc: "Projetos compatíveis com políticas de mobilidade sustentável e baixo impacto no entorno.",
        },
        {
          title: "Integração Urbana",
          desc: "Empreendimentos de uso misto que promovem qualidade de vida e reduzem deslocamentos.",
        },
        {
          title: "Valorização Patrimonial",
          desc: "Foco em localização estratégica, funcionalidade e valorização futura do patrimônio.",
        },
      ],
    },

    // ABOUT
    about: {
      tag: "Institucional",
      title: "A estrutura por trás da Nova Habitar.",
      body1:
        "A Incorporadora e Construtora Nova Habitar Ltda. (CNPJ 16.692.513/0001-40) é especializada no desenvolvimento, incorporação e construção de empreendimentos imobiliários de médio e alto padrão.",
      body2:
        "Sob a liderança de Robson Gonçalves (CEO), a empresa reúne mais de três gerações de experiência no setor, aliando conhecimento técnico consolidado, visão estratégica de longo prazo e ampla capacidade de articulação institucional.",
      mission: "Missão",
      missionText:
        "Desenvolver soluções imobiliárias que gerem valor sustentável, segurança patrimonial e qualidade de vida ao usuário.",
      vision: "Visão",
      visionText:
        "Ser referência em incorporação e desenvolvimento urbano sustentável no Brasil.",
      values: "Valores",
      valuesText: "Ética, responsabilidade técnica, inovação e sustentabilidade.",
      cta: "Ver história completa",
    },

    // CTA
    cta: {
      title: "Vamos estruturar o seu próximo investimento?",
      subtitle:
        "Apresentamos cenários, riscos e possibilidades com base técnica e visão de mercado. Sem promessas — apenas estrutura e método.",
      button: "Agendar conversa técnica",
    },

    // FOOTER
    footer: {
      description:
        "Incorporadora de alto padrão integrando planejamento, arquitetura, incorporação e execução desde 2012.",
      nav: "Navegação",
      contact: "Contato",
      rights: "Todos os direitos reservados.",
      tagline: "CONFIABILIDADE & REFINO",
    },
  },

  en: {
    nav: {
      home: "Home",
      projects: "Portfolio",
      actuation: "Services",
      differentials: "Differentials",
      governance: "Governance",
      sustainability: "Sustainability",
      about: "About Us",
      contact: "Contact",
    },
    langSwitch: "PT",

    hero: {
      prefix: "Consulting to transform projects",
      prefix2: "into real estate assets",
      words: ["solid", "predictable", "profitable"],
      subtitle:
        "We integrate planning, architecture, development and construction with technical rigor and governance at every stage of the project.",
      cta1: "View portfolio",
      cta2: "Schedule a meeting",
      badge1: "Since 2012",
      badge2: "São Gonçalo, RJ",
      badge3: "Integrated operations",
    },

    actuation: {
      tag: "Services",
      title: "Full project lifecycle.",
      subtitle:
        "From initial analysis to delivery, a structured method to reduce risk and ensure compliance at every phase.",
      items: [
        {
          title: "Planning",
          desc: "Schedule structuring, risk management and governance, with legal support and dedicated PMO.",
        },
        {
          title: "Architecture",
          desc: "High-standard guidelines, regulatory compliance and efficient material specification.",
        },
        {
          title: "Development",
          desc: "Modeling, stakeholder management and compliance for solid, well-structured projects.",
        },
        {
          title: "Construction",
          desc: "Execution with engineering best practices, cost control and QHSE focus.",
        },
        {
          title: "Post-Occupancy",
          desc: "Technical follow-up after delivery, performance evaluation and end-user support.",
        },
      ],
    },

    projects: {
      tag: "Portfolio",
      title: "Featured projects.",
      subtitle: "Developments that reflect our standard of predictable delivery.",
      viewAll: "View full portfolio",
      statusLabels: {
        delivered: "Delivered",
        inDevelopment: "In development",
        underConstruction: "Under construction",
      },
      items: [
        {
          status: "delivered",
          title: "Residencial Jardim das Acácias",
          location: "São Gonçalo — Alcântara",
          desc: "Residential development delivered with high finishing standards and full regulatory compliance.",
          specs: ["Post-tensioned slab", "Acoustic treatment", "Land regularization"],
        },
        {
          status: "inDevelopment",
          title: "Edifício Corporativo Atlântico",
          location: "Niterói — Centro",
          desc: "High-standard commercial building with complete corporate infrastructure and integrated management.",
          specs: ["Energy efficiency", "Building automation", "PBQP-H certification"],
        },
        {
          status: "underConstruction",
          title: "Residencial Mirante do Vale",
          location: "São Gonçalo — Centro",
          desc: "Mid-to-high-end residential development focused on efficient floor plans and asset appreciation.",
          specs: ["Efficient layout", "Cost control", "ERP management"],
        },
      ],
    },

    differentials: {
      tag: "Differentials",
      title: "Advantages that reduce risk and generate value.",
      subtitle:
        "Nova Habitar combines legal security, operational governance and an intelligent development model.",
      items: [
        {
          title: "Legal Security",
          desc: "Rigorous attention to land, urban, environmental and contractual regularity across all developments.",
        },
        {
          title: "Intelligent Development Model",
          desc: "Strategic partnerships with project participation, mitigating capital immobilization and optimizing returns.",
        },
        {
          title: "Operational Efficiency",
          desc: "Integrated ERP management covering engineering, legal, finance, procurement, commercial and post-occupancy.",
        },
        {
          title: "Compliance & Governance",
          desc: "Processes guided by technical standards and ongoing certifications: PBQP-H, ISO 9001 and ISO 14001.",
        },
      ],
    },

    governance: {
      tag: "Governance",
      title: "Control, predictability and institutional maturity.",
      subtitle:
        "All processes are supported by an Integrated Management System that ensures traceability and risk reduction.",
      items: [
        "Process standardization and segregation of duties",
        "Complete information traceability by project",
        "Physical-financial control and project-level budgeting",
        "Risk management with structured planning and contingency",
        "Ongoing certifications: PBQP-H, ISO 9001, ISO 14001",
      ],
      cta: "Learn about our structure",
    },

    sustainability: {
      tag: "Sustainability",
      title: "Technical ESG: engineering and urbanism.",
      subtitle:
        "Sustainability at Nova Habitar is applied engineering — not marketing. Every project is designed to reduce impact and generate long-term value.",
      items: [
        {
          title: "Constructive Efficiency",
          desc: "Modern construction systems and high-performance materials with lower environmental impact.",
        },
        {
          title: "Urban Mobility",
          desc: "Projects compatible with sustainable mobility policies and low impact on the surrounding area.",
        },
        {
          title: "Urban Integration",
          desc: "Mixed-use developments that promote quality of life and reduce commuting.",
        },
        {
          title: "Asset Appreciation",
          desc: "Focus on strategic location, functionality and future asset appreciation.",
        },
      ],
    },

    about: {
      tag: "Institutional",
      title: "The structure behind Nova Habitar.",
      body1:
        "Nova Habitar Incorporadora e Construtora Ltda. (CNPJ 16.692.513/0001-40) specializes in the development, incorporation and construction of mid-to-high-end real estate projects.",
      body2:
        "Under the leadership of CEO Robson Gonçalves, the company brings together over three generations of industry experience, combining consolidated technical knowledge, long-term strategic vision and broad institutional capacity.",
      mission: "Mission",
      missionText:
        "To develop real estate solutions that generate sustainable value, asset security and quality of life for users.",
      vision: "Vision",
      visionText:
        "To be a reference in real estate development and sustainable urban development in Brazil.",
      values: "Values",
      valuesText: "Ethics, technical responsibility, innovation and sustainability.",
      cta: "View full history",
    },

    cta: {
      title: "Let's structure your next development?",
      subtitle:
        "We present scenarios, risks and possibilities grounded in technical analysis and market insight. No promises — only structure and method.",
      button: "Schedule a technical meeting",
    },

    footer: {
      description:
        "Premium real estate developer integrating planning, architecture, development and construction since 2012.",
      nav: "Navigation",
      contact: "Contact",
      rights: "All rights reserved.",
      tagline: "RELIABILITY & REFINEMENT",
    },
  },
} as const;

// Use a loose type so both PT and EN are assignable
export type Translations = {
  nav: { home: string; projects: string; actuation: string; differentials: string; governance: string; sustainability: string; about: string; contact: string };
  langSwitch: string;
  hero: { prefix: string; prefix2: string; words: readonly string[]; subtitle: string; cta1: string; cta2: string; badge1: string; badge2: string; badge3: string };
  actuation: { tag: string; title: string; subtitle: string; items: readonly { title: string; desc: string }[] };
  projects: { tag: string; title: string; subtitle: string; viewAll: string; statusLabels: { delivered: string; inDevelopment: string; underConstruction: string }; items: readonly { status: string; title: string; location: string; desc: string; specs: readonly string[] }[] };
  differentials: { tag: string; title: string; subtitle: string; items: readonly { title: string; desc: string }[] };
  governance: { tag: string; title: string; subtitle: string; items: readonly string[]; cta: string };
  sustainability: { tag: string; title: string; subtitle: string; items: readonly { title: string; desc: string }[] };
  about: { tag: string; title: string; body1: string; body2: string; mission: string; missionText: string; vision: string; visionText: string; values: string; valuesText: string; cta: string };
  cta: { title: string; subtitle: string; button: string };
  footer: { description: string; nav: string; contact: string; rights: string; tagline: string };
};
