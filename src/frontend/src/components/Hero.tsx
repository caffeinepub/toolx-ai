import { ArrowRight, Play, Rocket, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "1M+", label: "Files Processed" },
  { value: "4.9★", label: "Avg Rating" },
];

const pills = [
  { icon: Zap, label: "Instant Results" },
  { icon: Shield, label: "100% Secure" },
  { icon: Rocket, label: "10× Faster" },
];

const PARTICLES = [
  {
    id: "p1",
    left: "68%",
    top: "18%",
    delay: "0s",
    duration: "4s",
    size: "2px",
    opacity: 0.45,
  },
  {
    id: "p2",
    left: "23%",
    top: "59%",
    delay: "0.7s",
    duration: "5s",
    size: "3px",
    opacity: 0.3,
  },
  {
    id: "p3",
    left: "81%",
    top: "41%",
    delay: "1.4s",
    duration: "6s",
    size: "2px",
    opacity: 0.6,
  },
  {
    id: "p4",
    left: "12%",
    top: "27%",
    delay: "2.1s",
    duration: "4s",
    size: "2px",
    opacity: 0.35,
  },
  {
    id: "p5",
    left: "55%",
    top: "72%",
    delay: "2.8s",
    duration: "7s",
    size: "3px",
    opacity: 0.45,
  },
  {
    id: "p6",
    left: "38%",
    top: "14%",
    delay: "3.5s",
    duration: "5s",
    size: "2px",
    opacity: 0.3,
  },
  {
    id: "p7",
    left: "91%",
    top: "63%",
    delay: "0.3s",
    duration: "6s",
    size: "2px",
    opacity: 0.5,
  },
  {
    id: "p8",
    left: "7%",
    top: "82%",
    delay: "1.0s",
    duration: "4s",
    size: "3px",
    opacity: 0.35,
  },
  {
    id: "p9",
    left: "46%",
    top: "33%",
    delay: "1.7s",
    duration: "5s",
    size: "2px",
    opacity: 0.55,
  },
  {
    id: "p10",
    left: "75%",
    top: "88%",
    delay: "2.4s",
    duration: "7s",
    size: "2px",
    opacity: 0.3,
  },
  {
    id: "p11",
    left: "30%",
    top: "45%",
    delay: "3.1s",
    duration: "4s",
    size: "3px",
    opacity: 0.4,
  },
  {
    id: "p12",
    left: "63%",
    top: "9%",
    delay: "3.8s",
    duration: "6s",
    size: "2px",
    opacity: 0.45,
  },
];

export default function Hero() {
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-grid opacity-50" />

      {/* Aurora blobs */}
      <div className="aurora-purple" />
      <div className="aurora-cyan" />
      <div className="aurora-blue" />

      {/* Central luminous orb — signature depth artifact */}
      <div className="hero-orb" />

      {/* Radial vignette top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium hero-badge"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 font-semibold">Powered by AI</span>
          <span className="text-slate-500 mx-1">·</span>
          <span className="text-slate-400">Now in Beta</span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold leading-[1.05] mb-6"
        >
          <span
            className="block text-white"
            style={{
              fontSize: "clamp(48px, 8.5vw, 88px)",
              letterSpacing: "-0.03em",
            }}
          >
            All-in-One
          </span>
          <span
            className="block gradient-text-hero"
            style={{
              fontSize: "clamp(48px, 8.5vw, 88px)",
              letterSpacing: "-0.03em",
            }}
          >
            AI Tools Platform
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-slate-400 max-w-lg mx-auto mb-9"
          style={{ fontSize: "clamp(16px, 2.2vw, 19px)", lineHeight: 1.65 }}
        >
          Convert, Edit &amp; Enhance Images Instantly — with AI that actually
          works.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2.5 mb-10"
        >
          {pills.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-300 pill-glass"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <button
            type="button"
            onClick={() => handleScroll("#tools")}
            className="btn-gradient-hero relative px-8 py-4 rounded-full text-white font-bold text-base font-display"
            data-ocid="hero.primary_button"
          >
            <span className="relative z-10">Start Free →</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-slate-300 font-semibold text-base pill-glass transition-all hover:text-white"
            data-ocid="hero.secondary_button"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stats — with dividers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center"
        >
          {stats.map(({ value, label }, i) => (
            <div key={label} className="flex items-center">
              {i > 0 && (
                <div className="hidden sm:block w-px h-8 mx-10 stat-divider" />
              )}
              {i > 0 && (
                <div className="sm:hidden w-16 h-px my-4 stat-divider" />
              )}
              <div className="flex flex-col items-center">
                <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                  {value}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 font-medium tracking-wide uppercase">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #04060f)",
        }}
      />
    </section>
  );
}
