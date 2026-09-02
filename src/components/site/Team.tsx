import { Mail, Phone } from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";
import pradeepKumarSingh from "@/assets/pradeep-kumar-singh.png";
import askSinha from "@/assets/ask-sinha.png";
import shailendraKumarSingh from "@/assets/shailendra-kumar-singh.png";
import pkMishra from "@/assets/pk-mishra.png";
import dkSingh from "@/assets/dk-singh.png";
import rsSingh from "@/assets/rs-singh.png";
import rkMishra from "@/assets/rk-mishra.png";
import santoshAnsumali from "@/assets/santosh-ansumali.png";
import preetamSingh from "@/assets/preetam-singh.png";

const COMMITTEE = [
  {
    name: "Prof. Harish Hirani",
    role: "Patron",
    dept: "Director, RGIPT",
    email: "",
    phone: "",
  },
  {
    name: "Dr. Koushik Guha Biswas",
    role: "Convener",
    dept: "Dean, Student Affairs",
    email: "",
    phone: "",
  },
  {
    name: "Dr. Arvind Singh",
    role: "Convener",
    dept: "Department of Chemical and Biochemical Engineering",
    email: "convener_socialservice@rgipt.ac.in",
    phone: "+91 75719 93333",
  },
  {
    name: "Dr. Vijay Kumar Singh",
    role: "Co - Convener & Organising Secretary",
    dept: "Department of Electrical and Electronics Engineering",
    email: "vijayks@rgipt.ac.in",
    phone: "+91 97716 37514",
  },
  {
    name: "Dr. Malaya Kumar Sahoo",
    role: "Co - Convener & Treasurer",
    dept: "Department of Energy and Human Sciences",
    email: "malayaks@rgipt.ac.in",
    phone: "+91 94452 10634",
  },
  {
    name: "Dr. Sajal Agarwal",
    role: "Co - Convener - SOCI-O-THON",
    dept: "Department of Electrical and Electronics Engineering",
    email: "sagarwal@rgipt.ac.in",
    phone: "+91 535 2704 723",
  },
  {
    name: "Dr. Amey N. Agharkar",
    role: "Co - Convener - NIRMAAN",
    dept: "Department of Mechanical Engineering",
    email: "anagharkar@rgipt.ac.in",
    phone: "+91 94082 34016",
  },
];

const ADVISORY = [
  { name: "Dr. Pradeep Kumar Singh", role: "Former Director", dept: "CSIR-Central Institute of Mining and Fuel Research (CSIR-CIMFR)", image: pradeepKumarSingh },
  { name: "Prof. A. S. K. Sinha", role: "Former Director, RGIPT", dept: "Ahmedabad University", image: askSinha },
  { name: "Prof. Shailendra Kumar Singh", role: "Former Director, IIM Ranchi", dept: "Shiv Nadar University", image: shailendraKumarSingh },
  { name: "Prof. P. K. Mishra", role: "Former Vice-Chancellor, JUT, Ranchi & AKTU, Lucknow", dept: "IIT (BHU), Varanasi", image: pkMishra },
  { name: "Prof. D. K. Singh", role: "Vice-Chancellor, JUT, Ranchi", dept: "Former Director, BIT Sindri", image: dkSingh },
  { name: "Prof. Ram Sharan Singh", role: "Head, Department of Chemical Engineering & Technology", dept: "IIT (BHU), Varanasi", image: rsSingh },
  { name: "Prof. R. K. Mishra", role: "Department of Electrical Engineering", dept: "IIT (BHU), Varanasi", image: rkMishra },
  { name: "Prof. Santosh Ansumali", role: "Jawaharlal Nehru Centre for Advanced Scientific Research", dept: "(JNCASR), Bengaluru", image: santoshAnsumali },
  { name: "Dr. Preetam Singh", role: "Department of Ceramic Engineering", dept: "IIT (BHU), Varanasi", image: preetamSingh },
  { name: "Dr. Harish Kumar", role: "Scientist G", dept: "DMSRDE, Kanpur" },
  { name: "Dr. Atul Kumar", role: "Department of Electronics Engineering", dept: "IIT (BHU), Varanasi" },
  { name: "Dr. Ashish Bhatnagar", role: "Department of Physics", dept: "Jaypee Institute of Information Technology (JIIT), Noida" },
  { name: "Dr. Yogesh Kumar", role: "Department of Mechanical Engineering", dept: "NIT Patna" },
  { name: "Manu Kamboj", role: "National Youth Awardee", dept: "Government of India" },
];

const COORDINATORS = [
  { name: "Mr. Gaurav Srivastava", role: "SECRETARY", email: "secysocialservice@rgipt.ac.in", phone: "+91 91207 74202" },
  { name: "Mr. Rudransh Mishra", role: "JOINT SECRETARY", email: "24cs3043@rgipt.ac.in", phone: "+91 6307606696" },
  { name: "Ms. Sonal", role: "JOINT SECRETARY", email: "24mc3049@rgipt.ac.in", phone: "+91 70428 86792" },
  { name: "Ms. Maittri Tripathi", role: "Coordinator (Soci-o-thon)", email: "24mc3027@rgipt.ac.in", phone: "+91 79760 34702" },
  { name: "Mr. Vaibhav", role: "Coordinator (Soci-o-thon)", email: "24mc3059@rgipt.ac.in", phone: "+91 88140 92519" },
  { name: "Ms. Khushi Jatolia", role: "Coordinator (Nirmaan)", email: "24it3028@rgipt.ac.in", phone: "+91 63800 94014" },
  { name: "Ms. Omika Singh", role: "Coordinator (Nirmaan)", email: "24pp3005@rgipt.ac.in", phone: "+91 89500 84550" },
  { name: "Mr. Ojas Pandey", role: "Coordinator (Nirmaan)", email: "24re3009@rgipt.ac.in", phone: "+91 63925 84586" },
  { name: "Ms. Deboshruti Mondal", role: "Coordinator (Nirmaan)", email: "24it3017@rgipt.ac.in", phone: "+91 86706 94333" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter((p) => !["dr.", "dr", "mr.", "mr", "ms.", "ms", "prof.", "prof"].includes(p.toLowerCase()))
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
                {m.email || m.phone ? (
                  <div className="mt-5 space-y-2 text-sm">
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{m.email}</span>
                      </a>
                    )}
                    {m.phone && (
                      <a
                        href={`tel:${m.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Phone className="h-4 w-4 shrink-0" />
                        {m.phone}
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        
        <Reveal className="mt-20 text-center">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">
            Advisory <span className="text-gradient-primary">Committee</span>
          </h3>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ADVISORY.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <div className="glass-panel lift-card h-full rounded-3xl p-7 flex flex-col items-center text-center">
                <div className="h-40 w-40 overflow-hidden rounded-2xl border-2 border-primary/20 bg-primary/10 grid place-items-center text-primary font-display font-bold text-4xl mb-5 shadow-inner">
                  {/* Space for photo. Fallback to initials */}
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    m.name ? initials(m.name) : ""
                  )}
                </div>
                <h3 className="font-display text-lg font-bold">{m.name}</h3>
                <p className="mt-2 text-sm font-semibold text-primary">{m.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.dept}</p>
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
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold">{c.name}</p>
                    <p className="truncate text-xs font-semibold text-primary mt-0.5 uppercase tracking-wider">{c.role}</p>
                  </div>
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
