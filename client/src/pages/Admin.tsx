/**
 * Nova Habitar — Admin Panel (/admin)
 * Manages: Projects (all fields), Timeline (with photo), Contact Info
 * Design: Navy/Gold, Montserrat, clean CRUD UI
 */

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Save, X, Star, StarOff,
  FolderOpen, Clock, Mail, ArrowLeft, Image as ImageIcon,
  Link as LinkIcon, CheckCircle, Users
} from "lucide-react";
import {
  projectStore, timelineStore, contactStore, partnerStore, settingsStore,
  generateId, generateSlug,
  STATUS_LABELS, TYPE_LABELS,
  type Project, type TimelineEntry, type ContactInfo, type Partner, type SiteSettings,
  type ProjectStatus, type ProjectType
} from "@/lib/store";
import { useLocation } from "wouter";

// ── Helpers ────────────────────────────────────────────────────────────────

const EMPTY_PROJECT: Omit<Project, "id" | "createdAt"> = {
  slug: "",
  title: "",
  location: "",
  tagline: "",
  taglineEn: "",
  description: "",
  descriptionEn: "",
  shortDescription: "",
  shortDescriptionEn: "",
  aboutText: "",
  aboutTextEn: "",
  actuationIntro: "",
  actuationIntroEn: "",
  differentials: [],
  differentialsEn: [],
  techniques: [],
  images: [],
  coverIndex: 0,
  mainImageIndex: 0,
  status: "previsto",
  type: "residencial",
  featured: false,
  typology: "",
  typologyEn: "",
  builtArea: "",
  units: "",
  actuation: {
    planning: "",
    architecture: "",
    incorporation: "",
    construction: "",
  },
  actuationEn: {
    planning: "",
    architecture: "",
    incorporation: "",
    construction: "",
  },
};

const EMPTY_TIMELINE: Omit<TimelineEntry, "id" | "createdAt"> = {
  date: "",
  title: "",
  titleEn: "",
  description: "",
  descriptionEn: "",
  photo: "",
  link: "",
};

const EMPTY_CONTACT: ContactInfo = {
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  instagram: "",
  linkedin: "",
};

// ── Input styles ───────────────────────────────────────────────────────────

const inputCls: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  backgroundColor: "rgba(245,243,238,0.04)",
  border: "1px solid rgba(198,166,103,0.2)",
  color: "#F5F3EE",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.825rem",
  outline: "none",
};

const labelCls: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.62rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "rgba(245,243,238,0.4)",
  display: "block",
  marginBottom: "0.3rem",
};

function btnStyle(variant: "gold" | "ghost" | "ghost-sm" | "danger-sm"): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    transition: "all 0.2s ease",
  };
  if (variant === "gold") return { ...base, backgroundColor: "#C6A667", color: "#0F1B2D", fontSize: "0.72rem", padding: "0.55rem 1.1rem" };
  if (variant === "ghost") return { ...base, backgroundColor: "transparent", color: "rgba(245,243,238,0.5)", fontSize: "0.72rem", padding: "0.55rem 1rem", border: "1px solid rgba(198,166,103,0.2)" };
  if (variant === "ghost-sm") return { ...base, backgroundColor: "transparent", color: "rgba(245,243,238,0.4)", fontSize: "0.7rem", padding: "0.3rem 0.5rem", border: "1px solid rgba(198,166,103,0.15)" };
  if (variant === "danger-sm") return { ...base, backgroundColor: "transparent", color: "rgba(220,80,80,0.6)", fontSize: "0.7rem", padding: "0.3rem 0.5rem", border: "1px solid rgba(220,80,80,0.2)" };
  return base;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ── Auth helpers ───────────────────────────────────────────────────────────

const ADMIN_USER_HASH = "b394991b5d12c2da81d145cb206fe86c87a6661722a8ed1a4f23128b608e5cf2"; // novahabitaradmin
const ADMIN_PASS_HASH = "418ab333e75ebb040ba9b4c03d35491175257b4567c2f410881e9be732abf552"; // antifragil

