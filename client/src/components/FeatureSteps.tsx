/**
 * Nova Habitar — FeatureSteps (Atuação Section)
 * Design: Motion-driven cards — same animation philosophy as Sustentabilidade
 * NO images — pure typography + animated highlight + progress bar
 * Auto-cycles through steps; click to select
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image?: string; // kept for interface compat, not rendered
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
}

export function FeatureSteps({
  features,
  className,
  title,
  autoPlayInterval = 4500,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentFeature((f) => (f + 1) % features.length);
          return 0;
        }
        return prev + 100 / (autoPlayInterval / 100);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [features.length, autoPlayInterval]);

  return (
    <div className={cn("py-16 px-6 md:px-12", className)}>
      <div className="max-w-5xl mx-auto w-full">
        {/* Steps grid — same card approach as Sustentabilidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const isActive = index === currentFeature;
            return (
              <motion.div
                key={index}
                onClick={() => { setCurrentFeature(index); setProgress(0); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isActive ? 1 : 0.55,
                  y: 0,
                  scale: isActive ? 1.02 : 1,
                }}
                whileHover={{ opacity: 0.85, scale: 1.01 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  cursor: "pointer",
                  padding: "1.5rem",
                  border: `1px solid ${isActive ? "rgba(198,166,103,0.6)" : "rgba(198,166,103,0.15)"}`,
                  backgroundColor: isActive ? "rgba(198,166,103,0.06)" : "rgba(245,243,238,0.03)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.3s ease, background-color 0.3s ease",
                }}
              >
                {/* Active: gold top border accent */}
                {isActive && (
                  <motion.div
                    layoutId="active-top-border"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "#C6A667",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Step number */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1.5px solid ${isActive ? "#C6A667" : "rgba(198,166,103,0.3)"}`,
                      backgroundColor: isActive ? "#C6A667" : "transparent",
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        color: isActive ? "#0F1B2D" : "rgba(198,166,103,0.7)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {index < currentFeature ? "✓" : String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      letterSpacing: "0.03em",
                      color: isActive ? "#F5F3EE" : "rgba(245,243,238,0.65)",
                      lineHeight: 1.3,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {feature.title || feature.step}
                  </h3>
                </div>

                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.825rem",
                    lineHeight: 1.7,
                    color: isActive ? "rgba(245,243,238,0.75)" : "rgba(245,243,238,0.4)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {feature.content}
                </p>

                {/* Progress bar at bottom of active card */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "rgba(198,166,103,0.15)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        backgroundColor: "#C6A667",
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
