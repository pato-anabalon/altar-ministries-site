/**
 * Preloader state, once per browser session.
 *
 * An inline script in <head> (BOOT_SCRIPT) runs before first paint and sets:
 * - html.motion when the visitor allows motion (the hero then renders its animated start state);
 * - html[data-preloader] = "pending" | "done". CSS only shows the preloader while "pending", so
 *   without JavaScript, with reduced motion or on a second visit it never appears.
 */
export const PRELOADER_KEY = "altar-preloader-seen";
export const PRELOADER_DONE_EVENT = "altar:preloader-done";

/** Self-contained (it is serialised into BOOT_SCRIPT): only its argument and browser globals. */
function boot(key: string) {
  const html = document.documentElement;
  try {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (motion) html.classList.add("motion");
    html.dataset.preloader = motion && !sessionStorage.getItem(key) ? "pending" : "done";
  } catch {
    html.dataset.preloader = "done";
  }
}

export const BOOT_SCRIPT = `(${boot.toString()})(${JSON.stringify(PRELOADER_KEY)});`;

/** The same state applied from React, for when the layout remounts on the client (language switch). */
export function applyBootState() {
  if (!document.documentElement.dataset.preloader) boot(PRELOADER_KEY);
}

export function markPreloaderDone() {
  try {
    sessionStorage.setItem(PRELOADER_KEY, "1");
  } catch {
    // Private mode or blocked storage: the preloader simply plays again next visit.
  }
  document.documentElement.dataset.preloader = "done";
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}
