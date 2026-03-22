import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import os from "os";
import { v2 as cloudinary } from "cloudinary";
import { db } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// ── Multer ─────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml",
      "video/mp4", "video/webm", "video/quicktime", "video/ogg",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não suportado: ${file.mimetype}`));
    }
  },
});

// ── No-cache headers for API routes ────────────────────────────────────────
// This ensures mobile browsers and CDNs never serve stale content data.
function noCache(res: express.Response) {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store",
  });
}

// ── ID / slug helpers ──────────────────────────────────────────────────────
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "2mb" }));

  // ─────────────────────────────────────────────────────────────────────────
  // API ROUTES  (all return JSON, all have no-cache headers)
  // ─────────────────────────────────────────────────────────────────────────

  // ── Projects ──────────────────────────────────────────────────────────────
  app.get("/api/projects", async (_req, res) => {
    noCache(res);
    res.json(await db.getProjects());
  });

  app.get("/api/projects/:slug", async (req, res) => {
    noCache(res);
    const all = await db.getProjects();
    const project = all.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
    if (!project) return res.status(404).json({ error: "Projeto não encontrado" });
    res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    noCache(res);
    const project = req.body;
    if (!project.id) project.id = generateId();
    if (!project.slug) project.slug = slugify(project.title || project.id);
    if (!project.createdAt) project.createdAt = new Date().toISOString();
    await db.saveProject(project);
    res.json(project);
  });

  app.put("/api/projects/:id", async (req, res) => {
    noCache(res);
    const project = { ...req.body, id: req.params.id };
    if (!project.slug) project.slug = slugify(project.title || project.id);
    await db.saveProject(project);
    res.json(project);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    noCache(res);
    await db.deleteProject(req.params.id);
    res.json({ ok: true });
  });

  // ── Partners ──────────────────────────────────────────────────────────────
  app.get("/api/partners", async (_req, res) => {
    noCache(res);
    res.json(await db.getPartners());
  });

  app.get("/api/partners/:slug", async (req, res) => {
    noCache(res);
    const all = await db.getPartners();
    const partner = all.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
    if (!partner) return res.status(404).json({ error: "Parceiro não encontrado" });
    res.json(partner);
  });

  app.post("/api/partners", async (req, res) => {
    noCache(res);
    const partner = req.body;
    if (!partner.id) partner.id = generateId();
    if (!partner.slug) partner.slug = slugify(partner.name || partner.id);
    if (!partner.createdAt) partner.createdAt = new Date().toISOString();
    await db.savePartner(partner);
    res.json(partner);
  });

  app.put("/api/partners/:id", async (req, res) => {
    noCache(res);
    const partner = { ...req.body, id: req.params.id };
    if (!partner.slug) partner.slug = slugify(partner.name || partner.id);
    await db.savePartner(partner);
    res.json(partner);
  });

  app.delete("/api/partners/:id", async (req, res) => {
    noCache(res);
    await db.deletePartner(req.params.id);
    res.json({ ok: true });
  });

  // ── Timeline ──────────────────────────────────────────────────────────────
  app.get("/api/timeline", async (_req, res) => {
    noCache(res);
    res.json(await db.getTimeline());
  });

  app.post("/api/timeline", async (req, res) => {
    noCache(res);
    const entry = req.body;
    if (!entry.id) entry.id = generateId();
    if (!entry.createdAt) entry.createdAt = new Date().toISOString();
    await db.saveTimelineEntry(entry);
    res.json(entry);
  });

  app.put("/api/timeline/:id", async (req, res) => {
    noCache(res);
    const entry = { ...req.body, id: req.params.id };
    await db.saveTimelineEntry(entry);
    res.json(entry);
  });

  app.delete("/api/timeline/:id", async (req, res) => {
    noCache(res);
    await db.deleteTimelineEntry(req.params.id);
    res.json({ ok: true });
  });

  // ── Contact ───────────────────────────────────────────────────────────────
  app.get("/api/contact", async (_req, res) => {
    noCache(res);
    res.json(await db.getContact());
  });

  app.put("/api/contact", async (req, res) => {
    noCache(res);
    await db.saveContact(req.body);
    res.json(await db.getContact());
  });

  // ── Settings ──────────────────────────────────────────────────────────────
  app.get("/api/settings", async (_req, res) => {
    noCache(res);
    res.json(await db.getSettings());
  });

  app.put("/api/settings", async (req, res) => {
    noCache(res);
    await db.saveSettings(req.body);
    res.json(await db.getSettings());
  });

  // ── Data export/import (for migration) ───────────────────────────────────
  app.get("/api/export", async (_req, res) => {
    noCache(res);
    res.json(await db.export());
  });

  app.post("/api/import", async (req, res) => {
    noCache(res);
    try {
      await db.import(req.body);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ── File upload ───────────────────────────────────────────────────────────
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    let tmpPath: string | null = null;
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
      }

      const cfg = cloudinary.config();
      if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
        res.status(500).json({
          error: "Cloudinary não configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.",
        });
        return;
      }

      const isVideo = req.file.mimetype.startsWith("video/");
      const ext = req.file.originalname.split(".").pop()?.toLowerCase() ?? "bin";
      tmpPath = path.join(os.tmpdir(), `nh-upload-${Date.now()}.${ext}`);
      fs.writeFileSync(tmpPath, req.file.buffer);

      const result = await cloudinary.uploader.upload(tmpPath, {
        folder: "nova-habitar",
        resource_type: isVideo ? "video" : "image",
        use_filename: true,
        unique_filename: true,
      });

      res.json({ url: result.secure_url });
    } catch (err: any) {
      console.error("[upload] Error:", err);
      res.status(500).json({ error: err.message ?? "Erro interno no upload" });
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FILES  (long-lived cache for assets, no-cache for HTML)
  // ─────────────────────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // Assets (JS, CSS, images) — cache 1 year (they have content hashes)
  app.use(
    express.static(staticPath, {
      maxAge: "1y",
      immutable: true,
      // Do NOT cache index.html
      setHeaders(res, filePath) {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
          res.setHeader("Pragma", "no-cache");
        }
      },
    })
  );

  // SPA fallback — serve index.html for client-side routes (no-cache)
  app.get("*", (_req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.NODE_ENV === "production"
    ? Number(process.env.PORT ?? 3000)
    : 3001;

  server.listen(port, () => {
    console.log(`[Nova Habitar] Server running on http://localhost:${port}/`);
    if (cloudinary.config().cloud_name) {
      console.log(`[Cloudinary] Connected to cloud "${cloudinary.config().cloud_name}"`);
    } else {
      console.warn("[Cloudinary] NOT configured — set env vars");
    }
  });
}

startServer().catch(console.error);
