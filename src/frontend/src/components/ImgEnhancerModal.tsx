import { Download, Loader2, Sparkles, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCENT = "rgba(168,85,247,";
const DEEP_IMAGE_KEY = "745e2ff0-2815-11f1-a8dd-a70aad35476e";

export default function ImgEnhancerModal({ open, onClose }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setResultUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      // Strip data:image/...;base64, prefix
      const b64 = dataUrl.split(",")[1];
      setBase64(b64);
    };
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

  const handleEnhance = async () => {
    if (!base64) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://deep-image.ai/rest_api/process", {
        method: "POST",
        headers: {
          "x-api-key": DEEP_IMAGE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          preset: "auto_enhance_pro",
          output_format: "jpg",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      const data = await res.json();
      // Deep Image returns { output_url: "..." } or similar
      const outputUrl = data.output_url || data.url || data.result_url;
      if (outputUrl) {
        setResultUrl(outputUrl);
      } else if (data.job_id || data.id) {
        // Poll for result
        await pollResult(data.job_id || data.id);
      } else {
        throw new Error("Unexpected response from Deep Image API.");
      }
    } catch (err: any) {
      setError(err?.message || "Enhancement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pollResult = async (jobId: string, attempts = 0): Promise<void> => {
    if (attempts > 20)
      throw new Error("Enhancement timed out. Please try again.");
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`https://deep-image.ai/rest_api/result/${jobId}`, {
      headers: { "x-api-key": DEEP_IMAGE_KEY },
    });
    if (!res.ok) throw new Error(`Poll error ${res.status}`);
    const data = await res.json();
    if (data.status === "complete" || data.output_url) {
      setResultUrl(data.output_url || data.url);
    } else if (data.status === "failed") {
      throw new Error("Enhancement failed on server.");
    } else {
      return pollResult(jobId, attempts + 1);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "enhanced-image.jpg";
    a.target = "_blank";
    a.click();
  };

  const handleClose = () => {
    setPreview(null);
    setBase64(null);
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
      data-ocid="img_enhancer.modal"
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
              AI Image Enhancer
            </h2>
            <p className="text-sm text-slate-400">Powered by Deep Image AI</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-white/10"
            style={{ color: `${ACCENT}0.7)` }}
            data-ocid="img_enhancer.close_button"
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
            data-ocid="img_enhancer.dropzone"
          >
            <Upload className="w-8 h-8" style={{ color: `${ACCENT}0.6)` }} />
            <p className="text-slate-300 text-sm font-medium">
              Drop your image here to enhance
            </p>
            <button
              type="button"
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: `${ACCENT}0.12)`,
                border: `1px solid ${ACCENT}0.35)`,
                color: `${ACCENT}0.9)`,
              }}
              data-ocid="img_enhancer.upload_button"
            >
              Browse Image
            </button>
          </div>
        ) : (
          <div className="mb-6">
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
                  Enhanced
                </p>
                <div
                  className="rounded-xl overflow-hidden flex items-center justify-center min-h-[120px]"
                  style={{
                    border: `1px solid ${ACCENT}0.2)`,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {loading ? (
                    <div
                      className="flex flex-col items-center gap-2 py-8"
                      data-ocid="img_enhancer.loading_state"
                    >
                      <Loader2
                        className="w-8 h-8 animate-spin"
                        style={{ color: `${ACCENT}0.7)` }}
                      />
                      <p className="text-xs text-slate-400">Enhancing...</p>
                    </div>
                  ) : resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Enhanced"
                      className="w-full object-contain max-h-52"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Sparkles
                        className="w-8 h-8"
                        style={{ color: `${ACCENT}0.3)` }}
                      />
                      <p className="text-xs text-slate-500">
                        Enhanced result here
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
                setBase64(null);
                setResultUrl(null);
                setError(null);
              }}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              data-ocid="img_enhancer.secondary_button"
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
          data-ocid="img_enhancer.input"
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
            data-ocid="img_enhancer.error_state"
          >
            {error}
          </div>
        )}

        {/* Action buttons */}
        {preview && (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleEnhance}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background: loading
                  ? `${ACCENT}0.08)`
                  : `linear-gradient(135deg, ${ACCENT}0.8), rgba(236,72,153,0.6))`,
                border: `1px solid ${ACCENT}0.4)`,
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 0 20px ${ACCENT}0.25)`,
              }}
              data-ocid="img_enhancer.primary_button"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Enhancing..." : "Enhance Image"}
            </button>

            {resultUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                style={{
                  background: `${ACCENT}0.12)`,
                  border: `1px solid ${ACCENT}0.35)`,
                  color: `${ACCENT}0.9)`,
                }}
                data-ocid="img_enhancer.save_button"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
