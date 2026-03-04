/**
 * Nova Habitar — FeatureSteps (Atuação Section)
 * Based on feature-section.tsx from pasted_content_4.txt
 * Adapted: no next/image, uses standard <img>, Nova Habitar brand palette
 * Auto-cycles through actuation steps with progress bar and image transition
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
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
  autoPlayInterval = 4000,
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
      <div className="max-w-6xl mx-auto w-full">
        {title && (
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              letterSpacing: "0.03em",
              color: "#0F1B2D",
              marginBottom: "3rem",
            }}
          >
            {title}
          </h2>
        )}

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-14">
          {/* Left: Steps list */}
          <div className="order-2 md:order-1 space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-5 cursor-pointer"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.35 }}
                transition={{ duration: 0.4 }}
                onClick={() => { setCurrentFeature(index); setProgress(0); }}
              >
                {/* Step indicator */}
                <div style={{ flexShrink: 0, marginTop: "2px" }}>
                  <motion.div
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${index === currentFeature ? "#C6A667" : "#D8D6D1"}`,
                      backgroundColor: index === currentFeature ? "#C6A667" : "transparent",
                      transition: "all 0.3s ease",
                    }}
                    animate={{ scale: index === currentFeature ? 1.08 : 1 }}
                  >
                    {index < currentFeature ? (
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: index === currentFeature ? "#0F1B2D" : "#C6A667",
                        }}
                      >
                        ✓
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          color: index === currentFeature ? "#0F1B2D" : "#2B2F36",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </motion.div>
                  {/* Progress bar under active step */}
                  {index === currentFeature && (
                    <div
                      style={{
                        width: "2px",
                        height: "40px",
                        backgroundColor: "#E8E6E1",
                        margin: "4px auto 0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: `${progress}%`,
                          backgroundColor: "#C6A667",
                          transition: "height 0.1s linear",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      letterSpacing: "0.02em",
                      color: index === currentFeature ? "#0F1B2D" : "#2B2F36",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {feature.title || feature.step}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "#2B2F36",
                      opacity: index === currentFeature ? 0.85 : 0.55,
                    }}
                  >
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Image */}
          <div className="order-1 md:order-2 relative overflow-hidden" style={{ height: "420px" }}>
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 overflow-hidden"
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -60, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.step}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {/* Gold corner accents */}
                      <div style={{ position: "absolute", top: 0, left: 0, width: "2rem", height: "2px", backgroundColor: "#C6A667" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "2rem", backgroundColor: "#C6A667" }} />
                      <div style={{ position: "absolute", bottom: 0, right: 0, width: "2rem", height: "2px", backgroundColor: "#C6A667" }} />
                      <div style={{ position: "absolute", bottom: 0, right: 0, width: "2px", height: "2rem", backgroundColor: "#C6A667" }} />
                      {/* Gradient overlay */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "40%",
                          background: "linear-gradient(to top, rgba(245,243,238,0.5) 0%, transparent 100%)",
                        }}
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
