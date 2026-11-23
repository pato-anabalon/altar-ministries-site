import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getPage, isPageLive } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/bookshop">) {
  const locale = (await params).locale as Locale;
  const page = getPage("bookshop", locale);
  return pageMetadata({ locale, href: "/bookshop", title: page.title, description: page.intro });
}

/**
 * Bookshop (phase 2): a placeholder until the client settles the model (catalogue only, orders by
 * message or online payments), which decides whether it needs a content schema or a shop.
 */
export default async function BookshopPage({ params }: PageProps<"/[locale]/bookshop">) {
  if (!isPageLive("bookshop")) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("bookshop", locale);
  const t = await getTranslations("bookshop");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro}>
        <Button href="/contact" variant="secondary">
          {tCommon("getInTouch")}
        </Button>
      </PageHeader>

      <Section surface="white" spacing="compact" aria-labelledby="bookshop-title">
        <Container>
          <h2 id="bookshop-title" className="sr-only">
            {page.title}
          </h2>
          <Reveal>
            <Placeholder label={t("pending")} ratio="auto" className="min-h-72" />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
