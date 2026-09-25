import { Reveal, SectionHeading } from "./primitives";
import { Film, Camera, Palette, Mic } from "lucide-react";

const OTHER_EVENTS = [
  {
    name: "PRATIBIMB",
    tag: "PARCHHAI SOCH KI, DARPAN SAMAJ KA",
    icon: Film,
    description: "PRATIBIMB is a short-film competition that encourages students to reflect on societal issues through powerful storytelling. Participants may explore drama, documentary, and experimental cinema, using film to inspire awareness, dialogue, and positive change.",
    registerUrl: "https://unstop.com/p/pratibimb-rajiv-gandhi-institute-of-petroleum-technology-rgipt-jais-uttar-pradesh-1750124?lb=WHOaY4dM&utm_medium=Share&utm_source=events&utm_campaign=Utkarkum62556"
  },
  {
    name: "DRISHTIKON",
    tag: "THE PHOTOGRAPHY CHALLENGE",
    icon: Camera,
    description: "DRISHTIKON is a photography competition that invites participants to capture stories, emotions, and social realities through their lenses. It celebrates creativity and distinctive perspectives, encouraging viewers to look beyond what meets the eye.",
    registerUrl: "https://unstop.com/p/drishtikon-2026-rajiv-gandhi-institute-of-petroleum-technology-rgipt-jais-uttar-pradesh-1750037?lb=WHOaY4dM&utm_medium=Share&utm_source=events&utm_campaign=Utkarkum62556"
  },
  {
    name: "RIWAAZ",
    tag: "CARICATURE ART & LAC BANGLE MAKING",
    icon: Palette,
    description: "RIWAAJ is a cultural exhibition showcasing the artistry of local craftspeople through handmade jewellery, textiles, handicrafts, and traditional creations. It celebrates craftsmanship, preserves cultural heritage, and highlights the creativity, values, and traditions of local communities."
  },
  {
    name: "KAVIRAAG",
    tag: "POETRY & LITERATURE EVENT",
    icon: Mic,
    description: "A national poetry and literature event celebrating Indian culture and creative expression. Previous editions featured renowned poets and performers, including Sarvesh Asthana, Charag Sharma, Aayushi Rakhecha, and Durgesh Dubey, before an audience of over 1,500."
  }
];

export function OtherEvents() {
  return (
    <section className="relative py-24 sm:py-32 bg-background relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="More from SOUHARDYA"
          title={
            <>
              Explore Other <span className="text-gradient-primary">Events</span>
            </>
          }
          subtitle="Beyond the hackathon and conference, immerse yourself in our artistic and cultural expressions."
        />

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-3xl mt-10 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center flex flex-col items-center justify-center">
            <p className="font-display font-bold text-primary">✨ Free Entry</p>
            <p className="mt-2 text-primary/90 text-sm sm:text-base">
              If you have already paid the registration fee for SOCI-O-THON or NIRMAAN, you can participate in BOTH flagship events and ALL these cultural events for <strong className="font-bold">free</strong>!
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {OTHER_EVENTS.map((event, i) => (
            <Reveal key={event.name} delay={i * 0.1}>
              <div className="glass-panel lift-card h-full relative overflow-hidden flex flex-col rounded-3xl p-8 sm:p-10">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-90" />
                <event.icon className="h-10 w-10 text-primary shrink-0" />
                <h3 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">{event.name}</h3>
                <p className="mt-2 text-sm font-semibold tracking-[0.1em] text-primary uppercase">{event.tag}</p>
                <p className="mt-5 text-muted-foreground leading-relaxed flex-1">{event.description}</p>
                {event.registerUrl && (
                  <div className="mt-8">
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 animate-pulse-scale"
                    >
                      Register Now
                    </a>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