async function hashStr(str: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Main component ─────────────────────────────────────────────────────────

type Tab = "projects" | "timeline" | "contact" | "partners";

export default function Admin() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("nh_admin_auth") === "true");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<Tab>("projects");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");
      const userHash = await hashStr(username);
      const passHash = await hashStr(password);
      
      if (userHash === ADMIN_USER_HASH && passHash === ADMIN_PASS_HASH) {
        sessionStorage.setItem("nh_admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        setLoginError("Usuário ou senha incorretos.");
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#0A1420", color: "#F5F3EE" }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            backgroundColor: "#0F1B2D", 
            padding: "2.5rem 2rem", 
            border: "1px solid rgba(198,166,103,0.15)",
            width: "100%", 
            maxWidth: "360px",
            display: "flex", 
            flexDirection: "column",
            gap: "1.5rem"
          }}
        >
          <div className="text-center">
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.1em", color: "#C6A667", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Acesso Restrito
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(245,243,238,0.5)" }}>
              Insira suas credenciais para continuar
            </p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Field label="Usuário">
              <input 
                type="text" 
                style={inputCls} 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                placeholder="admin"
                autoComplete="username"
              />
            </Field>
            <Field label="Senha">
              <input 
                type="password" 
                style={inputCls} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>
            
            {loginError && (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(220,80,80,0.8)", textAlign: "center", fontWeight: 600 }}>
                {loginError}
              </p>
            )}
            
            <button type="submit" style={{ ...btnStyle("gold"), width: "100%", justifyContent: "center", padding: "0.75rem" }}>
              Entrar
            </button>
          </form>
          
          <button onClick={() => navigate("/")} style={{ ...btnStyle("ghost-sm"), margin: "0 auto", marginTop: "1rem", color: "rgba(245,243,238,0.3)", border: "none" }}>
            <ArrowLeft size={12} /> Voltar ao site
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A1420", color: "#F5F3EE" }}>
      {/* Header */}
      {/* Top bar */}
      <div style={{ backgroundColor: "#0F1B2D", borderBottom: "1px solid rgba(198,166,103,0.1)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", color: "#C6A667", textTransform: "uppercase" }}>
            Nova Habitar — Admin
          </h1>
          <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(198,166,103,0.2)" }} className="hidden sm:block" />
          <nav style={{ display: "flex", gap: "1rem" }}>
            {[
              { id: "projects", label: "Projetos", icon: <FolderOpen size={14} /> },
              { id: "partners", label: "Parceiros", icon: <Users size={14} /> },
              { id: "timeline", label: "Linha do Tempo", icon: <Clock size={14} /> },
              { id: "contact", label: "Contato", icon: <Mail size={14} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: tab === t.id ? "#C6A667" : "rgba(245,243,238,0.4)",
                  transition: "all 0.2s ease"
                }}
              >
                {t.icon} <span className="hidden md:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (confirm("Resetar todos os dados para o padrão? Isso apagará suas alterações locais.")) {
                projectStore.reset();
                partnerStore.reset();
                timelineStore.reset();
                contactStore.reset();
                window.location.reload();
              }
            }}
            style={{ ...btnStyle("ghost-sm"), color: "rgba(220,80,80,0.6)", borderColor: "rgba(220,80,80,0.15)" }}
          >
            Resetar Tudo
          </button>
          <button onClick={() => {
            sessionStorage.removeItem("nh_admin_auth");
            setIsAuthenticated(false);
            navigate("/");
          }} style={btnStyle("ghost-sm")}>
            <ArrowLeft size={13} /> Sair
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
        {tab === "projects" && <ProjectsTab showToast={showToast} />}
        {tab === "timeline" && <TimelineTab showToast={showToast} />}
        {tab === "partners" && <PartnersTab showToast={showToast} />}
        {tab === "contact" && <ContactTab showToast={showToast} />}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              backgroundColor: "#C6A667",
              color: "#0F1B2D",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              padding: "0.75rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              zIndex: 999,
            }}
          >
            <CheckCircle size={15} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Projects Tab ───────────────────────────────────────────────────────────

