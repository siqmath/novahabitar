/**
 * Nova Habitar — Animated Hero Section
 * Animated word cycling: "Atuação que garante [previsibilidade|solidez|valor|excelência]"
 * Based on framer-motion spring animation pattern from pasted_content.txt
 * Design: Navy overlay on architecture photo, Montserrat Bold titles, Gold accent on animated word
 */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Layers } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const HERO_IMAGE =
  "https://cdn.abacus.ai/images/82408a85-1d28-4ae0-a10b-32c472db4848.png";

export default function AnimatedHero() {
  const { t } = useLang();
  const [wordIndex, setWordIndex] = useState(0);
  const words = useMemo(() => t.hero.words, [t.hero.words]);

  useEffect(() => {
    const id = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2200);
    return () => clearTimeout(id);
  }, [wordIndex, words]);

  // Reset index when language changes
  useEffect(() => {
    setWordIndex(0);
  }, [words]);

  const badges = [
    { icon: <Calendar size={13} />, text: t.hero.badge1 },
    { icon: <MapPin size={13} />, text: t.hero.badge2 },
    { icon: <Layers size={13} />, text: t.hero.badge3 },
  ];

  return (
    <section
      id="inicio"
      className="relative flex items-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Empreendimento Nova Habitar"
          className="w-full h-full object-cover object-center"
        />
        {/* Deep navy gradient — left heavy for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(15,27,45,0.96) 0%, rgba(15,27,45,0.82) 55%, rgba(15,27,45,0.35) 100%)",
          }}
        />
        {/* Subtle gold grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 10% 50%, rgba(198,166,103,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 container mx-auto"
        style={{ paddingTop: "8rem", paddingBottom: "6rem" }}
      >
        <div style={{ maxWidth: "680px" }}>
          {/* Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#C6A667",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                display: "block",
                width: "1.5rem",
                height: "1px",
                backgroundColor: "#C6A667",
              }}
            />
            NOVA HABITAR
          </div>

          {/* Animated headline */}
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "0.03em",
              lineHeight: 1.15,
              color: "#F5F3EE",
              marginBottom: "0",
            }}
          >
            {t.hero.prefix}
          </h1>

          {/* Animated word container */}
          <div
            style={{
              position: "relative",
              height: "clamp(3rem, 7vw, 5rem)",
              overflow: "hidden",
              marginBottom: "1.75rem",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={words[wordIndex]}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ type: "spring", stiffness: 60, damping: 14 }}
                style={{
                  position: "absolute",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  letterSpacing: "0.03em",
                  lineHeight: 1.2,
                  color: "#C6A667",
                  display: "block",
                  top: 0,
                  left: 0,
                }}
              >
                {words[wordIndex]}.
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
              lineHeight: 1.75,
              color: "rgba(245,243,238,0.72)",
              marginBottom: "2.5rem",
              maxWidth: "560px",
            }}
          >
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "3rem",
            }}
          >
            <a
              href="#projetos"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projetos")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="nh-btn-gold"
            >
              {t.hero.cta1} <ArrowRight size={14} />
            </a>
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="nh-btn-outline-light"
            >
              {t.hero.cta2}
            </a>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.75rem" }}>
            {badges.map((badge, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "rgba(245,243,238,0.55)",
                }}
              >
                <span style={{ color: "#C6A667" }}>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "2.5rem",
            backgroundColor: "rgba(198,166,103,0.4)",
          }}
        />
      </div>
    </section>
  );
}
