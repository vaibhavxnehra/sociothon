import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import inaugurationMain from "@/assets/inauguration-main.jpg";

export function SplashOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // We don't lock body overflow so window scrolling still works,
    // or we can just rely on the overlay's own wheel event to dismiss it.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        setIsVisible(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={() => setIsVisible(false)}
          onWheel={() => setIsVisible(false)}
          onTouchMove={() => setIsVisible(false)}
          className="fixed inset-0 z-[9999] bg-background/98 backdrop-blur-xl cursor-pointer overflow-y-auto"
        >
          <div className="min-h-full w-full flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="max-w-4xl w-full text-center flex flex-col items-center gap-4 sm:gap-5 py-4">
            <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-gradient-primary leading-tight mt-8 sm:mt-0">
              A Proud Beginning for SOUHARDYA 2026: Soci-O-thon and Nirmaan
            </h1>
            <div className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl space-y-1.5 sm:space-y-2">
              <p>
                We are honored to have the Soci-O-Thon & NIRMAAN poster unveiled and the abstract submission process officially launched by <strong className="text-foreground whitespace-nowrap">Padma Shri Prof. H. C. Verma</strong>.
              </p>
              <p>
                His inspiring presence marks the beginning of a journey dedicated to social innovation, rural development, and impactful solutions for society.
              </p>
              <p className="font-semibold text-primary pt-1 sm:pt-2">
                Together for Social Good. Together for Change.
              </p>
            </div>

            <div className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl border border-border/50">
              <img src={inaugurationMain} alt="Inauguration by Padma Shri Prof. H.C. Verma" className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500" />
            </div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 pb-12 text-primary font-medium flex flex-col items-center gap-2"
            >
              <span>Click anywhere or scroll to enter website</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </motion.div>
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
