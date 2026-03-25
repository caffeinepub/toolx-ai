import { Quote } from "lucide-react";
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

const testimonials = [
  {
    id: "t1",
    quote:
      "ToolX AI completely replaced 5 different apps for me. The background remover alone is insane!",
    name: "Aryan Mehta",
    role: "Freelance Designer",
    initials: "AM",
    stars: 5,
    color: "from-purple-500 to-blue-500",
  },
  {
    id: "t2",
    quote:
      "The Pro plan is a steal at ₹199. I process hundreds of images daily for my e-commerce store.",
    name: "Priya Sharma",
    role: "E-commerce Owner",
    initials: "PS",
    stars: 5,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "t3",
    quote:
      "Never seen an AI tool this fast. The UI is beautiful and everything just works.",
    name: "Rahul Verma",
    role: "Content Creator",
    initials: "RV",
    stars: 5,
    color: "from-orange-400 to-pink-500",
  },
];

export default function Testimonials() {
  const sectionRef = useReveal();

  return (
    <section id="testimonials" className="relative py-24 px-4">
      <div ref={sectionRef} className="reveal max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "oklch(0.78 0.18 195)" }}
          >
            Testimonials
          </span>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: "clamp(28px, 4.5vw, 44px)" }}
          >
            Loved by Creators Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="rounded-2xl p-6 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.border = "1px solid rgba(139,92,246,0.4)";
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 8px 40px rgba(139,92,246,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.border = "1px solid rgba(255,255,255,0.07)";
                el.style.transform = "";
                el.style.boxShadow = "";
              }}
              data-ocid={`testimonials.item.${idx + 1}`}
            >
              <Quote
                className="w-8 h-8 mb-4"
                style={{ color: "oklch(0.78 0.18 195)" }}
              />
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">
                    {t.name}
                  </div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
                <div className="ml-auto text-yellow-400 text-sm">
                  {"★".repeat(t.stars)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
