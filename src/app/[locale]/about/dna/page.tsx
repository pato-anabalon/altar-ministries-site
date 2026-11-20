import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getPage, getValues } from "@/lib/content";
import { capToLongestWord } from "@/lib/fitText";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/dna">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, href: "/about/dna", title: t("dna"), description: getPage("dna", locale).intro });
}

/** Our DNA: the six values, each given room as a large name and its line. */
export default async function DnaPage({ params }: PageProps<"/[locale]/about/dna">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("dna", locale);
  const values = getValues(locale);
  const t = await getTranslations("about");
  const nameSize = capToLongestWord("clamp(2.25rem, 1.2rem + 4vw, 4.5rem)", values.map((value) => value.name));

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} parent={{ href: "/about", label: t("parent") }} />
      <Section surface="green" aria-label={t("dna")}>
        <Container>
          <dl className="border-b border-rule">
            {values.map((value) => (
              <Reveal key={value.id} className="grid gap-4 border-t border-rule py-10 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:items-baseline md:gap-10">
                <dt className="pt-[0.2em] font-display leading-none uppercase" style={{ fontSize: nameSize }}>
                  {value.name}
                </dt>
                <dd className="type-lead measure text-muted">{value.description}</dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
