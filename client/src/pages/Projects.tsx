/**
 * Nova Habitar — Página de Portfólio (/projetos)
 * Filtros: status (Todos / Previsto / Em desenvolvimento / Em obras / Entregue)
 * Filtro por localidade (select box)
 * Pesquisa por título/descrição
 * Cards com imagem de capa, status badge, localidade
 * Modal de detalhe ao clicar no card
 */

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectStore, STATUS_LABELS, STATUS_LABELS_EN, type Project, type ProjectStatus } from "@/lib/store";
import { useLang } from "@/contexts/LangContext";
import { useLocation } from "wouter";

const GOLD = "#C6A667";
const NAVY = "#0F1B2D";

const STATUS_COLORS: Record<ProjectStatus, { bg: string; color: string; border: string }> = {
  entregue: { bg: "rgba(198,166,103,0.12)", color: GOLD, border: "rgba(198,166,103,0.3)" },
  "em-obras": { bg: "rgba(43,47,54,0.1)", color: "#2B2F36", border: "rgba(43,47,54,0.2)" },
  "em-desenvolvimento": { bg: "rgba(15,27,45,0.08)", color: NAVY, border: "rgba(15,27,45,0.2)" },
  previsto: { bg: "rgba(216,214,209,0.4)", color: "#555", border: "rgba(216,214,209,0.6)" },
};

