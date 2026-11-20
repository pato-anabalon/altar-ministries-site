import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { NewsletterForm } from "@/components/organisms/NewsletterForm";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/resources/newsletters">) {
  const locale = (await params).locale as Locale;
  const page = getPage("newsletters", locale);
  return pageMetadata({ locale, href: "/resources/newsletters", title: page.title, description: page.intro });
}

/** Newsletter sign-up (Resend, with the editions' language and consent). */
export default async function NewslettersPage({ params }: PageProps<"/[locale]/resources/newsletters">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("newsletters", locale);
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} parent={{ href: "/resources", label: tNav("resources") }} />
      <Section surface="white" spacing="compact" aria-label={page.title}>
        <Container width="narrow">
          <Reveal className="relative">
            <NewsletterForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
