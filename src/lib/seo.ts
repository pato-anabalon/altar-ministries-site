import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

const ogLocales: Record<Locale, string> = { en: "en_NZ", es: "es_419" };

/**
 * Per-page metadata: title, description, canonical URL and hreflang alternates (both languages
 * plus x-default → English), and matching Open Graph fields. Routes with translated slugs pass a
 * function so each language links to its own slug. A page's `openGraph` replaces the layout's, so
 * the share image (app/[locale]/opengraph-image.tsx) is named here again.
 */
const shareImage = (locale: Locale) => ({ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: `${site.name} · Ponsonby, Auckland` });

type Href = Parameters<typeof getPathname>[0]["href"];

export function pageMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: Locale;
  href: Href | ((target: Locale) => Href);
  title: string;
  description?: string;
}): Metadata {
  const url = (target: Locale) => `${site.url}${getPathname({ locale: target, href: typeof href === "function" ? href(target) : href })}`;
  return {
    title,
    description,
    alternates: {
      canonical: url(locale),
      languages: { ...Object.fromEntries(locales.map((target) => [target, url(target)])), "x-default": url("en") },
    },
    openGraph: { title, description, url: url(locale), siteName: site.name, locale: ogLocales[locale], type: "website", images: [shareImage(locale)] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage(locale)] },
  };
}