export default function Projects() {
  const { lang, t } = useLang();
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setProjects(projectStore.getAll());
  }, []);

  // Unique locations
  const locations = useMemo(() => {
    const locs = Array.from(new Set(projects.map((p) => p.location)));
    return locs.sort();
  }, [projects]);

  // Filtered projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchLocation = locationFilter === "all" || p.location === locationFilter;
      return matchSearch && matchStatus && matchLocation;
    });
  }, [projects, search, statusFilter, locationFilter]);

  const statuses: (ProjectStatus | "all")[] = ["all", "previsto", "em-desenvolvimento", "em-obras", "entregue"];

  const statusLabel = (s: ProjectStatus | "all") => {
    if (s === "all") return lang === "en" ? "All projects" : "Todos os projetos";
    return lang === "en" ? STATUS_LABELS_EN[s] : STATUS_LABELS[s];
  };

  const openProject = (p: Project) => {
    setSelectedProject(p);
    setImageIndex(p.coverIndex);
  };

  const closeProject = () => setSelectedProject(null);

  return (
    <div style={{ backgroundColor: "#F5F3EE", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: NAVY,
          padding: "6rem 0 3rem",
        }}
      >
        <div className="container mx-auto">
          <button
            onClick={() => navigate(`/${lang}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "rgba(198,166,103,0.7)",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            <ChevronLeft size={14} />
            {lang === "en" ? "Back" : "Voltar"}
          </button>
          <div className="nh-tag">{lang === "en" ? "Portfolio" : "Portfólio"}</div>
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "0.03em",
              color: "#F5F3EE",
              marginBottom: "0.5rem",
            }}
          >
            {lang === "en" ? "Our projects." : "Nossos projetos."}
          </h1>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "0.9rem",
              color: "rgba(245,243,238,0.55)",
            }}
          >
            {lang === "en"
              ? "Developments that reflect our standard of predictable delivery."
              : "Empreendimentos que refletem nosso padrão de entrega previsível."}
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #E8E6E1",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="container mx-auto" style={{ padding: "1rem 0" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <div
              style={{
                position: "relative",
                flex: "1 1 220px",
                minWidth: "180px",
              }}
            >
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#888",
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "en" ? "Search projects..." : "Buscar projetos..."}
                style={{
                  width: "100%",
                  paddingLeft: "2.25rem",
                  paddingRight: "0.75rem",
                  paddingTop: "0.6rem",
                  paddingBottom: "0.6rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.8rem",
                  border: "1px solid #D8D6D1",
                  backgroundColor: "#F5F3EE",
                  color: NAVY,
                  outline: "none",
                }}
              />
            </div>

            {/* Location select */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{
                padding: "0.6rem 1rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.8rem",
                border: "1px solid #D8D6D1",
                backgroundColor: "#F5F3EE",
                color: NAVY,
                cursor: "pointer",
                outline: "none",
                flex: "0 0 auto",
              }}
            >
              <option value="all">{lang === "en" ? "All locations" : "Todas as localidades"}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Status filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    border: `1px solid ${statusFilter === s ? GOLD : "#D8D6D1"}`,
                    backgroundColor: statusFilter === s ? GOLD : "transparent",
                    color: statusFilter === s ? NAVY : "#2B2F36",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {statusLabel(s)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="container mx-auto" style={{ padding: "3rem 0" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
              fontFamily: "'Montserrat', sans-serif",
              color: "#888",
              fontSize: "0.9rem",
            }}
          >
            {lang === "en" ? "No projects found." : "Nenhum projeto encontrado."}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filtered.map((project, i) => {
              const sc = STATUS_COLORS[project.status];
              const cover = project.images[project.coverIndex] || project.images[0] || "";
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => openProject(project)}
                  style={{
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    overflow: "hidden",
                    border: "1px solid #E8E6E1",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(15,27,45,0.1)" }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                    {cover ? (
                      <img
                        src={cover}
                        alt={project.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#E8E6E1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#888", fontSize: "0.8rem" }}>Sem imagem</span>
                      </div>
                    )}
                    {/* Status badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        backgroundColor: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.border}`,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "0.25rem 0.6rem",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {lang === "en" ? STATUS_LABELS_EN[project.status] : STATUS_LABELS[project.status]}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.25rem" }}>
                    <h3
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        letterSpacing: "0.02em",
                        color: NAVY,
                        marginBottom: "0.35rem",
                      }}
                    >
                      {project.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.75rem",
                        color: GOLD,
                        marginBottom: "0.75rem",
                      }}
                    >
                      <MapPin size={11} />
                      {project.location}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.8rem",
                        lineHeight: 1.65,
                        color: "#2B2F36",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {project.description}
                    </p>
                    {project.techniques.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.75rem" }}>
                        {project.techniques.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: "0.6rem",
                              fontWeight: 600,
                              letterSpacing: "0.07em",
                              textTransform: "uppercase",
                              color: "#888",
                              border: "1px solid #D8D6D1",
                              padding: "0.2rem 0.5rem",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15,27,45,0.85)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={closeProject}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                maxWidth: "800px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Image gallery */}
              <div style={{ position: "relative", height: "320px", backgroundColor: "#E8E6E1" }}>
                {selectedProject.images.length > 0 ? (
                  <img
                    src={selectedProject.images[imageIndex]}
                    alt={selectedProject.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#888" }}>Sem imagem</span>
                  </div>
                )}
                {/* Gallery nav */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImageIndex((i) => (i - 1 + selectedProject.images.length) % selectedProject.images.length)}
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(15,27,45,0.7)",
                        border: "none",
                        color: "#F5F3EE",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setImageIndex((i) => (i + 1) % selectedProject.images.length)}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(15,27,45,0.7)",
                        border: "none",
                        color: "#F5F3EE",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                    {/* Dots */}
                    <div style={{ position: "absolute", bottom: "0.75rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.4rem" }}>
                      {selectedProject.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImageIndex(i)}
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: i === imageIndex ? GOLD : "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* Close */}
                <button
                  onClick={closeProject}
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    backgroundColor: "rgba(15,27,45,0.7)",
                    border: "none",
                    color: "#F5F3EE",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>
                {/* Status badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                    backgroundColor: STATUS_COLORS[selectedProject.status].bg,
                    color: STATUS_COLORS[selectedProject.status].color,
                    border: `1px solid ${STATUS_COLORS[selectedProject.status].border}`,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.25rem 0.6rem",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {lang === "en" ? STATUS_LABELS_EN[selectedProject.status] : STATUS_LABELS[selectedProject.status]}
                </div>
              </div>

              {/* Detail content */}
              <div style={{ padding: "2rem" }}>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    letterSpacing: "0.03em",
                    color: NAVY,
                    marginBottom: "0.5rem",
                  }}
                >
                  {selectedProject.title}
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.8rem",
                    color: GOLD,
                    marginBottom: "1.25rem",
                  }}
                >
                  <MapPin size={13} />
                  {selectedProject.location}
                </div>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.75,
                    color: "#2B2F36",
                    marginBottom: "1.5rem",
                  }}
                >
                  {selectedProject.description}
                </p>
                {selectedProject.techniques.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#888",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {lang === "en" ? "Techniques" : "Técnicas utilizadas"}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {selectedProject.techniques.map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: NAVY,
                            border: `1px solid ${GOLD}`,
                            padding: "0.3rem 0.7rem",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
