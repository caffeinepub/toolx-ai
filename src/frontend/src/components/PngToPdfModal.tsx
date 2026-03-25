import { Download, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { imagesToPdf } from "../lib/imagesToPdf";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PngToPdfModal({ open, onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(f.type),
    );
    if (!arr.length) return;
    setFiles((prev) => [...prev, ...arr]);
    for (const file of arr) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }
    setDone(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleConvert = async () => {
    if (!previews.length) return;
    setConverting(true);
    try {
      const blob = await imagesToPdf(previews);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } finally {
      setConverting(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setPreviews([]);
    setDone(false);
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  if (!open) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close on click
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      data-ocid="png_to_pdf.modal"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8"
        style={{
          background: "rgba(10,12,24,0.95)",
          border: "1px solid rgba(34,211,238,0.25)",
          boxShadow:
            "0 0 60px rgba(34,211,238,0.12), 0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PNG to PDF Converter
            </h2>
            <p className="text-sm text-slate-400">
              Upload images and download as a single PDF
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-white/10"
            style={{ color: "rgba(34,211,238,0.7)" }}
            data-ocid="png_to_pdf.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop zone */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: drag-and-drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all duration-300 mb-6"
          style={{
            borderColor: dragging
              ? "rgba(34,211,238,0.7)"
              : "rgba(34,211,238,0.25)",
            background: dragging
              ? "rgba(34,211,238,0.06)"
              : "rgba(34,211,238,0.02)",
          }}
          data-ocid="png_to_pdf.dropzone"
        >
          <Upload
            className="w-8 h-8"
            style={{ color: "rgba(34,211,238,0.6)" }}
          />
          <p className="text-slate-300 text-sm font-medium">
            Drag & drop images here
          </p>
          <p className="text-slate-500 text-xs">or</p>
          <button
            type="button"
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.35)",
              color: "rgba(34,211,238,0.9)",
            }}
            data-ocid="png_to_pdf.upload_button"
          >
            Browse Files
          </button>
          <p className="text-slate-600 text-xs">PNG, JPG, JPEG supported</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          data-ocid="png_to_pdf.input"
        />

        {/* Thumbnails */}
        {previews.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">
                {previews.length} image{previews.length > 1 ? "s" : ""} selected
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                data-ocid="png_to_pdf.secondary_button"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {previews.map((src, i) => (
                <div
                  key={src}
                  className="relative rounded-lg overflow-hidden aspect-square"
                  style={{ border: "1px solid rgba(34,211,238,0.15)" }}
                  data-ocid={`png_to_pdf.item.${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 text-center text-xs py-0.5"
                    style={{ background: "rgba(0,0,0,0.6)", color: "#94a3b8" }}
                  >
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convert button */}
        <button
          type="button"
          onClick={handleConvert}
          disabled={!files.length || converting}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background:
              files.length && !converting
                ? "linear-gradient(135deg, rgba(34,211,238,0.8), rgba(99,102,241,0.8))"
                : "rgba(255,255,255,0.05)",
            color:
              files.length && !converting ? "white" : "rgba(255,255,255,0.3)",
            cursor: files.length && !converting ? "pointer" : "not-allowed",
            boxShadow:
              files.length && !converting
                ? "0 0 24px rgba(34,211,238,0.25)"
                : "none",
          }}
          data-ocid="png_to_pdf.primary_button"
        >
          {converting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span data-ocid="png_to_pdf.loading_state">Converting...</span>
            </>
          ) : done ? (
            <>
              <Download className="w-4 h-4" />
              <span data-ocid="png_to_pdf.success_state">
                Downloaded! Convert Again?
              </span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Convert to PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
