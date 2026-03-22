/**
 * Nova Habitar — Contact Page (/pt/contato | /en/contact)
 * Functional contact form (mailto fallback) + contact info from contactStore
 * Design: Navy/Gold/Off-White, Montserrat, micro-interactions
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Linkedin, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { contactApi, type ContactInfo } from "@/lib/apiClient";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";

const LOGO_SOLO =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663391268624/QbamnFCNndHCmpVS.png?Expires=1804180331&Signature=czJHa~GxkfsgzV32dORWqWegMJlzEx5sIywT3WOyXwumjYFQZhCpWhXvKZ1PUnWhcXGSRUd1OEoXuOqNnwcK85Ep11xPktDS2YJp10KGNbB7PkstpJCNbcYfnm7onQuHhkjx843VR1hAWq~OsXNJF5Jxl4Y-NAUTF5HFYREOjqKjUJ9BqJpRZFz~c1W6cavTg5NOR050QVLLX2WptMNnvwivbsXC9e2j-woAlOl75oZcSZlhQ~8sbzFvTpydTKWyUeZEjZqnVEO2QKA4KOopX3cP15TchNXRU6ylJpM1jRXHqAGceRpGonOPGLKY-7i5xD-WGM-4FpeKWv3I0sgvdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

interface FormState {
  name: string;
  email: string;
  interest: string;
  message: string;
}

const INTERESTS_PT = ["Consultoria de empreendimento", "Parceria / Investimento", "Informações sobre projetos", "Outro"];
const INTERESTS_EN = ["Project Consulting", "Partnership / Investment", "Project Information", "Other"];

export default function Contact() {
  const { t, lang } = useLang();
  const [, navigate] = useLocation();
  const [contact, setContact] = useState<ContactInfo>({ email: "", phone: "", whatsapp: "", address: "", instagram: "", linkedin: "" });
  const [form, setForm] = useState<FormState>({ name: "", email: "", interest: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    contactApi.get().then(setContact).catch(console.error);
  }, []);

  const interests = lang === "en" ? INTERESTS_EN : INTERESTS_PT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mailto fallback — functional without backend
    const subject = encodeURIComponent(`[Nova Habitar] ${form.interest || (lang === "en" ? "Contact" : "Contato")} — ${form.name}`);
    const body = encodeURIComponent(
      `Nome: ${form.name}\nE-mail: ${form.email}\nAssunto: ${form.interest}\n\n${form.message}`
    );
    window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", interest: "", message: "" });
  };

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "0.85rem 1rem",
    backgroundColor: "rgba(245,243,238,0.04)",
    border: `1px solid ${focused === field ? "#C6A667" : "rgba(198,166,103,0.2)"}`,
    color: "#F5F3EE",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focused === field ? "0 0 0 3px rgba(198,166,103,0.08)" : "none",
  } as React.CSSProperties);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0F1B2D" }}>
      <Sidebar />

      <main
        className="flex-1"
        style={{ marginLeft: "56px", minHeight: "100vh" }}
      >
        {/* Header */}
        <div
          className="relative flex items-end px-10 pb-12 pt-24"
          style={{
            borderBottom: "1px solid rgba(198,166,103,0.12)",
            minHeight: "220px",
            background: "linear-gradient(to bottom, rgba(15,27,45,1) 0%, rgba(15,27,45,0.9) 100%)",
          }}
        >
          <button
            onClick={() => navigate(`/${lang}`)}
            className="absolute top-8 left-10 flex items-center gap-2 transition-colors"
            style={{
              color: "rgba(245,243,238,0.5)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.5)")}
          >
            <ArrowLeft size={14} />
            {lang === "en" ? "Back" : "Voltar"}
          </button>

          <div>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C6A667",
                marginBottom: "0.75rem",
              }}
            >
              {lang === "en" ? "Contact" : "Contato"}
            </p>
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                color: "#F5F3EE",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {lang === "en"
                ? "Let's talk about your project."
                : "Vamos conversar sobre o seu projeto."}
            </h1>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "0.95rem",
                color: "rgba(245,243,238,0.55)",
                marginTop: "0.75rem",
                maxWidth: "480px",
                lineHeight: 1.65,
              }}
            >
              {lang === "en"
                ? "We present scenarios and possibilities with technical basis and market vision — with solid risk management."
                : "Apresentamos cenários e possibilidades com base técnica e visão de mercado — com gestão de risco sólida."}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-10 py-14 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#C6A667",
                  marginBottom: "1.5rem",
                }}
              >
                {lang === "en" ? "Send a message" : "Enviar mensagem"}
              </h2>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-4"
                >
                  <CheckCircle size={48} style={{ color: "#C6A667" }} />
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#F5F3EE",
                      textAlign: "center",
                    }}
                  >
                    {lang === "en" ? "Message sent!" : "Mensagem enviada!"}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.85rem",
                      color: "rgba(245,243,238,0.5)",
                      textAlign: "center",
                    }}
                  >
                    {lang === "en"
                      ? "We'll get back to you soon."
                      : "Entraremos em contato em breve."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(245,243,238,0.5)",
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {lang === "en" ? "Full Name" : "Nome completo"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      style={inputStyle("name")}
                      placeholder={lang === "en" ? "Your name" : "Seu nome"}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(245,243,238,0.5)",
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      style={inputStyle("email")}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(245,243,238,0.5)",
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {lang === "en" ? "Subject" : "Assunto"}
                    </label>
                    <select
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      onFocus={() => setFocused("interest")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputStyle("interest"), cursor: "pointer" }}
                    >
                      <option value="" style={{ backgroundColor: "#0F1B2D" }}>
                        {lang === "en" ? "Select a subject..." : "Selecione um assunto..."}
                      </option>
                      {interests.map((i) => (
                        <option key={i} value={i} style={{ backgroundColor: "#0F1B2D" }}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(245,243,238,0.5)",
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {lang === "en" ? "Message" : "Mensagem"} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputStyle("message"), resize: "vertical" }}
                      placeholder={
                        lang === "en"
                          ? "Describe your project or question..."
                          : "Descreva seu projeto ou dúvida..."
                      }
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 mt-2"
                    style={{
                      backgroundColor: "#C6A667",
                      color: "#0F1B2D",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "0.9rem 2rem",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b8944f")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C6A667")}
                  >
                    <Send size={15} />
                    {lang === "en" ? "Send message" : "Enviar mensagem"}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Right: Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#C6A667",
                  marginBottom: "1.5rem",
                }}
              >
                {lang === "en" ? "Contact information" : "Informações de contato"}
              </h2>

              <div className="flex flex-col gap-6">
                {[
                  {
                    icon: <Mail size={18} />,
                    label: "E-mail",
                    value: contact.email,
                    href: `mailto:${contact.email}`,
                  },
                  {
                    icon: <Phone size={18} />,
                    label: lang === "en" ? "Phone" : "Telefone",
                    value: contact.phone,
                    href: `tel:${contact.phone.replace(/\D/g, "")}`,
                  },
                  {
                    icon: <Phone size={18} />,
                    label: "WhatsApp",
                    value: contact.phone,
                    href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
                  },
                  {
                    icon: <MapPin size={18} />,
                    label: lang === "en" ? "Location" : "Localização",
                    value: contact.address,
                    href: undefined,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "1px solid rgba(198,166,103,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#C6A667",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "rgba(245,243,238,0.4)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            color: "#F5F3EE",
                            textDecoration: "none",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#F5F3EE")}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            color: "#F5F3EE",
                          }}
                        >
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Social links */}
                <div
                  style={{
                    borderTop: "1px solid rgba(198,166,103,0.12)",
                    paddingTop: "1.5rem",
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  {contact.instagram && (
                    <a
                      href={contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-colors"
                      style={{
                        color: "rgba(245,243,238,0.45)",
                        textDecoration: "none",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.45)")}
                    >
                      <Instagram size={16} />
                      Instagram
                    </a>
                  )}
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-colors"
                      style={{
                        color: "rgba(245,243,238,0.45)",
                        textDecoration: "none",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.45)")}
                    >
                      <Linkedin size={16} />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(198,166,103,0.1)",
            padding: "2rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <img src={LOGO_SOLO} alt="Nova Habitar" style={{ height: "32px", width: "auto", objectFit: "contain", opacity: 0.7 }} />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 400,
              color: "rgba(245,243,238,0.3)",
              letterSpacing: "0.05em",
            }}
          >
            © {new Date().getFullYear()} Nova Habitar Incorporadora e Construtora Ltda. — CNPJ 16.692.513/0001-40
          </p>
        </footer>
      </main>
    </div>
  );
}
