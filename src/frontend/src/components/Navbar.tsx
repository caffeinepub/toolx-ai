import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { label: "Features", href: "#tools" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = loginStatus === "success" && !!identity;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav-scrolled" : "glass-nav"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <Zap className="w-5 h-5 text-purple-400 group-hover:text-cyan-400 transition-colors" />
              <span className="font-display font-bold text-xl gradient-text">
                ToolX AI
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium"
                  data-ocid={`nav.${link.label.toLowerCase()}.link`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => clear()}
                  className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  data-ocid="nav.logout.button"
                >
                  Log Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => login()}
                  className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  data-ocid="nav.login.button"
                >
                  Log In
                </button>
              )}
              <button
                type="button"
                onClick={() => handleNavClick("#tools")}
                className="btn-gradient text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:scale-105 pulse-ring"
                data-ocid="nav.try_free.button"
              >
                <span>Try Free Now</span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              data-ocid="nav.hamburger.button"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 glass-strong flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(4,6,15,0.95)" }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-2xl font-display font-bold text-slate-200 hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="flex flex-col gap-3 items-center mt-4">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                className="text-sm text-slate-300 px-8 py-3 rounded-lg border border-white/10"
              >
                Log Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  login();
                  setMobileOpen(false);
                }}
                className="text-sm text-slate-300 px-8 py-3 rounded-lg border border-white/10"
              >
                Log In
              </button>
            )}
            <button
              type="button"
              onClick={() => handleNavClick("#tools")}
              className="btn-gradient text-sm font-semibold px-8 py-3 rounded-full text-white"
            >
              <span>Try Free Now</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
