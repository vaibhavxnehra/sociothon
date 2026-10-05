import { motion } from "motion/react";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-globe.jpg";
import rgiptLogo from "@/assets/rgipt-logo-2.png";
import socialCouncilLogo from "@/assets/social-council-logo.png";
import { Countdown } from "./Countdown";

const words = ["SOCI-O-THON & NIRMAAN"];
const SPONSORS = [
  {
    name: "C.S.I.R. - INDIA",
    logo: "/sponsors/csir-india.png",
    alt: "Council of Scientific and Industrial Research (CSIR), India",
    imageSurface: "bg-white p-2",
  },
  {
    name: "IEEE",
    logo: "/sponsors/ieee.png",
    alt: "IEEE logo",
    imageSurface: "bg-black",
  },
  {
    name: "STARTUPJET",
    logo: "/sponsors/startupjet.png",
    alt: "STARTUPJET logo",
    imageSurface: "bg-white p-2",
  },
];

function SponsorMark({ sponsor }: { sponsor: (typeof SPONSORS)[number] }) {
  return (
    <div
      role="group"
      aria-label={sponsor.name}
      className="w-full max-w-44 rounded-2xl border border-primary/60 bg-background/75 p-2 text-center shadow-2xl shadow-black/30 backdrop-blur-md sm:p-3"
    >
      <div className={`flex h-16 items-center justify-center overflow-hidden rounded-xl sm:h-24 ${sponsor.imageSurface}`}>
        <img
          src={sponsor.logo}
          alt={sponsor.alt}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-2 min-h-8 text-[10px] font-bold leading-4 tracking-wide text-foreground sm:text-xs">{sponsor.name}</p>
    </div>
  );
}

export function Hero({ registerUrl }: { registerUrl: string }) {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    import("@/lib/utils").then(({ smoothScrollTo }) => smoothScrollTo(id));
  };

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

      {/* Running Ribbon */}
      <div className="absolute top-[80px] sm:top-[88px] inset-x-0 z-40 flex overflow-hidden whitespace-nowrap bg-primary text-primary-foreground py-2 shadow-[var(--shadow-glow)]">
        <motion.div
          className="flex min-w-max gap-12 font-display text-xs font-bold tracking-[0.2em] uppercase sm:text-sm"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        >
          <div className="flex gap-12 px-6">
            <span>🚨 Early Bird Registration Extended to 10th October</span>
            <span>•</span>
            <span>📝 PPT Submission Deadline Changed to 7th October</span>
            <span>•</span>
            <span>🚨 Early Bird Registration Extended to 10th October</span>
            <span>•</span>
            <span>📝 PPT Submission Deadline Changed to 7th October</span>
            <span>•</span>
          </div>
          <div className="flex gap-12 px-6">
            <span>🚨 Early Bird Registration Extended to 10th October</span>
            <span>•</span>
            <span>📝 PPT Submission Deadline Changed to 7th October</span>
            <span>•</span>
            <span>🚨 Early Bird Registration Extended to 10th October</span>
            <span>•</span>
            <span>📝 PPT Submission Deadline Changed to 7th October</span>
            <span>•</span>
          </div>
        </motion.div>
      </div>

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
        <h1 className="mt-4 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-16 text-center font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-6xl lg:text-[5rem] w-full text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-sm">
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
            className="h-20 w-auto sm:h-28 lg:h-32 object-contain drop-shadow-2xl transition-all cursor-pointer" 
          />
          {words.map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block pb-2"
            >
              <span className="block text-4xl sm:text-6xl lg:text-[5rem] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">SOCI-O-THON</span>
              <span className="block text-3xl sm:text-5xl lg:text-[4rem] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">&amp; NIRMAAN</span>
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
            className="h-20 w-auto sm:h-28 lg:h-32 object-contain drop-shadow-2xl transition-all cursor-pointer" 
          />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="font-display text-xl font-semibold text-gradient-primary sm:text-3xl tracking-wide">
            SOUHARDYA 2026 &middot; RGIPT
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center text-center"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-3">
            Hosted By
          </p>
          <p className="text-base sm:text-xl font-medium text-foreground">
            Social Services Council
          </p>
          <p className="text-sm sm:text-lg text-muted-foreground mt-1 max-w-2xl text-balance">
            Rajiv Gandhi Institute of Petroleum Technology
          </p>
        </motion.div>

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
            onClick={(e) => scrollTo(e, registerUrl)}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-display font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 sm:w-auto animate-pulse-scale"
          >
            Register Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#events"
            onClick={(e) => scrollTo(e, "events")}
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

        <div className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="mb-4 text-center font-display text-sm font-bold tracking-[0.2em] text-gradient-primary uppercase">
            Sponsors
          </h2>
          <div className="grid grid-cols-3 justify-items-center gap-2 sm:gap-4">
            {SPONSORS.map((sponsor) => <SponsorMark key={sponsor.name} sponsor={sponsor} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
