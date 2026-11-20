import { events } from "@/content/data/events";
import { ministries } from "@/content/data/ministries";
import type { AppPathname, Locale } from "@/i18n/routing";

/**
 * Translated slugs for dynamic routes, so the language switcher can take a visitor from
 * /en/ministries/youth to /es/ministerios/jovenes. Client-safe: plain data, no validation
 * (lib/content validates the same files at build time).
 */
const slugSets: Partial<Record<AppPathname, ReadonlyArray<{ slug: Record<Locale, string> }>>> = {
  "/ministries/[slug]": ministries,
  "/events/[slug]": events,
};

export function translateSlug(pathname: AppPathname, slug: string, to: Locale): string {
  const match = slugSets[pathname]?.find((item) => Object.values(item.slug).includes(slug));
  return match?.slug[to] ?? slug;
}
