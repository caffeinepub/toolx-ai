import { LogIn, X, Zap } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const { login, isLoggingIn } = useInternetIdentity();

  if (!open) return null;

  const handleLogin = async () => {
    await login();
    onClose();
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
      data-ocid="login.modal"
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 text-center"
        style={{
          background: "rgba(15,10,30,0.95)",
          backdropFilter: "blur(28px)",
          border: "1px solid rgba(34,211,238,0.3)",
          boxShadow: "0 0 40px rgba(34,211,238,0.15)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          data-ocid="login.close_button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-500">
          <Zap className="w-8 h-8 text-white" />
        </div>

        <h3 className="font-display font-bold text-2xl text-white mb-3">
          Login Required
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Sign in to access ToolX AI tools. It&apos;s free to get started — no
          credit card needed.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="btn-gradient w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-60"
            data-ocid="login.submit_button"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoggingIn ? "Signing in..." : "Sign In"}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white transition-colors"
            data-ocid="login.cancel_button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
