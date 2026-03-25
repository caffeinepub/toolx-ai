import {
  CheckCircle,
  Clock,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Scissors,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useEffect, useRef } from "react";

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

const activities = [
  {
    id: "a1",
    icon: FileText,
    tool: "PNG to PDF",
    time: "2 min ago",
    status: "Done",
    color: "text-cyan-400",
  },
  {
    id: "a2",
    icon: Scissors,
    tool: "Background Remover",
    time: "15 min ago",
    status: "Done",
    color: "text-green-400",
  },
  {
    id: "a3",
    icon: Sparkles,
    tool: "AI Image Enhancer",
    time: "1 hr ago",
    status: "Done",
    color: "text-purple-400",
  },
  {
    id: "a4",
    icon: FileText,
    tool: "PNG to PDF",
    time: "3 hr ago",
    status: "Done",
    color: "text-cyan-400",
  },
  {
    id: "a5",
    icon: Scissors,
    tool: "Background Remover",
    time: "Yesterday",
    status: "Done",
    color: "text-green-400",
  },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Wrench, label: "Tools", active: false },
  { icon: FolderOpen, label: "Files", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const statCards = [
  {
    label: "Files Processed",
    value: "1,284",
    color: "from-cyan-500 to-blue-500",
  },
  { label: "Tools Used", value: "5", color: "from-purple-500 to-pink-500" },
  { label: "Plan", value: "Pro", color: "from-orange-400 to-pink-500" },
];

export default function Dashboard() {
  const sectionRef = useReveal();

  return (
    <section id="dashboard" className="relative py-24 px-4 overflow-hidden">
      <div ref={sectionRef} className="reveal max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "oklch(0.65 0.28 295)" }}
          >
            Dashboard
          </span>
          <h2
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: "clamp(28px, 4.5vw, 44px)" }}
          >
            Your AI Workspace, Reimagined
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Track usage, manage files, and access all your tools from a unified
            dashboard.
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, rgba(34,211,238,0.08) 50%, transparent 80%)",
              filter: "blur(40px)",
              transform: "scale(1.1)",
            }}
          />

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10,8,25,0.9)",
              border: "1px solid rgba(139,92,246,0.3)",
              boxShadow:
                "0 0 60px rgba(139,92,246,0.2), 0 30px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Browser top bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
              </div>
              <div
                className="flex-1 max-w-xs mx-auto rounded-lg px-3 py-1 text-xs text-slate-500 text-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                app.toolxai.com/dashboard
              </div>
            </div>

            {/* App layout */}
            <div className="flex" style={{ minHeight: "380px" }}>
              {/* Sidebar */}
              <div
                className="w-48 flex-shrink-0 py-6 px-3"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-2 px-3 mb-8">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="text-white text-sm font-bold font-display">
                    ToolX AI
                  </span>
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map(({ icon: Icon, label, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                        active ? "text-white" : "text-slate-500"
                      }`}
                      style={{
                        background: active
                          ? "rgba(139,92,246,0.15)"
                          : undefined,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main content */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="mb-6">
                  <h3 className="text-white font-display font-bold text-lg mb-1">
                    Overview
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Welcome back, Aryan 👋
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {statCards.map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="text-slate-400 text-xs mb-1">{label}</div>
                      <div
                        className={`font-display font-bold text-lg bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h4 className="text-white text-sm font-semibold mb-3">
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    {activities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-slate-200 text-xs font-medium">
                              {activity.tool}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-slate-500 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </span>
                            <span className="text-green-400 text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
