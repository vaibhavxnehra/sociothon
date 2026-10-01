import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import rgiptLogo from "@/assets/rgipt-logo.png";

const LINKS = [
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "quiz", label: "Quiz", href: "/nirmaan" },
  { id: "timeline", label: "Timeline" },
  { id: "register", label: "Register" },
  { id: "team", label: "Organizing Committee" },
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

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    import("@/lib/utils").then(({ smoothScrollTo }) => smoothScrollTo(id));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel border-x-0 border-t-0 py-2" : "py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" onClick={(e) => scrollTo(e, "top")} className="flex min-w-0 items-center gap-3">
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
          {LINKS.map((l) =>
            l.href ? (
              <Link
                key={l.id}
                to={l.href}
                className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5"
              >
                {l.label}
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                </span>
              </Link>
            ) : (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => scrollTo(e, l.id)}
                data-active={active === l.id}
                className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
              >
                {l.label}
              </a>
            ),
          )}
          <a
            href={registerUrl}
            onClick={(e) => scrollTo(e, registerUrl)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 animate-pulse-scale"
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
              {LINKS.map((l) =>
                l.href ? (
                  <Link
                    key={l.id}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary flex items-center justify-between"
                  >
                    <span>{l.label}</span>
                    <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 border border-amber-500/30">
                      DAILY QUIZ
                    </span>
                  </Link>
                ) : (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={(e) => {
                      setOpen(false);
                      scrollTo(e, l.id);
                    }}
                    className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                ),
              )}
              <a
                href={registerUrl}
                onClick={(e) => { setOpen(false); scrollTo(e, registerUrl); }}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground animate-pulse-scale"
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
