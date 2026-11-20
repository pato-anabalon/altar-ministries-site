"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ALTAR_MOTION_OK, gsap, registerAltarMotion, ScrollTrigger } from "@/lib/motion/register";
import { setLenis } from "@/lib/motion/lenis";

registerAltarMotion();

/**
 * Smooth scroll for the whole site, driven by GSAP's ticker so ScrollTrigger scrubs (the hero)
 * stay in lockstep with it. Not created under reduced motion: native scrolling is kept.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(ALTAR_MOTION_OK).matches) return;

    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)) });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
