import { useState } from "react";

export default function UploadTest() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

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
      setSuccess(`Upload OK! URL: ${data.url}`);
      setPreviewUrl(data.url);
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Upload Test (REST /api/upload)</h1>
      <input type="file" onChange={handleFileSelect} accept="image/*,video/*" disabled={uploading} />
      {uploading && <p>Enviando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {previewUrl && (
        <div style={{ marginTop: "1rem" }}>
          <img src={previewUrl} alt="preview" style={{ maxWidth: "300px", maxHeight: "300px" }} />
        </div>
      )}
    </div>
  );
}
