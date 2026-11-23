import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getOpportunities, getPage, isPageLive } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/opportunities">) {
  const locale = (await params).locale as Locale;
  const page = getPage("opportunities", locale);
  return pageMetadata({ locale, href: "/opportunities", title: page.title, description: page.intro });
}

/** Opportunities (phase 2): approved openings and how to apply; a placeholder until the first one. */
export default async function OpportunitiesPage({ params }: PageProps<"/[locale]/opportunities">) {
  if (!isPageLive("opportunities")) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("opportunities", locale);
  const opportunities = getOpportunities(locale);
  const t = await getTranslations("opportunities");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro}>
        <Button href="/contact" variant="secondary">
          {tCommon("getInTouch")}
        </Button>
      </PageHeader>

      <Section surface="white" spacing="compact" aria-labelledby="opportunities-title">
        <Container>
          <h2 id="opportunities-title" className="sr-only">
            {page.title}
          </h2>
          {opportunities.length === 0 ? (
            <Reveal>
              <Placeholder label={t("pending")} ratio="auto" className="min-h-72" />
            </Reveal>
          ) : (
            <ul className="border-b border-rule">
              {opportunities.map((opportunity) => (
                <li key={opportunity.id} className="border-t border-rule">
                  <Reveal className="grid gap-4 py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
                    <h3 className="font-serif text-[clamp(1.625rem,1.2rem+1.4vw,2.5rem)] leading-tight">{opportunity.title}</h3>
                    <div className="grid content-start justify-items-start gap-5">
                      <p className="type-body measure text-muted">{opportunity.summary}</p>
                      {opportunity.applyUrl ? (
                        <Button externalHref={opportunity.applyUrl} arrow>
                          {tCommon("getInTouch")}
                        </Button>
                      ) : (
                        <Button href={{ pathname: "/contact", query: { about: opportunity.title } }} arrow>
                          {tCommon("getInTouch")}
                        </Button>
                      )}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
