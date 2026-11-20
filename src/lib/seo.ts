import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

const ogLocales: Record<Locale, string> = { en: "en_NZ", es: "es_419" };

/**
 * Per-page metadata: title, description, canonical URL and hreflang alternates (both languages
 * plus x-default → English), and matching Open Graph fields. Dynamic routes pass `{ pathname, params }`.
 */
export function pageMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: Locale;
  href: Parameters<typeof getPathname>[0]["href"];
  title: string;
  description?: string;
}): Metadata {
  const url = (target: Locale) => `${site.url}${getPathname({ locale: target, href })}`;
  return {
    title,
    description,
    alternates: {
      canonical: url(locale),
      languages: { ...Object.fromEntries(locales.map((target) => [target, url(target)])), "x-default": url("en") },
    },
    openGraph: { title, description, url: url(locale), siteName: site.name, locale: ogLocales[locale], type: "website" },
  };
}
