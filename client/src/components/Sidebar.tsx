/**
 * Nova Habitar — Sidebar Navigation
 * Left expandable sidebar with logo (200% larger), nav links, language toggle
 * Design: Navy #0F1B2D, Gold #C6A667 accents, Montserrat typography
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLang } from "@/contexts/LangContext";
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
  Settings,
} from "lucide-react";

// Logo Solo fundo escuro monocromático — used in sidebar (collapsed: solo icon; expanded: full)
const LOGO_SOLO =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/QbamnFCNndHCmpVS.png?Expires=1804180331&Signature=czJHa~GxkfsgzV32dORWqWegMJlzEx5sIywT3WOyXwumjYFQZhCpWhXvKZ1PUnWhcXGSRUd1OEoXuOqNnwcK85Ep11xPktDS2YJp10KGNbB7PkstpJCNbcYfnm7onQuHhkjx843VR1hAWq~OsXNJF5Jxl4Y-NAUTF5HFYREOjqKjUJ9BqJpRZFz~c1W6cavTg5NOR050QVLLX2WptMNnvwivbsXC9e2j-woAlOl75oZcSZlhQ~8sbzFvTpydTKWyUeZEjZqnVEO2QKA4KOopX3cP15TchNXRU6ylJpM1jRXHqAGceRpGonOPGLKY-7i5xD-WGM-4FpeKWv3I0sgvdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang, setLang } = useLang();
  const [location, navigate] = useLocation();

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { icon: <Home size={18} />, label: t.nav.home, action: () => { navigate(`/${lang}`); setTimeout(() => document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" }), 100); } },
    { icon: <FolderOpen size={18} />, label: t.nav.projects, action: () => navigate(`/${lang}/projetos`) },
    { icon: <Layers size={18} />, label: t.nav.actuation, action: () => scrollTo("atuacao") },
    { icon: <Star size={18} />, label: t.nav.differentials, action: () => scrollTo("diferenciais") },
    { icon: <ShieldCheck size={18} />, label: t.nav.governance, action: () => scrollTo("governanca") },
    { icon: <Leaf size={18} />, label: t.nav.sustainability, action: () => scrollTo("sustentabilidade") },
    { icon: <Users size={18} />, label: t.nav.about, action: () => scrollTo("quem-somos") },
    { icon: <Mail size={18} />, label: t.nav.contact, action: () => navigate(`/${lang}/contato`) },
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
            const isActive =
              idx === 1
                ? location.includes("/projetos")
                : !location.includes("/projetos") && location.startsWith(`/${lang}`);

            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex items-center w-full px-4 py-3 transition-all duration-150"
                style={{
                  color: idx === 1 && location.includes("/projetos") ? "#C6A667" : "rgba(245,243,238,0.65)",
                  background: idx === 1 && location.includes("/projetos") ? "rgba(198,166,103,0.07)" : "transparent",
                  border: "none",
                  borderLeft: idx === 1 && location.includes("/projetos") ? "2px solid #C6A667" : "2px solid transparent",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  gap: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#C6A667";
                  e.currentTarget.style.backgroundColor = "rgba(198,166,103,0.07)";
                }}
                onMouseLeave={(e) => {
                  const isPortfolio = idx === 1 && location.includes("/projetos");
                  e.currentTarget.style.color = isPortfolio ? "#C6A667" : "rgba(245,243,238,0.65)";
                  e.currentTarget.style.backgroundColor = isPortfolio ? "rgba(198,166,103,0.07)" : "transparent";
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

        {/* Bottom: Language toggle + Admin link */}
        <div
          className="w-full px-4 py-4 flex flex-col gap-3"
          style={{ borderTop: "1px solid rgba(198,166,103,0.12)" }}
        >
          {/* Language button */}
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            className="flex items-center gap-3 w-full transition-colors"
            style={{
              color: "#C6A667",
              background: "transparent",
              border: "none",
              textAlign: "left",
              padding: "0.25rem 0",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: "18px",
                height: "18px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.05em",
                border: "1px solid #C6A667",
              }}
            >
              {t.langSwitch}
            </span>
            {isOpen && (
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {t.langSwitch === "EN" ? "English" : "Português"}
              </span>
            )}
          </button>

          {/* Admin link */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 w-full transition-colors"
            style={{
              color: "rgba(245,243,238,0.3)",
              background: "transparent",
              border: "none",
              textAlign: "left",
              padding: "0.25rem 0",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(245,243,238,0.7)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,243,238,0.3)"; }}
          >
            <Settings size={14} style={{ flexShrink: 0, width: "18px" }} />
            {isOpen && (
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Admin
              </span>
            )}
          </button>

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
