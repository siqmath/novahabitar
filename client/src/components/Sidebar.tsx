/**
 * Nova Habitar — Sidebar Navigation
 * Left expandable sidebar with logo, nav links and language toggle
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
} from "lucide-react";

const LOGO_DARK =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/CdFMmFddwYvgYETL.png?Expires=1804165690&Signature=cV49yLhvX-VzQthXEiyqjxknJOdktJRww9dPuGaPkTatBAoEsnT6oJ9se9dg9qZy~Jxt-cVENaLE9QSIdxo1qlLOxDLFnLH~zySFtoQpBMJOK~gLJDEPQ~jVYo~D2JA42wjFDjYIaXGnovRgXhWcqeq014kb1T-gQfkvF85ojHtjKO96-Hui9E5eofxvpD8PBlFl2aR-1RNIAxWMjPom7eut4Du3uPpE9m2P0ONoW8PGCSU8btcLm39Nm9b49Q1eNnECibg-DODDnJEFHzFCkxMlLCvvTYwXeUyjWTEgbYFCIX6cUXCYrFcLNp7g43H-rSPfNw1E0Vr6Yxxa~wveIw__&Key-Pair-Id=K2HSFNDJXOU9YS";

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
    { icon: <Home size={18} />, label: t.nav.home, hash: "inicio" },
    { icon: <FolderOpen size={18} />, label: t.nav.projects, hash: "projetos" },
    { icon: <Layers size={18} />, label: t.nav.actuation, hash: "atuacao" },
    { icon: <Star size={18} />, label: t.nav.differentials, hash: "diferenciais" },
    { icon: <ShieldCheck size={18} />, label: t.nav.governance, hash: "governanca" },
    { icon: <Leaf size={18} />, label: t.nav.sustainability, hash: "sustentabilidade" },
    { icon: <Users size={18} />, label: t.nav.about, hash: "quem-somos" },
    { icon: <Mail size={18} />, label: t.nav.contact, hash: "contato" },
  ];

  const scrollTo = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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
        {/* Logo area */}
        <div
          className="flex items-center w-full px-4 py-5"
          style={{
            borderBottom: "1px solid rgba(198,166,103,0.12)",
            minHeight: "72px",
            overflow: "hidden",
          }}
        >
          {isOpen ? (
            <img
              src={LOGO_DARK}
              alt="NOVA HABITAR"
              style={{ height: "32px", width: "auto", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Monogram placeholder when collapsed */}
              <img
                src={LOGO_DARK}
                alt="NH"
                style={{ height: "28px", width: "28px", objectFit: "contain", objectPosition: "left" }}
              />
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex flex-col w-full flex-1 py-4 gap-0.5 overflow-hidden">
          {navItems.map((item) => (
            <button
              key={item.hash}
              onClick={() => scrollTo(item.hash)}
              className="flex items-center w-full px-4 py-3 transition-all duration-150 group"
              style={{
                color: "rgba(245,243,238,0.65)",
                background: "transparent",
                border: "none",
                textAlign: "left",
                whiteSpace: "nowrap",
                gap: "1rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#C6A667";
                e.currentTarget.style.backgroundColor = "rgba(198,166,103,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(245,243,238,0.65)";
                e.currentTarget.style.backgroundColor = "transparent";
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
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Language toggle + expand hint */}
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
