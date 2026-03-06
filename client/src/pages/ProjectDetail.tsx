/**
 * Nova Habitar — Project Detail Page (/pt/projetos/:slug | /en/projetos/:slug)
 * Fields: gallery, status, type, typology, builtArea, units, actuation (planning/architecture/incorporation/construction)
 * Design: Navy/Gold/Off-White, Montserrat, micro-interactions
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Building2, Layers, Ruler, Hash,
  ChevronLeft, ChevronRight, X, ExternalLink, CheckCircle2
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { projectStore, STATUS_LABELS, STATUS_LABELS_EN, TYPE_LABELS, TYPE_LABELS_EN, type Project } from "@/lib/store";
import { useLocation, useParams } from "wouter";
import Sidebar from "@/components/Sidebar";

const LOGO_SOLO =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/QbamnFCNndHCmpVS.png?Expires=1804180331&Signature=czJHa~GxkfsgzV32dORWqWegMJlzEx5sIywT3WOyXwumjYFQZhCpWhXvKZ1PUnWhcXGSRUd1OEoXuOqNnwcK85Ep11xPktDS2YJp10KGNbB7PkstpJCNbcYfnm7onQuHhkjx843VR1hAWq~OsXNJF5Jxl4Y-NAUTF5HFYREOjqKjUJ9BqJpRZFz~c1W6cavTg5NOR050QVLLX2WptMNnvwivbsXC9e2j-woAlOl75oZcSZlhQ~8sbzFvTpydTKWyUeZEjZqnVEO2QKA4KOopX3cP15TchNXRU6ylJpM1jRXHqAGceRpGonOPGLKY-7i5xD-WGM-4FpeKWv3I0sgvdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const STATUS_COLORS: Record<string, string> = {
  previsto: "#6B7280",
  "em-desenvolvimento": "#C6A667",
  "em-obras": "#D97706",
  entregue: "#4B7A5A",
};

export default function ProjectDetail() {
  const { t, lang } = useLang();
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const p = projectStore.getBySlug(params.slug);
    if (p) {
      setProject(p);
      setActiveImage(p.coverIndex ?? 0);
    }
  }, [params.slug]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0F1B2D" }}>
        <Sidebar />
        <div style={{ marginLeft: "56px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(245,243,238,0.5)", fontSize: "1rem" }}>
            {lang === "en" ? "Project not found." : "Projeto não encontrado."}
          </p>
          <button
            onClick={() => navigate(`/${lang}/projetos`)}
            style={{
              marginTop: "1rem",
              color: "#C6A667",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            ← {lang === "en" ? "Back to portfolio" : "Voltar ao portfólio"}
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = lang === "en" ? STATUS_LABELS_EN[project.status] : STATUS_LABELS[project.status];
  const typeLabel = lang === "en" ? TYPE_LABELS_EN[project.type] : TYPE_LABELS[project.type];
  const statusColor = STATUS_COLORS[project.status] ?? "#C6A667";

  const actuationSteps = [
    {
      key: "planning",
      label: lang === "en" ? "Planning" : "Planejamento",
      value: project.actuation?.planning,
    },
    {
      key: "architecture",
      label: lang === "en" ? "Architecture" : "Arquitetura",
      value: project.actuation?.architecture,
    },
    {
      key: "incorporation",
      label: lang === "en" ? "Incorporation" : "Incorporação",
      value: project.actuation?.incorporation,
    },
    {
      key: "construction",
      label: lang === "en" ? "Construction" : "Construção",
      value: project.actuation?.construction,
    },
  ].filter((s) => s.value);

  const images = project.images.filter(Boolean);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0F1B2D" }}>
      <Sidebar />

      <main style={{ marginLeft: "56px", flex: 1 }}>
        {/* Back button */}
        <div
          style={{
            padding: "1.5rem 2.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <button
            onClick={() => navigate(`/${lang}/projetos`)}
            className="flex items-center gap-2 transition-colors"
            style={{
              color: "rgba(245,243,238,0.45)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.45)")}
          >
            <ArrowLeft size={13} />
            {lang === "en" ? "Portfolio" : "Portfólio"}
          </button>
          <span style={{ color: "rgba(198,166,103,0.3)", fontSize: "0.7rem" }}>/</span>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "rgba(245,243,238,0.35)",
              letterSpacing: "0.05em",
            }}
          >
            {project.title}
          </span>
        </div>

        <div className="px-10 py-8 max-w-6xl">
          {/* Hero: gallery + title */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
            {/* Gallery */}
            <div>
              {/* Main image */}
              <div
                className="relative overflow-hidden mb-3"
                style={{
                  height: "360px",
                  border: "1px solid rgba(198,166,103,0.15)",
                  cursor: images.length > 0 ? "zoom-in" : "default",
                }}
                onClick={() => images.length > 0 && setLightboxIndex(activeImage)}
              >
                {images.length > 0 ? (
                  /\.(mp4|webm|mov|ogg)(\?|$)/i.test(images[activeImage]) ? (
                    <video
                      src={images[activeImage]}
                      controls
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                  <img
                    src={images[activeImage]}
                    alt={project.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  )
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(245,243,238,0.03)",
                    }}
                  >
                    <Building2 size={48} style={{ color: "rgba(198,166,103,0.2)" }} />
                  </div>
                )}
                {/* Gold corner accents */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "1.5rem", height: "2px", backgroundColor: "#C6A667" }} />
                <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "1.5rem", backgroundColor: "#C6A667" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: "1.5rem", height: "2px", backgroundColor: "#C6A667" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: "2px", height: "1.5rem", backgroundColor: "#C6A667" }} />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{
                        flexShrink: 0,
                        width: "64px",
                        height: "48px",
                        overflow: "hidden",
                        border: `1.5px solid ${i === activeImage ? "#C6A667" : "rgba(198,166,103,0.15)"}`,
                        padding: 0,
                        background: "none",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      {/\.(mp4|webm|mov|ogg)(\?|$)/i.test(img) ? (
                        <video src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                      ) : (
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + meta */}
            <div className="flex flex-col justify-start pt-2">
              {/* Status + Type badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: statusColor,
                    border: `1px solid ${statusColor}`,
                    padding: "0.25rem 0.65rem",
                  }}
                >
                  {statusLabel}
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(198,166,103,0.7)",
                    border: "1px solid rgba(198,166,103,0.25)",
                    padding: "0.25rem 0.65rem",
                  }}
                >
                  {typeLabel}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  color: "#F5F3EE",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  marginBottom: "0.75rem",
                }}
              >
                {project.title}
              </h1>

              <div className="flex items-center gap-2 mb-5">
                <MapPin size={13} style={{ color: "#C6A667", flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "rgba(245,243,238,0.55)",
                  }}
                >
                  {project.location}
                </span>
              </div>

              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "rgba(245,243,238,0.65)",
                  marginBottom: "1.5rem",
                }}
              >
                {project.shortDescription || project.description}
              </p>

              {/* Technical data grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1px",
                  border: "1px solid rgba(198,166,103,0.15)",
                  backgroundColor: "rgba(198,166,103,0.15)",
                }}
              >
                {[
                  { label: lang === "en" ? "Typology" : "Tipologia", value: project.typology, icon: <Building2 size={13} /> },
                  { label: lang === "en" ? "Built Area" : "Área construída", value: project.builtArea, icon: <Ruler size={13} /> },
                  { label: lang === "en" ? "Units" : "Unidades", value: project.units, icon: <Hash size={13} /> },
                  { label: lang === "en" ? "Location" : "Localidade", value: project.location, icon: <MapPin size={13} /> },
                ].filter(d => d.value).map((data, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#0F1B2D",
                      padding: "0.85rem 1rem",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span style={{ color: "#C6A667" }}>{data.icon}</span>
                      <p
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "rgba(245,243,238,0.35)",
                        }}
                      >
                        {data.label}
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#F5F3EE",
                      }}
                    >
                      {data.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actuation section */}
          {actuationSteps.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: "2rem", height: "1px", backgroundColor: "#C6A667" }} />
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#C6A667",
                  }}
                >
                  {lang === "en" ? "Our Actuation" : "Nossa Atuação"}
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1px",
                  backgroundColor: "rgba(198,166,103,0.1)",
                  border: "1px solid rgba(198,166,103,0.1)",
                }}
              >
                {actuationSteps.map((step, i) => (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{
                      backgroundColor: "#0F1B2D",
                      padding: "1.5rem",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        backgroundColor: "rgba(198,166,103,0.25)",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#C6A667",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} — {step.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 300,
                        lineHeight: 1.65,
                        color: "rgba(245,243,238,0.6)",
                      }}
                    >
                      {step.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Sobre o projeto */}
          {(project.aboutText || project.description) && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ width: "2rem", height: "1px", backgroundColor: "#C6A667" }} />
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#C6A667",
                  }}
                >
                  {lang === "en" ? "About the project" : "Sobre o projeto"}
                </h2>
              </div>
              {(project.aboutText || project.description).split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: "rgba(245,243,238,0.65)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Diferenciais */}
          {project.differentials && project.differentials.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ width: "2rem", height: "1px", backgroundColor: "#C6A667" }} />
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#C6A667",
                  }}
                >
                  {lang === "en" ? "Highlights" : "Diferenciais"}
                </h2>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {project.differentials.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.6rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: 300,
                      color: "rgba(245,243,238,0.65)",
                      lineHeight: 1.55,
                    }}
                  >
                    <CheckCircle2 size={15} style={{ color: "#C6A667", flexShrink: 0, marginTop: "2px" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Techniques tags */}
          {project.techniques.length > 0 && (
            <div className="mb-14">
              <div className="flex flex-wrap gap-2">
                {project.techniques.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(198,166,103,0.8)",
                      border: "1px solid rgba(198,166,103,0.2)",
                      padding: "0.35rem 0.75rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div
            style={{
              borderTop: "1px solid rgba(198,166,103,0.12)",
              paddingTop: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 300,
                color: "rgba(245,243,238,0.5)",
              }}
            >
              {lang === "en"
                ? "Interested in this project or similar developments?"
                : "Interesse neste projeto ou empreendimentos similares?"}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/${lang}/contato`)}
              style={{
                backgroundColor: "#C6A667",
                color: "#0F1B2D",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.8rem 1.75rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              {lang === "en" ? "Get in touch" : "Entrar em contato"}
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(198,166,103,0.1)",
            padding: "2rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <img
            src={LOGO_SOLO}
            alt="Nova Habitar"
            style={{ height: "28px", width: "auto", objectFit: "contain", opacity: 0.6, cursor: "pointer" }}
            onClick={() => navigate(`/${lang}`)}
          />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 400,
              color: "rgba(245,243,238,0.25)",
            }}
          >
            © {new Date().getFullYear()} Nova Habitar
          </p>
        </footer>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              backgroundColor: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "none",
                border: "none",
                color: "#F5F3EE",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                style={{
                  position: "absolute",
                  left: "1.5rem",
                  background: "rgba(15,27,45,0.7)",
                  border: "1px solid rgba(198,166,103,0.3)",
                  color: "#F5F3EE",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                }}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={images[lightboxIndex]}
              alt=""
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {lightboxIndex < images.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                style={{
                  position: "absolute",
                  right: "1.5rem",
                  background: "rgba(15,27,45,0.7)",
                  border: "1px solid rgba(198,166,103,0.3)",
                  color: "#F5F3EE",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                }}
              >
                <ChevronRight size={20} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
