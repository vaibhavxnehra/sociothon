import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import rgiptLogo from "@/assets/rgipt-logo.png";

const LINKS = [
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "timeline", label: "Timeline" },
  { id: "register", label: "Register" },
  { id: "sponsors", label: "Sponsors" },
  { id: "contact", label: "Contact" },
];

export function Navbar({ registerUrl }: { registerUrl: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel border-x-0 border-t-0 py-2" : "py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <img
            src={rgiptLogo}
            alt="RGIPT logo"
            width={44}
            height={44}
            className="h-10 w-auto shrink-0"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm leading-tight font-bold sm:text-base">
              SOCI-O-THON <span className="text-primary">&</span> NIRMAAN
            </span>
            <span className="block truncate text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Souhardya 2026 · RGIPT
            </span>
          </span>
        </a>

        <div className="ml-auto hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-active={active === l.id}
              className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href={registerUrl}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
          >
            Register Now
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel mx-4 mt-3 rounded-2xl p-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={registerUrl}
                onClick={() => setOpen(false)}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                Register Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
