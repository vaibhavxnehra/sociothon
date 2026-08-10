import { Reveal, SectionHeading, Counter } from "./primitives";
import { Building2, Globe2, GraduationCap, Landmark } from "lucide-react";

const PARTNERS = [
  "IOCL",
  "ONGC",
  "BPCL",
  "HPCL",
  "Oil Industry Development Board",
  "IITs",
  "DUT Netherlands",
  "KIT Kitakyushu",
  "Texas A&M University at Qatar",
];

const STATS = [
  { icon: Landmark, label: "Founded", value: 2008, prefix: "", plain: true },
  { icon: GraduationCap, label: "NIRF Rank (Engineering)", value: 78, prefix: "#" },
  { icon: Building2, label: "PSU Co-Promoters", value: 4, prefix: "" },
  { icon: Globe2, label: "Global MoU Partners", value: 4, prefix: "" },
];

export function AboutRGIPT() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Host"
          title={
            <>
              Rajiv Gandhi Institute of <span className="text-gold-gradient">Petroleum Technology</span>
            </>
          }
          subtitle="An Institute of National Importance established by an Act of Parliament, Government of India in 2008 — co-promoted by India's major Public Sector Oil Companies and the Oil Industry Development Board."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal className="glass-panel lift-card rounded-3xl p-7 sm:p-9">
            <h3 className="text-2xl font-bold">Credibility that carries weight</h3>
            <p className="mt-4 text-muted-foreground">
              RGIPT, Jais, Amethi is ranked <strong className="text-foreground">78th in NIRF (Engineering)</strong> and
              functions with the mandate of an Institute of National Importance. Its academic culture blends rigorous
              engineering education with a deep commitment to nation-building and community impact.
            </p>
            <p className="mt-4 text-muted-foreground">
              Global academic collaborations with the <strong className="text-foreground">IITs</strong>,
              <strong className="text-foreground"> DUT Netherlands</strong>,
              <strong className="text-foreground"> KIT Kitakyushu</strong> and
              <strong className="text-foreground"> Texas A&amp;M University at Qatar</strong>, along with industry
              linkages across IOCL, ONGC, BPCL and HPCL, place RGIPT students at the intersection of research, industry
              and public purpose.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="glass-panel lift-card h-full rounded-2xl p-5">
                  <s.icon className="h-5 w-5 text-primary" />
                  <div className="mt-4 font-display text-3xl font-extrabold">
                    <Counter to={s.value} prefix={s.prefix} plain={"plain" in s} />
                  </div>
                  <div className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-border py-4">
            <div className="flex w-max animate-[marquee_36s_linear_infinite] gap-3 hover:[animation-play-state:paused]">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <span
                  key={`${p}-${i}`}
                  className="rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm whitespace-nowrap text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
}
