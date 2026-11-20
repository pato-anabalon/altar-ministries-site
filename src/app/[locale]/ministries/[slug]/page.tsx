import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { MinistryDetail } from "@/components/organisms/MinistryDetail";
import { PageHeader } from "@/components/organisms/PageHeader";
import { locales, type Locale } from "@/i18n/routing";
import { getMinistry, getStaticSlugs } from "@/lib/content";
import { translateSlug } from "@/lib/content/slugs";
import { pageMetadata } from "@/lib/seo";

/** Every ministry in every language is prerendered; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = locales.includes(params.locale as Locale) ? (params.locale as Locale) : "en";
  return getStaticSlugs("ministries", locale).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/ministries/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const ministry = getMinistry(slug, locale);
  if (!ministry) return {};
  const t = await getTranslations({ locale, namespace: "ministries" });
  return pageMetadata({
    locale,
    href: (target) => ({ pathname: "/ministries/[slug]", params: { slug: translateSlug("/ministries/[slug]", slug, target) } }),
    title: ministry.name,
    description: ministry.summary ?? t("pending"),
  });
}

/** A ministry's own page, for direct links and shares (the grid shows the same content in a modal). */
export default async function MinistryPage({ params }: PageProps<"/[locale]/ministries/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const ministry = getMinistry(slug, locale);
  if (!ministry) notFound();
  const t = await getTranslations("ministries");

  return (
    <>
      <PageHeader title={ministry.name} parent={{ href: "/ministries", label: t("all") }} />
      <Section surface="white" spacing="compact">
        <Container width="narrow">
          <MinistryDetail ministry={ministry} labels={{ pending: t("pending"), askCta: t("askCta"), photo: t("photo", { name: ministry.name }) }} />
        </Container>
      </Section>
    </>
  );
}
