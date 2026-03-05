/**
 * AdminGuard — Password protection for /admin route
 * Password: 0603 (stored in sessionStorage, not exposed in URL)
 * Design: Nova Habitar Navy/Gold palette
 */

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "0603";
const SESSION_KEY = "nh_admin_auth";

const LOGO_SOLO =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/QbamnFCNndHCmpVS.png?Expires=1804180331&Signature=czJHa~GxkfsgzV32dORWqWegMJlzEx5sIywT3WOyXwumjYFQZhCpWhXvKZ1PUnWhcXGSRUd1OEoXuOqNnwcK85Ep11xPktDS2YJp10KGNbB7PkstpJCNbcYfnm7onQuHhkjx843VR1hAWq~OsXNJF5Jxl4Y-NAUTF5HFYREOjqKjUJ9BqJpRZFz~c1W6cavTg5NOR050QVLLX2WptMNnvwivbsXC9e2j-woAlOl75oZcSZlhQ~8sbzFvTpydTKWyUeZEjZqnVEO2QKA4KOopX3cP15TchNXRU6ylJpM1jRXHqAGceRpGonOPGLKY-7i5xD-WGM-4FpeKWv3I0sgvdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "true") {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2500);
    }
  };

  if (loading) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F1B2D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          border: "1px solid rgba(198,166,103,0.15)",
          padding: "3rem 2.5rem",
          position: "relative",
        }}
      >
        {/* Gold corner accents */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "2.5rem", height: "2px", backgroundColor: "#C6A667" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "2.5rem", backgroundColor: "#C6A667" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "2.5rem", height: "2px", backgroundColor: "#C6A667" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "2px", height: "2.5rem", backgroundColor: "#C6A667" }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src={LOGO_SOLO}
            alt="Nova Habitar"
            style={{ height: "48px", width: "auto", objectFit: "contain", margin: "0 auto" }}
          />
        </div>

        {/* Lock icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "1px solid rgba(198,166,103,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C6A667",
            }}
          >
            <Lock size={20} />
          </div>
        </div>

        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#F5F3EE",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          Área Restrita
        </h1>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 400,
            fontSize: "0.75rem",
            color: "rgba(245,243,238,0.4)",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Painel Administrativo Nova Habitar
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoFocus
              style={{
                width: "100%",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: `1px solid ${error ? "rgba(220,80,80,0.6)" : "rgba(198,166,103,0.2)"}`,
                color: "#F5F3EE",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.875rem",
                padding: "0.875rem 3rem 0.875rem 1rem",
                outline: "none",
                transition: "border-color 0.15s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(198,166,103,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = error ? "rgba(220,80,80,0.6)" : "rgba(198,166,103,0.2)"; }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.875rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "rgba(245,243,238,0.3)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                color: "rgba(220,80,80,0.9)",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Senha incorreta. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            className="nh-btn-gold"
            style={{
              width: "100%",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
