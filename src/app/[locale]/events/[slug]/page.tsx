import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import { eventBodies } from "@/content/events";
import { formatLocales, locales, type Locale } from "@/i18n/routing";
import { getEvent, getStaticSlugs } from "@/lib/content";
import { translateSlug } from "@/lib/content/slugs";
import { formatEventWhen } from "@/lib/events";
import { pageMetadata } from "@/lib/seo";

/** Every event in every language is prerendered (and rebuilt daily); any other slug is a 404. */
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = locales.includes(params.locale as Locale) ? (params.locale as Locale) : "en";
  return getStaticSlugs("events", locale).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/events/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const event = getEvent(slug, locale);
  if (!event) return {};
  const format = await getFormatter({ locale: formatLocales[locale] });
  return pageMetadata({
    locale,
    href: (target) => ({ pathname: "/events/[slug]", params: { slug: translateSlug("/events/[slug]", slug, target) } }),
    title: event.title,
    description: [formatEventWhen(format, event), event.summary].filter(Boolean).join(" · "),
  });
}

/** An event's page: when and where, its summary, and its long description when one is written. */
export default async function EventPage({ params }: PageProps<"/[locale]/events/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const event = getEvent(slug, locale);
  if (!event) notFound();
  const format = await getFormatter({ locale: formatLocales[locale] });
  const t = await getTranslations("events");
  const Body = eventBodies[event.id] ? (await eventBodies[event.id]![locale]()).default : null;

  return (
    <>
      <PageHeader title={event.title} intro={event.summary} parent={{ href: "/events", label: t("all") }} />
      <Section surface="white" spacing="compact">
        <Container>
          <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <dl className="grid content-start gap-6 lg:col-span-4">
              <div className="grid gap-1 border-t border-rule pt-5">
                <dt className="type-small text-muted">{t("when")}</dt>
                <dd className="type-lead">
                  <time dateTime={event.start}>{formatEventWhen(format, event)}</time>
                </dd>
              </div>
              {event.location && (
                <div className="grid gap-1 border-t border-rule pt-5">
                  <dt className="type-small text-muted">{t("where")}</dt>
                  <dd className="type-lead">{event.location}</dd>
                </div>
              )}
              <div className="pt-2">
                <Button href="/contact" arrow>
                  {t("askCta")}
                </Button>
              </div>
            </dl>
            {Body && (
              <div className="lg:col-span-7 lg:col-start-6">
                <Body />
              </div>
            )}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
