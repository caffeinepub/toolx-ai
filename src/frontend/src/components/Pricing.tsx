import { Check, Zap } from "lucide-react";
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

const freePlan = {
  name: "Free",
  price: "₹0",
  period: "/month",
  desc: "Perfect to get started",
  features: [
    "PNG to PDF Converter",
    "Background Remover (5/day)",
    "Basic support",
  ],
  cta: "Get Started Free",
};

const proPlan = {
  name: "Pro",
  price: "₹199",
  oldPrice: "₹499",
  period: "/month",
  desc: "For power users and creators",
  features: [
    "Unlimited Background Remover",
    "AI Image Enhancer",
    "AI Image Generator",
    "Bulk File Converter",
    "Priority support",
    "Faster processing",
  ],
  cta: "Go Pro Now",
};

export default function Pricing() {
  const sectionRef = useReveal();

  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="relative py-32 px-4 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 70%)",
        }}
      />

      <div ref={sectionRef} className="reveal max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "oklch(0.78 0.18 195)" }}
          >
            Pricing
          </span>
          <h2
            className="font-display font-bold text-white mb-5"
            style={{
              fontSize: "clamp(28px, 4.5vw, 48px)",
              letterSpacing: "-0.02em",
            }}
          >
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div
            className="rounded-2xl p-9 flex flex-col"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
            data-ocid="pricing.free.card"
          >
            <div className="mb-7">
              <h3 className="font-display font-bold text-white text-2xl mb-1.5">
                {freePlan.name}
              </h3>
              <p className="text-slate-500 text-sm">{freePlan.desc}</p>
            </div>
            <div className="flex items-baseline gap-1.5 mb-9">
              <span className="font-display font-extrabold text-5xl text-white tracking-tight">
                {freePlan.price}
              </span>
              <span className="text-slate-500 text-sm">{freePlan.period}</span>
            </div>
            <ul className="space-y-3.5 mb-9 flex-1">
              {freePlan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-slate-300 text-sm"
                >
                  <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleScroll("#tools")}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              data-ocid="pricing.free.button"
            >
              {freePlan.cta}
            </button>
          </div>

          {/* Pro */}
          <div
            className="relative rounded-2xl p-9 flex flex-col"
            style={{
              background: "rgba(15,8,32,0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(139,92,246,0.45)",
              boxShadow:
                "0 0 60px rgba(139,92,246,0.18), 0 0 120px rgba(139,92,246,0.06), inset 0 1px 0 rgba(139,92,246,0.2)",
            }}
            data-ocid="pricing.pro.card"
          >
            {/* Top-edge shine */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(96,165,250,0.4), transparent)",
              }}
            />

            {/* Most popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.62 0.22 255))",
                  boxShadow: "0 4px 16px rgba(139,92,246,0.4)",
                }}
              >
                <Zap className="w-3 h-3" />
                MOST POPULAR
              </div>
            </div>

            <div className="mb-7">
              <h3 className="font-display font-bold text-2xl mb-1.5 gradient-text">
                {proPlan.name}
              </h3>
              <p className="text-slate-400 text-sm">{proPlan.desc}</p>
            </div>
            <div className="flex items-baseline gap-2 mb-9">
              <span className="font-display font-extrabold text-5xl text-white tracking-tight">
                {proPlan.price}
              </span>
              <span className="text-slate-400 text-sm">{proPlan.period}</span>
              <span className="text-slate-600 text-sm line-through">
                {proPlan.oldPrice}
              </span>
            </div>
            <ul className="space-y-3.5 mb-9 flex-1">
              {proPlan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-slate-200 text-sm"
                >
                  <Check
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "oklch(0.78 0.18 195)" }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="https://buy.stripe.com/test_6oU28tbG62Jg5Ah3CA1VK00"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02] flex items-center justify-center"
              data-ocid="pricing.pro.button"
            >
              🚀 Buy Pro - ₹199
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
