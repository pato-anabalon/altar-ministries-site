import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

/**
 * Site map (docs/PLAN-IMPLEMENTACION.md §3). Keys are the internal (English) routes used in code;
 * values are the public URL per locale. Phase 2 pages (give, opportunities, bookshop, our churches,
 * supporters) stay pending until the client supplies their material: rendered in development and on
 * the test site, 404 and out of the sitemap in production (`isPageLive`, lib/nav.ts `phase2Nav`).
 */
export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/visit": { en: "/visit", es: "/visitanos" },
    "/about": { en: "/about", es: "/nosotros" },
    "/about/history": { en: "/about/history", es: "/nosotros/historia" },
    "/about/dna": { en: "/about/dna", es: "/nosotros/adn" },
    "/about/leadership": { en: "/about/leadership", es: "/nosotros/liderazgo" },
    "/ministries": { en: "/ministries", es: "/ministerios" },
    "/ministries/[slug]": { en: "/ministries/[slug]", es: "/ministerios/[slug]" },
    "/community": { en: "/community", es: "/comunidad" },
    "/global": "/global",
    "/global/churches": { en: "/global/churches", es: "/global/iglesias" },
    "/global/supporters": { en: "/global/supporters", es: "/global/patrocinadores" },
    "/events": { en: "/events", es: "/eventos" },
    "/events/[slug]": { en: "/events/[slug]", es: "/eventos/[slug]" },
    "/resources": { en: "/resources", es: "/recursos" },
    "/resources/newsletters": { en: "/resources/newsletters", es: "/recursos/boletines" },
    "/resources/policies": { en: "/resources/policies", es: "/recursos/politicas" },
    "/contact": { en: "/contact", es: "/contacto" },
    "/give": { en: "/give", es: "/donar" },
    "/opportunities": { en: "/opportunities", es: "/oportunidades" },
    "/bookshop": { en: "/bookshop", es: "/libreria" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;

/** Locale used to format dates, times and numbers: New Zealand English for "en" (e.g. "4:00 pm"). */
export const formatLocales: Record<Locale, string> = { en: "en-NZ", es: "es" };
