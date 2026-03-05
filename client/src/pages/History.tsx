/**
 * Nova Habitar — Nossa História / Our History
 * Standalone page with NHTimeline component
 * Design: Navy #0F1B2D background, Gold accents, Montserrat typography
 */

import { useLang } from "@/contexts/LangContext";
import { NHTimeline } from "@/components/NHTimeline";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function History() {
  const { lang } = useLang();
  const [, navigate] = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F1B2D",
        paddingLeft: "72px", // sidebar offset
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "rgba(15,27,45,0.97)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(198,166,103,0.12)",
          padding: "1.25rem 2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <button
          onClick={() => navigate(`/${lang}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "transparent",
            border: "none",
            color: "rgba(245,243,238,0.5)",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#C6A667"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,243,238,0.5)"; }}
        >
          <ArrowLeft size={14} />
          {lang === "pt" ? "Voltar" : "Back"}
        </button>

        <div
          style={{
            width: "1px",
            height: "1.25rem",
            backgroundColor: "rgba(198,166,103,0.2)",
          }}
        />

        <div>
          <div
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C6A667",
              marginBottom: "0.15rem",
            }}
          >
            Nova Habitar
          </div>
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#F5F3EE",
              margin: 0,
            }}
          >
            {lang === "pt" ? "Nossa História" : "Our History"}
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div
        style={{
          padding: "4rem 2.5rem 2rem",
          maxWidth: "720px",
        }}
      >
        <div
          style={{
            width: "3rem",
            height: "2px",
            backgroundColor: "#C6A667",
            marginBottom: "1.5rem",
          }}
        />
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            fontSize: "0.9375rem",
            lineHeight: 1.8,
            color: "rgba(245,243,238,0.65)",
            maxWidth: "600px",
          }}
        >
          {lang === "pt"
            ? "Uma trajetória construída com rigor técnico, governança e visão de longo prazo. Cada marco representa um passo na consolidação de uma plataforma de desenvolvimento imobiliário de alto padrão."
            : "A trajectory built with technical rigor, governance and long-term vision. Each milestone represents a step in consolidating a high-standard real estate development platform."}
        </p>
      </div>

      {/* Timeline */}
      <div style={{ padding: "0 0 6rem" }}>
        <NHTimeline />
      </div>
    </div>
  );
}
