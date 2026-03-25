import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const faqs = [
  {
    id: "faq1",
    q: "Is ToolX AI really free to use?",
    a: "Yes! Our Free plan gives you access to PNG to PDF and limited Background Remover (5/day) at no cost. No credit card required.",
  },
  {
    id: "faq2",
    q: "What's included in the Pro plan?",
    a: "Pro unlocks unlimited Background Remover, AI Image Enhancer, AI Image Generator, and Bulk Converter with priority processing and faster speeds.",
  },
  {
    id: "faq3",
    q: "How secure is my data?",
    a: "All files are processed securely and never stored after processing. Your privacy is our top priority. We use end-to-end encryption for all uploads.",
  },
  {
    id: "faq4",
    q: "Can I cancel my Pro subscription anytime?",
    a: "Absolutely. You can cancel anytime from your dashboard with no questions asked. You'll retain Pro access until the end of your billing period.",
  },
  {
    id: "faq5",
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee if you're not satisfied with the Pro plan. Contact support and we'll process your refund promptly.",
  },
];

export default function FAQ() {
  const sectionRef = useReveal();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="relative py-24 px-4">
      <div ref={sectionRef} className="reveal max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "oklch(0.65 0.28 295)" }}
          >
            FAQ
          </span>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: "clamp(28px, 4.5vw, 44px)" }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          data-ocid="faq.list"
        >
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="transition-all duration-200"
              style={{
                borderLeft:
                  open === faq.id
                    ? "3px solid rgba(139,92,246,0.7)"
                    : "3px solid transparent",
                borderBottom:
                  idx < faqs.length - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : undefined,
              }}
              data-ocid={`faq.item.${idx + 1}`}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                data-ocid={`faq.item.${idx + 1}.toggle`}
              >
                <span className="font-display font-semibold text-white text-sm pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300"
                  style={{
                    transform:
                      open === faq.id ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              {open === faq.id && (
                <div className="px-6 pb-5">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
