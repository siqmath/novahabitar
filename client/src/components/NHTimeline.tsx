/**
 * Nova Habitar — Timeline Component
 * Design: Aceternity Timeline (pasted_content_6) adapted for Nova Habitar
 * - Navy/Gold palette, Montserrat font
 * - useScroll fixed: uses containerRef properly after mount
 * - Supports optional photo per entry
 * - Reads from timelineStore
 */

import React, { useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import { ExternalLink } from "lucide-react";
import { timelineApi, type TimelineEntry } from "@/lib/apiClient";
import { useLang } from "@/contexts/LangContext";
import { useLocation } from "wouter";

export function NHTimeline() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    timelineApi.getAll().then((loaded) => {
      setEntries(loaded);
      setMounted(true);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (ref.current && mounted) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [entries, mounted]);

  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  if (!mounted || entries.length === 0) return null;

  return (
    <div
      className="w-full font-sans"
      ref={containerRef}
      style={{ backgroundColor: "#0F1B2D" }}
    >
      <div ref={ref} className="relative max-w-3xl mx-auto pb-20 px-6 md:px-10">
        {entries.map((item, index) => (
          <div
            key={item.id}
            className="flex justify-start pt-10 md:pt-16 md:gap-10"
          >
            {/* Left: sticky dot + date */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                className="h-9 absolute left-3 md:left-3 w-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0F1B2D", border: "2px solid rgba(198,166,103,0.35)" }}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: "#C6A667" }}
                />
              </div>
              <h3
                className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold"
                style={{ color: "rgba(198,166,103,0.55)", fontFamily: "'Montserrat', sans-serif" }}
              >
                {item.date}
              </h3>
            </div>

            {/* Right: content */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3
                className="md:hidden block text-xl mb-3 text-left font-bold"
                style={{ color: "rgba(198,166,103,0.55)", fontFamily: "'Montserrat', sans-serif" }}
              >
                {item.date}
              </h3>

              <div className="mb-2 flex items-center gap-2">
                <h4
                  className="font-bold text-base"
                  style={{ color: "#F5F3EE", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.02em" }}
                >
                  {item.title}
                </h4>
                {item.link && (
                  <button
                    onClick={() => navigate(item.link!)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: "#C6A667", background: "none", border: "none", cursor: "pointer" }}
                    title={lang === "en" ? "View project" : "Ver projeto"}
                  >
                    <ExternalLink size={13} />
                  </button>
                )}
              </div>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "rgba(245,243,238,0.5)", fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
              >
                {item.description}
              </p>

              {/* Optional photo */}
              {item.photo && (
                <div className="mt-3 mb-2">
                  <img
                    src={item.photo}
                    alt={item.title}
                    className="rounded-lg object-cover w-full max-w-sm"
                    style={{
                      height: "160px",
                      boxShadow: "0 0 24px rgba(0,0,0,0.3), 0 1px 1px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(198,166,103,0.15)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Animated vertical line — Aceternity style */}
        <div
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px]"
          style={{
            height: `${height}px`,
            background: "linear-gradient(to bottom, transparent 0%, rgba(198,166,103,0.2) 10%, rgba(198,166,103,0.2) 90%, transparent 100%)",
          }}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: "linear-gradient(to bottom, #C6A667 0%, rgba(198,166,103,0.4) 60%, transparent 100%)",
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
