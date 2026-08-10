import { Award, Gift, Trophy } from "lucide-react";
import { Reveal, SectionHeading, Counter } from "./primitives";

const REWARDS = [
  {
    icon: Trophy,
    title: "SOCI-O-THON Prize Pool",
    body: "₹30,000 in prizes, plus Special and Additional Awards and Recognitions for standout teams.",
    highlight: true,
  },
  {
    icon: Gift,
    title: "NIRMAAN Trophies & Goodies",
    body: "Trophies and goodies awarded to theme-wise winners of the presentation competition.",
  },
  {
    icon: Award,
    title: "Certificate of Participation",
    body: "Awarded to every participant across both SOCI-O-THON and NIRMAAN.",
  },
];

export function Rewards() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Rewards"
          title={
            <>
              Recognition worth <span className="text-gold-gradient">competing for</span>
            </>
          }
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {REWARDS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.1}>
              <div
                className={`lift-card h-full rounded-3xl p-8 ${
                  r.highlight ? "border border-primary/45 bg-primary/10" : "glass-panel"
                }`}
              >
                <r.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-5 font-display text-xl font-bold">{r.title}</h3>
                {r.highlight ? (
                  <p className="mt-3 font-display text-4xl font-extrabold text-gold-gradient">
                    <Counter to={30000} prefix="₹" />
                  </p>
                ) : null}
                <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
