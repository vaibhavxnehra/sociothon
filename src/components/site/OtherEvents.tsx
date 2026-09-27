import { Reveal, SectionHeading } from "./primitives";
import { Film, Camera, Palette, Mic, FlaskConical, Sparkles } from "lucide-react";

const COMPETITION_EVENTS = [
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
  }
];

const ATTRACTIONS = [
  {
    name: "Kaviraag",
    tag: "An Evening of Kavi Sammelan",
    icon: Mic,
    description: "A national poetry and literature event celebrating Indian culture and creative expression. Previous editions featured renowned poets and performers, including Sarvesh Asthana, Charag Sharma, Aayushi Rakhecha, and Durgesh Dubey, before an audience of over 1,500."
  },
  {
    name: "Rivaaz",
    tag: "The Heritage of India: Craft & Caricature",
    icon: Palette,
    description: "Rivaaz is a cultural exhibition showcasing the artistry of local craftspeople through handmade jewellery, textiles, handicrafts, and traditional creations. It celebrates craftsmanship, preserves cultural heritage, and highlights the creativity, values, and traditions of local communities."
  },
  {
    name: "Science & Social Innovation Exhibition",
    tag: "Exclusively for School Students",
    icon: FlaskConical,
    description: "A dedicated exhibition platform where bright young minds from schools across the region present their innovative scientific and social projects, demonstrating creative solutions to real-world problems."
  }
];

export function OtherEvents() {
  return (
    <section className="relative py-24 sm:py-32 bg-background relative z-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="More from SOUHARDYA"
          title={
            <>
              Explore Other <span className="text-gradient-primary">Events</span>
            </>
          }
          subtitle="Beyond the hackathon and conference, participate in our other engaging competitions."
        />

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-3xl mt-10 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center flex flex-col items-center justify-center">
            <p className="font-display font-bold text-primary">Included with Flagship Registration</p>
            <p className="mt-2 text-primary/90 text-sm sm:text-base">
              If you have already paid the registration fee for SOCI-O-THON or NIRMAAN, you can participate in BOTH flagship events and ALL these social events for <strong className="font-bold">free</strong>!
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          
          <div className="mt-10 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {COMPETITION_EVENTS.map((event, i) => (
              <Reveal key={event.name} delay={i * 0.1}>
                <div className="glass-panel lift-card h-full relative overflow-hidden flex flex-col rounded-3xl p-6 text-center items-center border-t-2 border-t-primary/40">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary mb-4 shadow-inner shrink-0">
                    <event.icon className="h-7 w-7" />
                  </div>
                  <h3 className="relative font-display text-xl font-extrabold text-foreground">{event.name}</h3>
                  <p className="relative mt-2 text-[10px] font-bold tracking-wider text-primary uppercase">{event.tag}</p>
                  <p className="relative mt-3 text-xs text-muted-foreground leading-relaxed flex-1">{event.description}</p>
                  {'registerUrl' in event && event.registerUrl && (
                    <div className="mt-4 relative w-full">
                      <a
                        href={event.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-primary/20 border border-primary/40 px-4 py-2 font-display text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground animate-pulse-scale"
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
          
        <div className="mt-24">
          <SectionHeading
            eyebrow="Attractions"
            title={
              <>
                SPECIAL CELEBRATION FOR <span className="text-gradient-primary">PARTICIPANTS</span>
              </>
            }
            subtitle="Beyond the Competition — Experience the Cultural Spirit of India"
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {ATTRACTIONS.map((event, i) => (
              <Reveal key={event.name} delay={i * 0.1}>
                <div className="glass-panel lift-card h-full relative overflow-hidden flex flex-col rounded-3xl p-6 text-center items-center border-t-2 border-t-primary/40">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary mb-4 shadow-inner shrink-0">
                    <event.icon className="h-7 w-7" />
                  </div>
                  <h3 className="relative font-display text-xl font-extrabold text-foreground">{event.name}</h3>
                  <p className="relative mt-2 text-[10px] font-bold tracking-wider text-primary uppercase">{event.tag}</p>
                  <p className="relative mt-3 text-xs text-muted-foreground leading-relaxed flex-1">{event.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
