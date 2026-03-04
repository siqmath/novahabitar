/**
 * Nova Habitar — Página Administrativa (/admin)
 * Gerencia: Projetos (CRUD) e Linha do Tempo (CRUD)
 * Projetos: título, localidade, descrição, técnicas, até 5 imagens, capa, status, favorito
 * Linha do tempo: data, título, descrição, link opcional
 * Dados persistidos em localStorage via store.ts
 */

import { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, Edit2, Save, X, Star, StarOff,
  Image as ImageIcon, ChevronDown, ChevronUp, Clock, Briefcase, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  projectStore, timelineStore, generateId,
  STATUS_LABELS, type Project, type ProjectStatus, type TimelineEntry
} from "@/lib/store";
import { useLocation } from "wouter";

const GOLD = "#C6A667";
const NAVY = "#0F1B2D";

type Tab = "projects" | "timeline";

const EMPTY_PROJECT: Omit<Project, "id" | "createdAt"> = {
  title: "",
  location: "",
  description: "",
  techniques: [],
  images: [],
  coverIndex: 0,
  status: "previsto",
  featured: false,
};

const EMPTY_TIMELINE: Omit<TimelineEntry, "id" | "createdAt"> = {
  date: "",
  title: "",
  description: "",
  link: "",
};

// ── Shared input style ──────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.8rem",
  border: "1px solid #D8D6D1",
  backgroundColor: "#F5F3EE",
  color: NAVY,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.65rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "#888",
  display: "block",
  marginBottom: "0.35rem",
};

