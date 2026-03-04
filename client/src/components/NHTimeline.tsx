/**
 * Nova Habitar — Timeline Component
 * Based on timeline.tsx from pasted_content_5.txt
 * Fixed: removed useScroll (causes "ref not hydrated" error in framer-motion)
 * Uses IntersectionObserver for scroll-driven animation instead
 * Reads from timelineStore, supports optional link to /projetos
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { timelineStore, type TimelineEntry } from "@/lib/store";
import { useLang } from "@/contexts/LangContext";
import { useLocation } from "wouter";

function TimelineItem({
  item,
  index,
  lang,
  navigate,
}: {
  item: TimelineEntry;
  index: number;
  lang: string;
  navigate: (path: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        paddingTop: index === 0 ? "3rem" : "3.5rem",
        gap: "2rem",
      }}
    >
      {/* Left: dot + date */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "72px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#0F1B2D",
            border: "2px solid rgba(198,166,103,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#C6A667",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            color: "rgba(198,166,103,0.7)",
            marginTop: "0.45rem",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {item.date}
        </span>
      </div>

      {/* Right: content */}
      <div style={{ flex: 1, paddingBottom: "1rem" }}>
        <h3
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            letterSpacing: "0.03em",
            color: "#F5F3EE",
            marginBottom: "0.45rem",
            lineHeight: 1.35,
          }}
        >
          {item.title}
          {item.link && (
            <button
              onClick={() => navigate(item.link!)}
              style={{
                marginLeft: "0.5rem",
                color: "#C6A667",
                background: "none",
                border: "none",
                cursor: "pointer",
                verticalAlign: "middle",
              }}
              title={lang === "en" ? "View project" : "Ver projeto"}
            >
              <ExternalLink size={12} />
            </button>
          )}
        </h3>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            fontSize: "0.825rem",
            lineHeight: 1.7,
            color: "rgba(245,243,238,0.52)",
          }}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export function NHTimeline() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    setEntries(timelineStore.getAll());
  }, []);

  // Measure container height after entries load
  useEffect(() => {
    if (containerRef.current && entries.length > 0) {
      const observer = new ResizeObserver(() => {
        if (containerRef.current) {
          setLineHeight(containerRef.current.scrollHeight);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#0F1B2D",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div ref={containerRef} className="relative max-w-xl mx-auto pb-16 px-6">
        {entries.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={index}
            lang={lang}
            navigate={navigate}
          />
        ))}

        {/* Static vertical line */}
        <div
          style={{
            position: "absolute",
            left: "calc(1.5rem + 16px)",
            top: "3rem",
            bottom: "4rem",
            width: "2px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(198,166,103,0.2) 10%, rgba(198,166,103,0.2) 90%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
