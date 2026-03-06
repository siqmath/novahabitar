/**
 * Nova Habitar — Express Server
 * In development: starts Vite on port 3000, proxies non-API requests to it.
 * In production: serves built frontend + API on a single port.
 */

import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { execFile, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import os from "os";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execFileAsync = promisify(execFile);

// multer: store file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
      "video/mp4", "video/webm", "video/quicktime", "video/ogg",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo nao suportado: ${file.mimetype}`));
    }
  },
});

async function startServer() {
  const app = express();
  const server = createServer(app);
  const isDev = process.env.NODE_ENV !== "production";

  // ── Upload endpoint ──────────────────────────────────────────────────────
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    let tmpPath: string | null = null;
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
      }

      const ext = req.file.originalname.split(".").pop()?.toLowerCase() ?? "bin";
      tmpPath = path.join(os.tmpdir(), `nh-upload-${Date.now()}.${ext}`);
      fs.writeFileSync(tmpPath, req.file.buffer);

      const { stdout } = await execFileAsync("manus-upload-file", [tmpPath], {
        timeout: 60_000,
      });

      const match = stdout.match(/CDN URL:\s*(https?:\/\/\S+)/);
      if (!match) {
        console.error("[upload] Could not parse CDN URL from:", stdout);
        res.status(502).json({ error: "Falha ao obter URL do arquivo" });
        return;
      }

      res.json({ url: match[1] });
    } catch (err) {
      console.error("[upload] Error:", err);
      res.status(500).json({ error: "Erro interno no upload" });
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  });

  // ── Frontend serving ─────────────────────────────────────────────────────
  if (isDev) {
    // Start Vite dev server on port 3000
    const vitePort = 3000;
    const rootDir = path.resolve(__dirname, "..", "..");
    const vite = spawn("pnpm", ["exec", "vite", "--host", "--port", String(vitePort)], {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, FORCE_COLOR: "1" },
    });
    vite.on("error", (err) => console.error("[vite]", err));
    process.on("exit", () => vite.kill());

    // Proxy all non-API requests to Vite (with a small delay to let Vite start)
    setTimeout(() => {
      const viteProxy = createProxyMiddleware({
        target: `http://localhost:${vitePort}`,
        changeOrigin: true,
        ws: true,
      });
      app.use(viteProxy);
    }, 3000);
  } else {
    // Production: serve built files
    const staticPath = path.resolve(__dirname, "..", "..", "dist", "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = isDev ? 3001 : Number(process.env.PORT ?? 3000);

  server.listen(port, () => {
    console.log(`[Nova Habitar] Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
