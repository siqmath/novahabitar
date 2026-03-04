/**
 * Nova Habitar — Home Page
 * Design Principles: Simplicidade, Memorabilidade, Versatilidade, Adequação, Consistência, Verdade Estética
 * Palette: Navy #0F1B2D | Gold #C6A667 (≤5%) | Graphite #2B2F36 | Off-White #F5F3EE
 * Typography: Montserrat Bold/Medium (titles, +letter-spacing) | Montserrat Regular/Light (body, line-height ≥1.6)
 * No rounded corners — precision and linearity
 * No green — only Navy, Gold, Graphite, Off-White
 */

import { useLang } from "@/contexts/LangContext";
import AnimatedHero from "@/components/AnimatedHero";
import {
  ClipboardList,
  Ruler,
  Briefcase,
  HardHat,
  CheckCircle,
  ArrowRight,
  MapPin,
  Mail,
  Calendar,
  ShieldCheck,
  Zap,
  FileCheck,
  Leaf,
  Globe,
  TrendingUp,
  Building,
  CheckSquare,
} from "lucide-react";

// Image constants
const PROJECT_1 = "https://cdn.abacus.ai/images/539308e5-66ea-444f-8ad8-7a2a523b1955.png";
const PROJECT_2 = "https://cdn.abacus.ai/images/980b9b7a-4b2b-4357-a8e8-09248f241036.png";
const PROJECT_3 = "https://cdn.abacus.ai/images/6ad4be35-f622-4df6-8549-234a0a4c1f14.png";
const ABOUT_IMAGE = "https://cdn.abacus.ai/images/9ba8e268-af7b-49c3-901e-5ff1797d13fb.png";
const STRUCTURE_IMAGE = "https://cdn.abacus.ai/images/da52a73e-44a8-49f3-aa6d-63b77ac7812f.png";
const LOGO_LIGHT =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/LkQQIgSogkaYgkRe.png?Expires=1804165690&Signature=DzaUbYoKfkMx-J-tjtEWrQXmAAmR41-ixf3NrBNWjC7eEoBzBthg01tYX6k~RNDqnUGDog33khYB718xnveXcZ-Qwm87Eka2t009RqsxpLkqSG4BFt4UCSnNcpCyHLq37VwjctQCyYakfBuIBley~WXjbAe7kp3FOE3d53MYDSTNgLXAOsLg2D6-ePeht0JK55SBRad-Zdb8U5-Yet1kZRIIaG0m-RXgBix2TEGWUFaS66CXlJXs9SIXWGMJehQ9OZ5MosF5zzBnkcauQaGfix~lDgcNaE4ghCKVr9DiBdFCKgccdzhNkTXFGl9exZU25hfLYL~924t5O3H-jzvvWg__&Key-Pair-Id=K2HSFNDJXOU9YS";
const LOGO_DARK =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/CdFMmFddwYvgYETL.png?Expires=1804165690&Signature=cV49yLhvX-VzQthXEiyqjxknJOdktJRww9dPuGaPkTatBAoEsnT6oJ9se9dg9qZy~Jxt-cVENaLE9QSIdxo1qlLOxDLFnLH~zySFtoQpBMJOK~gLJDEPQ~jVYo~D2JA42wjFDjYIaXGnovRgXhWcqeq014kb1T-gQfkvF85ojHtjKO96-Hui9E5eofxvpD8PBlFl2aR-1RNIAxWMjPom7eut4Du3uPpE9m2P0ONoW8PGCSU8btcLm39Nm9b49Q1eNnECibg-DODDnJEFHzFCkxMlLCvvTYwXeUyjWTEgbYFCIX6cUXCYrFcLNp7g43H-rSPfNw1E0Vr6Yxxa~wveIw__&Key-Pair-Id=K2HSFNDJXOU9YS";

const ACTUATION_ICONS = [
  <ClipboardList size={22} />,
  <Ruler size={22} />,
  <Briefcase size={22} />,
  <HardHat size={22} />,
  <CheckCircle size={22} />,
];

const DIFFERENTIAL_ICONS = [
  <ShieldCheck size={22} />,
  <Zap size={22} />,
  <FileCheck size={22} />,
  <Building size={22} />,
];

const SUSTAINABILITY_ICONS = [
  <Leaf size={22} />,
  <Globe size={22} />,
  <Building size={22} />,
  <TrendingUp size={22} />,
];

const PROJECT_IMAGES = [PROJECT_1, PROJECT_2, PROJECT_3];

