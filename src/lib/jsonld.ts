import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

/**
 * Schema.org `Church` for search engines and assistants: name, address, contact, Instagram and the
 * weekly Sunday Experience. Only confirmed facts from `site`; nothing here is invented.
 */
export function churchJsonLd(locale: Locale, description: string) {
  const [suburb, city] = site.venue.suburb.split(", ");
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${site.url}/#church`,
    name: site.name,
    url: `${site.url}${getPathname({ locale, href: "/" })}`,
    description,
    inLanguage: ["en", "es"],
    logo: `${site.url}/images/logo/6-logo.png`,
    email: site.email,
    telephone: site.phones.map((phone) => phone.href.replace("tel:", "")),
    sameAs: [site.instagram],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.venue.streetAddress,
      addressLocality: suburb,
      addressRegion: city,
      addressCountry: "NZ",
    },
    event: {
      "@type": "Event",
      name: locale === "es" ? "Experiencia del domingo" : "Sunday Experience",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: site.venue.name,
        address: `${site.venue.streetAddress}, ${site.venue.suburb}, New Zealand`,
      },
      eventSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1W",
        byDay: "https://schema.org/Sunday",
        startTime: site.sunday.start,
        scheduleTimezone: "Pacific/Auckland",
      },
    },
  };
}

/** Serialises JSON-LD for a <script> tag, escaping `<` so content can never close the tag. */
export function jsonLdScript(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
