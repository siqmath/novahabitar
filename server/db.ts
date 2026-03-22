/**
 * Nova Habitar — Server-side persistent store
 * Refactored to use Supabase PostgreSQL via @supabase/supabase-js
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("[db] Supabase credentials missing from environment. Read operations may fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Types (duplicated here so server has no client deps) ───────────────────

export interface ProjectMedia {
  url: string;
  type: "image" | "video";
  title?: string;
  description?: string;
  titleEn?: string;
  descriptionEn?: string;
}

export interface ProjectActuation {
  planning?: string;
  architecture?: string;
  incorporation?: string;
  construction?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  tagline: string;
  taglineEn?: string;
  description: string;
  descriptionEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  aboutText: string;
  aboutTextEn?: string;
  actuationIntro: string;
  actuationIntroEn?: string;
  techniques: string[];
  differentials: string[];
  differentialsEn?: string[];
  images: ProjectMedia[];
  coverIndex: number;
  mainImageIndex: number;
  status: "previsto" | "em-desenvolvimento" | "em-obras" | "entregue";
  type: "residencial" | "comercial" | "uso-misto";
  featured: boolean;
  typology: string;
  typologyEn?: string;
  builtArea: string;
  units: string;
  actuation: ProjectActuation;
  actuationEn?: ProjectActuation;
  createdAt: string;
  order: number;
  active: boolean;
}

export interface PartnerMedia {
  url: string;
  type: "image" | "video";
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logo: string;
  actuation: string;
  actuationEn?: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  fullDescription?: string;
  fullDescriptionEn?: string;
  differentials?: string[];
  differentialsEn?: string[];
  website?: string;
  gallery?: PartnerMedia[];
  active: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  photo?: string;
  link?: string;
  createdAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  linkedin: string;
}

export interface SiteSettings {
  historyPageVisible: boolean;
  historySubtitle?: string;
  historySubtitleEn?: string;
}

export interface DbSchema {
  projects: Project[];
  partners: Partner[];
  timeline: TimelineEntry[];
  contact: ContactInfo;
  settings: SiteSettings;
}

// ── Public API (Promises) ──────────────────────────────────────────────────────────────

export const db = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase.from("projects").select("*").order("createdAt", { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  },
  saveProject: async (project: Project): Promise<void> => {
    const { error } = await supabase.from("projects").upsert(project);
    if (error) console.error("[Supabase Error - saveProject]:", error);
  },
  deleteProject: async (id: string): Promise<void> => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) console.error("[Supabase Error - deleteProject]:", error);
  },

  // Partners
  getPartners: async (): Promise<Partner[]> => {
    const { data, error } = await supabase.from("partners").select("*").order("order", { ascending: true });
    if (error) { console.error(error); return []; }
    return data || [];
  },
  savePartner: async (partner: Partner): Promise<void> => {
    const { error } = await supabase.from("partners").upsert(partner);
    if (error) console.error("[Supabase Error - savePartner]:", error);
  },
  deletePartner: async (id: string): Promise<void> => {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) console.error("[Supabase Error - deletePartner]:", error);
  },

  // Timeline
  getTimeline: async (): Promise<TimelineEntry[]> => {
    const { data, error } = await supabase.from("timeline").select("*").order("date", { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  },
  saveTimelineEntry: async (entry: TimelineEntry): Promise<void> => {
    const { error } = await supabase.from("timeline").upsert(entry);
    if (error) console.error("[Supabase Error - saveTimelineEntry]:", error);
  },
  deleteTimelineEntry: async (id: string): Promise<void> => {
    const { error } = await supabase.from("timeline").delete().eq("id", id);
    if (error) console.error("[Supabase Error - deleteTimelineEntry]:", error);
  },

  // Contact
  getContact: async (): Promise<ContactInfo> => {
    const { data, error } = await supabase.from("contacts").select("data").eq("id", 1).single();
    if (error) { console.error(error); return { email: "", phone: "", whatsapp: "", address: "", instagram: "", linkedin: "" }; }
    return data.data;
  },
  saveContact: async (contact: ContactInfo): Promise<void> => {
    const { error } = await supabase.from("contacts").upsert({ id: 1, data: contact });
    if (error) console.error("[Supabase Error - saveContact]:", error);
  },

  // Settings
  getSettings: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from("settings").select("data").eq("id", 1).single();
    if (error) { console.error(error); return { historyPageVisible: true }; }
    return data.data;
  },
  saveSettings: async (settings: SiteSettings): Promise<void> => {
    const { error } = await supabase.from("settings").upsert({ id: 1, data: settings });
    if (error) console.error("[Supabase Error - saveSettings]:", error);
  },

  export: async (): Promise<DbSchema> => {
    const [p, pt, t, c, s] = await Promise.all([
      db.getProjects(), db.getPartners(), db.getTimeline(), db.getContact(), db.getSettings()
    ]);
    return { projects: p, partners: pt, timeline: t, contact: c, settings: s };
  },

  import: async (schema: DbSchema): Promise<void> => {
    if (schema.projects?.length) await supabase.from("projects").upsert(schema.projects);
    if (schema.partners?.length) await supabase.from("partners").upsert(schema.partners);
    if (schema.timeline?.length) await supabase.from("timeline").upsert(schema.timeline);
    if (schema.contact) await db.saveContact(schema.contact);
    if (schema.settings) await db.saveSettings(schema.settings);
  }
};
