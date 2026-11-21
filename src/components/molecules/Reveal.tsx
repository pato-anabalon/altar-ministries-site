"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ALTAR_MOTION_OK, gsap, registerAltarMotion, useGSAP } from "@/lib/motion/register";

registerAltarMotion();

type Variant = "rise" | "photo";

/**
 * The one entrance used below the hero, kept quiet on purpose (the hero is the authored moment).
 * - rise: content lifts 28px into place while fading in.
 * - photo: the picture is uncovered upward like a curtain and settles from a slight zoom.
 * Plays once when 15% into view; reduced motion leaves everything in place.
 */
export function Reveal({ children, variant = "rise", delay = 0, className }: { children: ReactNode; variant?: Variant; delay?: number; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(ALTAR_MOTION_OK, () => {
        const scrollTrigger = { trigger: el, start: "top 85%", once: true };
        if (variant === "photo") {
          gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, delay, ease: "expo.inOut", scrollTrigger });
          // Placeholders (photos still to come) have no <img> to settle.
          const img = el.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, delay, ease: "expo.out", scrollTrigger });
        } else {
          gsap.fromTo(el, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, delay, ease: "expo.out", scrollTrigger });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn(variant === "photo" && "overflow-hidden", className)}>
      {children}
    </div>
  );
}
