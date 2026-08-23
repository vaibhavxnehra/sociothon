import { useState } from "react";
import { Check, Copy, QrCode } from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FEES = [
  { window: "Before 10th September", fee: "₹500", stay: "+ ₹250 (Accommodation)" },
  { window: "10th – 30th September", fee: "₹750", stay: "+ ₹250 (Accommodation)" },
  { window: "On-spot Registration", fee: "₹1,000", stay: "+ ₹250 (Accommodation)" },
];

const BANK = [
  { label: "Name of Bank", value: "RGIPT Student Amenities Fee Account" },
  { label: "Account No.", value: "50100834957593" },
  { label: "IFSC Code", value: "HDFC0000945" },
];

const FAQS = [
  {
    q: "Who can participate?",
    a: "Undergraduate students from colleges and universities across India. SOCI-O-THON is open to every discipline, not just engineering. For NIRMAAN, the first author and presenting author(s) must be undergraduate students (BE/B.Tech / Dual Degree).",
  },
  {
    q: "Is accommodation available?",
    a: "Yes. Accommodation is available at an additional ₹250 over the registration fee, and can be opted for at the time of registration.",
  },
  {
    q: "What is the team size for SOCI-O-THON?",
    a: "Team size details will be shared along with the problem statements released on 10 September 2026. Please check this page for updates.",
  },
  {
    q: "What format should the Round 1 submission be in?",
    a: "A short write-up submitted online as a PPT or PDF, covering problem understanding, proposed solution, impact potential and feasibility.",
  },
  {
    q: "Can I submit more than one abstract to NIRMAAN?",
    a: "Yes. There is no restriction on the number of abstract submissions per participant, but each submission requires a separate registration completed before the submission deadline.",
  },
  {
    q: "Will I get a certificate?",
    a: "Yes. A Certificate of Participation is awarded to every participant across both events, and NIRMAAN certificates go to all registered participants who attend the conference.",
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

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
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
                        <p className="text-xs text-muted-foreground">{f.stay}</p>
                      </div>
                      <p className="font-display text-2xl font-extrabold text-primary">{f.fee}</p>
                    </div>
                  ))}
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
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-panel flex h-full flex-col items-center justify-center rounded-3xl p-8 text-center">
              <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">Scan to register</p>
              <div className="mt-6 grid aspect-square w-full max-w-[260px] place-items-center rounded-2xl border border-dashed border-primary/40 bg-navy-deep/60">
                <div className="px-6">
                  <QrCode className="mx-auto h-16 w-16 text-primary" />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Registration QR code placeholder — replace with the official QR image.
                  </p>
                </div>
              </div>
              <a
                href={registerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 font-display font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
              >
                Register Now
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                Each NIRMAAN abstract submission requires a separate registration.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mx-auto mt-14 max-w-3xl">
          <h3 className="text-center font-display text-2xl font-bold">Frequently asked questions</h3>
          <Accordion type="single" collapsible className="glass-panel mt-6 rounded-2xl px-5 sm:px-7">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left font-display">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
