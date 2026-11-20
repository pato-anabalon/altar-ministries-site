import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { EventRow } from "@/components/molecules/EventRow";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import { formatLocales, type Locale } from "@/i18n/routing";
import { getEvents, getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/** Rebuilt daily so events move from upcoming to past on their own. */
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<"/[locale]/events">) {
  const locale = (await params).locale as Locale;
  const page = getPage("events", locale);
  return pageMetadata({ locale, href: "/events", title: page.title, description: page.intro });
}

/** Events & conferences: what's coming up, then what has been. */
export default async function EventsPage({ params }: PageProps<"/[locale]/events">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("events", locale);
  const { upcoming, past } = getEvents(locale);
  const format = await getFormatter({ locale: formatLocales[locale] });
  const t = await getTranslations("events");
  const tHome = await getTranslations("home");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />

      <Section surface="white" aria-labelledby="events-upcoming">
        <Container>
          <Reveal>
            <h2 id="events-upcoming" className="type-h2">
              {t("upcoming")}
            </h2>
          </Reveal>
          {upcoming.length === 0 ? (
            <Reveal className="mt-10 border-t border-rule pt-8">
              <p className="type-lead text-muted">{tHome("noEvents")}</p>
            </Reveal>
          ) : (
            <ul className="mt-10 border-b border-rule">
              {upcoming.map((event) => (
                <EventRow key={event.id} event={event} format={format} />
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {past.length > 0 && (
        <Section spacing="compact" aria-labelledby="events-past">
          <Container>
            <Reveal>
              <h2 id="events-past" className="type-h2">
                {t("past")}
              </h2>
            </Reveal>
            <ul className="mt-10 border-b border-rule">
              {past.map((event) => (
                <EventRow key={event.id} event={event} format={format} past />
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
