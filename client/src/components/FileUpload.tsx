import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video } from "lucide-react";

interface FileUploadProps {
  value?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  isCover?: boolean;
  onSetCover?: () => void;
  accept?: string;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

export default function FileUpload({ value, onUpload, onRemove, label, isCover, onSetCover, accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/ogg" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "HTTP " + res.status);
      }
      const { url } = await res.json();
      onUpload(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (value) {
    const video = isVideo(value);
    return (
      <div style={{ position: "relative", border: "1.5px solid " + (isCover ? "#C6A667" : "rgba(198,166,103,0.2)"), cursor: onSetCover ? "pointer" : "default", width: "100%", aspectRatio: "16/9", backgroundColor: "#0a1420", overflow: "hidden" }} onClick={onSetCover} title={onSetCover ? "Clique para definir como capa" : undefined}>
        {video
          ? <video src={value} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />
          : <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />}
        {isCover && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#C6A667", color: "#0F1B2D", fontSize: "0.5rem", fontWeight: 700, textAlign: "center", letterSpacing: "0.1em", padding: "2px", fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase" }}>CAPA</div>}
        <div style={{ position: "absolute", top: 4, left: 4, backgroundColor: "rgba(10,20,32,0.75)", borderRadius: 2, padding: "2px 4px", display: "flex", alignItems: "center" }}>
          {video ? <Video size={10} style={{ color: "#C6A667" }} /> : <ImageIcon size={10} style={{ color: "#C6A667" }} />}
        </div>
        {onRemove && <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(10,20,32,0.8)", border: "none", cursor: "pointer", padding: 3, display: "flex", alignItems: "center", justifyContent: "center" }} title="Remover"><X size={12} style={{ color: "#F5F3EE" }} /></button>}
        <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ position: "absolute", bottom: isCover ? 16 : 4, right: 4, backgroundColor: "rgba(10,20,32,0.8)", border: "1px solid rgba(198,166,103,0.3)", cursor: "pointer", padding: "2px 6px", display: "flex", alignItems: "center", gap: 3, fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(245,243,238,0.7)" }} title="Trocar"><Upload size={9} /> Trocar</button>
        <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={handleChange} />
      </div>
    );
  }

  return (
    <div>
      {label && <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(245,243,238,0.4)", marginBottom: "0.3rem" }}>{label}</div>}
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => !uploading && inputRef.current?.click()}
        style={{ width: "100%", aspectRatio: "16/9", border: "1.5px dashed " + (error ? "rgba(220,80,80,0.5)" : "rgba(198,166,103,0.25)"), backgroundColor: "rgba(245,243,238,0.02)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.4rem", cursor: uploading ? "wait" : "pointer" }}
        onMouseEnter={(e) => { if (!uploading) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(198,166,103,0.5)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = error ? "rgba(220,80,80,0.5)" : "rgba(198,166,103,0.25)"; }}>
        {uploading ? <Loader2 size={20} style={{ color: "#C6A667" }} className="animate-spin" /> : <Upload size={18} style={{ color: "rgba(198,166,103,0.4)" }} />}
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", color: "rgba(245,243,238,0.3)", textAlign: "center", padding: "0 0.5rem" }}>
          {uploading ? "Enviando..." : error ? error : "Clique ou arraste imagem/vídeo"}
        </span>
      </div>
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={handleChange} />
    </div>
  );
}
