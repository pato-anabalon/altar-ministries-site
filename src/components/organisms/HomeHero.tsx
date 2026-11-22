"use client";

import { useEffect, useRef } from "react";
import { getImageProps } from "next/image";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { HeroLetters } from "@/components/atoms/HeroLetters";
import { usePathname } from "@/i18n/navigation";
import { DEFAULT_WINDOW_PATH, heroShape, mixParams } from "@/lib/motion/windowShape";
import { alignCrossToGlyph, crossOnScreen, finalCrossTransform, mixTransforms, withCover } from "@/lib/motion/crossAlign";
import { measureGlyphBar } from "@/lib/motion/glyph";
import { ALTAR_MOTION_OK, gsap, registerAltarMotion, ScrollTrigger, useGSAP } from "@/lib/motion/register";

registerAltarMotion();

/** Art-directed pair: landscape source on wide screens, portrait source on phones. */
function artDirected(desktop: string, mobile: string, mobileSize: { width: number; height: number }) {
  const common = { alt: "", sizes: "100vw", fetchPriority: "high" as const, loading: "eager" as const };
  const { srcSet } = getImageProps({ ...common, src: desktop, width: 2752, height: 1536 }).props;
  const { srcSet: mobileSrcSet, ...img } = getImageProps({ ...common, src: mobile, ...mobileSize }).props;
  return { desktopSrcSet: srcSet, img: { ...img, srcSet: mobileSrcSet } };
}

const cross = artDirected("/images/hero/cross-desktop.jpg", "/images/hero/cross-mobile.jpg", { width: 864, height: 1536 });
const auckland = artDirected("/images/hero/auckland-desktop.jpg", "/images/hero/auckland-mobile.jpg", { width: 1536, height: 2752 });

// Kept alive so the browser holds them decoded until the hero mounts.
const warmed: HTMLImageElement[] = [];

/**
 * Loads and decodes the hero photos in the background on the other pages, once the page is idle,
 * so going back to Home does not show the hero empty (black, ALTAR only) while they download.
 */
export function HomeHeroWarmup() {
  const pathname = usePathname();
  const home = pathname === "/";

  useEffect(() => {
    if (home || warmed.length) return;
    const landscape = window.matchMedia("(min-aspect-ratio: 1/1)").matches;
    const warm = () => {
      for (const image of [auckland, cross]) {
        const img = new Image();
        img.sizes = "100vw";
        img.srcset = landscape ? image.desktopSrcSet! : image.img.srcSet!;
        img.decode().catch(() => {});
        warmed.push(img);
      }
    };
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 2000);
    return () => window.clearTimeout(id);
  }, [home]);

  return null;
}

function HeroPicture({ image, className, ...data }: { image: typeof cross; className?: string } & Record<`data-${string}`, boolean>) {
  return (
    <picture>
      <source media="(min-aspect-ratio: 1/1)" srcSet={image.desktopSrcSet} />
      {/* Plain <img> on purpose: art-directed <picture> built with getImageProps (next/image docs). */}
      <img {...image.img} alt="" className={className} {...data} />
    </picture>
  );
}

export type HomeHeroCopy = {
  title: string;
  intro: string;
  planVisit: string;
  watchOnline: string;
  scrollCue: string;
  streamUrl: string;
};

/**
 * Home hero, the second half of the Nodo signature (after AltarPreloader).
 * Layers: Auckland at dusk · ALTAR · an arch window onto the cross. Pinned while scrolling, the
 * letters part, the window (arch or cross, lib/motion/windowShape.ts) opens into a full-screen frame, Auckland fades and the
 * title with its calls to action rises. Without motion (reduced motion or no JS) the final frame
 * renders statically: full cross image, title and buttons (see .motion rules in globals.css).
 */
