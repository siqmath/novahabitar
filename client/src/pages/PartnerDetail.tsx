/**
 * Nova Habitar — Partner Detail Page
 * Route: /pt/parceiros/:slug  |  /en/parceiros/:slug
 * Design: Navy/Gold/Off-White, Montserrat, no rounded corners
 */

import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Check, Play, X } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useLang } from "@/contexts/LangContext";
import { partnerApi, type Partner } from "@/lib/apiClient";
import Sidebar from "@/components/Sidebar";

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

export default function PartnerDetail() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    partnerApi.getBySlug(params.slug)
      .then(setPartner)
      .catch(() => setPartner(null));
  }, [params.slug]);

  if (!partner) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0F1B2D" }}>
        <Sidebar />
        <div style={{ marginLeft: "56px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(245,243,238,0.5)", fontSize: "1rem" }}>
            {lang === "en" ? "Partner not found." : "Parceiro não encontrado."}
          </p>
          <button
            onClick={() => navigate(`/${lang}/parceiros`)}
            style={{ marginTop: "1rem", color: "#C6A667", background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}
          >
            ← {lang === "en" ? "Back to partners" : "Voltar para parceiros"}
          </button>
        </div>
      </div>
    );
  }

  const gallery = (partner.gallery ?? []).filter((m) => m.url);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F3EE" }}>
      <Sidebar />
      <main style={{ marginLeft: "56px", flex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div style={{ backgroundColor: "#0F1B2D", padding: "6rem 0 4rem" }}>
          <div className="container mx-auto px-6">
            {/* Back button */}
            <button
              onClick={() => navigate(`/${lang}/parceiros`)}
              className="flex items-center gap-2 mb-8 transition-colors"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(245,243,238,0.6)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.6)")}
            >
              <ArrowLeft size={16} />
              {lang === "en" ? "Back to partners" : "Voltar para parceiros"}
            </button>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Logo box */}
              {partner.logo && (
                <div style={{ backgroundColor: "#fff", padding: "1.5rem", maxWidth: "200px", flexShrink: 0 }}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{ maxWidth: "160px", maxHeight: "80px", objectFit: "contain", display: "block" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
              {/* Info */}
              <div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C6A667", display: "block", marginBottom: "0.5rem" }}>
                  {lang === "en" ? (partner.actuationEn || partner.actuation) : partner.actuation}
                </span>
                <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.03em", color: "#F5F3EE", marginBottom: "0.75rem" }}>
                  {partner.name}
                </h1>
                {(lang === "en" ? (partner.shortDescriptionEn || partner.shortDescription) : partner.shortDescription) && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", fontWeight: 300, color: "rgba(245,243,238,0.7)", maxWidth: "600px", lineHeight: 1.7 }}>
                    {lang === "en" ? (partner.shortDescriptionEn || partner.shortDescription) : partner.shortDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Website button */}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6"
                style={{ backgroundColor: "#C6A667", color: "#0F1B2D", padding: "0.75rem 1.75rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
              >
                {lang === "en" ? "Visit website" : "Visitar site"} <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left: full description + gallery */}
            <div className="lg:col-span-2">
              {(lang === "en" ? (partner.fullDescriptionEn || partner.fullDescription) : partner.fullDescription) && (
                <div style={{ marginBottom: "4rem" }}>
                  <div className="nh-tag" style={{ marginBottom: "1.5rem" }}>
                    {lang === "en" ? "About" : "Sobre"}
                  </div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.9, color: "rgba(15,27,45,0.8)", whiteSpace: "pre-line" }}>
                    {lang === "en" ? (partner.fullDescriptionEn || partner.fullDescription) : partner.fullDescription}
                  </p>
                </div>
              )}

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
                          style={{ cursor: "pointer", position: "relative", overflow: "hidden", aspectRatio: "16/10" }}
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
                            <img src={media.url} alt={media.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} />
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"
                            style={{ background: "linear-gradient(to top, rgba(15,27,45,0.85) 0%, transparent 60%)" }}>
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

            {/* Right: differentials sidebar */}
            {(lang === "en" ? (partner.differentialsEn && partner.differentialsEn.length > 0 ? partner.differentialsEn : partner.differentials) : partner.differentials) && (lang === "en" ? (partner.differentialsEn && partner.differentialsEn.length > 0 ? partner.differentialsEn : partner.differentials) : partner.differentials)!.length > 0 && (
              <div className="lg:col-span-1">
                <div style={{ position: "sticky", top: "2rem", backgroundColor: "#fff", padding: "1.75rem", border: "1px solid rgba(15,27,45,0.08)" }}>
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0F1B2D", marginBottom: "1.25rem" }}>
                    {lang === "en" ? "Differentials" : "Diferenciais"}
                  </h3>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {(lang === "en" ? (partner.differentialsEn && partner.differentialsEn.length > 0 ? partner.differentialsEn : partner.differentials) : partner.differentials)!.map((diff, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                        <Check size={16} style={{ color: "#C6A667", flexShrink: 0, marginTop: "0.1rem" }} />
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 400, color: "rgba(15,27,45,0.75)", lineHeight: 1.5 }}>
                          {diff}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── LIGHTBOX ─────────────────────────────────────────────────── */}
        {lightbox !== null && gallery[lightbox] && (
          <div
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
          >
            <button
              onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer", color: "#fff" }}
            >
              <X size={28} />
            </button>
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "1000px", width: "100%" }}>
              {isVideo(gallery[lightbox].url) || gallery[lightbox].type === "video" ? (
                <video src={gallery[lightbox].url} controls autoPlay style={{ width: "100%", maxHeight: "75vh", objectFit: "contain" }} />
              ) : (
                <img src={gallery[lightbox].url} alt={(lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title) || ""} style={{ width: "100%", maxHeight: "75vh", objectFit: "contain" }} />
              )}
              {((lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title) || (lang === "en" ? (gallery[lightbox].descriptionEn || gallery[lightbox].description) : gallery[lightbox].description)) && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  {(lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title) && (
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#fff", marginBottom: "0.25rem" }}>
                      {lang === "en" ? (gallery[lightbox].titleEn || gallery[lightbox].title) : gallery[lightbox].title}
                    </p>
                  )}
                  {(lang === "en" ? (gallery[lightbox].descriptionEn || gallery[lightbox].description) : gallery[lightbox].description) && (
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                      {lang === "en" ? (gallery[lightbox].descriptionEn || gallery[lightbox].description) : gallery[lightbox].description}
                    </p>
                  )}
                </div>
              )}
              {/* Prev/Next */}
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  onClick={() => setLightbox((lightbox - 1 + gallery.length) % gallery.length)}
                  style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "0.5rem 1.25rem", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem" }}
                >
                  ← Anterior
                </button>
                <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", alignSelf: "center" }}>
                  {lightbox + 1} / {gallery.length}
                </span>
                <button
                  onClick={() => setLightbox((lightbox + 1) % gallery.length)}
                  style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "0.5rem 1.25rem", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem" }}
                >
                  Próximo →
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
