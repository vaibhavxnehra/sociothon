import { Reveal, SectionHeading } from "./primitives";
import { Film, Camera, Palette, Mic } from "lucide-react";

const OTHER_EVENTS = [
  {
    name: "PRATIBIMB",
    tag: "PARCHHAI SOCH KI, DARPAN SAMAJ KA",
    icon: Film,
    description: "PRATIBIMB is a short-film competition that encourages students to reflect on societal issues through powerful storytelling. Participants may explore drama, documentary, and experimental cinema, using film to inspire awareness, dialogue, and positive change."
  },
  {
    name: "DRISHTIKON",
    tag: "THE PHOTOGRAPHY CHALLENGE",
    icon: Camera,
    description: "DRISHTIKON is a photography competition that invites participants to capture stories, emotions, and social realities through their lenses. It celebrates creativity and distinctive perspectives, encouraging viewers to look beyond what meets the eye."
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

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {OTHER_EVENTS.map((event, i) => (
            <Reveal key={event.name} delay={i * 0.1}>
              <div className="glass-panel lift-card h-full relative overflow-hidden rounded-3xl p-8 sm:p-10">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-90" />
                <event.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">{event.name}</h3>
                <p className="mt-2 text-sm font-semibold tracking-[0.1em] text-primary uppercase">{event.tag}</p>
                <p className="mt-5 text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
