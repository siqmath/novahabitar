/**
 * Nova Habitar — Project Carousel
 * Based on elegant-carousel.tsx pattern from pasted_content_2.txt
 * Adapted for Nova Habitar brand: Navy/Gold palette, Montserrat typography, sharp corners
 * Reads from projectStore (featured projects)
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { MapPin, ArrowRight } from "lucide-react";
import { projectStore, STATUS_LABELS, STATUS_LABELS_EN, type Project } from "@/lib/store";
import { useLang } from "@/contexts/LangContext";

const GOLD = "#C6A667";
const NAVY = "#0F1B2D";

export default function ProjectCarousel() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const SLIDE_DURATION = 6000;
  const TRANSITION_DURATION = 700;

  useEffect(() => {
    const featured = projectStore.getFeatured();
    setProjects(featured.length > 0 ? featured : projectStore.getAll().slice(0, 4));
  }, []);

  const goToSlide = useCallback(
    (index: number, dir?: "next" | "prev") => {
      if (isTransitioning || index === currentIndex || projects.length === 0) return;
      setDirection(dir || (index > currentIndex ? "next" : "prev"));
      setIsTransitioning(true);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 50);
      }, TRANSITION_DURATION / 2);
    },
    [isTransitioning, currentIndex, projects.length]
  );

  const goNext = useCallback(() => {
    if (projects.length === 0) return;
    goToSlide((currentIndex + 1) % projects.length, "next");
  }, [currentIndex, goToSlide, projects.length]);

  const goPrev = useCallback(() => {
    if (projects.length === 0) return;
    goToSlide((currentIndex - 1 + projects.length) % projects.length, "prev");
  }, [currentIndex, goToSlide, projects.length]);

  useEffect(() => {
    if (isPaused || projects.length === 0) return;
    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / (SLIDE_DURATION / 50)));
    }, 50);
    intervalRef.current = setInterval(goNext, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPaused, goNext, projects.length]);

  if (projects.length === 0) return null;

  const current = projects[currentIndex];
  const coverUrl = current.images[current.mainImageIndex]?.url || current.images[0]?.url || "";
  const statusLabel = lang === "en"
    ? STATUS_LABELS_EN[current.status]
    : STATUS_LABELS[current.status];

  const statusColors: Record<string, { bg: string; color: string }> = {
    entregue: { bg: "rgba(198,166,103,0.15)", color: GOLD },
    "em-obras": { bg: "rgba(15,27,45,0.12)", color: "#2B2F36" },
    "em-desenvolvimento": { bg: "rgba(15,27,45,0.08)", color: "#2B2F36" },
    previsto: { bg: "rgba(15,27,45,0.06)", color: "#2B2F36" },
  };
  const sc = statusColors[current.status] || statusColors.previsto;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "560px",
        backgroundColor: NAVY,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.targetTouches[0].clientX; }}
      onTouchMove={(e) => { touchEndX.current = e.targetTouches[0].clientX; }}
      onTouchEnd={() => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 60) diff > 0 ? goNext() : goPrev();
      }}
    >
      {/* Background image with overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transition: `opacity ${TRANSITION_DURATION}ms ease`,
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        <img
          src={coverUrl}
          alt={current.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(15,27,45,0.97) 0%, rgba(15,27,45,0.75) 50%, rgba(15,27,45,0.2) 100%)",
          }}
        />
      </div>

      {/* Gold accent wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 70% 50%, ${GOLD}10 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="container mx-auto"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
          padding: "5rem 3rem",
          flex: 1,
        }}
      >
        {/* Left: text */}
        <div
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning
              ? direction === "next" ? "translateY(20px)" : "translateY(-20px)"
              : "translateY(0)",
            transition: `opacity ${TRANSITION_DURATION * 0.6}ms ease, transform ${TRANSITION_DURATION * 0.6}ms ease`,
          }}
        >
          {/* Counter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ display: "block", width: "2rem", height: "1px", backgroundColor: GOLD }} />
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                color: GOLD,
              }}
            >
              {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* Status badge */}
          <div
            style={{
              display: "inline-block",
              backgroundColor: sc.bg,
              color: sc.color,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.3rem 0.75rem",
              border: `1px solid ${sc.color}40`,
              marginBottom: "1rem",
            }}
          >
            {statusLabel}
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              letterSpacing: "0.03em",
              color: "#F5F3EE",
              marginBottom: "0.75rem",
              lineHeight: 1.2,
            }}
          >
            {current.title}
          </h2>

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: GOLD,
              marginBottom: "1.25rem",
              opacity: 0.85,
            }}
          >
            <MapPin size={13} />
            {current.location}
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "rgba(245,243,238,0.65)",
              marginBottom: "1.75rem",
              maxWidth: "440px",
            }}
          >
            {current.description}
          </p>

          {/* Techniques */}
          {current.techniques.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "2rem" }}>
              {current.techniques.map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(245,243,238,0.6)",
                    border: "1px solid rgba(245,243,238,0.15)",
                    padding: "0.25rem 0.6rem",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* CTA + arrows */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <a
              href={`/${lang}/projetos/${projects[currentIndex]?.slug || ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (projects[currentIndex]?.slug) {
                  navigate(`/${lang}/projetos/${projects[currentIndex].slug}`);
                }
              }}
              className="nh-btn-gold"
            >
              {lang === "en" ? "View project" : "Ver projeto"} <ArrowRight size={14} />
            </a>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={goPrev}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid rgba(198,166,103,0.3)",
                  backgroundColor: "transparent",
                  color: GOLD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(198,166,103,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,166,103,0.3)";
                }}
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid rgba(198,166,103,0.3)",
                  backgroundColor: "transparent",
                  color: GOLD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(198,166,103,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,166,103,0.3)";
                }}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: image frame */}
        <div
          style={{
            position: "relative",
            height: "380px",
            overflow: "hidden",
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning
              ? direction === "next" ? "scale(0.96)" : "scale(1.04)"
              : "scale(1)",
            transition: `opacity ${TRANSITION_DURATION * 0.5}ms ease, transform ${TRANSITION_DURATION * 0.5}ms ease`,
          }}
        >
          <img
            src={coverUrl}
            alt={current.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Gold corner accents */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "2.5rem", height: "2px", backgroundColor: GOLD }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "2.5rem", backgroundColor: GOLD }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "2.5rem", height: "2px", backgroundColor: GOLD }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "2px", height: "2.5rem", backgroundColor: GOLD }} />
        </div>
      </div>

      {/* Progress indicators */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          gap: "0.75rem",
          padding: "0 3rem 2rem",
        }}
      >
        {projects.map((proj, i) => (
          <button
            key={proj.id}
            onClick={() => goToSlide(i)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              flex: 1,
              maxWidth: "160px",
            }}
            aria-label={`Go to ${proj.title}`}
          >
            <div
              style={{
                height: "2px",
                backgroundColor: "rgba(198,166,103,0.2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: GOLD,
                  width: i === currentIndex ? `${progress}%` : i < currentIndex ? "100%" : "0%",
                  transition: i === currentIndex ? "none" : "width 0.3s ease",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                fontWeight: i === currentIndex ? 600 : 400,
                letterSpacing: "0.06em",
                color: i === currentIndex ? GOLD : "rgba(245,243,238,0.35)",
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "color 0.2s ease",
              }}
            >
              {proj.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
