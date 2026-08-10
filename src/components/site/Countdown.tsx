import { useEffect, useState } from "react";

const REGISTRATION_OPEN = new Date("2026-08-12T00:00:00+05:30");
const EVENT_START = new Date("2026-10-30T09:00:00+05:30");

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const update = () => setDiff(Math.max(0, target.getTime() - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  const registrationOpen = now !== null && now >= REGISTRATION_OPEN.getTime();
  const target = registrationOpen ? EVENT_START : REGISTRATION_OPEN;
  const { days, hours, minutes, seconds } = useCountdown(target);

  const label = registrationOpen ? "Event begins in" : "Registration opens in";
  const units = [
    { v: days, l: "Days" },
    { v: hours, l: "Hours" },
    { v: minutes, l: "Mins" },
    { v: seconds, l: "Secs" },
  ];

  return (
    <div className={compact ? "" : "glass-panel rounded-2xl px-5 py-4 sm:px-7"}>
      <p className="text-center text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
        {label}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((u) => (
          <div key={u.l} className="text-center">
            <div className="rounded-xl border border-border bg-navy-deep/70 px-2 py-2 font-display text-2xl font-bold tabular-nums sm:text-3xl">
              {now === null ? "--" : String(u.v).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase">
              {u.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
