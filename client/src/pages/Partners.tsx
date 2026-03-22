/**
 * Nova Habitar — Partners List Page
 * Route: /pt/parceiros  |  /en/parceiros
 * Shows clickable cards that link to individual partner pages
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useLang } from "@/contexts/LangContext";
import { partnerApi, type Partner } from "@/lib/apiClient";
import { ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

export default function Partners() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    partnerApi.getAll().then((all) => {
      setPartners(all.filter((p) => p.active));
    }).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F3EE" }}>
      <Sidebar />
      <main style={{ marginLeft: "56px", flex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <header style={{ backgroundColor: "#0F1B2D", padding: "6rem 0 5rem" }}>
          <div className="container mx-auto px-6" style={{ textAlign: "center" }}>
            <div className="nh-tag" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
              {lang === "en" ? "Partners" : "Parceiros"}
            </div>
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "0.02em", color: "#F5F3EE", marginBottom: "1rem" }}>
              {lang === "en" ? "Who builds with us" : "Quem constrói com a gente"}
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", color: "rgba(245,243,238,0.6)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
              {lang === "en"
                ? "Discover the network of excellent companies and professionals who build the future together with Nova Habitar."
                : "Conheça a rede de empresas e profissionais de excelência que constroem o futuro junto à Nova Habitar."}
            </p>
          </div>
        </header>

        {/* ── PARTNERS GRID ────────────────────────────────────────────── */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container mx-auto px-6">
            {partners.length === 0 ? (
              <p style={{ textAlign: "center", fontFamily: "'Montserrat', sans-serif", color: "rgba(15,27,45,0.5)", padding: "4rem" }}>
                {lang === "en" ? "No partners registered yet." : "Nenhum parceiro cadastrado ainda."}
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {partners.map((partner) => {
                  const coverMedia = partner.gallery?.find((m) => m.url);
                  return (
                    <div
                      key={partner.id}
                      onClick={() => navigate(`/${lang}/parceiros/${partner.slug}`)}
                      style={{ backgroundColor: "#fff", border: "1px solid #E8E6E1", cursor: "pointer", transition: "box-shadow 0.2s ease, transform 0.2s ease", overflow: "hidden" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(15,27,45,0.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      {/* Thumbnail from gallery or logo */}
                      <div style={{ height: "160px", backgroundColor: "#0F1B2D", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {coverMedia ? (
                          isVideo(coverMedia.url) || coverMedia.type === "video" ? (
                            <video src={coverMedia.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                          ) : (
                            <img src={coverMedia.url} alt={partner.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )
                        ) : partner.logo ? (
                          <img src={partner.logo} alt={partner.name} style={{ maxHeight: "80px", maxWidth: "80%", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
                        ) : (
                          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "rgba(245,243,238,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{partner.name}</span>
                        )}
                      </div>

                      {/* Card content */}
                      <div style={{ padding: "1.5rem" }}>
                        {partner.logo && (
                          <div style={{ height: "40px", marginBottom: "0.75rem" }}>
                            <img src={partner.logo} alt={partner.name} style={{ maxHeight: "40px", maxWidth: "120px", objectFit: "contain" }}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                          </div>
                        )}
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C6A667", marginBottom: "0.4rem" }}>
                          {lang === "en" ? (partner.actuationEn || partner.actuation) : partner.actuation}
                        </p>
                        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0F1B2D", marginBottom: "0.75rem" }}>
                          {partner.name}
                        </h2>
                        {(lang === "en" ? (partner.shortDescriptionEn || partner.shortDescription) : partner.shortDescription) && (
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.825rem", color: "rgba(15,27,45,0.65)", lineHeight: 1.6, marginBottom: "1.25rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {lang === "en" ? (partner.shortDescriptionEn || partner.shortDescription) : partner.shortDescription}
                          </p>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#C6A667", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {lang === "en" ? "View partner" : "Ver parceiro"} <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
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
