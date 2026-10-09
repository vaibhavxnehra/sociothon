import { Map, Plane, Train, Car } from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";

export function HowToReach() {
  return (
    <section id="how-to-reach" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Location"
          title={
            <>
              How to reach <span className="text-gradient-primary">RGIPT</span>
            </>
          }
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Map View */}
          <Reveal>
            <div className="glass-panel overflow-hidden flex flex-col h-full rounded-3xl border border-white/5 p-2">
              <iframe
                src="https://maps.google.com/maps?q=Rajiv+Gandhi+Institute+of+Petroleum+Technology+Jais&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ minHeight: "400px", border: 0, borderRadius: "1.25rem", filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="flex-1 opacity-80"
              ></iframe>
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-medium">Rajiv Gandhi Institute of Petroleum Technology, Jais, Amethi, UP 229304</p>
                <a
                  href="https://goo.gl/maps/H4M5p2Q5Z2g2"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-foreground transition-colors bg-primary/10 hover:bg-primary rounded-xl px-4 py-2.5 whitespace-nowrap"
                >
                  <Map className="w-4 h-4" />
                  View on Google Maps
                </a>
              </div>
            </div>
          </Reveal>

          {/* Transportation Modes */}
          <div className="flex flex-col gap-4">
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-3xl border border-white/5 p-6 sm:p-8 hover:bg-white/5 transition-colors h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Plane className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground">By Flight</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The nearest major airports are <strong>Chaudhary Charan Singh International Airport, Lucknow (LKO)</strong> (~110 km) and <strong>Prayagraj Airport (IXD)</strong> (~100 km). From the airport, you can hire a taxi or take a bus/train to reach the campus.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="glass-panel rounded-3xl border border-white/5 p-6 sm:p-8 hover:bg-white/5 transition-colors h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Train className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground">By Train</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The closest railway station is <strong>Jais (JAIS)</strong>, which is just 2.5 km from the campus. Other major nearby stations are <strong>Rae Bareli Junction (RBL)</strong> (~30 km) and <strong>Amethi (AME)</strong> (~35 km). Regular autos and e-rickshaws are available from Jais station to the campus.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="glass-panel rounded-3xl border border-white/5 p-6 sm:p-8 hover:bg-white/5 transition-colors h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Car className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground">By Road</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  RGIPT is situated on the Rae Bareli-Sultanpur Highway. It is well-connected by road to major cities like Lucknow, Prayagraj, and Varanasi. UPSRTC buses run frequently between Lucknow/Rae Bareli and Sultanpur, dropping right at the campus gate.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
