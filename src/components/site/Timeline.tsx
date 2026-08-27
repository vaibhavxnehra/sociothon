import { Reveal, SectionHeading } from "./primitives";

const MILESTONES = [
  { date: "18 August 2026", text: "Registration Live for\nSOCI-O-THON & NIRMAAN" },
  { date: "10 September 2026", text: "Early Bird Registration - Rs. 500*\nSOCI-O-THON Problem Statements Released" },
  { date: "30 September 2026", text: "SOCI-O-THON Round 1\nNIRMAAN: Result of Abstract Submission" },
  { date: "02 October 2026", text: "SOCI-O-THON Round 1 Results announced" },
  { date: "02-30 October 2026", text: "SOCI-O-THON Solution Development Phase" },
  { date: "30 October 2026", text: "SOCI-O-THON Final Round\nNIRMAAN Conference (Day 1)" },
  { date: "30 October 2026 (Night)", text: "Cultural Night (KAVIRAAG)" },
  { date: "31 October 2026", text: "NIRMAAN Conference (Day 2)\nand Valedictory Function" },
];

export function Timeline() {
  return (
    <section id="timeline" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Roadmap"
          title={
            <>
              Key <span className="text-gradient-primary">dates</span>
            </>
          }
          subtitle="From registration to the final prize distribution- here's how the journey unfolds."
        />

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-primary/70 via-primary/25 to-transparent sm:left-1/2" />
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.date + m.text} delay={i * 0.05}>
                <div
                  className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                    i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                  }`}
                >
                  <span
                    className={`absolute top-5 left-[9px] h-3 w-3 rounded-full bg-primary shadow-[0_0_0_5px_color-mix(in_oklab,var(--gold)_18%,transparent)] sm:left-auto ${
                      i % 2 === 0 ? "sm:-right-[6px]" : "sm:-left-[6px]"
                    }`}
                  />
                  <div className="glass-panel lift-card rounded-2xl p-5">
                    <p className="font-display text-sm font-bold text-primary">{m.date}</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">{m.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