function ProjectsTab({ showToast }: { showToast: (m: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id" | "createdAt">>(EMPTY_PROJECT);
  const [imageInput, setImageInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { setProjects(projectStore.getAll()); }, []);

  const openNew = () => {
    setEditing({ id: generateId(), createdAt: new Date().toISOString(), ...EMPTY_PROJECT });
    setForm({ ...EMPTY_PROJECT, tagline: "", taglineEn: "" });
    setImageInput(""); setTagInput("");
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      ...p,
      tagline: p.tagline ?? "",
      taglineEn: p.taglineEn ?? "",
      descriptionEn: p.descriptionEn ?? "",
      shortDescriptionEn: p.shortDescriptionEn ?? "",
      aboutTextEn: p.aboutTextEn ?? "",
      actuationIntroEn: p.actuationIntroEn ?? "",
      differentialsEn: p.differentialsEn ?? [],
      typologyEn: p.typologyEn ?? "",
      actuationEn: p.actuationEn ?? { planning: "", architecture: "", incorporation: "", construction: "" }
    });
    setImageInput(""); setTagInput("");
  };

  const handleSave = () => {
    if (!editing) return;
    const slug = form.slug || generateSlug(form.title);
    const updated: Project = { ...editing, ...form, slug };
    projectStore.save(updated);
    setProjects(projectStore.getAll());
    setEditing(null);
    showToast("Projeto salvo!");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este projeto?")) return;
    projectStore.delete(id);
    setProjects(projectStore.getAll());
    showToast("Projeto excluído.");
  };

  const toggleFeatured = (p: Project) => {
    projectStore.save({ ...p, featured: !p.featured });
    setProjects(projectStore.getAll());
  };

  const addImage = () => {
    if (!imageInput.trim() || form.images.length >= 15) return;
    setForm((f) => ({ ...f, images: [...f.images, { url: imageInput.trim(), type: "image" }] }));
    setImageInput("");
  };

  const removeImage = (i: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
      coverIndex: f.coverIndex === i ? 0 : f.coverIndex > i ? f.coverIndex - 1 : f.coverIndex,
      mainImageIndex: f.mainImageIndex === i ? 0 : f.mainImageIndex > i ? f.mainImageIndex - 1 : f.mainImageIndex,
    }));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm((f) => ({ ...f, techniques: [...f.techniques, tagInput.trim()] }));
    setTagInput("");
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
            {form.title || "Novo Projeto"}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setEditing(null)} style={btnStyle("ghost")}><X size={14} /> Cancelar</button>
            <button onClick={handleSave} style={btnStyle("gold")}><Save size={14} /> Salvar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Título *">
            <input style={inputCls} value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
              placeholder="Nome do empreendimento" />
          </Field>
          <Field label="Localidade *">
            <input style={inputCls} value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Cidade — Bairro" />
          </Field>
          <Field label="Slogan / Tagline (PT)">
            <input style={inputCls} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Ex: O melhor da região" />
          </Field>
          <Field label="Slogan / Tagline (EN)">
            <input style={inputCls} value={form.taglineEn} onChange={(e) => setForm({ ...form, taglineEn: e.target.value })} placeholder="Ex: The best in the region" />
          </Field>
          <Field label="Status">
            <select style={{ ...inputCls, cursor: "pointer" }} value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k} style={{ backgroundColor: "#0F1B2D" }}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipo">
            <select style={{ ...inputCls, cursor: "pointer" }} value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k} style={{ backgroundColor: "#0F1B2D" }}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipologia (PT)">
            <input style={inputCls} value={form.typology}
              onChange={(e) => setForm({ ...form, typology: e.target.value })}
              placeholder="Ex: Apartamentos 2 e 3 quartos" />
          </Field>
          <Field label="Tipologia (EN)">
            <input style={inputCls} value={form.typologyEn}
              onChange={(e) => setForm({ ...form, typologyEn: e.target.value })}
              placeholder="Ex: 2 and 3 bedroom apartments" />
          </Field>
          <Field label="Área construída">
            <input style={inputCls} value={form.builtArea}
              onChange={(e) => setForm({ ...form, builtArea: e.target.value })}
              placeholder="Ex: 12.000 m²" />
          </Field>
          <Field label="Unidades">
            <input style={inputCls} value={form.units}
              onChange={(e) => setForm({ ...form, units: e.target.value })}
              placeholder="Ex: 120 unidades" />
          </Field>
          <Field label="Destaque na página inicial">
            <button
              onClick={() => setForm({ ...form, featured: !form.featured })}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "none",
                border: `1px solid ${form.featured ? "#C6A667" : "rgba(198,166,103,0.2)"}`,
                color: form.featured ? "#C6A667" : "rgba(245,243,238,0.4)",
                padding: "0.5rem 1rem", cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem",
                fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              }}
            >
              {form.featured ? <Star size={14} /> : <StarOff size={14} />}
              {form.featured ? "Destaque ativo" : "Adicionar ao destaque"}
            </button>
          </Field>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Descrição curta (PT - cards)">
                <textarea style={{ ...inputCls, resize: "vertical" }} rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Resumo em português" />
              </Field>
              <Field label="Descrição curta (EN - cards)">
                <textarea style={{ ...inputCls, resize: "vertical" }} rows={2}
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  placeholder="Summary in English" />
              </Field>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Tagline / Subtítulo (PT - Hero)">
                <textarea style={{ ...inputCls, resize: "vertical" }} rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Subtítulo em português" />
              </Field>
              <Field label="Tagline / Subtítulo (EN - Hero)">
                <textarea style={{ ...inputCls, resize: "vertical" }} rows={2}
                  value={form.shortDescriptionEn}
                  onChange={(e) => setForm({ ...form, shortDescriptionEn: e.target.value })}
                  placeholder="Tagline in English" />
              </Field>
            </div>
          </div>
          <div className="md:col-span-2">
             <Field label="Sobre o projeto (PT)">
               <textarea style={{ ...inputCls, resize: "vertical" }} rows={4}
                 value={form.aboutText}
                 onChange={(e) => setForm({ ...form, aboutText: e.target.value })} />
             </Field>
          </div>
          <div className="md:col-span-2">
             <Field label="Sobre o projeto (EN)">
               <textarea style={{ ...inputCls, resize: "vertical" }} rows={4}
                 value={form.aboutTextEn}
                 onChange={(e) => setForm({ ...form, aboutTextEn: e.target.value })} />
             </Field>
          </div>


          {/* Images — FileUpload grid (up to 15 slots) */}
          <div className="md:col-span-2">
            <label style={labelCls}>Mídia do Projeto (até 15)</label>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.65rem", color: "rgba(245,243,238,0.5)" }}>⭐️ define a capa (Hero)</span>
              <span style={{ fontSize: "0.65rem", color: "rgba(245,243,238,0.5)" }}>🏠 define a miniatura (Home)</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", paddingBottom: "2rem" }}>
              {Array.from({ length: 15 }).map((_, i) => {
                const media = form.images[i];
                const mediaUrl = media?.url;
                return (
                  <div key={i} style={{ backgroundColor: "rgba(245,243,238,0.02)", border: "1px solid rgba(198,166,103,0.12)", padding: "0.75rem" }}>
                    <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                  <FileUpload
                    value={mediaUrl}
                    onUpload={(url) => {
                      const type = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) ? "video" : "image";
                      const imgs = [...form.images];
                      while (imgs.length <= i) imgs.push({ url: "", type: "image" });
                      imgs[i] = { ...imgs[i], url, type };
                      setForm({ ...form, images: imgs.filter((img, idx) => idx <= i || img?.url) });
                    }}
                    onRemove={() => {
                      const imgs = form.images.filter((_, idx) => idx !== i);
                      setForm({
                        ...form,
                        images: imgs,
                        coverIndex: form.coverIndex === i ? 0 : form.coverIndex > i ? form.coverIndex - 1 : form.coverIndex,
                        mainImageIndex: form.mainImageIndex === i ? 0 : form.mainImageIndex > i ? form.mainImageIndex - 1 : form.mainImageIndex
                      });
                    }}
                  />
                  </div>
                    {mediaUrl && (
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={(e) => { e.preventDefault(); setForm({ ...form, coverIndex: i }) }} style={{ background: "none", border: "none", color: i === form.coverIndex ? "#C6A667" : "rgba(245,243,238,0.3)", cursor: "pointer", fontSize: "0.8rem" }}>⭐️ Capa</button>
                          <button onClick={(e) => { e.preventDefault(); if(form.images[i].type === 'image') setForm({ ...form, mainImageIndex: i }); else showToast("Miniatura deve ser imagem!"); }} style={{ background: "none", border: "none", color: i === form.mainImageIndex ? "#3b82f6" : "rgba(245,243,238,0.3)", cursor: "pointer", fontSize: "0.8rem" }}>🏠 Home</button>
                        </div>
                        <input style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem" }} value={media.title || ""} placeholder="Título (PT)" onChange={(e) => {
                          const imgs = [...form.images];
                          imgs[i] = { ...imgs[i], title: e.target.value };
                          setForm({ ...form, images: imgs });
                        }} />
                        <input style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem" }} value={media.titleEn || ""} placeholder="Título (EN)" onChange={(e) => {
                          const imgs = [...form.images];
                          imgs[i] = { ...imgs[i], titleEn: e.target.value };
                          setForm({ ...form, images: imgs });
                        }} />
                        <textarea rows={2} style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem", resize: "vertical" }} value={media.description || ""} placeholder="Descrição (PT)" onChange={(e) => {
                          const imgs = [...form.images];
                          imgs[i] = { ...imgs[i], description: e.target.value };
                          setForm({ ...form, images: imgs });
                        }} />
                        <textarea rows={2} style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem", resize: "vertical" }} value={media.descriptionEn || ""} placeholder="Descrição (EN)" onChange={(e) => {
                          const imgs = [...form.images];
                          imgs[i] = { ...imgs[i], descriptionEn: e.target.value };
                          setForm({ ...form, images: imgs });
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Differentials (bullet list) */}
          <div className="md:col-span-2">
            <Field label="Diferenciais (lista de bullets na página do projeto)">
              <div className="flex gap-2 mb-2">
                <input style={{ ...inputCls, flex: 1 }} value={(form as any)._diffInput ?? ""}
                  onChange={(e) => setForm({ ...form, ...(form as any), _diffInput: e.target.value } as any)}
                  placeholder="Ex: Entrega antecipada em 2 meses"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = ((form as any)._diffInput ?? "").trim();
                      if (val) {
                        setForm({ ...form, differentials: [...(form.differentials ?? []), val], ...(form as any), _diffInput: "" } as any);
                      }
                    }
                  }} />
                <button onClick={() => {
                  const val = ((form as any)._diffInput ?? "").trim();
                  if (val) setForm({ ...form, differentials: [...(form.differentials ?? []), val], ...(form as any), _diffInput: "" } as any);
                }} style={btnStyle("ghost-sm")}><Plus size={14} /></button>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {(form.differentials ?? []).map((item, i) => (
                  <span key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 400, color: "rgba(198,166,103,0.8)", border: "1px solid rgba(198,166,103,0.15)", padding: "0.25rem 0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    ✓ {item}
                    <button onClick={() => setForm({ ...form, differentials: form.differentials.filter((_, idx) => idx !== i) })}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(198,166,103,0.5)", padding: 0, display: "flex", marginLeft: "auto" }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </Field>
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <Field label="Técnicas / Tags (exibidas na página do projeto)">
              <div className="flex gap-2 mb-2">
                <input style={{ ...inputCls, flex: 1 }} value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Ex: Laje protendida"
                  onKeyDown={(e) => e.key === "Enter" && addTag()} />
                <button onClick={addTag} style={btnStyle("ghost-sm")}><Plus size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {form.techniques.map((tag, i) => (
                  <span key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "rgba(198,166,103,0.8)", border: "1px solid rgba(198,166,103,0.2)", padding: "0.2rem 0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {tag}
                    <button onClick={() => setForm({ ...form, techniques: form.techniques.filter((_, idx) => idx !== i) })}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(198,166,103,0.5)", padding: 0, display: "flex" }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </Field>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
          Projetos ({projects.length})
        </h2>
        <button onClick={openNew} style={btnStyle("gold")}><Plus size={14} /> Novo projeto</button>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", border: "1px solid rgba(198,166,103,0.12)", backgroundColor: "rgba(245,243,238,0.02)" }}>
            <div style={{ width: "56px", height: "42px", flexShrink: 0, overflow: "hidden", border: "1px solid rgba(198,166,103,0.15)", backgroundColor: "rgba(245,243,238,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {p.images[p.mainImageIndex]?.url ? (
                <img src={p.images[p.mainImageIndex].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <ImageIcon size={16} style={{ color: "rgba(198,166,103,0.3)" }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F5F3EE", marginBottom: "0.2rem" }}>{p.title}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 600, color: "rgba(245,243,238,0.4)" }}>{p.location}</span>
                <span style={{ color: "rgba(198,166,103,0.2)" }}>·</span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 600, color: "rgba(198,166,103,0.6)", textTransform: "uppercase" }}>{STATUS_LABELS[p.status]}</span>
                <span style={{ color: "rgba(198,166,103,0.2)" }}>·</span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 600, color: "rgba(245,243,238,0.35)", textTransform: "uppercase" }}>{TYPE_LABELS[p.type]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleFeatured(p)} title={p.featured ? "Remover destaque" : "Destacar na home"}
                style={{ background: "none", border: "none", cursor: "pointer", color: p.featured ? "#C6A667" : "rgba(245,243,238,0.2)", padding: "0.25rem", display: "flex" }}>
                <Star size={15} />
              </button>
              <button onClick={() => openEdit(p)} style={btnStyle("ghost-sm")}><Pencil size={13} /></button>
              <button onClick={() => handleDelete(p.id)} style={btnStyle("danger-sm")}><Trash2 size={13} /></button>
            </div>
          </motion.div>
        ))}
        {projects.length === 0 && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(245,243,238,0.3)", textAlign: "center", padding: "3rem" }}>
            Nenhum projeto cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Timeline Tab ───────────────────────────────────────────────────────────

function TimelineTab({ showToast }: { showToast: (m: string) => void }) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [editing, setEditing] = useState<TimelineEntry | null>(null);
  const [form, setForm] = useState<Omit<TimelineEntry, "id" | "createdAt">>(EMPTY_TIMELINE);
  const [historyPageVisible, setHistoryPageVisible] = useState(true);
  const [subtitleForm, setSubtitleForm] = useState({ pt: "", en: "" });

  useEffect(() => { 
    setEntries(timelineStore.getAll()); 
    const s = settingsStore.get();
    setHistoryPageVisible(s.historyPageVisible);
    setSubtitleForm({ pt: s.historySubtitle || "", en: s.historySubtitleEn || "" });
  }, []);

  const openNew = () => {
    setEditing({ id: generateId(), createdAt: new Date().toISOString(), ...EMPTY_TIMELINE });
    setForm({ ...EMPTY_TIMELINE });
  };

  const openEdit = (e: TimelineEntry) => {
    setEditing(e);
    setForm({ 
      date: e.date, 
      title: e.title, 
      titleEn: e.titleEn ?? "",
      description: e.description, 
      descriptionEn: e.descriptionEn ?? "",
      photo: e.photo ?? "", 
      link: e.link ?? "" 
    });
  };

  const handleSave = () => {
    if (!editing) return;
    timelineStore.save({ ...editing, ...form });
    setEntries(timelineStore.getAll());
    setEditing(null);
    showToast("Entrada salva!");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir esta entrada?")) return;
    timelineStore.delete(id);
    setEntries(timelineStore.getAll());
    showToast("Entrada excluída.");
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
            {form.title || "Nova entrada"}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setEditing(null)} style={btnStyle("ghost")}><X size={14} /> Cancelar</button>
            <button onClick={handleSave} style={btnStyle("gold")}><Save size={14} /> Salvar</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
          <Field label="Data *">
            <input style={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Ex: 2024 ou Mar 2023" />
          </Field>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Título (PT) *">
              <input style={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título do marco em português" />
            </Field>
            <Field label="Título (EN)">
              <input style={inputCls} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} placeholder="Título do marco em inglês" />
            </Field>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Descrição (PT)">
              <textarea style={{ ...inputCls, resize: "vertical" }} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição do evento em português" />
            </Field>
            <Field label="Descrição (EN)">
              <textarea style={{ ...inputCls, resize: "vertical" }} rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} placeholder="Descrição do evento em inglês" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <label style={labelCls}>Foto / Vídeo (opcional)</label>
            <div style={{ maxWidth: "320px", marginTop: "0.4rem" }}>
              <FileUpload
                value={form.photo || undefined}
                onUpload={(url) => setForm({ ...form, photo: url })}
                onRemove={() => setForm({ ...form, photo: "" })}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Field label="Link (opcional — direciona para página de projeto)">
              <input style={inputCls} value={form.link ?? ""} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/pt/projetos/slug-do-projeto" />
            </Field>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleVisibility = () => {
    const newVal = !historyPageVisible;
    setHistoryPageVisible(newVal);
    const settings = settingsStore.get();
    settingsStore.save({ ...settings, historyPageVisible: newVal });
    showToast(newVal ? "Página 'Nossa História' ativada!" : "Página 'Nossa História' desativada!");
  };

  const handleSaveSubtitles = () => {
    const settings = settingsStore.get();
    settingsStore.save({ ...settings, historySubtitle: subtitleForm.pt, historySubtitleEn: subtitleForm.en });
    showToast("Configurações da Linha do Tempo salvas!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
            Linha do Tempo ({entries.length})
          </h2>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(245,243,238,0.6)" }}>
            <input type="checkbox" checked={historyPageVisible} onChange={handleToggleVisibility} />
            Página visível no site
          </label>
        </div>
        <button onClick={openNew} style={btnStyle("gold")}><Plus size={14} /> Nova entrada</button>
      </div>

      <div style={{ backgroundColor: "rgba(245,243,238,0.02)", border: "1px solid rgba(198,166,103,0.15)", padding: "1.25rem", marginBottom: "2.5rem" }} className="flex flex-col gap-4 max-w-2xl">
        <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#C6A667", textTransform: "uppercase", letterSpacing: "0.05em" }}>Textos da Seção "Nossa História"</h3>
        <Field label="Subtítulo da Seção (PT)">
          <textarea style={{ ...inputCls, resize: "vertical" }} rows={2} value={subtitleForm.pt} onChange={(e) => setSubtitleForm({ ...subtitleForm, pt: e.target.value })} placeholder="Ex: A trajetória da Nova Habitar..." />
        </Field>
        <Field label="Subtítulo da Seção (EN)">
          <textarea style={{ ...inputCls, resize: "vertical" }} rows={2} value={subtitleForm.en} onChange={(e) => setSubtitleForm({ ...subtitleForm, en: e.target.value })} placeholder="Ex: The trajectory of Nova Habitar..." />
        </Field>
        <div className="flex justify-end mt-2">
          <button onClick={handleSaveSubtitles} style={btnStyle("gold")}><Save size={14} /> Salvar Textos</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((e) => (
          <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem 1.25rem", border: "1px solid rgba(198,166,103,0.12)", backgroundColor: "rgba(245,243,238,0.02)" }}>
            {e.photo && (
              <img src={e.photo} alt="" style={{ width: "48px", height: "36px", objectFit: "cover", border: "1px solid rgba(198,166,103,0.15)", flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#C6A667" }}>{e.date}</span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F5F3EE" }}>{e.title}</span>
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(245,243,238,0.4)", lineHeight: 1.5 }}>{e.description}</p>
              {e.link && (
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "rgba(198,166,103,0.6)", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                  <LinkIcon size={11} /> {e.link}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(e)} style={btnStyle("ghost-sm")}><Pencil size={13} /></button>
              <button onClick={() => handleDelete(e.id)} style={btnStyle("danger-sm")}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(245,243,238,0.3)", textAlign: "center", padding: "3rem" }}>
            Nenhuma entrada cadastrada.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Contact Tab ────────────────────────────────────────────────────────────

function ContactTab({ showToast }: { showToast: (m: string) => void }) {
  const [form, setForm] = useState<ContactInfo>(EMPTY_CONTACT);

  useEffect(() => { setForm(contactStore.get()); }, []);

  const handleSave = () => {
    contactStore.save(form);
    showToast("Informações de contato salvas!");
  };

  const fields: { key: keyof ContactInfo; label: string; placeholder: string; type?: string }[] = [
    { key: "email", label: "E-mail", placeholder: "contato@novahabitar.com", type: "email" },
    { key: "phone", label: "Telefone", placeholder: "+55 21 99999-0000" },
    { key: "whatsapp", label: "WhatsApp (apenas números)", placeholder: "5521999990000" },
    { key: "address", label: "Endereço / Localização", placeholder: "São Gonçalo, RJ — Brasil" },
    { key: "instagram", label: "Instagram (URL)", placeholder: "https://instagram.com/novahabitar" },
    { key: "linkedin", label: "LinkedIn (URL)", placeholder: "https://linkedin.com/company/novahabitar" },
  ];

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
          Informações de Contato
        </h2>
        <button onClick={handleSave} style={btnStyle("gold")}><Save size={14} /> Salvar</button>
      </div>
      <div className="flex flex-col gap-4">
        {fields.map(({ key, label, placeholder, type }) => (
          <Field key={key} label={label}>
            <input type={type ?? "text"} style={inputCls} value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder} />
          </Field>
        ))}
      </div>
    </div>
  );
}

// ── Partners Tab ───────────────────────────────────────────────────────────

function PartnersTab({ showToast }: { showToast: (m: string) => void }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState<Omit<Partner, "id" | "createdAt">>({ slug: "", name: "", logo: "", actuation: "", actuationEn: "", shortDescription: "", shortDescriptionEn: "", fullDescription: "", fullDescriptionEn: "", differentials: [], differentialsEn: [], website: "", active: true, featured: false, order: 0, gallery: [] });

  useEffect(() => { setPartners(partnerStore.getAll()); }, []);

  const openNew = () => {
    setEditing({ id: generateId(), createdAt: new Date().toISOString(), slug: "", name: "", logo: "", actuation: "", actuationEn: "", shortDescription: "", shortDescriptionEn: "", fullDescription: "", fullDescriptionEn: "", differentials: [], differentialsEn: [], website: "", active: true, featured: true, order: partners.length, gallery: [] });
    setForm({ slug: "", name: "", logo: "", actuation: "", actuationEn: "", shortDescription: "", shortDescriptionEn: "", fullDescription: "", fullDescriptionEn: "", differentials: [], differentialsEn: [], website: "", active: true, featured: true, order: partners.length, gallery: [] });
  };

  const openEdit = (p: Partner) => {
    setEditing(p);
    setForm({
      ...p,
      actuationEn: p.actuationEn ?? "",
      shortDescription: p.shortDescription ?? "",
      shortDescriptionEn: p.shortDescriptionEn ?? "",
      fullDescription: p.fullDescription ?? "",
      fullDescriptionEn: p.fullDescriptionEn ?? "",
      differentials: p.differentials ?? [],
      differentialsEn: p.differentialsEn ?? [],
      website: p.website ?? "",
      gallery: p.gallery || []
    });
  };

  const handleSave = () => {
    if (!editing) return;
    const slug = form.slug || generateSlug(form.name);
    partnerStore.save({ ...editing, ...form, slug });
    setPartners(partnerStore.getAll());
    setEditing(null);
    showToast("Parceiro salvo!");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este parceiro?")) return;
    partnerStore.delete(id);
    setPartners(partnerStore.getAll());
    showToast("Parceiro excluído.");
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
            {form.name || "Novo Parceiro"}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setEditing(null)} style={btnStyle("ghost")}><X size={14} /> Cancelar</button>
            <button onClick={handleSave} style={btnStyle("gold")}><Save size={14} /> Salvar</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
          <Field label="Nome da Empresa *">
            <input style={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Caixa Econômica" />
          </Field>
          <Field label="Área de Atuação (PT)">
            <input style={inputCls} value={form.actuation} onChange={(e) => setForm({ ...form, actuation: e.target.value })} placeholder="Ex: Financiamento Imobiliário" />
          </Field>
          <Field label="Área de Atuação (EN)">
            <input style={inputCls} value={form.actuationEn} onChange={(e) => setForm({ ...form, actuationEn: e.target.value })} placeholder="Ex: Real Estate Financing" />
          </Field>
          <div className="md:col-span-2">
            <label style={labelCls}>Logo do Parceiro</label>
            <div style={{ maxWidth: "280px", marginTop: "0.4rem" }}>
              <FileUpload
                value={form.logo || undefined}
                accept="image/*"
                onUpload={(url) => setForm({ ...form, logo: url })}
                onRemove={() => setForm({ ...form, logo: "" })}
              />
            </div>
            {form.logo && (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", color: "rgba(198,166,103,0.7)", marginTop: "0.4rem" }}>
                ✓ URL: {form.logo.substring(0, 60)}...
              </p>
            )}
          </div>

          <Field label="Descrição Curta (PT)">
            <textarea rows={2} style={{ ...inputCls, resize: "vertical" }} value={form.shortDescription || ""} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Ex: Maior banco de crédito imobiliário do Brasil..." />
          </Field>
          <Field label="Descrição Curta (EN)">
            <textarea rows={2} style={{ ...inputCls, resize: "vertical" }} value={form.shortDescriptionEn || ""} onChange={(e) => setForm({ ...form, shortDescriptionEn: e.target.value })} placeholder="Ex: Largest real estate credit bank in Brazil..." />
          </Field>
          <Field label="Website">
            <input style={inputCls} value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Descrição Completa (PT)">
              <textarea rows={4} style={{ ...inputCls, resize: "vertical" }} value={form.fullDescription || ""} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} placeholder="texto completo sobre o parceiro..." />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Descrição Completa (EN)">
              <textarea rows={4} style={{ ...inputCls, resize: "vertical" }} value={form.fullDescriptionEn || ""} onChange={(e) => setForm({ ...form, fullDescriptionEn: e.target.value })} placeholder="full text about the partner..." />
            </Field>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelCls}>Diferenciais (PT - um por linha)</label>
              <textarea
                rows={4}
                style={{ ...inputCls, resize: "vertical", marginTop: "0.4rem" }}
                value={(form.differentials || []).join("\n")}
                onChange={(e) => setForm({ ...form, differentials: e.target.value.split("\n").filter(Boolean) })}
                placeholder={"Agilidade\nQualidade\n..."}
              />
            </div>
            <div>
              <label style={labelCls}>Diferenciais (EN - um por linha)</label>
              <textarea
                rows={4}
                style={{ ...inputCls, resize: "vertical", marginTop: "0.4rem" }}
                value={(form.differentialsEn || []).join("\n")}
                onChange={(e) => setForm({ ...form, differentialsEn: e.target.value.split("\n").filter(Boolean) })}
                placeholder={"Agility\nQuality\n..."}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label style={labelCls}>Galeria do Parceiro (até 15 itens) — imagens e vídeos com título e descrição</label>
            <div style={{ fontSize: "0.65rem", color: "rgba(245,243,238,0.5)", marginBottom: "0.75rem" }}>Suporta imagens (JPG, PNG, WEBP) e vídeos (MP4, WEBM)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem", paddingBottom: "2rem" }}>
              {Array.from({ length: 15 }).map((_, i) => {
                const galleryList = form.gallery || [];
                const mediaUrl = galleryList[i]?.url;
                const title = galleryList[i]?.title || "";
                const titleEn = galleryList[i]?.titleEn || "";
                const description = galleryList[i]?.description || "";
                const descriptionEn = galleryList[i]?.descriptionEn || "";
                return (
                  <div key={i} style={{ backgroundColor: "rgba(245,243,238,0.02)", border: "1px solid rgba(198,166,103,0.12)", padding: "0.75rem" }}>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <FileUpload
                        value={mediaUrl}
                        onUpload={(url) => {
                          const imgs = [...galleryList];
                          const type = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) ? "video" : "image";
                          while (imgs.length <= i) imgs.push(undefined as any);
                          imgs[i] = { url, type, title, titleEn, description, descriptionEn };
                          setForm({ ...form, gallery: imgs.filter(Boolean) });
                        }}
                        onRemove={() => {
                          const imgs = galleryList.filter((_, idx) => idx !== i);
                          setForm({ ...form, gallery: imgs });
                        }}
                      />
                    </div>
                    {mediaUrl && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        <input
                          style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem" }}
                          value={title}
                          placeholder="Título (PT)"
                          onChange={(e) => {
                            const imgs = [...galleryList];
                            if (imgs[i]) { imgs[i] = { ...imgs[i], title: e.target.value }; setForm({ ...form, gallery: imgs }); }
                          }}
                        />
                        <input
                          style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem" }}
                          value={titleEn}
                          placeholder="Título (EN)"
                          onChange={(e) => {
                            const imgs = [...galleryList];
                            if (imgs[i]) { imgs[i] = { ...imgs[i], titleEn: e.target.value }; setForm({ ...form, gallery: imgs }); }
                          }}
                        />
                        <textarea
                          rows={2}
                          style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem", resize: "vertical" }}
                          value={description}
                          placeholder="Descrição (PT)"
                          onChange={(e) => {
                            const imgs = [...galleryList];
                            if (imgs[i]) { imgs[i] = { ...imgs[i], description: e.target.value }; setForm({ ...form, gallery: imgs }); }
                          }}
                        />
                        <textarea
                          rows={2}
                          style={{ ...inputCls, fontSize: "0.7rem", padding: "0.3rem", resize: "vertical" }}
                          value={descriptionEn}
                          placeholder="Descrição (EN)"
                          onChange={(e) => {
                            const imgs = [...galleryList];
                            if (imgs[i]) { imgs[i] = { ...imgs[i], descriptionEn: e.target.value }; setForm({ ...form, gallery: imgs }); }
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Field label="Status">
             <div className="flex gap-4 mt-2">
               <label className="flex items-center gap-2" style={{ fontSize: "0.8rem", color: "rgba(245,243,238,0.8)" }}>
                 <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Ativo
               </label>
               <label className="flex items-center gap-2" style={{ fontSize: "0.8rem", color: "rgba(245,243,238,0.8)" }}>
                 <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Destaque
               </label>
             </div>
          </Field>
          <Field label="Ordem">
            <input type="number" style={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </Field>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
          Parceiros ({partners.length})
        </h2>
        <button onClick={openNew} style={btnStyle("gold")}><Plus size={14} /> Novo parceiro</button>
      </div>
      <div className="flex flex-col gap-3">
        {partners.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", border: "1px solid rgba(198,166,103,0.12)", backgroundColor: "rgba(245,243,238,0.02)" }}>
            {p.logo ? (
              <img src={p.logo} alt="" style={{ width: "48px", height: "48px", objectFit: "contain", backgroundColor: "#fff", padding: "4px", borderRadius: "4px" }} />
            ) : (
              <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(245,243,238,0.05)", borderRadius: "4px", color: "rgba(245,243,238,0.3)", fontSize: "0.7rem", textAlign: "center", wordBreak: "break-all" }}>S/ LOGO</div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F5F3EE" }}>{p.name}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(245,243,238,0.4)" }}>{p.actuation || "—"}</div>
            </div>
            <div className="flex items-center gap-3">
               <span style={{ fontSize: "0.7rem", color: p.active ? "#22c55e" : "rgba(245,243,238,0.4)" }}>{p.active ? "ATIVO" : "INATIVO"}</span>
               <span style={{ fontSize: "0.7rem", color: p.featured ? "#C6A667" : "rgba(245,243,238,0.4)" }}>{p.featured ? "DESTAQUE" : ""}</span>
              <button onClick={() => openEdit(p)} style={btnStyle("ghost-sm")}><Pencil size={13} /></button>
              <button onClick={() => handleDelete(p.id)} style={btnStyle("danger-sm")}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(245,243,238,0.3)", textAlign: "center", padding: "3rem" }}>
            Nenhum parceiro cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}
