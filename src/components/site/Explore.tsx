import { MapPin, Navigation } from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";

import lucknow1 from "@/assets/explore/lucknow-1.jpg";
import lucknow2 from "@/assets/explore/lucknow-2.jpg";
import lucknow3 from "@/assets/explore/lucknow-3.jpg";
import lucknow4 from "@/assets/explore/lucknow-4.jpg";

import varanasi1 from "@/assets/explore/varanasi-1.jpg";
import varanasi2 from "@/assets/explore/varanasi-2.jpg";
import varanasi3 from "@/assets/explore/varanasi-3.jpg";
import varanasi4 from "@/assets/explore/varanasi-4.jpg";

import ayodhya1 from "@/assets/explore/ayodhya-1.jpg";
import ayodhya2 from "@/assets/explore/ayodhya-2.jpg";
import ayodhya3 from "@/assets/explore/ayodhya-3.jpg";
import ayodhya4 from "@/assets/explore/ayodhya-4.jpg";

import prayagraj1 from "@/assets/explore/prayagraj-1.jpg";
import prayagraj2 from "@/assets/explore/prayagraj-2.jpg";
import prayagraj3 from "@/assets/explore/prayagraj-3.jpg";
import prayagraj4 from "@/assets/explore/prayagraj-4.jpg";

const DESTINATIONS = [
  {
    name: "Lucknow",
    badge: "Heritage & Food",
    distance: "~1-2 hours from campus",
    highlights: "Known for Bara Imambara, Rumi Darwaza, vibrant kebabs, and rich Awadhi culture.",
    mapUrl: "https://www.google.com/maps/search/Lucknow",
    images: [lucknow1, lucknow2, lucknow3, lucknow4],
  },
  {
    name: "Varanasi",
    badge: "Cultural & Spiritual",
    distance: "~4-5 hours from campus",
    highlights: "Famous for Ganga Aarti at Dashashwamedh Ghat, ancient narrow lanes, and street side lassi.",
    mapUrl: "https://www.google.com/maps/search/Varanasi",
    images: [varanasi1, varanasi2, varanasi3, varanasi4],
  },
  {
    name: "Prayagraj",
    badge: "Sacred Confluence",
    distance: "~2-3 hours from campus",
    highlights: "Home to Triveni Sangam (confluence of 3 rivers), Anand Bhawan, and historic ghats.",
    mapUrl: "https://www.google.com/maps/search/Prayagraj",
    images: [prayagraj1, prayagraj2, prayagraj3, prayagraj4],
  },
  {
    name: "Ayodhya",
    badge: "Spiritual Heritage",
    distance: "~2-3 hours from campus",
    highlights: "Famous for Ram Mandir, Saryu River Ghats, Hanuman Garhi, and historic temples.",
    mapUrl: "https://www.google.com/maps/search/Ayodhya",
    images: [ayodhya1, ayodhya2, ayodhya3, ayodhya4],
  },
];

export function Explore() {
  return (
    <section id="explore" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Explore Beyond the Campus"
          title={
            <>
              Nearby <span className="text-gradient-primary">Destinations</span>
            </>
          }
          subtitle="Take a break between events and explore these iconic nearby destinations."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {DESTINATIONS.map((dest, idx) => (
            <Reveal key={dest.name} delay={idx * 0.1}>
              <div className="glass-panel flex h-full flex-col overflow-hidden rounded-3xl">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {dest.images.map((img, i) => (
                    <div key={i} className="aspect-video overflow-hidden rounded-xl bg-muted/20">
                      <img
                        src={img}
                        alt={`${dest.name} ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold">{dest.name}</h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {dest.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>{dest.distance}</span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {dest.highlights}
                  </p>

                  <div className="mt-8">
                    <a
                      href={dest.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
                    >
                      <Navigation className="h-4 w-4" />
                      View on Maps
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
