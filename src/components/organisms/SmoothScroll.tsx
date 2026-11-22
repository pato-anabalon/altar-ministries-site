"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ALTAR_MOTION_OK, gsap, registerAltarMotion, ScrollTrigger } from "@/lib/motion/register";
import { scrollToTop, setLenis, takeKeepScroll } from "@/lib/motion/lenis";

registerAltarMotion();

/**
 * Smooth scroll for the whole site, driven by GSAP's ticker so ScrollTrigger scrubs (the hero)
 * stay in lockstep with it. Not created under reduced motion: native scrolling is kept.
 *
 * Also owns the scroll position across route changes: a new page starts at the top. Next's own
 * reset is not enough here, because Lenis and the pinned hero (whose refresh restores the scroll it
 * recorded mid-navigation) can leave the new page part-way down. Back/forward, in-page modals and
 * #anchors keep their position.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const popped = useRef<string | null>(null);

  useEffect(() => {
    const onPopState = () => {
      popped.current = window.location.pathname;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (pathname === previous.current) return;
    previous.current = pathname;
    const keep = takeKeepScroll() || popped.current === pathname || Boolean(window.location.hash);
    popped.current = null;
    if (keep) return;
    scrollToTop();
    ScrollTrigger.refresh();

    // A late refresh (fonts, images) or leftover smooth-scroll momentum can still move the new page:
    // hold the top for a moment, until the visitor scrolls themselves.
    const hold = () => {
      if (window.scrollY !== 0) scrollToTop();
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const release = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", hold);
      inputs.forEach((type) => window.removeEventListener(type, release));
    };
    const timer = window.setTimeout(release, 2500);
    window.addEventListener("scroll", hold, { passive: true });
    inputs.forEach((type) => window.addEventListener(type, release, { passive: true }));
    return release;
  }, [pathname]);

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
