import { motion } from "motion/react";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-globe.jpg";
import rgiptLogo from "@/assets/rgipt-logo-2.png";
import socialCouncilLogo from "@/assets/social-council-logo.png";
import { Countdown } from "./Countdown";

const words = ["SOCI-O-THON & NIRMAAN"];

export function Hero({ registerUrl }: { registerUrl: string }) {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1088}
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20 mix-blend-overlay"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_100%)]" />
      <div className="grid-noise absolute inset-0 -z-10 opacity-40" />

      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-28 right-[8%] -z-10 hidden h-40 w-40 rounded-full bg-primary/20 blur-3xl md:block"
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 22, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-[6%] -z-10 hidden h-52 w-52 rounded-full bg-navy-light/50 blur-3xl md:block"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-primary uppercase"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Souhardya 2026 Presents
        </motion.div>

        <h1 className="mt-6 flex items-center justify-center gap-8 sm:gap-16 lg:gap-24 text-center font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-6xl lg:text-7xl w-full text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-sm">
          <motion.img 
            src={rgiptLogo} 
            alt="RGIPT Logo" 
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: [0, -12, 0] }}
            transition={{ 
              opacity: { duration: 0.8, ease: "easeOut" },
              scale: { duration: 0.8, ease: "easeOut" },
              x: { duration: 0.8, ease: "easeOut" },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
            whileHover={{ scale: 1.12, rotate: -6, filter: "drop-shadow(0 0 25px rgba(255,215,0,0.6))" }}
            className="h-24 w-auto sm:h-32 lg:h-40 object-contain drop-shadow-2xl transition-all cursor-pointer" 
          />
          {words.map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {w}
            </motion.span>
          ))}
          <motion.img 
            src={socialCouncilLogo} 
            alt="Social Council Logo" 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: [0, -12, 0] }}
            transition={{ 
              opacity: { duration: 0.8, ease: "easeOut" },
              scale: { duration: 0.8, ease: "easeOut" },
              x: { duration: 0.8, ease: "easeOut" },
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }
            }}
            whileHover={{ scale: 1.12, rotate: 6, filter: "drop-shadow(0 0 25px rgba(255,215,0,0.6))" }}
            className="h-24 w-auto sm:h-32 lg:h-40 object-contain drop-shadow-2xl transition-all cursor-pointer" 
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-5 text-center font-display text-xl font-semibold text-gradient-primary sm:text-2xl"
        >
          Together for Social Good.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground sm:text-base"
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
            30th &amp; 31st October, 2026
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            RGIPT, Jais, Amethi
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={registerUrl}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-display font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 sm:w-auto"
          >
            Register Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#events"
            className="inline-flex w-full items-center justify-center rounded-full border border-primary/50 px-8 py-3.5 font-display font-semibold text-foreground transition-colors hover:bg-primary/10 sm:w-auto"
          >
            Explore Events
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mx-auto mt-12 max-w-xl"
        >
          <Countdown />
        </motion.div>
      </div>
    </section>
  );
}
