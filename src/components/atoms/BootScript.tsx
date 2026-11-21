"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { applyBootState, BOOT_SCRIPT } from "@/lib/motion/preloader";

const noop = () => () => {};

/**
 * The boot script in <head> (html.motion, data-preloader) before first paint. It is rendered only in
 * the server HTML and during hydration, where it already exists: switching language remounts the
 * [locale] layout on the client, React would create a script that never runs (and warn), and
 * <html> would lose the state. There, the same state is applied before the hero lays out instead.
 */
export function BootScript() {
  const hydrating = useSyncExternalStore(noop, () => false, () => true);
  useLayoutEffect(applyBootState, []);
  return hydrating ? <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} /> : null;
}
