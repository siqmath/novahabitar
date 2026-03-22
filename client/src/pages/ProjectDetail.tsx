/**
 * Nova Habitar — Project Detail Page
 * Route: /pt/projetos/:slug  |  /en/projetos/:slug
 * Design: Navy/Gold/Off-White, Montserrat, matching PartnerDetail style
 */

import { useState, useEffect } from "react";
import { ArrowLeft, Play, X, Check, Building2, Ruler, Hash, MapPin, ExternalLink } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useLang } from "@/contexts/LangContext";
import { projectApi, type Project } from "@/lib/apiClient";
import { STATUS_LABELS, STATUS_LABELS_EN, TYPE_LABELS, TYPE_LABELS_EN } from "@/lib/store";
import Sidebar from "@/components/Sidebar";

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

export default function ProjectDetail() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    projectApi.getBySlug(params.slug)
      .then(setProject)
      .catch(() => setProject(null));
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
            style={{ marginTop: "1rem", color: "#C6A667", background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}
          >
            ← {lang === "en" ? "Back to portfolio" : "Voltar ao portfólio"}
          </button>
        </div>
      </div>
    );
  }

  const gallery = (project.images ?? []).filter((m) => m.url);
  const statusLabel = lang === "en" ? STATUS_LABELS_EN[project.status] : STATUS_LABELS[project.status];
  const typeLabel = lang === "en" ? TYPE_LABELS_EN[project.type] : TYPE_LABELS[project.type];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F3EE" }}>
      <Sidebar />
      <main style={{ marginLeft: "56px", flex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div style={{ backgroundColor: "#0F1B2D", padding: "6rem 0 4rem" }}>
          <div className="container mx-auto px-6">
            {/* Back button */}
            <button
              onClick={() => navigate(`/${lang}/projetos`)}
              className="flex items-center gap-2 mb-8 transition-colors"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(245,243,238,0.6)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.6)")}
            >
              <ArrowLeft size={16} />
              {lang === "en" ? "Portfolio" : "Portfólio"}
            </button>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C6A667", border: "1px solid rgba(198,166,103,0.3)", padding: "0.25rem 0.75rem" }}>
                  {statusLabel}
                </span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,243,238,0.5)", border: "1px solid rgba(245,243,238,0.1)", padding: "0.25rem 0.75rem" }}>
                  {typeLabel}
                </span>
              </div>
              <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.02em", color: "#F5F3EE", lineHeight: 1.1 }}>
                {project.title}
              </h1>
              {project.tagline && (
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.1rem", fontWeight: 300, color: "rgba(245,243,238,0.7)", maxWidth: "700px", lineHeight: 1.6 }}>
                  {lang === "en" ? (project.taglineEn || project.tagline) : project.tagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left: full description + gallery */}
            <div className="lg:col-span-2">
              <div style={{ marginBottom: "4rem" }}>
                <div className="nh-tag" style={{ marginBottom: "1.5rem" }}>
                  {lang === "en" ? "About the project" : "Sobre o projeto"}
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(15,27,45,0.8)", whiteSpace: "pre-line" }}>
                  {(lang === "en" ? (project.aboutTextEn || project.aboutText || project.descriptionEn || project.description) : (project.aboutText || project.description))}
                </p>

                {/* Actuation steps if available */}
                {project.actuation && (project.actuation.planning || project.actuation.architecture || project.actuation.incorporation || project.actuation.construction) && (
                  <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                    {[
                      { l: lang === "en" ? "Planning" : "Planejamento", v: project.actuation.planning, e: project.actuationEn?.planning },
                      { l: lang === "en" ? "Architecture" : "Arquitetura", v: project.actuation.architecture, e: project.actuationEn?.architecture },
                      { l: lang === "en" ? "Incorporation" : "Incorporação", v: project.actuation.incorporation, e: project.actuationEn?.incorporation },
                      { l: lang === "en" ? "Construction" : "Construção", v: project.actuation.construction, e: project.actuationEn?.construction },
                    ].filter(x => x.v).map((step, i) => (
                      <div key={i} style={{ borderLeft: "2px solid #C6A667", paddingLeft: "1.25rem" }}>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C6A667", marginBottom: "0.4rem" }}>
                          {step.l}
                        </p>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(15,27,45,0.6)", lineHeight: 1.5 }}>
                          {lang === "en" ? (step.e || step.v) : step.v}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery */}
              {gallery.length > 0 && (
                <div>
                  <div className="nh-tag" style={{ marginBottom: "1.5rem" }}>
                    {lang === "en" ? "Gallery" : "Galeria"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                    {gallery.map((media, idx) => {
                      const isVid = isVideo(media.url) || media.type === "video";
                      return (
                        <div
                          key={idx}
                          onClick={() => setLightbox(idx)}
                          style={{ cursor: "pointer", position: "relative", overflow: "hidden", aspectRatio: "16/10", border: "1px solid #E8E6E1" }}
                          className="group"
                        >
                          {isVid ? (
                            <div style={{ width: "100%", height: "100%", backgroundColor: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                              <video src={media.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Play size={40} color="white" />
                              </div>
                            </div>
                          ) : (
                            <img src={media.url} alt={media.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} />
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"
                            style={{ background: "linear-gradient(to top, rgba(15,27,45,0.9) 0%, transparent 60%)" }}>
                            {(lang === "en" ? (media.titleEn || media.title) : media.title) && (
                              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#fff", marginBottom: "0.25rem" }}>
                                {lang === "en" ? (media.titleEn || media.title) : media.title}
                              </h4>
                            )}
                            {(lang === "en" ? (media.descriptionEn || media.description) : media.description) && (
                              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {lang === "en" ? (media.descriptionEn || media.description) : media.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Technical info + Differentials sidebar */}
            <div className="lg:col-span-1">
              <div style={{ position: "sticky", top: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                
                {/* Technical data */}
                <div style={{ backgroundColor: "#0F1B2D", padding: "1.75rem", color: "#F5F3EE" }}>
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#C6A667", marginBottom: "1.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {lang === "en" ? "Technical details" : "Ficha técnica"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                      { icon: <Building2 size={16} />, label: lang === "en" ? "Typology" : "Tipologia", value: (lang === "en" ? (project.typologyEn || project.typology) : project.typology) },
                      { icon: <Ruler size={16} />, label: lang === "en" ? "Built Area" : "Área construída", value: project.builtArea },
                      { icon: <Hash size={16} />, label: lang === "en" ? "Units" : "Unidades", value: project.units },
                      { icon: <MapPin size={16} />, label: lang === "en" ? "Location" : "Localidade", value: project.location }
                    ].filter(item => item.value).map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                        <div style={{ color: "#C6A667", marginTop: "0.2rem" }}>{item.icon}</div>
                        <div>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6rem", fontWeight: 700, color: "rgba(245,243,238,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>{item.label}</p>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", fontWeight: 500, color: "#F5F3EE" }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differentials */}
                {(lang === "en" ? (project.differentialsEn && project.differentialsEn.length > 0 ? project.differentialsEn : project.differentials) : project.differentials) && (lang === "en" ? (project.differentialsEn && project.differentialsEn.length > 0 ? project.differentialsEn : project.differentials) : project.differentials)!.length > 0 && (
                  <div style={{ backgroundColor: "#fff", padding: "1.75rem", border: "1px solid #E8E6E1" }}>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0F1B2D", marginBottom: "1.25rem" }}>
                      {lang === "en" ? "Highlights" : "Diferenciais"}
                    </h3>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                      {(lang === "en" ? (project.differentialsEn && project.differentialsEn.length > 0 ? project.differentialsEn : project.differentials) : project.differentials)!.map((diff, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                          <Check size={16} style={{ color: "#C6A667", flexShrink: 0, marginTop: "0.1rem" }} />
                          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 400, color: "rgba(15,27,45,0.7)", lineHeight: 1.5 }}>
                            {diff}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact CTA */}
                <button
                  onClick={() => navigate(`/${lang}/contato`)}
                   style={{ backgroundColor: "#C6A667", color: "#0F1B2D", padding: "1rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
                >
                  {lang === "en" ? "Check availability" : "Consultar disponibilidade"}
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* ── LIGHTBOX ─────────────────────────────────────────────────── */}
        {lightbox !== null && gallery[lightbox] && (
          <div
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.94)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
          >
            <button
              onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer", color: "#fff" }}
            >
              <X size={28} />
            </button>
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "1100px", width: "100%" }}>
              {isVideo(gallery[lightbox].url) || gallery[lightbox].type === "video" ? (
                <video src={gallery[lightbox].url} controls autoPlay style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }} />
              ) : (
                <img src={gallery[lightbox].url} alt={(lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title) || ""} style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }} />
              )}
              {((lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title) || (lang === "en" ? (gallery[lightbox].descriptionEn || gallery[lightbox].description) : gallery[lightbox].description)) && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  {(lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title) && (
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "1.1rem", color: "#fff", marginBottom: "0.25rem" }}>
                      {lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title}
                    </p>
                  )}
                  {(lang === "en" ? (gallery[lightbox].descriptionEn || gallery[lightbox].description) : gallery[lightbox].description) && (
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                      {lang === "en" ? (gallery[lightbox].descriptionEn || gallery[lightbox].description) : gallery[lightbox].description}
                    </p>
                  )}
                </div>
              )}
              {/* Prev/Next */}
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
                <button
                  onClick={() => setLightbox((lightbox - 1 + gallery.length) % gallery.length)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.6rem 1.5rem", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  ← {lang === 'en' ? 'Previous' : 'Anterior'}
                </button>
                <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", alignSelf: "center" }}>
                  {lightbox + 1} / {gallery.length}
                </span>
                <button
                  onClick={() => setLightbox((lightbox + 1) % gallery.length)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.6rem 1.5rem", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  {lang === 'en' ? 'Next' : 'Próximo'} →
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
