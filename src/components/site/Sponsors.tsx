import { Reveal, SectionHeading } from "./primitives";

const TIERS = [
  { name: "Title", amount: "₹12,00,000+", accent: "from-primary/30" },
  { name: "Co-Title", amount: "₹10,00,000+", accent: "from-primary/25" },
  { name: "Powered", amount: "₹7,00,000+", accent: "from-primary/20" },
  { name: "Co-Powered", amount: "₹5,00,000+", accent: "from-primary/15" },
  { name: "Platinum", amount: "₹3,00,000+", accent: "from-primary/12" },
  { name: "Gold", amount: "₹2,00,000+", accent: "from-primary/10" },
  { name: "Silver", amount: "₹1,00,000+", accent: "from-primary/8" },
  { name: "Bronze", amount: "₹75,000+", accent: "from-primary/5" },
];

export function Sponsors() {
  return (
    <section id="sponsors" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Partner With Us"
          title={
            <>
              Sponsorship <span className="text-gradient-primary">tiers</span>
            </>
          }
          subtitle="Put your brand in front of thousands of students from across India at an Institute of National Importance."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <div
                className={`lift-card h-full rounded-2xl border border-border bg-gradient-to-b ${t.accent} to-transparent p-6`}
              >
                <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">{t.name} Tier</p>
                <p className="mt-3 font-display text-2xl font-extrabold">{t.amount}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10 text-center">
          <a
            href="mailto:arvind.singh@rgipt.ac.in?subject=Sponsorship%20Enquiry%20—%20SOUHARDYA%202026"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 font-display font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
          >
            Become a Sponsor
          </a>
        </Reveal>
      </div>
    </section>
  );
}
