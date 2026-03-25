import { Download, FileImage, Layers, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { imagesToPdf } from "../lib/imagesToPdf";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCENT = "rgba(99,102,241,";

export default function BulkConverterModal({ open, onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type),
    );
    if (!arr.length) return;
    setFiles((prev) => [...prev, ...arr]);
    setDone(false);
    for (const file of arr) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const convertToPdf = async () => {
    if (!previews.length) return;
    setConverting(true);
    setProgress(0);
    setDone(false);
    try {
      const blob = await imagesToPdf(previews, (pct) => setProgress(pct));
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bulk-converted.pdf";
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
    setProgress(0);
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  if (!open) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      data-ocid="bulk_converter.modal"
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
              Bulk File Converter
            </h2>
            <p className="text-sm text-slate-400">
              Convert multiple images to a single PDF
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-white/10"
            style={{ color: `${ACCENT}0.7)` }}
            data-ocid="bulk_converter.close_button"
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
            borderColor: dragging ? `${ACCENT}0.7)` : `${ACCENT}0.25)`,
            background: dragging ? `${ACCENT}0.06)` : `${ACCENT}0.02)`,
          }}
          data-ocid="bulk_converter.dropzone"
        >
          <Upload className="w-8 h-8" style={{ color: `${ACCENT}0.6)` }} />
          <p className="text-slate-300 text-sm font-medium">
            Drag & drop images here
          </p>
          <button
            type="button"
            className="px-5 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: `${ACCENT}0.12)`,
              border: `1px solid ${ACCENT}0.35)`,
              color: `${ACCENT}0.9)`,
            }}
            data-ocid="bulk_converter.upload_button"
          >
            Browse Files
          </button>
          <p className="text-slate-600 text-xs">
            PNG, JPG, JPEG, WebP supported
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          data-ocid="bulk_converter.input"
        />

        {/* File thumbnails */}
        {previews.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileImage
                  className="w-4 h-4"
                  style={{ color: `${ACCENT}0.6)` }}
                />
                <p className="text-sm text-slate-400">
                  {previews.length} file{previews.length > 1 ? "s" : ""} ready
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                data-ocid="bulk_converter.secondary_button"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 max-h-52 overflow-y-auto">
              {previews.map((src, i) => (
                <div
                  key={src}
                  className="relative rounded-lg overflow-hidden aspect-square"
                  style={{ border: `1px solid ${ACCENT}0.15)` }}
                  data-ocid={`bulk_converter.item.${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`File ${i + 1}`}
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

        {/* Progress */}
        {converting && (
          <div className="mb-5" data-ocid="bulk_converter.loading_state">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Converting...</span>
              <span className="text-xs" style={{ color: `${ACCENT}0.8)` }}>
                {progress}%
              </span>
            </div>
            <div
              className="rounded-full h-1.5 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${ACCENT}0.8), rgba(139,92,246,0.8))`,
                }}
              />
            </div>
          </div>
        )}

        {/* Convert button */}
        <button
          type="button"
          onClick={convertToPdf}
          disabled={!files.length || converting}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background:
              files.length && !converting
                ? `linear-gradient(135deg, ${ACCENT}0.8), rgba(139,92,246,0.8))`
                : "rgba(255,255,255,0.05)",
            color:
              files.length && !converting ? "white" : "rgba(255,255,255,0.3)",
            cursor: files.length && !converting ? "pointer" : "not-allowed",
            boxShadow:
              files.length && !converting ? `0 0 24px ${ACCENT}0.25)` : "none",
          }}
          data-ocid="bulk_converter.primary_button"
        >
          {converting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Converting {progress}%...</span>
            </>
          ) : done ? (
            <>
              <Download className="w-4 h-4" />
              <span data-ocid="bulk_converter.success_state">
                Downloaded! Convert Again?
              </span>
            </>
          ) : (
            <>
              <Layers className="w-4 h-4" />
              <span>Convert All to PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
