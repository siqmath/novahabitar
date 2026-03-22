/**
 * Nova Habitar — Home Page
 * Design Principles: Simplicidade, Memorabilidade, Versatilidade, Adequação, Consistência, Verdade Estética
 * Palette: Navy #0F1B2D | Gold #C6A667 (≤5%) | Graphite #2B2F36 | Off-White #F5F3EE
 * Typography: Montserrat Bold/Medium (titles, +letter-spacing) | Montserrat Regular/Light (body, line-height ≥1.6)
 * No rounded corners — precision and linearity
 * No green — only Navy, Gold, Graphite, Off-White
 */

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import AnimatedHero from "@/components/AnimatedHero";
import ProjectCarousel from "@/components/ProjectCarousel";
import { FeatureSteps } from "@/components/FeatureSteps";
import { AboutSteps } from "@/components/AboutSteps";
import OurHistory from "@/pages/OurHistory";
import { partnerApi, contactApi, type Partner, type ContactInfo } from "@/lib/apiClient";
import { useLocation } from "wouter";
import {
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
const ABOUT_IMAGE = "https://cdn.abacus.ai/images/9ba8e268-af7b-49c3-901e-5ff1797d13fb.png";
const STRUCTURE_IMAGE = "https://cdn.abacus.ai/images/da52a73e-44a8-49f3-aa6d-63b77ac7812f.png";
const LOGO_DARK =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/CdFMmFddwYvgYETL.png?Expires=1804165690&Signature=cV49yLhvX-VzQthXEiyqjxknJOdktJRww9dPuGaPkTatBAoEsnT6oJ9se9dg9qZy~Jxt-cVENaLE9QSIdxo1qlLOxDLFnLH~zySFtoQpBMJOK~gLJDEPQ~jVYo~D2JA42wjFDjYIaXGnovRgXhWcqeq014kb1T-gQfkvF85ojHtjKO96-Hui9E5eofxvpD8PBlFl2aR-1RNIAxWMjPom7eut4Du3uPpE9m2P0ONoW8PGCSU8btcLm39Nm9b49Q1eNnECibg-DODDnJEFHzFCkxMlLCvvTYwXeUyjWTEgbYFCIX6cUXCYrFcLNp7g43H-rSPfNw1E0Vr6Yxxa~wveIw__&Key-Pair-Id=K2HSFNDJXOU9YS";

// Actuation feature images
const ACTUATION_IMAGES = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
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

function SectionTag({ label }: { label: string }) {
  return (
    <div className="nh-tag">{label}</div>
  );
}

export default function Home() {
  const { t, lang } = useLang();
  const [, navigate] = useLocation();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [marqueeDir, setMarqueeDir] = useState<"normal" | "reverse" | "paused">("normal");

  useEffect(() => {
    partnerApi.getAll().then((all) => {
      setPartners(all.filter((p) => p.featured && p.active));
    }).catch(console.error);
    contactApi.get().then(setContact).catch(console.error);
  }, []);

  return (
    <div style={{ backgroundColor: "#F5F3EE" }}>
      {/* ── HERO ── */}
      <AnimatedHero />

      {/* ── ATUAÇÃO ── */}
      <section id="atuacao" style={{ backgroundColor: "#0F1B2D", padding: "0" }}>
        <div style={{ backgroundColor: "#0F1B2D", paddingTop: "4rem", paddingBottom: "0" }}>
          <div className="container mx-auto">
            <SectionTag label={t.actuation.tag} />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                letterSpacing: "0.035em",
                color: "#F5F3EE",
                marginBottom: "0.5rem",
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
                maxWidth: "560px",
              }}
            >
              {t.actuation.subtitle}
            </p>
          </div>
        </div>
        <FeatureSteps
          features={t.actuation.items.map((item, i) => ({
            step: String(i + 1).padStart(2, "0"),
            title: item.title,
            content: item.desc,
            image: ACTUATION_IMAGES[i] || ACTUATION_IMAGES[0],
          }))}
        />
      </section>

      {/* ── PROJETOS ── */}
      <section id="projetos" style={{ backgroundColor: "#0F1B2D", padding: "6rem 0 0" }}>
        <div className="container mx-auto" style={{ paddingBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <div>
              <SectionTag label={t.projects.tag} />
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  letterSpacing: "0.035em",
                  color: "#F5F3EE",
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
                  color: "rgba(245,243,238,0.55)",
                  maxWidth: "480px",
                }}
              >
                {t.projects.subtitle}
              </p>
            </div>
            <button
              onClick={() => navigate(`/${lang}/projetos`)}
              className="nh-btn-outline-light"
              style={{ flexShrink: 0 }}
            >
              {t.projects.viewAll} <ArrowRight size={14} />
            </button>
          </div>
        </div>
        {/* Full-width carousel */}
        <ProjectCarousel />
      </section>

      {/* ── PARCEIROS ── */}
      {partners.length > 0 && (
        <section 
          id="parceiros" 
          style={{ 
            backgroundColor: "#E8E6E1", 
            padding: "8rem 0",
            overflow: "hidden"
          }}
        >
          <div className="container mx-auto px-4 mb-12">
            <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
              <SectionTag label={lang === "en" ? "Partners" : "Parceiros"} />
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  letterSpacing: "0.035em",
                  color: "#0F1B2D",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase"
                }}
              >
                {lang === "en" ? "Who builds with us" : "Quem constrói com a gente"}
              </h2>
              <div 
                style={{ 
                  width: "40px", 
                  height: "3px", 
                  backgroundColor: "#C6A667", 
                  margin: "1.5rem auto" 
                }} 
              />
            </div>
          </div>
          
          {/* Marquee Wrapper */}
          <div 
            className="relative flex overflow-hidden py-16 [--gap:3.5rem] [gap:var(--gap)] [--duration:100s]"
            onMouseMove={(e) => {
              const { width, left } = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - left) / width;
              if (ratio > 0.15 && ratio < 0.85) {
                setMarqueeDir("paused");
              } else {
                setMarqueeDir("normal");
              }
            }}
            onMouseLeave={() => setMarqueeDir("normal")}
          >
            <div 
              className="flex shrink-0 [gap:var(--gap)] animate-marquee"
              style={{
                animationPlayState: marqueeDir === "paused" ? "paused" : "running"
              }}
            >
              {/* Multiply the list to ensure the screen is ALWAYS overflowed, even with 1-2 partners */}
              {[...Array(12)].map((_, setIndex) => (
                partners.map((p) => (
                  <div 
                    key={`${setIndex}-${p.id}`} 
                    onClick={() => navigate(`/${lang}/parceiros/${p.slug}`)}
                    style={{
                      flexShrink: 0,
                      width: "320px",
                      backgroundColor: "transparent",
                      padding: "2.5rem 2rem",
                      border: "1px solid transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#D6D2C4";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(15,27,45,0.1)";
                      e.currentTarget.style.transform = "translateY(-10px)";
                      const content = e.currentTarget.querySelector('.partner-content') as HTMLElement;
                      if (content) content.style.opacity = "1";
                      const logo = e.currentTarget.querySelector('.partner-logo') as HTMLElement;
                      if (logo) { logo.style.opacity = "1"; logo.style.filter = "grayscale(0%)"; logo.style.transform = "scale(1) translateY(0)"; }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                      const content = e.currentTarget.querySelector('.partner-content') as HTMLElement;
                      if (content) content.style.opacity = "0";
                      const logo = e.currentTarget.querySelector('.partner-logo') as HTMLElement;
                      if (logo) { logo.style.opacity = "1"; logo.style.filter = "grayscale(100%)"; logo.style.transform = "scale(2.5) translateY(26px)"; }
                    }}
                  >
                    {/* Logo Section */}
                    <div style={{ height: "64px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.logo ? (
                        <img 
                          className="partner-logo"
                          src={p.logo} 
                          alt={p.name} 
                          style={{ 
                            maxWidth: "100%", 
                            maxHeight: "100%", 
                            objectFit: "contain", 
                            filter: "grayscale(100%)", 
                            opacity: 1, 
                            transform: "scale(2.5) translateY(26px)",
                            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" 
                          }}
                        />
                      ) : (
                        <span className="partner-logo" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#C6A667", opacity: 1, filter: "grayscale(100%)", transform: "scale(2.5) translateY(26px)", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>NH</span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div 
                      className="partner-content"
                      style={{ 
                        flexDirection: "column", 
                        gap: "0.5rem", 
                        width: "100%",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        display: "flex"
                      }}
                    >
                      <h3 style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#0F1B2D",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        margin: 0
                      }}>
                        {p.name}
                      </h3>
                      <p style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        fontSize: "0.75rem",
                        lineHeight: 1.5,
                        color: "rgba(15,27,45,0.7)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "3.5em"
                      }}>
                        {lang === 'en' ? (p.shortDescriptionEn || p.shortDescription || p.actuationEn || p.actuation) : (p.shortDescription || p.actuation)}
                      </p>
                      
                      <div style={{ 
                        marginTop: "1rem",
                        color: "#C6A667", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        gap: "0.5rem", 
                        fontSize: "0.65rem", 
                        fontWeight: 700, 
                        textTransform: "uppercase", 
                        letterSpacing: "0.1em" 
                      }}>
                        {lang === 'en' ? 'View Profile' : 'Ver Perfil'} <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                ))
              ))}
            </div>
            
            {/* Fade Gradients */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#E8E6E1] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#E8E6E1] to-transparent z-10" />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
            <button
              onClick={() => navigate(`/${lang}/parceiros`)}
              className="nh-btn-outline-dark"
              style={{
                border: "1px solid #C6A667",
                color: "#0F1B2D",
                backgroundColor: "transparent",
                padding: "0.875rem 2.5rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#C6A667";
                e.currentTarget.style.color = "#0F1B2D";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#0F1B2D";
              }}
            >
              {lang === "en" ? "Explore All Partners" : "Explorar todos os parceiros"}
            </button>
          </div>
        </section>
      )}

      {/* ── DIFERENCIAIS ── */}
      <section id="diferenciais" style={{ backgroundColor: "#F5F3EE", padding: "6rem 0" }}>
        <div className="container mx-auto">
          <div>
            {/* Full-width content — no generic image */}
            <div style={{ maxWidth: "720px" }}>
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

      {/* —— GOVERNANÇA —— */}
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
                  {t.governance.systemLabel}
                </div>
                {[...t.governance.systemItems].map((area, i) => (
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
            {/* Content Left */}
            <div style={{ paddingRight: "1rem" }}>
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
            </div>

            {/* Mission / Vision / Values Right (Animated Column) */}
            <div>
              <AboutSteps
                features={[
                  { label: t.about.mission, text: t.about.missionText },
                  { label: t.about.vision, text: t.about.visionText },
                  { label: t.about.values, text: t.about.valuesText },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── NOSSA HISTÓRIA ── */}
      <section id="nossa-historia">
        <OurHistory />
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
            <button
              onClick={() => navigate(`/${lang}/contato`)}
              className="nh-btn-gold"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "none", cursor: "pointer" }}
            >
              {t.cta.button} <ArrowRight size={14} />
            </button>
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
                  {contact?.address || "São Gonçalo, Rio de Janeiro"}
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
                    href={`mailto:${contact?.email || "contato@novahabitar.com"}`}
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
                    {contact?.email || "contato@novahabitar.com"}
                  </a>
                </div>
                {contact?.phone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <Mail size={13} style={{ color: "transparent", flexShrink: 0 }} /> {/* Spacer if icon is not Calendar */}
                    <a
                      href={`tel:${contact?.phone}`}
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
                      {contact.phone}
                    </a>
                  </div>
                )}
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
