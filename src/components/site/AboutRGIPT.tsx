import { Reveal, SectionHeading, Counter } from "./primitives";
import { GraduationCap, Landmark } from "lucide-react";

const STATS = [
  { icon: Landmark, label: "Founded", value: 2008, prefix: "", plain: true },
  { icon: GraduationCap, label: "NIRF Rank (Engineering)", value: 78, prefix: "#" },
];

export function AboutRGIPT() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Host"
          title={
            <>
              Rajiv Gandhi Institute of <span className="text-gradient-primary">Petroleum Technology</span>
            </>
          }
          subtitle="An Institute of National Importance established by an Act of Parliament, Government of India in 2008- co-promoted by India's major Public Sector Oil Companies and the Oil Industry Development Board."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal className="glass-panel lift-card rounded-3xl p-7 sm:p-9">
            <h3 className="text-2xl font-bold">Credibility that carries weight</h3>
            <p className="mt-4 text-muted-foreground">
              RGIPT, Jais, Amethi is ranked <strong className="text-foreground">78th in NIRF (Engineering)</strong> and
              functions with the mandate of an Institute of National Importance. Its academic culture blends rigorous
              engineering education with a deep commitment to nation-building and community impact.
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
      </div>
    </section>
  );
}
