import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function smoothScrollTo(targetId: string) {
  const target = targetId.startsWith('#') ? targetId.substring(1) : targetId;
  
  if (target === "top") {
    smoothScrollToY(0);
    return;
  }

  const el = document.getElementById(target);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    smoothScrollToY(y);
  }
}

function smoothScrollToY(targetY: number) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  
  // Constant-feeling duration based on distance, capped for sanity
  const duration = Math.min(1000, Math.max(400, Math.abs(distance) * 0.2));
  
  let start = performance.now();
  
  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // easeInOutQuad
    const ease = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
    window.scrollTo(0, startY + distance * ease);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}
