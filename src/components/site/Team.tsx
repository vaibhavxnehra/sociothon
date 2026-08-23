import { Mail, Phone } from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";

const COMMITTEE = [
  {
    name: "Dr. Arvind Singh",
    role: "Convener",
    dept: "Dept. of Chemical Engineering",
    email: "arvind.singh@rgipt.ac.in",
    phone: "+91 75719 93333",
  },
  {
    name: "Dr. Vijay Kumar Singh",
    role: "Co-Convener",
    dept: "Dept. of Electrical and Electronics Engineering",
    email: "vijayks@rgipt.ac.in",
    phone: "+91 97716 37514",
  },
  {
    name: "Dr. Malaya Kumar Sahoo",
    role: "Co-Convener",
    dept: "Dept. of Energy and Human Sciences",
    email: "malayaks@rgipt.ac.in",
    phone: "+91 94452 10634",
  },
];

const COORDINATORS = [
  { name: "Gaurav Srivastava", email: "24ce3025@rgipt.ac.in", phone: "+91 91207 74202" },
  { name: "Rudransh Mishra", email: "24cs3043@rgipt.ac.in", phone: "+91 6307606696" },
  { name: "Khushi Jatolia", email: "24it3028@rgipt.ac.in", phone: "+91 63800 94014" },
  { name: "Vaibhav", email: "24mc3059@rgipt.ac.in", phone: "+91 88140 92519" },
  { name: "Sonal", email: "24mc3049@rgipt.ac.in", phone: "+91 70428 86792" },
  { name: "Maittri Tripathi", email: "24mc3027@rgipt.ac.in", phone: "+91 79760 34702" },
  { name: "Omika Singh", email: "24pp3005@rgipt.ac.in", phone: "+91 89500 84550" },
  { name: "Ojas Pandey", email: "24re3009@rgipt.ac.in", phone: "+91 63925 84586" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter((p) => p.toLowerCase() !== "dr.")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

export function Team() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Reach Out"
          title={
            <>
              Organizing <span className="text-gradient-primary">Committee</span>
            </>
          }
          subtitle="The faculty team steering SOUHARDYA 2026."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {COMMITTEE.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <div className="glass-panel lift-card h-full rounded-3xl p-7">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 font-display text-lg font-bold text-primary">
                  {initials(m.name)}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{m.name}</h3>
                <p className="text-sm font-semibold text-primary">{m.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.dept}</p>
                <div className="mt-5 space-y-2 text-sm">
                  <a
                    href={`mailto:${m.email}`}
                    className="flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </a>
                  <a
                    href={`tel:${m.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    {m.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 text-center">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">
            Student <span className="text-gradient-primary">Coordinators</span>
          </h3>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COORDINATORS.map((c, i) => (
            <Reveal key={c.email} delay={i * 0.05}>
              <div className="glass-panel lift-card h-full rounded-2xl p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                    {initials(c.name)}
                  </span>
                  <p className="truncate font-display font-semibold">{c.name}</p>
                </div>
                <div className="mt-4 space-y-1.5 text-xs">
                  <a
                    href={`mailto:${c.email}`}
                    className="flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </a>
                  <a
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {c.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
