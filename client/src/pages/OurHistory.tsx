import { useState, useEffect } from "react";
import { timelineApi, settingsApi, type TimelineEntry } from "@/lib/apiClient";
import { Timeline } from "@/components/ui/timeline";
import { useLang } from "@/contexts/LangContext";
import { ArrowRight } from "lucide-react";

export default function OurHistory() {
  const { lang } = useLang();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [visible, setVisible] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");

  useEffect(() => {
    settingsApi.get().then((settings) => {
      setVisible(settings.historyPageVisible);
      setSubtitle(settings.historySubtitle || "");
      setSubtitleEn(settings.historySubtitleEn || "");
    }).catch(console.error);

    timelineApi.getAll().then((loaded) => {
      setEntries([...loaded].sort((a, b) => b.date.localeCompare(a.date)));
    }).catch(console.error);
  }, []);

  if (!visible) {
    return null;
  }

  // Format data for the Timeline component
  const timelineData = entries.map((entry) => ({
    title: entry.date,
    content: (
      <div style={{ paddingBottom: "3rem" }}>
        <h4 style={{ 
          fontFamily: "'Montserrat', sans-serif", 
          fontSize: "1.25rem", 
          fontWeight: 700, 
          color: "#0F1B2D", 
          marginBottom: "1rem" 
        }}>
          {lang === "en" ? (entry.titleEn || entry.title) : entry.title}
        </h4>
        <p style={{ 
          fontFamily: "'Montserrat', sans-serif", 
          fontSize: "0.95rem", 
          lineHeight: 1.6, 
          color: "rgba(15,27,45,0.7)",
          marginBottom: entry.photo || entry.link ? "1.5rem" : "0"
        }}>
          {lang === "en" ? (entry.descriptionEn || entry.description) : entry.description}
        </p>
        
        {entry.photo && (
          <div style={{ position: "relative", width: "100%", maxWidth: "600px", aspectRatio: "16/9", overflow: "hidden", borderRadius: "8px", marginBottom: "1.5rem" }}>
            <img 
              src={entry.photo} 
              alt={entry.title} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
        )}

        {entry.link && (
          <a 
            href={entry.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#C6A667",
              textDecoration: "none"
            }}
          >
            {lang === "en" ? "Learn more" : "Saiba mais"} <ArrowRight size={14} />
          </a>
        )}
      </div>
    )
  }));

  // Render dummy data if it's empty to show something beautiful automatically
  // As requested in user's prompt (demo.tsx styling) but adopted to our needs
  const fallbackData = [
    {
      title: "2024",
      content: (
        <div style={{ paddingBottom: "3rem" }}>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0F1B2D", marginBottom: "1rem" }}>
            Expansão e Novos Horizontes
          </h4>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(15,27,45,0.7)" }}>
            Iniciamos um novo ciclo de investimentos, consolidando nossa posição no mercado imobiliário com grandes entregas.
          </p>
        </div>
      )
    },
    {
      title: "2018",
      content: (
        <div style={{ paddingBottom: "3rem" }}>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0F1B2D", marginBottom: "1rem" }}>
            Marco de Excelência
          </h4>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(15,27,45,0.7)" }}>
            Entrega do nosso maior empreendimento multiuso. Reconhecimento nacional pela inovação na integração de moradia e infraestrutura comercial.
          </p>
        </div>
      )
    },
    {
      title: "2012",
      content: (
        <div style={{ paddingBottom: "3rem" }}>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0F1B2D", marginBottom: "1rem" }}>
            A Fundação
          </h4>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(15,27,45,0.7)" }}>
            A Incorporadora e Construtora Nova Habitar inicia suas operações, focada no desenvolvimento e execução de empreendimentos imobiliários estruturados.
          </p>
        </div>
      )
    }
  ];

  const fallbackDataEn = [
    {
      title: "2024",
      content: (
        <div style={{ paddingBottom: "3rem" }}>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0F1B2D", marginBottom: "1rem" }}>
            Expansion and New Horizons
          </h4>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(15,27,45,0.7)" }}>
            We started a new investment cycle, consolidating our position in the real estate market with major deliveries.
          </p>
        </div>
      )
    },
    {
      title: "2018",
      content: (
        <div style={{ paddingBottom: "3rem" }}>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0F1B2D", marginBottom: "1rem" }}>
            Excellence Milestone
          </h4>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(15,27,45,0.7)" }}>
            Delivery of our largest mixed-use development. Nationwide recognition for innovation in integrating housing and commercial infrastructure.
          </p>
        </div>
      )
    },
    {
      title: "2012",
      content: (
        <div style={{ paddingBottom: "3rem" }}>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0F1B2D", marginBottom: "1rem" }}>
            The Foundation
          </h4>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(15,27,45,0.7)" }}>
            Nova Habitar Developer and Builder started its operations, focused on the development and execution of structured real estate developments.
          </p>
        </div>
      )
    }
  ];

  return (
    <div style={{ backgroundColor: "#F5F3EE" }}>
      <Timeline 
        title={lang === "en" ? "Our History" : "Nossa História"}
        subtitle={lang === "en" ? subtitleEn : subtitle}
        data={entries.length > 0 ? timelineData : (lang === "en" ? fallbackDataEn : fallbackData)} 
      />
    </div>
  );
}
