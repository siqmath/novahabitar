/**
 * Nova Habitar — Sidebar Navigation
 * Left expandable sidebar with logo (200% larger), nav links, language toggle
 * Design: Navy #0F1B2D, Gold #C6A667 accents, Montserrat typography
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLang } from "@/contexts/LangContext";
import { motion } from "framer-motion";
import { settingsApi } from "@/lib/apiClient";
import {
  Home,
  FolderOpen,
  Layers,
  Star,
  ShieldCheck,
  Leaf,
  Users,
  Mail,
  ChevronRight,
  Menu,
  X,
  Handshake,
  BookOpen,
} from "lucide-react";

// Logo Solo fundo escuro monocromático — used in sidebar (collapsed: solo icon; expanded: full)
const LOGO_SOLO =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/QbamnFCNndHCmpVS.png?Expires=1804180331&Signature=czJHa~GxkfsgzV32dORWqWegMJlzEx5sIywT3WOyXwumjYFQZhCpWhXvKZ1PUnWhcXGSRUd1OEoXuOqNnwcK85Ep11xPktDS2YJp10KGNbB7PkstpJCNbcYfnm7onQuHhkjx843VR1hAWq~OsXNJF5Jxl4Y-NAUTF5HFYREOjqKjUJ9BqJpRZFz~c1W6cavTg5NOR050QVLLX2WptMNnvwivbsXC9e2j-woAlOl75oZcSZlhQ~8sbzFvTpydTKWyUeZEjZqnVEO2QKA4KOopX3cP15TchNXRU6ylJpM1jRXHqAGceRpGonOPGLKY-7i5xD-WGM-4FpeKWv3I0sgvdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const { t, lang, setLang } = useLang();
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      settingsApi.get().then((s) => setShowHistory(s.historyPageVisible)).catch(console.error);
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("nh_settings_updated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("nh_settings_updated", handleStorageChange);
    };
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { icon: <Home size={18} />, label: t.nav.home, path: `/${lang}`, action: () => { navigate(`/${lang}`); setTimeout(() => document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" }), 100); } },
    { icon: <Layers size={18} />, label: t.nav.actuation, path: "#atuacao", action: () => scrollTo("atuacao") },
    { icon: <FolderOpen size={18} />, label: t.nav.projects, path: `/${lang}/projetos`, action: () => navigate(`/${lang}/projetos`) },
    { icon: <Handshake size={18} />, label: lang === "en" ? "Partners" : "Parceiros", path: `/${lang}/parceiros`, action: () => navigate(`/${lang}/parceiros`) },
    { icon: <Star size={18} />, label: t.nav.differentials, path: "#diferenciais", action: () => scrollTo("diferenciais") },
    { icon: <ShieldCheck size={18} />, label: t.nav.governance, path: "#governanca", action: () => scrollTo("governanca") },
    { icon: <Leaf size={18} />, label: t.nav.sustainability, path: "#sustentabilidade", action: () => scrollTo("sustentabilidade") },
    { icon: <Users size={18} />, label: t.nav.about, path: "#quem-somos", action: () => scrollTo("quem-somos") },
    ...(showHistory ? [{ icon: <BookOpen size={18} />, label: lang === "en" ? "Our History" : "Nossa História", path: "#nossa-historia", action: () => scrollTo("nossa-historia") }] : []),
    { icon: <Mail size={18} />, label: t.nav.contact, path: `/${lang}/contato`, action: () => navigate(`/${lang}/contato`) },
  ];

  const scrollTo = (hash: string) => {
    // If not on home page, navigate first then scroll
    if (!location.endsWith(`/${lang}`) && location !== `/${lang}`) {
      navigate(`/${lang}`);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const isOpen = expanded || mobileOpen;

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-[60] md:hidden flex items-center justify-center w-10 h-10"
        style={{ backgroundColor: "#0F1B2D", color: "#F5F3EE" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[45] md:hidden"
          style={{ backgroundColor: "rgba(15,27,45,0.6)", backdropFilter: "blur(2px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`nh-sidebar ${expanded ? "expanded" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Premium Language Selector — Above Logo */}
        <div 
          className="flex items-center justify-center py-6 w-full"
          style={{ borderBottom: "1px solid rgba(198,166,103,0.08)" }}
        >
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              backgroundColor: "rgba(10,20,32,0.8)", 
              padding: "2px",
              borderRadius: "20px",
              position: "relative",
              width: isOpen ? "84px" : "44px", // Smaller when collapsed
              height: "30px",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(198,166,103,0.25)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)"
            }}
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          >
            {/* Flag Icons (Only visible when expanded) */}
            {isOpen && (
              <div style={{ 
                display: "flex", 
                width: "100%", 
                justifyContent: "space-between",
                padding: "0 6px",
                alignItems: "center",
                zIndex: 0
              }}>
                <img 
                  src="https://flagcdn.com/w40/br.png" 
                  alt="PT" 
                  style={{ width: "16px", height: "auto", borderRadius: "1px", opacity: 1, transition: "opacity 0.3s" }} 
                />
                <img 
                  src="https://flagcdn.com/w40/us.png" 
                  alt="EN" 
                  style={{ width: "16px", height: "auto", borderRadius: "1px", opacity: 1, transition: "opacity 0.3s" }} 
                />
              </div>
            )}

            {/* Premium Sliding Knob */}
            <motion.div 
              animate={{ 
                x: lang === "pt" ? 0 : (isOpen ? 44 : 12),
                width: isOpen ? "36px" : "28px" 
              }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              style={{
                position: "absolute",
                top: "1px",
                left: "2px",
                height: "26px",
                backgroundColor: "#F5F3EE",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                boxShadow: "0 3px 6px rgba(0,0,0,0.5)",
              }}
            >
              {isOpen ? (
                <img
                  src={lang === "pt" ? "https://flagcdn.com/w40/br.png" : "https://flagcdn.com/w40/us.png"}
                  alt={lang === "pt" ? "PT" : "EN"}
                  style={{ width: "18px", height: "auto", borderRadius: "2px" }}
                />
              ) : (
                <span style={{ 
                  fontFamily: "'Montserrat', sans-serif", 
                  fontSize: "0.6rem", 
                  fontWeight: 800, 
                  color: "#0F1B2D",
                  letterSpacing: "0.01em"
                }}>
                  {lang === "pt" ? "PT" : "EN"}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Logo area — 200% larger */}
        <div
          className="flex items-center w-full px-3 py-4"
          style={{
            borderBottom: "1px solid rgba(198,166,103,0.12)",
            minHeight: "88px",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/${lang}`)}
        >
          <img
              src={LOGO_SOLO}
              alt="NOVA HABITAR"
              style={{
                height: isOpen ? "64px" : "44px",
                width: "auto",
                maxWidth: isOpen ? "160px" : "44px",
                objectFit: "contain",
                objectPosition: "left center",
                transition: "all 0.25s ease",
              }}
            />
        </div>

        {/* Nav items */}
        <nav className="flex flex-col w-full flex-1 py-4 gap-0.5 overflow-hidden">
          {navItems.map((item, idx) => {
            const isActive = location === item.path || (item.path.startsWith("/") && location.startsWith(item.path));

            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex items-center w-full px-4 py-3 transition-all duration-150"
                style={{
                  color: isActive ? "#C6A667" : "rgba(245,243,238,0.65)",
                  background: isActive ? "rgba(198,166,103,0.07)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "2px solid #C6A667" : "2px solid transparent",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  gap: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#C6A667";
                  e.currentTarget.style.backgroundColor = "rgba(198,166,103,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive ? "#C6A667" : "rgba(245,243,238,0.65)";
                  e.currentTarget.style.backgroundColor = isActive ? "rgba(198,166,103,0.07)" : "transparent";
                }}
              >
                <span style={{ flexShrink: 0, width: "18px" }}>{item.icon}</span>
                {isOpen && (
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      opacity: 1,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Only expand hint */}
        <div
          className="w-full px-4 py-4 flex flex-col gap-3"
          style={{ borderTop: "1px solid rgba(198,166,103,0.12)" }}
        >
          {/* Expand hint (only when collapsed on desktop) */}
          {!isOpen && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                color: "rgba(198,166,103,0.4)",
              }}
            >
              <ChevronRight size={14} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
