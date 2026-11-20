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

export const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var m=window.matchMedia("(prefers-reduced-motion: no-preference)").matches;if(m)d.classList.add("motion");d.dataset.preloader=m&&!sessionStorage.getItem("${PRELOADER_KEY}")?"pending":"done"}catch(e){d.dataset.preloader="done"}})();`;

export function markPreloaderDone() {
  try {
    sessionStorage.setItem(PRELOADER_KEY, "1");
  } catch {
    // Private mode or blocked storage: the preloader simply plays again next visit.
  }
  document.documentElement.dataset.preloader = "done";
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}
