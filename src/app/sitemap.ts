import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { locales, routing, type AppPathname, type Locale } from "@/i18n/routing";
import { getStaticSlugs, isPageLive } from "@/lib/content";
import { translateSlug } from "@/lib/content/slugs";
import { phase2Nav } from "@/lib/nav";
import { site } from "@/lib/site";

type Href = Parameters<typeof getPathname>[0]["href"];

/** One entry per page in English, with every language as an hreflang alternate (x-default → English). */
function entry(href: (locale: Locale) => Href): MetadataRoute.Sitemap[number] {
  const url = (locale: Locale) => `${site.url}${getPathname({ locale, href: href(locale) })}`;
  return {
    url: url("en"),
    alternates: { languages: { ...Object.fromEntries(locales.map((locale) => [locale, url(locale)])), "x-default": url("en") } },
  };
}

/** Bilingual sitemap: every static route (phase 2 pages once live) plus each published ministry and event. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pending = new Set<AppPathname>(phase2Nav.filter((item) => !isPageLive(item.key)).map((item) => item.href));
  const staticPaths = (Object.keys(routing.pathnames) as AppPathname[]).filter((pathname) => !pathname.includes("[") && !pending.has(pathname));
  const dynamic = (["ministries", "events"] as const).flatMap((collection) => {
    const pathname = `/${collection}/[slug]` as const;
    return getStaticSlugs(collection, "en").map((slug) =>
      entry((locale) => ({ pathname, params: { slug: translateSlug(pathname, slug, locale) } })),
    );
  });
  return [...staticPaths.map((pathname) => entry(() => pathname as Href)), ...dynamic];
}