// ── Project Form ────────────────────────────────────────────────────────────
function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Project, "id" | "createdAt">>(
    initial ? { ...initial } : { ...EMPTY_PROJECT }
  );
  const [techInput, setTechInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const set = (key: keyof typeof form, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.techniques.includes(t)) {
      set("techniques", [...form.techniques, t]);
    }
    setTechInput("");
  };

  const removeTech = (t: string) =>
    set("techniques", form.techniques.filter((x) => x !== t));

  const addImage = () => {
    const url = imageInput.trim();
    if (url && form.images.length < 5) {
      set("images", [...form.images, url]);
    }
    setImageInput("");
  };

  const removeImage = (i: number) => {
    const imgs = form.images.filter((_, idx) => idx !== i);
    set("images", imgs);
    if (form.coverIndex >= imgs.length) set("coverIndex", 0);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.location.trim()) return;
    const project: Project = {
      id: initial?.id || generateId(),
      createdAt: initial?.createdAt || new Date().toISOString(),
      ...form,
    };
    onSave(project);
  };

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E8E6E1", padding: "1.5rem" }}>
      <h3
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          fontSize: "0.95rem",
          color: NAVY,
          marginBottom: "1.25rem",
        }}
      >
        {initial ? "Editar projeto" : "Novo projeto"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={labelStyle}>Título *</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex: Residencial Jardim das Acácias"
          />
        </div>
        <div>
          <label style={labelStyle}>Localidade *</label>
          <input
            style={inputStyle}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Ex: São Gonçalo — Alcântara"
          />
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Descrição</label>
        <textarea
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Descrição do empreendimento..."
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={inputStyle}
            value={form.status}
            onChange={(e) => set("status", e.target.value as ProjectStatus)}
          >
            {(["previsto", "em-desenvolvimento", "em-obras", "entregue"] as ProjectStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.1rem" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: NAVY,
            }}
          >
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              style={{ accentColor: GOLD, width: "16px", height: "16px" }}
            />
            <Star size={14} color={form.featured ? GOLD : "#888"} />
            Destaque na página inicial
          </label>
        </div>
      </div>

      {/* Técnicas */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Técnicas utilizadas (opcional)</label>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
            placeholder="Ex: Laje protendida"
          />
          <button
            onClick={addTech}
            style={{
              padding: "0.6rem 1rem",
              backgroundColor: NAVY,
              color: "#F5F3EE",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Adicionar
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {form.techniques.map((t) => (
            <span
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: NAVY,
                border: `1px solid ${GOLD}`,
                padding: "0.25rem 0.6rem",
              }}
            >
              {t}
              <button onClick={() => removeTech(t)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, lineHeight: 1 }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Imagens */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>Imagens / Vídeos (máx. 5 URLs)</label>
        {form.images.length < 5 && (
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              placeholder="URL da imagem ou vídeo"
            />
            <button
              onClick={addImage}
              style={{
                padding: "0.6rem 1rem",
                backgroundColor: NAVY,
                color: "#F5F3EE",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              Adicionar
            </button>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.5rem" }}>
          {form.images.map((url, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                border: `2px solid ${i === form.coverIndex ? GOLD : "#E8E6E1"}`,
                cursor: "pointer",
              }}
              onClick={() => set("coverIndex", i)}
              title="Clique para definir como capa"
            >
              <img
                src={url}
                alt={`Imagem ${i + 1}`}
                style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {i === form.coverIndex && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: GOLD,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: NAVY,
                    textAlign: "center",
                    padding: "0.15rem",
                  }}
                >
                  Capa
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                style={{
                  position: "absolute",
                  top: "0.25rem",
                  right: "0.25rem",
                  backgroundColor: "rgba(15,27,45,0.7)",
                  border: "none",
                  color: "#F5F3EE",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "0.6rem 1.25rem",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid #D8D6D1",
            backgroundColor: "transparent",
            color: "#2B2F36",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: "0.6rem 1.25rem",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            backgroundColor: GOLD,
            color: NAVY,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Save size={13} /> Salvar
        </button>
      </div>
    </div>
  );
}

// ── Timeline Form ───────────────────────────────────────────────────────────
function TimelineForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: TimelineEntry;
  onSave: (e: TimelineEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<TimelineEntry, "id" | "createdAt">>(
    initial ? { date: initial.date, title: initial.title, description: initial.description, link: initial.link || "" }
    : { ...EMPTY_TIMELINE }
  );

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.date.trim() || !form.title.trim()) return;
    const entry: TimelineEntry = {
      id: initial?.id || generateId(),
      createdAt: initial?.createdAt || new Date().toISOString(),
      ...form,
      link: form.link?.trim() || undefined,
    };
    onSave(entry);
  };

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E8E6E1", padding: "1.5rem" }}>
      <h3
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          fontSize: "0.95rem",
          color: NAVY,
          marginBottom: "1.25rem",
        }}
      >
        {initial ? "Editar entrada" : "Nova entrada"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={labelStyle}>Data *</label>
          <input
            style={inputStyle}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            placeholder="Ex: 2024, Mar 2023"
          />
        </div>
        <div>
          <label style={labelStyle}>Título *</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex: Fundação da empresa"
          />
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Descrição</label>
        <textarea
          style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Descreva o marco histórico..."
        />
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>Link (opcional — direciona para portfólio)</label>
        <input
          style={inputStyle}
          value={form.link || ""}
          onChange={(e) => set("link", e.target.value)}
          placeholder="Ex: /pt/projetos"
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "0.6rem 1.25rem",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid #D8D6D1",
            backgroundColor: "transparent",
            color: "#2B2F36",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: "0.6rem 1.25rem",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            backgroundColor: GOLD,
            color: NAVY,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Save size={13} /> Salvar
        </button>
      </div>
    </div>
  );
}

// ── Main Admin Page ─────────────────────────────────────────────────────────
export default function Admin() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("projects");

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null | "new">(null);

  // Timeline state
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null | "new">(null);

  useEffect(() => {
    setProjects(projectStore.getAll());
    setTimeline(timelineStore.getAll());
  }, []);

  // ── Project handlers ──
  const saveProject = (p: Project) => {
    projectStore.save(p);
    setProjects(projectStore.getAll());
    setEditingProject(null);
  };

  const deleteProject = (id: string) => {
    if (!confirm("Excluir este projeto?")) return;
    projectStore.delete(id);
    setProjects(projectStore.getAll());
  };

  const toggleFeatured = (p: Project) => {
    projectStore.save({ ...p, featured: !p.featured });
    setProjects(projectStore.getAll());
  };

  // ── Timeline handlers ──
  const saveEntry = (e: TimelineEntry) => {
    timelineStore.save(e);
    setTimeline(timelineStore.getAll());
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    if (!confirm("Excluir esta entrada?")) return;
    timelineStore.delete(id);
    setTimeline(timelineStore.getAll());
  };

  return (
    <div style={{ backgroundColor: "#F5F3EE", minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          backgroundColor: NAVY,
          padding: "1.5rem 0",
          borderBottom: "1px solid rgba(198,166,103,0.15)",
        }}
      >
        <div className="container mx-auto" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate("/pt")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                color: "rgba(198,166,103,0.7)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={14} />
              Voltar ao site
            </button>
            <span style={{ color: "rgba(198,166,103,0.3)" }}>|</span>
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.06em",
                color: "#F5F3EE",
              }}
            >
              Painel Administrativo
            </h1>
          </div>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: GOLD,
            }}
          >
            Nova Habitar
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E8E6E1" }}>
        <div className="container mx-auto" style={{ display: "flex", gap: 0 }}>
          {([["projects", "Projetos", <Briefcase size={14} />], ["timeline", "Linha do Tempo", <Clock size={14} />]] as [Tab, string, React.ReactNode][]).map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "1rem 1.5rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                borderBottom: `2px solid ${tab === id ? GOLD : "transparent"}`,
                backgroundColor: "transparent",
                color: tab === id ? NAVY : "#888",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s ease",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto" style={{ padding: "2rem 0" }}>
        {/* ── Projects Tab ── */}
        {tab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: NAVY,
                }}
              >
                Projetos ({projects.length})
              </h2>
              <button
                onClick={() => setEditingProject("new")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.6rem 1.25rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  border: "none",
                  backgroundColor: GOLD,
                  color: NAVY,
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Novo projeto
              </button>
            </div>

            {/* Form */}
            <AnimatePresence>
              {editingProject && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ marginBottom: "1.5rem" }}
                >
                  <ProjectForm
                    initial={editingProject === "new" ? undefined : editingProject}
                    onSave={saveProject}
                    onCancel={() => setEditingProject(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Projects list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {projects.map((p) => {
                const cover = p.images[p.coverIndex] || p.images[0];
                return (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #E8E6E1",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "stretch",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: "90px",
                        flexShrink: 0,
                        backgroundColor: "#E8E6E1",
                        overflow: "hidden",
                      }}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={p.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ImageIcon size={20} color="#bbb" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, padding: "0.75rem 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            color: NAVY,
                          }}
                        >
                          {p.title}
                        </span>
                        {p.featured && <Star size={12} color={GOLD} fill={GOLD} />}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.75rem",
                          color: "#888",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {p.location}
                      </div>
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: GOLD,
                          border: `1px solid rgba(198,166,103,0.3)`,
                          padding: "0.15rem 0.5rem",
                        }}
                      >
                        {STATUS_LABELS[p.status]}
                      </span>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "0.4rem",
                        padding: "0.75rem",
                        borderLeft: "1px solid #E8E6E1",
                      }}
                    >
                      <button
                        onClick={() => toggleFeatured(p)}
                        title={p.featured ? "Remover destaque" : "Marcar como destaque"}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: p.featured ? GOLD : "#ccc",
                          padding: "0.3rem",
                        }}
                      >
                        {p.featured ? <Star size={15} fill={GOLD} /> : <StarOff size={15} />}
                      </button>
                      <button
                        onClick={() => setEditingProject(p)}
                        title="Editar"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: NAVY,
                          padding: "0.3rem",
                        }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        title="Excluir"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#e55",
                          padding: "0.3rem",
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    fontFamily: "'Montserrat', sans-serif",
                    color: "#888",
                    fontSize: "0.85rem",
                    border: "1px dashed #D8D6D1",
                  }}
                >
                  Nenhum projeto cadastrado. Clique em "Novo projeto" para começar.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Timeline Tab ── */}
        {tab === "timeline" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: NAVY,
                }}
              >
                Linha do Tempo ({timeline.length})
              </h2>
              <button
                onClick={() => setEditingEntry("new")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.6rem 1.25rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  border: "none",
                  backgroundColor: GOLD,
                  color: NAVY,
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Nova entrada
              </button>
            </div>

            {/* Form */}
            <AnimatePresence>
              {editingEntry && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ marginBottom: "1.5rem" }}
                >
                  <TimelineForm
                    initial={editingEntry === "new" ? undefined : editingEntry}
                    onSave={saveEntry}
                    onCancel={() => setEditingEntry(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {timeline.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #E8E6E1",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "stretch",
                  }}
                >
                  {/* Date column */}
                  <div
                    style={{
                      backgroundColor: NAVY,
                      width: "80px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem 0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                        color: GOLD,
                        textAlign: "center",
                      }}
                    >
                      {entry.date}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, padding: "0.75rem 0" }}>
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: NAVY,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {entry.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.775rem",
                        lineHeight: 1.6,
                        color: "#555",
                      }}
                    >
                      {entry.description}
                    </div>
                    {entry.link && (
                      <div
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.65rem",
                          color: GOLD,
                          marginTop: "0.25rem",
                        }}
                      >
                        Link: {entry.link}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "0.75rem",
                      borderLeft: "1px solid #E8E6E1",
                    }}
                  >
                    <button
                      onClick={() => setEditingEntry(entry)}
                      title="Editar"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: NAVY,
                        padding: "0.3rem",
                      }}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      title="Excluir"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#e55",
                        padding: "0.3rem",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    fontFamily: "'Montserrat', sans-serif",
                    color: "#888",
                    fontSize: "0.85rem",
                    border: "1px dashed #D8D6D1",
                  }}
                >
                  Nenhuma entrada cadastrada. Clique em "Nova entrada" para começar.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
