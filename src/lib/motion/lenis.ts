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
  if (instance) instance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
