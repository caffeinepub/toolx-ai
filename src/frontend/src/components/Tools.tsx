import {
  Check,
  FileText,
  Layers,
  Loader2,
  Lock,
  Scissors,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Plan, useUserPlan } from "../hooks/useQueries";
import BgRemoverModal from "./BgRemoverModal";
import BulkConverterModal from "./BulkConverterModal";
import ImgEnhancerModal from "./ImgEnhancerModal";
import ImgGeneratorModal from "./ImgGeneratorModal";
import LoginModal from "./LoginModal";
import PngToPdfModal from "./PngToPdfModal";
import UpgradeModal from "./UpgradeModal";

const tools = [
  {
    id: "png-to-pdf",
    icon: FileText,
    title: "PNG to PDF Converter",
    description:
      "Convert PNG images to PDF instantly. No quality loss. Download in seconds.",
    plan: "free" as const,
    gradient: "from-cyan-500 to-blue-500",
    glowColor: "rgba(34, 211, 238, 0.35)",
    borderHover: "rgba(34, 211, 238, 0.45)",
    accentColor: "rgba(34, 211, 238, 0.12)",
    guestBg:
      "linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.62 0.22 255))",
  },
  {
    id: "bg-remover",
    icon: Scissors,
    title: "Background Remover",
    description:
      "Remove backgrounds from any image with AI precision. 5 free uses/day.",
    plan: "free" as const,
    gradient: "from-emerald-400 to-cyan-500",
    glowColor: "rgba(52, 211, 153, 0.35)",
    borderHover: "rgba(52, 211, 153, 0.45)",
    accentColor: "rgba(52, 211, 153, 0.12)",
    guestBg:
      "linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.62 0.22 255))",
  },
  {
    id: "img-enhancer",
    icon: Sparkles,
    title: "AI Image Enhancer",
    description:
      "Upscale and enhance image quality using deep AI. Crystal clear results.",
    plan: "pro" as const,
    gradient: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.35)",
    borderHover: "rgba(168, 85, 247, 0.5)",
    accentColor: "rgba(168, 85, 247, 0.12)",
    guestBg:
      "linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.62 0.22 255))",
  },
  {
    id: "img-generator",
    icon: Wand2,
    title: "AI Image Generator",
    description:
      "Generate stunning images from text prompts with AI. Infinite creativity.",
    plan: "pro" as const,
    gradient: "from-orange-400 to-pink-500",
    glowColor: "rgba(251, 146, 60, 0.35)",
    borderHover: "rgba(251, 146, 60, 0.45)",
    accentColor: "rgba(251, 146, 60, 0.12)",
    guestBg:
      "linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.62 0.22 255))",
  },
  {
    id: "bulk-converter",
    icon: Layers,
    title: "Bulk File Converter",
    description:
      "Convert hundreds of files at once. Lightning fast batch processing.",
    plan: "pro" as const,
    gradient: "from-blue-500 to-violet-500",
    glowColor: "rgba(99, 102, 241, 0.35)",
    borderHover: "rgba(99, 102, 241, 0.45)",
    accentColor: "rgba(99, 102, 241, 0.12)",
    guestBg:
      "linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.62 0.22 255))",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) ref.current?.classList.add("visible");
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Tools() {
  const sectionRef = useReveal();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pngToPdfOpen, setPngToPdfOpen] = useState(false);
  const [bgRemoverOpen, setBgRemoverOpen] = useState(false);
  const [imgEnhancerOpen, setImgEnhancerOpen] = useState(false);
  const [imgGeneratorOpen, setImgGeneratorOpen] = useState(false);
  const [bulkConverterOpen, setBulkConverterOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = loginStatus === "success" && !!identity;
  const { data: plan } = useUserPlan();

  const handleToolClick = (tool: (typeof tools)[0]) => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    if (tool.plan === "pro" && plan !== Plan.pro) {
      setUpgradeOpen(true);
      return;
    }
    if (tool.id === "png-to-pdf") {
      setPngToPdfOpen(true);
      return;
    }
    if (tool.id === "bg-remover") {
      setBgRemoverOpen(true);
      return;
    }
    if (tool.id === "img-enhancer") {
      setImgEnhancerOpen(true);
      return;
    }
    if (tool.id === "img-generator") {
      setImgGeneratorOpen(true);
      return;
    }
    if (tool.id === "bulk-converter") {
      setBulkConverterOpen(true);
      return;
    }
  };

  const getButtonState = (tool: (typeof tools)[0]) => {
    if (!isAuthenticated) return "guest";
    if (tool.plan === "pro" && plan !== Plan.pro) return "locked";
    return "active";
  };

  return (
    <section id="tools" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div ref={sectionRef} className="reveal max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "oklch(0.78 0.18 195)" }}
          >
            AI Tools
          </span>
          <h2
            className="font-display font-bold text-white mb-5"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "-0.02em",
            }}
          >
            Everything You Need to Create
          </h2>
          <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            From conversion to AI generation — all tools unified in one
            platform.
          </p>
        </div>

        {/* Tool cards grid */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          }}
          data-ocid="tools.list"
        >
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            const btnState = getButtonState(tool);
            const isPro = tool.plan === "pro";
            const isHovered = hoveredCard === tool.id;

            const btnBackground =
              btnState === "locked"
                ? "rgba(168,85,247,0.08)"
                : btnState === "active"
                  ? tool.accentColor
                  : btnState === "guest"
                    ? tool.guestBg
                    : undefined;

            const btnBorder =
              btnState === "locked"
                ? "1px solid rgba(168,85,247,0.35)"
                : btnState === "active"
                  ? `1px solid ${tool.borderHover}`
                  : undefined;

            const btnColor =
              btnState === "locked"
                ? "#c4b5fd"
                : btnState === "active" || btnState === "guest"
                  ? "white"
                  : undefined;

            return (
              <div
                key={tool.id}
                className="tool-card relative rounded-2xl p-7 transition-all duration-300 cursor-default"
                style={{
                  background: isHovered
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.035)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: isHovered
                    ? `1px solid ${tool.borderHover}`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isHovered
                    ? `0 20px 60px ${tool.glowColor}, 0 0 0 1px ${tool.borderHover}, inset 0 1px 0 rgba(255,255,255,0.08)`
                    : "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                }}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
                data-ocid={`tools.item.${idx + 1}`}
              >
                {/* Top-edge highlight that blooms on hover */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-px rounded-full transition-all duration-500"
                  style={{
                    width: isHovered ? "80%" : "0%",
                    background: `linear-gradient(90deg, transparent, ${tool.borderHover}, transparent)`,
                  }}
                />

                {/* Plan badge */}
                <div className="absolute top-5 right-5">
                  {isPro ? (
                    <span className="badge-pro">PRO 🔒</span>
                  ) : (
                    <span className="badge-free">FREE</span>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${tool.gradient} transition-all duration-300`}
                  style={{
                    width: "52px",
                    height: "52px",
                    boxShadow: isHovered
                      ? `0 8px 24px ${tool.glowColor}`
                      : "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-white text-lg mb-2.5 pr-16 leading-snug">
                  {tool.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-7">
                  {tool.description}
                </p>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => handleToolClick(tool)}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: btnBackground,
                    border: btnBorder,
                    color: btnColor,
                  }}
                  data-ocid={`tools.item.${idx + 1}.button`}
                >
                  {btnState === "locked" && <Lock className="w-4 h-4" />}
                  <span>
                    {btnState === "locked"
                      ? "Upgrade to Pro"
                      : btnState === "guest"
                        ? "Try Free Now"
                        : "Launch Tool →"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <PngToPdfModal
        open={pngToPdfOpen}
        onClose={() => setPngToPdfOpen(false)}
      />
      <BgRemoverModal
        open={bgRemoverOpen}
        onClose={() => setBgRemoverOpen(false)}
      />
      <ImgEnhancerModal
        open={imgEnhancerOpen}
        onClose={() => setImgEnhancerOpen(false)}
      />
      <ImgGeneratorModal
        open={imgGeneratorOpen}
        onClose={() => setImgGeneratorOpen(false)}
      />
      <BulkConverterModal
        open={bulkConverterOpen}
        onClose={() => setBulkConverterOpen(false)}
      />
    </section>
  );
}
