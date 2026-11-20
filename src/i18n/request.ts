import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Dates and times (events, gatherings) are always Auckland time, whatever the server's zone.
    timeZone: "Pacific/Auckland",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
