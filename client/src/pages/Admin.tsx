/**
 * Nova Habitar — Admin Panel (/admin)
 * Manages: Projects (all fields), Timeline (with photo), Contact Info
 * Design: Navy/Gold, Montserrat, clean CRUD UI
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Save, X, Star, StarOff,
  FolderOpen, Clock, Mail, ArrowLeft, Image as ImageIcon,
  Link as LinkIcon, CheckCircle
} from "lucide-react";
import {
  projectStore, timelineStore, contactStore,
  generateId, generateSlug,
  STATUS_LABELS, TYPE_LABELS,
  type Project, type TimelineEntry, type ContactInfo,
  type ProjectStatus, type ProjectType
} from "@/lib/store";
import { useLocation } from "wouter";

// ── Helpers ────────────────────────────────────────────────────────────────

const EMPTY_PROJECT: Omit<Project, "id" | "createdAt"> = {
  slug: "",
  title: "",
  location: "",
  description: "",
  shortDescription: "",
  aboutText: "",
  actuationIntro: "",
  differentials: [],
  techniques: [],
  images: [],
  coverIndex: 0,
  status: "previsto",
  type: "residencial",
  featured: false,
  typology: "",
  builtArea: "",
  units: "",
  actuation: {
    planning: "",
    architecture: "",
    incorporation: "",
    construction: "",
  },
};

const EMPTY_TIMELINE: Omit<TimelineEntry, "id" | "createdAt"> = {
  date: "",
  title: "",
  description: "",
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

// ── Main component ─────────────────────────────────────────────────────────

type Tab = "projects" | "timeline" | "contact";

export default function Admin() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("projects");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A1420", color: "#F5F3EE" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(198,166,103,0.15)",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0F1B2D",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pt")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(245,243,238,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A667")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,238,0.4)")}
          >
            <ArrowLeft size={13} /> Site
          </button>
          <span style={{ color: "rgba(198,166,103,0.25)" }}>|</span>
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "0.9rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C6A667",
            }}
          >
            Nova Habitar — Admin
          </h1>
        </div>

        <div className="flex gap-1 flex-wrap">
          {(["projects", "timeline", "contact"] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { projects: "Projetos", timeline: "Linha do Tempo", contact: "Contato" };
            const icons: Record<Tab, React.ReactNode> = {
              projects: <FolderOpen size={13} />,
              timeline: <Clock size={13} />,
              contact: <Mail size={13} />,
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: tab === t ? "rgba(198,166,103,0.12)" : "transparent",
                  color: tab === t ? "#C6A667" : "rgba(245,243,238,0.4)",
                  borderBottom: tab === t ? "2px solid #C6A667" : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {icons[t]} {labels[t]}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
        {tab === "projects" && <ProjectsTab showToast={showToast} />}
        {tab === "timeline" && <TimelineTab showToast={showToast} />}
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
    setForm({ ...EMPTY_PROJECT });
    setImageInput(""); setTagInput("");
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ ...p });
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
    if (!imageInput.trim() || form.images.length >= 5) return;
    setForm((f) => ({ ...f, images: [...f.images, imageInput.trim()] }));
    setImageInput("");
  };

  const removeImage = (i: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
      coverIndex: f.coverIndex === i ? 0 : f.coverIndex > i ? f.coverIndex - 1 : f.coverIndex,
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
          <Field label="Tipologia">
            <input style={inputCls} value={form.typology}
              onChange={(e) => setForm({ ...form, typology: e.target.value })}
              placeholder="Ex: Apartamentos 2 e 3 quartos" />
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
            <Field label="Descrição curta (cards e listagem)">
              <textarea style={{ ...inputCls, resize: "vertical" }} rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Resumo para cards e listagem" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Subtítulo / Tagline (hero da página do projeto)">
              <textarea style={{ ...inputCls, resize: "vertical" }} rows={2}
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="Uma frase de impacto para o hero da página do projeto" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Sobre o projeto (texto longo — use linha em branco para separar parágrafos)">
              <textarea style={{ ...inputCls, resize: "vertical" }} rows={5}
                value={form.aboutText}
                onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
                placeholder="Texto detalhado sobre o projeto. Separe parágrafos com linha em branco." />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Introdução da Atuação (texto antes dos 4 itens de atuação)">
              <textarea style={{ ...inputCls, resize: "vertical" }} rows={2}
                value={form.actuationIntro}
                onChange={(e) => setForm({ ...form, actuationIntro: e.target.value })}
                placeholder="Ex: Na Nova Habitar, conduzimos este empreendimento integrando análise, projeto e execução..." />
            </Field>
          </div>

          {/* Actuation */}
          <div className="md:col-span-2">
            <p style={{ ...labelCls, marginBottom: "0.75rem", color: "#C6A667" }}>Nossa Atuação</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["planning", "architecture", "incorporation", "construction"] as const).map((key) => {
                const labels: Record<string, string> = {
                  planning: "Planejamento", architecture: "Arquitetura",
                  incorporation: "Incorporação", construction: "Construção",
                };
                return (
                  <Field key={key} label={labels[key]}>
                    <textarea style={{ ...inputCls, resize: "vertical" }} rows={3}
                      value={form.actuation?.[key] ?? ""}
                      onChange={(e) => setForm({ ...form, actuation: { ...form.actuation, [key]: e.target.value } })}
                      placeholder={`Descrição de ${labels[key].toLowerCase()}`} />
                  </Field>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <Field label={`Imagens (até 5 URLs) — ${form.images.length}/5`}>
              <div className="flex gap-2 mb-2">
                <input style={{ ...inputCls, flex: 1 }} value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://... (URL da imagem)"
                  onKeyDown={(e) => e.key === "Enter" && addImage()} />
                <button onClick={addImage} style={btnStyle("ghost-sm")}><Plus size={14} /></button>
              </div>
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((img, i) => (
                    <div key={i} style={{ position: "relative", border: `1.5px solid ${i === form.coverIndex ? "#C6A667" : "rgba(198,166,103,0.15)"}`, cursor: "pointer" }}
                      title="Clique para definir como capa" onClick={() => setForm({ ...form, coverIndex: i })}>
                      <img src={img} alt="" style={{ width: "72px", height: "52px", objectFit: "cover", display: "block" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      {i === form.coverIndex && (
                        <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#C6A667", color: "#0F1B2D", fontSize: "0.5rem", fontWeight: 700, textAlign: "center", letterSpacing: "0.1em", padding: "1px", fontFamily: "'Montserrat', sans-serif" }}>
                          CAPA
                        </span>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(15,27,45,0.8)", border: "none", color: "#F5F3EE", cursor: "pointer", padding: "1px", display: "flex" }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
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
              {p.images[p.coverIndex] ? (
                <img src={p.images[p.coverIndex]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

  useEffect(() => { setEntries(timelineStore.getAll()); }, []);

  const openNew = () => {
    setEditing({ id: generateId(), createdAt: new Date().toISOString(), ...EMPTY_TIMELINE });
    setForm({ ...EMPTY_TIMELINE });
  };

  const openEdit = (e: TimelineEntry) => {
    setEditing(e);
    setForm({ date: e.date, title: e.title, description: e.description, photo: e.photo ?? "", link: e.link ?? "" });
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
          <Field label="Título *">
            <input style={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título do marco" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Descrição">
              <textarea style={{ ...inputCls, resize: "vertical" }} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição do evento" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Foto (URL opcional)">
              <input style={inputCls} value={form.photo ?? ""} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://... (URL da foto)" />
              {form.photo && (
                <img src={form.photo} alt="preview" style={{ marginTop: "0.5rem", height: "80px", objectFit: "cover", border: "1px solid rgba(198,166,103,0.2)" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
            </Field>
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#C6A667" }}>
          Linha do Tempo ({entries.length})
        </h2>
        <button onClick={openNew} style={btnStyle("gold")}><Plus size={14} /> Nova entrada</button>
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
