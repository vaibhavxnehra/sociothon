import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/98 backdrop-blur-xl cursor-pointer overflow-hidden p-4 sm:p-8"
        >
          <div className="max-w-4xl text-center flex flex-col items-center gap-8 mt-12 sm:mt-0">
            <h1 className="text-3xl sm:text-5xl font-bold font-display text-gradient-primary leading-tight mt-12 sm:mt-0">
              Inauguration of Soci-O-Thon and Nirmaan
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              We are deeply honored to have our program inaugurated by the esteemed <strong className="text-foreground">Padma Shri Prof. H.C. Verma</strong>. His presence inspires us all to work towards social innovation and rural development.
            </p>

            <div className="w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl border border-border/50">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
