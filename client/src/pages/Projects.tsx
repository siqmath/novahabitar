import { useState, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { projectApi, type Project } from "@/lib/apiClient";
import { STATUS_LABELS, STATUS_LABELS_EN, TYPE_LABELS, TYPE_LABELS_EN, type ProjectStatus } from "@/lib/store";
import { useLang } from "@/contexts/LangContext";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";

const GOLD = "#C6A667";
const NAVY = "#0F1B2D";

const STATUS_COLORS: Record<ProjectStatus, string> = {
  entregue: "#4B7A5A",
  "em-obras": "#D97706",
  "em-desenvolvimento": "#C6A667",
  previsto: "#6B7280",
};

export default function Projects() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>("all");

  useEffect(() => {
    projectApi.getAll().then(setProjects).catch(console.error);
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
      const matchType = typeFilter.length === 0 || typeFilter.includes(p.type);
      return matchSearch && matchStatus && matchLocation && matchType;
    });
  }, [projects, search, statusFilter, typeFilter, locationFilter]);

  const statuses: (ProjectStatus | "all")[] = ["all", "previsto", "em-desenvolvimento", "em-obras", "entregue"];

  const statusLabel = (s: ProjectStatus | "all") => {
    if (s === "all") return lang === "en" ? "All projects" : "Todos os projetos";
    return lang === "en" ? STATUS_LABELS_EN[s] : STATUS_LABELS[s];
  };

  const types = [
    { value: "residencial", labelPt: "Residencial", labelEn: "Residential" },
    { value: "comercial", labelPt: "Comercial", labelEn: "Commercial" },
    { value: "uso-misto", labelPt: "Uso Misto", labelEn: "Mixed Use" },
  ];

  const toggleType = (value: string) => {
    setTypeFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F3EE" }}>
      <Sidebar />
      <main style={{ marginLeft: "56px", flex: 1 }}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <header
          style={{
            backgroundColor: NAVY,
            padding: "6rem 0 4rem",
          }}
        >
          <div className="container mx-auto px-6">
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
                color: "rgba(245,243,238,0.5)",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.5)")}
            >
              <ChevronLeft size={14} />
              {lang === "en" ? "Home" : "Início"}
            </button>
            <div className="nh-tag" style={{ marginBottom: "1rem" }}>{lang === "en" ? "Portfolio" : "Portfólio"}</div>
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "0.02em",
                color: "#F5F3EE",
                marginBottom: "1rem",
              }}
            >
              {lang === "en" ? "Our projects." : "Nossos projetos."}
            </h1>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "1rem",
                color: "rgba(245,243,238,0.6)",
                maxWidth: "600px",
                lineHeight: 1.7
              }}
            >
              {lang === "en"
                ? "Developments that reflect our standard of excellence and predictable delivery."
                : "Empreendimentos que refletem nosso padrão de excelência e entrega previsível."}
            </p>
          </div>
        </header>

        {/* ── FILTERS ─────────────────────────────────────────────────── */}
        <div
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #E8E6E1",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div className="container mx-auto px-6" style={{ padding: "1.25rem 0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                  }}
                >
                  <option value="all">{lang === "en" ? "All locations" : "Todas as localidades"}</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
                  style={{
                    padding: "0.6rem 1rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.8rem",
                    border: "1px solid #D8D6D1",
                    backgroundColor: "#F5F3EE",
                    color: NAVY,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </div>

              {/* Type filter tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" }}>
                  {lang === "en" ? "Filter by type:" : "Filtrar por tipo:"}
                </span>
                {types.map((tp) => (
                  <label
                    key={tp.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: typeFilter.includes(tp.value) ? NAVY : "rgba(15,27,45,0.4)",
                      cursor: "pointer",
                      transition: "color 0.15s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={typeFilter.includes(tp.value)}
                      onChange={() => toggleType(tp.value)}
                      style={{ accentColor: GOLD }}
                    />
                    {lang === "en" ? tp.labelEn : tp.labelPt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PROJECTS GRID ───────────────────────────────────────────── */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container mx-auto px-6">
            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "6rem 0",
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#888",
                }}
              >
                {lang === "en" ? "No projects found matching these filters." : "Nenhum projeto encontrado com estes filtros."}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "2.5rem",
                }}
              >
                {filtered.map((project, i) => {
                  const cover = project.images[project.mainImageIndex]?.url || project.images[0]?.url || "";
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      onClick={() => navigate(`/${lang}/projetos/${project.slug}`)}
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #E8E6E1",
                        cursor: "pointer",
                        overflow: "hidden",
                        transition: "box-shadow 0.3s ease, transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 15px 35px rgba(15,27,45,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Thumbnail section */}
                      <div style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                        {cover ? (
                          <img
                            src={cover}
                            alt={project.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(15,27,45,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Building2 size={32} style={{ color: "rgba(15,27,45,0.1)" }} />
                          </div>
                        )}
                        {/* Status badge in card */}
                        <div style={{
                          position: "absolute",
                          top: "1rem",
                          left: "1rem",
                          backgroundColor: "rgba(15,27,45,0.85)",
                          backdropFilter: "blur(4px)",
                          color: "#F5F3EE",
                          padding: "0.3rem 0.75rem",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          borderLeft: `3px solid ${GOLD}`
                        }}>
                          {lang === "en" ? STATUS_LABELS_EN[project.status] : STATUS_LABELS[project.status]}
                        </div>
                      </div>

                      {/* Content section */}
                      <div style={{ padding: "1.5rem" }}>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: "0.5rem" }}>
                          {lang === "en" ? TYPE_LABELS_EN[project.type] : TYPE_LABELS[project.type]} — {project.location}
                        </p>
                        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: NAVY, marginBottom: "0.75rem", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                          {project.title}
                        </h2>
                        <p style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.85rem",
                          color: "rgba(15,27,45,0.6)",
                          lineHeight: 1.6,
                          marginBottom: "1.5rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}>
                          {(lang === "en" ? (project.descriptionEn || project.description) : project.description)}
                        </p>

                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: GOLD
                        }}>
                          {lang === "en" ? "Explore project" : "Explorar projeto"} <ArrowRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
