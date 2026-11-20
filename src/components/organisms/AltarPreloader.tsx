"use client";

import { useRef, useState } from "react";
import { HeroLetters } from "@/components/atoms/HeroLetters";
import { measureGlyphBar } from "@/lib/motion/glyph";
import { heroShape, windowCenter } from "@/lib/motion/windowShape";
import { lockScroll } from "@/lib/motion/lenis";
import { markPreloaderDone } from "@/lib/motion/preloader";
import { ALTAR_MOTION_OK, gsap, registerAltarMotion, useGSAP } from "@/lib/motion/register";

registerAltarMotion();

/** Hard limit from mount: whatever fails, the visitor is never kept behind the green screen. */
const DEADLINE_MS = 5500;

/**
 * Nodo preloader, once per session (~3.4 s). ALTAR rises letter by letter on green with
 * MINISTRIES beneath; then an opening in the hero's window shape (arch or cross) grows behind the letters to exactly
 * the home hero's window (the cross appears inside it, aligned to the T) and the green fades away around
 * it. On other pages the letters fade and the arch keeps growing until it uncovers the page. Hidden by CSS unless html[data-preloader=pending].
 */
export function AltarPreloader() {
  const root = useRef<HTMLDivElement>(null);
  const hole = useRef<SVGPathElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      const path = hole.current;
      if (!el || !path || document.documentElement.dataset.preloader !== "pending") {
        setGone(true);
        return;
      }

      const unlock = lockScroll();
      window.scrollTo(0, 0);
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(deadline);
        unlock();
        markPreloaderDone();
        setGone(true);
      };
      const deadline = window.setTimeout(finish, DEADLINE_MS);

      const width = window.innerWidth;
      const height = window.innerHeight;
      // The opening is shaped and anchored on the T exactly like the hero's window. It is (re)measured
      // right before it opens, once Mon Cheri has certainly loaded.
      let center = windowCenter(heroShape.toPixels(heroShape.start(width, height), width, height));
      const shapeOpening = () => {
        const t = el.querySelectorAll<HTMLElement>("[data-letter]")[2];
        const pixels = heroShape.toPixels(heroShape.start(width, height, t ? measureGlyphBar(t, el) : undefined), width, height);
        // 1.5px smaller than the hero's window: where both anti-aliased edges met, the bright
        // Auckland horizon behind them showed through as hairlines. Inset, the edge falls on the photo.
        path.setAttribute("d", heroShape.path(heroShape.inset(pixels, 1.5)));
        center = windowCenter(pixels);
        // Grow from where the arms meet the upright: scaled about that point the opening always
        // stays inside the hero's window, so nothing behind it (the bright horizon) can show.
        const pivot = heroShape.pivot(pixels);
        gsap.set(path, { scale: 0, svgOrigin: `${pivot.x} ${pivot.y}` });
      };
      const onHome = Boolean(document.querySelector("[data-hero-window]"));

      const mm = gsap.matchMedia();
      mm.add(ALTAR_MOTION_OK, () => {
        const letters = el.querySelectorAll("[data-letter]");
        const tl = gsap.timeline({ onComplete: finish });
        tl.call(shapeOpening, [], 0)
          .fromTo(letters, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.15)
          .fromTo("[data-preloader-sub]", { opacity: 0, letterSpacing: "1.2em" }, { opacity: 1, letterSpacing: "0.55em", duration: 1.2, ease: "expo.out" }, 0.45)
          .to("[data-preloader-sub]", { opacity: 0, duration: 0.5, ease: "power2.in" }, 1.75)
          .call(shapeOpening, [], 1.8)
          .to(path, { scale: 1, duration: 1.15, ease: "expo.inOut" }, 1.85);
        if (onHome) {
          // ALTAR stays put while the window opens behind it: the hero's own letters sit in exactly the
          // same place, so when the green fades the hand-off is invisible.
          tl.to(el, { opacity: 0, duration: 0.6, ease: "power2.out" }, 2.9);
        } else {
          tl.to(letters, { opacity: 0, duration: 0.5, ease: "power2.in" }, 1.75);
          tl.to(path, { scale: () => (Math.max(width, height) / Math.min(center.width, center.height)) * 2.2, duration: 0.7, ease: "power3.in" }, 2.95)
            // A cross's corners never fill the screen by scaling alone: fade whatever green is left.
            .to(el, { opacity: 0, duration: 0.35, ease: "power1.out" }, 3.3);
        }
      });

      return () => {
        clearTimeout(deadline);
        unlock();
        mm.revert();
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} aria-hidden data-surface="green" className="altar-preloader fixed inset-0 z-[60] bg-transparent text-cream">
      <svg className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <mask id="altar-preloader-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            <path ref={hole} fill="black" d="M0 0Z" />
          </mask>
        </defs>
        <rect width="100%" height="100%" className="fill-green" mask="url(#altar-preloader-mask)" />
      </svg>
      <HeroLetters>
        <span data-preloader-sub className="mt-[0.4em] mr-[-0.55em] font-sans text-[clamp(0.8rem,1.6vw,1.25rem)] font-normal tracking-[0.55em] opacity-0">
          MINISTRIES
        </span>
      </HeroLetters>
    </div>
  );
}