export function HomeHero({ copy }: { copy: HomeHeroCopy }) {
  const root = useRef<HTMLElement>(null);
  const clip = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const path = clip.current;
      if (!el || !path) return;

      const mm = gsap.matchMedia();
      // Orientation is a condition so crossing it (rotating a tablet) rebuilds the scene.
      mm.add({ motion: ALTAR_MOTION_OK, portrait: "(max-aspect-ratio: 1/1)" }, (context) => {
        if (!context.conditions?.motion) return;
        const [a1, l, t, a2, r] = gsap.utils.toArray<HTMLElement>("[data-letter]", el);
        const crossImage = el.querySelector<HTMLElement>("[data-hero-cross]");
        if (!t || !crossImage) return;

        // The tween only drives `opened` (0 → 1). The arch shape and the cross position are derived
        // from it and the current frame size on every update and every refresh, so resizes and
        // font loads can never leave them out of step.
        const arch = { opened: 0 };
        const easeOpen = gsap.parseEase("power2.inOut");
        let glyph = measureGlyphBar(t, el);
        const draw = () => {
          const width = el.clientWidth;
          const height = el.clientHeight;
          const k = easeOpen(arch.opened);

          // The window is anchored on the T as well: same stem, arms centred on its bar.
          path.setAttribute("d", heroShape.path(mixParams(heroShape.start(width, height, glyph), heroShape.full, k)));

          // Start: the cross photo moved and scaled so the cross sits exactly on the T.
          // End: the plain frame (lifted above the title on phones).
          const cross = crossOnScreen(width, height);
          const transform = withCover(
            mixTransforms(alignCrossToGlyph(cross, glyph), finalCrossTransform(width, height, cross), k),
            width,
            height,
            cross,
            k,
          );
          gsap.set(crossImage, { transformOrigin: `${cross.x}px ${cross.y}px`, ...transform });
        };
        draw();

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 1,
            onRefresh: () => {
              glyph = measureGlyphBar(t, el);
              draw();
            },
          },
        });

        tl.to(arch, { opened: 1, duration: 0.75, onUpdate: draw }, 0)
          .to("[data-hero-bg]", { scale: 1.08, opacity: 0.25, duration: 0.75 }, 0)
          // Letters part outward by multiples of their own width (they already scale with the viewport).
          .to([a1, l], { xPercent: -160, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
          .to([a2, r], { xPercent: 160, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
          // The T sinks with the cross as the photo settles into its own frame.
          .to(t ?? [], { yPercent: 30, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
          .to("[data-hero-cue]", { opacity: 0, duration: 0.08 }, 0)
          .to("[data-hero-scrim]", { opacity: 1, duration: 0.25 }, 0.6)
          .fromTo("[data-hero-copy] > *", { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, stagger: 0.04, ease: "power2.out" }, 0.74);

        // Mon Cheri changes the letters' width once loaded: re-measure the pinned scene.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    // Large viewport height: when a phone's browser bars collapse on scroll the pinned hero still
    // fills the screen (with svh a strip of the next section showed below it). Bottom-anchored
    // content is lifted by the bars' height so it stays visible while they are shown.
    <section ref={root} data-surface="ink" data-header-overlay aria-labelledby="home-title" className="relative h-lvh overflow-hidden">
      <div data-hero-bg className="absolute inset-0 will-change-transform">
        <HeroPicture image={auckland} className="size-full object-cover" />
      </div>

      <div data-hero-window className="altar-hero-window absolute inset-0">
        <HeroPicture image={cross} data-hero-cross className="size-full object-cover will-change-transform" />
        <div
          data-hero-scrim
          className="altar-hero-scrim absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.72),rgb(0_0_0/0.35)_45%,transparent_75%)]"
        />
      </div>

      {/* In front of the arch window: the cross behind is aligned to the T. */}
      <HeroLetters className="altar-hero-letters text-cream" />

      <svg aria-hidden className="absolute size-0">
        <defs>
          <clipPath id="altar-hero-arch" clipPathUnits="objectBoundingBox">
            <path ref={clip} d={DEFAULT_WINDOW_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="absolute inset-x-0 bottom-[calc(100lvh-100svh)] pb-14 sm:pb-20">
        <Container>
          {/* Kept to the left column so the cross at the centre of the frame stays clear. */}
          <div data-hero-copy className="altar-hero-copy grid justify-items-start gap-6 portrait:max-w-xl landscape:max-w-[min(40rem,44vw)]">
            <h1 id="home-title" className="type-h1">
              {copy.title}
            </h1>
            <p className="type-lead measure text-muted">{copy.intro}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/visit" size="lg" arrow>
                {copy.planVisit}
              </Button>
              <Button variant="secondary" size="lg" externalHref={copy.streamUrl} arrow>
                {copy.watchOnline}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <div data-hero-cue aria-hidden className="altar-hero-cue absolute inset-x-0 bottom-[calc(100lvh-100svh+1.5rem)] flex flex-col items-center gap-3 type-small text-cream">
        <span>{copy.scrollCue}</span>
        <span className="altar-scroll-line h-10 w-px bg-current" />
      </div>
    </section>
  );
}
