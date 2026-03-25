import { Download, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCENT = "rgba(52,211,153,";

export default function BgRemoverModal({ open, onClose }: Props) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setResultUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleRemoveBg = async () => {
    if (!originalFile) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image_file", originalFile);
      formData.append("size", "auto");
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": "eRjqWdFqvkQ6co9uYJJxhBVR" },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err: any) {
      if (
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("CORS")
      ) {
        setError(
          "CORS error: remove.bg blocks direct browser calls. Please try via a desktop app or use a proxy.",
        );
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "removed-bg.png";
    a.click();
  };

  const handleClose = () => {
    setPreview(null);
    setOriginalFile(null);
    setResultUrl(null);
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      data-ocid="bg_remover.modal"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8"
        style={{
          background: "rgba(10,12,24,0.95)",
          border: `1px solid ${ACCENT}0.25)`,
          boxShadow: `0 0 60px ${ACCENT}0.1), 0 24px 80px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Background Remover
            </h2>
            <p className="text-sm text-slate-400">
              AI-powered background removal via remove.bg
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-white/10"
            style={{ color: `${ACCENT}0.7)` }}
            data-ocid="bg_remover.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload area */}
        {!preview ? (
          // biome-ignore lint/a11y/useKeyWithClickEvents: drag-and-drop zone
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-all duration-300"
            style={{
              borderColor: dragging ? `${ACCENT}0.7)` : `${ACCENT}0.25)`,
              background: dragging ? `${ACCENT}0.06)` : `${ACCENT}0.02)`,
            }}
            data-ocid="bg_remover.dropzone"
          >
            <Upload className="w-8 h-8" style={{ color: `${ACCENT}0.6)` }} />
            <p className="text-slate-300 text-sm font-medium">
              Drop your image here
            </p>
            <button
              type="button"
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: `${ACCENT}0.12)`,
                border: `1px solid ${ACCENT}0.35)`,
                color: `${ACCENT}0.9)`,
              }}
              data-ocid="bg_remover.upload_button"
            >
              Browse Image
            </button>
          </div>
        ) : (
          <div className="mb-6">
            {/* Before / After */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 mb-2 text-center">
                  Original
                </p>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${ACCENT}0.2)` }}
                >
                  <img
                    src={preview}
                    alt="Original"
                    className="w-full object-contain max-h-52"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2 text-center">
                  Result
                </p>
                <div
                  className="rounded-xl overflow-hidden flex items-center justify-center min-h-[120px]"
                  style={{
                    border: `1px solid ${ACCENT}0.2)`,
                    background:
                      "repeating-conic-gradient(#1e2030 0% 25%, #252840 0% 50%) 0 0 / 16px 16px",
                  }}
                >
                  {loading ? (
                    <div
                      className="flex flex-col items-center gap-2"
                      data-ocid="bg_remover.loading_state"
                    >
                      <Loader2
                        className="w-8 h-8 animate-spin"
                        style={{ color: `${ACCENT}0.7)` }}
                      />
                      <p className="text-xs text-slate-400">Processing...</p>
                    </div>
                  ) : resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Result"
                      className="w-full object-contain max-h-52"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <ImageIcon
                        className="w-8 h-8"
                        style={{ color: `${ACCENT}0.3)` }}
                      />
                      <p className="text-xs text-slate-500">
                        Result will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setOriginalFile(null);
                setResultUrl(null);
                setError(null);
              }}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              data-ocid="bg_remover.secondary_button"
            >
              Remove image
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          data-ocid="bg_remover.input"
        />

        {/* Error */}
        {error && (
          <div
            className="mt-4 rounded-xl p-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
            }}
            data-ocid="bg_remover.error_state"
          >
            {error}
          </div>
        )}

        {/* Action buttons */}
        {preview && (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleRemoveBg}
              disabled={loading || !originalFile}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background: loading
                  ? `${ACCENT}0.08)`
                  : `linear-gradient(135deg, ${ACCENT}0.8), rgba(34,211,238,0.6))`,
                border: `1px solid ${ACCENT}0.4)`,
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 0 20px ${ACCENT}0.25)`,
              }}
              data-ocid="bg_remover.primary_button"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Removing Background..." : "Remove Background"}
            </button>

            {resultUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300"
                style={{
                  background: `${ACCENT}0.12)`,
                  border: `1px solid ${ACCENT}0.35)`,
                  color: `${ACCENT}0.9)`,
                }}
                data-ocid="bg_remover.save_button"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
