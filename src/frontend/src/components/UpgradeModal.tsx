import { ArrowRight, Crown, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ open, onClose }: Props) {
  if (!open) return null;

  const handleUpgrade = () => {
    onClose();
    document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(4,6,15,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      data-ocid="upgrade.modal"
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 text-center"
        style={{
          background: "rgba(15,10,30,0.95)",
          backdropFilter: "blur(28px)",
          border: "1px solid rgba(139,92,246,0.4)",
          boxShadow:
            "0 0 40px rgba(139,92,246,0.25), 0 0 80px rgba(139,92,246,0.1)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          data-ocid="upgrade.close_button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <h3 className="font-display font-bold text-2xl text-white mb-3">
          Unlock Pro Features
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          This tool requires a Pro plan. Upgrade to get unlimited access to all
          AI tools including Image Enhancer, Generator, and Bulk Converter.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUpgrade}
            className="btn-gradient w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            data-ocid="upgrade.confirm_button"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white transition-colors"
            data-ocid="upgrade.cancel_button"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
