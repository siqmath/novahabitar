import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  title?: string;
  subtitle?: string;
}

export const Timeline = ({ data, title, subtitle }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10"
      style={{ backgroundColor: "#F5F3EE" }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 max-w-4xl" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: "#0F1B2D", textTransform: "uppercase" }}>
          {title || "Nossa História"}
        </h2>
        <p className="text-sm md:text-base max-w-sm" style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(15,27,45,0.7)" }}>
          {subtitle || "A trajetória da Nova Habitar, marcada por solidez, crescimento e grandes realizações no mercado imobiliário."}
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
                <div className="h-4 w-4 rounded-full p-2" style={{ backgroundColor: "#C6A667", border: "1px solid rgba(198,166,103,1)" }} />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold" style={{ color: "rgba(15,27,45,0.4)", fontFamily: "'Montserrat', sans-serif" }}>
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold" style={{ color: "rgba(15,27,45,0.4)", fontFamily: "'Montserrat', sans-serif" }}>
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: "linear-gradient(to bottom, #C6A667 0%, #0F1B2D 10%, transparent 100%)"
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
