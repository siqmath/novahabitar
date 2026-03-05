/**
 * FileUpload — Drag & drop / click to upload images and videos
 * Uploads to /api/upload (REST multipart endpoint)
 * Returns CDN URL on success
 */

import { useState, useRef, useCallback } from "react";
import { Upload, X, Film, Image as ImageIcon, Loader2 } from "lucide-react";

interface FileUploadProps {
  value?: string; // current URL
  onChange: (url: string) => void;
  accept?: "image" | "video" | "both";
  label?: string;
  compact?: boolean; // smaller display for non-cover images
}

const ACCEPTED = {
  image: "image/jpeg,image/png,image/webp,image/gif",
  video: "video/mp4,video/webm,video/quicktime",
  both: "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime",
};

const MAX_SIZE_MB = 50;

export default function FileUpload({
  value,
  onChange,
  accept = "both",
  label = "Clique ou arraste para enviar",
  compact = false,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate size
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${MAX_SIZE_MB}MB`);
        return;
      }

      // Validate type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (accept === "image" && !isImage) { setError("Apenas imagens são aceitas."); return; }
      if (accept === "video" && !isVideo) { setError("Apenas vídeos são aceitos."); return; }
      if (accept === "both" && !isImage && !isVideo) { setError("Formato não suportado."); return; }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: response.statusText }));
          throw new Error(data.error || `Erro ${response.status}`);
        }

        const data = await response.json();
        onChange(data.url);
        setError(null);
      } catch (err: any) {
        setError(`Erro ao enviar: ${err.message}`);
      } finally {
        setUploading(false);
      }
    },
    [accept, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const isVideo = value && (value.includes(".mp4") || value.includes(".webm") || value.includes("video"));

  const height = compact ? "80px" : "160px";

  return (
    <div style={{ width: "100%" }}>
      {/* Preview or Upload zone */}
      {value ? (
        <div style={{ position: "relative", width: "100%", height, backgroundColor: "#0a1420" }}>
          {isVideo ? (
            <video
              src={value}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              playsInline
            />
          ) : (
            <img
              src={value}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {/* Remove button */}
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute",
              top: "0.4rem",
              right: "0.4rem",
              backgroundColor: "rgba(15,27,45,0.85)",
              border: "1px solid rgba(198,166,103,0.3)",
              color: "#F5F3EE",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={13} />
          </button>
          {/* Replace button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: "0.4rem",
              right: "0.4rem",
              backgroundColor: "rgba(15,27,45,0.85)",
              border: "1px solid rgba(198,166,103,0.3)",
              color: "#C6A667",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              padding: "0.3rem 0.6rem",
              cursor: "pointer",
            }}
          >
            Trocar
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            width: "100%",
            height,
            border: `1px dashed ${dragging ? "#C6A667" : "rgba(198,166,103,0.25)"}`,
            backgroundColor: dragging ? "rgba(198,166,103,0.04)" : "rgba(255,255,255,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: uploading ? "wait" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={20} style={{ color: "#C6A667", animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "rgba(245,243,238,0.4)" }}>
                Enviando...
              </span>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: "0.5rem", color: "rgba(198,166,103,0.5)" }}>
                {accept === "image" ? <ImageIcon size={18} /> : accept === "video" ? <Film size={18} /> : <Upload size={18} />}
              </div>
              {!compact && (
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "rgba(245,243,238,0.35)", textAlign: "center", padding: "0 1rem" }}>
                  {label}
                </span>
              )}
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6rem", color: "rgba(245,243,238,0.2)" }}>
                {accept === "image" ? "JPG, PNG, WEBP" : accept === "video" ? "MP4, WEBM" : "Imagens ou vídeos"} · máx {MAX_SIZE_MB}MB
              </span>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "rgba(220,80,80,0.9)", marginTop: "0.4rem" }}>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED[accept]}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
