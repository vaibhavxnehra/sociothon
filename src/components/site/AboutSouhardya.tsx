import { Reveal, SectionHeading } from "./primitives";
import { HeartHandshake, Lightbulb } from "lucide-react";

export function AboutSouhardya() {
  const cards = [
    {
      icon: Lightbulb,
      name: "SOCI-O-THON",
      tag: "Social Innovation Hackathon",
      copy: "Students from every discipline build real solutions to grassroots and citywide social problems- from idea proposal to working prototype.",
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

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    import("@/lib/utils").then(({ smoothScrollTo }) => smoothScrollTo(id));
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Fest"
          title={
            <>
              SOUHARDYA 2026- <span className="text-gradient-primary">The Social Fest</span>
            </>
          }
          subtitle={
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-foreground">One Platform - Two Flagship Experiences</p>
              <p>
                SOUHARDYA 2026 brings together SOCI-O-THON (Social-Technical Hackathon) and NIRMAAN (National Social-Technical Conference)—combining innovation, ideas, and collaboration to address real-world social challenges and create meaningful impact.
              </p>
              <p className="mt-2 text-sm text-primary">
                <strong className="font-bold">Additional Attractions:</strong><br/>
                PRATIBIMB – Reel Competition | DRISHTIKON – Photography Challenge
              </p>
            </div>
          }
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.12}>
              <a
                href={c.href}
                onClick={(e) => scrollTo(e, c.href)}
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
        
        <Reveal delay={0.24}>
          <div className="mx-auto max-w-3xl mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center flex flex-col items-center justify-center">
            <p className="font-display font-bold text-primary">All-Access Registration</p>
            <p className="mt-2 text-primary/90 text-sm sm:text-base">
              Pay the registration fee for either SOCI-O-THON or NIRMAAN, and get <strong className="font-bold">free access</strong> to participate in BOTH flagship events, as well as ALL other cultural events!
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
