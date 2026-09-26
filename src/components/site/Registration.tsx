import { useState } from "react";
import { Check, Copy, QrCode } from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import nirmaanQr from "@/assets/nirmaan-qr.png";
import sociothonQr from "@/assets/sociothon-qr.png";
import paymentQr from "@/assets/payment-qr.jpg";

const FEES = [
  { window: "Before 30th September", fee: "₹500/-", stay: "" },
  { window: "1st October - 15th October", fee: "₹750/-", stay: "" },
  { window: "15th October - On Spot Registration", fee: "₹1,000/-", stay: "" },
];

const BANK = [
  { label: "Name of Bank", value: "RGIPT Student Amenities Fee Account" },
  { label: "Account No.", value: "50100834957593" },
  { label: "IFSC Code", value: "HDFC0000945" },
];

const FAQS = [
  {
    q: "Who can participate in SOCI-O-THON and NIRMAAN?",
    a: "Both events are open to UG, PG and PhD students, research scholars, and industry professionals from diverse disciplines, including Engineering, Management, Medical & Health Sciences, Commerce, Computer Applications, Sciences, Humanities, and allied fields. For NIRMAAN, the presenting author should belong to one of the eligible participant categories.",
  },
  {
    q: "Is accommodation available?",
    a: "Yes. Hostel accommodation is available on a paid basis. Participants wishing to avail themselves of this facility are required to fill out a separate accommodation form.",
  },
  {
    q: "What is the team size for SOCI-O-THON?",
    a: "A SOCI-O-THON team may consist of 1–4 members. Interdisciplinary teams are encouraged.",
  },
  {
    q: "How many co-authors are allowed for NIRMAAN?",
    a: "A paper may have multiple authors; however, one author must be designated as the presenting author. Accompanying co-authors are required to register separately, as applicable.",
  },
  {
    q: "What should the initial submission for SOCI-O-THON include?",
    a: "Teams should submit a well-structured PPT covering the problem statement, proposed solution, innovation, feasibility, and expected social impact.",
  },
  {
    q: "Can I submit more than one abstract to NIRMAAN?",
    a: "Yes. More than one abstract may be submitted; however, a separate registration fee is required for each accepted paper/presentation.",
  },
  {
    q: "Will I receive a certificate?",
    a: "Yes. Certificates of Participation/Presentation will be provided to eligible registered participants as per the event guidelines.",
  },
  {
    q: "Will the papers be published?",
    a: "Yes. Accepted and presented papers will be published in the SOUHARDYA 2026 Conference Proceedings with an ISBN.",
  },
];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
      <button
        aria-label={`Copy ${label}`}
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border transition-colors hover:bg-secondary"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Registration({ registerUrl }: { registerUrl: string }) {
  return (
    <section id="register" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Registration"
          title={
            <>
              Secure your <span className="text-gradient-primary">seat</span>
            </>
          }
          subtitle="Registration fees for students from other colleges and universities."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.35fr_1fr] lg:items-center">
          <Reveal delay={0.1}>
            <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-6 text-center">
              <h4 className="font-display text-lg font-bold">SOCI-O-THON</h4>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">Scan to register</p>
              <div className="mt-5 grid aspect-square w-full max-w-[180px] place-items-center rounded-2xl bg-white p-3">
                <img src={sociothonQr} alt="SOCI-O-THON Registration QR" className="h-full w-full object-contain" />
              </div>
              <a
                href="https://unstop.com/p/soci-o-thon-rajiv-gandhi-institute-of-petroleum-technology-rgipt-jais-uttar-pradesh-1739363?utm_medium=Share&utm_source=maitttri8346&utm_campaign=Online_coding_challenge"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 animate-pulse-scale"
              >
                Register Now
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass-panel overflow-hidden rounded-3xl">
              <div className="p-7 sm:p-9">
                <h3 className="font-display text-2xl font-bold">Registration Fees</h3>
                <div className="mt-6 space-y-3">
                  {FEES.map((f) => (
                    <div
                      key={f.window}
                      className="lift-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-navy-deep/50 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{f.window}</p>
                        {f.stay && <p className="text-xs text-muted-foreground">{f.stay}</p>}
                      </div>
                      <p className="font-display text-2xl font-extrabold text-primary">{f.fee}</p>
                    </div>
                  ))}
                  <div className="pt-2 text-right sm:text-left">
                    <p className="inline-block rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary border border-primary/20">
                      <span className="text-red-400 font-bold">*</span> ₹450/- (for Accommodation & Food) / Day
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-2 text-sm text-muted-foreground text-center sm:text-left">
                  <p className="font-medium text-foreground">For Participants (Other college / University / Industries)</p>
                  <p className="text-red-400">Registration is per team (one presenting author).</p>
                  <p className="text-red-400">Each accompanying co-author must pay the registration fee separately.</p>
                  <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-left">
                    <p className="font-semibold text-primary">All-Access Registration</p>
                    <p className="mt-1 text-primary/90">Pay the registration fee for either SOCI-O-THON or NIRMAAN, and get <strong className="font-bold">free access</strong> to participate in BOTH flagship events, as well as ALL other cultural events (PRATIBIMB, DRISHTIKON, etc.)!</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-border p-7 sm:p-9">
                <h3 className="font-display text-2xl font-bold">Bank Details</h3>
                <p className="mt-1 text-sm text-muted-foreground">For offline / bank transfer payments.</p>
                <div className="mt-4">
                  {BANK.map((b) => (
                    <CopyRow key={b.label} label={b.label} value={b.value} />
                  ))}
                </div>
                <div className="mt-8 flex flex-col items-center">
                  <div className="w-48 overflow-hidden rounded-xl bg-white shadow-md sm:w-56">
                    <img src={paymentQr} alt="Payment QR Code" className="h-full w-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-6 text-center">
              <h4 className="font-display text-lg font-bold">NIRMAAN</h4>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">Scan to register</p>
              <div className="mt-5 grid aspect-square w-full max-w-[180px] place-items-center rounded-2xl bg-white p-3">
                <img src={nirmaanQr} alt="NIRMAAN Registration QR" className="h-full w-full object-contain" />
              </div>
              <a
                href="https://unstop.com/p/nirmaan-rajiv-gandhi-institute-of-petroleum-technology-rgipt-jais-uttar-pradesh-1739415?lb=vXVoVKWb&utm_medium=Share&utm_source=maitttri8346&utm_campaign=Conferences"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 animate-pulse-scale"
              >
                Register Now
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mx-auto mt-14 max-w-3xl">
          <h3 className="text-center font-display text-2xl font-bold">Frequently asked questions</h3>
          <Accordion type="single" collapsible className="glass-panel mt-6 rounded-2xl px-5 sm:px-7">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left font-display">{f.q}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-wrap text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
