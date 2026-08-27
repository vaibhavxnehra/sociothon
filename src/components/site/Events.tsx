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
    title: "Idea Proposal",
    body: "Form a team of 3–4 members, submit a well structured PPT presentation covering the problem statement, proposed solution, innovation, feasibility, and expected social impact.",
  },
  {
    icon: ClipboardList,
    title: "Shortlisting",
    body: "Proposals will be evaluated on social relevance, innovation, feasibility, sustainability, scalability, and potential impact.",
  },
  {
    icon: Wrench,
    title: "Solution Development",
    body: "Shortlisted teams will further develop and refine their solutions. A prototype/model is encouraged.",
  },
  {
    icon: FileCheck2,
    title: "Final Presentation & Evaluation",
    body: "Teams will present their solutions before an expert jury, followed by a Q&A session. Evaluation will consider innovation, applicability, feasibility, sustainability, scalability, and potential social impact.",
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
  "Women and Child Empowerment",
  "Rural Development",
  "Energy and Sustainability",
  "Mental Wellbeing and Community Care",
  "Health and Hygiene",
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
                <div className="mt-4 space-y-4 max-w-3xl text-muted-foreground">
                  <p>
                    SOCI-O-THON – Together for Social Good is the Social Innovation Hackathon of SOUHARDYA 2026, providing students from diverse disciplines an opportunity to transform real-world social challenges into innovative and implementable solutions.
                  </p>
                  <p>
                    Participants are encouraged to move beyond ideas and develop solutions with strong potential for practical implementation and social impact. Depending on the nature of the challenge, solutions may be presented as a prototype, model, proof-of-concept, digital solution, process, or implementation framework.
                  </p>
                </div>

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
                  The conference, held under the flagship of SOUHARDYA 2026, invites paper and poster presentations that bring together IAS/IPS officers, academicians, industry professionals, NGO innovators, and students on a common platform.
                </p>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <div className="space-y-4">
                    <Reveal>
                      <div className="glass-panel lift-card rounded-2xl p-6">
                        <Presentation className="h-5 w-5 text-primary" />
                        <h4 className="mt-3 font-display text-lg font-bold">Themes</h4>
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
                          ₹10,000 as prize pool, trophies, goodies and other exciting prizes! + Certificate of Participation
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
