import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  BrainCircuit,
  ClipboardList,
  FileCheck2,
  FileText,
  HeartPulse,
  Leaf,
  Presentation,
  Sprout,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import { Reveal, SectionHeading, Counter } from "./primitives";

const STEPS = [
  {
    icon: FileText,
    title: "Idea Proposal (Round 1)",
    body: "Submit a short write-up covering problem understanding, proposed solution, impact potential and feasibility. Online submission as PPT or PDF.",
  },
  {
    icon: ClipboardList,
    title: "Shortlisting",
    body: "Teams are shortlisted from Round 1 entries and invited to the Final Round at RGIPT.",
  },
  {
    icon: Wrench,
    title: "Prototype Development",
    body: "Selected teams develop a prototype or model along with an implementation strategy, impact assessment and sustainability plan.",
  },
  {
    icon: FileCheck2,
    title: "Final Evaluation",
    body: "Live presentation of the prototype on Final Round day, followed by a Q&A round with judges who decide the winners.",
  },
];

const THEMES = [
  { icon: Sprout, label: "Rural Development" },
  { icon: HeartPulse, label: "Health & Hygiene" },
  { icon: Leaf, label: "Energy & Sustainability" },
  { icon: Users, label: "Women & Child Empowerment" },
  { icon: BrainCircuit, label: "Mental Wellbeing & Community Care" },
];

const NIRMAAN_THEMES = [
  "AI & Digital Innovation",
  "Sustainability",
  "Climate Action",
  "Education",
  "Community Health",
];

const ABSTRACT_RULES = [
  "Each submitted paper must include the title of the paper, name(s) of author(s), affiliation(s), phone number and email ID of the corresponding author.",
  "The first author and presenting author(s) must be undergraduate students (BE/B.Tech / Dual Degree).",
  "Other co-authors may include undergraduate, postgraduate or PhD students, as well as faculty members.",
  "There is no restriction on the number of authors or the number of abstract submissions per participant.",
  "Each submission requires a separate registration, completed before the submission deadline.",
  "Certificates are awarded to all registered participants who attend the conference.",
];

export function Events() {
  const [tab, setTab] = useState<"socio" | "nirmaan">("socio");

  return (
    <section id="events" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Rulebooks"
          title={
            <>
              Two events. <span className="text-gradient-primary">One mission.</span>
            </>
          }
          subtitle="Everything you need to know- process, themes, eligibility and rewards- for each event."
        />

        <Reveal className="mt-10 flex justify-center">
          <div className="glass-panel inline-grid grid-cols-2 gap-1 rounded-full p-1">
            {(
              [
                ["socio", "SOCI-O-THON"],
                ["nirmaan", "NIRMAAN"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-colors sm:px-8 ${
                  tab === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === key && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {tab === "socio" ? (
            <motion.div
              key="socio"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <div className="glass-panel rounded-3xl p-7 sm:p-10">
                <h3 className="font-display text-3xl font-extrabold sm:text-4xl">
                  SOCI-O-THON <span className="text-gradient-primary">- Social Innovation Hackathon</span>
                </h3>
                <p className="mt-4 max-w-3xl text-muted-foreground">
                  The first hackathon of its kind at this scale- open to students from every field, not just
                  engineering. Teams take on real social problems, from the grassroots to the citywide, and carry them
                  from a raw idea to a working prototype with a credible plan for impact.
                </p>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
                  <ol className="relative space-y-6 border-l border-border pl-7">
                    {STEPS.map((s, i) => (
                      <Reveal key={s.title} delay={i * 0.08}>
                        <li className="relative">
                          <span className="absolute top-1 -left-[43px] grid h-8 w-8 place-items-center rounded-full border border-primary/50 bg-navy-deep text-primary">
                            <s.icon className="h-4 w-4" />
                          </span>
                          <h4 className="font-display text-lg font-bold">{s.title}</h4>
                          <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
                        </li>
                      </Reveal>
                    ))}
                  </ol>

                  <div className="space-y-4">
                    <Reveal>
                      <div className="lift-card rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
                        <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">Prize Pool</p>
                        <p className="mt-2 font-display text-5xl font-extrabold text-gradient-primary">
                          <Counter to={30000} prefix="₹" />
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Plus Special &amp; Additional Awards and Recognitions
                        </p>
                      </div>
                    </Reveal>
                    <Reveal delay={0.08}>
                      <div className="glass-panel lift-card rounded-2xl p-6">
                        <Award className="h-5 w-5 text-primary" />
                        <p className="mt-3 text-sm text-muted-foreground">
                          A <strong className="text-foreground">Certificate of Participation</strong> is awarded to
                          every participant.
                        </p>
                      </div>
                    </Reveal>
                  </div>
                </div>

                <h4 className="mt-12 font-display text-xl font-bold">Themes</h4>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {THEMES.map((t, i) => (
                    <Reveal key={t.label} delay={i * 0.06}>
                      <div className="glass-panel lift-card h-full rounded-2xl p-5 text-center">
                        <t.icon className="mx-auto h-7 w-7 text-primary" />
                        <p className="mt-3 text-sm font-semibold">{t.label}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="nirmaan"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <div className="glass-panel rounded-3xl p-7 sm:p-10">
                <h3 className="font-display text-3xl font-extrabold sm:text-4xl">
                  NIRMAAN <span className="text-gradient-primary">- National Social Conference</span>
                </h3>
                <p className="mt-4 max-w-3xl text-muted-foreground">
                  Organized under SOUHARDYA, The Social Fest, NIRMAAN is a conference and presentation competition that
                  brings students face-to-face with IAS/IPS officers, senior government officials and NGO
                  representatives working at the grassroots of social change- through interactive talks, Q&amp;A
                  sessions and NGO showcases.
                </p>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <div className="space-y-4">
                    <Reveal>
                      <div className="glass-panel lift-card rounded-2xl p-6">
                        <Presentation className="h-5 w-5 text-primary" />
                        <h4 className="mt-3 font-display text-lg font-bold">Presentation Competition Themes</h4>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {NIRMAAN_THEMES.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                    <Reveal delay={0.08}>
                      <div className="lift-card rounded-2xl border border-primary/40 bg-primary/10 p-6">
                        <Trophy className="h-5 w-5 text-primary" />
                        <h4 className="mt-3 font-display text-lg font-bold">Rewards</h4>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Trophies and goodies for theme-wise winners. Certificates for all registered participants who
                          attend the conference.
                        </p>
                      </div>
                    </Reveal>
                  </div>

                  <Reveal delay={0.1}>
                    <div className="glass-panel h-full rounded-2xl p-6 sm:p-8">
                      <h4 className="font-display text-lg font-bold">Abstract Submission Guidelines</h4>
                      <ul className="mt-5 space-y-4">
                        {ABSTRACT_RULES.map((r, i) => (
                          <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                              {i + 1}
                            </span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
