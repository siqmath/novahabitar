/**
 * Nova Habitar - Incorporadora de Alto Padrão
 * Design: Luxury Real Estate - Dark Navy + Gold + Cream
 * Colors: Navy #0f1b2d, Gold #c6a667, Cream #f5f3ee
 * Typography: Playfair Display (headings) + Inter (body)
 * Layout: Full-width sections with asymmetric content blocks
 */

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  ClipboardList,
  Ruler,
  Briefcase,
  HardHat,
} from "lucide-react";

// Image URLs from the original site
const HERO_IMAGE = "https://cdn.abacus.ai/images/82408a85-1d28-4ae0-a10b-32c472db4848.png";
const PROJECT_1_IMAGE = "https://cdn.abacus.ai/images/539308e5-66ea-444f-8ad8-7a2a523b1955.png";
const PROJECT_2_IMAGE = "https://cdn.abacus.ai/images/980b9b7a-4b2b-4357-a8e8-09248f241036.png";
const PROJECT_3_IMAGE = "https://cdn.abacus.ai/images/6ad4be35-f622-4df6-8549-234a0a4c1f14.png";
const STRUCTURE_IMAGE = "https://cdn.abacus.ai/images/da52a73e-44a8-49f3-aa6d-63b77ac7812f.png";
const ABOUT_IMAGE = "https://cdn.abacus.ai/images/9ba8e268-af7b-49c3-901e-5ff1797d13fb.png";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-body" style={{ fontFamily: "'Inter', Arial, Helvetica, sans-serif" }}>
      {/* ===== HEADER / NAVBAR ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(15, 27, 45, 0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(198, 166, 103, 0.15)" : "none",
        }}
      >
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); scrollToSection("inicio"); }}
              className="flex items-center gap-2.5 text-white no-underline"
            >
              <div
                className="flex items-center justify-center w-8 h-8 border"
                style={{ borderColor: "#c6a667" }}
              >
                <Building2 size={16} style={{ color: "#c6a667" }} />
              </div>
              <div>
                <div className="font-semibold text-sm tracking-wide text-white leading-tight">
                  Nova Habitar
                </div>
                <div className="text-xs tracking-widest" style={{ color: "#c6a667", fontSize: "0.6rem" }}>
                  CONFIABILIDADE & REFINO
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "Início", id: "inicio" },
                { label: "Projetos", id: "projetos" },
                { label: "Estrutura", id: "estrutura" },
                { label: "Quem Somos", id: "quem-somos" },
                { label: "Contato", id: "contato" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                  className="text-sm font-medium transition-colors no-underline"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c6a667")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" style={{ backgroundColor: "rgba(15, 27, 45, 0.98)" }}>
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {[
                { label: "Início", id: "inicio" },
                { label: "Projetos", id: "projetos" },
                { label: "Estrutura", id: "estrutura" },
                { label: "Quem Somos", id: "quem-somos" },
                { label: "Contato", id: "contato" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                  className="text-sm font-medium py-2 border-b no-underline"
                  style={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center"
        style={{ minHeight: "100vh" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Edifício residencial de alto padrão"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(15, 27, 45, 0.88) 50%, rgba(15, 27, 45, 0.45) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-8 max-w-7xl pt-24 pb-16">
          <div className="max-w-2xl">
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Estrutura que transforma projetos em ativos imobiliários{" "}
              <span style={{ color: "#c6a667" }}>sólidos.</span>
            </h1>
            <p className="text-base md:text-lg mb-8" style={{ color: "rgba(246, 244, 239, 0.8)" }}>
              Integramos planejamento, arquitetura, incorporação e execução com rigor técnico e previsibilidade.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#projetos"
                onClick={(e) => { e.preventDefault(); scrollToSection("projetos"); }}
                className="nova-btn-gold no-underline"
                style={{
                  backgroundColor: "#c6a667",
                  color: "#0f1b2d",
                  fontWeight: 600,
                  padding: "0.75rem 1.75rem",
                  fontSize: "0.875rem",
                  letterSpacing: "0.025em",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Ver projetos
              </a>
              <a
                href="#contato"
                onClick={(e) => { e.preventDefault(); scrollToSection("contato"); }}
                className="no-underline"
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  fontWeight: 500,
                  padding: "0.75rem 1.75rem",
                  fontSize: "0.875rem",
                  letterSpacing: "0.025em",
                  transition: "all 0.2s ease",
                  border: "1px solid rgba(255,255,255,0.5)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Agendar conversa técnica
              </a>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: <Calendar size={14} />, text: "Desde 2012" },
                { icon: <MapPin size={14} />, text: "Sede em São Gonçalo (RJ)" },
                { icon: <Layers size={14} />, text: "Atuação integrada" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(246, 244, 239, 0.7)" }}
                >
                  <span style={{ color: "#c6a667" }}>{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="servicos" style={{ backgroundColor: "#f5f3ee" }} className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-14">
            <h2
              className="font-display text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0f1b2d" }}
            >
              Atuação integrada em todo o ciclo do empreendimento.
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(43, 47, 54, 0.7)" }}>
              Da análise inicial à entrega, um método único para reduzir risco e assegurar padrão de qualidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ClipboardList size={24} />,
                title: "Planejamento",
                desc: "Estruturação de cronogramas, riscos e governança, com suporte jurídico e PMO dedicado.",
              },
              {
                icon: <Ruler size={24} />,
                title: "Arquitetura",
                desc: "Diretrizes de alto padrão, compatibilização com normas e especificação eficiente de materiais.",
              },
              {
                icon: <Briefcase size={24} />,
                title: "Incorporação",
                desc: "Modelagem, stakeholders e conformidade para empreendimentos sólidos e bem estruturados.",
              },
              {
                icon: <HardHat size={24} />,
                title: "Construção",
                desc: "Execução com boas práticas de engenharia, controle de custos e foco em QSMS.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-sm"
                style={{
                  border: "1px solid rgba(232, 230, 225, 0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="mb-4 w-10 h-10 flex items-center justify-center"
                  style={{ color: "#c6a667" }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "#0f1b2d" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(43, 47, 54, 0.7)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section id="projetos" style={{ backgroundColor: "#f0ede6" }} className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-14">
            <h2
              className="font-display text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0f1b2d" }}
            >
              Projetos em destaque
            </h2>
            <p className="text-base" style={{ color: "rgba(43, 47, 54, 0.7)" }}>
              Alguns empreendimentos que refletem nosso padrão de entrega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                status: "Entregue",
                statusColor: "#166534",
                statusBg: "rgba(22, 101, 52, 0.15)",
                image: PROJECT_1_IMAGE,
                title: "Residencial Jardim das Acácias",
                location: "São Gonçalo - Alcântara",
                desc: "Empreendimento entregue com alto padrão de acabamento e localização privilegiada.",
              },
              {
                status: "Em desenvolvimento",
                statusColor: "#1e40af",
                statusBg: "rgba(30, 64, 175, 0.15)",
                image: PROJECT_2_IMAGE,
                title: "Edifício Corporativo Atlântico",
                location: "Niterói - Centro",
                desc: "Edifício comercial moderno com infraestrutura completa para escritórios corporativos.",
              },
              {
                status: "Em obras",
                statusColor: "#92400e",
                statusBg: "rgba(146, 64, 14, 0.15)",
                image: PROJECT_3_IMAGE,
                title: "Residencial Mirante do Vale",
                location: "São Gonçalo - Centro",
                desc: "Residencial de alto padrão com foco em eficiência de planta e acabamento refinado.",
              },
            ].map((project, i) => (
              <div
                key={i}
                className="bg-white overflow-hidden rounded-sm"
                style={{
                  border: "1px solid rgba(232, 230, 225, 0.8)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div className="relative overflow-hidden" style={{ height: "220px" }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: "scale(1)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-sm"
                      style={{
                        color: project.statusColor,
                        backgroundColor: project.statusBg,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3
                    className="font-semibold text-base mb-1"
                    style={{ color: "#0f1b2d" }}
                  >
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin size={12} style={{ color: "#c6a667" }} />
                    <span className="text-xs" style={{ color: "rgba(43, 47, 54, 0.6)" }}>
                      {project.location}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(43, 47, 54, 0.7)" }}>
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="#projetos"
              className="no-underline flex items-center gap-2 font-medium text-sm px-6 py-3"
              style={{
                color: "#0f1b2d",
                border: "1px solid #0f1b2d",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0f1b2d";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#0f1b2d";
              }}
            >
              Ver todos os projetos <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ===== STRUCTURE SECTION ===== */}
      <section id="estrutura" style={{ backgroundColor: "#0f1b2d" }} className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2
                className="font-display text-3xl md:text-4xl font-bold text-white mb-6 leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Nossa estrutura como parceira do investidor e do incorporador.
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "rgba(246, 244, 239, 0.75)" }}>
                A Nova Habitar reúne experiência prática em incorporação, arquitetura e obra para conduzir empreendimentos com governança e previsibilidade. Atuamos com foco em conformidade, controle financeiro e padrão de acabamento, reduzindo assimetrias entre projeto, obra e entrega final.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  "Processos orientados por normas técnicas e código de obras.",
                  "Gestão de cronograma e custos com visão de risco.",
                  "Integração entre equipes técnicas e jurídicas.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#c6a667" }} />
                    <span className="text-sm" style={{ color: "rgba(246, 244, 239, 0.8)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#estrutura"
                className="no-underline flex items-center gap-2 font-semibold text-sm px-6 py-3 w-fit"
                style={{
                  backgroundColor: "#c6a667",
                  color: "#0f1b2d",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4b87a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c6a667")}
              >
                Conheça nossa estrutura <ArrowRight size={14} />
              </a>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={STRUCTURE_IMAGE}
                alt="Equipe analisando projetos"
                className="w-full object-cover rounded-sm"
                style={{ height: "400px" }}
              />
              <div
                className="absolute inset-0 rounded-sm"
                style={{ border: "1px solid rgba(198, 166, 103, 0.2)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="quem-somos" style={{ backgroundColor: "#ffffff" }} className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <img
                src={ABOUT_IMAGE}
                alt="Equipe Nova Habitar"
                className="w-full object-cover rounded-sm"
                style={{ height: "400px" }}
              />
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(22, 101, 52, 0.1)" }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#166534" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "#166534" }}>
                  Sobre Nós
                </span>
              </div>
              <h2
                className="font-display text-3xl md:text-4xl font-bold mb-6 leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0f1b2d" }}
              >
                Quem está por trás da Nova Habitar.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(43, 47, 54, 0.75)" }}>
                Fundada em 2012, a Nova Habitar nasceu da união entre a prática de canteiro de obras e a visão estratégica de incorporação. A partir de São Gonçalo (RJ), desenvolvemos empreendimentos residenciais com foco em solidez, refino arquitetônico e padrão de entrega previsível.
              </p>
              <a
                href="#quem-somos"
                className="no-underline flex items-center gap-2 font-medium text-sm px-6 py-3 w-fit"
                style={{
                  color: "#0f1b2d",
                  border: "1px solid #0f1b2d",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0f1b2d";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#0f1b2d";
                }}
              >
                Ver história completa <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section id="contato" style={{ backgroundColor: "#c6a667" }} className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl text-center">
          <h2
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0f1b2d" }}
          >
            Vamos falar sobre o seu próximo empreendimento?
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(15, 27, 45, 0.75)" }}>
            Apresentamos cenários, riscos e possibilidades com base técnica e visão de mercado.
          </p>
          <a
            href="mailto:contato@novahabitar.com"
            className="no-underline inline-flex items-center gap-2 font-semibold text-sm px-8 py-4"
            style={{
              backgroundColor: "#0f1b2d",
              color: "#ffffff",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a2d45")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0f1b2d")}
          >
            Agendar conversa técnica
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ backgroundColor: "#0f1b2d" }} className="py-14">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="flex items-center justify-center w-8 h-8 border"
                  style={{ borderColor: "#c6a667" }}
                >
                  <Building2 size={16} style={{ color: "#c6a667" }} />
                </div>
                <div>
                  <div className="font-semibold text-sm tracking-wide text-white leading-tight">
                    Nova Habitar
                  </div>
                  <div className="text-xs tracking-widest" style={{ color: "#c6a667", fontSize: "0.6rem" }}>
                    CONFIABILIDADE & REFINO
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(246, 244, 239, 0.6)" }}>
                Incorporadora de alto padrão integrando planejamento, arquitetura, incorporação e execução desde 2012.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">
                Navegação
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Projetos", id: "projetos" },
                  { label: "Estrutura", id: "estrutura" },
                  { label: "Quem Somos", id: "quem-somos" },
                  { label: "Contato", id: "contato" },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                      className="text-sm no-underline transition-colors"
                      style={{ color: "rgba(246, 244, 239, 0.6)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#c6a667")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(246, 244, 239, 0.6)")}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">
                Contato
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} style={{ color: "#c6a667" }} />
                  <span className="text-sm" style={{ color: "rgba(246, 244, 239, 0.6)" }}>
                    São Gonçalo, Rio de Janeiro
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={14} style={{ color: "#c6a667" }} />
                  <a
                    href="mailto:contato@novahabitar.com"
                    className="text-sm no-underline"
                    style={{ color: "rgba(246, 244, 239, 0.6)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c6a667")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(246, 244, 239, 0.6)")}
                  >
                    contato@novahabitar.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="pt-8 text-center text-sm"
            style={{
              borderTop: "1px solid rgba(246, 244, 239, 0.1)",
              color: "rgba(246, 244, 239, 0.4)",
            }}
          >
            © 2026 Nova Habitar. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
