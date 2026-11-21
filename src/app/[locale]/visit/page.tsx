import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { ContactForm } from "@/components/organisms/ContactForm";
import { ExperiencesList } from "@/components/organisms/ExperiencesList";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getExperiences, getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/visit">) {
  const locale = (await params).locale as Locale;
  const page = getPage("visit", locale);
  return pageMetadata({ locale, href: "/visit", title: page.title, description: page.intro });
}

/** Visit us: Sunday at a glance, every Experience, joining online, and a way to ask before coming. */
export default async function VisitPage({ params }: PageProps<"/[locale]/visit">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("visit", locale);
  const sunday = getExperiences(locale).find((experience) => experience.id === "sunday");
  const t = await getTranslations("visit");
  const tHeader = await getTranslations("header");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />

      <Section surface="green" aria-labelledby="visit-sunday">
        <Container>
          <h2 id="visit-sunday" className="sr-only">
            {t("sundayTitle")}
          </h2>
          <dl className="grid gap-10 sm:grid-cols-2 sm:gap-6">
            {[
              [page.coffeeTime, page.coffeeLabel],
              [page.startTime, page.startLabel],
            ].map(([time, label], index) => (
              <Reveal key={label} delay={index * 0.1} className="flex flex-col-reverse gap-3 border-t border-rule pt-6">
                <dt className="type-lead text-muted">{label}</dt>
                <dd className="pt-[0.2em] font-display text-[clamp(4.5rem,3rem+7vw,10rem)] leading-[0.9] uppercase">{time}</dd>
              </Reveal>
            ))}
          </dl>
          <Reveal className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
            {sunday?.details && <p className="type-lead measure">{sunday.details}</p>}
            <div className="grid content-start justify-items-start gap-4">
              <p className="type-body text-muted">
                {site.venue.name}
                <br />
                {site.venue.streetAddress}, {site.venue.suburb}
              </p>
              <Button externalHref={site.venue.mapsUrl} arrow>
                {t("directions")}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <ExperiencesList locale={locale} showCta={false} />

      <Section spacing="compact" aria-labelledby="visit-online">
        <Container>
          <Reveal className="grid gap-4 md:grid-cols-2 md:gap-16">
            <h2 id="visit-online" className="type-h2">
              {t("online")}
            </h2>
            <div className="grid content-start justify-items-start gap-4">
              <p className="type-body measure text-muted">{t("onlineText")}</p>
              <TextLink externalHref={site.streamUrl} className="type-ui">
                {tHeader("watchOnline")}
              </TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section surface="white" aria-labelledby="visit-questions">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="grid content-start justify-items-start gap-4 lg:col-span-4">
              <h2 id="visit-questions" className="type-h2">
                {t("questions")}
              </h2>
              <p className="type-body measure text-muted">{t("questionsText")}</p>
              <p className="flex flex-wrap gap-x-6 gap-y-2 type-ui">
                {site.phones.map((phone) => (
                  <TextLink key={phone.href} externalHref={phone.href}>
                    {phone.label}
                  </TextLink>
                ))}
                <TextLink externalHref={`mailto:${site.email}`}>{site.email}</TextLink>
              </p>
            </Reveal>
            <Reveal delay={0.1} className="relative lg:col-span-7 lg:col-start-6">
              {/* The form reads ?about= / ?topic=, which needs a Suspense boundary on a static page. */}
              <Suspense>
                <ContactForm defaultTopic="visit" />
              </Suspense>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
