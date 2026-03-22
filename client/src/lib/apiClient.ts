/**
 * Nova Habitar — API Client
 * All data now lives on the server (shared across every device).
 * No more localStorage for content — only the server DB is the source of truth.
 */

import type {
  Project,
  Partner,
  TimelineEntry,
  ContactInfo,
  SiteSettings,
} from "@/lib/store";

// Re-export types so pages can import from here too
export type { Project, Partner, TimelineEntry, ContactInfo, SiteSettings };

async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // Force browsers (especially mobile Safari) to never serve a cached API response
      "Cache-Control": "no-cache, no-store",
      "Pragma": "no-cache",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

// ── Projects ────────────────────────────────────────────────────────────────

export const projectApi = {
  getAll: () => apiFetch<Project[]>("/api/projects"),
  getBySlug: (slug: string) => apiFetch<Project>(`/api/projects/${slug}`),
  save: (project: Project) =>
    apiFetch<Project>(`/api/projects/${project.id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    }),
  create: (project: Omit<Project, "id" | "createdAt">) =>
    apiFetch<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),
  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/projects/${id}`, { method: "DELETE" }),
};

// ── Partners ────────────────────────────────────────────────────────────────

export const partnerApi = {
  getAll: () => apiFetch<Partner[]>("/api/partners"),
  getBySlug: (slug: string) => apiFetch<Partner>(`/api/partners/${slug}`),
  save: (partner: Partner) =>
    apiFetch<Partner>(`/api/partners/${partner.id}`, {
      method: "PUT",
      body: JSON.stringify(partner),
    }),
  create: (partner: Omit<Partner, "id" | "createdAt">) =>
    apiFetch<Partner>("/api/partners", {
      method: "POST",
      body: JSON.stringify(partner),
    }),
  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/partners/${id}`, { method: "DELETE" }),
};

// ── Timeline ────────────────────────────────────────────────────────────────

export const timelineApi = {
  getAll: () => apiFetch<TimelineEntry[]>("/api/timeline"),
  save: (entry: TimelineEntry) =>
    apiFetch<TimelineEntry>(`/api/timeline/${entry.id}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    }),
  create: (entry: Omit<TimelineEntry, "id" | "createdAt">) =>
    apiFetch<TimelineEntry>("/api/timeline", {
      method: "POST",
      body: JSON.stringify(entry),
    }),
  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/timeline/${id}`, { method: "DELETE" }),
};

// ── Contact ─────────────────────────────────────────────────────────────────

export const contactApi = {
  get: () => apiFetch<ContactInfo>("/api/contact"),
  save: (info: ContactInfo) =>
    apiFetch<ContactInfo>("/api/contact", {
      method: "PUT",
      body: JSON.stringify(info),
    }),
};

// ── Settings ────────────────────────────────────────────────────────────────

export const settingsApi = {
  get: () => apiFetch<SiteSettings>("/api/settings"),
  save: (settings: SiteSettings) =>
    apiFetch<SiteSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};

// ── Data Migration Helper ───────────────────────────────────────────────────
// Import everything saved in localStorage to the server.
// Open browser console on /admin and call: window.__nhMigrate()

if (typeof window !== "undefined") {
  (window as any).__nhMigrate = async () => {
    const keys = {
      projects: ["nh_projects_v5", "nh_projects_v4", "nh_projects_v3", "nh_projects_v2", "nh_projects"],
      partners: ["nh_partners_v7", "nh_partners_v6", "nh_partners_v5", "nh_partners"],
      timeline: ["nh_timeline_v2", "nh_timeline"],
      contact: ["nh_contact"],
      settings: ["nh_settings"],
    };

    const tryLoad = <T>(candidates: string[]): T | null => {
      for (const key of candidates) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) return JSON.parse(raw) as T;
        } catch {}
      }
      return null;
    };

    const snapshot: Record<string, unknown> = {};
    const projects = tryLoad<Project[]>(keys.projects);
    if (projects) snapshot.projects = projects;
    const partners = tryLoad<Partner[]>(keys.partners);
    if (partners) snapshot.partners = partners;
    const timeline = tryLoad<TimelineEntry[]>(keys.timeline);
    if (timeline) snapshot.timeline = timeline;
    const contact = tryLoad<ContactInfo>(keys.contact);
    if (contact) snapshot.contact = contact;
    const settings = tryLoad<SiteSettings>(keys.settings);
    if (settings) snapshot.settings = settings;

    console.log("[migrate] Payload to upload:", snapshot);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot),
    });
    const data = await res.json();
    console.log("[migrate] Done:", data);
    alert("Migração concluída! Recarregue a página.");
  };
}
