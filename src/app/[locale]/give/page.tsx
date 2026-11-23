import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getCommunity, getPage, isPageLive } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/give">) {
  const locale = (await params).locale as Locale;
  const page = getPage("give", locale);
  return pageMetadata({ locale, href: "/give", title: page.title, description: page.intro });
}

/**
 * Give (phase 2): the ways to give wait for an approved donation method; what a gift can already
 * go towards (Kids Presents, with its receipt reference) comes from the community programmes.
 */
export default async function GivePage({ params }: PageProps<"/[locale]/give">) {
  if (!isPageLive("give")) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("give", locale);
  const towards = getCommunity(locale).filter((programme) => programme.id === "kids-presents");
  const t = await getTranslations("give");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro}>
        <Button href="/contact" variant="secondary">
          {tCommon("getInTouch")}
        </Button>
      </PageHeader>

      <Section surface="white" spacing="compact" aria-labelledby="give-ways">
        <Container>
          <Reveal>
            <h2 id="give-ways" className="type-h2">
              {t("waysTitle")}
            </h2>
          </Reveal>
          <Reveal className="mt-10">
            <Placeholder label={t("waysPending")} ratio="auto" className="min-h-72" />
          </Reveal>
        </Container>
      </Section>

      {towards.length > 0 && (
        <Section spacing="compact" aria-labelledby="give-towards">
          <Container>
            <Reveal>
              <h2 id="give-towards" className="type-h2">
                {t("towardsTitle")}
              </h2>
            </Reveal>
            <ul className="mt-10 border-b border-rule">
              {towards.map((programme) => (
                <li key={programme.id} className="border-t border-rule">
                  <Reveal className="grid gap-3 py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
                    <h3 className="type-h3">{programme.title}</h3>
                    <div className="grid content-start justify-items-start gap-4">
                      <p className="type-body measure text-muted">{programme.body}</p>
                      <TextLink href="/community" className="type-ui">
                        {t("seeCommunity")}
                      </TextLink>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
