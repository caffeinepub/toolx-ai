import { Github, Linkedin, Twitter, Zap } from "lucide-react";

const cols = [
  { heading: "Product", links: ["Features", "Pricing", "Tools", "Dashboard"] },
  { heading: "Company", links: ["About", "Blog", "Careers"] },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Contact"],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-16"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(34,211,238,0.5), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="font-display font-bold text-xl gradient-text">
                ToolX AI
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your Ultimate AI Power Hub. Convert, edit, and create with the
              power of AI.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <h4 className="font-display font-semibold text-white text-sm mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-slate-500 text-sm cursor-default select-none">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-slate-500 text-xs text-center sm:text-left">
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>

          <div className="flex items-center gap-4">
            {[
              { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
              { Icon: Github, label: "GitHub", href: "https://github.com" },
              {
                Icon: Linkedin,
                label: "LinkedIn",
                href: "https://linkedin.com",
              },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
