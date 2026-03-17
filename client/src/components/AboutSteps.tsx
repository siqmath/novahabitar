import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AboutFeature {
  label: string;
  text: string;
}

interface AboutStepsProps {
  features: AboutFeature[];
  autoPlayInterval?: number;
}

export function AboutSteps({ features, autoPlayInterval = 4500 }: AboutStepsProps) {
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
    <div className="flex flex-col gap-4">
      {features.map((feature, index) => {
        const isActive = index === currentFeature;
        return (
          <motion.div
            key={index}
            onClick={() => {
              setCurrentFeature(index);
              setProgress(0);
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: isActive ? 1 : 0.65,
              x: 0,
              scale: isActive ? 1.02 : 1,
            }}
            whileHover={{ opacity: 0.9, scale: 1.01 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              cursor: "pointer",
              padding: "1.5rem",
              border: `1px solid ${isActive ? "rgba(198,166,103,0.8)" : "rgba(15,27,45,0.1)"}`,
              backgroundColor: isActive ? "#ffffff" : "transparent",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Active: left border accent instead of top border for vertical variation? No, top border is fine, or left. Let's do left border for vertical stacking to look cool. */}
            {isActive && (
              <motion.div
                layoutId="active-left-border-about"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "3px",
                  backgroundColor: "#C6A667",
                }}
                transition={{ duration: 0.3 }}
              />
            )}

            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: isActive ? "#C6A667" : "#0F1B2D",
                marginBottom: "0.5rem",
                transition: "color 0.3s ease",
              }}
            >
              {feature.label}
            </div>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: "0.825rem",
                lineHeight: 1.6,
                marginTop: 0,
                color: isActive ? "#0F1B2D" : "#2B2F36",
                transition: "color 0.3s ease",
              }}
            >
              {feature.text}
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
  );
}
