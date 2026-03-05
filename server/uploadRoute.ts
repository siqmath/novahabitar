/**
 * REST upload endpoint for images and videos.
 * Accepts multipart/form-data with a "file" field.
 * Returns { url, key } on success.
 */
import { Express, Request, Response } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import { storagePut } from "./storage";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não suportado: ${file.mimetype}`));
    }
  },
});

export function registerUploadRoute(app: Express) {
  app.post(
    "/api/upload",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          res.status(400).json({ error: "Nenhum arquivo enviado." });
          return;
        }

        const { buffer, mimetype, originalname } = req.file;
        const ext = originalname.split(".").pop() || "bin";
        const key = `nova-habitar/uploads/${nanoid()}.${ext}`;

        const { url } = await storagePut(key, buffer, mimetype);

        res.json({ url, key });
      } catch (err: any) {
        console.error("[Upload] Error:", err.message);
        res.status(500).json({ error: err.message || "Erro ao fazer upload." });
      }
    }
  );
}
