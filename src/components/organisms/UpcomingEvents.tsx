import { getFormatter, getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { formatLocales, type Locale } from "@/i18n/routing";
import { getEvents, getPage } from "@/lib/content";

/** The next events (at most three), each with its day set large. Empty state when none. */
export async function UpcomingEvents({ locale }: { locale: Locale }) {
  const { upcoming } = getEvents(locale);
  const events = upcoming.slice(0, 3);
  const page = getPage("events", locale);
  const t = await getTranslations("home");
  const format = await getFormatter({ locale: formatLocales[locale] });

  return (
    <Section aria-labelledby="events-title">
      <Container>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Reveal>
            <h2 id="events-title" className="type-h2">
              {page.title}
            </h2>
          </Reveal>
          <Reveal>
            <TextLink href="/events" className="type-ui">
              {t("eventsCta")}
            </TextLink>
          </Reveal>
        </div>

        {events.length === 0 ? (
          <Reveal className="mt-12 border-t border-rule pt-8">
            <p className="type-lead text-muted">{t("noEvents")}</p>
          </Reveal>
        ) : (
          <ul className="mt-12 border-b border-rule sm:mt-16">
            {events.map((event) => {
              const start = new Date(event.start);
              return (
                <li key={event.id} className="border-t border-rule">
                  <Reveal className="grid gap-6 py-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-12 sm:py-10">
                    <time dateTime={event.start} className="flex items-baseline gap-3 sm:flex-col sm:gap-1">
                      <span className="pt-[0.2em] font-display text-6xl leading-none">{format.dateTime(start, { day: "numeric" })}</span>
                      <span className="type-ui uppercase">{format.dateTime(start, { month: "short", year: "numeric" })}</span>
                    </time>
                    <div className="grid content-start gap-3">
                      <h3 className="font-serif text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight">{event.title}</h3>
                      {event.precision === "datetime" && (
                        <p className="type-ui">{format.dateTime(start, { weekday: "long", hour: "numeric", minute: "2-digit" })}</p>
                      )}
                      {event.summary && <p className="type-body measure text-muted">{event.summary}</p>}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </Section>
  );
}
