import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/resources/newsletters">) {
  const locale = (await params).locale as Locale;
  const page = getPage("newsletters", locale);
  return pageMetadata({ locale, href: "/resources/newsletters", title: page.title, description: page.intro });
}

/**
 * Newsletter. The sign-up form (Resend, with language choice and consent) arrives in milestone 8;
 * until then the page offers Instagram and email instead of a form that would not send.
 */
export default async function NewslettersPage({ params }: PageProps<"/[locale]/resources/newsletters">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("newsletters", locale);
  const t = await getTranslations("newsletter");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} parent={{ href: "/resources", label: tNav("resources") }} />
      <Section surface="green" spacing="compact" aria-label={page.title}>
        <Container>
          <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16">
            <p className="type-lead measure">{t("formSoon")}</p>
            <div className="flex flex-wrap gap-3">
              <Button externalHref={site.instagram} arrow>
                Instagram
              </Button>
              <Button externalHref={`mailto:${site.email}`} variant="secondary">
                {site.email}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
