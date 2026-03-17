import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import os from "os";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Cloudinary config ─────────────────────────────────────────────────────
// Set these env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// multer: store file in memory (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB (for videos)
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

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ── Upload endpoint ────────────────────────────────────────────────────────
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    let tmpPath: string | null = null;
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
      }

      // Check Cloudinary is configured
      const cfg = cloudinary.config();
      if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
        res.status(500).json({ error: "Cloudinary não configurado. Defina as variáveis de ambiente CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET." });
        return;
      }

      // Determine resource type
      const isVideo = req.file.mimetype.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";

      // Write buffer to temp file so Cloudinary SDK can read it
      const ext = req.file.originalname.split(".").pop()?.toLowerCase() ?? "bin";
      tmpPath = path.join(os.tmpdir(), `nh-upload-${Date.now()}.${ext}`);
      fs.writeFileSync(tmpPath, req.file.buffer);

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(tmpPath, {
        folder: "nova-habitar",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      });

      res.json({ url: result.secure_url });
    } catch (err: any) {
      console.error("[upload] Error:", err);
      res.status(500).json({ error: err.message ?? "Erro interno no upload" });
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  });

  // ── Static files ───────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.NODE_ENV === "production"
    ? (process.env.PORT || 3000)
    : 3001;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    if (cloudinary.config().cloud_name) {
      console.log(`Cloudinary: connected to cloud "${cloudinary.config().cloud_name}"`);
    } else {
      console.warn("Cloudinary: NOT configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    }
  });
}

startServer().catch(console.error);