function SectionTag({ label }: { label: string }) {
  return (
    <div className="nh-tag">{label}</div>
  );
}

export default function Home() {
  const { t } = useLang();

  const statusColor = (status: string) => {
    if (status === "delivered") return { bg: "rgba(198,166,103,0.12)", color: "#C6A667" };
    if (status === "underConstruction") return { bg: "rgba(15,27,45,0.08)", color: "#2B2F36" };
    return { bg: "rgba(15,27,45,0.06)", color: "#2B2F36" };
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      delivered: t.projects.statusLabels.delivered,
      inDevelopment: t.projects.statusLabels.inDevelopment,
      underConstruction: t.projects.statusLabels.underConstruction,
    };
    return map[status] ?? status;
  };

  return (
    <div style={{ backgroundColor: "#F5F3EE" }}>
      {/* ── HERO ── */}
      <AnimatedHero />

      {/* ── ATUAÇÃO ── */}
      <section id="atuacao" style={{ backgroundColor: "#0F1B2D", padding: "6rem 0" }}>
        <div className="container mx-auto">
          <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
            <SectionTag label={t.actuation.tag} />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                letterSpacing: "0.035em",
                color: "#F5F3EE",
                marginBottom: "1rem",
              }}
            >
              {t.actuation.title}
            </h2>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "rgba(245,243,238,0.6)",
              }}
            >
              {t.actuation.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1px",
              backgroundColor: "rgba(198,166,103,0.1)",
            }}
          >
            {t.actuation.items.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#0F1B2D",
                  padding: "2rem 1.75rem",
                  borderTop: "2px solid transparent",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderTopColor = "#C6A667";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderTopColor = "transparent";
                }}
              >
                <div
                  style={{
                    color: "#C6A667",
                    marginBottom: "1rem",
                    opacity: 0.85,
                  }}
                >
                  {ACTUATION_ICONS[i]}
                </div>
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#F5F3EE",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                    color: "rgba(245,243,238,0.55)",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJETOS ── */}
      <section id="projetos" style={{ backgroundColor: "#F5F3EE", padding: "6rem 0" }}>
        <div className="container mx-auto">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <SectionTag label={t.projects.tag} />
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  letterSpacing: "0.035em",
                  color: "#0F1B2D",
                  marginBottom: "0.75rem",
                }}
              >
                {t.projects.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  color: "#2B2F36",
                  maxWidth: "480px",
                }}
              >
                {t.projects.subtitle}
              </p>
            </div>
            <a
              href="#projetos"
              className="nh-btn-outline-dark"
              style={{ flexShrink: 0 }}
            >
              {t.projects.viewAll} <ArrowRight size={14} />
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {t.projects.items.map((project, i) => {
              const sc = statusColor(project.status);
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                    border: "1px solid #E8E6E1",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 8px 32px rgba(15,27,45,0.1)";
                    el.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                    <img
                      src={PROJECT_IMAGES[i]}
                      alt={project.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {/* Status badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        backgroundColor: sc.bg,
                        color: sc.color,
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "0.3rem 0.75rem",
                        backdropFilter: "blur(4px)",
                        border: `1px solid ${sc.color}40`,
                      }}
                    >
                      {statusLabel(project.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "#2B2F36",
                        opacity: 0.6,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <MapPin size={11} />
                      {project.location}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                        letterSpacing: "0.03em",
                        color: "#0F1B2D",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        fontSize: "0.8375rem",
                        lineHeight: 1.65,
                        color: "#2B2F36",
                        marginBottom: "1rem",
                      }}
                    >
                      {project.desc}
                    </p>
                    {/* Specs */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {project.specs.map((spec, si) => (
                        <span
                          key={si}
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#0F1B2D",
                            backgroundColor: "#F5F3EE",
                            border: "1px solid #D8D6D1",
                            padding: "0.25rem 0.6rem",
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section id="diferenciais" style={{ backgroundColor: "#E8E6E1", padding: "6rem 0" }}>
        <div className="container mx-auto">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {/* Left: Image */}
            <div style={{ position: "relative" }}>
              <img
                src={STRUCTURE_IMAGE}
                alt="Estrutura Nova Habitar"
                style={{ width: "100%", height: "480px", objectFit: "cover" }}
              />
              {/* Gold accent bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "3rem",
                  height: "4px",
                  backgroundColor: "#C6A667",
                }}
              />
            </div>

            {/* Right: Content */}
            <div>
              <SectionTag label={t.differentials.tag} />
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  letterSpacing: "0.035em",
                  color: "#0F1B2D",
                  marginBottom: "0.75rem",
                }}
              >
                {t.differentials.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "#2B2F36",
                  marginBottom: "2rem",
                }}
              >
                {t.differentials.subtitle}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {t.differentials.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                      paddingBottom: "1.25rem",
                      borderBottom: i < t.differentials.items.length - 1 ? "1px solid #D8D6D1" : "none",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        color: "#C6A667",
                        marginTop: "0.1rem",
                      }}
                    >
                      {DIFFERENTIAL_ICONS[i]}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          letterSpacing: "0.04em",
                          color: "#0F1B2D",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 400,
                          fontSize: "0.825rem",
                          lineHeight: 1.65,
                          color: "#2B2F36",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOVERNANÇA ── */}
      <section id="governanca" style={{ backgroundColor: "#0F1B2D", padding: "6rem 0" }}>
        <div className="container mx-auto">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {/* Left: Content */}
            <div>
              <SectionTag label={t.governance.tag} />
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  letterSpacing: "0.035em",
                  color: "#F5F3EE",
                  marginBottom: "0.75rem",
                }}
              >
                {t.governance.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "rgba(245,243,238,0.6)",
                  marginBottom: "2rem",
                }}
              >
                {t.governance.subtitle}
              </p>

              <ul style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2rem" }}>
                {t.governance.items.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      color: "rgba(245,243,238,0.72)",
                    }}
                  >
                    <CheckSquare
                      size={15}
                      style={{ color: "#C6A667", flexShrink: 0, marginTop: "0.15rem" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="nh-btn-gold"
              >
                {t.governance.cta} <ArrowRight size={14} />
              </a>
            </div>

            {/* Right: Visual accent */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  padding: "3rem",
                  border: "1px solid rgba(198,166,103,0.2)",
                  position: "relative",
                }}
              >
                {/* Gold corner accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "3rem",
                    height: "3px",
                    backgroundColor: "#C6A667",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "3px",
                    height: "3rem",
                    backgroundColor: "#C6A667",
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(245,243,238,0.4)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Sistema de Gestão Integrado
                </div>
                {["Engenharia", "Jurídico", "Finanças", "Suprimentos", "Comercial", "Pós-Ocupação"].map((area, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      letterSpacing: "0.04em",
                      color: i === 0 ? "#C6A667" : "rgba(245,243,238,0.65)",
                      padding: "0.6rem 0",
                      borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      transition: "color 0.15s ease",
                    }}
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUSTENTABILIDADE ── */}
      <section id="sustentabilidade" style={{ backgroundColor: "#F5F3EE", padding: "6rem 0" }}>
        <div className="container mx-auto">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3.5rem" }}>
            <SectionTag label={t.sustainability.tag} />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                letterSpacing: "0.035em",
                color: "#0F1B2D",
                marginBottom: "0.75rem",
              }}
            >
              {t.sustainability.title}
            </h2>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "#2B2F36",
              }}
            >
              {t.sustainability.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {t.sustainability.items.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E8E6E1",
                  padding: "2rem",
                  borderTop: "3px solid transparent",
                  transition: "border-top-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderTopColor = "#C6A667";
                  el.style.boxShadow = "0 4px 20px rgba(15,27,45,0.07)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderTopColor = "transparent";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ color: "#C6A667", marginBottom: "1rem" }}>
                  {SUSTAINABILITY_ICONS[i]}
                </div>
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    color: "#0F1B2D",
                    marginBottom: "0.6rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.825rem",
                    lineHeight: 1.7,
                    color: "#2B2F36",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUEM SOMOS ── */}
      <section id="quem-somos" style={{ backgroundColor: "#E8E6E1", padding: "6rem 0" }}>
        <div className="container mx-auto">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {/* Image */}
            <div style={{ position: "relative" }}>
              <img
                src={ABOUT_IMAGE}
                alt="Nova Habitar"
                style={{ width: "100%", height: "460px", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-1rem",
                  right: "-1rem",
                  width: "6rem",
                  height: "6rem",
                  backgroundColor: "#C6A667",
                  opacity: 0.15,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Content */}
            <div>
              <SectionTag label={t.about.tag} />
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  letterSpacing: "0.035em",
                  color: "#0F1B2D",
                  marginBottom: "1.25rem",
                }}
              >
                {t.about.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  color: "#2B2F36",
                  marginBottom: "1rem",
                }}
              >
                {t.about.body1}
              </p>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  color: "#2B2F36",
                  marginBottom: "2rem",
                }}
              >
                {t.about.body2}
              </p>

              {/* Mission / Vision / Values */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0",
                  border: "1px solid #D8D6D1",
                  marginBottom: "2rem",
                }}
              >
                {[
                  { label: t.about.mission, text: t.about.missionText },
                  { label: t.about.vision, text: t.about.visionText },
                  { label: t.about.values, text: t.about.valuesText },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1.25rem",
                      borderRight: i < 2 ? "1px solid #D8D6D1" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#C6A667",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.label}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        fontSize: "0.75rem",
                        lineHeight: 1.6,
                        color: "#2B2F36",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="nh-btn-outline-dark"
              >
                {t.about.cta} <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        id="contato"
        style={{
          backgroundColor: "#0F1B2D",
          padding: "6rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gold gradient accent — ≤5% of section */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "30%",
            height: "100%",
            background: "linear-gradient(135deg, transparent 60%, rgba(198,166,103,0.04) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Gold top border line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "3rem",
            width: "4rem",
            height: "3px",
            backgroundColor: "#C6A667",
          }}
        />

        <div className="container mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "640px" }}>
            <SectionTag label="Contato" />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                letterSpacing: "0.035em",
                color: "#F5F3EE",
                marginBottom: "1rem",
              }}
            >
              {t.cta.title}
            </h2>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "rgba(245,243,238,0.6)",
                marginBottom: "2.5rem",
                maxWidth: "520px",
              }}
            >
              {t.cta.subtitle}
            </p>
            <a href="mailto:contato@novahabitar.com" className="nh-btn-gold">
              {t.cta.button} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#0a1420", padding: "4rem 0 2rem" }}>
        <div className="container mx-auto">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "3rem",
              marginBottom: "3rem",
            }}
          >
            {/* Brand */}
            <div>
              <img
                src={LOGO_DARK}
                alt="NOVA HABITAR"
                style={{ height: "40px", width: "auto", objectFit: "contain", marginBottom: "1.25rem" }}
              />
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.825rem",
                  lineHeight: 1.7,
                  color: "rgba(245,243,238,0.45)",
                  maxWidth: "280px",
                }}
              >
                {t.footer.description}
              </p>
              <div
                style={{
                  marginTop: "1.25rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.6rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#C6A667",
                  opacity: 0.7,
                }}
              >
                {t.footer.tagline}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(245,243,238,0.4)",
                  marginBottom: "1.25rem",
                }}
              >
                {t.footer.nav}
              </h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { label: t.nav.projects, hash: "projetos" },
                  { label: t.nav.actuation, hash: "atuacao" },
                  { label: t.nav.differentials, hash: "diferenciais" },
                  { label: t.nav.governance, hash: "governanca" },
                  { label: t.nav.sustainability, hash: "sustentabilidade" },
                  { label: t.nav.about, hash: "quem-somos" },
                ].map((item) => (
                  <li key={item.hash}>
                    <a
                      href={`#${item.hash}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.hash)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        fontSize: "0.825rem",
                        color: "rgba(245,243,238,0.5)",
                        textDecoration: "none",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.5)")}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(245,243,238,0.4)",
                  marginBottom: "1.25rem",
                }}
              >
                {t.footer.contact}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.825rem",
                    fontWeight: 400,
                    color: "rgba(245,243,238,0.5)",
                  }}
                >
                  <MapPin size={13} style={{ color: "#C6A667", flexShrink: 0, marginTop: "0.1rem" }} />
                  São Gonçalo, Rio de Janeiro
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <Mail size={13} style={{ color: "#C6A667", flexShrink: 0 }} />
                  <a
                    href="mailto:contato@novahabitar.com"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.825rem",
                      fontWeight: 400,
                      color: "rgba(245,243,238,0.5)",
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.5)")}
                  >
                    contato@novahabitar.com
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.825rem",
                    fontWeight: 400,
                    color: "rgba(245,243,238,0.5)",
                  }}
                >
                  <Calendar size={13} style={{ color: "#C6A667", flexShrink: 0 }} />
                  CNPJ 16.692.513/0001-40
                </div>
              </div>
            </div>
          </div>

          {/* Divider + copyright */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                color: "rgba(245,243,238,0.3)",
              }}
            >
              © 2026 Nova Habitar. {t.footer.rights}
            </p>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                color: "rgba(245,243,238,0.2)",
              }}
            >
              Incorporadora e Construtora Nova Habitar Ltda.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
