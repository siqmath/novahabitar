import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer: store file in memory (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "video/mp4", "video/webm", "video/quicktime",
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
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
      }

      const ext = req.file.originalname.split(".").pop() ?? "bin";
      const uniqueName = `${nanoid(12)}.${ext}`;
      const filePath = `nova-habitar/media/${uniqueName}`;

      const forgeUrl = process.env.BUILT_IN_FORGE_API_URL ?? "https://forge.manus.ai";
      const forgeKey = process.env.BUILT_IN_FORGE_API_KEY ?? "";

      const form = new FormData();
      form.append("file", req.file.buffer, {
        filename: uniqueName,
        contentType: req.file.mimetype,
      });
      form.append("file_path", filePath);

      const response = await fetch(`${forgeUrl}/v1/storage/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${forgeKey}`,
          ...form.getHeaders(),
        },
        body: form,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("[upload] Forge error:", response.status, text);
        res.status(502).json({ error: "Falha no upload para o storage" });
        return;
      }

      const data = (await response.json()) as { url: string };
      res.json({ url: data.url });
    } catch (err) {
      console.error("[upload] Error:", err);
      res.status(500).json({ error: "Erro interno no upload" });
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

  // In dev, Vite runs on 3000 and proxies /api to 3001
  const port = process.env.NODE_ENV === "production"
    ? (process.env.PORT || 3000)
    : 3001;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
