import { getFormatter, getTranslations } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { EventRow } from "@/components/molecules/EventRow";
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
            {events.map((event) => (
              <EventRow key={event.id} event={event} format={format} />
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
