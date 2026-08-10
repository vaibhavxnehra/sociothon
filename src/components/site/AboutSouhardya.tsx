import { Reveal, SectionHeading } from "./primitives";
import { HeartHandshake, Lightbulb } from "lucide-react";

export function AboutSouhardya() {
  const cards = [
    {
      icon: Lightbulb,
      name: "SOCI-O-THON",
      tag: "Social Innovation Hackathon",
      copy: "Students from every discipline build real solutions to grassroots and citywide social problems — from idea proposal to working prototype.",
      href: "#events",
    },
    {
      icon: HeartHandshake,
      name: "NIRMAAN",
      tag: "National Social Conference",
      copy: "A conference and presentation competition placing students face-to-face with IAS/IPS officers, senior officials and NGOs driving change on the ground.",
      href: "#events",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Fest"
          title={
            <>
              SOUHARDYA 2026 — <span className="text-gold-gradient">The Social Fest</span>
            </>
          }
          subtitle="One umbrella. Two flagship experiences. SOUHARDYA turns empathy into action by pairing an innovation sprint with a national conversation on social change."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.12}>
              <a
                href={c.href}
                className="glass-panel lift-card group relative block h-full overflow-hidden rounded-3xl p-8 sm:p-10"
              >
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-90" />
                <c.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">{c.name}</h3>
                <p className="mt-2 text-sm font-semibold tracking-[0.18em] text-primary uppercase">{c.tag}</p>
                <p className="mt-5 text-muted-foreground">{c.copy}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  View rulebook
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
