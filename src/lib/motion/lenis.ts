import type Lenis from "lenis";

/**
 * The single Lenis instance (created by SmoothScroll). Overlays that lock the page (menu, modal)
 * pause it so wheel/touch input does not scroll the page behind them.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Pauses smooth scroll while an overlay is open; returns the function that resumes it. */
export function lockScroll(): () => void {
  instance?.stop();
  return () => instance?.start();
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

let keepScroll = false;

/** Marks the next URL change as in-page (a modal with its own URL): the page keeps its scroll. */
export function keepScrollOnNextRoute() {
  keepScroll = true;
}

/** Reads and clears the mark left by keepScrollOnNextRoute. */
export function takeKeepScroll() {
  const keep = keepScroll;
  keepScroll = false;
  return keep;
}
