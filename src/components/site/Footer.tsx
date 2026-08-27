import { Instagram, Linkedin, MapPin } from "lucide-react";
import rgiptLogo from "@/assets/rgipt-logo.png";

const QUICK_LINKS = [
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "timeline", label: "Timeline" },
  { id: "register", label: "Register" },
  { id: "sponsors", label: "Sponsors" },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-navy-deep py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex min-w-0 items-center gap-3">
              <img src={rgiptLogo} alt="RGIPT logo" loading="lazy" width={48} height={48} className="h-11 w-auto shrink-0" />
              <div className="min-w-0">
                <p className="font-display font-bold">SOUHARDYA 2026</p>
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">The Social Fest</p>
              </div>
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Rajiv Gandhi Institute of Petroleum Technology, Jais, Amethi, Uttar Pradesh- 229304
            </p>
            <p className="mt-5 max-w-md font-display text-lg font-semibold text-gradient-primary">
              Turning empathy into action- building a future that works for everyone.
            </p>
          </div>

          <div>
            <p className="font-display font-semibold">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="nav-link text-muted-foreground hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display font-semibold">Follow</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.instagram.com/arpanrgipt/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-xl border border-border transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/arpan-rgipt-social-council/home/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-xl border border-border transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 SOUHARDYA, RGIPT Jais, Amethi. An Institute of National Importance, Government of India.
        </p>
      </div>
    </footer>
  );
}
