import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

/**
 * Site map (docs/PLAN-IMPLEMENTACION.md §3). Keys are the internal (English) routes used in code;
 * values are the public URL per locale. Phase 2 pages (give, opportunities, bookshop, our churches,
 * supporters) are added here only when they go live.
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
    "/global/missions": { en: "/global/missions", es: "/global/misiones" },
    "/global/community": { en: "/global/community", es: "/global/comunidad" },
    "/global/partners": { en: "/global/partners", es: "/global/aliados" },
    "/events": { en: "/events", es: "/eventos" },
    "/events/[slug]": { en: "/events/[slug]", es: "/eventos/[slug]" },
    "/resources": { en: "/resources", es: "/recursos" },
    "/resources/newsletters": { en: "/resources/newsletters", es: "/recursos/boletines" },
    "/resources/policies": { en: "/resources/policies", es: "/recursos/politicas" },
    "/contact": { en: "/contact", es: "/contacto" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
